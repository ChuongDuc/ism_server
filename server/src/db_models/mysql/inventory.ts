import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface inventoryAttributes {
    id: number;
    code: string;
    productName: string;
    quantity: number;
    weight?: number;
    unit?: string;
    createdAt?: Date;
    updatedAt?: Date;
    fileName: string;
}

export type inventoryPk = 'id';
export type inventoryId = inventory[inventoryPk];
export type inventoryOptionalAttributes = 'id' | 'weight' | 'unit' | 'createdAt' | 'updatedAt';
export type inventoryCreationAttributes = Optional<inventoryAttributes, inventoryOptionalAttributes>;

export type InventoryEdge = TRDBEdge<inventory>;
export type InventoryConnection = TRDBConnection<inventory>;

export class inventory extends Model<inventoryAttributes, inventoryCreationAttributes> implements inventoryAttributes {
    id!: number;

    code!: string;

    productName!: string;

    quantity!: number;

    weight?: number;

    unit?: string;

    createdAt?: Date;

    updatedAt?: Date;

    fileName!: string;

    static initModel(sequelize: Sequelize.Sequelize): typeof inventory {
        return inventory.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                code: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                productName: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                weight: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                unit: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                fileName: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'inventory',
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
