import type { Sequelize } from 'sequelize';
import { categories as _categories } from './categories';
import type { categoriesAttributes, categoriesCreationAttributes } from './categories';
import { customer as _customer } from './customer';
import type { customerAttributes, customerCreationAttributes } from './customer';
import { deliverOrder as _deliverOrder } from './deliverOrder';
import type { deliverOrderAttributes, deliverOrderCreationAttributes } from './deliverOrder';
import { inventory as _inventory } from './inventory';
import type { inventoryAttributes, inventoryCreationAttributes } from './inventory';
import { itemGroup as _itemGroup } from './itemGroup';
import type { itemGroupAttributes, itemGroupCreationAttributes } from './itemGroup';
import { notification as _notification } from './notification';
import type { notificationAttributes, notificationCreationAttributes } from './notification';
import { order as _order } from './order';
import type { orderAttributes, orderCreationAttributes } from './order';
import { orderDetail as _orderDetail } from './orderDetail';
import type { orderDetailAttributes, orderDetailCreationAttributes } from './orderDetail';
import { paymentInfor as _paymentInfor } from './paymentInfor';
import type { paymentInforAttributes, paymentInforCreationAttributes } from './paymentInfor';
import { product as _product } from './product';
import type { productAttributes, productCreationAttributes } from './product';
import { user as _user } from './user';
import type { userAttributes, userCreationAttributes } from './user';
import { userNotification as _userNotification } from './userNotification';
import type { userNotificationAttributes, userNotificationCreationAttributes } from './userNotification';

export {
  _categories as categories,
  _customer as customer,
  _deliverOrder as deliverOrder,
  _inventory as inventory,
  _itemGroup as itemGroup,
  _notification as notification,
  _order as order,
  _orderDetail as orderDetail,
  _paymentInfor as paymentInfor,
  _product as product,
  _user as user,
  _userNotification as userNotification,
};

export type {
  categoriesAttributes,
  categoriesCreationAttributes,
  customerAttributes,
  customerCreationAttributes,
  deliverOrderAttributes,
  deliverOrderCreationAttributes,
  inventoryAttributes,
  inventoryCreationAttributes,
  itemGroupAttributes,
  itemGroupCreationAttributes,
  notificationAttributes,
  notificationCreationAttributes,
  orderAttributes,
  orderCreationAttributes,
  orderDetailAttributes,
  orderDetailCreationAttributes,
  paymentInforAttributes,
  paymentInforCreationAttributes,
  productAttributes,
  productCreationAttributes,
  userAttributes,
  userCreationAttributes,
  userNotificationAttributes,
  userNotificationCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const categories = _categories.initModel(sequelize);
  const customer = _customer.initModel(sequelize);
  const deliverOrder = _deliverOrder.initModel(sequelize);
  const inventory = _inventory.initModel(sequelize);
  const itemGroup = _itemGroup.initModel(sequelize);
  const notification = _notification.initModel(sequelize);
  const order = _order.initModel(sequelize);
  const orderDetail = _orderDetail.initModel(sequelize);
  const paymentInfor = _paymentInfor.initModel(sequelize);
  const product = _product.initModel(sequelize);
  const user = _user.initModel(sequelize);
  const userNotification = _userNotification.initModel(sequelize);

  product.belongsTo(categories, { as: 'category_category', foreignKey: 'category'});
  categories.hasMany(product, { as: 'products', foreignKey: 'category'});
  deliverOrder.belongsTo(customer, { as: 'customer', foreignKey: 'customerId'});
  customer.hasMany(deliverOrder, { as: 'deliverOrders', foreignKey: 'customerId'});
  order.belongsTo(customer, { as: 'customer', foreignKey: 'customerId'});
  customer.hasMany(order, { as: 'orders', foreignKey: 'customerId'});
  paymentInfor.belongsTo(customer, { as: 'customer', foreignKey: 'customerId'});
  customer.hasMany(paymentInfor, { as: 'paymentInfors', foreignKey: 'customerId'});
  orderDetail.belongsTo(itemGroup, { as: 'itemGroup', foreignKey: 'itemGroupId'});
  itemGroup.hasMany(orderDetail, { as: 'orderDetails', foreignKey: 'itemGroupId'});
  userNotification.belongsTo(notification, { as: 'notification', foreignKey: 'notificationId'});
  notification.hasMany(userNotification, { as: 'userNotifications', foreignKey: 'notificationId'});
  deliverOrder.belongsTo(order, { as: 'order', foreignKey: 'orderId'});
  order.hasMany(deliverOrder, { as: 'deliverOrders', foreignKey: 'orderId'});
  itemGroup.belongsTo(order, { as: 'order', foreignKey: 'orderId'});
  order.hasMany(itemGroup, { as: 'itemGroups', foreignKey: 'orderId'});
  notification.belongsTo(order, { as: 'order', foreignKey: 'orderId'});
  order.hasMany(notification, { as: 'notifications', foreignKey: 'orderId'});
  paymentInfor.belongsTo(order, { as: 'order', foreignKey: 'orderId'});
  order.hasMany(paymentInfor, { as: 'paymentInfors', foreignKey: 'orderId'});
  orderDetail.belongsTo(product, { as: 'product', foreignKey: 'productId'});
  product.hasMany(orderDetail, { as: 'orderDetails', foreignKey: 'productId'});
  deliverOrder.belongsTo(user, { as: 'driver', foreignKey: 'driverId'});
  user.hasMany(deliverOrder, { as: 'deliverOrders', foreignKey: 'driverId'});
  order.belongsTo(user, { as: 'sale', foreignKey: 'saleId'});
  user.hasMany(order, { as: 'orders', foreignKey: 'saleId'});
  order.belongsTo(user, { as: 'driver', foreignKey: 'driverId'});
  user.hasMany(order, { as: 'driver_orders', foreignKey: 'driverId'});
  userNotification.belongsTo(user, { as: 'user', foreignKey: 'userId'});
  user.hasMany(userNotification, { as: 'userNotifications', foreignKey: 'userId'});

  return {
    categories,
    customer,
    deliverOrder,
    inventory,
    itemGroup,
    notification,
    order,
    orderDetail,
    paymentInfor,
    product,
    user,
    userNotification,
  };
}
