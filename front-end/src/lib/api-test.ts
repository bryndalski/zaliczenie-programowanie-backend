'use client';

import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

export async function debugAuth() {
  try {
    console.log('🔍 Starting auth debug...');

    // Check if user is authenticated
    const user = await getCurrentUser();
    console.log('✅ Current user:', {
      userId: user.userId,
      username: user.username,
      signInDetails: user.signInDetails
    });

    // Get auth session with force refresh
    const session = await fetchAuthSession({ forceRefresh: true });
    console.log('✅ Auth session:', {
      credentials: session.credentials ? 'Present' : 'Missing',
      identityId: session.identityId,
      tokens: session.tokens ? {
        accessToken: session.tokens.accessToken ? 'Present' : 'Missing',
        idToken: session.tokens.idToken ? 'Present' : 'Missing',
        refreshToken: session.tokens.refreshToken ? 'Present' : 'Missing',
      } : 'Missing'
    });

    // Check token details
    if (session.tokens?.idToken) {
      const idToken = session.tokens.idToken.toString();
      console.log('🔑 ID Token (first 50 chars):', idToken.substring(0, 50));

      // Decode token payload (without verification for debugging)
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        console.log('🔓 Token payload:', {
          iss: payload.iss,
          sub: payload.sub,
          aud: payload.aud,
          exp: new Date(payload.exp * 1000).toISOString(),
          iat: new Date(payload.iat * 1000).toISOString(),
          token_use: payload.token_use,
          email: payload.email
        });
      } catch (e) {
        console.error('❌ Failed to decode token:', e);
      }
    }

    return {
      isAuthenticated: true,
      token: session.tokens?.idToken?.toString(),
      user
    };

  } catch (error) {
    console.error('❌ Auth debug failed:', error);
    return {
      isAuthenticated: false,
      error
    };
  }
}

export async function testApiCall() {
  try {
    console.log('🧪 Testing API call...');

    const authResult = await debugAuth();
    if (!authResult.isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
    if (!apiUrl) {
      throw new Error('API URL not configured');
    }

    const response = await fetch(`${apiUrl}/notes/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authResult.token}`
      }
    });

    console.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const text = await response.text();
    console.log('📄 Response body:', text);

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return JSON.parse(text);

  } catch (error) {
    console.error('❌ API test failed:', error);
    throw error;
  }
}
