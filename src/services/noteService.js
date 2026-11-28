import apiClient from '../utils/apiClient';

export function getAllNotes() {
  return apiClient.get('/notes').then((response) => response.data);
}

export function createNote(payload) {
  return apiClient.post('/notes', payload).then((response) => response.data);
}

/** Pin/unpin is a toggle on the backend; never send a desired boolean. */
export function togglePinNote(noteId) {
  return apiClient.patch(`/notes/${noteId}/pin`).then((response) => response.data);
}

export function toggleArchiveNote(noteId) {
  return apiClient.patch(`/notes/${noteId}/archive`).then((response) => response.data);
}

export function toggleTrashNote(noteId) {
  return apiClient.patch(`/notes/${noteId}/trash`).then((response) => response.data);
}
