/**
 * 认证状态管理
 *
 * 使用 Zustand 管理用户认证状态
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, getCurrentUser } from '../services/authService';

interface AuthState {
  // 状态
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needBindPhone: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setNeedBindPhone: (need: boolean) => void;
  login: (token: string, user?: User | null, needBindPhone?: boolean) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      needBindPhone: false,

      // 设置用户
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      // 设置 Token
      setToken: (token) => {
        if (token) {
          localStorage.setItem('access_token', token);
        } else {
          localStorage.removeItem('access_token');
        }
        set({ token, isAuthenticated: !!token });
      },

      // 设置是否需要绑定手机号
      setNeedBindPhone: (need) => {
        set({ needBindPhone: need });
      },

      // 登录
      login: (token, user = null, needBindPhone = false) => {
        localStorage.setItem('access_token', token);
        set({
          token,
          user,
          isAuthenticated: true,
          needBindPhone,
        });
      },

      // 登出
      logout: () => {
        localStorage.removeItem('access_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          needBindPhone: false,
        });
      },

      // 检查认证状态
      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return false;
        }

        set({ isLoading: true, token });

        try {
          const user = await getCurrentUser();
          const needBindPhone = !user.phone || !user.is_phone_verified;
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            needBindPhone,
          });
          return true;
        } catch {
          // Token 无效或过期
          localStorage.removeItem('access_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            needBindPhone: false,
          });
          return false;
        }
      },

      // 更新用户信息
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          const needBindPhone = !updatedUser.phone || !updatedUser.is_phone_verified;
          set({ user: updatedUser, needBindPhone });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
      }),
    }
  )
);

// 辅助 hooks
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useNeedBindPhone = () => useAuthStore((state) => state.needBindPhone);
