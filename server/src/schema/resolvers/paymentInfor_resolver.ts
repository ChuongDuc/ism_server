import { Transaction } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { SmContext } from '../../server';
import { sequelize, ismDb } from '../../loader/mysql';
import { MySQLError, OrderNotFoundError, PaymentInfoNotFoundError, PermissionError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { RoleList, StatusOrder } from '../../lib/enum';
import { notificationCreationAttributes } from '../../db_models/mysql/notification';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { userNotificationCreationAttributes } from '../../db_models/mysql/userNotification';
import { checkAuthentication } from '../../lib/utils/permision';
import { paymentInforCreationAttributes } from '../../db_models/mysql/paymentInfor';

const paymentInfoResolver: IResolvers = {
    PaymentInfor: {
        order: async (parent) => parent.order ?? (await parent.getOrder()),

        customer: async (parent) => parent.customer ?? (await parent.getCustomer()),

        id: (parent) => parent.id,
    },
    Mutation: {
        createPaymentInfo: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.accountant && context.user?.role !== RoleList.director && context.user?.role !== RoleList.sales) {
                throw new PermissionError();
            }

            const { createById, customerId, orderId, money, description } = input;

            await ismDb.user.findByPk(createById, { rejectOnEmpty: new UserNotFoundError() });

            const order = await ismDb.order.findByPk(orderId, {
                include: [
                    {
                        model: ismDb.customer,
                        as: 'customer',
                        required: false,
                    },
                ],
                rejectOnEmpty: new OrderNotFoundError(),
            });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const paymentInfoAttribute: paymentInforCreationAttributes = {
                        customerId,
                        orderId,
                        money,
                        description: description ?? undefined,
                    };

                    await ismDb.paymentInfor.create(paymentInfoAttribute, { transaction: t });

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const ids: number[] = [];

                    notificationForUsers.forEach((e) => {
                        ids.push(e.id);
                    });

                    const userIds = ids.filter((e) => e !== createById);

                    const notificationAttribute: notificationCreationAttributes = {
                        orderId,
                        event: NotificationEvent.Payment,
                        content: `Đơn hàng ${order.invoiceNo} đã được thanh toán ${money} VNĐ bởi ${
                            order.customer.name ?? order.customer.phoneNumber
                        }`,
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

                    order.status = StatusOrder.paid;
                    await order.save({ transaction: t });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        updatePaymentInfo: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.accountant && context.user?.role !== RoleList.director && context.user?.role !== RoleList.sales) {
                throw new PermissionError();
            }
            const { id, userId, customerId, orderId, money, description } = input;

            const paymentInfo = await ismDb.paymentInfor.findByPk(id, {
                include: [
                    {
                        model: ismDb.order,
                        as: 'order',
                        required: false,
                    },
                    {
                        model: ismDb.customer,
                        as: 'customer',
                        required: true,
                    },
                ],
                rejectOnEmpty: new PaymentInfoNotFoundError(),
            });

            const user = await ismDb.user.findByPk(userId, { rejectOnEmpty: new UserNotFoundError() });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    if (customerId) paymentInfo.customerId = customerId;
                    if (orderId) paymentInfo.orderId = orderId;
                    if (money) paymentInfo.money = money;
                    if (description) paymentInfo.description = description;

                    await paymentInfo.save({ transaction: t });

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const ids: number[] = [];

                    notificationForUsers.forEach((e) => {
                        ids.push(e.id);
                    });

                    const userIds = ids.filter((e) => e !== userId);

                    const notificationAttribute: notificationCreationAttributes = {
                        orderId: paymentInfo.orderId,
                        event: NotificationEvent.PaymentChanged,
                        content: `Thông tin thanh toán đơn hàng ${paymentInfo.order.invoiceNo} đã được sửa bởi ${user.lastName} ${user.firstName}`,
                    };

                    const createNotification = await ismDb.notification.create(notificationAttribute, { transaction: t });

                    const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                    userIds.forEach((uid) => {
                        const userNotificationAttribute: userNotificationCreationAttributes = {
                            userId: uid,
                            notificationId: createNotification.id,
                            isRead: false,
                        };

                        const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    paymentInfo.order.status = StatusOrder.paid;
                    await paymentInfo.order.save({ transaction: t });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
        deletePaymentInfo: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.accountant && context.user?.role !== RoleList.director && context.user?.role !== RoleList.sales) {
                throw new PermissionError();
            }
            const { ids, deleteBy } = input;

            const paymentInfos = await ismDb.paymentInfor.findAll({
                where: { id: ids },
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
                ],
            });
            if (paymentInfos.length !== ids.length && paymentInfos.length < 1) {
                throw new PaymentInfoNotFoundError();
            }

            const user = await ismDb.user.findByPk(deleteBy, { rejectOnEmpty: new UserNotFoundError() });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    await ismDb.paymentInfor.destroy({
                        where: {
                            id: ids,
                        },
                        transaction: t,
                    });

                    const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.sales, RoleList.admin, RoleList.director, RoleList.accountant],
                        },
                        attributes: ['id'],
                    });

                    const uid: number[] = [];

                    notificationForUsers.forEach((e) => {
                        uid.push(e.id);
                    });

                    const userIds = uid.filter((e) => e !== deleteBy);

                    const notificationAttribute: notificationCreationAttributes = {
                        orderId: paymentInfos[0].orderId,
                        event: NotificationEvent.PaymentChanged,
                        content: `Thông tin thanh toán đơn hàng ${paymentInfos[0].order.invoiceNo} của khách hàng ${
                            paymentInfos[0].customer.name ?? paymentInfos[0].customer.phoneNumber
                        } đã bị xoá bởi ${user.lastName} ${user.firstName}`,
                    };

                    const newNotification = await ismDb.notification.create(notificationAttribute, { transaction: t });

                    userIds.forEach((userId) => {
                        const userNotificationAttribute: userNotificationCreationAttributes = {
                            userId,
                            notificationId: newNotification.id,
                            isRead: false,
                        };

                        const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                        userNotificationPromise.push(createUserNotification);
                    });

                    await Promise.all(userNotificationPromise);

                    paymentInfos[0].order.status = StatusOrder.paid;
                    await paymentInfos[0].order.save({ transaction: t });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
    },
};

export default paymentInfoResolver;
