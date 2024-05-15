import user from './user_resolver';
import customer from './customer_resolver';
import inventory from './inventory_resolver';
import category from './category_resolvers';
import product from './product_resolver';
import notification from './notification_resolver';
import order from './order_resolver';
import userNotification from './userNotificationResolver';

export default [user, customer, inventory, category, product, notification, order, userNotification];
