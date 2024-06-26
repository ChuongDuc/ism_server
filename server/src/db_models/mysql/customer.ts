import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { deliverOrder, deliverOrderId } from './deliverOrder';
import type { order, orderId } from './order';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';
import type { paymentInfor, paymentInforId } from './paymentInfor';

export interface customerAttributes {
    id: number;
    name?: string;
    phoneNumber: string;
    address?: string;
    company?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type customerPk = 'id';
export type customerId = customer[customerPk];
export type customerOptionalAttributes = 'id' | 'name' | 'address' | 'company' | 'email' | 'createdAt' | 'updatedAt';
export type customerCreationAttributes = Optional<customerAttributes, customerOptionalAttributes>;

export type CustomerEdge = TRDBEdge<customer>;
export type CustomerConnection = TRDBConnection<customer>;

export class customer extends Model<customerAttributes, customerCreationAttributes> implements customerAttributes {
    id!: number;

    name?: string;

    phoneNumber!: string;

    address?: string;

    company?: string;

    email?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // customer hasMany deliverOrder via customerId
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

    // customer hasMany order via customerId
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

    // customer hasMany paymentInfor via customerId
    paymentInfors!: paymentInfor[];

    getPaymentInfors!: Sequelize.HasManyGetAssociationsMixin<paymentInfor>;

    setPaymentInfors!: Sequelize.HasManySetAssociationsMixin<paymentInfor, paymentInforId>;

    addPaymentInfor!: Sequelize.HasManyAddAssociationMixin<paymentInfor, paymentInforId>;

    addPaymentInfors!: Sequelize.HasManyAddAssociationsMixin<paymentInfor, paymentInforId>;

    createPaymentInfor!: Sequelize.HasManyCreateAssociationMixin<paymentInfor>;

    removePaymentInfor!: Sequelize.HasManyRemoveAssociationMixin<paymentInfor, paymentInforId>;

    removePaymentInfors!: Sequelize.HasManyRemoveAssociationsMixin<paymentInfor, paymentInforId>;

    hasPaymentInfor!: Sequelize.HasManyHasAssociationMixin<paymentInfor, paymentInforId>;

    hasPaymentInfors!: Sequelize.HasManyHasAssociationsMixin<paymentInfor, paymentInforId>;

    countPaymentInfors!: Sequelize.HasManyCountAssociationsMixin;

    static initModel(sequelize: Sequelize.Sequelize): typeof customer {
        return customer.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                phoneNumber: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                address: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                company: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                email: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'customer',
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
