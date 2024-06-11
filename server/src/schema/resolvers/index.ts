import user from './user_resolver';
import customer from './customer_resolver';
import inventory from './inventory_resolver';
import category from './category_resolvers';
import product from './product_resolver';
import notification from './notification_resolver';
import order from './order_resolver';
import userNotification from './userNotificationResolver';
import deliverOrder from './deliver_order_resolver';
import priceQuotation from './price_quotation_resolver';
import paymentInfor from './paymentInfor_resolver';
import vehicle from './vehicle_resolver';

export default [
    user,
    customer,
    inventory,
    category,
    product,
    notification,
    order,
    userNotification,
    deliverOrder,
    priceQuotation,
    paymentInfor,
    vehicle,
];
