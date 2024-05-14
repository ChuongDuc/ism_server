import * as Sequelize from 'sequelize';
import { DataTypes, Model, Op, Optional } from 'sequelize';
import type { customer, customerId } from './customer';
import type { itemGroup, itemGroupId } from './itemGroup';
import type { notification, notificationId } from './notification';
import type { paymentInfor, paymentInforId } from './paymentInfor';
import type { user, userId } from './user';
import { ismDb } from '../../loader/mysql';
import { fDateTimeForInvoiceNoDayMonYear } from '../../lib/utils/formatTime';
import { extractFirstName } from '../../lib/utils/others';
import { UserNotFoundError } from '../../lib/classes/graphqlErrors';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

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

export type OrderEdge = TRDBEdge<order>;
export type OrderConnection = TRDBConnection<order>;

export class order extends Model<orderAttributes, orderCreationAttributes> implements orderAttributes {
    id!: number;

    customerId!: number;

    saleId!: number;

    invoiceNo!: string;

    VAT?: number;

    freightPrice?: number;

    deliverAddress?: string;

    status?: string;

    totalMoney!: number;

    remainingPaymentMoney!: number;

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

    // order hasMany notification via orderId
    notifications!: notification[];

    getNotifications!: Sequelize.HasManyGetAssociationsMixin<notification>;

    setNotifications!: Sequelize.HasManySetAssociationsMixin<notification, notificationId>;

    addNotification!: Sequelize.HasManyAddAssociationMixin<notification, notificationId>;

    addNotifications!: Sequelize.HasManyAddAssociationsMixin<notification, notificationId>;

    createNotification!: Sequelize.HasManyCreateAssociationMixin<notification>;

    removeNotification!: Sequelize.HasManyRemoveAssociationMixin<notification, notificationId>;

    removeNotifications!: Sequelize.HasManyRemoveAssociationsMixin<notification, notificationId>;

    hasNotification!: Sequelize.HasManyHasAssociationMixin<notification, notificationId>;

    hasNotifications!: Sequelize.HasManyHasAssociationsMixin<notification, notificationId>;

    countNotifications!: Sequelize.HasManyCountAssociationsMixin;

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

    async getTotalMoney(): Promise<number> {
        const itemGroups = this.itemGroups ?? (await this.getItemGroups());
        const orderDetails: ismDb.orderDetail[] = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < itemGroups.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            const ods: ismDb.orderDetail[] = itemGroups[i].orderDetails ?? (await itemGroups[i].getOrderDetails());
            ods.forEach((od) => orderDetails.push(od));
        }

        this.totalMoney = orderDetails.reduce(
            (sum, odt) =>
                sum +
                (odt.productId
                    ? parseFloat(String(odt.priceProduct)) *
                      parseFloat(
                          `${
                              odt.totalWeight
                                  ? odt.totalWeight
                                  : parseFloat(`${odt.quantity ? odt.quantity : 0}`) *
                                    parseFloat(odt.weightProduct ? String(odt.weightProduct) : String(odt.product.weight))
                          }`
                      )
                    : 0.0),
            0.0
        );
        return this.totalMoney;
    }

    async calculateRemainingPaymentMoney() {
        const oPayment =
            this.paymentInfors ??
            (await ismDb.paymentInfor.findAll({
                where: {
                    orderId: this.id,
                },
            }));

        await this.getTotalMoney();

        this.remainingPaymentMoney =
            this.totalMoney +
            (this.freightPrice ? parseFloat(String(this.freightPrice)) : 0.0) +
            (this.VAT ? parseFloat(String((this.totalMoney * this.VAT) / 100)) : 0.0) -
            oPayment.reduce((sum, opm) => sum + (opm.id ? parseFloat(String(opm.money)) : 0.0), 0.0);

        return this.remainingPaymentMoney;
    }

    static async invoiceNoOrderName(saleId: number) {
        const today = new Date();
        const formatToDay = fDateTimeForInvoiceNoDayMonYear(today);
        const startOfDay = new Date(today).setHours(0, 0, 0, 0);
        const endOfDay = new Date(today).setHours(23, 59, 59, 999);

        const getSale = await ismDb.user.findByPk(saleId, { rejectOnEmpty: new UserNotFoundError() });

        const numberOrderOfSale = await ismDb.order.findAll({
            where: {
                saleId,
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
        });

        return `${formatToDay}_${extractFirstName(getSale.firstName)}_${numberOrderOfSale.length + 1}`;
    }

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
