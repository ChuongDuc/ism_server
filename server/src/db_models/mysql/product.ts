import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { categories, categoriesId } from './categories';
import type { orderDetail, orderDetailId } from './orderDetail';
import type { shipment, shipmentId } from './shipment';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface productAttributes {
    id: number;
    name: string;
    code?: string;
    price: number;
    priceWithVAT: number;
    priceWithoutVAT: number;
    weight: number;
    height: number;
    width?: number;
    available?: number;
    category: number;
    unit?: string;
    type: string;
    formType?: string;
    description?: string;
    shipmentId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type productPk = 'id';
export type productId = product[productPk];
export type productOptionalAttributes =
    | 'id'
    | 'code'
    | 'width'
    | 'available'
    | 'unit'
    | 'formType'
    | 'description'
    | 'shipmentId'
    | 'createdAt'
    | 'updatedAt';
export type productCreationAttributes = Optional<productAttributes, productOptionalAttributes>;

export type ProductEdge = TRDBEdge<product>;
export type ProductConnection = TRDBConnection<product>;

export class product extends Model<productAttributes, productCreationAttributes> implements productAttributes {
    id!: number;

    name!: string;

    code?: string;

    price!: number;

    priceWithVAT!: number;

    priceWithoutVAT!: number;

    weight!: number;

    height!: number;

    width?: number;

    available?: number;

    category!: number;

    unit?: string;

    type!: string;

    formType?: string;

    description?: string;

    shipmentId?: number;

    createdAt?: Date;

    updatedAt?: Date;

    // product belongsTo categories via category
    category_category!: categories;

    getCategory_category!: Sequelize.BelongsToGetAssociationMixin<categories>;

    setCategory_category!: Sequelize.BelongsToSetAssociationMixin<categories, categoriesId>;

    createCategory_category!: Sequelize.BelongsToCreateAssociationMixin<categories>;

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

    // product belongsTo shipment via shipmentId
    shipment!: shipment;

    getShipment!: Sequelize.BelongsToGetAssociationMixin<shipment>;

    setShipment!: Sequelize.BelongsToSetAssociationMixin<shipment, shipmentId>;

    createShipment!: Sequelize.BelongsToCreateAssociationMixin<shipment>;

    static initModel(sequelize: Sequelize.Sequelize): typeof product {
        return product.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                code: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                price: {
                    type: DataTypes.DECIMAL(15, 2),
                    allowNull: false,
                },
                priceWithVAT: {
                    type: DataTypes.DECIMAL(15, 2),
                    allowNull: false,
                },
                priceWithoutVAT: {
                    type: DataTypes.DECIMAL(15, 2),
                    allowNull: false,
                },
                weight: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                height: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                width: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                available: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                category: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'categories',
                        key: 'id',
                    },
                },
                unit: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                type: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                formType: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                description: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                shipmentId: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'shipment',
                        key: 'id',
                    },
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
                        fields: [{ name: 'category' }],
                    },
                    {
                        name: 'fk_product_1_idx1',
                        using: 'BTREE',
                        fields: [{ name: 'shipmentId' }],
                    },
                ],
            }
        );
    }
}
