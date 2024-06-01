/* eslint-disable no-await-in-loop,max-len */
// noinspection JSConstantReassignment,DuplicatedCode

import { Transaction } from 'sequelize';
import { InputMaybe, IResolvers, ISuccessResponse, IUpdateProductInput } from '../../__generated__/graphql';
import { SmContext } from '../../server';
import { ismDb, sequelize } from '../../loader/mysql';
import {
    DuplicateCategoryProductError,
    EmptyValueError,
    MySQLError,
    OrderNotFoundError,
    ProductNotFoundError,
} from '../../lib/classes/graphqlErrors';
import { orderDetailCreationAttributes } from '../../db_models/mysql/orderDetail';
import { itemGroupCreationAttributes } from '../../db_models/mysql/itemGroup';
import { NotificationEvent } from '../../lib/classes/PubSubService';
import { RoleList, StatusOrder } from '../../lib/enum';
import { notificationCreationAttributes } from '../../db_models/mysql/notification';
import { userNotificationCreationAttributes } from '../../db_models/mysql/userNotification';
import { checkAuthentication } from '../../lib/utils/permision';

const getDifferenceIds = (arr1: number[], arr2: number[]) => arr1.filter((element) => !arr2.includes(element));

const price_quotation_resolver: IResolvers = {
    ItemGroup: {
        orderDetailList: async (parent) => parent.orderDetails ?? (await parent.getOrderDetails()),
    },

    OrderDetail: {
        itemGroup: async (parent) => parent.itemGroup ?? (await parent.getItemGroup()),

        product: async (parent) => parent.product ?? (await parent.getProduct()),

        // totalWeight: async (parent) => {
        //     const quantity = parent.quantity ?? 0;
        //     const weight = parent.weightProduct ?? 0;
        //     return parent.totalWeight ?? Number(parseFloat(`${quantity * weight}`).toFixed(2));
        // },
    },

    Mutation: {
        createPriceQuotation: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const {
                orderId,
                saleId,
                categoryOrders,
                vat,
                executionTimeDescription,
                deliveryMethodDescription,
                percentOfAdvancePayment,
                reportingValidityAmount,
                freightPrice,
                freightMessage,
                deliverAddress,
            } = input;
            const checkExistOrder = await ismDb.order.findByPk(orderId, {
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
                    {
                        model: ismDb.deliverOrder,
                        as: 'deliverOrders',
                        required: false,
                    },
                ],
                rejectOnEmpty: new OrderNotFoundError(),
            });

            if (categoryOrders.length < 1) {
                throw new EmptyValueError('Thông tin hạng mục không được để trống');
            }

            const listProduct: number[] = [];
            categoryOrders.forEach((e) => {
                e.products.forEach((element) => {
                    listProduct.push(element.productId);
                });
            });

            const uniqProductId = [...new Set(listProduct)];

            const checkExistProduct = await ismDb.product.findAll({
                where: {
                    id: uniqProductId,
                },
            });

            if (checkExistProduct.length < uniqProductId.length) {
                throw new ProductNotFoundError();
            }

            for (let i = 0; i < categoryOrders.length; i += 1) {
                for (let j = i + 1; j < categoryOrders.length; j += 1) {
                    if (categoryOrders[i].name === categoryOrders[j].name) {
                        throw new DuplicateCategoryProductError();
                    }
                }
            }

            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const itemGroupResult: ismDb.itemGroup[] = [];
                    for (let i = 0; i < categoryOrders.length; i += 1) {
                        const orderDetailPromise: Promise<ismDb.orderDetail>[] = [];

                        const itemGroupAttribute: itemGroupCreationAttributes = {
                            orderId,
                            description: categoryOrders[i].description ?? undefined,
                        };
                        const createItemGroup = await ismDb.itemGroup.create(itemGroupAttribute, { transaction: t });
                        itemGroupResult.push(createItemGroup);
                        categoryOrders[i].products.forEach((element) => {
                            const orderDetailAttribute: orderDetailCreationAttributes = {
                                itemGroupId: createItemGroup.id,
                                productId: element.productId,
                                quantity: element.quantity,
                                priceProduct: element.priceProduct,
                                description: element.description ?? undefined,
                            };
                            orderDetailPromise.push(ismDb.orderDetail.create(orderDetailAttribute, { transaction: t }));
                        });
                        await Promise.all(orderDetailPromise);
                    }

                    checkExistOrder.status = StatusOrder.priceQuotation;
                    if (vat) {
                        checkExistOrder.VAT = vat;
                    }

                    if (freightPrice) {
                        checkExistOrder.freightPrice = freightPrice;
                    }

                    if (freightMessage) {
                        checkExistOrder.freightMessage = freightMessage;
                    }

                    if (deliverAddress) {
                        checkExistOrder.deliverAddress = deliverAddress;
                    }

                    if (executionTimeDescription) {
                        checkExistOrder.executionTimeDescription = executionTimeDescription;
                    }

                    if (deliveryMethodDescription) {
                        checkExistOrder.deliveryMethodDescription = deliveryMethodDescription;
                    }

                    if (percentOfAdvancePayment) {
                        checkExistOrder.percentOfAdvancePayment = percentOfAdvancePayment;
                    }

                    if (reportingValidityAmount) {
                        checkExistOrder.reportingValidityAmount = reportingValidityAmount;
                    }

                    checkExistOrder.deliverAddress = deliverAddress || '';

                    await checkExistOrder.save({ transaction: t });

                    return itemGroupResult;
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`);
                }
            });
        },

        updatePriceQuotation: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);

            const {
                orderId,
                saleId,
                itemGroups,
                vat,
                freightPrice,
                percentOfAdvancePayment,
                reportingValidityAmount,
                deliveryMethodDescription,
                executionTimeDescription,
                freightMessage,
                deliverAddress,
            } = input;

            const checkExistOrder = await ismDb.order.findByPk(orderId, {
                rejectOnEmpty: new OrderNotFoundError(),
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
                    {
                        model: ismDb.deliverOrder,
                        as: 'deliverOrders',
                        required: false,
                    },
                ],
            });
            if (checkExistOrder.saleId !== saleId) {
                throw new OrderNotFoundError(`Không tìm thấy đơn hàng ID: ${orderId} thuộc nhân viên sale ID: ${saleId}`);
            }

            checkExistOrder.deliverAddress = deliverAddress || '';

            if (vat || vat === 0) {
                checkExistOrder.VAT = vat;
            }
            if (freightPrice || freightPrice === 0) {
                checkExistOrder.freightPrice = freightPrice;
            }
            if (freightMessage) {
                checkExistOrder.freightMessage = freightMessage;
            }
            if (deliverAddress) {
                checkExistOrder.deliverAddress = deliverAddress;
            }
            if (executionTimeDescription) {
                checkExistOrder.executionTimeDescription = executionTimeDescription;
            }
            if (deliveryMethodDescription) {
                checkExistOrder.deliveryMethodDescription = deliveryMethodDescription;
            }
            if (percentOfAdvancePayment || percentOfAdvancePayment === 0) {
                checkExistOrder.percentOfAdvancePayment = percentOfAdvancePayment;
            }
            if (reportingValidityAmount || reportingValidityAmount === 0) {
                checkExistOrder.reportingValidityAmount = reportingValidityAmount;
            }

            await sequelize.transaction(async (t: Transaction) => {
                try {
                    if (itemGroups && itemGroups.length > 0) {
                        const originalItemGroups = checkExistOrder.itemGroups;

                        // Xử lý xóa những hạng mục khi update (Xóa những hạng mục cũ)
                        const originalItemGroupIds = originalItemGroups.map((oit) => oit.id);
                        const incomingItemGroupIds = itemGroups.map((it) => it.itemGroupId).filter((val): val is number => !!val);
                        const goingToDeleteItemGroupIds = getDifferenceIds(originalItemGroupIds, incomingItemGroupIds);
                        if (goingToDeleteItemGroupIds.length > 0) {
                            await ismDb.orderDetail.destroy({
                                where: {
                                    itemGroupId: goingToDeleteItemGroupIds,
                                },
                                transaction: t,
                            });
                            await ismDb.itemGroup.destroy({
                                where: {
                                    id: goingToDeleteItemGroupIds,
                                },
                                transaction: t,
                            });
                        }

                        // Process update những hạng mục và sản phẩm có sẳn (chỉ thay đổi số lượng và mô tả không phải thêm mới hay xóa đi)
                        const allUpdateProcess: Promise<ismDb.itemGroup | ismDb.orderDetail>[] = [];
                        // Những sản phẩm được thêm mới khi update
                        const allNewOrderDetailsIncoming: Promise<ismDb.orderDetail>[] = [];
                        const deleteOrderDetailsProcess: Promise<number>[] = [];
                        const newItemGroupProcess: {
                            itemGr: Promise<ismDb.itemGroup>;
                            orderDetails: InputMaybe<IUpdateProductInput[]> | undefined;
                        }[] = [];

                        itemGroups.forEach((itemGr) => {
                            if (itemGr.itemGroupId) {
                                for (let i = 0; i < originalItemGroups.length; i += 1) {
                                    if (originalItemGroups[i].id === itemGr.itemGroupId) {
                                        if (itemGr.description) {
                                            originalItemGroups[i].description = itemGr.description;
                                        }
                                        allUpdateProcess.push(originalItemGroups[i].save({ transaction: t }));
                                        if (itemGr.orderDetails && itemGr.orderDetails.length > 0) {
                                            const originalOrderDetails = originalItemGroups[i].orderDetails;
                                            // Xử lý xóa những sản phẩm khi update (Xóa những sản phẩm đã có sẵn)
                                            const oriOrderDetailIds = originalOrderDetails.map((item) => item.id);
                                            const incomingOrderDetailIds = itemGr.orderDetails
                                                .map((it) => it.orderDetailId)
                                                .filter((val): val is number => !!val);
                                            const goingToDeleteOrderDetailIds = getDifferenceIds(oriOrderDetailIds, incomingOrderDetailIds);
                                            if (goingToDeleteOrderDetailIds.length > 0) {
                                                deleteOrderDetailsProcess.push(
                                                    ismDb.orderDetail.destroy({
                                                        where: {
                                                            id: goingToDeleteOrderDetailIds,
                                                        },
                                                        transaction: t,
                                                    })
                                                );
                                            }

                                            itemGr.orderDetails.forEach((orderDetail) => {
                                                if (orderDetail.orderDetailId) {
                                                    for (let j = 0; j < originalOrderDetails.length; j += 1) {
                                                        if (originalOrderDetails[j].id === orderDetail.orderDetailId) {
                                                            if (orderDetail.quantity) {
                                                                originalOrderDetails[j].quantity = orderDetail.quantity;
                                                            }
                                                            if (orderDetail.priceProduct) {
                                                                originalOrderDetails[j].priceProduct = orderDetail.priceProduct;
                                                            }
                                                            if (orderDetail.description) {
                                                                originalOrderDetails[j].description = orderDetail.description;
                                                            }
                                                            allUpdateProcess.push(originalOrderDetails[j].save({ transaction: t }));
                                                        }
                                                    }
                                                } else {
                                                    const newOrderDetailAttribute: orderDetailCreationAttributes = {
                                                        itemGroupId: originalItemGroups[i].id,
                                                        productId: orderDetail.productId,
                                                        quantity: orderDetail.quantity ?? 0,
                                                        priceProduct: orderDetail.priceProduct ?? 0,
                                                        description: orderDetail.description ?? undefined,
                                                    };
                                                    allNewOrderDetailsIncoming.push(
                                                        ismDb.orderDetail.create(newOrderDetailAttribute, { transaction: t })
                                                    );
                                                }
                                            });
                                        }
                                    }
                                }
                            } else {
                                const itemGroupAttribute: itemGroupCreationAttributes = {
                                    orderId,
                                    name: itemGr.name ?? undefined,
                                    description: itemGr.description ?? undefined,
                                };
                                const newItemGroup = ismDb.itemGroup.create(itemGroupAttribute, { transaction: t });
                                newItemGroupProcess.push({ itemGr: newItemGroup, orderDetails: itemGr.orderDetails });
                            }
                        });
                        for (let i = 0; i < newItemGroupProcess.length; i += 1) {
                            const itemGroup = await newItemGroupProcess[i].itemGr;
                            const orderDetailInput = newItemGroupProcess[i].orderDetails?.filter(
                                (itemOrderDetail): itemOrderDetail is IUpdateProductInput => !!itemOrderDetail
                            );
                            if (orderDetailInput && orderDetailInput.length > 0) {
                                orderDetailInput.forEach((inputItem) => {
                                    const orderDetailAttribute: orderDetailCreationAttributes = {
                                        itemGroupId: itemGroup.id,
                                        productId: inputItem.productId,
                                        quantity: inputItem.quantity ?? 0,
                                        priceProduct: inputItem.priceProduct ?? 0,
                                        description: inputItem.description ?? undefined,
                                    };
                                    allNewOrderDetailsIncoming.push(ismDb.orderDetail.create(orderDetailAttribute, { transaction: t }));
                                });
                            }
                        }
                        await Promise.all([...allUpdateProcess, ...allNewOrderDetailsIncoming, ...deleteOrderDetailsProcess]);

                        const userIds = await ismDb.user
                            .findAll({
                                where: {
                                    role: [RoleList.director, RoleList.admin],
                                },
                                attributes: ['id'],
                            })
                            .then((users) => users.map((u) => u.id));

                        const notificationAttribute: notificationCreationAttributes = {
                            orderId,
                            event: NotificationEvent.OrderStatusChanged,
                            content: `Báo giá đơn hàng ${checkExistOrder.invoiceNo.slice(0, 19)} vừa được chỉnh sửa`,
                        };

                        const notification = await ismDb.notification.create(notificationAttribute, { transaction: t });

                        const userNotificationPromise: Promise<ismDb.userNotification>[] = [];

                        userIds.forEach((userId) => {
                            const userNotificationAttribute: userNotificationCreationAttributes = {
                                userId,
                                notificationId: notification.id,
                                isRead: false,
                            };

                            const createUserNotification = ismDb.userNotification.create(userNotificationAttribute, { transaction: t });

                            userNotificationPromise.push(createUserNotification);
                        });

                        await Promise.all([...userNotificationPromise]);
                    }

                    await checkExistOrder.save({ transaction: t });
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError(`Cập nhật không thành công: ${error}`);
                }
            });

            return ISuccessResponse.Success;
        },
    },
};

export default price_quotation_resolver;
