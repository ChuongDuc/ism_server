import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { isEmpty } from 'lodash';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { iStatusOrderToStatusOrder, IStatusOrderTypeResolve } from '../../lib/resolver_enum';
import { SmContext } from '../../server';
import { RoleList, StatusOrder } from '../../lib/enum';
import { checkAuthentication } from '../../lib/utils/permision';
import { MySQLError, OrderNotFoundError, PermissionError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { ismDb, sequelize } from '../../loader/mysql';
import { orderAttributes, orderCreationAttributes } from '../../db_models/mysql/order';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { userNotificationCreationAttributes } from '../../db_models/mysql/userNotification';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { notificationCreationAttributes } from '../../db_models/mysql/notification';

const order_resolver: IResolvers = {
    OrderEdge: rdbEdgeResolver,

    OrderConnection: rdbConnectionResolver,

    Order: {
        customer: async (parent) => parent.customer ?? (await parent.getCustomer()),

        sale: async (parent) => parent.sale ?? (await parent.getSale()),

        status: (parent) => (parent.status ? IStatusOrderTypeResolve(parent.status) : null),

        itemGroupList: async (parent) => parent.itemGroups ?? (await parent.getItemGroups()),

        paymentList: async (parent) => parent.paymentInfors ?? (await parent.getPaymentInfors()),

        totalMoney: async (parent) => await parent.getTotalMoney(),

        remainingPaymentMoney: async (parent) => await parent.calculateRemainingPaymentMoney(),
    },

    Query: {
        filterAllOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { queryString, saleId, createAt, args } = input;

            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const option: FindAndCountOptions = {
                limit,
                offset,
                include: [
                    {
                        model: ismDb.user,
                        as: 'sale',
                        required: false,
                    },
                    {
                        model: ismDb.customer,
                        as: 'customer',
                        required: false,
                    },
                ],
                order: [['id', 'DESC']],
            };

            const whereOpt: WhereOptions = {};
            const orQueryWhereOpt: WhereOptions<orderAttributes> = {};

            if (queryString) {
                const arrCustomerId: number[] = [];
                const findCustomer = await ismDb.customer.findAll({
                    where: {
                        [Op.or]: [
                            { phoneNumber: { [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%` } },
                            { name: { [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%` } },
                        ],
                    },
                });

                if (findCustomer.length > 0) {
                    findCustomer.forEach((e) => {
                        arrCustomerId.push(e.id);
                    });

                    orQueryWhereOpt['$order.customerId$'] = {
                        [Op.in]: [arrCustomerId],
                    };
                }

                orQueryWhereOpt['$order.invoiceNo$'] = {
                    [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (saleId) {
                await ismDb.user.findOne({
                    where: {
                        id: saleId,
                        role: RoleList.sales,
                    },
                    rejectOnEmpty: new UserNotFoundError(),
                });
                whereOpt['$order.saleId$'] = {
                    [Op.eq]: saleId,
                };
            }

            if (createAt) {
                whereOpt['$order.createdAt$'] = {
                    [Op.between]: [createAt.startAt, createAt.endAt],
                };
            }

            option.where = isEmpty(orQueryWhereOpt)
                ? whereOpt
                : {
                      [Op.and]: whereOpt,
                      [Op.or]: orQueryWhereOpt,
                  };
            const result = await ismDb.order.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },
    },

    Mutation: {
        createOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (
                context.user?.role === RoleList.transporterManager ||
                context.user?.role === RoleList.driver ||
                context.user?.role === RoleList.assistantDriver
            ) {
                throw new PermissionError();
            }

            const { customerId, saleUserId, VAT } = input;

            const invoiceNo = await ismDb.order.invoiceNoOrderName(saleUserId);

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const orderAttribute: orderCreationAttributes = {
                        customerId,
                        saleId: saleUserId,
                        invoiceNo,
                        VAT: VAT ?? undefined,
                        status: StatusOrder.creatNew,
                        freightPrice: 0,
                    };

                    const newOrder = await ismDb.order.create(orderAttribute, {
                        transaction: t,
                        include: [
                            {
                                model: ismDb.user,
                                as: 'sale',
                                required: true,
                            },
                            {
                                model: ismDb.customer,
                                as: 'customer',
                                required: true,
                            },
                            {
                                model: ismDb.itemGroup,
                                as: 'itemGroups',
                                required: false,
                                include: [
                                    {
                                        model: ismDb.orderDetail,
                                        as: 'orderDetails',
                                        required: false,
                                        include: [
                                            {
                                                model: ismDb.product,
                                                as: 'product',
                                                required: false,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                model: ismDb.paymentInfor,
                                as: 'paymentInfors',
                                required: false,
                            },
                        ],
                    });

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const userIds = notificationForUsers.map((e) => e.id);

                    const notificationAttribute: notificationCreationAttributes = {
                        orderId: newOrder.id,
                        event: NotificationEvent.NewOrder,
                        content: `Đơn hàng ${invoiceNo} vừa được tạo mới`,
                    };

                    const notification: ismDb.notification = await ismDb.notification.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                    userIds.forEach((userId) => {
                        const userNotificationAttribute: userNotificationCreationAttributes = {
                            userId,
                            notificationId: notification.id,
                            isRead: false,
                        };

                        const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    return newOrder;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Tạo đơn hàng không thành công: ${error}`);
                }
            });
        },

        updateOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { orderId, customerId, saleUserId, VAT, status } = input;

            const orderUpdate = await ismDb.order.findByPk(orderId, {
                rejectOnEmpty: new OrderNotFoundError(),
            });

            if (customerId) {
                orderUpdate.customerId = customerId;
            }
            if (saleUserId) {
                orderUpdate.saleId = saleUserId;
            }
            if (VAT) {
                orderUpdate.VAT = VAT;
            }
            if (status) {
                orderUpdate.status = iStatusOrderToStatusOrder(status);
            }

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    await orderUpdate.save({ transaction: t });

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const userIds: number[] = [];
                    notificationForUsers.forEach((e) => {
                        userIds.push(e.id);
                    });

                    const notificationAttribute: notificationCreationAttributes = {
                        orderId,
                        event: NotificationEvent.OrderStatusChanged,
                        content: `Hoá đơn ${orderUpdate.invoiceNo} vừa được sửa`,
                    };

                    const createNotification = await ismDb.notification.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                    userIds.forEach((userId) => {
                        const userNotificationAttribute: userNotificationCreationAttributes = {
                            userId,
                            notificationId: createNotification.id,
                            isRead: false,
                        };

                        const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Cập nhật không thành công: ${error}`);
                }
            });
        },
    },
};

export default order_resolver;
