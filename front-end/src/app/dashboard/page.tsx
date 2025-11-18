'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Plus, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import useNotes, { Note } from '@/hooks/useNotes';
import NoteCard from '@/components/notes/NoteCard';
import CreateNoteModal from '@/components/notes/CreateNoteModal';
import EditNoteModal from '@/components/notes/EditNoteModal';
import DeleteConfirmModal from '@/components/notes/DeleteConfirmModal';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { notes, loading, error, actionLoading, addNote, updateNote, deleteNote, fetchNotes } = useNotes();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (noteId: string) => {
    const note = notes.find(n => n.noteId === noteId);
    if (note) {
      setNoteToDelete({ id: noteId, title: note.title });
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNote(noteToDelete.id);
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      // Error is handled in the hook
      console.error('Delete error:', err);
    }
  };

  const handleRefresh = async () => {
    await fetchNotes();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh notes"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            {/* Stats Bar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="h-5 w-5" />
                <span>New Note</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && notes.length === 0 && (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your notes...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && notes.length === 0 && !error && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
                <p className="text-gray-600 mb-6">Create your first note to get started!</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Create Note
                </button>
              </div>
            )}

            {/* Notes Grid */}
            {notes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard
                    key={note.noteId}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <CreateNoteModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={addNote}
        />

        <EditNoteModal
          isOpen={isEditModalOpen}
          note={selectedNote}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedNote(null);
          }}
          onSubmit={updateNote}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          noteTitle={noteToDelete?.title || ''}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setNoteToDelete(null);
          }}
          loading={actionLoading}
        />
      </div>
    </ProtectedRoute>
  );
}
