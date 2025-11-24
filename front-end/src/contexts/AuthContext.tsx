'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { User, AuthState } from '@/types/auth';
import { configureAmplify } from '@/lib/amplify-config';

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Configure Amplify once on mount
    try {
      configureAmplify();
      setIsConfigured(true);
    } catch (error) {
      console.error('Failed to configure Amplify:', error);
      setState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const checkAuthState = async () => {
    if (!isConfigured) {
      console.log('Amplify not yet configured, skipping auth check');
      return;
    }

    try {
      const user = await getCurrentUser();

      const userData: User = {
        id: user.userId,
        email: user.signInDetails?.loginId || user.username || '',
        username: user.username,
        emailVerified: true,
      };

      setState({
        user: userData,
        loading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.log('No authenticated user found:', error);
      setState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  };

  useEffect(() => {
    if (isConfigured) {
      checkAuthState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigured]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      // Force clear the state even if sign-out fails
      setState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  };

  const refreshAuth = async () => {
    setState(prev => ({ ...prev, loading: true }));
    await checkAuthState();
  };

  const value: AuthContextType = {
    ...state,
    signOut: handleSignOut,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
