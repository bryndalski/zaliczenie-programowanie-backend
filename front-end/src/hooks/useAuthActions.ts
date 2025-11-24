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
      // Always try to sign out first to clear any stale state
      try {
        await signOut();
        // Wait a bit to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch {
        // Ignore errors if no user was signed in
      }

      const result = await signIn({
        username: credentials.email,
        password: credentials.password,
      });

      // Check if sign-in was successful
      if (result.isSignedIn) {
        await refreshAuth();
        return true;
      } else {
        setError({
          message: 'Sign-in was not completed',
          code: 'SignInIncomplete',
        });
        return false;
      }
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
        newPassword: data.password,
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
