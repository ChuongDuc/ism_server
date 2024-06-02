import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { isEmpty } from 'lodash';
import { IResolvers, IStatusOrder, ISuccessResponse } from '../../__generated__/graphql';
import { iStatusOrderToStatusOrder, IStatusOrderTypeResolve } from '../../lib/resolver_enum';
import { SmContext } from '../../server';
import { RoleList, StatusOrder } from '../../lib/enum';
import { checkAuthentication } from '../../lib/utils/permision';
import { MySQLError, OrderNotFoundError, PermissionError } from '../../lib/classes/graphqlErrors';
import { ismDb, sequelize } from '../../loader/mysql';
import { orderCreationAttributes } from '../../db_models/mysql/order';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { userNotificationCreationAttributes } from '../../db_models/mysql/userNotification';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { notificationCreationAttributes } from '../../db_models/mysql/notification';
import { getNextNDayFromDate } from '../../lib/utils/formatTime';

const order_resolver: IResolvers = {
    OrderEdge: rdbEdgeResolver,

    OrderConnection: rdbConnectionResolver,

    Order: {
        customer: async (parent) => parent.customer ?? (await parent.getCustomer()),

        sale: async (parent) => parent.sale ?? (await parent.getSale()),

        driver: async (parent) => parent.driver ?? (await parent.getDriver()),

        status: (parent) => (parent.status ? IStatusOrderTypeResolve(parent.status) : null),

        itemGroupList: async (parent) => parent.itemGroups ?? (await parent.getItemGroups()),

        paymentList: async (parent) => parent.paymentInfors ?? (await parent.getPaymentInfors()),

        deliverOrderList: async (parent) => parent.deliverOrders ?? (await parent.getDeliverOrders()),

        totalMoney: async (parent) => await parent.getTotalMoney(),

        remainingPaymentMoney: async (parent) => await parent.calculateRemainingPaymentMoney(),
    },

    Query: {
        filterAllOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { queryString, saleId, status, createAt, args } = input;

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
                        model: ismDb.user,
                        as: 'sale',
                        required: false,
                    },
                    {
                        model: ismDb.customer,
                        as: 'customer',
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
                    {
                        model: ismDb.deliverOrder,
                        as: 'deliverOrders',
                        required: false,
                    },
                ],
                distinct: true,
                order: [['id', 'DESC']],
            };

            const limitOption: FindAndCountOptions = {
                ...commonOption,
                limit,
                offset,
            };

            const whereOpt: WhereOptions<ismDb.order> = {};
            const whereOptNoStatus: WhereOptions<ismDb.order> = {};
            const whereOptCustomer: WhereOptions<ismDb.customer> = {};

            if (queryString) {
                whereOptCustomer['$customer.id$'] = {
                    [Op.in]: customerIdsList,
                };
            }

            if (saleId) {
                whereOpt['$order.saleId$'] = {
                    [Op.eq]: saleId,
                };
                whereOptNoStatus['$order.saleId$'] = {
                    [Op.eq]: saleId,
                };
            }

            if (createAt) {
                whereOpt['$order.createdAt$'] = {
                    [Op.between]: [createAt.startAt, getNextNDayFromDate(createAt.endAt, 1)],
                };
                whereOptNoStatus['$order.createdAt$'] = {
                    [Op.between]: [createAt.startAt, getNextNDayFromDate(createAt.endAt, 1)],
                };
            }

            if (status) {
                whereOpt['$order.status$'] = {
                    [Op.eq]: iStatusOrderToStatusOrder(status),
                };
            }

            limitOption.where = isEmpty(whereOptCustomer)
                ? whereOpt
                : {
                      [Op.and]: whereOpt,
                      [Op.or]: whereOptCustomer,
                  };

            const result = await ismDb.order.findAndCountAll(limitOption);

            const orderConnection = convertRDBRowsToConnection(result, offset, limitForLast);

            commonOption.where = isEmpty(whereOptCustomer)
                ? whereOptNoStatus
                : {
                      [Op.and]: whereOptNoStatus,
                      [Op.or]: whereOptCustomer,
                  };

            const allOrder = await ismDb.order.findAll(commonOption);

            const totalOrderPromise = allOrder.map((order) => order.getTotalMoney());

            await Promise.all(totalOrderPromise);

            const totalRevenue = allOrder.reduce(
                (sumRevenue, orderDetail) => sumRevenue + (orderDetail ? parseFloat(String(orderDetail.totalMoney)) : 0.0),
                0.0
            );
            const allOrderCounter = allOrder.length;
            const creatNewOrderCounter = allOrder.filter((e) => e.status === StatusOrder.creatNew).length;
            const priceQuotationOrderCounter = allOrder.filter((e) => e.status === StatusOrder.priceQuotation).length;
            const createExportOrderCounter = allOrder.filter((e) => e.status === StatusOrder.createExportOrder).length;
            const successDeliveryOrderCounter = allOrder.filter((e) => e.status === StatusOrder.successDelivery).length;
            const paymentConfirmationOrderCounter = allOrder.filter((e) => e.status === StatusOrder.paymentConfirmation).length;

            const orderCompleted = allOrder.filter((e) => e.status === StatusOrder.done);
            const doneOrderCounter = orderCompleted.length;
            const totalCompleted = orderCompleted.reduce(
                (sumCompleted, orderDetail) => sumCompleted + (orderDetail ? parseFloat(String(orderDetail.totalMoney)) : 0.0),
                0.0
            );
            const orderPaid = allOrder.filter((e) => e.status === StatusOrder.paid);
            const paidOrderCounter = orderPaid.length;
            const totalPaid = orderPaid.reduce(
                (sumPaid, orderDetail) => sumPaid + (orderDetail ? parseFloat(String(orderDetail.totalMoney)) : 0.0),
                0.0
            );
            const orderDeliver = allOrder.filter((e) => e.status === StatusOrder.delivery);
            const deliveryOrderCounter = orderDeliver.length;
            const totalDeliver = orderDeliver.reduce(
                (sumDeliver, orderDetail) => sumDeliver + (orderDetail ? parseFloat(String(orderDetail.totalMoney)) : 0.0),
                0.0
            );

            return {
                orders: orderConnection,
                totalRevenue,
                totalCompleted,
                totalPaid,
                totalDeliver,
                allOrderCounter,
                creatNewOrderCounter,
                priceQuotationOrderCounter,
                createExportOrderCounter,
                deliveryOrderCounter,
                successDeliveryOrderCounter,
                paymentConfirmationOrderCounter,
                paidOrderCounter,
                doneOrderCounter,
            };
        },

        getOrderById: async (_parent, { id }, context: SmContext) => {
            checkAuthentication(context);
            return await ismDb.order.findByPk(id, {
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
                    {
                        model: ismDb.deliverOrder,
                        as: 'deliverOrders',
                        required: false,
                    },
                ],
                rejectOnEmpty: new OrderNotFoundError(),
            });
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

            const { customerId, saleId, VAT, discount } = input;

            const invoiceNo = await ismDb.order.invoiceNoOrderName(saleId);

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const orderAttribute: orderCreationAttributes = {
                        customerId,
                        saleId,
                        invoiceNo,
                        VAT: VAT ?? undefined,
                        discount: discount ?? undefined,
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
                            {
                                model: ismDb.deliverOrder,
                                as: 'deliverOrders',
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
            const { orderId, customerId, saleId, VAT, discount, status, driver } = input;

            const orderUpdate = await ismDb.order.findByPk(orderId, {
                rejectOnEmpty: new OrderNotFoundError(),
            });

            if (customerId) {
                orderUpdate.customerId = customerId;
            }
            if (saleId) {
                orderUpdate.saleId = saleId;
            }
            if (VAT) {
                orderUpdate.VAT = VAT;
            }
            if (discount) {
                orderUpdate.discount = discount;
            }
            if (status) {
                orderUpdate.status = iStatusOrderToStatusOrder(status);
            }
            if (driver) {
                orderUpdate.driverId = driver;
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

        deleteOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.admin) {
                throw new PermissionError();
            }
            const { orderId } = input;
            const orderCurrent = await ismDb.order.findByPk(orderId, {
                rejectOnEmpty: new OrderNotFoundError('Không tìm thấy thông tin đơn hàng'),
                include: [
                    {
                        model: ismDb.user,
                        as: 'sale',
                        required: true,
                    },
                ],
            });
            if (orderCurrent.status === StatusOrder.done) {
                throw new PermissionError('Không thể xóa đơn hàng đã hoàn thành!');
            }
            // eslint-disable-next-line max-len
            const contentMessage = `Đơn hàng ${orderCurrent.invoiceNo} của ${orderCurrent.sale.lastName} ${orderCurrent.sale.firstName} bị xoá bởi ${context.user?.lastName} ${context.user?.firstName}!`;

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const itemGroups = await ismDb.itemGroup.findAll({
                        transaction: t,
                        where: {
                            orderId,
                        },
                        include: [
                            {
                                model: ismDb.orderDetail,
                                as: 'orderDetails',
                                required: false,
                            },
                        ],
                    });
                    const removeOrderDetail: Promise<number>[] = [];
                    itemGroups.forEach((itg) => {
                        const destroyOrderDetail = ismDb.orderDetail.destroy({
                            transaction: t,
                            where: {
                                itemGroupId: itg.id,
                            },
                        });
                        removeOrderDetail.push(destroyOrderDetail);
                    });
                    if (removeOrderDetail.length > 0) {
                        await Promise.all(removeOrderDetail);
                    }

                    await ismDb.itemGroup.destroy({
                        transaction: t,
                        where: {
                            orderId,
                        },
                    });

                    const notifications = await ismDb.notification.findAll({
                        transaction: t,
                        where: {
                            orderId,
                        },
                        include: [
                            {
                                model: ismDb.userNotification,
                                as: 'userNotifications',
                                required: false,
                            },
                        ],
                    });
                    const removeUserNotificationsProcess: Promise<number>[] = [];
                    notifications.forEach((notification) => {
                        const destroyUserNotification = ismDb.userNotification.destroy({
                            transaction: t,
                            where: {
                                notificationId: notification.id,
                            },
                        });
                        removeUserNotificationsProcess.push(destroyUserNotification);
                    });
                    if (removeUserNotificationsProcess.length > 0) {
                        await Promise.all(removeUserNotificationsProcess);
                    }

                    await ismDb.notification.destroy({
                        transaction: t,
                        where: {
                            orderId,
                        },
                    });

                    await ismDb.paymentInfor.destroy({
                        transaction: t,
                        where: {
                            orderId,
                        },
                    });

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                            isActive: true,
                        },
                        attributes: ['id'],
                    });

                    const userIds = notificationForUsers.filter((us) => us.id !== context.user?.id).map((e) => e.id);

                    const notificationAttribute: notificationCreationAttributes = {
                        event: NotificationEvent.Common,
                        content: contentMessage,
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

                    if (userNotificationPromise.length > 0) {
                        await Promise.all(userNotificationPromise);
                    }

                    await orderCurrent.destroy({ transaction: t });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Xoá không thành công: ${error}`);
                }
            });
        },

        updateStatusOrderOfAccountant: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.accountant) {
                throw new PermissionError();
            }
            const { orderId, userId, statusOrder, deliverOrder } = input;

            const order = await ismDb.order.findByPk(orderId, {
                include: [
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
                            },
                        ],
                    },
                    {
                        model: ismDb.deliverOrder,
                        as: 'deliverOrders',
                        required: false,
                    },
                ],
                rejectOnEmpty: new OrderNotFoundError(),
            });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const updateDeliverOrderNote: Promise<ismDb.deliverOrder>[] = [];

                    const originalDeliverOrder = order.deliverOrders;

                    for (let n = 0; n < deliverOrder.length; n += 1) {
                        for (let i = 0; i < originalDeliverOrder.length; i += 1) {
                            if (originalDeliverOrder[i].id === deliverOrder[n].deliverOrderId) {
                                if (deliverOrder[n].receivingNote) {
                                    originalDeliverOrder[i].receivingNote = deliverOrder[n].receivingNote ?? originalDeliverOrder[i].receivingNote;
                                }
                                if (deliverOrder[n].cranesNote) {
                                    originalDeliverOrder[i].cranesNote = deliverOrder[n].cranesNote ?? originalDeliverOrder[i].cranesNote;
                                }
                                if (deliverOrder[n].documentNote) {
                                    originalDeliverOrder[i].documentNote = deliverOrder[n].documentNote ?? originalDeliverOrder[i].documentNote;
                                }
                                if (deliverOrder[n].otherNote) {
                                    originalDeliverOrder[i].otherNote = deliverOrder[n].otherNote ?? originalDeliverOrder[i].otherNote;
                                }

                                updateDeliverOrderNote.push(originalDeliverOrder[i].save({ transaction: t }));
                            }
                        }
                    }

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.admin, RoleList.director, RoleList.accountant, RoleList.sales],
                        },
                        attributes: ['id'],
                    });

                    const ids = notificationForUsers.map((e) => e.id);
                    const userIds = ids.filter((e) => e !== userId);

                    if (order.driverId) userIds.push(order.driverId);

                    const notificationAttribute: notificationCreationAttributes = {
                        orderId,
                        event: NotificationEvent.DeliverResolverUpdated,
                        content: order.customer.name
                            ? `Đơn hàng khách ${order.customer.name} vừa được ${iStatusOrderToStatusOrder(statusOrder)}`
                            : `Đơn hàng ${order.invoiceNo} vừa được ${iStatusOrderToStatusOrder(statusOrder)}`,
                    };

                    const notification: ismDb.notification = await ismDb.notification.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                    userIds.forEach((id) => {
                        const userNotificationAttribute: userNotificationCreationAttributes = {
                            userId: id,
                            notificationId: notification.id,
                            isRead: false,
                        };

                        const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    order.status = iStatusOrderToStatusOrder(statusOrder);

                    if (updateDeliverOrderNote.length > 0) await Promise.all(updateDeliverOrderNote);

                    await order.save({ transaction: t });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        updateStatusOrderForDriver: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (
                context.user?.role !== RoleList.driver &&
                context.user?.role !== RoleList.assistantDriver &&
                context.user?.role !== RoleList.transporterManager
            ) {
                throw new PermissionError();
            }
            const { orderId, userId, statusOrder, deliverOrder } = input;

            if (statusOrder !== IStatusOrder.SuccessDelivery && statusOrder !== IStatusOrder.Delivery) {
                throw new PermissionError('Bạn không có quyền cập nhật trạng thái này cho đơn hàng');
            }

            const order = await ismDb.order.findByPk(orderId, {
                include: [
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
                            },
                        ],
                    },
                    {
                        model: ismDb.deliverOrder,
                        as: 'deliverOrders',
                        required: false,
                    },
                ],
                rejectOnEmpty: new OrderNotFoundError(),
            });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const updateDeliverOrderNote: Promise<ismDb.deliverOrder>[] = [];

                    const originalDeliverOrder = order.deliverOrders;

                    for (let n = 0; n < deliverOrder.length; n += 1) {
                        for (let i = 0; i < originalDeliverOrder.length; i += 1) {
                            if (originalDeliverOrder[i].id === deliverOrder[n].deliverOrderId) {
                                if (deliverOrder[n].receivingNote) {
                                    originalDeliverOrder[i].receivingNote = deliverOrder[n].receivingNote ?? originalDeliverOrder[i].receivingNote;
                                }
                                if (deliverOrder[n].cranesNote) {
                                    originalDeliverOrder[i].cranesNote = deliverOrder[n].cranesNote ?? originalDeliverOrder[i].cranesNote;
                                }
                                if (deliverOrder[n].documentNote) {
                                    originalDeliverOrder[i].documentNote = deliverOrder[n].documentNote ?? originalDeliverOrder[i].documentNote;
                                }
                                if (deliverOrder[n].otherNote) {
                                    originalDeliverOrder[i].otherNote = deliverOrder[n].otherNote ?? originalDeliverOrder[i].otherNote;
                                }

                                updateDeliverOrderNote.push(originalDeliverOrder[i].save({ transaction: t }));
                            }
                        }
                    }

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.admin, RoleList.director, RoleList.accountant, RoleList.sales],
                        },
                        attributes: ['id'],
                    });

                    const ids = notificationForUsers.map((e) => e.id);

                    const userIds = ids.filter((e) => e !== userId);

                    const description = `Đơn hàng ${order.invoiceNo} vừa được cập nhật`;

                    order.status = iStatusOrderToStatusOrder(statusOrder);

                    const notificationAttribute: notificationCreationAttributes = {
                        orderId,
                        event: NotificationEvent.DeliverResolverUpdated,
                        content: description,
                    };

                    const notification: ismDb.notification = await ismDb.notification.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                    userIds.forEach((id) => {
                        const userNotificationAttribute: userNotificationCreationAttributes = {
                            userId: id,
                            notificationId: notification.id,
                            isRead: false,
                        };

                        const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    if (updateDeliverOrderNote.length > 0) await Promise.all(updateDeliverOrderNote);

                    await order.save({ transaction: t });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
    },
};

export default order_resolver;
