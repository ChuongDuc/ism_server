import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { order, orderId } from './order';
import type { orderDetail, orderDetailId } from './orderDetail';

export interface itemGroupAttributes {
    id: number;
    orderId: number;
    description?: string;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type itemGroupPk = 'id';
export type itemGroupId = itemGroup[itemGroupPk];
export type itemGroupOptionalAttributes = 'id' | 'description' | 'name' | 'createdAt' | 'updatedAt';
export type itemGroupCreationAttributes = Optional<itemGroupAttributes, itemGroupOptionalAttributes>;

export class itemGroup extends Model<itemGroupAttributes, itemGroupCreationAttributes> implements itemGroupAttributes {
    id!: number;

    orderId!: number;

    description?: string;

    name?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // itemGroup hasMany orderDetail via itemGroupId
    orderDetails!: orderDetail[];

    getOrderDetails!: Sequelize.HasManyGetAssociationsMixin<orderDetail>;

    setOrderDetails!: Sequelize.HasManySetAssociationsMixin<orderDetail, orderDetailId>;

    addOrderDetail!: Sequelize.HasManyAddAssociationMixin<orderDetail, orderDetailId>;

    addOrderDetails!: Sequelize.HasManyAddAssociationsMixin<orderDetail, orderDetailId>;

    createOrderDetail!: Sequelize.HasManyCreateAssociationMixin<orderDetail>;

    removeOrderDetail!: Sequelize.HasManyRemoveAssociationMixin<orderDetail, orderDetailId>;

    removeOrderDetails!: Sequelize.HasManyRemoveAssociationsMixin<orderDetail, orderDetailId>;

    hasOrderDetail!: Sequelize.HasManyHasAssociationMixin<orderDetail, orderDetailId>;

    hasOrderDetails!: Sequelize.HasManyHasAssociationsMixin<orderDetail, orderDetailId>;

    countOrderDetails!: Sequelize.HasManyCountAssociationsMixin;

    // itemGroup belongsTo order via orderId
    order!: order;

    getOrder!: Sequelize.BelongsToGetAssociationMixin<order>;

    setOrder!: Sequelize.BelongsToSetAssociationMixin<order, orderId>;

    createOrder!: Sequelize.BelongsToCreateAssociationMixin<order>;

    static initModel(sequelize: Sequelize.Sequelize): typeof itemGroup {
        return itemGroup.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                orderId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'order',
                        key: 'id',
                    },
                },
                description: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                name: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'itemGroup',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_itemGroup_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }],
                    },
                ],
            }
        );
    }
}
