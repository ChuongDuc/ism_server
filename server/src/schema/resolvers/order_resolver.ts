import { Transaction } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { iStatusOrderToStatusOrder, IStatusOrderTypeResolve } from '../../lib/resolver_enum';
import { SmContext } from '../../server';
import { RoleList, StatusOrder } from '../../lib/enum';
import { checkAuthentication } from '../../lib/utils/permision';
import { MySQLError, OrderNotFoundError, PermissionError } from '../../lib/classes/graphqlErrors';
import { ismDb, sequelize } from '../../loader/mysql';
import { orderCreationAttributes } from '../../db_models/mysql/order';

const order_resolver: IResolvers = {
    Order: {
        customer: async (parent) => parent.customer ?? (await parent.getCustomer()),

        sale: async (parent) => parent.sale ?? (await parent.getSale()),

        status: (parent) => (parent.status ? IStatusOrderTypeResolve(parent.status) : null),

        itemGroupList: async (parent) => parent.itemGroups ?? (await parent.getItemGroups()),

        paymentList: async (parent) => parent.paymentInfors ?? (await parent.getPaymentInfors()),

        totalMoney: async (parent) => await parent.getTotalMoney(),

        remainingPaymentMoney: async (parent) => await parent.calculateRemainingPaymentMoney(),
    },

    Mutation: {
        createOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            if (
                context.user?.role === RoleList.transporterManager ||
                context.user?.role === RoleList.driver ||
                context.user?.role === RoleList.assistantDriver
            ) {
                throw new PermissionError();
            }

            const { customerId, saleUserId, VAT } = input;

            const invoiceNo = await ismDb.order.invoiceNoOrderName(saleUserId);

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const orderAttribute: orderCreationAttributes = {
                        customerId,
                        saleId: saleUserId,
                        invoiceNo,
                        VAT: VAT ?? undefined,
                        status: StatusOrder.creatNew,
                        freightPrice: 0,
                    };

                    const newOrder = await ismDb.order.create(orderAttribute, {
                        transaction: t,
                        include: [
                            {
                                model: ismDb.user,
                                as: 'sale',
                                required: true,
                            },
                            {
                                model: ismDb.customer,
                                as: 'customer',
                                required: true,
                            },
                            {
                                model: ismDb.itemGroup,
                                as: 'itemGroups',
                                required: false,
                                include: [
                                    {
                                        model: ismDb.orderDetail,
                                        as: 'orderDetails',
                                        required: false,
                                        include: [
                                            {
                                                model: ismDb.product,
                                                as: 'product',
                                                required: false,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                model: ismDb.paymentInfor,
                                as: 'paymentInfors',
                                required: false,
                            },
                        ],
                    });

                    return newOrder;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Tạo đơn hàng không thành công: ${error}`);
                }
            });
        },

        updateOrder: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { orderId, customerId, saleUserId, VAT, status } = input;

            const orderUpdate = await ismDb.order.findByPk(orderId, {
                rejectOnEmpty: new OrderNotFoundError(),
            });

            if (customerId) {
                orderUpdate.customerId = customerId;
            }
            if (saleUserId) {
                orderUpdate.saleId = saleUserId;
            }
            if (VAT) {
                orderUpdate.VAT = VAT;
            }
            if (status) {
                orderUpdate.status = iStatusOrderToStatusOrder(status);
            }

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    await orderUpdate.save({ transaction: t });

                    return ISuccessResponse.Success;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Cập nhật không thành công: ${error}`);
                }
            });
        },
    },
};

export default order_resolver;
