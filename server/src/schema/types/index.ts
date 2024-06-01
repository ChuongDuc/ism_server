import 'graphql-import-node';
import * as root from './root.graphql';
import * as userType from './user.graphql';
import * as customerType from './customers.graphql';
import * as inventoryType from './inventory.graphql';
import * as categoryType from './categories.graphql';
import * as productType from './product.graphql';
import * as orderType from './order.graphql';
import * as notificationType from './notification.graphql';
import * as paymentInforType from './paymentInfor.graphql';
import * as userNotification from './userNotification.graphql';
import * as priceQuotation from './priceQuotation.graphql';
import * as deliverOrderType from './deliverOrder.graphql';

export default [
    root,
    userType,
    customerType,
    inventoryType,
    categoryType,
    productType,
    orderType,
    notificationType,
    paymentInforType,
    userNotification,
    priceQuotation,
    deliverOrderType,
];
