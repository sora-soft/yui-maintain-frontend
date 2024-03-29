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
export enum ConfigFileType {
    JSON = 0,
    YAML = 1,
    RAW = 2
}
export declare class ConfigFile {
    name: string;
    context: string;
    type: ConfigFileType;
    createTime: number;
    updateTime: number;
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
export declare class ConfigHandler {
    fetchConfig(body: IReqFetchConfig): Promise<unknown>;
}
export interface IReqFetchConfig {
    name: string;
    [k: string]: string;
}
export declare class GatewayServerHandler {
    registerClientNotify(body: IReqRegisterClientNotify): Promise<{}>;
    unregisterClientNotify(body: IReqUnRegisterClientNotify): Promise<{}>;
    notifyToClient(body: IReqNotifyToClient): Promise<void>;
}
export interface IReqRegisterClientNotify {
    session: string;
    name: string;
}
export interface IReqUnRegisterClientNotify {
    session: string;
    name: string;
}
export interface IReqNotifyToClient {
    sessions: string[];
    name: string;
    notify: unknown;
}
export declare class MonitorHandler {
    registerClusterUpdate(body: void): Promise<{
        nodeRunData: INodeRunDataWithScope[];
        nodeMetaData: INodeMetaDataWithScope[];
        workerMetaData: IWorkerMetaDataWithScope[];
        serviceMetaData: IServiceMetaDataWithScope[];
        listenerMetaData: IListenerMetaData[];
    }>;
    unregisterClusterUpdate(body: void): Promise<{}>;
}
export enum FilterOperator {
    INCLUDE = 0,
    EXCLUDE = 1
}
export interface ILabelData {
    label: string;
    operator: FilterOperator;
    values: string[];
}
export enum ConnectorState {
    INIT = 1,
    CONNECTING = 2,
    READY = 3,
    STOPPING = 4,
    STOPPED = 5,
    ERROR = 100
}
export interface ISenderMetaData {
    readonly id: string;
    readonly state: ConnectorState;
    readonly listenerId: string;
    readonly targetId: string;
    readonly weight: number;
    readonly protocol: string;
}
export interface IProviderMetaData {
    readonly name: string;
    readonly filter: ILabelData[];
    readonly senders: ISenderMetaData[];
}
export enum WorkerState {
    INIT = 1,
    PENDING = 2,
    READY = 3,
    STOPPING = 4,
    STOPPED = 5,
    ERROR = 100
}
export interface ILabels {
    readonly [key: string]: string;
}
export interface IListenerInfo {
    protocol: string;
    endpoint: string;
    labels: ILabels;
}
export enum ListenerState {
    INIT = 1,
    PENDING = 2,
    READY = 3,
    STOPPING = 4,
    STOPPED = 5,
    ERROR = 100
}
export interface IListenerMetaData extends IListenerInfo {
    readonly id: string;
    readonly state: ListenerState;
    readonly targetId: string;
    readonly targetName: string;
    readonly labels: ILabels;
    readonly weight: number;
}
export interface INodeMetaData {
    readonly id: string;
    readonly alias?: string;
    readonly host: string;
    readonly pid: number;
    readonly state: WorkerState;
    readonly endpoint: Omit<IListenerMetaData, 'targetName' | 'targetId' | 'weight'>;
    readonly startTime: number;
    readonly versions: {
        readonly framework: string;
        readonly app: string;
    };
}
export interface IComponentOptions {
    [k: string]: unknown;
}
export interface IComponentMetaData {
    name: string;
    ready: boolean;
    version: string;
    options: IComponentOptions;
}
export interface IDiscoveryInfo {
    version: string;
    type: string;
}
export interface INodeRunData {
    providers: IProviderMetaData[];
    node: INodeMetaData;
    components: IComponentMetaData[];
    discovery: IDiscoveryInfo;
}
export interface INodeRunDataWithScope extends INodeRunData {
    scope: string;
}
export interface INodeMetaDataWithScope extends INodeMetaData {
    scope: string;
}
export interface IWorkerMetaData {
    readonly name: string;
    readonly id: string;
    readonly alias?: string;
    readonly state: WorkerState;
    readonly nodeId: string;
    readonly startTime: number;
}
export interface IWorkerMetaDataWithScope extends IWorkerMetaData {
    scope: string;
}
export interface IServiceMetaData extends IWorkerMetaData {
    readonly labels: ILabels;
}
export interface IServiceMetaDataWithScope extends IServiceMetaData {
    scope: string;
}
export declare class INodeClientNotifyHandler {
    notifyClusterUpdate(body: INotifyClusterUpdate): Promise<void>;
}
export interface INotifyMetaData<T> {
    id: string;
    data?: T;
}
export enum NotifyUpdateType {
    Create = "create",
    Update = "update",
    Delete = "delete"
}
export interface INotifyCreateState<T> {
    type: NotifyUpdateType.Create;
    data: T;
}
export interface Delta {
    [key: string]: any;
    [key: number]: any;
}
export interface INotifyUpdateState {
    type: NotifyUpdateType.Update;
    id: string;
    diff: Delta;
}
export interface INotifyNodeState {
    type: NotifyUpdateType.Delete;
    id: string;
}
export type NotifyNodeRunData = INotifyCreateState<INodeRunData> | INotifyUpdateState | INotifyNodeState;
export interface INotifyClusterUpdate {
    scope: string;
    node?: INotifyMetaData<INodeMetaData>;
    service?: INotifyMetaData<IServiceMetaData>;
    worker?: INotifyMetaData<IWorkerMetaData>;
    listener?: INotifyMetaData<IListenerMetaData>;
    nodeRundata?: NotifyNodeRunData;
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
    Auth = "auth",
    Monitor = "monitor",
    Node = "node",
    Config = "config"
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
    ERR_SERVER_INTERNAL = "ERR_SERVER_INTERNAL",
    ERR_NOTIFY_NOT_ENALBED_IN_THIS_CLIENT = "ERR_NOTIFY_NOT_ENALBED_IN_THIS_CLIENT",
    ERR_CONFIG_FILE_NOT_FOUND = "ERR_CONFIG_FILE_NOT_FOUND"
}
