import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import {
  toBackendDateTime,
  toInputDateTime,
  validateReminderTime,
} from '../utils/validators';
import { requestNotificationPermission } from '../utils/notifications';

export default function ReminderModal({ note, reminder, onSave, onClose }) {
  const [value, setValue] = useState(toInputDateTime(reminder?.reminderTime));
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateReminderTime(value);
    setError(validationError);
    if (validationError) return;

    // Browsers only allow this prompt from a user gesture (the save click).
    requestNotificationPermission();
    const saved = await onSave?.(toBackendDateTime(value));
    if (saved) onClose?.();
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        className="modal modal--compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-modal-title"
      >
        <header className="modal__header">
          <h2 id="reminder-modal-title">{reminder ? 'Edit reminder' : 'Set a reminder'}</h2>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close reminder"
          >
            <X size={19} />
          </button>
        </header>

        <p className="modal__hint">
          We'll remind you about <strong>{note?.title || 'this note'}</strong>.
        </p>

        <form className="reminder-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="reminder-time">Date and time</label>
            <input
              id="reminder-time"
              type="datetime-local"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setError('');
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'reminder-time-error' : undefined}
            />
            {error && (
              <span className="field__error" id="reminder-time-error">
                {error}
              </span>
            )}
          </div>

          <div className="reminder-form__actions">
            <button type="button" className="btn btn--ghost btn--small" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary btn--small">
              <Bell size={16} /> {reminder ? 'Update' : 'Set reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
