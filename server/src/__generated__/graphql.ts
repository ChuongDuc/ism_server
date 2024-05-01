import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { user, customer, inventory, categories, product } from '../db_models/mysql/init-models';
import { UserEdge, UserConnection } from '../db_models/mysql/user';
import { CustomerEdge, CustomerConnection } from '../db_models/mysql/customer';
import { InventoryEdge, InventoryConnection } from '../db_models/mysql/inventory';
import { ProductEdge, ProductConnection } from '../db_models/mysql/product';
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

export type IMutation = {
  __typename?: 'Mutation';
  createCategory: ICategory;
  createCustomer: ICustomer;
  createProduct: IProduct;
  createUser: IUser;
  deleteCustomer: ISuccessResponse;
  deleteProductById: ISuccessResponse;
  deleteUser: ISuccessResponse;
  importFileExcelInventory: Array<Maybe<IInventory>>;
  importFileExcelProducts: Array<Maybe<IProduct>>;
  updateCategory: ISuccessResponse;
  updateCustomer: ISuccessResponse;
  updateProductById: ISuccessResponse;
  updateProductPriceById: ISuccessResponse;
  updateUser: ISuccessResponse;
};


export type IMutationCreateCategoryArgs = {
  input: ICreateCategoryInput;
};


export type IMutationCreateCustomerArgs = {
  input: ICreateCustomerInput;
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


export type IMutationUpdateProductByIdArgs = {
  input: IUpdateProductByIdInput;
};


export type IMutationUpdateProductPriceByIdArgs = {
  input: IUpdateProductPriceByIdInput;
};


export type IMutationUpdateUserArgs = {
  input: IUpdateUserInput;
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
  getAllCategory: Array<Maybe<ICategory>>;
  listAllCustomer: ICustomerConnection;
  listAllInventory: IInventoryConnection;
  listAllProducts: IProductConnection;
  login: IUserLoginResponse;
  me: IUser;
  productDetail: IProduct;
  users: IUserConnection;
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

export type ISubscription = {
  __typename?: 'Subscription';
  subscribeNotifications: IUser;
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

export type IUsersInput = {
  args?: InputMaybe<IPaginationInput>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<IRole>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
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
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
  Customer: ResolverTypeWrapper<ICustomer>;
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>;
  CustomerEdge: ResolverTypeWrapper<CustomerEdge>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteProductByIdInput: IDeleteProductByIdInput;
  DeleteUserInput: IDeleteUserInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ImportFileExcelInventoryInput: IImportFileExcelInventoryInput;
  ImportFileExcelProductsInput: IImportFileExcelProductsInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Inventory: ResolverTypeWrapper<inventory>;
  InventoryConnection: ResolverTypeWrapper<InventoryConnection>;
  InventoryEdge: ResolverTypeWrapper<InventoryEdge>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  ListAllCustomerInput: IListAllCustomerInput;
  ListAllInventoryInput: IListAllInventoryInput;
  ListAllProductsInput: IListAllProductsInput;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<IPageInfo>;
  PaginationInput: IPaginationInput;
  Product: ResolverTypeWrapper<product>;
  ProductConnection: ResolverTypeWrapper<ProductConnection>;
  ProductDetailInput: IProductDetailInput;
  ProductEdge: ResolverTypeWrapper<ProductEdge>;
  Query: ResolverTypeWrapper<{}>;
  Role: IRole;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  SuccessResponse: ISuccessResponse;
  Unit: IUnit;
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateProductByIdInput: IUpdateProductByIdInput;
  UpdateProductPriceByIdInput: IUpdateProductPriceByIdInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<user>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: ResolverTypeWrapper<Omit<IUserLoginResponse, 'user'> & { user: IResolversTypes['User'] }>;
  UsersInput: IUsersInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Category: categories;
  CreateCategoryInput: ICreateCategoryInput;
  CreateCustomerInput: ICreateCustomerInput;
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: Scalars['Cursor']['output'];
  Customer: ICustomer;
  CustomerConnection: CustomerConnection;
  CustomerEdge: CustomerEdge;
  Date: Scalars['Date']['output'];
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteProductByIdInput: IDeleteProductByIdInput;
  DeleteUserInput: IDeleteUserInput;
  Float: Scalars['Float']['output'];
  ImportFileExcelInventoryInput: IImportFileExcelInventoryInput;
  ImportFileExcelProductsInput: IImportFileExcelProductsInput;
  Int: Scalars['Int']['output'];
  Inventory: inventory;
  InventoryConnection: InventoryConnection;
  InventoryEdge: InventoryEdge;
  JSON: Scalars['JSON']['output'];
  ListAllCustomerInput: IListAllCustomerInput;
  ListAllInventoryInput: IListAllInventoryInput;
  ListAllProductsInput: IListAllProductsInput;
  Mutation: {};
  PageInfo: IPageInfo;
  PaginationInput: IPaginationInput;
  Product: product;
  ProductConnection: ProductConnection;
  ProductDetailInput: IProductDetailInput;
  ProductEdge: ProductEdge;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateProductByIdInput: IUpdateProductByIdInput;
  UpdateProductPriceByIdInput: IUpdateProductPriceByIdInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: Scalars['Upload']['output'];
  User: user;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: Omit<IUserLoginResponse, 'user'> & { user: IResolversParentTypes['User'] };
  UsersInput: IUsersInput;
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

export interface IJsonScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type IMutationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation']> = {
  createCategory?: Resolver<IResolversTypes['Category'], ParentType, ContextType, RequireFields<IMutationCreateCategoryArgs, 'input'>>;
  createCustomer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType, RequireFields<IMutationCreateCustomerArgs, 'input'>>;
  createProduct?: Resolver<IResolversTypes['Product'], ParentType, ContextType, RequireFields<IMutationCreateProductArgs, 'input'>>;
  createUser?: Resolver<IResolversTypes['User'], ParentType, ContextType, RequireFields<IMutationCreateUserArgs, 'input'>>;
  deleteCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteCustomerArgs, 'input'>>;
  deleteProductById?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteProductByIdArgs, 'input'>>;
  deleteUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteUserArgs, 'input'>>;
  importFileExcelInventory?: Resolver<Array<Maybe<IResolversTypes['Inventory']>>, ParentType, ContextType, RequireFields<IMutationImportFileExcelInventoryArgs, 'input'>>;
  importFileExcelProducts?: Resolver<Array<Maybe<IResolversTypes['Product']>>, ParentType, ContextType, RequireFields<IMutationImportFileExcelProductsArgs, 'input'>>;
  updateCategory?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCategoryArgs, 'input'>>;
  updateCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCustomerArgs, 'input'>>;
  updateProductById?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateProductByIdArgs, 'input'>>;
  updateProductPriceById?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateProductPriceByIdArgs, 'input'>>;
  updateUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateUserArgs, 'input'>>;
};

export type IPageInfoResolvers<ContextType = any, ParentType extends IResolversParentTypes['PageInfo'] = IResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<IResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
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
  getAllCategory?: Resolver<Array<Maybe<IResolversTypes['Category']>>, ParentType, ContextType>;
  listAllCustomer?: Resolver<IResolversTypes['CustomerConnection'], ParentType, ContextType, RequireFields<IQueryListAllCustomerArgs, 'input'>>;
  listAllInventory?: Resolver<IResolversTypes['InventoryConnection'], ParentType, ContextType, RequireFields<IQueryListAllInventoryArgs, 'input'>>;
  listAllProducts?: Resolver<IResolversTypes['ProductConnection'], ParentType, ContextType, RequireFields<IQueryListAllProductsArgs, 'input'>>;
  login?: Resolver<IResolversTypes['UserLoginResponse'], ParentType, ContextType, RequireFields<IQueryLoginArgs, 'input'>>;
  me?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  productDetail?: Resolver<IResolversTypes['Product'], ParentType, ContextType, RequireFields<IQueryProductDetailArgs, 'input'>>;
  users?: Resolver<IResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<IQueryUsersArgs, 'input'>>;
};

export type ISubscriptionResolvers<ContextType = any, ParentType extends IResolversParentTypes['Subscription'] = IResolversParentTypes['Subscription']> = {
  subscribeNotifications?: SubscriptionResolver<IResolversTypes['User'], "subscribeNotifications", ParentType, ContextType>;
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
  JSON?: GraphQLScalarType;
  Mutation?: IMutationResolvers<ContextType>;
  PageInfo?: IPageInfoResolvers<ContextType>;
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
};

