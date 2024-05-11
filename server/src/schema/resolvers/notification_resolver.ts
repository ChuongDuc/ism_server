import { IResolvers } from '../../__generated__/graphql';

const notificationResolver: IResolvers = {
    Notification: {
        id: (parent) => parent.id,

        Order: async (parent) => (parent.order ? await parent.getOrder() : null),
    },
};

export default notificationResolver;
