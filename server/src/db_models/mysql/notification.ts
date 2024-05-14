import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { order, orderId } from './order';
import type { userNotification, userNotificationId } from './userNotification';

export interface notificationAttributes {
    id: number;
    orderId?: number;
    event: string;
    content?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type notificationPk = 'id';
export type notificationId = notification[notificationPk];
export type notificationOptionalAttributes = 'id' | 'orderId' | 'content' | 'createdAt' | 'updatedAt';
export type notificationCreationAttributes = Optional<notificationAttributes, notificationOptionalAttributes>;

export class notification extends Model<notificationAttributes, notificationCreationAttributes> implements notificationAttributes {
    id!: number;

    orderId?: number;

    event!: string;

    content?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // notification hasMany userNotification via notificationId
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

    // notification belongsTo order via orderId
    order!: order;

    getOrder!: Sequelize.BelongsToGetAssociationMixin<order>;

    setOrder!: Sequelize.BelongsToSetAssociationMixin<order, orderId>;

    createOrder!: Sequelize.BelongsToCreateAssociationMixin<order>;

    static initModel(sequelize: Sequelize.Sequelize): typeof notification {
        return notification.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                orderId: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'order',
                        key: 'id',
                    },
                },
                event: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                content: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'notification',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_notification_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }],
                    },
                ],
            }
        );
    }
}
