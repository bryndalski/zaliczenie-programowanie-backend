'use client';

import { useState } from 'react';
import { signIn, signUp, confirmSignUp, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useAuth } from '@/contexts/AuthContext';
import type {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordData,
  ResetPasswordData,
  AuthError
} from '@/types/auth';

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const { refreshAuth } = useAuth();

  const clearError = () => setError(null);

  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await signIn({
        username: credentials.email,
        password: credentials.password,
      });

      await refreshAuth();
      return true;
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to sign in',
        code: err.name,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (credentials: RegisterCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await signUp({
        username: credentials.email,
        password: credentials.password,
        options: {
          userAttributes: {
            email: credentials.email,
          },
        },
      });

      return true;
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to create account',
        code: err.name,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (email: string, code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      return true;
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to confirm account',
        code: err.name,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await resetPassword({
        username: data.email,
      });

      return true;
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to send reset code',
        code: err.name,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await confirmResetPassword({
        username: data.email,
        confirmationCode: data.code,
        newPassword: data.newPassword,
      });

      return true;
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to reset password',
        code: err.name,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    clearError,
    handleLogin,
    handleRegister,
    handleConfirmSignUp,
    handleForgotPassword,
    handleResetPassword,
  };
}
