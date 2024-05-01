import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { categories, categoriesId } from './categories';
import type { orderDetail, orderDetailId } from './orderDetail';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface productAttributes {
    id: number;
    categoryId: number;
    name: string;
    code?: string;
    price: number;
    height: number;
    weight: number;
    unit?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type productPk = 'id';
export type productId = product[productPk];
export type productOptionalAttributes = 'id' | 'code' | 'unit' | 'description' | 'createdAt' | 'updatedAt';
export type productCreationAttributes = Optional<productAttributes, productOptionalAttributes>;

export type ProductEdge = TRDBEdge<product>;
export type ProductConnection = TRDBConnection<product>;

export class product extends Model<productAttributes, productCreationAttributes> implements productAttributes {
    id!: number;

    categoryId!: number;

    name!: string;

    code?: string;

    price!: number;

    height!: number;

    weight!: number;

    unit?: string;

    description?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // product belongsTo categories via categoryId
    category!: categories;

    getCategory!: Sequelize.BelongsToGetAssociationMixin<categories>;

    setCategory!: Sequelize.BelongsToSetAssociationMixin<categories, categoriesId>;

    createCategory!: Sequelize.BelongsToCreateAssociationMixin<categories>;

    // product hasMany orderDetail via productId
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

    static initModel(sequelize: Sequelize.Sequelize): typeof product {
        return product.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                categoryId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'categories',
                        key: 'id',
                    },
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                code: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                },
                price: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                height: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                weight: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                unit: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                description: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'product',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_product_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'categoryId' }],
                    },
                ],
            }
        );
    }
}
