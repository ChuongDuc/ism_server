import { SmContext } from '../../server';
import { AuthenticationError } from '../classes/graphqlErrors';

export const checkAuthentication = (context: SmContext) => {
    if (!context.isAuth && !context.user) throw new AuthenticationError(context.error);
};
