/**
 * API configuration and axios client setup
 */
import axios from 'axios';

// API base URL - 从环境变量读取，默认使用本地开发地址
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// 请求拦截器 - 添加 JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理 Token 刷新和错误
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 如果是 401 错误且不是登录请求，尝试刷新 token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // TODO: 实现 token 刷新逻辑
      // const refreshToken = localStorage.getItem('refresh_token');
      // if (refreshToken) {
      //   try {
      //     const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      //       refresh_token: refreshToken,
      //     });
      //     const { access_token } = response.data;
      //     localStorage.setItem('access_token', access_token);
      //     originalRequest.headers.Authorization = `Bearer ${access_token}`;
      //     return apiClient(originalRequest);
      //   } catch (refreshError) {
      //     localStorage.removeItem('access_token');
      //     localStorage.removeItem('refresh_token');
      //     window.location.href = '/login';
      //   }
      // }
    }

    return Promise.reject(error);
  }
);
