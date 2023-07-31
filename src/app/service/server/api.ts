export declare class AccountToken {
    session: string;
    expireAt: number;
    accountId: number;
}
export enum AccountLoginType {
    USERNAME = 1,
    EMAIL = 2
}
export declare class AccountLogin {
    id: number;
    type: AccountLoginType;
    username: string;
    password: string;
    salt: string;
}
export enum PermissionResult {
    ALLOW = 1,
    DENY = 2
}
export declare class AuthPermission {
    gid: string;
    name: string;
    permission: PermissionResult;
    group: AuthGroup;
}
export declare class AuthGroup {
    id: string;
    name: string;
    permissions: AuthPermission[];
    protected: boolean;
    createTime: number;
}
export declare class Account {
    id: number;
    nickname?: string;
    avatarUrl?: string;
    groupList?: AuthGroup[];
    createTime: number;
    disabled: boolean;
}
export declare class AccountAuthGroup {
    accountId: number;
    account?: Account;
    groupId: string;
    authGroup?: AuthGroup;
}
export declare class AuthHandler {
    register(body: IReqRegister): Promise<{
        id: number;
    }>;
    login(body: IReqLogin): Promise<{
        account: {
            id: number;
            nickname: string | undefined;
            avatarUrl: string | undefined;
        };
        permissions: {
            name: string;
            permission: PermissionResult;
        }[];
        authorization: {
            token: string;
            expireAt: number;
        };
    }>;
    info(body: void): Promise<{
        account: {
            id: number;
            nickname: string | undefined;
            avatarUrl: string | undefined;
        };
        permissions: {
            name: string;
            permission: PermissionResult;
        }[];
        authorization: {
            token: string;
            expireAt: number;
        };
    }>;
    logout(body: void): Promise<{}>;
    fetchAccountList(): Promise<{
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
export interface IReqRegister {
    username: string;
    password: string;
    email: string;
    nickname?: string;
    avatarUrl?: string;
}
export interface IReqLogin {
    username: string;
    password: string;
    type: AccountLoginType;
    remember: boolean;
}
export interface IReqUpdatePermission {
    gid: string;
    permissions: {
        name: string;
        permission: PermissionResult;
    }[];
}
export interface IReqUpdateAccount {
    accountId: number;
    groupList?: string[];
    nickname?: string;
}
export interface IReqDisableAccount {
    accountId: number;
    disabled: boolean;
}
export interface IReqDeleteAuthGroup {
    gid: string;
}
export interface IReqCreateAccount {
    username: string;
    nickname: string;
    email: string;
    groupList: string[];
    password: string;
}
export interface IReqResetPassword {
    id: number;
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
export type EntityValueTypeProperty<T, V> = T extends Array<any> ? V : T extends string ? never : T extends number ? never : T extends V ? never : T extends Function ? never : T extends object ? EntityValueType<T> | V : V;
export type EntityValueType<T> = {
    [k in keyof T]?: EntityValueTypeProperty<T[k], boolean>;
};
export declare type FindOptionsOrderValue = "ASC" | "DESC" | "asc" | "desc" | 1 | -1 | {
    direction?: "asc" | "desc" | "ASC" | "DESC";
    nulls?: "first" | "last" | "FIRST" | "LAST";
};
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
export type WhereOperatorCondition = {
    [K in WhereOperators]?: any;
};
export type Condition<T> = {
    [K in keyof T]?: T[K] | WhereOperatorCondition | Condition<T[K]>;
};
export type WhereCondition<T> = Condition<T> | Array<Condition<T>>;
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
export interface IReqInsert<T> {
    db: string;
    data: Partial<T>;
}
export interface IReqInsertBatch<T> {
    db: string;
    list: Partial<T>[];
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
export interface IReqDelete<T> {
    db: string;
    where: WhereCondition<T>;
}
export interface IReqDeleteBatch<T> {
    db: string;
    where: WhereCondition<T>[];
}
export enum ServiceName {
    HttpGateway = "http-gateway",
    Restful = "restful",
    Auth = "auth"
}
export enum UserErrorCode {
    ERR_DUPLICATE_REGISTER = "ERR_DUPLICATE_REGISTER",
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
