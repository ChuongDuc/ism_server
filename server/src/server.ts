// eslint-disable-next-line import/extensions,@typescript-eslint/ban-ts-comment
// @ts-ignore
// noinspection HttpUrlsUsage
// eslint-disable-next-line import/extensions
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { createServer } from 'http';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Extra, useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { Context, SubscribeMessage } from 'graphql-ws';
import { ExecutionArgs } from 'graphql';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import jwt, { JwtPayload } from 'jsonwebtoken';
import resolvers from './schema/resolvers';
import typeDefs from './schema/types';
import { USER_JWT } from './lib/utils/jwt';
import { syncDatabase } from './loader/mysql';
import { appConfig } from './constant/appConfiguration';
import { queryExample } from './playground';
import PubSubService from './lib/classes/PubSubService';
import MinIOServices from './lib/classes/MinIOServices';

export interface SmContext {
    isAuth: boolean;
    user?: USER_JWT;
    error: any;
    req: express.Request;
    res: express.Response;
    awsS3StorageService: MinIOServices;
    pubsub: PubSubService;
}

interface ContextFunctionProps {
    req: express.Request;
    res: express.Response;
}

// const appContext: Omit<SsmContext, 'user' | 'isAuth' | 'error' | 'req' | 'res'> = {
//     pubsub: pubsubService,
//     awsS3StorageService,
// };

const authentication = async (authorization: string, req: express.Request, res: express.Response): Promise<SmContext & JwtPayload> => {
    let token: string;
    if (authorization.startsWith('Bearer ')) {
        token = authorization.slice(7, authorization.length);
    }
    const user: JwtPayload = new Promise((resolve, reject) => {
        jwt.verify(token, appConfig.secretSign, (err, decoded) => {
            if (err) return reject(err);
            return resolve(decoded);
        });
    });
    return await user
        .then((result: USER_JWT & JwtPayload) => ({
            isAuth: true,
            user: result,
            req,
            res,
        }))
        .catch((err: Error) => ({
            isAuth: false,
            error: err.message,
            req,
            res,
        }));
};

const context = async ({ req, res }: ContextFunctionProps): Promise<SmContext> => {
    const token = req.headers?.authorization || '';
    const auth = await authentication(token, req, res);
    return {
        // ...appContext,
        ...auth,
    };
};

const getDynamicContext = async (
    ctx: Context<Record<string, unknown> | undefined, Extra & Partial<Record<PropertyKey, never>>>,
    msg: SubscribeMessage,
    args: ExecutionArgs
) => {
    if (ctx.connectionParams?.authentication) {
        console.log('msg: ', msg);
        console.log('args: ', args);
        return { currentUser: { id: 1 } };
    }
    return { currentUser: null };
};

async function startServer() {
    await Promise.all([syncDatabase()]);
    const appSrv = express();
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const httpServer = createServer(appSrv);

    // Create WebSocket server using the HTTP server.
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/subscriptions',
    });
    // Save the returned server's info that we can shut down this server later
    const serverCleanup = useServer(
        {
            schema,
            context: async (ctx, msg, args) => {
                console.log('msg: ');
                return getDynamicContext(ctx, msg, args);
            },
            onConnect: async () => {
                console.log('A client connected!');
            },
            onDisconnect() {
                console.log('Disconnected!');
            },
        },
        wsServer
    );

    const server = new ApolloServer<SmContext>({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    if (process.env.NODE_ENV === 'development') {
        server.addPlugin(
            ApolloServerPluginLandingPageGraphQLPlayground({
                title: 'Sm-API in development',
                settings: {
                    'general.betaUpdates': false,
                    'editor.theme': 'dark',
                    'editor.cursorShape': 'line',
                    'editor.reuseHeaders': true,
                    'tracing.hideTracingResponse': true,
                    'queryPlan.hideQueryPlanResponse': true,
                    'editor.fontSize': 14,
                    'editor.fontFamily': '"Source Code Pro", "Consolas", "Inconsolata", "Droid Sans Mono", "Monaco", monospace',
                    'request.credentials': 'omit',
                    'schema.polling.enable': false,
                },
                tabs: await queryExample(),
                subscriptionEndpoint: `ws://${appConfig.host}:${appConfig.port}/subscriptions`,
            })
        );
    }
    await server.start();
    // This middleware should be added before calling `applyMiddleware`.
    appSrv.use(graphqlUploadExpress());

    // TODO: Handle CORS later
    appSrv.use(cors());
    appSrv.use(
        '/graphql',
        bodyParser.json(),
        expressMiddleware(server, {
            context,
        })
    );
    await new Promise<void>((resolve) => {
        httpServer.listen({ port: appConfig.port, hostname: appConfig.host }, resolve);
        console.log(`🚀 Server ready at http://${appConfig.host}:${appConfig.port}/graphql`);
        console.log(`🚀 Subscription endpoint ready at ws://${appConfig.host}:${appConfig.port}/subscriptions`);
    });
}

startServer().catch((error) => {
    console.error('Unable start server: ', error);
});
