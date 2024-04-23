import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { customer, customerId } from './customer';
import type { itemGroup, itemGroupId } from './itemGroup';
import type { paymentInfor, paymentInforId } from './paymentInfor';
import type { user, userId } from './user';

export interface orderAttributes {
    id: number;
    customerId: number;
    saleId: number;
    invoiceNo: string;
    VAT?: number;
    freightPrice?: number;
    deliverAddress?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type orderPk = 'id';
export type orderId = order[orderPk];
export type orderOptionalAttributes = 'id' | 'VAT' | 'freightPrice' | 'deliverAddress' | 'status' | 'createdAt' | 'updatedAt';
export type orderCreationAttributes = Optional<orderAttributes, orderOptionalAttributes>;

export class order extends Model<orderAttributes, orderCreationAttributes> implements orderAttributes {
    id!: number;

    customerId!: number;

    saleId!: number;

    invoiceNo!: string;

    VAT?: number;

    freightPrice?: number;

    deliverAddress?: string;

    status?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // order belongsTo customer via customerId
    customer!: customer;

    getCustomer!: Sequelize.BelongsToGetAssociationMixin<customer>;

    setCustomer!: Sequelize.BelongsToSetAssociationMixin<customer, customerId>;

    createCustomer!: Sequelize.BelongsToCreateAssociationMixin<customer>;

    // order hasMany itemGroup via orderId
    itemGroups!: itemGroup[];

    getItemGroups!: Sequelize.HasManyGetAssociationsMixin<itemGroup>;

    setItemGroups!: Sequelize.HasManySetAssociationsMixin<itemGroup, itemGroupId>;

    addItemGroup!: Sequelize.HasManyAddAssociationMixin<itemGroup, itemGroupId>;

    addItemGroups!: Sequelize.HasManyAddAssociationsMixin<itemGroup, itemGroupId>;

    createItemGroup!: Sequelize.HasManyCreateAssociationMixin<itemGroup>;

    removeItemGroup!: Sequelize.HasManyRemoveAssociationMixin<itemGroup, itemGroupId>;

    removeItemGroups!: Sequelize.HasManyRemoveAssociationsMixin<itemGroup, itemGroupId>;

    hasItemGroup!: Sequelize.HasManyHasAssociationMixin<itemGroup, itemGroupId>;

    hasItemGroups!: Sequelize.HasManyHasAssociationsMixin<itemGroup, itemGroupId>;

    countItemGroups!: Sequelize.HasManyCountAssociationsMixin;

    // order hasMany paymentInfor via orderId
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

    // order belongsTo user via saleId
    sale!: user;

    getSale!: Sequelize.BelongsToGetAssociationMixin<user>;

    setSale!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createSale!: Sequelize.BelongsToCreateAssociationMixin<user>;

    static initModel(sequelize: Sequelize.Sequelize): typeof order {
        return order.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                customerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'customer',
                        key: 'id',
                    },
                },
                saleId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'user',
                        key: 'id',
                    },
                },
                invoiceNo: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                VAT: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                freightPrice: {
                    type: DataTypes.DECIMAL(10, 0),
                    allowNull: true,
                },
                deliverAddress: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'order',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_order_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'customerId' }],
                    },
                    {
                        name: 'fk_order_2_idx',
                        using: 'BTREE',
                        fields: [{ name: 'saleId' }],
                    },
                ],
            }
        );
    }
}
