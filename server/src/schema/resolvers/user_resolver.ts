import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import bcrypt from 'bcrypt';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { ismDb, sequelize } from '../../loader/mysql';
import { SmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { MySQLError, PermissionError, UserAlreadyExistError, UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { generateJWT, USER_JWT } from '../../lib/utils/jwt';
import { iRoleToNumber, roleNumberToIRole } from '../../lib/resolver_enum';
import { BucketValue, DefaultHashValue, RoleList } from '../../lib/enum';
import { userCreationAttributes } from '../../db_models/mysql/user';
import { minIOServices } from '../../lib/classes';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';

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
    },
    Mutation: {
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
                        await minIOServices.upload(BucketValue.DEVAPP, filePath, fileStream, mimetype);
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
                    const deletedOldAvatar = minIOServices.deleteObjects([user.avatarURL], BucketValue.DEVAPP);
                    uploadAvatarProcess.push(deletedOldAvatar);
                }
                const fileStream = createReadStream();
                const filePath = `avatar/users/${id}/${filename}`;
                const uploadNewAvatar = minIOServices.upload(BucketValue.DEVAPP, filePath, fileStream, mimetype);
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
};

export default user_resolver;
