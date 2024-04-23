import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { convertRDBRowsToConnection, getRDBPaginationParams, rdbConnectionResolver, rdbEdgeResolver } from '../../lib/utils/relay';
import { checkAuthentication } from '../../lib/utils/permision';
import { CustomerAlreadyExistError, PermissionError } from '../../lib/classes/graphqlErrors';
import { SmContext } from '../../server';
import { ismDb } from '../../loader/mysql';
import { customerCreationAttributes } from '../../db_models/mysql/customer';
import { RoleList } from '../../lib/enum';

const customer_resolver: IResolvers = {
    CustomerEdge: rdbEdgeResolver,

    CustomerConnection: rdbConnectionResolver,

    // Customer: {
    //     orders: async (parent) => parent.orders ?? (await parent.getOrders()),
    // },

    Query: {
        listAllCustomer: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { searchQuery, args } = input;
            if (!context.user?.id) {
                throw new PermissionError();
            }
            if (context.user?.role === RoleList.driver || context.user?.role === RoleList.assistantDriver) {
                throw new PermissionError();
            }
            // const filteredCustomerByIdOption =
            //     // eslint-disable-next-line no-nested-ternary
            //     context.user?.role === RoleList.director ? (saleId ? { createdBy: saleId } : {}) : { createdBy: context.user?.id };

            const { limit, offset, limitForLast } = getRDBPaginationParams(args);
            const option: FindAndCountOptions = {
                limit,
                offset,
                // // TODO: Không phâi vấn đề tại subQuery mà vấn đề tại Op.Like
                // subQuery: false,
                include: [
                    {
                        model: ismDb.order,
                        as: 'orders',
                        required: false,
                        include: [
                            {
                                model: ismDb.user,
                                as: 'sale',
                                required: false,
                            },
                            {
                                model: ismDb.customer,
                                as: 'customer',
                                required: false,
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
                    },
                ],
                // distinct: true,
                order: [['id', 'DESC']],
            };

            const orQueryWhereOpt: WhereOptions<ismDb.customer> = {};
            if (searchQuery) {
                orQueryWhereOpt['$customer.name$'] = {
                    [Op.like]: `%${searchQuery.replace(/[\\%_]/g, '\\$1')}%`,
                };
                orQueryWhereOpt['$customer.phoneNumber$'] = {
                    [Op.like]: `%${searchQuery.replace(/[\\%_]/g, '\\$1')}%`,
                };
                orQueryWhereOpt['$customer.company$'] = {
                    [Op.like]: `%${searchQuery.replace(/[\\%_]/g, '\\$1')}%`,
                };
            }

            option.where = searchQuery ? { ...{ [Op.or]: orQueryWhereOpt } } : {};
            const result = await ismDb.customer.findAndCountAll(option);
            return convertRDBRowsToConnection(result, offset, limitForLast);
        },
    },

    Mutation: {
        createCustomer: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { name, phoneNumber, email, address, company } = input;

            const customerAttribute: customerCreationAttributes = {
                name: name ?? undefined,
                email: email ?? undefined,
                address: address ?? undefined,
                company: company ?? undefined,
                phoneNumber,
            };

            return await ismDb.customer.create(customerAttribute);
        },

        updateCustomer: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { id, name, phoneNumber, email, address, company } = input;
            const customer = await ismDb.customer.findByPk(id, { rejectOnEmpty: new CustomerAlreadyExistError() });

            if (name) customer.name = name;
            if (phoneNumber) customer.phoneNumber = phoneNumber;
            if (email) customer.name = email;
            if (address) customer.address = address;
            if (company) customer.company = company;

            await customer.save();

            return ISuccessResponse.Success;
        },

        deleteCustomer: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { ids } = input;
            const customer = await ismDb.customer.findAll({ where: { id: ids } });

            if (customer.length !== ids.length) throw new CustomerAlreadyExistError();

            await ismDb.customer.destroy({
                where: {
                    id: ids,
                },
            });

            return ISuccessResponse.Success;
        },
    },
};

export default customer_resolver;
