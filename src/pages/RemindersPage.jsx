import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import { formatReminderTime, isPastReminder, parseLocalDateTime } from '../utils/dateTime';
import {
  getNotificationPermission,
  playAlertSound,
  requestNotificationPermission,
  showBrowserNotification,
} from '../utils/notifications';
import { filterNotes } from '../utils/noteFilters';

export default function RemindersPage() {
  const {
    notes,
    reminders = [],
    remindersLoading,
    deleteReminder,
    openReminder,
  } = useOutletContext();
  const { showToast } = useToast();
  const [noteId, setNoteId] = useState('');
  const [permission, setPermission] = useState(getNotificationPermission);

  const activeNotes = useMemo(
    () => filterNotes(notes, { archived: false, trashed: false }),
    [notes],
  );
  const selectedNote = activeNotes.find((note) => String(note.id) === String(noteId));
  const sortedReminders = useMemo(
    () =>
      [...reminders].sort(
        (a, b) =>
          (parseLocalDateTime(a.reminderTime)?.getTime() || 0) -
          (parseLocalDateTime(b.reminderTime)?.getTime() || 0),
      ),
    [reminders],
  );

  const handleStart = () => {
    if (!selectedNote) return;
    openReminder?.(selectedNote);
    setNoteId('');
  };

  const handleEdit = (reminder) => {
    const note =
      notes.find((item) => item.id === reminder.noteId) || {
        id: reminder.noteId,
        title: reminder.noteTitle || 'this note',
      };
    openReminder?.(note, reminder);
  };

  const handleEnableAlerts = async () => {
    setPermission(await requestNotificationPermission());
  };

  const handleTestAlert = () => {
    showToast('Test alert — this is how your reminders will appear.', 'info');
    showBrowserNotification({
      title: 'Fundoo Notes test alert',
      body: 'Your reminder alerts are working.',
      tag: 'fundoo-test-alert',
    });
    playAlertSound();
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Workspace</p>
          <h1 className="page-title">Reminders</h1>
          <p className="page-subtitle">Little nudges for the things you don't want to forget.</p>
        </div>
      </header>

      <div className="alert-settings">
        <span className={`chip ${permission === 'granted' ? 'chip--upcoming' : 'chip--past'}`}>
          Browser alerts:{' '}
          {permission === 'granted'
            ? 'On'
            : permission === 'denied'
              ? 'Blocked'
              : permission === 'unsupported'
                ? 'Unsupported'
                : 'Off'}
        </span>
        {permission === 'default' && (
          <button type="button" className="btn btn--ghost btn--small" onClick={handleEnableAlerts}>
            Enable browser alerts
          </button>
        )}
        <button type="button" className="btn btn--ghost btn--small" onClick={handleTestAlert}>
          Test alert
        </button>
        {(permission === 'denied' || permission === 'unsupported') && (
          <p className="reminder-compose__hint">
            Desktop alerts aren't available here — email reminders still work.
          </p>
        )}
      </div>

      <div className="reminder-compose">
        <div className="field">
          <label htmlFor="reminder-note">Choose a note</label>
          <select
            id="reminder-note"
            value={noteId}
            onChange={(event) => setNoteId(event.target.value)}
          >
            <option value="">Select a note...</option>
            {activeNotes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={handleStart}
          disabled={!selectedNote}
        >
          <Plus size={16} /> Set reminder
        </button>
        <p className="reminder-compose__hint">Times are shown in your device's local time zone.</p>
      </div>

      {remindersLoading ? (
        <div className="loading-state" role="status">
          <span className="spinner" />
          <p>Loading reminders...</p>
        </div>
      ) : sortedReminders.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No reminders yet"
          description="Pick a note above and choose when we should remind you about it."
        />
      ) : (
        <div className="reminder-list">
          {sortedReminders.map((reminder) => {
            const title =
              reminder.noteTitle ||
              notes.find((note) => note.id === reminder.noteId)?.title ||
              'Untitled note';
            const past = isPastReminder(reminder.reminderTime);

            return (
              <article key={reminder.id} className="reminder-row">
                <span className="reminder-row__icon"><Bell size={19} /></span>
                <div className="reminder-row__details">
                  <h3>{title}</h3>
                  <p>
                    <Clock size={14} aria-hidden="true" />
                    {formatReminderTime(reminder.reminderTime)}
                  </p>
                </div>
                <span className={`chip ${past ? 'chip--past' : 'chip--upcoming'}`}>
                  {past ? 'Past' : 'Upcoming'}
                </span>
                <div className="reminder-row__actions">
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Edit reminder for ${title}`}
                    onClick={() => handleEdit(reminder)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-button icon-button--danger"
                    aria-label={`Delete reminder for ${title}`}
                    onClick={() => deleteReminder?.(reminder.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
