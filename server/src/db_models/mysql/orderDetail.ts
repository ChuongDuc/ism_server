import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { itemGroup, itemGroupId } from './itemGroup';
import type { product, productId } from './product';

export interface orderDetailAttributes {
    id: number;
    itemGroupId: number;
    productId?: number;
    quantity?: number;
    priceProduct?: number;
    weightProduct?: number;
    totalWeight?: number;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type orderDetailPk = 'id';
export type orderDetailId = orderDetail[orderDetailPk];
export type orderDetailOptionalAttributes =
    | 'id'
    | 'productId'
    | 'quantity'
    | 'priceProduct'
    | 'weightProduct'
    | 'totalWeight'
    | 'description'
    | 'createdAt'
    | 'updatedAt';
export type orderDetailCreationAttributes = Optional<orderDetailAttributes, orderDetailOptionalAttributes>;

export class orderDetail extends Model<orderDetailAttributes, orderDetailCreationAttributes> implements orderDetailAttributes {
    id!: number;

    itemGroupId!: number;

    productId?: number;

    quantity?: number;

    priceProduct?: number;

    weightProduct?: number;

    totalWeight?: number;

    description?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // orderDetail belongsTo itemGroup via itemGroupId
    itemGroup!: itemGroup;

    getItemGroup!: Sequelize.BelongsToGetAssociationMixin<itemGroup>;

    setItemGroup!: Sequelize.BelongsToSetAssociationMixin<itemGroup, itemGroupId>;

    createItemGroup!: Sequelize.BelongsToCreateAssociationMixin<itemGroup>;

    // orderDetail belongsTo product via productId
    product!: product;

    getProduct!: Sequelize.BelongsToGetAssociationMixin<product>;

    setProduct!: Sequelize.BelongsToSetAssociationMixin<product, productId>;

    createProduct!: Sequelize.BelongsToCreateAssociationMixin<product>;

    static initModel(sequelize: Sequelize.Sequelize): typeof orderDetail {
        return orderDetail.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                itemGroupId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'itemGroup',
                        key: 'id',
                    },
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'product',
                        key: 'id',
                    },
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                priceProduct: {
                    type: DataTypes.DECIMAL(10, 0),
                    allowNull: true,
                },
                weightProduct: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                totalWeight: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                description: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'orderDetail',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_orderDetail_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'productId' }],
                    },
                    {
                        name: 'fk_orderDetail_2_idx',
                        using: 'BTREE',
                        fields: [{ name: 'itemGroupId' }],
                    },
                ],
            }
        );
    }
}
