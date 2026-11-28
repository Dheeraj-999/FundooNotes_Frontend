import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../components/Toast';
import {
  createReminder,
  deleteReminder as deleteReminderApi,
  getReminders,
  updateReminder as updateReminderApi,
} from '../services/reminderService';
import { getErrorMessage } from '../utils/errors';

export function useReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadReminders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReminders();
      setReminders(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to load reminders.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const addReminder = useCallback(
    async (noteId, reminderTime) => {
      try {
        const created = await createReminder(noteId, reminderTime);
        setReminders((current) => [
          ...current.filter((reminder) => reminder.noteId !== noteId),
          created,
        ]);
        showToast('Reminder set');
        return created;
      } catch (error) {
        showToast(getErrorMessage(error, 'Unable to set the reminder.'), 'error');
        return null;
      }
    },
    [showToast],
  );

  const updateReminder = useCallback(
    async (id, reminderTime) => {
      try {
        const updated = await updateReminderApi(id, reminderTime);
        setReminders((current) =>
          current.map((reminder) => (reminder.id === id ? updated : reminder)),
        );
        showToast('Reminder updated');
        return updated;
      } catch (error) {
        showToast(getErrorMessage(error, 'Unable to update the reminder.'), 'error');
        return null;
      }
    },
    [showToast],
  );

  const deleteReminder = useCallback(
    async (id) => {
      try {
        await deleteReminderApi(id);
        setReminders((current) => current.filter((reminder) => reminder.id !== id));
        showToast('Reminder removed');
        return true;
      } catch (error) {
        showToast(getErrorMessage(error, 'Unable to remove the reminder.'), 'error');
        return false;
      }
    },
    [showToast],
  );

  return {
    reminders,
    loading: loading,
    loadReminders,
    addReminder,
    updateReminder,
    deleteReminder,
  };
}
