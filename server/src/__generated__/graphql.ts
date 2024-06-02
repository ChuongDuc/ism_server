import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { user, customer, inventory, categories, product, notification, userNotification, order, paymentInfor, itemGroup, orderDetail, deliverOrder } from '../db_models/mysql/init-models';
import { UserEdge, UserConnection } from '../db_models/mysql/user';
import { CustomerEdge, CustomerConnection } from '../db_models/mysql/customer';
import { InventoryEdge, InventoryConnection } from '../db_models/mysql/inventory';
import { ProductEdge, ProductConnection } from '../db_models/mysql/product';
import { UserNotificationEdge, UserNotificationConnection } from '../db_models/mysql/userNotification';
import { OrderEdge, OrderConnection } from '../db_models/mysql/order';
import { DeliverOrderEdge, DeliverOrderConnection } from '../db_models/mysql/deliverOrder';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: any; output: any; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type ICategory = {
  __typename?: 'Category';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ICategoryOrderInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  products: Array<IProductInput>;
};

export type ICreateCategoryInput = {
  name: Scalars['String']['input'];
};

export type ICreateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
};

export type ICreateDeliverOrderInput = {
  cranesNote?: InputMaybe<Scalars['String']['input']>;
  createById: Scalars['Int']['input'];
  customerId: Scalars['Int']['input'];
  deliveryDate: Scalars['Date']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  documentNote?: InputMaybe<Scalars['String']['input']>;
  driverId?: InputMaybe<Scalars['Int']['input']>;
  itemGroupsNotes?: InputMaybe<Array<IItemGroupsNoteInput>>;
  orderId: Scalars['Int']['input'];
  otherNote?: InputMaybe<Scalars['String']['input']>;
  receivingNote?: InputMaybe<Scalars['String']['input']>;
};

export type ICreateOrderInput = {
  VAT?: InputMaybe<Scalars['Float']['input']>;
  customerId: Scalars['Int']['input'];
  discount?: InputMaybe<Scalars['Float']['input']>;
  saleId: Scalars['Int']['input'];
};

export type ICreatePaymentInforInput = {
  createById: Scalars['Int']['input'];
  customerId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  money: Scalars['Float']['input'];
  orderId: Scalars['Int']['input'];
};

export type ICreatePriceQuotationInput = {
  categoryOrders: Array<ICategoryOrderInput>;
  deliverAddress?: InputMaybe<Scalars['String']['input']>;
  deliveryMethodDescription?: InputMaybe<Scalars['String']['input']>;
  executionTimeDescription?: InputMaybe<Scalars['String']['input']>;
  freightMessage?: InputMaybe<Scalars['String']['input']>;
  freightPrice?: InputMaybe<Scalars['Float']['input']>;
  orderId: Scalars['Int']['input'];
  percentOfAdvancePayment?: InputMaybe<Scalars['Float']['input']>;
  reportingValidityAmount?: InputMaybe<Scalars['Int']['input']>;
  saleId: Scalars['Int']['input'];
  vat?: InputMaybe<Scalars['Float']['input']>;
};

export type ICreateProductInput = {
  categoryId: Scalars['Int']['input'];
  height: Scalars['Float']['input'];
  priceWithVAT: Scalars['Float']['input'];
  priceWithoutVAT: Scalars['Float']['input'];
  productName: Scalars['String']['input'];
  productType: ITypeProduct;
  unit?: InputMaybe<IUnit>;
  weight: Scalars['Float']['input'];
};

export type ICreateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  avatar?: InputMaybe<Scalars['Upload']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  role: IRole;
  userName: Scalars['String']['input'];
};

export type ICustomer = {
  __typename?: 'Customer';
  address?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  orders?: Maybe<Array<Maybe<IOrder>>>;
  phoneNumber: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ICustomerConnection = {
  __typename?: 'CustomerConnection';
  edges?: Maybe<Array<Maybe<ICustomerEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ICustomerEdge = {
  __typename?: 'CustomerEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<ICustomer>;
};

export type IDeleteCustomerInput = {
  ids: Array<Scalars['Int']['input']>;
};

export type IDeleteDeliverOrdersInput = {
  deleteBy: Scalars['Int']['input'];
  ids: Array<Scalars['Int']['input']>;
};

export type IDeleteOrderInput = {
  orderId: Scalars['Int']['input'];
};

export type IDeletePaymentInforInput = {
  deleteBy: Scalars['Int']['input'];
  ids: Array<Scalars['Int']['input']>;
};

export type IDeleteProductByIdInput = {
  productId: Array<Scalars['Int']['input']>;
};

export type IDeleteUserInput = {
  ids: Array<Scalars['Int']['input']>;
};

export type IDeliverOrder = {
  __typename?: 'DeliverOrder';
  cranesNote?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  customer: ICustomer;
  deliveryDate: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  documentNote?: Maybe<Scalars['String']['output']>;
  driver?: Maybe<IUser>;
  id: Scalars['Int']['output'];
  order: IOrder;
  otherNote?: Maybe<Scalars['String']['output']>;
  receivingNote?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type IDeliverOrderConnection = {
  __typename?: 'DeliverOrderConnection';
  edges?: Maybe<Array<Maybe<IDeliverOrderEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IDeliverOrderEdge = {
  __typename?: 'DeliverOrderEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IDeliverOrder>;
};

export type IFilterAllOrderInput = {
  args?: InputMaybe<IPaginationInput>;
  createAt?: InputMaybe<IFilterDate>;
  queryString?: InputMaybe<Scalars['String']['input']>;
  saleId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<IStatusOrder>;
};

export type IFilterAllOrdersResponse = {
  __typename?: 'FilterAllOrdersResponse';
  allOrderCounter: Scalars['Int']['output'];
  creatNewOrderCounter: Scalars['Int']['output'];
  createExportOrderCounter: Scalars['Int']['output'];
  deliveryOrderCounter: Scalars['Int']['output'];
  doneOrderCounter: Scalars['Int']['output'];
  orders?: Maybe<IOrderConnection>;
  paidOrderCounter: Scalars['Int']['output'];
  paymentConfirmationOrderCounter: Scalars['Int']['output'];
  priceQuotationOrderCounter: Scalars['Int']['output'];
  successDeliveryOrderCounter: Scalars['Int']['output'];
  totalCompleted?: Maybe<Scalars['Float']['output']>;
  totalDeliver?: Maybe<Scalars['Float']['output']>;
  totalPaid?: Maybe<Scalars['Float']['output']>;
  totalRevenue?: Maybe<Scalars['Float']['output']>;
};

export enum IFormType {
  Vat = 'VAT',
  Tonnage = 'tonnage'
}

export type IImportFileExcelInventoryInput = {
  fileExcelInventory: Scalars['Upload']['input'];
  fileName: Scalars['String']['input'];
};

export type IImportFileExcelProductsInput = {
  categoryId: Scalars['Int']['input'];
  fileExcelProducts: Scalars['Upload']['input'];
};

export type IInventory = {
  __typename?: 'Inventory';
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  fileName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  productName: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type IInventoryConnection = {
  __typename?: 'InventoryConnection';
  edges?: Maybe<Array<Maybe<IInventoryEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IInventoryEdge = {
  __typename?: 'InventoryEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IInventory>;
};

export type IItemGroup = {
  __typename?: 'ItemGroup';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  orderDetailList?: Maybe<Array<IOrderDetail>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type IItemGroupsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  itemGroupId?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  orderDetails?: InputMaybe<Array<IUpdateProductInput>>;
};

export type IItemGroupsNoteInput = {
  detailListInput?: InputMaybe<Array<IOrderDetailNoteInput>>;
  itemGroupId: Scalars['Int']['input'];
};

export type IListAllCustomerInput = {
  args?: InputMaybe<IPaginationInput>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IListAllDeliverOrderInput = {
  args?: InputMaybe<IPaginationInput>;
  driverId?: InputMaybe<Scalars['Int']['input']>;
  queryString?: InputMaybe<Scalars['String']['input']>;
  saleId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type IListAllDeliverOrderResponse = {
  __typename?: 'ListAllDeliverOrderResponse';
  allOrderCounter: Scalars['Int']['output'];
  creatNewOrderCounter: Scalars['Int']['output'];
  deliverOrder?: Maybe<IDeliverOrderConnection>;
  doneOrderCounter: Scalars['Int']['output'];
  inProcessingCounter: Scalars['Int']['output'];
};

export type IListAllInventoryInput = {
  args?: InputMaybe<IPaginationInput>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IListAllProductsInput = {
  args?: InputMaybe<IPaginationInput>;
  category?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  typeProduct?: InputMaybe<ITypeProduct>;
  unit?: InputMaybe<IUnit>;
};

export type IListArrayUserNotificationInput = {
  event?: InputMaybe<INotificationEvent>;
  userId: Scalars['Int']['input'];
};

export type IListUserNotificationInput = {
  args?: InputMaybe<IPaginationInput>;
  event?: InputMaybe<INotificationEvent>;
  userId: Scalars['Int']['input'];
};

export type IMutation = {
  __typename?: 'Mutation';
  createCategory: ICategory;
  createCustomer: ICustomer;
  createDeliverOrder: IDeliverOrder;
  createOrder: IOrder;
  createPaymentInfo: ISuccessResponse;
  createPriceQuotation: Array<Maybe<IItemGroup>>;
  createProduct: IProduct;
  createUser: IUser;
  deleteCustomer: ISuccessResponse;
  deleteDeliverOrders: ISuccessResponse;
  deleteOrder: ISuccessResponse;
  deletePaymentInfo: ISuccessResponse;
  deleteProductById: ISuccessResponse;
  deleteUser: ISuccessResponse;
  importFileExcelInventory: Array<Maybe<IInventory>>;
  importFileExcelProducts: Array<Maybe<IProduct>>;
  resetPassword: ISuccessResponse;
  updateCategory: ISuccessResponse;
  updateCustomer: ISuccessResponse;
  updateDeliverOrder: ISuccessResponse;
  updateOrder: ISuccessResponse;
  updatePaymentInfo: ISuccessResponse;
  updatePriceQuotation: ISuccessResponse;
  updateProductById: ISuccessResponse;
  updateProductPriceById: ISuccessResponse;
  updateStatusOrderForDriver: ISuccessResponse;
  updateStatusOrderOfAccountant: ISuccessResponse;
  updateStatusUserNotification: ISuccessResponse;
  updateUser: ISuccessResponse;
};


export type IMutationCreateCategoryArgs = {
  input: ICreateCategoryInput;
};


export type IMutationCreateCustomerArgs = {
  input: ICreateCustomerInput;
};


export type IMutationCreateDeliverOrderArgs = {
  input: ICreateDeliverOrderInput;
};


export type IMutationCreateOrderArgs = {
  input: ICreateOrderInput;
};


export type IMutationCreatePaymentInfoArgs = {
  input: ICreatePaymentInforInput;
};


export type IMutationCreatePriceQuotationArgs = {
  input: ICreatePriceQuotationInput;
};


export type IMutationCreateProductArgs = {
  input: ICreateProductInput;
};


export type IMutationCreateUserArgs = {
  input: ICreateUserInput;
};


export type IMutationDeleteCustomerArgs = {
  input: IDeleteCustomerInput;
};


export type IMutationDeleteDeliverOrdersArgs = {
  input: IDeleteDeliverOrdersInput;
};


export type IMutationDeleteOrderArgs = {
  input: IDeleteOrderInput;
};


export type IMutationDeletePaymentInfoArgs = {
  input: IDeletePaymentInforInput;
};


export type IMutationDeleteProductByIdArgs = {
  input: IDeleteProductByIdInput;
};


export type IMutationDeleteUserArgs = {
  input: IDeleteUserInput;
};


export type IMutationImportFileExcelInventoryArgs = {
  input: IImportFileExcelInventoryInput;
};


export type IMutationImportFileExcelProductsArgs = {
  input: IImportFileExcelProductsInput;
};


export type IMutationResetPasswordArgs = {
  input: IResetPasswordInput;
};


export type IMutationUpdateCategoryArgs = {
  input: IUpdateCategoryInput;
};


export type IMutationUpdateCustomerArgs = {
  input: IUpdateCustomerInput;
};


export type IMutationUpdateDeliverOrderArgs = {
  input: IUpdateDeliverOrderInput;
};


export type IMutationUpdateOrderArgs = {
  input: IUpdateOrderInput;
};


export type IMutationUpdatePaymentInfoArgs = {
  input: IUpdatePaymentInforInput;
};


export type IMutationUpdatePriceQuotationArgs = {
  input: IUpdatePriceQuotationInput;
};


export type IMutationUpdateProductByIdArgs = {
  input: IUpdateProductByIdInput;
};


export type IMutationUpdateProductPriceByIdArgs = {
  input: IUpdateProductPriceByIdInput;
};


export type IMutationUpdateStatusOrderForDriverArgs = {
  input: IUpdateStatusOrderForDriverInput;
};


export type IMutationUpdateStatusOrderOfAccountantArgs = {
  input: IUpdateStatusOrderOfAccountantInput;
};


export type IMutationUpdateStatusUserNotificationArgs = {
  input: IUpdateStatusUserNotificationInput;
};


export type IMutationUpdateUserArgs = {
  input: IUpdateUserInput;
};

export type INotification = {
  __typename?: 'Notification';
  Order?: Maybe<IOrder>;
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  event: INotificationEvent;
  id: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
};

export enum INotificationEvent {
  Common = 'Common',
  DeliverResolverDelete = 'DeliverResolverDelete',
  DeliverResolverUpdated = 'DeliverResolverUpdated',
  NewCustomer = 'NewCustomer',
  NewDeliverResolver = 'NewDeliverResolver',
  NewMessage = 'NewMessage',
  NewOrder = 'NewOrder',
  NewProduct = 'NewProduct',
  OrderStatusChanged = 'OrderStatusChanged',
  Payment = 'Payment',
  PaymentChanged = 'PaymentChanged',
  ProductUpdated = 'ProductUpdated'
}

export type INotificationResponse = {
  __typename?: 'NotificationResponse';
  message: Scalars['String']['output'];
  notification?: Maybe<INotification>;
  order?: Maybe<IOrder>;
};

export type IOrder = {
  __typename?: 'Order';
  VAT?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  customer: ICustomer;
  deliverAddress?: Maybe<Scalars['String']['output']>;
  deliverOrderList?: Maybe<Array<Maybe<IDeliverOrder>>>;
  deliveryMethodDescription?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['Float']['output']>;
  driver?: Maybe<IUser>;
  executionTimeDescription?: Maybe<Scalars['String']['output']>;
  freightMessage?: Maybe<Scalars['String']['output']>;
  freightPrice?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  invoiceNo: Scalars['String']['output'];
  itemGroupList?: Maybe<Array<Maybe<IItemGroup>>>;
  paymentList?: Maybe<Array<Maybe<IPaymentInfor>>>;
  percentOfAdvancePayment?: Maybe<Scalars['Float']['output']>;
  remainingPaymentMoney?: Maybe<Scalars['Float']['output']>;
  reportingValidityAmount?: Maybe<Scalars['Int']['output']>;
  sale: IUser;
  status?: Maybe<IStatusOrder>;
  totalMoney?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type IOrderConnection = {
  __typename?: 'OrderConnection';
  edges?: Maybe<Array<Maybe<IOrderEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IOrderDetail = {
  __typename?: 'OrderDetail';
  createdAt?: Maybe<Scalars['Date']['output']>;
  deliveryMethodNote?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  itemGroup: IItemGroup;
  otherNote?: Maybe<Scalars['String']['output']>;
  priceProduct: Scalars['Float']['output'];
  product: IProduct;
  quantity: Scalars['Float']['output'];
  totalWeight?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  weightProduct?: Maybe<Scalars['Float']['output']>;
};

export type IOrderDetailNoteInput = {
  deliveryMethodNote?: InputMaybe<Scalars['String']['input']>;
  orderDetailId: Scalars['Int']['input'];
  otherNote?: InputMaybe<Scalars['String']['input']>;
};

export type IOrderEdge = {
  __typename?: 'OrderEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IOrder>;
};

export type IPageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type IPaginationInput = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type IPaymentInfor = {
  __typename?: 'PaymentInfor';
  createdAt?: Maybe<Scalars['Date']['output']>;
  customer: ICustomer;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  money?: Maybe<Scalars['Float']['output']>;
  order: IOrder;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type IProduct = {
  __typename?: 'Product';
  available?: Maybe<Scalars['Float']['output']>;
  category: ICategory;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  formType?: Maybe<IFormType>;
  height: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  priceWithVAT: Scalars['Float']['output'];
  priceWithoutVAT: Scalars['Float']['output'];
  subCategory?: Maybe<Scalars['String']['output']>;
  type: ITypeProduct;
  unit?: Maybe<IUnit>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  weight: Scalars['Float']['output'];
  width?: Maybe<Scalars['Float']['output']>;
};

export type IProductConnection = {
  __typename?: 'ProductConnection';
  edges?: Maybe<Array<Maybe<IProductEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IProductDetailInput = {
  id: Scalars['Int']['input'];
};

export type IProductEdge = {
  __typename?: 'ProductEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IProduct>;
};

export type IQuery = {
  __typename?: 'Query';
  filterAllOrder: IFilterAllOrdersResponse;
  getAllCategory: Array<Maybe<ICategory>>;
  getOrderById: IOrder;
  getUserById: IUser;
  listAllCustomer: ICustomerConnection;
  listAllDeliverOrder: IListAllDeliverOrderResponse;
  listAllInventory: IInventoryConnection;
  listAllProducts: IProductConnection;
  listArrayUserNotification: Array<Maybe<IUserNotification>>;
  listUserNotification: IUserNotificationConnection;
  login: IUserLoginResponse;
  me: IUser;
  productDetail: IProduct;
  users: IUserConnection;
};


export type IQueryFilterAllOrderArgs = {
  input: IFilterAllOrderInput;
};


export type IQueryGetOrderByIdArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryGetUserByIdArgs = {
  userId: Scalars['Int']['input'];
};


export type IQueryListAllCustomerArgs = {
  input: IListAllCustomerInput;
};


export type IQueryListAllDeliverOrderArgs = {
  input: IListAllDeliverOrderInput;
};


export type IQueryListAllInventoryArgs = {
  input: IListAllInventoryInput;
};


export type IQueryListAllProductsArgs = {
  input: IListAllProductsInput;
};


export type IQueryListArrayUserNotificationArgs = {
  input: IListArrayUserNotificationInput;
};


export type IQueryListUserNotificationArgs = {
  input: IListUserNotificationInput;
};


export type IQueryLoginArgs = {
  input: IUserLoginInput;
};


export type IQueryProductDetailArgs = {
  input: IProductDetailInput;
};


export type IQueryUsersArgs = {
  input: IUsersInput;
};

export type IResetPasswordInput = {
  userId: Scalars['Int']['input'];
};

export enum IRole {
  Accountant = 'Accountant',
  Admin = 'Admin',
  AssistantDriver = 'AssistantDriver',
  Director = 'Director',
  Driver = 'Driver',
  Manager = 'Manager',
  Sales = 'Sales',
  TransporterManager = 'TransporterManager'
}

export enum IStatusOrder {
  CreatNew = 'creatNew',
  CreateExportOrder = 'createExportOrder',
  Delivery = 'delivery',
  Done = 'done',
  Paid = 'paid',
  PaymentConfirmation = 'paymentConfirmation',
  PriceQuotation = 'priceQuotation',
  SuccessDelivery = 'successDelivery'
}

export type ISubscribeNotificationsInput = {
  /** excludingEvent: Khi user không muốn nhận thông từ 1 sự kiện nào đó */
  excludingEvent?: InputMaybe<Array<INotificationEvent>>;
  /** #### User Id: ID của user sẽ nhận đc các thông báo */
  userId: Scalars['Int']['input'];
};

export type ISubscription = {
  __typename?: 'Subscription';
  subscribeNotifications: INotificationResponse;
};


export type ISubscriptionSubscribeNotificationsArgs = {
  input: ISubscribeNotificationsInput;
};

export enum ISuccessResponse {
  Success = 'success'
}

export enum ITypeProduct {
  Plate = 'plate',
  Shape = 'shape'
}

export enum IUnit {
  Cai = 'cai',
  Chiec = 'chiec',
  Cuon = 'cuon',
  Kg = 'kg',
  M = 'm',
  M2 = 'm2',
  Md = 'md',
  Pipe = 'pipe',
  Plate = 'plate'
}

export type IUpdateCategoryInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateDeliverOrderInput = {
  cranesNote?: InputMaybe<Scalars['String']['input']>;
  deliverOrderId: Scalars['Int']['input'];
  deliveryDate?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  documentNote?: InputMaybe<Scalars['String']['input']>;
  driverId?: InputMaybe<Scalars['Int']['input']>;
  itemGroupsNotes?: InputMaybe<Array<IItemGroupsNoteInput>>;
  otherNote?: InputMaybe<Scalars['String']['input']>;
  receivingNote?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateDeliverOrderNoteInput = {
  cranesNote?: InputMaybe<Scalars['String']['input']>;
  deliverOrderId: Scalars['Int']['input'];
  documentNote?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  otherNote?: InputMaybe<Scalars['String']['input']>;
  receiver?: InputMaybe<Scalars['String']['input']>;
  receiverPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  receivingNote?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateOrderInput = {
  VAT?: InputMaybe<Scalars['Float']['input']>;
  customerId?: InputMaybe<Scalars['Int']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  driver?: InputMaybe<Scalars['Int']['input']>;
  orderId: Scalars['Int']['input'];
  saleId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<IStatusOrder>;
};

export type IUpdatePaymentInforInput = {
  customerId?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  money?: InputMaybe<Scalars['Float']['input']>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['Int']['input'];
};

export type IUpdatePriceQuotationInput = {
  deliverAddress?: InputMaybe<Scalars['String']['input']>;
  deliveryMethodDescription?: InputMaybe<Scalars['String']['input']>;
  executionTimeDescription?: InputMaybe<Scalars['String']['input']>;
  freightMessage?: InputMaybe<Scalars['String']['input']>;
  freightPrice?: InputMaybe<Scalars['Float']['input']>;
  itemGroups?: InputMaybe<Array<IItemGroupsInput>>;
  orderId: Scalars['Int']['input'];
  percentOfAdvancePayment?: InputMaybe<Scalars['Float']['input']>;
  reportingValidityAmount?: InputMaybe<Scalars['Int']['input']>;
  saleId: Scalars['Int']['input'];
  vat?: InputMaybe<Scalars['Float']['input']>;
};

export type IUpdateProductByIdInput = {
  categoryId: Scalars['Int']['input'];
  height?: InputMaybe<Scalars['Float']['input']>;
  priceWithVAT?: InputMaybe<Scalars['Float']['input']>;
  priceWithoutVAT?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['Int']['input'];
  productName?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<IUnit>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type IUpdateProductInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  orderDetailId?: InputMaybe<Scalars['Int']['input']>;
  priceProduct?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  totalWeight?: InputMaybe<Scalars['Float']['input']>;
  weightProduct?: InputMaybe<Scalars['Float']['input']>;
};

export type IUpdateProductPriceByIdInput = {
  priceWithVAT?: InputMaybe<Scalars['Float']['input']>;
  priceWithoutVAT?: InputMaybe<Scalars['Float']['input']>;
  productId: Array<Scalars['Int']['input']>;
};

export type IUpdateStatusOrderForDriverInput = {
  deliverOrder: Array<IUpdateDeliverOrderNoteInput>;
  orderId: Scalars['Int']['input'];
  statusOrder: IStatusOrder;
  userId: Scalars['Int']['input'];
};

export type IUpdateStatusOrderOfAccountantInput = {
  deliverOrder: Array<IUpdateDeliverOrderNoteInput>;
  orderId: Scalars['Int']['input'];
  statusOrder: IStatusOrder;
  userId: Scalars['Int']['input'];
};

export type IUpdateStatusUserNotificationInput = {
  isRead: Scalars['Boolean']['input'];
  userNotificationIds: Array<Scalars['Int']['input']>;
};

export type IUpdateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  avatarURL?: InputMaybe<Scalars['Upload']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  newPassword?: InputMaybe<Scalars['String']['input']>;
  oldPassword?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<IRole>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type IUser = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']['output']>;
  avatarURL?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  role?: Maybe<IRole>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userName: Scalars['String']['output'];
};

export type IUserConnection = {
  __typename?: 'UserConnection';
  edges?: Maybe<Array<Maybe<IUserEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IUserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IUser>;
};

export type IUserLoginInput = {
  account: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type IUserLoginResponse = {
  __typename?: 'UserLoginResponse';
  token: Scalars['String']['output'];
  user: IUser;
};

export type IUserNotification = {
  __typename?: 'UserNotification';
  createdAt?: Maybe<Scalars['Date']['output']>;
  idUserNotification: Scalars['Int']['output'];
  isRead: Scalars['Boolean']['output'];
  notification: INotification;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user: IUser;
};

export type IUserNotificationConnection = {
  __typename?: 'UserNotificationConnection';
  edges?: Maybe<Array<Maybe<IUserNotificationEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IUserNotificationEdge = {
  __typename?: 'UserNotificationEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IUserNotification>;
};

export type IUsersInput = {
  args?: InputMaybe<IPaginationInput>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<IRole>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IFilterDate = {
  endAt: Scalars['Date']['input'];
  startAt: Scalars['Date']['input'];
};

export type IProductInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  priceProduct: Scalars['Float']['input'];
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  totalWeight?: InputMaybe<Scalars['Float']['input']>;
  weightProduct?: InputMaybe<Scalars['Float']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type IResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<categories>;
  CategoryOrderInput: ICategoryOrderInput;
  CreateCategoryInput: ICreateCategoryInput;
  CreateCustomerInput: ICreateCustomerInput;
  CreateDeliverOrderInput: ICreateDeliverOrderInput;
  CreateOrderInput: ICreateOrderInput;
  CreatePaymentInforInput: ICreatePaymentInforInput;
  CreatePriceQuotationInput: ICreatePriceQuotationInput;
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
  Customer: ResolverTypeWrapper<customer>;
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>;
  CustomerEdge: ResolverTypeWrapper<CustomerEdge>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteDeliverOrdersInput: IDeleteDeliverOrdersInput;
  DeleteOrderInput: IDeleteOrderInput;
  DeletePaymentInforInput: IDeletePaymentInforInput;
  DeleteProductByIdInput: IDeleteProductByIdInput;
  DeleteUserInput: IDeleteUserInput;
  DeliverOrder: ResolverTypeWrapper<deliverOrder>;
  DeliverOrderConnection: ResolverTypeWrapper<DeliverOrderConnection>;
  DeliverOrderEdge: ResolverTypeWrapper<DeliverOrderEdge>;
  FilterAllOrderInput: IFilterAllOrderInput;
  FilterAllOrdersResponse: ResolverTypeWrapper<Omit<IFilterAllOrdersResponse, 'orders'> & { orders?: Maybe<IResolversTypes['OrderConnection']> }>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FormType: IFormType;
  ImportFileExcelInventoryInput: IImportFileExcelInventoryInput;
  ImportFileExcelProductsInput: IImportFileExcelProductsInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Inventory: ResolverTypeWrapper<inventory>;
  InventoryConnection: ResolverTypeWrapper<InventoryConnection>;
  InventoryEdge: ResolverTypeWrapper<InventoryEdge>;
  ItemGroup: ResolverTypeWrapper<itemGroup>;
  ItemGroupsInput: IItemGroupsInput;
  ItemGroupsNoteInput: IItemGroupsNoteInput;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  ListAllCustomerInput: IListAllCustomerInput;
  ListAllDeliverOrderInput: IListAllDeliverOrderInput;
  ListAllDeliverOrderResponse: ResolverTypeWrapper<Omit<IListAllDeliverOrderResponse, 'deliverOrder'> & { deliverOrder?: Maybe<IResolversTypes['DeliverOrderConnection']> }>;
  ListAllInventoryInput: IListAllInventoryInput;
  ListAllProductsInput: IListAllProductsInput;
  ListArrayUserNotificationInput: IListArrayUserNotificationInput;
  ListUserNotificationInput: IListUserNotificationInput;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<notification>;
  NotificationEvent: INotificationEvent;
  NotificationResponse: ResolverTypeWrapper<Omit<INotificationResponse, 'notification' | 'order'> & { notification?: Maybe<IResolversTypes['Notification']>, order?: Maybe<IResolversTypes['Order']> }>;
  Order: ResolverTypeWrapper<order>;
  OrderConnection: ResolverTypeWrapper<OrderConnection>;
  OrderDetail: ResolverTypeWrapper<orderDetail>;
  OrderDetailNoteInput: IOrderDetailNoteInput;
  OrderEdge: ResolverTypeWrapper<OrderEdge>;
  PageInfo: ResolverTypeWrapper<IPageInfo>;
  PaginationInput: IPaginationInput;
  PaymentInfor: ResolverTypeWrapper<paymentInfor>;
  Product: ResolverTypeWrapper<product>;
  ProductConnection: ResolverTypeWrapper<ProductConnection>;
  ProductDetailInput: IProductDetailInput;
  ProductEdge: ResolverTypeWrapper<ProductEdge>;
  Query: ResolverTypeWrapper<{}>;
  ResetPasswordInput: IResetPasswordInput;
  Role: IRole;
  StatusOrder: IStatusOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubscribeNotificationsInput: ISubscribeNotificationsInput;
  Subscription: ResolverTypeWrapper<{}>;
  SuccessResponse: ISuccessResponse;
  TypeProduct: ITypeProduct;
  Unit: IUnit;
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateDeliverOrderInput: IUpdateDeliverOrderInput;
  UpdateDeliverOrderNoteInput: IUpdateDeliverOrderNoteInput;
  UpdateOrderInput: IUpdateOrderInput;
  UpdatePaymentInforInput: IUpdatePaymentInforInput;
  UpdatePriceQuotationInput: IUpdatePriceQuotationInput;
  UpdateProductByIdInput: IUpdateProductByIdInput;
  UpdateProductInput: IUpdateProductInput;
  UpdateProductPriceByIdInput: IUpdateProductPriceByIdInput;
  UpdateStatusOrderForDriverInput: IUpdateStatusOrderForDriverInput;
  UpdateStatusOrderOfAccountantInput: IUpdateStatusOrderOfAccountantInput;
  UpdateStatusUserNotificationInput: IUpdateStatusUserNotificationInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<user>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: ResolverTypeWrapper<Omit<IUserLoginResponse, 'user'> & { user: IResolversTypes['User'] }>;
  UserNotification: ResolverTypeWrapper<userNotification>;
  UserNotificationConnection: ResolverTypeWrapper<UserNotificationConnection>;
  UserNotificationEdge: ResolverTypeWrapper<UserNotificationEdge>;
  UsersInput: IUsersInput;
  filterDate: IFilterDate;
  productInput: IProductInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Category: categories;
  CategoryOrderInput: ICategoryOrderInput;
  CreateCategoryInput: ICreateCategoryInput;
  CreateCustomerInput: ICreateCustomerInput;
  CreateDeliverOrderInput: ICreateDeliverOrderInput;
  CreateOrderInput: ICreateOrderInput;
  CreatePaymentInforInput: ICreatePaymentInforInput;
  CreatePriceQuotationInput: ICreatePriceQuotationInput;
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: Scalars['Cursor']['output'];
  Customer: customer;
  CustomerConnection: CustomerConnection;
  CustomerEdge: CustomerEdge;
  Date: Scalars['Date']['output'];
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteDeliverOrdersInput: IDeleteDeliverOrdersInput;
  DeleteOrderInput: IDeleteOrderInput;
  DeletePaymentInforInput: IDeletePaymentInforInput;
  DeleteProductByIdInput: IDeleteProductByIdInput;
  DeleteUserInput: IDeleteUserInput;
  DeliverOrder: deliverOrder;
  DeliverOrderConnection: DeliverOrderConnection;
  DeliverOrderEdge: DeliverOrderEdge;
  FilterAllOrderInput: IFilterAllOrderInput;
  FilterAllOrdersResponse: Omit<IFilterAllOrdersResponse, 'orders'> & { orders?: Maybe<IResolversParentTypes['OrderConnection']> };
  Float: Scalars['Float']['output'];
  ImportFileExcelInventoryInput: IImportFileExcelInventoryInput;
  ImportFileExcelProductsInput: IImportFileExcelProductsInput;
  Int: Scalars['Int']['output'];
  Inventory: inventory;
  InventoryConnection: InventoryConnection;
  InventoryEdge: InventoryEdge;
  ItemGroup: itemGroup;
  ItemGroupsInput: IItemGroupsInput;
  ItemGroupsNoteInput: IItemGroupsNoteInput;
  JSON: Scalars['JSON']['output'];
  ListAllCustomerInput: IListAllCustomerInput;
  ListAllDeliverOrderInput: IListAllDeliverOrderInput;
  ListAllDeliverOrderResponse: Omit<IListAllDeliverOrderResponse, 'deliverOrder'> & { deliverOrder?: Maybe<IResolversParentTypes['DeliverOrderConnection']> };
  ListAllInventoryInput: IListAllInventoryInput;
  ListAllProductsInput: IListAllProductsInput;
  ListArrayUserNotificationInput: IListArrayUserNotificationInput;
  ListUserNotificationInput: IListUserNotificationInput;
  Mutation: {};
  Notification: notification;
  NotificationResponse: Omit<INotificationResponse, 'notification' | 'order'> & { notification?: Maybe<IResolversParentTypes['Notification']>, order?: Maybe<IResolversParentTypes['Order']> };
  Order: order;
  OrderConnection: OrderConnection;
  OrderDetail: orderDetail;
  OrderDetailNoteInput: IOrderDetailNoteInput;
  OrderEdge: OrderEdge;
  PageInfo: IPageInfo;
  PaginationInput: IPaginationInput;
  PaymentInfor: paymentInfor;
  Product: product;
  ProductConnection: ProductConnection;
  ProductDetailInput: IProductDetailInput;
  ProductEdge: ProductEdge;
  Query: {};
  ResetPasswordInput: IResetPasswordInput;
  String: Scalars['String']['output'];
  SubscribeNotificationsInput: ISubscribeNotificationsInput;
  Subscription: {};
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateDeliverOrderInput: IUpdateDeliverOrderInput;
  UpdateDeliverOrderNoteInput: IUpdateDeliverOrderNoteInput;
  UpdateOrderInput: IUpdateOrderInput;
  UpdatePaymentInforInput: IUpdatePaymentInforInput;
  UpdatePriceQuotationInput: IUpdatePriceQuotationInput;
  UpdateProductByIdInput: IUpdateProductByIdInput;
  UpdateProductInput: IUpdateProductInput;
  UpdateProductPriceByIdInput: IUpdateProductPriceByIdInput;
  UpdateStatusOrderForDriverInput: IUpdateStatusOrderForDriverInput;
  UpdateStatusOrderOfAccountantInput: IUpdateStatusOrderOfAccountantInput;
  UpdateStatusUserNotificationInput: IUpdateStatusUserNotificationInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: Scalars['Upload']['output'];
  User: user;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: Omit<IUserLoginResponse, 'user'> & { user: IResolversParentTypes['User'] };
  UserNotification: userNotification;
  UserNotificationConnection: UserNotificationConnection;
  UserNotificationEdge: UserNotificationEdge;
  UsersInput: IUsersInput;
  filterDate: IFilterDate;
  productInput: IProductInput;
};

export type ICategoryResolvers<ContextType = any, ParentType extends IResolversParentTypes['Category'] = IResolversParentTypes['Category']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface ICursorScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export type ICustomerResolvers<ContextType = any, ParentType extends IResolversParentTypes['Customer'] = IResolversParentTypes['Customer']> = {
  address?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  company?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  orders?: Resolver<Maybe<Array<Maybe<IResolversTypes['Order']>>>, ParentType, ContextType>;
  phoneNumber?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICustomerConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['CustomerConnection'] = IResolversParentTypes['CustomerConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['CustomerEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICustomerEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['CustomerEdge'] = IResolversParentTypes['CustomerEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['Customer']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IDateScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['Date'], any> {
  name: 'Date';
}

export type IDeliverOrderResolvers<ContextType = any, ParentType extends IResolversParentTypes['DeliverOrder'] = IResolversParentTypes['DeliverOrder']> = {
  cranesNote?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType>;
  deliveryDate?: Resolver<IResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  documentNote?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  driver?: Resolver<Maybe<IResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  order?: Resolver<IResolversTypes['Order'], ParentType, ContextType>;
  otherNote?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  receivingNote?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IDeliverOrderConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['DeliverOrderConnection'] = IResolversParentTypes['DeliverOrderConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['DeliverOrderEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IDeliverOrderEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['DeliverOrderEdge'] = IResolversParentTypes['DeliverOrderEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['DeliverOrder']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IFilterAllOrdersResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['FilterAllOrdersResponse'] = IResolversParentTypes['FilterAllOrdersResponse']> = {
  allOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  creatNewOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  createExportOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  deliveryOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  doneOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  orders?: Resolver<Maybe<IResolversTypes['OrderConnection']>, ParentType, ContextType>;
  paidOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  paymentConfirmationOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  priceQuotationOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  successDeliveryOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  totalCompleted?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  totalDeliver?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  totalPaid?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  totalRevenue?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IInventoryResolvers<ContextType = any, ParentType extends IResolversParentTypes['Inventory'] = IResolversParentTypes['Inventory']> = {
  code?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  fileName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  productName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  unit?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IInventoryConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['InventoryConnection'] = IResolversParentTypes['InventoryConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['InventoryEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IInventoryEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['InventoryEdge'] = IResolversParentTypes['InventoryEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['Inventory']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IItemGroupResolvers<ContextType = any, ParentType extends IResolversParentTypes['ItemGroup'] = IResolversParentTypes['ItemGroup']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  orderDetailList?: Resolver<Maybe<Array<IResolversTypes['OrderDetail']>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IJsonScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type IListAllDeliverOrderResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['ListAllDeliverOrderResponse'] = IResolversParentTypes['ListAllDeliverOrderResponse']> = {
  allOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  creatNewOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  deliverOrder?: Resolver<Maybe<IResolversTypes['DeliverOrderConnection']>, ParentType, ContextType>;
  doneOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  inProcessingCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMutationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation']> = {
  createCategory?: Resolver<IResolversTypes['Category'], ParentType, ContextType, RequireFields<IMutationCreateCategoryArgs, 'input'>>;
  createCustomer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType, RequireFields<IMutationCreateCustomerArgs, 'input'>>;
  createDeliverOrder?: Resolver<IResolversTypes['DeliverOrder'], ParentType, ContextType, RequireFields<IMutationCreateDeliverOrderArgs, 'input'>>;
  createOrder?: Resolver<IResolversTypes['Order'], ParentType, ContextType, RequireFields<IMutationCreateOrderArgs, 'input'>>;
  createPaymentInfo?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationCreatePaymentInfoArgs, 'input'>>;
  createPriceQuotation?: Resolver<Array<Maybe<IResolversTypes['ItemGroup']>>, ParentType, ContextType, RequireFields<IMutationCreatePriceQuotationArgs, 'input'>>;
  createProduct?: Resolver<IResolversTypes['Product'], ParentType, ContextType, RequireFields<IMutationCreateProductArgs, 'input'>>;
  createUser?: Resolver<IResolversTypes['User'], ParentType, ContextType, RequireFields<IMutationCreateUserArgs, 'input'>>;
  deleteCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteCustomerArgs, 'input'>>;
  deleteDeliverOrders?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteDeliverOrdersArgs, 'input'>>;
  deleteOrder?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteOrderArgs, 'input'>>;
  deletePaymentInfo?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeletePaymentInfoArgs, 'input'>>;
  deleteProductById?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteProductByIdArgs, 'input'>>;
  deleteUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteUserArgs, 'input'>>;
  importFileExcelInventory?: Resolver<Array<Maybe<IResolversTypes['Inventory']>>, ParentType, ContextType, RequireFields<IMutationImportFileExcelInventoryArgs, 'input'>>;
  importFileExcelProducts?: Resolver<Array<Maybe<IResolversTypes['Product']>>, ParentType, ContextType, RequireFields<IMutationImportFileExcelProductsArgs, 'input'>>;
  resetPassword?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationResetPasswordArgs, 'input'>>;
  updateCategory?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCategoryArgs, 'input'>>;
  updateCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCustomerArgs, 'input'>>;
  updateDeliverOrder?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateDeliverOrderArgs, 'input'>>;
  updateOrder?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateOrderArgs, 'input'>>;
  updatePaymentInfo?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdatePaymentInfoArgs, 'input'>>;
  updatePriceQuotation?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdatePriceQuotationArgs, 'input'>>;
  updateProductById?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateProductByIdArgs, 'input'>>;
  updateProductPriceById?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateProductPriceByIdArgs, 'input'>>;
  updateStatusOrderForDriver?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateStatusOrderForDriverArgs, 'input'>>;
  updateStatusOrderOfAccountant?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateStatusOrderOfAccountantArgs, 'input'>>;
  updateStatusUserNotification?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateStatusUserNotificationArgs, 'input'>>;
  updateUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateUserArgs, 'input'>>;
};

export type INotificationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Notification'] = IResolversParentTypes['Notification']> = {
  Order?: Resolver<Maybe<IResolversTypes['Order']>, ParentType, ContextType>;
  content?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['Date'], ParentType, ContextType>;
  event?: Resolver<IResolversTypes['NotificationEvent'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type INotificationResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['NotificationResponse'] = IResolversParentTypes['NotificationResponse']> = {
  message?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  notification?: Resolver<Maybe<IResolversTypes['Notification']>, ParentType, ContextType>;
  order?: Resolver<Maybe<IResolversTypes['Order']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOrderResolvers<ContextType = any, ParentType extends IResolversParentTypes['Order'] = IResolversParentTypes['Order']> = {
  VAT?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType>;
  deliverAddress?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  deliverOrderList?: Resolver<Maybe<Array<Maybe<IResolversTypes['DeliverOrder']>>>, ParentType, ContextType>;
  deliveryMethodDescription?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  discount?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  driver?: Resolver<Maybe<IResolversTypes['User']>, ParentType, ContextType>;
  executionTimeDescription?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  freightMessage?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  freightPrice?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  invoiceNo?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  itemGroupList?: Resolver<Maybe<Array<Maybe<IResolversTypes['ItemGroup']>>>, ParentType, ContextType>;
  paymentList?: Resolver<Maybe<Array<Maybe<IResolversTypes['PaymentInfor']>>>, ParentType, ContextType>;
  percentOfAdvancePayment?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  remainingPaymentMoney?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  reportingValidityAmount?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  sale?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  status?: Resolver<Maybe<IResolversTypes['StatusOrder']>, ParentType, ContextType>;
  totalMoney?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOrderConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['OrderConnection'] = IResolversParentTypes['OrderConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['OrderEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOrderDetailResolvers<ContextType = any, ParentType extends IResolversParentTypes['OrderDetail'] = IResolversParentTypes['OrderDetail']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  deliveryMethodNote?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  itemGroup?: Resolver<IResolversTypes['ItemGroup'], ParentType, ContextType>;
  otherNote?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  priceProduct?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  product?: Resolver<IResolversTypes['Product'], ParentType, ContextType>;
  quantity?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  totalWeight?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  weightProduct?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOrderEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['OrderEdge'] = IResolversParentTypes['OrderEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['Order']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IPageInfoResolvers<ContextType = any, ParentType extends IResolversParentTypes['PageInfo'] = IResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<IResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IPaymentInforResolvers<ContextType = any, ParentType extends IResolversParentTypes['PaymentInfor'] = IResolversParentTypes['PaymentInfor']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  money?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  order?: Resolver<IResolversTypes['Order'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IProductResolvers<ContextType = any, ParentType extends IResolversParentTypes['Product'] = IResolversParentTypes['Product']> = {
  available?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  category?: Resolver<IResolversTypes['Category'], ParentType, ContextType>;
  code?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  formType?: Resolver<Maybe<IResolversTypes['FormType']>, ParentType, ContextType>;
  height?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  priceWithVAT?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  priceWithoutVAT?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  subCategory?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<IResolversTypes['TypeProduct'], ParentType, ContextType>;
  unit?: Resolver<Maybe<IResolversTypes['Unit']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  weight?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  width?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IProductConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['ProductConnection'] = IResolversParentTypes['ProductConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['ProductEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IProductEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['ProductEdge'] = IResolversParentTypes['ProductEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['Product']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IQueryResolvers<ContextType = any, ParentType extends IResolversParentTypes['Query'] = IResolversParentTypes['Query']> = {
  filterAllOrder?: Resolver<IResolversTypes['FilterAllOrdersResponse'], ParentType, ContextType, RequireFields<IQueryFilterAllOrderArgs, 'input'>>;
  getAllCategory?: Resolver<Array<Maybe<IResolversTypes['Category']>>, ParentType, ContextType>;
  getOrderById?: Resolver<IResolversTypes['Order'], ParentType, ContextType, RequireFields<IQueryGetOrderByIdArgs, 'id'>>;
  getUserById?: Resolver<IResolversTypes['User'], ParentType, ContextType, RequireFields<IQueryGetUserByIdArgs, 'userId'>>;
  listAllCustomer?: Resolver<IResolversTypes['CustomerConnection'], ParentType, ContextType, RequireFields<IQueryListAllCustomerArgs, 'input'>>;
  listAllDeliverOrder?: Resolver<IResolversTypes['ListAllDeliverOrderResponse'], ParentType, ContextType, RequireFields<IQueryListAllDeliverOrderArgs, 'input'>>;
  listAllInventory?: Resolver<IResolversTypes['InventoryConnection'], ParentType, ContextType, RequireFields<IQueryListAllInventoryArgs, 'input'>>;
  listAllProducts?: Resolver<IResolversTypes['ProductConnection'], ParentType, ContextType, RequireFields<IQueryListAllProductsArgs, 'input'>>;
  listArrayUserNotification?: Resolver<Array<Maybe<IResolversTypes['UserNotification']>>, ParentType, ContextType, RequireFields<IQueryListArrayUserNotificationArgs, 'input'>>;
  listUserNotification?: Resolver<IResolversTypes['UserNotificationConnection'], ParentType, ContextType, RequireFields<IQueryListUserNotificationArgs, 'input'>>;
  login?: Resolver<IResolversTypes['UserLoginResponse'], ParentType, ContextType, RequireFields<IQueryLoginArgs, 'input'>>;
  me?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  productDetail?: Resolver<IResolversTypes['Product'], ParentType, ContextType, RequireFields<IQueryProductDetailArgs, 'input'>>;
  users?: Resolver<IResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<IQueryUsersArgs, 'input'>>;
};

export type ISubscriptionResolvers<ContextType = any, ParentType extends IResolversParentTypes['Subscription'] = IResolversParentTypes['Subscription']> = {
  subscribeNotifications?: SubscriptionResolver<IResolversTypes['NotificationResponse'], "subscribeNotifications", ParentType, ContextType, RequireFields<ISubscriptionSubscribeNotificationsArgs, 'input'>>;
};

export interface IUploadScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type IUserResolvers<ContextType = any, ParentType extends IResolversParentTypes['User'] = IResolversParentTypes['User']> = {
  address?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  avatarURL?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  fullName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  lastName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<Maybe<IResolversTypes['Role']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  userName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserConnection'] = IResolversParentTypes['UserConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['UserEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserEdge'] = IResolversParentTypes['UserEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserLoginResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserLoginResponse'] = IResolversParentTypes['UserLoginResponse']> = {
  token?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserNotificationResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserNotification'] = IResolversParentTypes['UserNotification']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  idUserNotification?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  isRead?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  notification?: Resolver<IResolversTypes['Notification'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserNotificationConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserNotificationConnection'] = IResolversParentTypes['UserNotificationConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['UserNotificationEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserNotificationEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserNotificationEdge'] = IResolversParentTypes['UserNotificationEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['UserNotification']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IResolvers<ContextType = any> = {
  Category?: ICategoryResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  Customer?: ICustomerResolvers<ContextType>;
  CustomerConnection?: ICustomerConnectionResolvers<ContextType>;
  CustomerEdge?: ICustomerEdgeResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DeliverOrder?: IDeliverOrderResolvers<ContextType>;
  DeliverOrderConnection?: IDeliverOrderConnectionResolvers<ContextType>;
  DeliverOrderEdge?: IDeliverOrderEdgeResolvers<ContextType>;
  FilterAllOrdersResponse?: IFilterAllOrdersResponseResolvers<ContextType>;
  Inventory?: IInventoryResolvers<ContextType>;
  InventoryConnection?: IInventoryConnectionResolvers<ContextType>;
  InventoryEdge?: IInventoryEdgeResolvers<ContextType>;
  ItemGroup?: IItemGroupResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  ListAllDeliverOrderResponse?: IListAllDeliverOrderResponseResolvers<ContextType>;
  Mutation?: IMutationResolvers<ContextType>;
  Notification?: INotificationResolvers<ContextType>;
  NotificationResponse?: INotificationResponseResolvers<ContextType>;
  Order?: IOrderResolvers<ContextType>;
  OrderConnection?: IOrderConnectionResolvers<ContextType>;
  OrderDetail?: IOrderDetailResolvers<ContextType>;
  OrderEdge?: IOrderEdgeResolvers<ContextType>;
  PageInfo?: IPageInfoResolvers<ContextType>;
  PaymentInfor?: IPaymentInforResolvers<ContextType>;
  Product?: IProductResolvers<ContextType>;
  ProductConnection?: IProductConnectionResolvers<ContextType>;
  ProductEdge?: IProductEdgeResolvers<ContextType>;
  Query?: IQueryResolvers<ContextType>;
  Subscription?: ISubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: IUserResolvers<ContextType>;
  UserConnection?: IUserConnectionResolvers<ContextType>;
  UserEdge?: IUserEdgeResolvers<ContextType>;
  UserLoginResponse?: IUserLoginResponseResolvers<ContextType>;
  UserNotification?: IUserNotificationResolvers<ContextType>;
  UserNotificationConnection?: IUserNotificationConnectionResolvers<ContextType>;
  UserNotificationEdge?: IUserNotificationEdgeResolvers<ContextType>;
};

