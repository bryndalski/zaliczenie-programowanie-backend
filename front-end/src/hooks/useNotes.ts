'use client';

import { useCallback, useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

export type Note = {
  userId: string;
  noteId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  [k: string]: any;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || process.env.NEXT_PUBLIC_NOTES_API_URL || ''
).replace(/\/$/, '');

async function getAuthHeader() {
  try {
    const session = await Auth.currentSession();
    const token = session.getAccessToken().getJwtToken();
    return { Authorization: `Bearer ${token}` };
  } catch (err) {
    // Not authenticated or unable to get token
    return {};
  }
}

export default function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!API_BASE) {
      setError('API base URL is not configured (set NEXT_PUBLIC_API_GATEWAY_URL or NEXT_PUBLIC_NOTES_API_URL)');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      };

      const res = await fetch(`${API_BASE}/notes/get`, { headers });
      if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);

      const json = await res.json();
      // Lambda returns { notes, count }
      const incoming = Array.isArray(json?.notes) ? json.notes : [];
      setNotes(incoming);
    } catch (e: any) {
      setError(e?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback(async (title: string, content: string) => {
    if (!API_BASE) throw new Error('API base URL is not configured');
    setError(null);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      };

      const res = await fetch(`${API_BASE}/notes/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Create failed: ${res.status} ${txt}`);
      }

      // response contains { note }
      const json = await res.json();
      const created = json?.note;
      if (created) {
        setNotes((prev) => [created, ...prev]);
      }
      return created;
    } catch (e: any) {
      setError(e?.message || 'Failed to create note');
      throw e;
    }
  }, []);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  return { notes, loading, error, fetchNotes, addNote };
}

