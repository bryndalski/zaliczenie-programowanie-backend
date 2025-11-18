'use client';

import { useState } from 'react';
import { signIn, signUp, confirmSignUp, resetPassword, confirmResetPassword, signOut, getCurrentUser } from 'aws-amplify/auth';
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
      // Check if user is already signed in and sign out first
      try {
        await getCurrentUser();
        // If we get here, user is already signed in, so sign out first
        console.log('User already signed in, signing out first...');
        await signOut();
      } catch {
        // User is not signed in, continue with login
      }

      await signIn({
        username: credentials.email,
        password: credentials.password,
      });

      await refreshAuth();
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      const errorCode = err instanceof Error && 'name' in err ? (err as any).name : 'UnknownError';

      setError({
        message: errorMessage,
        code: errorCode,
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      const errorCode = err instanceof Error && 'name' in err ? (err as any).name : 'UnknownError';

      setError({
        message: errorMessage,
        code: errorCode,
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm account';
      const errorCode = err instanceof Error && 'name' in err ? (err as any).name : 'UnknownError';

      setError({
        message: errorMessage,
        code: errorCode,
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset code';
      const errorCode = err instanceof Error && 'name' in err ? (err as any).name : 'UnknownError';

      setError({
        message: errorMessage,
        code: errorCode,
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      const errorCode = err instanceof Error && 'name' in err ? (err as any).name : 'UnknownError';

      setError({
        message: errorMessage,
        code: errorCode,
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
