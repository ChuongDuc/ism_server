import { Sequelize } from 'sequelize';
import { database } from '../constant/appConfiguration';
import { initModels } from '../db_models/mysql/init-models';
// eslint-disable-next-line import/extensions
import user from '../dev_data/user.json';
// eslint-disable-next-line import/extensions
import inventory from '../dev_data/inventory.json';
// eslint-disable-next-line import/extensions
import categories from '../dev_data/categories.json';
// eslint-disable-next-line import/extensions
import customer from '../dev_data/customer.json';
// eslint-disable-next-line import/extensions
import order from '../dev_data/order.json';
// eslint-disable-next-line import/extensions
import itemGroup from '../dev_data/itemGroup.json';
// eslint-disable-next-line import/extensions
import orderDetail from '../dev_data/orderDetail.json';
// eslint-disable-next-line import/extensions
import product from '../dev_data/product.json';
// eslint-disable-next-line import/extensions
import paymentInfor from '../dev_data/paymentInfo.json';

export const sequelize = new Sequelize(database.db_name, database.db_user, database.db_password, {
    ...database.option,
});

const models = initModels(sequelize);

export const syncDatabase = async () => {
    if (process.env.NODE_ENV === 'development' && process.env.SYNC_DATA === 'true') {
        const isForceSync = process.env.SYNC_DATA === 'true';
        await sequelize
            .sync({ force: isForceSync, alter: true })
            .then(() => {
                console.log('Database sync is done!');
            })
            .then(async () => {
                if (isForceSync) {
                    await models.user.bulkCreate(user as any);
                    await models.categories.bulkCreate(categories as any);
                    await models.product.bulkCreate(product as any);
                    await models.customer.bulkCreate(customer as any);
                    await models.order.bulkCreate(order as any);
                    await models.itemGroup.bulkCreate(itemGroup as any);
                    await models.orderDetail.bulkCreate(orderDetail as any);
                    await models.paymentInfor.bulkCreate(paymentInfor as any);
                    await models.inventory.bulkCreate(inventory as any);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
};

export * as ismDb from '../db_models/mysql/init-models';
