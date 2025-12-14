/**
 * 认证服务
 *
 * 包含所有与认证相关的 API 调用
 */
import { apiClient } from '../config/api';

// 用户类型定义
export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  is_superuser: boolean;
  full_name: string | null;
  nickname: string | null;
  avatar: string | null;
  wechat_openid: string | null;
  wechat_unionid: string | null;
  is_phone_verified: boolean;
}

// API 响应类型
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface WechatLoginResponse {
  access_token: string;
  token_type: string;
  is_phone_bound: boolean;
  user: User;
}

export interface MessageResponse {
  message: string;
}

// 发送短信验证码
export const sendSmsCode = async (phone: string): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>('/auth/sms/send', {
    phone,
  });
  return response.data;
};

// 手机号注册
export const phoneRegister = async (
  phone: string,
  code: string,
  nickname?: string
): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/auth/phone/register', {
    phone,
    code,
    nickname,
  });
  return response.data;
};

// 手机号登录
export const phoneLogin = async (
  phone: string,
  code: string
): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/auth/phone/login', {
    phone,
    code,
  });
  return response.data;
};

// 微信登录
export const wechatLogin = async (
  code: string
): Promise<WechatLoginResponse> => {
  const response = await apiClient.post<WechatLoginResponse>(
    '/auth/wechat/login',
    { code }
  );
  return response.data;
};

// 绑定手机号
export const bindPhone = async (
  phone: string,
  code: string
): Promise<User> => {
  const response = await apiClient.post<User>('/auth/bind-phone', {
    phone,
    code,
  });
  return response.data;
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};

// 传统邮箱密码登录（兼容旧接口）
export const emailLogin = async (
  email: string,
  password: string
): Promise<TokenResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post<TokenResponse>(
    '/login/access-token',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};
