import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { user, customer, inventory, categories, product, notification, userNotification, order, paymentInfor, itemGroup, orderDetail } from '../db_models/mysql/init-models';
import { UserEdge, UserConnection } from '../db_models/mysql/user';
import { CustomerEdge, CustomerConnection } from '../db_models/mysql/customer';
import { InventoryEdge, InventoryConnection } from '../db_models/mysql/inventory';
import { ProductEdge, ProductConnection } from '../db_models/mysql/product';
import { UserNotificationEdge, UserNotificationConnection } from '../db_models/mysql/userNotification';
import { OrderEdge, OrderConnection } from '../db_models/mysql/order';
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

export type ICreateOrderInput = {
  VAT?: InputMaybe<Scalars['Float']['input']>;
  customerId: Scalars['Int']['input'];
  saleUserId: Scalars['Int']['input'];
};

export type ICreateProductInput = {
  categoryId: Scalars['Int']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Float']['input'];
  price: Scalars['Float']['input'];
  productName: Scalars['String']['input'];
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

export type IDeleteProductByIdInput = {
  productId: Array<Scalars['Int']['input']>;
};

export type IDeleteUserInput = {
  ids: Array<Scalars['Int']['input']>;
};

export type IFilterAllOrderInput = {
  args?: InputMaybe<IPaginationInput>;
  createAt?: InputMaybe<IFilterDate>;
  queryString?: InputMaybe<Scalars['String']['input']>;
  saleId?: InputMaybe<Scalars['Int']['input']>;
};

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

export type IListAllCustomerInput = {
  args?: InputMaybe<IPaginationInput>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IListAllInventoryInput = {
  args?: InputMaybe<IPaginationInput>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IListAllProductsInput = {
  args?: InputMaybe<IPaginationInput>;
  category?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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
  createOrder: IOrder;
  createProduct: IProduct;
  createUser: IUser;
  deleteCustomer: ISuccessResponse;
  deleteProductById: ISuccessResponse;
  deleteUser: ISuccessResponse;
  importFileExcelInventory: Array<Maybe<IInventory>>;
  importFileExcelProducts: Array<Maybe<IProduct>>;
  updateCategory: ISuccessResponse;
  updateCustomer: ISuccessResponse;
  updateOrder: ISuccessResponse;
  updateProductById: ISuccessResponse;
  updateProductPriceById: ISuccessResponse;
  updateStatusUserNotification: ISuccessResponse;
  updateUser: ISuccessResponse;
};


export type IMutationCreateCategoryArgs = {
  input: ICreateCategoryInput;
};


export type IMutationCreateCustomerArgs = {
  input: ICreateCustomerInput;
};


export type IMutationCreateOrderArgs = {
  input: ICreateOrderInput;
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


export type IMutationUpdateCategoryArgs = {
  input: IUpdateCategoryInput;
};


export type IMutationUpdateCustomerArgs = {
  input: IUpdateCustomerInput;
};


export type IMutationUpdateOrderArgs = {
  input: IUpdateOrderInput;
};


export type IMutationUpdateProductByIdArgs = {
  input: IUpdateProductByIdInput;
};


export type IMutationUpdateProductPriceByIdArgs = {
  input: IUpdateProductPriceByIdInput;
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
  NewMessage = 'NewMessage',
  NewOrder = 'NewOrder',
  OrderStatusChanged = 'OrderStatusChanged'
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
  freightPrice?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  invoiceNo: Scalars['String']['output'];
  itemGroupList?: Maybe<Array<Maybe<IItemGroup>>>;
  paymentList?: Maybe<Array<Maybe<IPaymentInfo>>>;
  remainingPaymentMoney?: Maybe<Scalars['Float']['output']>;
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
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  itemGroup: IItemGroup;
  priceProduct: Scalars['Float']['output'];
  product: IProduct;
  quantity: Scalars['Float']['output'];
  totalWeight?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  weightProduct?: Maybe<Scalars['Float']['output']>;
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

export type IPaymentInfo = {
  __typename?: 'PaymentInfo';
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
  category: ICategory;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  height: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
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
  filterAllOrder: IOrderConnection;
  getAllCategory: Array<Maybe<ICategory>>;
  getUserById: IUser;
  listAllCustomer: ICustomerConnection;
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


export type IQueryGetUserByIdArgs = {
  userId: Scalars['Int']['input'];
};


export type IQueryListAllCustomerArgs = {
  input: IListAllCustomerInput;
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

export type IUpdateOrderInput = {
  VAT?: InputMaybe<Scalars['Float']['input']>;
  customerId?: InputMaybe<Scalars['Int']['input']>;
  driverUserId?: InputMaybe<Scalars['Int']['input']>;
  orderId: Scalars['Int']['input'];
  saleUserId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<IStatusOrder>;
};

export type IUpdateProductByIdInput = {
  categoryId: Scalars['Int']['input'];
  height?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['Int']['input'];
  unit?: InputMaybe<IUnit>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type IUpdateProductPriceByIdInput = {
  price?: InputMaybe<Scalars['Float']['input']>;
  productId: Array<Scalars['Int']['input']>;
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
  CreateCategoryInput: ICreateCategoryInput;
  CreateCustomerInput: ICreateCustomerInput;
  CreateOrderInput: ICreateOrderInput;
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
  Customer: ResolverTypeWrapper<customer>;
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>;
  CustomerEdge: ResolverTypeWrapper<CustomerEdge>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteProductByIdInput: IDeleteProductByIdInput;
  DeleteUserInput: IDeleteUserInput;
  FilterAllOrderInput: IFilterAllOrderInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ImportFileExcelInventoryInput: IImportFileExcelInventoryInput;
  ImportFileExcelProductsInput: IImportFileExcelProductsInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Inventory: ResolverTypeWrapper<inventory>;
  InventoryConnection: ResolverTypeWrapper<InventoryConnection>;
  InventoryEdge: ResolverTypeWrapper<InventoryEdge>;
  ItemGroup: ResolverTypeWrapper<itemGroup>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  ListAllCustomerInput: IListAllCustomerInput;
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
  OrderEdge: ResolverTypeWrapper<OrderEdge>;
  PageInfo: ResolverTypeWrapper<IPageInfo>;
  PaginationInput: IPaginationInput;
  PaymentInfo: ResolverTypeWrapper<Omit<IPaymentInfo, 'customer' | 'order'> & { customer: IResolversTypes['Customer'], order: IResolversTypes['Order'] }>;
  Product: ResolverTypeWrapper<product>;
  ProductConnection: ResolverTypeWrapper<ProductConnection>;
  ProductDetailInput: IProductDetailInput;
  ProductEdge: ResolverTypeWrapper<ProductEdge>;
  Query: ResolverTypeWrapper<{}>;
  Role: IRole;
  StatusOrder: IStatusOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubscribeNotificationsInput: ISubscribeNotificationsInput;
  Subscription: ResolverTypeWrapper<{}>;
  SuccessResponse: ISuccessResponse;
  Unit: IUnit;
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateOrderInput: IUpdateOrderInput;
  UpdateProductByIdInput: IUpdateProductByIdInput;
  UpdateProductPriceByIdInput: IUpdateProductPriceByIdInput;
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
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Category: categories;
  CreateCategoryInput: ICreateCategoryInput;
  CreateCustomerInput: ICreateCustomerInput;
  CreateOrderInput: ICreateOrderInput;
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: Scalars['Cursor']['output'];
  Customer: customer;
  CustomerConnection: CustomerConnection;
  CustomerEdge: CustomerEdge;
  Date: Scalars['Date']['output'];
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteProductByIdInput: IDeleteProductByIdInput;
  DeleteUserInput: IDeleteUserInput;
  FilterAllOrderInput: IFilterAllOrderInput;
  Float: Scalars['Float']['output'];
  ImportFileExcelInventoryInput: IImportFileExcelInventoryInput;
  ImportFileExcelProductsInput: IImportFileExcelProductsInput;
  Int: Scalars['Int']['output'];
  Inventory: inventory;
  InventoryConnection: InventoryConnection;
  InventoryEdge: InventoryEdge;
  ItemGroup: itemGroup;
  JSON: Scalars['JSON']['output'];
  ListAllCustomerInput: IListAllCustomerInput;
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
  OrderEdge: OrderEdge;
  PageInfo: IPageInfo;
  PaginationInput: IPaginationInput;
  PaymentInfo: Omit<IPaymentInfo, 'customer' | 'order'> & { customer: IResolversParentTypes['Customer'], order: IResolversParentTypes['Order'] };
  Product: product;
  ProductConnection: ProductConnection;
  ProductDetailInput: IProductDetailInput;
  ProductEdge: ProductEdge;
  Query: {};
  String: Scalars['String']['output'];
  SubscribeNotificationsInput: ISubscribeNotificationsInput;
  Subscription: {};
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateOrderInput: IUpdateOrderInput;
  UpdateProductByIdInput: IUpdateProductByIdInput;
  UpdateProductPriceByIdInput: IUpdateProductPriceByIdInput;
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

export type IMutationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation']> = {
  createCategory?: Resolver<IResolversTypes['Category'], ParentType, ContextType, RequireFields<IMutationCreateCategoryArgs, 'input'>>;
  createCustomer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType, RequireFields<IMutationCreateCustomerArgs, 'input'>>;
  createOrder?: Resolver<IResolversTypes['Order'], ParentType, ContextType, RequireFields<IMutationCreateOrderArgs, 'input'>>;
  createProduct?: Resolver<IResolversTypes['Product'], ParentType, ContextType, RequireFields<IMutationCreateProductArgs, 'input'>>;
  createUser?: Resolver<IResolversTypes['User'], ParentType, ContextType, RequireFields<IMutationCreateUserArgs, 'input'>>;
  deleteCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteCustomerArgs, 'input'>>;
  deleteProductById?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteProductByIdArgs, 'input'>>;
  deleteUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteUserArgs, 'input'>>;
  importFileExcelInventory?: Resolver<Array<Maybe<IResolversTypes['Inventory']>>, ParentType, ContextType, RequireFields<IMutationImportFileExcelInventoryArgs, 'input'>>;
  importFileExcelProducts?: Resolver<Array<Maybe<IResolversTypes['Product']>>, ParentType, ContextType, RequireFields<IMutationImportFileExcelProductsArgs, 'input'>>;
  updateCategory?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCategoryArgs, 'input'>>;
  updateCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCustomerArgs, 'input'>>;
  updateOrder?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateOrderArgs, 'input'>>;
  updateProductById?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateProductByIdArgs, 'input'>>;
  updateProductPriceById?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateProductPriceByIdArgs, 'input'>>;
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
  freightPrice?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  invoiceNo?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  itemGroupList?: Resolver<Maybe<Array<Maybe<IResolversTypes['ItemGroup']>>>, ParentType, ContextType>;
  paymentList?: Resolver<Maybe<Array<Maybe<IResolversTypes['PaymentInfo']>>>, ParentType, ContextType>;
  remainingPaymentMoney?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
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
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  itemGroup?: Resolver<IResolversTypes['ItemGroup'], ParentType, ContextType>;
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

export type IPaymentInfoResolvers<ContextType = any, ParentType extends IResolversParentTypes['PaymentInfo'] = IResolversParentTypes['PaymentInfo']> = {
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
  category?: Resolver<IResolversTypes['Category'], ParentType, ContextType>;
  code?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
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
  filterAllOrder?: Resolver<IResolversTypes['OrderConnection'], ParentType, ContextType, RequireFields<IQueryFilterAllOrderArgs, 'input'>>;
  getAllCategory?: Resolver<Array<Maybe<IResolversTypes['Category']>>, ParentType, ContextType>;
  getUserById?: Resolver<IResolversTypes['User'], ParentType, ContextType, RequireFields<IQueryGetUserByIdArgs, 'userId'>>;
  listAllCustomer?: Resolver<IResolversTypes['CustomerConnection'], ParentType, ContextType, RequireFields<IQueryListAllCustomerArgs, 'input'>>;
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
  Inventory?: IInventoryResolvers<ContextType>;
  InventoryConnection?: IInventoryConnectionResolvers<ContextType>;
  InventoryEdge?: IInventoryEdgeResolvers<ContextType>;
  ItemGroup?: IItemGroupResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: IMutationResolvers<ContextType>;
  Notification?: INotificationResolvers<ContextType>;
  NotificationResponse?: INotificationResponseResolvers<ContextType>;
  Order?: IOrderResolvers<ContextType>;
  OrderConnection?: IOrderConnectionResolvers<ContextType>;
  OrderDetail?: IOrderDetailResolvers<ContextType>;
  OrderEdge?: IOrderEdgeResolvers<ContextType>;
  PageInfo?: IPageInfoResolvers<ContextType>;
  PaymentInfo?: IPaymentInfoResolvers<ContextType>;
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

