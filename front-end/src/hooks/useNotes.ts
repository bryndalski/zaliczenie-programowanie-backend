'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

export type Note = {
  userId: string;
  noteId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteInput = {
  title: string;
  content: string;
};

export type UpdateNoteInput = {
  title?: string;
  content?: string;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || ''
).replace(/\/$/, '');

async function getAuthHeader(): Promise<HeadersInit> {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    if (!token) {
      console.warn('No access token available');
      return { 'Content-Type': 'application/json' };
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    return { 'Content-Type': 'application/json' };
  }
}

export default function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchNotes = useCallback(async () => {
    if (!API_BASE) {
      setError('API base URL is not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${API_BASE}/notes/get`, { headers });

      if (!res.ok) {
        throw new Error(`Failed to fetch notes: ${res.status}`);
      }

      const json = await res.json();
      const incoming = Array.isArray(json?.notes) ? json.notes : [];
      setNotes(incoming);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load notes';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback(async (input: CreateNoteInput): Promise<Note> => {
    if (!API_BASE) {
      throw new Error('API base URL is not configured');
    }

    setActionLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${API_BASE}/notes/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Create failed: ${res.status} ${txt}`);
      }

      const json = await res.json();
      const created = json?.note;

      if (created) {
        setNotes((prev) => [created, ...prev]);
      }

      return created;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to create note';
      setError(message);
      throw e;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateNote = useCallback(async (noteId: string, input: UpdateNoteInput): Promise<Note> => {
    if (!API_BASE) {
      throw new Error('API base URL is not configured');
    }

    setActionLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${API_BASE}/notes/update?noteId=${noteId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Update failed: ${res.status} ${txt}`);
      }

      const json = await res.json();
      const updated = json?.note;

      if (updated) {
        setNotes((prev) =>
          prev.map((note) => (note.noteId === noteId ? updated : note))
        );
      }

      return updated;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update note';
      setError(message);
      throw e;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string): Promise<void> => {
    if (!API_BASE) {
      throw new Error('API base URL is not configured');
    }

    setActionLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${API_BASE}/notes/delete?noteId=${noteId}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }

      setNotes((prev) => prev.filter((note) => note.noteId !== noteId));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to delete note';
      setError(message);
      throw e;
    } finally {
      setActionLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    actionLoading,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
  };
}

