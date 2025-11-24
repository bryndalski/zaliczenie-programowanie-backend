'use client';

import React from 'react';
import { Trash2, Edit2, Calendar } from 'lucide-react';
import { Note } from '@/hooks/useNotes';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 flex-1 break-words">
          {note.title}
        </h3>
        <div className="flex space-x-2 ml-2">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit note"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(note.noteId)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {note.content && (
        <p className="text-gray-600 mb-4 whitespace-pre-wrap break-words">
          {note.content}
        </p>
      )}

      <div className="flex items-center text-sm text-gray-500 space-x-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Created: {formatDate(note.createdAt)}</span>
        </div>
        {note.updatedAt !== note.createdAt && (
          <div className="flex items-center">
            <span>Updated: {formatDate(note.updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

