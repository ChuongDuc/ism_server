import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { customer, customerId } from './customer';
import type { order, orderId } from './order';
import type { user, userId } from './user';
import { TRDBConnection, TRDBEdge } from '../../lib/utils/relay';

export interface deliverOrderAttributes {
    id: number;
    customerId: number;
    orderId: number;
    driverId?: number;
    deliveryDate: Date;
    description?: string;
    receivingNote?: string;
    cranesNote?: string;
    documentNote?: string;
    otherNote?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type deliverOrderPk = 'id';
export type deliverOrderId = deliverOrder[deliverOrderPk];
export type deliverOrderOptionalAttributes =
    | 'id'
    | 'driverId'
    | 'description'
    | 'receivingNote'
    | 'cranesNote'
    | 'documentNote'
    | 'otherNote'
    | 'createdAt'
    | 'updatedAt';
export type deliverOrderCreationAttributes = Optional<deliverOrderAttributes, deliverOrderOptionalAttributes>;

export type DeliverOrderEdge = TRDBEdge<deliverOrder>;
export type DeliverOrderConnection = TRDBConnection<deliverOrder>;

export class deliverOrder extends Model<deliverOrderAttributes, deliverOrderCreationAttributes> implements deliverOrderAttributes {
    id!: number;

    customerId!: number;

    orderId!: number;

    driverId?: number;

    deliveryDate!: Date;

    description?: string;

    receivingNote?: string;

    cranesNote?: string;

    documentNote?: string;

    otherNote?: string;

    createdAt?: Date;

    updatedAt?: Date;

    // deliverOrder belongsTo customer via customerId
    customer!: customer;

    getCustomer!: Sequelize.BelongsToGetAssociationMixin<customer>;

    setCustomer!: Sequelize.BelongsToSetAssociationMixin<customer, customerId>;

    createCustomer!: Sequelize.BelongsToCreateAssociationMixin<customer>;

    // deliverOrder belongsTo order via orderId
    order!: order;

    getOrder!: Sequelize.BelongsToGetAssociationMixin<order>;

    setOrder!: Sequelize.BelongsToSetAssociationMixin<order, orderId>;

    createOrder!: Sequelize.BelongsToCreateAssociationMixin<order>;

    // deliverOrder belongsTo user via driverId
    driver!: user;

    getDriver!: Sequelize.BelongsToGetAssociationMixin<user>;

    setDriver!: Sequelize.BelongsToSetAssociationMixin<user, userId>;

    createDriver!: Sequelize.BelongsToCreateAssociationMixin<user>;

    static initModel(sequelize: Sequelize.Sequelize): typeof deliverOrder {
        return deliverOrder.init(
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
                orderId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'order',
                        key: 'id',
                    },
                },
                driverId: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'user',
                        key: 'id',
                    },
                },
                deliveryDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING(300),
                    allowNull: true,
                },
                receivingNote: {
                    type: DataTypes.STRING(300),
                    allowNull: true,
                    comment: 'ghi chu: Hàng đã giao',
                },
                cranesNote: {
                    type: DataTypes.STRING(300),
                    allowNull: true,
                    comment: 'Cẩu hạ hàng',
                },
                documentNote: {
                    type: DataTypes.STRING(300),
                    allowNull: true,
                    comment: 'Kèm chứng chỉ giấy tờ khách',
                },
                otherNote: {
                    type: DataTypes.STRING(300),
                    allowNull: true,
                    comment: 'Dạn dò khác',
                },
            },
            {
                sequelize,
                tableName: 'deliverOrder',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_deliverOrder_1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'customerId' }],
                    },
                    {
                        name: 'fk_deliverOrder_2_idx',
                        using: 'BTREE',
                        fields: [{ name: 'driverId' }],
                    },
                    {
                        name: 'fk_deliverOrder_3_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }],
                    },
                ],
            }
        );
    }
}
