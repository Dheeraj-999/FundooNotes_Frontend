import apiClient from '../utils/apiClient';

export function getLabels() {
  return apiClient.get('/labels').then((response) => response.data);
}

export function createLabel(name) {
  return apiClient.post('/labels', { name }).then((response) => response.data);
}

export function updateLabel(labelId, name) {
  return apiClient.put(`/labels/${labelId}`, { name }).then((response) => response.data);
}

export function deleteLabel(labelId) {
  return apiClient.delete(`/labels/${labelId}`);
}

/** The backend puts the label id first and the note id second. */
export function assignLabelToNote(labelId, noteId) {
  return apiClient.post(`/labels/${labelId}/notes/${noteId}`);
}

export function removeLabelFromNote(labelId, noteId) {
  return apiClient.delete(`/labels/${labelId}/notes/${noteId}`);
}
