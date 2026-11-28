import { useEffect, useRef } from 'react';
import { useToast } from '../components/Toast';
import { parseLocalDateTime } from '../utils/dateTime';
import {
  playAlertSound,
  showBrowserNotification,
} from '../utils/notifications';

const CHECK_INTERVAL_MS = 10_000;
const ALERT_WINDOW_MS = 5 * 60_000;
const STORAGE_KEY = 'fundoo:fired-reminders';

function readFired() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return new Set(Array.isArray(stored) ? stored.map(String) : []);
  } catch {
    return new Set();
  }
}

function saveFired(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Storage can be unavailable in private browsing; alerts still fire once per session.
  }
}

/**
 * Fires a toast, desktop notification and chime when a reminder becomes due.
 * The backend emails the same reminder as a backup when the tab is closed.
 */
export function useReminderAlerts(reminders = [], notes = []) {
  const { showToast } = useToast();
  const firedRef = useRef(readFired());

  useEffect(() => {
    const checkDueReminders = () => {
      const now = Date.now();
      const fired = new Set(firedRef.current);
      let changed = false;

      reminders.forEach((reminder) => {
        const id = String(reminder.id);
        if (fired.has(id)) return;

        const dueAt = parseLocalDateTime(reminder.reminderTime)?.getTime();
        if (!dueAt || dueAt > now || now - dueAt > ALERT_WINDOW_MS) return;

        const title =
          reminder.noteTitle ||
          notes.find((note) => String(note.id) === String(reminder.noteId))?.title ||
          'Fundoo Notes reminder';

        showToast(`Reminder: ${title}`, 'info');
        showBrowserNotification({
          title: 'Fundoo Notes reminder',
          body: title,
          tag: `fundoo-reminder-${id}`,
        });
        playAlertSound();

        fired.add(id);
        changed = true;
      });

      if (changed) {
        firedRef.current = fired;
        saveFired(fired);
      }
    };

    checkDueReminders();
    const timer = setInterval(checkDueReminders, CHECK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reminders, notes, showToast]);
}
