// app/account/AccountType.ts
export type AccountId = number;
export type AuthGroupId = string;
export enum PermissionResult {
  ALLOW = 1,
  DENY = 2
}

// app/database/utility/Type.ts
export type Timestamp = number;

// app/database/Auth.ts
export declare class AuthGroup {
  id: AuthGroupId;
  name: string;
  permissions: AuthPermission[];
  protected: boolean;
  createTime: Timestamp;
}
export declare class AuthPermission {
  gid: AuthGroupId;
  name: string;
  permission: PermissionResult;
  group: AuthGroup;
}

// app/database/Account.ts
export declare class AccountPassword {
  id: AccountId;
  username: string;
  password: string;
  salt: string;
}
export declare class AccountToken {
  session: string;
  expireAt: Timestamp;
  accountId: AccountId;
  gid: AuthGroupId;
}
export declare class Account {
  id: AccountId;
  nickname: string;
  email: string;
  userPass: AccountPassword;
  group: AuthGroup;
  gid: AuthGroupId;
  createTime: Timestamp;
  disabled: boolean;
}

// app/ErrorCode.ts
export enum UserErrorCode {
  ERR_DUPLICATE_USERNAME = "ERR_DUPLICATE_USERNAME",
  ERR_DUPLICATE_EMAIL = "ERR_DUPLICATE_EMAIL",
  ERR_USERNAME_NOT_FOUND = "ERR_USERNAME_NOT_FOUND",
  ERR_WRONG_PASSWORD = "ERR_WRONG_PASSWORD",
  ERR_PARAMETERS_INVALID = "ERR_PARAMETERS_INVALID",
  ERR_NOT_LOGIN = "ERR_NOT_LOGIN",
  ERR_PROTECTED_GROUP = "ERR_PROTECTED_GROUP",
  ERR_CANT_CREATE_ROOT = "ERR_CANT_CREATE_ROOT",
  ERR_DUPLICATE_NICKNAME = "ERR_DUPLICATE_NICKNAME",
  ERR_ACCOUNT_NOT_FOUND = "ERR_ACCOUNT_NOT_FOUND",
  ERR_WRONG_EMAIL_CODE = "ERR_WRONG_EMAIL_CODE",
  ERR_ACCOUNT_DISABLED = "ERR_ACCOUNT_DISABLED",
  ERR_DISABLE_SELF = "ERR_DISABLE_SELF",
  ERR_AUTH_GROUP_NOT_FOUND = "ERR_AUTH_GROUP_NOT_FOUND",
  ERR_AUTH_GROUP_NOT_EMPTY = "ERR_AUTH_GROUP_NOT_EMPTY",
  ERR_AUTH_DENY = "ERR_AUTH_DENY",
  ERR_DB_NOT_FOUND = "ERR_DB_NOT_FOUND",
  ERR_SERVER_INTERNAL = "ERR_SERVER_INTERNAL"
}

// app/service/common/ServiceName.ts
export enum ServiceName {
  HttpGateway = "http-gateway",
  Restful = "restful",
  Auth = "auth"
}

// app/handler/GatewayHandler.ts
export interface IRegisterReq {
  username: string;
  password: string;
  nickname: string;
  email: string;
}
export interface ILoginReq {
  username: string;
  password: string;
  remember: boolean;
}
export declare class GatewayHandler {
  register(body: IRegisterReq): Promise<{
    id: number;
  }>;
  login(body: ILoginReq): Promise<{
    account: {
      id: number;
      username: string;
      email: string;
      nickname: string;
    };
    permissions: AuthPermission[];
    authorization: {
      token: string;
      expireAt: number;
    };
  }>;
  info(body: void): Promise<{
    account: {
      id: number;
      username: string;
      email: string;
      nickname: string;
    };
    permissions: AuthPermission[];
    authorization: {
      token: string;
      expireAt: number;
    };
  }>;
  logout(body: void): Promise<{}>;
}

// app/handler/RestfulHandler.ts
export type EntityValueTypeProperty<T, V> = T extends Array<any> ? V : T extends string ? never : T extends number ? never : T extends V ? never : T extends Function ? never : T extends object ? EntityValueType<T> | V : V;
export type EntityValueType<T> = {
  [k in keyof T]?: EntityValueTypeProperty<T[k], boolean>;
};
export interface IReqFetch<T> {
  db: string;
  offset?: number;
  limit?: number;
  relations?: EntityValueType<T>;
  order?: {
    [k in keyof T]?: FindOptionsOrderValue;
  };
  select?: string[];
  where?: WhereCondition<T>;
}
export interface IReqUpdate<T> {
  data: Partial<T>;
  where: WhereCondition<T>;
  db: string;
}
export interface IReqUpdateBatch<T> {
  db: string;
  list: {
    where: WhereCondition<T>;
    data: Partial<T>;
  }[];
}
export interface IReqInsert<T> {
  db: string;
  data: Partial<T>;
}
export interface IReqInsertBatch<T> {
  db: string;
  list: Partial<T>[];
}
export interface IReqDelete<T> {
  db: string;
  where: WhereCondition<T>;
}
export interface IReqDeleteBatch<T> {
  db: string;
  where: WhereCondition<T>[];
}
export declare class RestfulHandler {
  fetch<T extends ObjectLiteral>(body: IReqFetch<T>): Promise<{
    list: Array<T>;
    total: number;
  }>;
  insert<T extends ObjectLiteral>(body: IReqInsert<T>): Promise<T>;
  insertBatch<T extends ObjectLiteral>(body: IReqInsertBatch<T>): Promise<T[]>;
  update<T extends ObjectLiteral>(body: IReqUpdate<T>): Promise<{}>;
  updateBatch<T extends ObjectLiteral>(body: IReqUpdateBatch<T>): Promise<{}>;
  delete<T extends ObjectLiteral>(body: IReqDelete<T>): Promise<{}>;
  deleteBatch<T extends ObjectLiteral>(body: IReqDeleteBatch<T>): Promise<{}>;
}

export interface ObjectLiteral {
  [key: string]: any;
}
export type WhereCondition<T> = Condition<T> | Array<Condition<T>>;
export type Condition<T> = {
  [K in keyof T]?: T[K] | WhereOperatorCondition | Condition<T[K]>;
}
export type WhereOperatorCondition = {
  [K in WhereOperators]?: any;
}
export enum WhereOperators {
  any = "$any",
  between = "$between",
  eq = "$eq",
  iLike = "$iLike",
  in = "$in",
  isNull = "$isNull",
  lt = "$lt",
  lte = "$lte",
  like = "$like",
  gt = "$gt",
  gte = "$gte",
  not = "$not",
  raw = "$raw"
}
export type FindOptionsOrderValue = "ASC" | "DESC" | "asc" | "desc" | 1 | -1 | {
  direction?: "asc" | "desc" | "ASC" | "DESC";
  nulls?: "first" | "last" | "FIRST" | "LAST";
};

// app/handler/AuthHandler.ts
export interface IReqUpdatePermission {
  gid: AuthGroupId;
  permissions: {
    name: string;
    permission: PermissionResult;
  }[];
}
export interface IReqUpdateAccount {
  accountId: AccountId;
  gid?: AuthGroupId;
  nickname?: string;
  email?: string;
}
export interface IReqDisableAccount {
  accountId: AccountId;
  disabled: boolean;
}
export interface IReqDeleteAuthGroup {
  gid: AuthGroupId;
}
export interface IReqCreateAccount {
  username: string;
  nickname: string;
  email: string;
  gid: AuthGroupId;
  password: string;
}
export interface IReqResetPassword {
  id: AccountId;
  password: string;
}
export interface IReqRequestForgetPassword {
  email: string;
}
export interface IReqForgetPassword {
  id: string;
  code: string;
  password: string;
}
export declare class AuthHandler {
  fetchAccountList(body: void): Promise<{
    list: Account[];
  }>;
  updatePermission(body: IReqUpdatePermission): Promise<{}>;
  updateAccount(body: IReqUpdateAccount): Promise<{}>;
  disableAccount(body: IReqDisableAccount): Promise<{}>;
  deleteAuthGroup(body: IReqDeleteAuthGroup): Promise<{}>;
  createAccount(body: IReqCreateAccount): Promise<{
    id: number;
  }>;
  resetPassword(body: IReqResetPassword): Promise<{}>;
  requestForgetPassword(body: IReqRequestForgetPassword): Promise<{
    id: string;
  }>;
  forgetPassword(body: IReqForgetPassword): Promise<{}>;
}

