'use client';
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useGoogleLogin } from '@react-oauth/google';
import { authApi } from '@/features/auth/services/auth.api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import User from '../model/users';
import { EmailLoginState, ViewState } from '../model/types';

export type LoginFormData = { email: string; password?: string };

export function useAuthActions() {
  const [emailLoginState, setEmailLoginState] = useState<EmailLoginState>({
    showPassword: false,
    loading: false,
  });
  const [viewState, setViewState] = useState<ViewState>({
    loading: false,
  });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string>();
  const router = useRouter();
  const { setAuthState } = useAuth();

  // Email Login Functions
  const precheckEmail = useCallback(async (email: string) => {
    setEmailLoginState(s => ({ ...s, loading: true, error: undefined }));
    try {
      const userResponse = await authApi.getByEmail(email);
      const hasPassword = userResponse?.data?.passwordHash !== null;
      setEmailLoginState(s => ({ ...s, showPassword: hasPassword, loading: false }));
      return { hasPassword };
    } catch (e: any) {
      setEmailLoginState(s => ({ ...s, loading: false, error: 'Email check failed' }));
      return { hasPassword: true }; // fallback: yêu cầu password
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, password?: string) => {
    setEmailLoginState(s => ({ ...s, loading: true, error: undefined }));
    try {
      const res = await authApi.loginWithEmail(email, password ?? '');
      if (res.data?.accessToken) {
        localStorage.setItem('auth_token', res.data.accessToken);
        localStorage.setItem('refresh_token', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuthState(true, res.data.user as User);
        router.push('/chat');
      } else {
        throw new Error(res.error || 'Login failed');
      }
    } catch (e: any) {
      setEmailLoginState(s => ({ ...s, loading: false, error: e?.message ?? 'Login failed' }));
      return false;
    }
    setEmailLoginState(s => ({ ...s, loading: false }));
    return true;
  }, [router, setAuthState]);

  // Register Function
  const register = useCallback(async (name: string, email: string, password: string) => {
    setViewState(s => ({ ...s, loading: true, error: undefined }));
    try {
      const res = await authApi.register(name, email, password);
      if (res?.data) {
        return { success: true };
      } else {
        throw new Error(res.error || 'Registration failed');
      }
    } catch (e: any) {
      setViewState(s => ({ ...s, loading: false, error: e?.message }));
      return { success: false, error: e?.message };
    }
    setViewState(s => ({ ...s, loading: false }));
    return { success: true };
  }, []);

  // Resend Verification Function
  const resendVerification = useCallback(async (email: string) => {
    setViewState(s => ({ ...s, loading: true, error: undefined }));
    try {
      const res = await authApi.resendVerification(email);
      if (res?.data) {
        return { success: true };
      } else {
        throw new Error(res.error || 'Resend verification failed');
      }
    } catch (e: any) {
      setViewState(s => ({ ...s, loading: false, error: e?.message }));
      return { success: false, error: e?.message };
    }
    setViewState(s => ({ ...s, loading: false }));
    return { success: true };
  }, []);

  // Verify Email Function
  const verifyEmail = useCallback(async (token: string) => {
    setViewState(s => ({ ...s, loading: true, error: undefined }));
    try {
      const res = await authApi.verifyEmail(token);
      if (res?.data) {
        return { success: true };
      } else {
        throw new Error(res.error || 'Email verification failed');
      }
    } catch (e: any) {
      setViewState(s => ({ ...s, loading: false, error: e?.message }));
      return { success: false, error: e?.message };
    }
    setViewState(s => ({ ...s, loading: false }));
    return { success: true };
  }, []);

  // Google Auth Functions
  const onGoogleSuccess = useCallback(async (codeResponse: { code: string }) => {
    try {
      const tokens = await authApi.exchangeCode(codeResponse.code, window.location.origin);
      const res = await authApi.loginWithGoogle(tokens.data.id_token);
      if (res.data?.accessToken) {
        const userData = res.data?.user as User;
        localStorage.setItem('auth_token', res.data?.accessToken);
        localStorage.setItem('refresh_token', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthState(true, userData);
        router.push('/chat');
      }
    } catch (e: any) {
      console.error(e);
      setGoogleError(e?.message ?? 'Google login failed');
    } finally {
      setGoogleLoading(false);
    }
  }, [router, setAuthState]);

  const startGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: onGoogleSuccess,
    onError: () => setGoogleError('Google login failed'),
  });

  // Form Hook
  const useLoginForm = () => {
    return useForm<LoginFormData>({
      defaultValues: { email: '', password: '' },
      mode: 'onTouched',
      shouldUnregister: false,
    });
  };

  return {
    // Email Login State
    emailLoginState,
    precheckEmail,
    loginWithEmail,
    
    // View State (for register, resendVerification, verifyEmail)
    viewState,
    register,
    resendVerification,
    verifyEmail,
    
    // Google Auth
    googleLoading,
    googleError,
    startGoogleLogin,
    
    // Form Hook
    useLoginForm,
  };
}
