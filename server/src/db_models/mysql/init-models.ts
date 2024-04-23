import type { Sequelize } from 'sequelize';
import { categories as _categories } from './categories';
import type { categoriesAttributes, categoriesCreationAttributes } from './categories';
import { customer as _customer } from './customer';
import type { customerAttributes, customerCreationAttributes } from './customer';
import { inventory as _inventory } from './inventory';
import type { inventoryAttributes, inventoryCreationAttributes } from './inventory';
import { itemGroup as _itemGroup } from './itemGroup';
import type { itemGroupAttributes, itemGroupCreationAttributes } from './itemGroup';
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

export {
  _categories as categories,
  _customer as customer,
  _inventory as inventory,
  _itemGroup as itemGroup,
  _order as order,
  _orderDetail as orderDetail,
  _paymentInfor as paymentInfor,
  _product as product,
  _user as user,
};

export type {
  categoriesAttributes,
  categoriesCreationAttributes,
  customerAttributes,
  customerCreationAttributes,
  inventoryAttributes,
  inventoryCreationAttributes,
  itemGroupAttributes,
  itemGroupCreationAttributes,
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
};

export function initModels(sequelize: Sequelize) {
  const categories = _categories.initModel(sequelize);
  const customer = _customer.initModel(sequelize);
  const inventory = _inventory.initModel(sequelize);
  const itemGroup = _itemGroup.initModel(sequelize);
  const order = _order.initModel(sequelize);
  const orderDetail = _orderDetail.initModel(sequelize);
  const paymentInfor = _paymentInfor.initModel(sequelize);
  const product = _product.initModel(sequelize);
  const user = _user.initModel(sequelize);

  product.belongsTo(categories, { as: 'category', foreignKey: 'categoryId'});
  categories.hasMany(product, { as: 'products', foreignKey: 'categoryId'});
  order.belongsTo(customer, { as: 'customer', foreignKey: 'customerId'});
  customer.hasMany(order, { as: 'orders', foreignKey: 'customerId'});
  paymentInfor.belongsTo(customer, { as: 'customer', foreignKey: 'customerId'});
  customer.hasMany(paymentInfor, { as: 'paymentInfors', foreignKey: 'customerId'});
  orderDetail.belongsTo(itemGroup, { as: 'itemGroup', foreignKey: 'itemGroupId'});
  itemGroup.hasMany(orderDetail, { as: 'orderDetails', foreignKey: 'itemGroupId'});
  itemGroup.belongsTo(order, { as: 'order', foreignKey: 'orderId'});
  order.hasMany(itemGroup, { as: 'itemGroups', foreignKey: 'orderId'});
  paymentInfor.belongsTo(order, { as: 'order', foreignKey: 'orderId'});
  order.hasMany(paymentInfor, { as: 'paymentInfors', foreignKey: 'orderId'});
  orderDetail.belongsTo(product, { as: 'product', foreignKey: 'productId'});
  product.hasMany(orderDetail, { as: 'orderDetails', foreignKey: 'productId'});
  order.belongsTo(user, { as: 'sale', foreignKey: 'saleId'});
  user.hasMany(order, { as: 'orders', foreignKey: 'saleId'});

  return {
    categories,
    customer,
    inventory,
    itemGroup,
    order,
    orderDetail,
    paymentInfor,
    product,
    user,
  };
}
