import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { deliverOrder, deliverOrderId } from './deliverOrder';
import type { order, orderId } from './order';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';
import { userNotification } from './init-models';
import { userNotificationId } from './userNotification';

export interface userAttributes {
    id: number;
    email?: string;
    userName: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    address?: string;
    avatarURL?: string;
    isActive: boolean;
    role: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type userPk = 'id';
export type userId = user[userPk];
export type userOptionalAttributes = 'id' | 'email' | 'address' | 'avatarURL' | 'isActive' | 'role' | 'createdAt' | 'updatedAt';
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export type UserEdge = TRDBEdge<user>;
export type UserConnection = TRDBConnection<user>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
    id!: number;

    email?: string;

    userName!: string;

    password!: string;

    phoneNumber!: string;

    firstName!: string;

    lastName!: string;

    address?: string;

    avatarURL?: string;

    isActive!: boolean;

    role!: number;

    createdAt?: Date;

    updatedAt?: Date;

    // user hasMany deliverOrder via driverId
    deliverOrders!: deliverOrder[];

    getDeliverOrders!: Sequelize.HasManyGetAssociationsMixin<deliverOrder>;

    setDeliverOrders!: Sequelize.HasManySetAssociationsMixin<deliverOrder, deliverOrderId>;

    addDeliverOrder!: Sequelize.HasManyAddAssociationMixin<deliverOrder, deliverOrderId>;

    addDeliverOrders!: Sequelize.HasManyAddAssociationsMixin<deliverOrder, deliverOrderId>;

    createDeliverOrder!: Sequelize.HasManyCreateAssociationMixin<deliverOrder>;

    removeDeliverOrder!: Sequelize.HasManyRemoveAssociationMixin<deliverOrder, deliverOrderId>;

    removeDeliverOrders!: Sequelize.HasManyRemoveAssociationsMixin<deliverOrder, deliverOrderId>;

    hasDeliverOrder!: Sequelize.HasManyHasAssociationMixin<deliverOrder, deliverOrderId>;

    hasDeliverOrders!: Sequelize.HasManyHasAssociationsMixin<deliverOrder, deliverOrderId>;

    countDeliverOrders!: Sequelize.HasManyCountAssociationsMixin;

    // user hasMany order via saleId
    orders!: order[];

    getOrders!: Sequelize.HasManyGetAssociationsMixin<order>;

    setOrders!: Sequelize.HasManySetAssociationsMixin<order, orderId>;

    addOrder!: Sequelize.HasManyAddAssociationMixin<order, orderId>;

    addOrders!: Sequelize.HasManyAddAssociationsMixin<order, orderId>;

    createOrder!: Sequelize.HasManyCreateAssociationMixin<order>;

    removeOrder!: Sequelize.HasManyRemoveAssociationMixin<order, orderId>;

    removeOrders!: Sequelize.HasManyRemoveAssociationsMixin<order, orderId>;

    hasOrder!: Sequelize.HasManyHasAssociationMixin<order, orderId>;

    hasOrders!: Sequelize.HasManyHasAssociationsMixin<order, orderId>;

    countOrders!: Sequelize.HasManyCountAssociationsMixin;

    // user hasMany order via driverId
    driver_orders!: order[];

    getDriver_orders!: Sequelize.HasManyGetAssociationsMixin<order>;

    setDriver_orders!: Sequelize.HasManySetAssociationsMixin<order, orderId>;

    addDriver_order!: Sequelize.HasManyAddAssociationMixin<order, orderId>;

    addDriver_orders!: Sequelize.HasManyAddAssociationsMixin<order, orderId>;

    createDriver_order!: Sequelize.HasManyCreateAssociationMixin<order>;

    removeDriver_order!: Sequelize.HasManyRemoveAssociationMixin<order, orderId>;

    removeDriver_orders!: Sequelize.HasManyRemoveAssociationsMixin<order, orderId>;

    hasDriver_order!: Sequelize.HasManyHasAssociationMixin<order, orderId>;

    hasDriver_orders!: Sequelize.HasManyHasAssociationsMixin<order, orderId>;

    countDriver_orders!: Sequelize.HasManyCountAssociationsMixin;

    // user hasMany userNotification via userId
    userNotifications!: userNotification[];

    getUserNotifications!: Sequelize.HasManyGetAssociationsMixin<userNotification>;

    setUserNotifications!: Sequelize.HasManySetAssociationsMixin<userNotification, userNotificationId>;

    addUserNotification!: Sequelize.HasManyAddAssociationMixin<userNotification, userNotificationId>;

    addUserNotifications!: Sequelize.HasManyAddAssociationsMixin<userNotification, userNotificationId>;

    createUserNotification!: Sequelize.HasManyCreateAssociationMixin<userNotification>;

    removeUserNotification!: Sequelize.HasManyRemoveAssociationMixin<userNotification, userNotificationId>;

    removeUserNotifications!: Sequelize.HasManyRemoveAssociationsMixin<userNotification, userNotificationId>;

    hasUserNotification!: Sequelize.HasManyHasAssociationMixin<userNotification, userNotificationId>;

    hasUserNotifications!: Sequelize.HasManyHasAssociationsMixin<userNotification, userNotificationId>;

    countUserNotifications!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof user {
        return user.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                userName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                phoneNumber: {
                    type: DataTypes.STRING(11),
                    allowNull: false,
                },
                firstName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                lastName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                address: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                avatarURL: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: 1,
                },
                role: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
            },
            {
                sequelize,
                tableName: 'user',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                ],
            }
        );
    }
}
