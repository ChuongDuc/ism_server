// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import importGraphqlString from 'import-graphql-string';
import { Tab } from '@apollographql/graphql-playground-html/dist/render-playground-page';
import user_resolver from '../schema/resolvers/user_resolver';
import { variables } from './variables';

const setUserAuthorization = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token = await user_resolver.Query?.login({}, variables.login)
        .then((result: { token: any }) => result?.token)
        .catch((e: Error) => {
            console.error(e);
            return null;
        });
    const authHeader = token ? `Bearer ${token}` : '';

    return {
        authorization: authHeader,
    };
};

const defaultPath = `http://${process.env.ISM_SERVER_HOST || 'localhost'}:${process.env.ISM_SERVER_PORT || '4000'}/graphql`;

// const defaultSubscriptionPath = `ws://${process.env.SSM_SERVER_HOST || 'localhost'}:${process.env.SSM_SERVER_PORT || '4000'}/subscriptions`;

const prettifyJsonString = (variable: any) => JSON.stringify(variable, null, 2);
//
// const getMessage = importGraphqlString('./subscription/getMessage.graphql');

const login = importGraphqlString('./queries/authentication/login.graphql');

const me = importGraphqlString('./queries/user/me.graphql');

const createUser = importGraphqlString('./mutations/user/createUser.graphql');

const updateUser = importGraphqlString('./mutations/user/updateUser.graphql');

const deleteUser = importGraphqlString('./mutations/user/deleteUser.graphql');

const importFileExcelInventory = importGraphqlString('./mutations/inventory/importFileExcelInventory.graphql');

const importFileExcelProducts = importGraphqlString('./mutations/product/importFileExcelProducts.graphql');

const createCustomer = importGraphqlString('./mutations/customer/createCustomer.graphql');

const updateCustomer = importGraphqlString('./mutations/customer/updateCustomer.graphql');

const deleteCustomer = importGraphqlString('./mutations/customer/deleteCustomer.graphql');

const createCategory = importGraphqlString('./mutations/category/createCategory.graphql');

const updateCategory = importGraphqlString('./mutations/category/updateCategory.graphql');

const createProduct = importGraphqlString('./mutations/product/createProduct.graphql');

const updateProductById = importGraphqlString('./mutations/product/updateProductById.graphql');

const updateProductPriceById = importGraphqlString('./mutations/product/updateProductPriceById.graphql');

const deleteProduct = importGraphqlString('./mutations/product/deleteProduct.graphql');

const createOrder = importGraphqlString('./mutations/order/createOrder.graphql');

const updateOrder = importGraphqlString('./mutations/order/updateOrder.graphql');

const users = importGraphqlString('./queries/user/users.graphql');

const listAllCustomer = importGraphqlString('./queries/customer/listAllCustomer.graphql');

const listAllInventory = importGraphqlString('./queries/inventory/listAllInventory.graphql');

const getAllCategory = importGraphqlString('./queries/category/getAllCategory.graphql');

const listAllProducts = importGraphqlString('./queries/product/listAllProducts.graphql');

export const queryExample = async (path: string = defaultPath): Promise<Tab[]> => {
    const userAuth = await setUserAuthorization();
    // const subscriptionHeaders = {
    //     headers: {
    //         ...userAuth,
    //     },
    // };
    return [
        // {
        //     endpoint: defaultSubscriptionPath,
        //     name: 'Subscription',
        //     query: getMessage,
        //     headers: subscriptionHeaders as any,
        //     variables: prettifyJsonString(variables.getMessage),
        // },
        {
            endpoint: path,
            name: 'Current user',
            headers: userAuth,
            query: me,
        },
        {
            endpoint: path,
            name: 'Đăng nhập',
            query: login,
            variables: prettifyJsonString(variables.login),
        },
        {
            endpoint: path,
            name: 'Tạo người dùng',
            query: createUser,
            headers: userAuth,
            variables: prettifyJsonString(variables.createUser),
        },
        {
            endpoint: path,
            name: 'Sửa người dùng',
            query: updateUser,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateUser),
        },
        {
            endpoint: path,
            name: 'Xóa người dùng',
            query: deleteUser,
            headers: userAuth,
            variables: prettifyJsonString(variables.deleteUser),
        },
        {
            endpoint: path,
            name: 'Danh sách người dùng',
            query: users,
            headers: userAuth,
            variables: prettifyJsonString(variables.users),
        },
        {
            endpoint: path,
            name: 'Danh sách khách hàng',
            query: listAllCustomer,
            headers: userAuth,
            variables: prettifyJsonString(variables.listAllCustomer),
        },
        {
            endpoint: path,
            name: 'Tạo khách hàng mới',
            query: createCustomer,
            headers: userAuth,
            variables: prettifyJsonString(variables.createCustomer),
        },
        {
            endpoint: path,
            name: 'sửa khách hàng',
            query: updateCustomer,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateCustomer),
        },
        {
            endpoint: path,
            name: 'Xóa khách hàng',
            query: deleteCustomer,
            headers: userAuth,
            variables: prettifyJsonString(variables.deleteCustomer),
        },
        {
            endpoint: path,
            name: 'Danh sách tồn kho',
            query: listAllInventory,
            headers: userAuth,
            variables: prettifyJsonString(variables.listAllInventory),
        },
        {
            endpoint: path,
            name: 'Thêm file excel tồn kho',
            query: importFileExcelInventory,
            headers: userAuth,
            variables: prettifyJsonString(variables.importFileExcelInventory),
        },
        {
            endpoint: path,
            name: 'Danh sách loại sản phẩm',
            query: getAllCategory,
            headers: userAuth,
        },
        {
            endpoint: path,
            name: 'Thêm loại sản phẩm mới',
            query: createCategory,
            headers: userAuth,
            variables: prettifyJsonString(variables.createCategory),
        },
        {
            endpoint: path,
            name: 'Sửa loại sản phẩm',
            query: updateCategory,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateCategory),
        },
        {
            endpoint: path,
            name: 'lấy tất cả sản phẩm',
            query: listAllProducts,
            headers: userAuth,
            variables: prettifyJsonString(variables.listAllProducts),
        },
        {
            endpoint: path,
            name: 'Thêm file excel sản phầm',
            query: importFileExcelProducts,
            headers: userAuth,
            variables: prettifyJsonString(variables.importFileExcelProducts),
        },
        {
            endpoint: path,
            name: 'Thêm sản phẩm mới',
            query: createProduct,
            headers: userAuth,
            variables: prettifyJsonString(variables.createProduct),
        },
        {
            endpoint: path,
            name: 'Sửa sản phẩm',
            query: updateProductById,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateProductById),
        },
        {
            endpoint: path,
            name: 'Sửa giá sản phẩm',
            query: updateProductPriceById,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateProductPriceById),
        },
        {
            endpoint: path,
            name: 'Xóa sản phẩm',
            query: deleteProduct,
            headers: userAuth,
            variables: prettifyJsonString(variables.deleteProduct),
        },
        {
            endpoint: path,
            name: 'Tạo order',
            query: createOrder,
            headers: userAuth,
            variables: prettifyJsonString(variables.createOrder),
        },
        {
            endpoint: path,
            name: 'Sửa order',
            query: updateOrder,
            headers: userAuth,
            variables: prettifyJsonString(variables.updateOrder),
        },
    ];
};
