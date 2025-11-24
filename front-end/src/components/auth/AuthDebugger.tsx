'use client';

import { useState } from 'react';
import { debugAuth, testApiCall } from '@/lib/api-test';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebugger() {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleDebugAuth = async () => {
    setLoading(true);
    setDebugInfo('');

    try {
      console.clear();
      console.log('🔍 Starting auth debug...');

      const result = await debugAuth();
      setDebugInfo(JSON.stringify(result, null, 2));
    } catch (error) {
      setDebugInfo(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestApi = async () => {
    setLoading(true);
    setDebugInfo('');

    try {
      console.clear();
      console.log('🧪 Testing API call...');

      const result = await testApiCall();
      setDebugInfo(JSON.stringify(result, null, 2));
    } catch (error) {
      setDebugInfo(`API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="font-bold text-lg mb-3">Auth Debugger</h3>

      <div className="mb-3 text-sm">
        <p><strong>Auth Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
        <p><strong>User:</strong> {user?.email || 'None'}</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleDebugAuth}
          disabled={loading}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
        >
          {loading ? 'Testing...' : 'Debug Auth'}
        </button>

        <button
          onClick={handleTestApi}
          disabled={loading || !isAuthenticated}
          className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
        >
          {loading ? 'Testing...' : 'Test API Call'}
        </button>
      </div>

      {debugInfo && (
        <div className="mt-3">
          <p className="text-xs font-semibold mb-1">Debug Info:</p>
          <pre className="text-xs bg-gray-100 p-2 rounded max-h-40 overflow-auto">
            {debugInfo}
          </pre>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Check browser console for detailed logs
      </p>
    </div>
  );
}
