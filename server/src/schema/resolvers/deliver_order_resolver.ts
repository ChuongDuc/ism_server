import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { isEmpty } from 'lodash';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { SmContext } from '../../server';
import { ismDb, sequelize } from '../../loader/mysql';
import {
    AuthenticationError,
    DeliverOrderNotFoundError,
    MySQLError,
    OrderNotFoundError,
    PermissionError,
    UserNotFoundError,
} from '../../lib/classes/graphqlErrors';
import { deliverOrderCreationAttributes } from '../../db_models/mysql/deliverOrder';
import { RoleList, StatusOrder } from '../../lib/enum';
import { notificationCreationAttributes } from '../../db_models/mysql/notification';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { userNotificationCreationAttributes } from '../../db_models/mysql/userNotification';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { checkAuthentication } from '../../lib/utils/permision';

const deliver_order_resolver: IResolvers = {
    DeliverOrderEdge: rdbEdgeResolver,

    DeliverOrderConnection: rdbConnectionResolver,

    DeliverOrder: {
        order: async (parent) => parent.order ?? (await parent.getOrder()),

        customer: async (parent) => parent.customer ?? (await parent.getCustomer()),

        driver: async (parent) => parent.driver ?? (await parent.getDriver()),
    },

    Query: {
        listAllDeliverOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { driverId, queryString, saleId, status, args } = input;
            const { limit, offset, limitForLast } = getRDBPaginationParams(args);
            const customerList =
                queryString && queryString !== ''
                    ? await ismDb.customer.findAll({
                          attributes: ['id', 'name', 'phoneNumber', 'company'],
                          // subQuery: false,
                          where: {
                              [Op.or]: [
                                  { $phoneNumber$: { [Op.like]: `%${queryString}%` } },
                                  { $name$: { [Op.like]: `%${queryString}%` } },
                                  { $company$: { [Op.like]: `%${queryString}%` } },
                              ],
                          },
                      })
                    : [];
            const customerIdsList = customerList.map((customer) => customer.id);

            const commonOption: FindAndCountOptions = {
                include: [
                    {
                        model: ismDb.order,
                        as: 'order',
                        required: true,
                    },
                    {
                        model: ismDb.customer,
                        as: 'customer',
                        required: true,
                    },
                    {
                        model: ismDb.user,
                        as: 'driver',
                        required: false,
                    },
                ],
                order: [['id', 'DESC']],
            };

            const limitOption: FindAndCountOptions = {
                ...commonOption,
                limit,
                offset,
            };

            const whereOpt: WhereOptions<ismDb.deliverOrder> = {};
            const whereOptFilter: WhereOptions<ismDb.deliverOrder> = {};

            if (driverId) {
                whereOpt['$deliverOrder.driverId$'] = {
                    [Op.eq]: driverId,
                };
            }

            if (queryString) {
                whereOptFilter['$customer.id$'] = {
                    [Op.in]: customerIdsList,
                };
                whereOptFilter['$order.invoiceNo$'] = {
                    [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                };
                // whereOptFilter['$customer.name$'] = {
                //     [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                // };
                // whereOptFilter['$customer.phoneNumber$'] = {
                //     [Op.like]: `%${queryString.replace(/([\\%_])/, '\\$1')}%`,
                // };
            }

            if (saleId) {
                whereOpt['$order.saleId$'] = {
                    [Op.eq]: saleId,
                };
            }

            if (status) {
                if (status === StatusOrder.done || status === StatusOrder.creatNew) {
                    whereOpt['$order.status$'] = {
                        [Op.eq]: status,
                    };
                } else {
                    whereOpt['$order.status$'] = {
                        [Op.and]: [{ [Op.not]: StatusOrder.done }, { [Op.not]: StatusOrder.creatNew }],
                    };
                }
            }

            limitOption.where = isEmpty(whereOptFilter)
                ? whereOpt
                : {
                      [Op.and]: whereOpt,
                      [Op.or]: whereOptFilter,
                  };

            const result = await ismDb.deliverOrder.findAndCountAll(limitOption);
            const deliverOrderConnection = convertRDBRowsToConnection(result, offset, limitForLast);

            const whereOptNoStatus: WhereOptions<ismDb.deliverOrder> = whereOpt;
            if (status) delete whereOptNoStatus['$order.status$'];

            commonOption.where = isEmpty(whereOptFilter)
                ? whereOptNoStatus
                : {
                      [Op.and]: whereOptNoStatus,
                      [Op.or]: whereOptFilter,
                  };

            const allDeliverOrder = await ismDb.deliverOrder.findAll(commonOption);
            const allOrderCounter = allDeliverOrder.length;
            const creatNewOrderCounter = allDeliverOrder.filter((e) => e.order.status === StatusOrder.creatNew).length;
            const inProcessingCounter = allDeliverOrder.filter(
                (e) => e.order.status !== StatusOrder.creatNew && e.order.status !== StatusOrder.done
            ).length;
            const orderCompleted = allDeliverOrder.filter((e) => e.order.status === StatusOrder.done).length;

            return {
                deliverOrder: deliverOrderConnection,
                allOrderCounter,
                creatNewOrderCounter,
                inProcessingCounter,
                doneOrderCounter: orderCompleted,
            };
        },
    },

    Mutation: {
        createDeliverOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const {
                customerId,
                orderId,
                createById,
                driverId,
                deliveryDate,
                description,
                receivingNote,
                cranesNote,
                documentNote,
                otherNote,
                itemGroupsNotes,
            } = input;

            await ismDb.user.findByPk(createById, { rejectOnEmpty: new UserNotFoundError() });

            const order = await ismDb.order.findByPk(orderId, {
                include: [
                    {
                        model: ismDb.customer,
                        as: 'customer',
                        required: true,
                    },
                    {
                        model: ismDb.user,
                        as: 'driver',
                        required: false,
                    },
                    {
                        model: ismDb.paymentInfor,
                        as: 'paymentInfors',
                        required: false,
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
                            },
                        ],
                    },
                ],
                rejectOnEmpty: new OrderNotFoundError(),
            });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const deliverAttribute: deliverOrderCreationAttributes = {
                        customerId,
                        orderId,
                        driverId: driverId ?? undefined,
                        deliveryDate,
                        description: description ?? undefined,
                        receivingNote: receivingNote ?? undefined,
                        cranesNote: cranesNote ?? undefined,
                        documentNote: documentNote ?? undefined,
                        otherNote: otherNote ?? undefined,
                    };
                    const newDeliverOrder = await ismDb.deliverOrder.create(deliverAttribute, { transaction: t });

                    if (itemGroupsNotes && itemGroupsNotes.length > 0) {
                        const allUpdateProcess: Promise<ismDb.orderDetail>[] = [];
                        const originalItemGroups = order.itemGroups;
                        itemGroupsNotes.forEach((itemGrNote) => {
                            for (let i = 0; i < originalItemGroups.length; i += 1) {
                                if (originalItemGroups[i].id === itemGrNote.itemGroupId) {
                                    if (itemGrNote.detailListInput && itemGrNote.detailListInput.length > 0) {
                                        const originalOrderDetails = originalItemGroups[i].orderDetails;
                                        itemGrNote.detailListInput.forEach((orderDetailNote) => {
                                            for (let j = 0; j < originalOrderDetails.length; j += 1) {
                                                if (originalOrderDetails[j].id === orderDetailNote.orderDetailId) {
                                                    if (orderDetailNote.deliveryMethodNote) {
                                                        originalOrderDetails[j].deliveryMethodNote = orderDetailNote.deliveryMethodNote;
                                                    }
                                                    if (orderDetailNote.otherNote) {
                                                        originalOrderDetails[j].otherNote = orderDetailNote.otherNote;
                                                    }
                                                    allUpdateProcess.push(originalOrderDetails[j].save({ transaction: t }));
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                        await Promise.all(allUpdateProcess);
                    }
                    if (order.paymentInfors.length < 1) {
                        order.status = StatusOrder.createExportOrder;
                        await order.save({ transaction: t });
                    }

                    const notificationForUserIds = await ismDb.user
                        .findAll({
                            where: {
                                role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.transporterManager],
                            },
                            attributes: ['id'],
                        })
                        .then((users) => users.map((user) => user.id));

                    const notificationAttribute: notificationCreationAttributes = {
                        orderId,
                        event: NotificationEvent.OrderStatusChanged,
                        content: order.customer.name
                            ? `Đơn của khách: ${order.customer.name} đã được tạo phiếu xuất hàng`
                            : `Đơn hàng với mã đơn: ${order.invoiceNo} đã được tạo phiếu xuất hàng`,
                    };

                    const newNotificationForCreateNewDeliverOrder = await ismDb.notification.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                    notificationForUserIds.forEach((userId) => {
                        const userNotificationAttribute: userNotificationCreationAttributes = {
                            userId,
                            notificationId: newNotificationForCreateNewDeliverOrder.id,
                            isRead: false,
                        };

                        const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    return newDeliverOrder;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        updateDeliverOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { deliverOrderId, driverId, deliveryDate, description, receivingNote, cranesNote, documentNote, otherNote, itemGroupsNotes } =
                input;
            const { user } = context;

            const deliverOrder = await ismDb.deliverOrder.findByPk(deliverOrderId, {
                include: [
                    {
                        model: ismDb.order,
                        as: 'order',
                        required: true,
                        include: [
                            {
                                model: ismDb.itemGroup,
                                as: 'itemGroups',
                                required: false,
                                include: [
                                    {
                                        model: ismDb.orderDetail,
                                        as: 'orderDetails',
                                        required: false,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: ismDb.customer,
                        as: 'customer',
                        required: true,
                    },
                    {
                        model: ismDb.user,
                        as: 'driver',
                        required: false,
                    },
                ],
                rejectOnEmpty: new DeliverOrderNotFoundError(),
            });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    if (driverId) {
                        deliverOrder.driverId = driverId;
                    }
                    if (deliveryDate) {
                        deliverOrder.deliveryDate = deliveryDate;
                    }
                    if (description) {
                        deliverOrder.description = description;
                    }
                    if (receivingNote) {
                        deliverOrder.receivingNote = receivingNote;
                    }
                    if (cranesNote) {
                        deliverOrder.cranesNote = cranesNote;
                    }
                    if (documentNote) {
                        deliverOrder.documentNote = documentNote;
                    }
                    if (otherNote) {
                        deliverOrder.otherNote = otherNote;
                    }

                    await deliverOrder.save({ transaction: t });

                    if (itemGroupsNotes && itemGroupsNotes.length > 0) {
                        const allUpdateForUpdatingDeliverOrderProcess: Promise<ismDb.orderDetail>[] = [];
                        const originalItemGroups = deliverOrder.order.itemGroups;
                        itemGroupsNotes.forEach((itemGr) => {
                            for (let i = 0; i < originalItemGroups.length; i += 1) {
                                if (originalItemGroups[i].id === itemGr.itemGroupId) {
                                    if (itemGr.detailListInput && itemGr.detailListInput.length > 0) {
                                        const originalOrderDetails = originalItemGroups[i].orderDetails;
                                        itemGr.detailListInput.forEach((orderDetail) => {
                                            for (let j = 0; j < originalOrderDetails.length; j += 1) {
                                                if (originalOrderDetails[j].id === orderDetail.orderDetailId) {
                                                    if (orderDetail.deliveryMethodNote) {
                                                        originalOrderDetails[j].deliveryMethodNote = orderDetail.deliveryMethodNote;
                                                    }
                                                    if (orderDetail.otherNote) {
                                                        originalOrderDetails[j].otherNote = orderDetail.otherNote;
                                                    }
                                                    allUpdateForUpdatingDeliverOrderProcess.push(originalOrderDetails[j].save({ transaction: t }));
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                        await Promise.all(allUpdateForUpdatingDeliverOrderProcess);
                    }

                    if (!user?.id) {
                        throw new AuthenticationError('Không tìm thấy thông tin người dùng');
                    }

                    const notificationForUserIds = await ismDb.user
                        .findAll({
                            where: {
                                role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.transporterManager],
                            },
                            attributes: ['id'],
                        })
                        .then((users) => users.map((usr) => usr.id));

                    const notificationAttribute: notificationCreationAttributes = {
                        orderId: deliverOrder.orderId,
                        event: NotificationEvent.OrderStatusChanged,
                        content: `Đơn hàng ${deliverOrder?.order?.invoiceNo.slice(0, 19)} vừa được cập nhật lệnh xuất hàng.`,
                    };

                    const newNotificationForUpdatingDeliverOrder = await ismDb.notification.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                    notificationForUserIds.forEach((userId) => {
                        const userNotificationAttribute: userNotificationCreationAttributes = {
                            userId,
                            notificationId: newNotificationForUpdatingDeliverOrder.id,
                            isRead: false,
                        };

                        const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        deleteDeliverOrders: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director) {
                throw new PermissionError();
            }
            const { ids, deleteBy } = input;

            const deliverOrders = await ismDb.deliverOrder.findAll({
                where: { id: ids },
                include: [
                    {
                        model: ismDb.order,
                        as: 'order',
                        required: true,
                    },
                ],
            });
            if (deliverOrders.length !== ids.length && deliverOrders.length < 1) {
                throw new DeliverOrderNotFoundError();
            }

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    await ismDb.deliverOrder.destroy({
                        where: {
                            id: ids,
                        },
                        transaction: t,
                    });

                    const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.transporterManager],
                        },
                        attributes: ['id'],
                    });

                    const userIds: number[] = [];
                    notificationForUsers.forEach((e) => {
                        userIds.push(e.id);
                    });

                    for (let i = 0; i < deliverOrders.length; i += 1) {
                        const notificationAttribute: notificationCreationAttributes = {
                            orderId: deliverOrders[i].orderId,
                            event: NotificationEvent.OrderStatusChanged,
                            content: `Giao hàng cho đơn hàng ${deliverOrders[i].order.invoiceNo} vừa được xoá bởi ${deleteBy}`,
                        };

                        // eslint-disable-next-line no-await-in-loop
                        const createNotification = await ismDb.notification.create(notificationAttribute, { transaction: t });

                        userIds.forEach((userId) => {
                            const userNotificationAttribute: userNotificationCreationAttributes = {
                                userId,
                                notificationId: createNotification.id,
                                isRead: false,
                            };

                            const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                            userNotificationPromise.push(createUserNotification);
                        });
                    }

                    await Promise.all(userNotificationPromise);

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
    },
};

export default deliver_order_resolver;
