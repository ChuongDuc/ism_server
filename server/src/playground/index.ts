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

const prettifyJsonString = (variable: any) => JSON.stringify(variable, null, 2);

const login = importGraphqlString('./queries/authentication/login.graphql');

const me = importGraphqlString('./queries/user/me.graphql');

const createUser = importGraphqlString('./mutations/user/createUser.graphql');

export const queryExample = async (path: string = defaultPath): Promise<Tab[]> => {
    const userAuth = await setUserAuthorization();
    // const subscriptionHeaders = {
    //     headers: {
    //         ...userAuth,
    //     },
    // };
    return [
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
    ];
};
