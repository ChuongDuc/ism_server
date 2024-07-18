import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { inventory, inventoryId } from './inventory';
import type { product, productId } from './product';

export interface shipmentAttributes {
    id: number;
    manufactureDate?: Date;
    expiryDate?: Date;
    supplierName?: string;
    receivedDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
    shimentCode?: string;
}

export type shipmentPk = 'id';
export type shipmentId = shipment[shipmentPk];
export type shipmentOptionalAttributes = 'id' | 'manufactureDate' | 'expiryDate' | 'supplierName' | 'createdAt' | 'updatedAt' | 'shimentCode';
export type shipmentCreationAttributes = Optional<shipmentAttributes, shipmentOptionalAttributes>;

export class shipment extends Model<shipmentAttributes, shipmentCreationAttributes> implements shipmentAttributes {
    id!: number;

    manufactureDate?: Date;

    expiryDate?: Date;

    supplierName?: string;

    receivedDate!: Date;

    createdAt?: Date;

    updatedAt?: Date;

    shimentCode?: string;

    // shipment hasMany inventory via shipmentId
    inventories!: inventory[];

    getInventories!: Sequelize.HasManyGetAssociationsMixin<inventory>;

    setInventories!: Sequelize.HasManySetAssociationsMixin<inventory, inventoryId>;

    addInventory!: Sequelize.HasManyAddAssociationMixin<inventory, inventoryId>;

    addInventories!: Sequelize.HasManyAddAssociationsMixin<inventory, inventoryId>;

    createInventory!: Sequelize.HasManyCreateAssociationMixin<inventory>;

    removeInventory!: Sequelize.HasManyRemoveAssociationMixin<inventory, inventoryId>;

    removeInventories!: Sequelize.HasManyRemoveAssociationsMixin<inventory, inventoryId>;

    hasInventory!: Sequelize.HasManyHasAssociationMixin<inventory, inventoryId>;

    hasInventories!: Sequelize.HasManyHasAssociationsMixin<inventory, inventoryId>;

    countInventories!: Sequelize.HasManyCountAssociationsMixin;

    // shipment hasMany product via shipmentId
    products!: product[];

    getProducts!: Sequelize.HasManyGetAssociationsMixin<product>;

    setProducts!: Sequelize.HasManySetAssociationsMixin<product, productId>;

    addProduct!: Sequelize.HasManyAddAssociationMixin<product, productId>;

    addProducts!: Sequelize.HasManyAddAssociationsMixin<product, productId>;

    createProduct!: Sequelize.HasManyCreateAssociationMixin<product>;

    removeProduct!: Sequelize.HasManyRemoveAssociationMixin<product, productId>;

    removeProducts!: Sequelize.HasManyRemoveAssociationsMixin<product, productId>;

    hasProduct!: Sequelize.HasManyHasAssociationMixin<product, productId>;

    hasProducts!: Sequelize.HasManyHasAssociationsMixin<product, productId>;

    countProducts!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof shipment {
        return shipment.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                manufactureDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                expiryDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                supplierName: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                receivedDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                shimentCode: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'shipment',
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
