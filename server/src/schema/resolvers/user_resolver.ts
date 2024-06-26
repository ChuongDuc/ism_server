import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import bcrypt from 'bcrypt';
import { IResolvers, ISalesReportRevenueByWeekResponse, ISalesReportRevenueByYearResponse, ISuccessResponse } from '../../__generated__/graphql';
import { ismDb, sequelize } from '../../loader/mysql';
import { SmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { MySQLError, PermissionError, UserAlreadyExistError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { generateJWT, USER_JWT } from '../../lib/utils/jwt';
import { iNotificationEventToValueResolve, iRoleToNumber, roleNumberToIRole } from '../../lib/resolver_enum';
import { BucketValue, DefaultHashValue, defaultPwReset, RoleList, StatusOrder } from '../../lib/enum';
import { userCreationAttributes } from '../../db_models/mysql/user';
import { minIOServices, pubsubService } from '../../lib/classes';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { NotificationEvent, PublishMessage } from '../../lib/classes/PubSubService';
import { getNextNDayFromDate } from '../../lib/utils/formatTime';

const user_resolver: IResolvers = {
    UserEdge: rdbEdgeResolver,

    UserConnection: rdbConnectionResolver,

    User: {
        role: (parent) => roleNumberToIRole(parent.role),
        fullName: (parent) => `${parent.lastName} ${parent.firstName}`,
    },
    Query: {
        me: async (_parent, _, context: SmContext) => {
            checkAuthentication(context);
            const { user } = context;
            if (user?.id) {
                return await ismDb.user.findByPk(user.id, {
                    rejectOnEmpty: new UserNotFoundError('Người dùng không tồn tại'),
                });
            }
            throw new UserNotFoundError();
        },

        // đăng nhập
        login: async (_parent, { input }) => {
            const { account, password } = input;

            // tìm kiếm người dùng
            const user = await ismDb.user.findOne({
                where: {
                    [Op.or]: {
                        userName: account,
                        phoneNumber: account,
                    },
                },
                rejectOnEmpty: new UserNotFoundError('Người dùng không tồn tại'),
            });

            // kiểm tra password
            const checkPassword = bcrypt.compareSync(password, user.password);
            if (!checkPassword) {
                throw new UserNotFoundError('Sai mật khẩu!!!');
            }
            if (!user.isActive) {
                throw new UserNotFoundError('Tài khoản không hoạt động!');
            }

            // trả về thông tin người dùng
            const userInfo: USER_JWT = {
                id: user.id,
                email: user.email,
                userName: user.userName,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                avatarURL: user.avatarURL,
                isActive: user.isActive,
                role: user.role,
            };

            const token = generateJWT(userInfo);
            return {
                user,
                token,
            };
        },

        // danh sách người dùng
        users: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { searchQuery, role, isActive, args } = input;

            const { limit, offset, limitForLast } = getRDBPaginationParams(args);

            const option: FindAndCountOptions<ismDb.user> = {
                limit,
                offset,
                order: [['id', 'DESC']],
            };
            const orWhereOpt: WhereOptions<ismDb.user> = {};
            const andWhereOpt: WhereOptions<ismDb.user> = {};

            if (searchQuery) {
                orWhereOpt['$user.firstName$'] = {
                    [Op.like]: `%${searchQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
                orWhereOpt['$user.lastName$'] = {
                    [Op.like]: `%${searchQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
                orWhereOpt['$user.phoneNumber$'] = {
                    [Op.like]: `%${searchQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (role) {
                andWhereOpt['$user.role$'] = {
                    [Op.eq]: `${iRoleToNumber(role)}`,
                };
            }
            if (isActive !== null && isActive !== undefined) {
                andWhereOpt['$user.isActive$'] = isActive;
            }
            option.where = searchQuery ? { [Op.and]: [{ ...{ [Op.or]: orWhereOpt } }, andWhereOpt] } : { ...andWhereOpt };

            const result = await ismDb.user.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },

        getUserById: async (_parent, { userId }, context: SmContext) => {
            checkAuthentication(context);
            return await ismDb.user.findByPk(userId, {
                rejectOnEmpty: new UserNotFoundError('Người dùng không tồn tại'),
            });
        },

        salesReportRevenueByWeek: async (_, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { saleId, startAt, endAt } = input;
            const arrayRevenueByWeek: ISalesReportRevenueByWeekResponse[] = [];

            const orderByWeek = await ismDb.order.findAll({
                where: {
                    saleId,
                    status: StatusOrder.done,
                    createdAt: { [Op.between]: [startAt, getNextNDayFromDate(endAt, 1)] },
                },
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

            const arrayTotalMoney = orderByWeek.map((order) => order.getTotalMoney());
            await Promise.all(arrayTotalMoney);

            for (let i = new Date(startAt); i <= new Date(endAt); i = getNextNDayFromDate(i, 1)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const weeklySales = orderByWeek.filter((order) => order.createdAt >= i && order?.createdAt <= getNextNDayFromDate(i, 1));

                const totalRevenue = weeklySales.reduce(
                    (sumRevenue, order) => sumRevenue + (order ? parseFloat(String(order.totalMoney)) : 0.0),
                    0.0
                );

                arrayRevenueByWeek.push({ date: i, totalRevenue });
            }

            return arrayRevenueByWeek;
        },

        salesReportRevenueByYear: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { saleId, startAt, endAt } = input;
            const arrayRevenueByYear: ISalesReportRevenueByYearResponse[] = [];

            const orderByYear = await ismDb.order.findAll({
                where: {
                    saleId,
                    status: StatusOrder.done,
                    createdAt: { [Op.between]: [startAt, getNextNDayFromDate(endAt, 1)] },
                },
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

            const arrayTotalMoney = orderByYear.map((order) => order.getTotalMoney());
            await Promise.all(arrayTotalMoney);

            for (let i = 0; i < 12; i += 1) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const yearlySales = orderByYear.filter((order) => order.createdAt.getMonth() === i);

                const totalRevenue = yearlySales.reduce(
                    (sumRevenue, order) => sumRevenue + (order ? parseFloat(String(order.totalMoney)) : 0.0),
                    0.0
                );

                arrayRevenueByYear.push({ month: i, totalRevenue });
            }

            return arrayRevenueByYear;
        },

        adminReportRevenueByMonth: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { startAt, endAt } = input;
            const arrayRevenueByMonth = [];

            const orderByMonth = await ismDb.order.findAll({
                where: {
                    status: StatusOrder.done,
                    createdAt: { [Op.between]: [startAt, endAt] },
                },
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

            const arrayTotalMoney = orderByMonth.map((order) => order.getTotalMoney());
            await Promise.all(arrayTotalMoney);

            const getAllSales = await ismDb.user.findAll({
                where: {
                    role: RoleList.sales,
                },
            });

            for (let i = 0; i < getAllSales.length; i += 1) {
                const monthlySales = orderByMonth.filter((order) => order.saleId === getAllSales[i].id);
                const totalOrder = monthlySales.length;
                const totalRevenue = monthlySales.reduce(
                    (sumRevenue, order) => sumRevenue + (order ? parseFloat(String(order.totalMoney)) : 0.0),
                    0.0
                );

                const fullName = `${getAllSales[i].lastName} ${getAllSales[i].firstName}`;

                arrayRevenueByMonth.push({ sale: fullName, totalRevenue, totalOrder });
            }

            return arrayRevenueByMonth;
        },
    },
    Mutation: {
        resetPassword: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director && context.user?.role !== RoleList.manager) {
                throw new PermissionError();
            }
            const { userId } = input;
            const adminGoingUpdatePw = await ismDb.user.findByPk(userId, {
                rejectOnEmpty: new UserNotFoundError(),
            });
            const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
            adminGoingUpdatePw.password = bcrypt.hashSync(defaultPwReset, salt);
            await adminGoingUpdatePw.save();
            return ISuccessResponse.Success;
        },
        // Tạo người dùng mới
        createUser: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            // kiểm tra role
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director && context.user?.role !== RoleList.manager) {
                throw new PermissionError();
            }
            const { userName, email, password, role, phoneNumber, firstName, lastName, avatar, address } = input;
            const emailCheck = email ? { email } : {};

            const createdUser = await ismDb.user.findOne({
                where: {
                    [Op.or]: [{ userName }, { phoneNumber }, emailCheck],
                },
                rejectOnEmpty: false,
            });
            if (createdUser) {
                throw new UserAlreadyExistError();
            }

            const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const userAttribute: userCreationAttributes = {
                email: email ?? undefined,
                userName,
                phoneNumber,
                password: hashedPassword,
                firstName,
                lastName,
                isActive: true,
                role: iRoleToNumber(role),
                address: address ?? 'Hà Nội',
            };

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const newUser = await ismDb.user.create(userAttribute, {
                        transaction: t,
                    });
                    console.log('avatar', avatar);
                    if (avatar) {
                        const { createReadStream, filename, mimetype } = await avatar;
                        console.log('createReadStream', filename);
                        const fileStream = createReadStream();
                        const filePath = `avatar/users/${newUser.id}/${filename}`;
                        await minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype);
                        newUser.avatarURL = filePath;
                        await newUser.save({ transaction: t });
                    }
                    return newUser;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        // Sửa thông tin người dùng
        updateUser: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director) {
                throw new PermissionError();
            }
            const { id, userName, email, role, phoneNumber, firstName, lastName, avatarURL, address, isActive, oldPassword, newPassword } = input;
            const user = await ismDb.user.findByPk(id, {
                rejectOnEmpty: new UserNotFoundError(),
            });

            if (userName) user.userName = userName;
            if (email) user.email = email;
            if (role) user.role = iRoleToNumber(role);
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (address) user.address = address;
            if (isActive !== null && isActive !== undefined) user.isActive = isActive;

            // đổi mật khẩu
            if (oldPassword && newPassword) {
                const checkPassword = bcrypt.compareSync(oldPassword, user.password);
                if (!checkPassword) {
                    throw new UserNotFoundError('Mật khẩu cũ không đúng');
                }
                const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
                user.password = bcrypt.hashSync(newPassword, salt);
            }

            const uploadAvatarProcess: Promise<string>[] = [];

            if (avatarURL) {
                const { createReadStream, filename, mimetype } = await avatarURL.file;
                if (user.avatarURL) {
                    const deletedOldAvatar = minIOServices.deleteObjects([user.avatarURL], BucketValue.DEVTEAM);
                    uploadAvatarProcess.push(deletedOldAvatar);
                }
                const fileStream = createReadStream();
                const filePath = `avatar/users/${id}/${filename}`;
                const uploadNewAvatar = minIOServices.upload(BucketValue.DEVTEAM, filePath, fileStream, mimetype);
                user.avatarURL = filePath;
                uploadAvatarProcess.push(uploadNewAvatar);
            }

            await user.save();

            if (uploadAvatarProcess.length) await Promise.all(uploadAvatarProcess);

            return ISuccessResponse.Success;
        },

        // Xóa người dùng
        deleteUser: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { ids } = input;
            if (context.user?.role !== RoleList.admin && context.user?.role !== RoleList.director) {
                throw new PermissionError();
            }
            const deleteUser = await ismDb.user.findAll({
                where: {
                    id: ids,
                },
            });

            if (deleteUser.length !== ids.length) throw new UserNotFoundError();

            deleteUser.forEach((e) => {
                if (!e.isActive) throw new Error('Người dùng không hợp lệ');
            });

            await sequelize.transaction(async (t: Transaction) => {
                try {
                    const allActive: Promise<ismDb.user>[] = [];

                    deleteUser.forEach((e) => {
                        if (e.role === RoleList.admin || e.role === RoleList.director) throw new MySQLError('Không được xóa admin hoặc giám đốc');
                        e.isActive = false;
                        allActive.push(e.save({ transaction: t }));
                    });

                    if (allActive.length > 0) {
                        await Promise.all(allActive);
                    }
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi trong khi xóa bản ghi user: ${error}`);
                }
            });

            return ISuccessResponse.Success;
        },
    },
    Subscription: {
        subscribeNotifications: {
            subscribe: (_parent, { input }) => {
                const { userId, excludingEvent } = input;
                const allEvent = Object.values(NotificationEvent);
                let filteredEvent: NotificationEvent[] = allEvent;
                if (excludingEvent) {
                    const childArray = excludingEvent.map((e) => iNotificationEventToValueResolve(e));
                    filteredEvent = allEvent.filter((item) => !childArray.includes(item));
                }
                return pubsubService.asyncIteratorByUser(userId, filteredEvent);
            },
            resolve: async (contextValue: PublishMessage) => ({
                message: contextValue.message,
                notification: contextValue.notification,
                order: contextValue.order,
            }),
        },
    },
};

export default user_resolver;
