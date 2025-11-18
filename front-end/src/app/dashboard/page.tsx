'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
import useNotes from '@/hooks/useNotes';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { notes, loading, error, addNote, fetchNotes } = useNotes();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      await addNote(title.trim(), content.trim());
      setTitle('');
      setContent('');
      // refresh list
      await fetchNotes();
    } catch (err) {
      // handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Welcome back
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {user?.username || user?.email}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Settings className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Account Status
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {user?.emailVerified ? 'Verified' : 'Pending'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      View Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      Help & Support
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Area */}
            <div className="mt-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                  <div className="text-sm text-gray-500">{notes.length} notes</div>
                </div>

                <div className="p-6">
                  <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                      className="col-span-1 md:col-span-1 p-2 border rounded"
                    />
                    <input
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Content"
                      className="col-span-1 md:col-span-1 p-2 border rounded"
                    />
                    <div className="col-span-1 md:col-span-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                      >
                        {submitting ? 'Adding...' : 'Add Note'}
                      </button>
                    </div>
                  </form>

                  {error && <div className="text-red-600 mb-4">{error}</div>}

                  {loading ? (
                    <div>Loading notes...</div>
                  ) : notes.length === 0 ? (
                    <div className="text-gray-600">No notes yet.</div>
                  ) : (
                    <ul className="space-y-3">
                      {notes.map((n) => (
                        <li key={n.noteId} className="p-4 border rounded shadow-sm">
                          <div className="text-sm text-gray-500 mb-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
                          <div className="font-semibold">{n.title}</div>
                          <div className="mt-2 text-gray-800">{n.content}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={() => void signOut()} className="px-4 py-2 bg-red-500 text-white rounded">
                Sign out
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
