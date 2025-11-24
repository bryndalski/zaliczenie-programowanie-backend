'use client';

/**
 * Utility functions for managing auth state and debugging
 */

/**
 * Clear all Amplify auth data from localStorage
 * Useful when debugging auth issues
 */
export function clearAmplifyAuthCache() {
  if (typeof window === 'undefined') return;

  const keys = Object.keys(localStorage);
  const amplifyKeys = keys.filter(key =>
    key.startsWith('CognitoIdentityServiceProvider') ||
    key.startsWith('amplify-')
  );

  amplifyKeys.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log(`Cleared ${amplifyKeys.length} Amplify auth cache keys`);
}

/**
 * Debug function to log all auth-related localStorage data
 */
export function debugAuthState() {
  if (typeof window === 'undefined') {
    console.log('Not in browser environment');
    return;
  }

  const keys = Object.keys(localStorage);
  const amplifyKeys = keys.filter(key =>
    key.startsWith('CognitoIdentityServiceProvider') ||
    key.startsWith('amplify-')
  );

  console.group('🔐 Auth State Debug');
  console.log('Total localStorage keys:', keys.length);
  console.log('Amplify auth keys:', amplifyKeys.length);

  amplifyKeys.forEach(key => {
    const value = localStorage.getItem(key);
    try {
      const parsed = JSON.parse(value || '');
      console.log(key, parsed);
    } catch {
      console.log(key, value);
    }
  });

  console.groupEnd();
}

/**
 * Force sign out by clearing all auth data
 */
export async function forceSignOut() {
  if (typeof window === 'undefined') return;

  // Clear localStorage
  clearAmplifyAuthCache();

  // Clear sessionStorage
  sessionStorage.clear();

  console.log('✅ Force sign out completed');

  // Reload the page to reset app state
  window.location.href = '/auth/login';
}

