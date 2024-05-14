import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { SmContext } from '../../server';
import { checkAuthentication } from '../../lib/utils/permision';
import { ismDb } from '../../loader/mysql';
import { categoriesCreationAttributes } from '../../db_models/mysql/categories';
import { CategoryAlreadyExistError } from '../../lib/classes/graphqlErrors';

const category_resolver: IResolvers = {
    Query: {
        getAllCategory: async (_parent, _, context: SmContext) => {
            checkAuthentication(context);
            return await ismDb.categories.findAll();
        },
    },
    Mutation: {
        createCategory: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { name } = input;
            const categoryAttribute: categoriesCreationAttributes = {
                name,
            };
            return await ismDb.categories.create(categoryAttribute);
        },
        updateCategory: async (_parent, { input }, context: SmContext) => {
            checkAuthentication(context);
            const { id, name } = input;
            const category = await ismDb.categories.findByPk(id, { rejectOnEmpty: new CategoryAlreadyExistError() });
            if (name) category.name = name;
            await category.save();
            return ISuccessResponse.Success;
        },
    },
};

export default category_resolver;
