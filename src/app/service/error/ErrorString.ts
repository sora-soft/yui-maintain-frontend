import {UserErrorCode} from '../server/api';

export const ErrorString : {
  [k: string]: string
} = {
  ERR_NET: '网络通讯发生错误',

  [UserErrorCode.ERR_AUTH_DENY]: '没有权限进行该操作',
  [UserErrorCode.ERR_USERNAME_NOT_FOUND]: '该账户不存在',
  [UserErrorCode.ERR_ACCOUNT_NOT_FOUND]: '没有找到操作账号',
  [UserErrorCode.ERR_DUPLICATE_EMAIL]: '该邮箱已注册',
  [UserErrorCode.ERR_DUPLICATE_NICKNAME]: '该昵称已注册',
  [UserErrorCode.ERR_DUPLICATE_USERNAME]: '该账号已注册',
  [UserErrorCode.ERR_NOT_LOGIN]: '尚未登录',
  [UserErrorCode.ERR_SERVER_INTERNAL]: '服务器故障',
};
