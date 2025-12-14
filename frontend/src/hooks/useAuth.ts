/**
 * 认证相关 Hooks
 */
import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import {
  sendSmsCode,
  phoneLogin,
  phoneRegister,
  wechatLogin,
  bindPhone,
} from '../services/authService';

// 短信验证码倒计时 Hook
export const useSmsCountdown = (initialSeconds = 60) => {
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const startCountdown = useCallback(() => {
    setCountdown(initialSeconds);
  }, [initialSeconds]);

  const canSend = countdown === 0 && !isSending;

  return { countdown, canSend, isSending, setIsSending, startCountdown };
};

// 发送验证码 Hook
export const useSendSmsCode = () => {
  const { countdown, canSend, isSending, setIsSending, startCountdown } =
    useSmsCountdown();
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (phone: string) => {
      if (!canSend) return false;

      setIsSending(true);
      setError(null);

      try {
        await sendSmsCode(phone);
        startCountdown();
        return true;
      } catch (err: unknown) {
        const error = err as { response?: { data?: { detail?: string } } };
        setError(error.response?.data?.detail || '发送失败，请稍后重试');
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [canSend, setIsSending, startCountdown]
  );

  return { send, countdown, canSend, isSending, error };
};

// 手机号登录 Hook
export const usePhoneLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const doLogin = useCallback(
    async (phone: string, code: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await phoneLogin(phone, code);
        login(response.access_token, null, false);
        return true;
      } catch (err: unknown) {
        const error = err as { response?: { data?: { detail?: string } } };
        setError(error.response?.data?.detail || '登录失败，请稍后重试');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  return { login: doLogin, isLoading, error };
};

// 手机号注册 Hook
export const usePhoneRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const doRegister = useCallback(
    async (phone: string, code: string, nickname?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await phoneRegister(phone, code, nickname);
        login(response.access_token, null, false);
        return true;
      } catch (err: unknown) {
        const error = err as { response?: { data?: { detail?: string } } };
        setError(error.response?.data?.detail || '注册失败，请稍后重试');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  return { register: doRegister, isLoading, error };
};

// 微信登录 Hook
export const useWechatLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const doLogin = useCallback(
    async (code: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await wechatLogin(code);
        login(
          response.access_token,
          response.user,
          !response.is_phone_bound
        );
        return {
          success: true,
          needBindPhone: !response.is_phone_bound,
        };
      } catch (err: unknown) {
        const error = err as { response?: { data?: { detail?: string } } };
        setError(error.response?.data?.detail || '微信登录失败，请稍后重试');
        return { success: false, needBindPhone: false };
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  return { login: doLogin, isLoading, error };
};

// 绑定手机号 Hook
export const useBindPhone = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateUser = useAuthStore((state) => state.updateUser);
  const setNeedBindPhone = useAuthStore((state) => state.setNeedBindPhone);

  const doBind = useCallback(
    async (phone: string, code: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const user = await bindPhone(phone, code);
        updateUser(user);
        setNeedBindPhone(false);
        return true;
      } catch (err: unknown) {
        const error = err as { response?: { data?: { detail?: string } } };
        setError(error.response?.data?.detail || '绑定失败，请稍后重试');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [updateUser, setNeedBindPhone]
  );

  return { bind: doBind, isLoading, error };
};

// 检查认证状态 Hook
export const useCheckAuth = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isLoading };
};
