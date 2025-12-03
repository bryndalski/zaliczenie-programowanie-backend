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
    console.log('🔐 Getting auth session...');

    // Try multiple times to get a valid session
    let session;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        // Force refresh to ensure we have the latest tokens
        session = await fetchAuthSession({ forceRefresh: attempts > 0 });

        if (session.tokens?.idToken) {
          break; // We got a token, exit the loop
        }

        console.warn(`⚠️ No tokens in session, attempt ${attempts + 1}/${maxAttempts}`);
        attempts++;

        if (attempts < maxAttempts) {
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (sessionError) {
        console.error(`❌ Session error on attempt ${attempts + 1}:`, sessionError);
        attempts++;

        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    if (!session || !session.tokens?.idToken) {
      console.error('❌ Failed to get valid session after all attempts');
      throw new Error('Authentication session not available. Please log in again.');
    }

    console.log('📊 Auth session:', {
      credentials: session.credentials ? 'Present' : 'Missing',
      identityId: session.identityId ? 'Present' : 'Missing',
      tokens: session.tokens ? 'Present' : 'Missing'
    });

    const token = session.tokens.idToken.toString();

    console.log('✅ ID token found (first 20 chars):', token.substring(0, 20) + '...');

    // Decode token to check expiry (without verification)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = new Date(payload.exp * 1000);
      const now = new Date();

      console.log('🔍 Token details:', {
        expires: exp.toISOString(),
        isExpired: now > exp,
        user: payload.sub,
        email: payload.email,
        timeUntilExpiry: Math.max(0, Math.floor((exp.getTime() - now.getTime()) / 1000 / 60)) + ' minutes'
      });

      if (now > exp) {
        console.warn('⚠️ Token is expired');
        throw new Error('Authentication token has expired. Please log in again.');
      }
    } catch (decodeError) {
      console.warn('⚠️ Could not decode token:', decodeError);
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  } catch (error) {
    console.error('❌ Error getting auth token:', error);
    throw error;
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
      console.log('🚀 Fetching notes...');
      const headers = await getAuthHeader();
      console.log('📡 Making request to:', `${API_BASE}/notes/get`);
      console.log('📋 Headers:', headers);

      const res = await fetch(`${API_BASE}/notes/get`, {
        method: 'GET',
        headers
      });

      console.log('📥 Response status:', res.status, res.statusText);

      if (!res.ok) {
        const responseText = await res.text();
        console.error('❌ API Error Response:', responseText);

        if (res.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        }
        throw new Error(`Failed to fetch notes: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      console.log('✅ Notes fetched successfully:', json);

      const incoming = Array.isArray(json?.notes) ? json.notes : [];
      setNotes(incoming);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load notes';
      console.error('❌ Fetch notes error:', message);
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
      // Backend expects noteId as a path parameter: PUT /notes/{noteId}
      const res = await fetch(`${API_BASE}/notes/${noteId}`, {
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
      // Backend expects noteId as a path parameter: DELETE /notes/{noteId}
      const res = await fetch(`${API_BASE}/notes/${noteId}`, {
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
