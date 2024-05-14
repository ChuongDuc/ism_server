import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { notification, notificationId } from './notification';
import type { user, userId } from './user';

export interface userNotificationAttributes {
    id: number;
    userId: number;
    notificationId: number;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export type userNotificationPk = 'id';
export type userNotificationId = userNotification[userNotificationPk];
export type userNotificationOptionalAttributes = 'id' | 'createdAt' | 'updatedAt';
export type userNotificationCreationAttributes = Optional<userNotificationAttributes, userNotificationOptionalAttributes>;

export class userNotification extends Model<userNotificationAttributes, userNotificationCreationAttributes> implements userNotificationAttributes {
    id!: number;

    userId!: number;

    notificationId!: number;

    isRead!: boolean;

    createdAt?: Date;

    updatedAt?: Date;

    // userNotification belongsTo notification via notificationId
    notification!: notification;

    getNotification!: Sequelize.BelongsToGetAssociationMixin<notification>;

    setNotification!: Sequelize.BelongsToSetAssociationMixin<notification, notificationId>;

    createNotification!: Sequelize.BelongsToCreateAssociationMixin<notification>;

    // userNotification belongsTo user via userId
    user!: user;

    getUser!: Sequelize.BelongsToGetAssociationMixin<user>;

    setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

    static initModel(sequelize: Sequelize.Sequelize): typeof userNotification {
        return userNotification.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'user',
                        key: 'id',
                    },
                },
                notificationId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'notification',
                        key: 'id',
                    },
                },
                isRead: {
                    type: DataTypes.TINYINT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'userNotification',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_userNotification_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'userId' }],
                    },
                    {
                        name: 'fk_userNotification_2_idx',
                        using: 'BTREE',
                        fields: [{ name: 'notificationId' }],
                    },
                ],
            }
        );
    }
}
