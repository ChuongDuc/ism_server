import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { customer, customerId } from './customer';
import type { order, orderId } from './order';

export interface paymentInforAttributes {
    id: number;
    orderId: number;
    customerId: number;
    money: number;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type paymentInforPk = 'id';
export type paymentInforId = paymentInfor[paymentInforPk];
export type paymentInforOptionalAttributes = 'id' | 'description' | 'createdAt' | 'updatedAt';
export type paymentInforCreationAttributes = Optional<paymentInforAttributes, paymentInforOptionalAttributes>;

export class paymentInfor extends Model<paymentInforAttributes, paymentInforCreationAttributes> implements paymentInforAttributes {
    id!: number;

    orderId!: number;

    customerId!: number;

    money!: number;

    description?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // paymentInfor belongsTo customer via customerId
    customer!: customer;

    getCustomer!: Sequelize.BelongsToGetAssociationMixin<customer>;

    setCustomer!: Sequelize.BelongsToSetAssociationMixin<customer, customerId>;

    createCustomer!: Sequelize.BelongsToCreateAssociationMixin<customer>;

    // paymentInfor belongsTo order via orderId
    order!: order;

    getOrder!: Sequelize.BelongsToGetAssociationMixin<order>;

    setOrder!: Sequelize.BelongsToSetAssociationMixin<order, orderId>;

    createOrder!: Sequelize.BelongsToCreateAssociationMixin<order>;

    static initModel(sequelize: Sequelize.Sequelize): typeof paymentInfor {
        return paymentInfor.init(
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
                customerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'customer',
                        key: 'id',
                    },
                },
                money: {
                    type: DataTypes.DECIMAL(10, 0),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'paymentInfor',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_paymentInfor_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'customerId' }],
                    },
                    {
                        name: 'fk_paymentInfor_2_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }],
                    },
                ],
            }
        );
    }
}
