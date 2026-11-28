import apiClient from '../utils/apiClient';

export function getReminders() {
  return apiClient.get('/reminders').then((response) => response.data);
}

/** reminderTime is a local LocalDateTime string, e.g. "2026-11-30T10:00:00". */
export function createReminder(noteId, reminderTime) {
  return apiClient
    .post('/reminders', { noteId, reminderTime })
    .then((response) => response.data);
}

export function updateReminder(id, reminderTime) {
  return apiClient
    .put(`/reminders/${id}`, { reminderTime })
    .then((response) => response.data);
}

export function deleteReminder(id) {
  return apiClient.delete(`/reminders/${id}`);
}
