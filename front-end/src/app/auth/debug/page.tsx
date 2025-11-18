'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Trash2, Info, ArrowLeft } from 'lucide-react';
import { clearAmplifyAuthCache, debugAuthState, forceSignOut } from '@/lib/auth-utils';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebugPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = () => {
    clearAmplifyAuthCache();
    alert('Auth cache cleared! Refresh the page.');
  };

  const handleDebug = () => {
    debugAuthState();
  };

  const handleForceSignOut = async () => {
    setIsClearing(true);
    await forceSignOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Auth Debug Tools</h1>

          <div className="space-y-6">
            {/* Current Auth State */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Auth State</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-1 rounded ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {loading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </div>
                {user && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Username:</span>
                      <span className="text-gray-600">{user.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">User ID:</span>
                      <span className="text-gray-600 font-mono text-xs">{user.id}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Debug Actions */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Debug Actions</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleDebug}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Info className="h-5 w-5" />
                  Log Auth State to Console
                </button>

                <button
                  onClick={handleClearCache}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                  Clear Auth Cache
                </button>

                <button
                  onClick={handleForceSignOut}
                  disabled={isClearing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 md:col-span-2"
                >
                  <RefreshCw className={`h-5 w-5 ${isClearing ? 'animate-spin' : ''}`} />
                  Force Sign Out & Clear All
                </button>
              </div>
            </div>

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Information</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li><strong>Log Auth State:</strong> Prints all auth data to browser console</li>
                <li><strong>Clear Auth Cache:</strong> Removes Amplify auth data from localStorage</li>
                <li><strong>Force Sign Out:</strong> Clears all auth data and redirects to login</li>
              </ul>
            </div>

            {/* Common Issues */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Common Issues</h3>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li><strong>"Already signed in user":</strong> Use "Force Sign Out & Clear All"</li>
                <li><strong>Can't access dashboard:</strong> Check auth state in console first</li>
                <li><strong>Login not working:</strong> Clear cache and try again</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

