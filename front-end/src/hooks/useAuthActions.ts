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
      console.log('🔑 Starting login process...');

      // Always try to sign out first to clear any stale state
      try {
        await signOut();
        console.log('🧹 Cleared existing session');
        // Wait a bit to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch {
        console.log('📝 No existing session to clear');
      }

      console.log('🚀 Attempting sign-in...');
      const result = await signIn({
        username: credentials.email,
        password: credentials.password,
      });

      console.log('📊 Sign-in result:', {
        isSignedIn: result.isSignedIn,
        nextStep: result.nextStep?.signInStep
      });

      // Check if sign-in was successful
      if (result.isSignedIn) {
        console.log('✅ Sign-in successful, refreshing auth state...');
        await refreshAuth();

        // Wait a bit more to ensure tokens are available
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify that we actually have tokens
        try {
          const { fetchAuthSession } = await import('aws-amplify/auth');
          const session = await fetchAuthSession();
          if (!session.tokens?.idToken) {
            throw new Error('No tokens available after login');
          }
          console.log('✅ Tokens verified after login');
        } catch (tokenError) {
          console.error('❌ Token verification failed:', tokenError);
          throw new Error('Login failed: Unable to obtain authentication tokens');
        }

        return true;
      } else {
        console.warn('⚠️ Sign-in not completed:', result.nextStep);
        setError({
          message: 'Sign-in was not completed',
          code: 'SignInIncomplete',
        });
        return false;
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      const errorCode = err instanceof Error && 'name' in err ? (err as any).name : 'UnknownError';

      console.error('❌ Login error:', { errorMessage, errorCode });

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
