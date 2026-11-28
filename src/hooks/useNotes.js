import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../components/Toast';
import {
  createNote as createNoteApi,
  getAllNotes,
  toggleArchiveNote,
  togglePinNote,
  toggleTrashNote,
} from '../services/noteService';
import { getErrorMessage } from '../utils/errors';

/** Loads notes once and keeps the list in sync after each mutation. */
export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllNotes();
      setNotes(Array.isArray(data) ? data : []);
      setError('');
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'Unable to load your notes.');
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const addNote = useCallback(
    async (payload) => {
      try {
        const created = await createNoteApi(payload);
        setNotes((current) => [created, ...current]);
        showToast('Note created');
        return created;
      } catch (requestError) {
        showToast(getErrorMessage(requestError, 'Unable to create the note.'), 'error');
        return null;
      }
    },
    [showToast],
  );

  const runToggle = useCallback(
    async (action, noteId, message) => {
      try {
        const updated = await action(noteId);
        setNotes((current) =>
          current.map((note) => (note.id === updated.id ? updated : note)),
        );
        if (message) showToast(message);
        return updated;
      } catch (requestError) {
        showToast(getErrorMessage(requestError, 'Unable to update the note.'), 'error');
        return null;
      }
    },
    [showToast],
  );

  const pinNote = useCallback(
    (noteId) => runToggle(togglePinNote, noteId, ''),
    [runToggle],
  );
  const archiveNote = useCallback(
    (noteId) => runToggle(toggleArchiveNote, noteId, 'Note archived'),
    [runToggle],
  );
  const unarchiveNote = useCallback(
    (noteId) => runToggle(toggleArchiveNote, noteId, 'Note restored from archive'),
    [runToggle],
  );
  const trashNote = useCallback(
    (noteId) => runToggle(toggleTrashNote, noteId, 'Note moved to trash'),
    [runToggle],
  );
  const restoreNote = useCallback(
    (noteId) => runToggle(toggleTrashNote, noteId, 'Note restored'),
    [runToggle],
  );

  return {
    notes,
    setNotes,
    loading,
    error,
    reload: loadNotes,
    addNote,
    pinNote,
    archiveNote,
    unarchiveNote,
    trashNote,
    restoreNote,
  };
}
