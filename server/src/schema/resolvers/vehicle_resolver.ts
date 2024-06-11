import { FindAndCountOptions, Op, Transaction, WhereOptions } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { iTypeVehicleToTypeVehicle, TypeVehicleToITypeVehicle } from '../../lib/resolver_enum';
import { SmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { ismDb, sequelize } from '../../loader/mysql';
import { RoleList } from '../../lib/enum';
import {
    DriverAlreadyExistError,
    LicensePlatesAlreadyExistError,
    MySQLError,
    PermissionError,
    UserNotFoundError,
    VehicleNotExistError,
} from '../../lib/classes/graphqlErrors';
import { vehicleCreationAttributes } from '../../db_models/mysql/vehicle';
import { notificationCreationAttributes } from '../../db_models/mysql/notification';
import { userNotificationCreationAttributes } from '../../db_models/mysql/userNotification';
import { NotificationEvent } from '../../lib/classes/PubSubService';

const vehicle_resolver: IResolvers = {
    VehicleEdge: rdbEdgeResolver,

    VehicleConnection: rdbConnectionResolver,

    Vehicle: {
        driver: async (parent) => parent.driver ?? (await parent.getDriver()),

        typeVehicle: (parent) => TypeVehicleToITypeVehicle(parent.typeVehicle),
    },

    Query: {
        listAllVehicle: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { stringQuery, driverId, typeVehicle, args } = input;
            const today = new Date();
            const thirtyDaysNext = new Date(today);
            thirtyDaysNext.setDate(today.getDate() + 30);

            const { limit, offset, limitForLast } = getRDBPaginationParams(args);
            let commonOption: FindAndCountOptions<ismDb.vehicle> = {
                include: [
                    {
                        model: ismDb.user,
                        as: 'driver',
                        required: false,
                    },
                ],
                order: [['id', 'DESC']],
                distinct: true,
            };

            if (driverId) {
                commonOption = {
                    subQuery: false,
                    include: [
                        {
                            model: ismDb.user,
                            as: 'driver',
                            required: false,
                        },
                    ],
                    order: [['id', 'DESC']],
                    distinct: true,
                };
            }

            const option: FindAndCountOptions<ismDb.vehicle> = {
                ...commonOption,
                limit,
                offset,
            };

            const whereOpt: WhereOptions<ismDb.vehicle> = {};
            if (stringQuery) {
                whereOpt.$licensePlates$ = {
                    [Op.like]: `%${stringQuery.replace(/([\\%_])/, '\\$1')}%`,
                };
            }

            if (typeVehicle) {
                whereOpt.$typeVehicle$ = {
                    [Op.eq]: iTypeVehicleToTypeVehicle(typeVehicle),
                };
            }

            if (driverId) {
                whereOpt.$driverId$ = driverId;
            }

            option.where = whereOpt;
            commonOption.where = whereOpt;
            const result = await ismDb.vehicle.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },

        listDriverUnselectedVehicle: async (_parent, _, context: SmContext) => {
            checkAuthentication(context);
            const allVehicles = await ismDb.vehicle.findAll();
            const driverSelected = allVehicles.map((e) => e.driverId);
            return await ismDb.user.findAll({ where: { id: { [Op.notIn]: driverSelected }, role: RoleList.driver } });
        },
    },

    Mutation: {
        createVehicle: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (
                context.user?.role !== RoleList.admin &&
                context.user?.role !== RoleList.director &&
                context.user?.role !== RoleList.transporterManager
            ) {
                throw new PermissionError();
            }
            const { createdById, driverId, typeVehicle, weight, licensePlates, note } = input;

            const checkExistDriver = await ismDb.vehicle.findOne({ where: { driverId }, rejectOnEmpty: false });
            const checkExistLicensePlates = await ismDb.vehicle.findOne({
                where: { licensePlates },
                rejectOnEmpty: false,
            });

            if (checkExistDriver) throw new DriverAlreadyExistError();
            if (checkExistLicensePlates) throw new LicensePlatesAlreadyExistError();

            const driver = await ismDb.user.findByPk(driverId, { rejectOnEmpty: new UserNotFoundError() });

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const vehiclesAttributes: vehicleCreationAttributes = {
                        driverId,
                        typeVehicle: iTypeVehicleToTypeVehicle(typeVehicle),
                        weight,
                        licensePlates,
                        note: note ?? undefined,
                    };

                    const newVehicle = await ismDb.vehicle.create(vehiclesAttributes, { transaction: t });

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.admin, RoleList.director, RoleList.transporterManager],
                        },
                        attributes: ['id'],
                    });

                    const ids = notificationForUsers.map((e) => e.id);

                    const userIds = ids.filter((e) => e !== createdById);

                    userIds.push(driverId);

                    const notificationAttribute: notificationCreationAttributes = {
                        event: NotificationEvent.NewVehicle,
                        content: `Xe, phương tiện của ${driver.firstName} ${driver.lastName} đã được tạo mới`,
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

                    return newVehicle;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        updateVehicle: async (_parent, { input }, context: SmContext) => {
            if (
                context.user?.role !== RoleList.admin &&
                context.user?.role !== RoleList.director &&
                context.user?.role !== RoleList.transporterManager
            ) {
                throw new PermissionError();
            }
            const { vehicleId, createdById, driverId, typeVehicle, weight, licensePlates, note } = input;

            const vehicle = await ismDb.vehicle.findByPk(vehicleId, {
                include: [
                    {
                        model: ismDb.user,
                        as: 'driver',
                        required: false,
                    },
                ],
                rejectOnEmpty: new VehicleNotExistError(),
            });

            if (driverId) {
                const checkExistDriver = await ismDb.vehicle.findOne({ where: { driverId }, rejectOnEmpty: false });
                if (checkExistDriver) throw new DriverAlreadyExistError();
                vehicle.driverId = driverId;
            }
            if (typeVehicle) vehicle.typeVehicle = iTypeVehicleToTypeVehicle(typeVehicle);
            if (weight) vehicle.weight = weight;
            if (licensePlates) {
                const checkExistLicensePlates = await ismDb.vehicle.findOne({
                    where: { licensePlates },
                    rejectOnEmpty: false,
                });
                if (checkExistLicensePlates) throw new LicensePlatesAlreadyExistError();

                vehicle.licensePlates = licensePlates;
            }

            if (note) vehicle.note = note;

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    await vehicle.save({ transaction: t });

                    const notificationForUsers = await ismDb.user.findAll({
                        where: {
                            role: [RoleList.admin, RoleList.director, RoleList.transporterManager],
                        },
                        attributes: ['id'],
                    });

                    const ids = notificationForUsers.map((e) => e.id);

                    const userIds = ids.filter((e) => e !== createdById);

                    userIds.push(vehicle.driverId);

                    const notificationAttribute: notificationCreationAttributes = {
                        event: NotificationEvent.NewVehicle,
                        content: `Xe, phương tiện của ${vehicle.driver.firstName} ${vehicle.driver.lastName} đã được sửa`,
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

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        deleteVehicle: async (_parent, { input }, context: SmContext) => {
            if (
                context.user?.role !== RoleList.admin &&
                context.user?.role !== RoleList.director &&
                context.user?.role !== RoleList.transporterManager
            ) {
                throw new PermissionError();
            }

            const { ids, deletedBy } = input;
            const user = await ismDb.user.findByPk(deletedBy, { rejectOnEmpty: new UserNotFoundError() });
            const vehicles = await ismDb.vehicle.findAll({
                where: {
                    id: ids,
                },
                include: [
                    {
                        model: ismDb.user,
                        as: 'driver',
                        required: false,
                    },
                ],
            });
            if (vehicles.length !== ids.length) {
                throw new VehicleNotExistError();
            }

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    await ismDb.vehicle.destroy({
                        where: {
                            id: ids,
                        },
                        transaction: t,
                    });

                    console.log(`Được xóa bởi ${user.lastName} ${user.firstName}`);

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },
    },
};

export default vehicle_resolver;
