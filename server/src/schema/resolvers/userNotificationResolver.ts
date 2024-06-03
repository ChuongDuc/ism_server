import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { SmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { sequelize, ismDb } from '../../loader/mysql';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { MySQLError, UserNotFoundError, UserNotificationNotFoundError } from '../../lib/classes/graphqlErrors';

const userNotificationResolver: IResolvers = {
    UserNotificationEdge: rdbEdgeResolver,

    UserNotificationConnection: rdbConnectionResolver,

    UserNotification: {
        user: async (parent) => parent.user ?? (await parent.getUser()),

        notification: async (parent) => parent.notification ?? (await parent.getNotification()),
    },

    Query: {
        listUserNotification: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { userId, event, args } = input;

            await ismDb.user.findByPk(userId, { rejectOnEmpty: new UserNotFoundError() });

            const { limit, offset, limitForLast } = getRDBPaginationParams(args);
            const option: FindAndCountOptions<ismDb.userNotification> = {
                limit,
                offset,
                include: [
                    {
                        model: ismDb.user,
                        as: 'user',
                        required: false,
                    },
                    {
                        model: ismDb.notification,
                        as: 'notification',
                        required: true,
                        include: [
                            {
                                model: ismDb.order,
                                as: 'order',
                                required: false,
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
                                ],
                            },
                        ],
                    },
                ],
                distinct: true,
                order: [['id', 'DESC']],
            };

            const whereOpt: WhereOptions<ismDb.userNotification> = {};

            whereOpt['$userNotification.userId$'] = {
                [Op.eq]: userId,
            };
            if (event) {
                whereOpt['$notification.event$'] = {
                    [Op.eq]: event,
                };
            }

            option.where = whereOpt;

            const result = await ismDb.userNotification.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },

        listArrayUserNotification: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { userId, event, args } = input;

            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const option: FindAndCountOptions<ismDb.userNotification> = {
                limit,
                offset,
                include: [
                    {
                        model: ismDb.user,
                        as: 'user',
                        required: false,
                    },
                    {
                        model: ismDb.notification,
                        as: 'notification',
                        required: true,
                        include: [
                            {
                                model: ismDb.order,
                                as: 'order',
                                required: false,
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
                                ],
                            },
                        ],
                    },
                ],
                distinct: true,
                order: [['id', 'DESC']],
            };

            const option2: FindAndCountOptions<ismDb.userNotification> = {
                include: [
                    {
                        model: ismDb.user,
                        as: 'user',
                        required: false,
                    },
                    {
                        model: ismDb.notification,
                        as: 'notification',
                        required: true,
                        include: [
                            {
                                model: ismDb.order,
                                as: 'order',
                                required: false,
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
                                ],
                            },
                        ],
                    },
                ],
                distinct: true,
                order: [['id', 'DESC']],
            };

            const whereOpt: WhereOptions<ismDb.userNotification> = {};

            whereOpt['$userNotification.userId$'] = {
                [Op.eq]: userId,
            };
            if (event) {
                whereOpt['$notification.event$'] = {
                    [Op.eq]: event,
                };
            }

            option.where = whereOpt;
            option2.where = whereOpt;

            const count = await ismDb.userNotification.findAll(option2);
            const allUserNotification = await ismDb.userNotification.findAndCountAll(option);

            const notificationRows = allUserNotification?.rows.reduce(
                (uniqueList: ismDb.userNotification[], notification: ismDb.userNotification) => {
                    const orderId = notification.notification?.order?.id;
                    if (orderId && !uniqueList.some((item) => item.notification?.order?.id === orderId)) {
                        uniqueList.push(notification);
                    }
                    return uniqueList;
                },
                []
            );

            const countNotification = count.reduce((uniqueList: ismDb.userNotification[], notification: ismDb.userNotification) => {
                const orderId = notification.notification?.order?.id;
                if (orderId && !uniqueList.some((item) => item.notification?.order?.id === orderId)) {
                    uniqueList.push(notification);
                }
                return uniqueList;
            }, []);

            return convertRDBRowsToConnection({ rows: notificationRows, count: countNotification.length }, offset, limitForLast);
        },
    },
    Mutation: {
        updateStatusUserNotification: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { userNotificationIds, isRead } = input;

            const userNotification = await ismDb.userNotification.findAll({
                where: {
                    id: userNotificationIds,
                },
            });

            if (userNotification.length !== userNotificationIds.length) throw new UserNotificationNotFoundError();
            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    for (let i = 0; i < userNotification.length; i += 1) {
                        userNotification[i].isRead = isRead;
                        // eslint-disable-next-line no-await-in-loop
                        await userNotification[i].save({ transaction: t });
                    }

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Cập nhật không thành công: ${error}`);
                }
            });
        },
    },
};

export default userNotificationResolver;
