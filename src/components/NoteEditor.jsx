import { useState } from 'react';
import { Pencil, Plus, X } from 'lucide-react';
import { validateNote } from '../utils/validators';

const EMPTY_NOTE = { title: '', description: '' };

/** Inline composer on the dashboard; also reused as an edit dialog for a saved note. */
export default function NoteEditor({ onSave, note = null, onClose }) {
  const editing = Boolean(note);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() =>
    note
      ? { title: note.title || '', description: note.description || '' }
      : EMPTY_NOTE,
  );
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === 'title') setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateNote(form);
    setError(errors.title || '');
    if (errors.title) return;

    const saved = await onSave?.({
      title: form.title.trim(),
      description: form.description.trim(),
    });
    if (saved) {
      setForm(EMPTY_NOTE);
      if (editing) onClose?.();
      else setOpen(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_NOTE);
    setError('');
    if (editing) onClose?.();
    else setOpen(false);
  };

  const formMarkup = (
    <form className="note-editor" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="sr-only" htmlFor={editing ? 'edit-note-title' : 'note-title'}>
          Title
        </label>
        <input
          id={editing ? 'edit-note-title' : 'note-title'}
          name="title"
          className="note-editor__title"
          placeholder="Note title"
          value={form.title}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? (editing ? 'edit-note-title-error' : 'note-title-error') : undefined}
          autoFocus={!editing}
        />
        {error && (
          <span className="field__error" id={editing ? 'edit-note-title-error' : 'note-title-error'}>
            {error}
          </span>
        )}
      </div>

      <div className="field">
        <label className="sr-only" htmlFor={editing ? 'edit-note-description' : 'note-description'}>
          Description
        </label>
        <textarea
          id={editing ? 'edit-note-description' : 'note-description'}
          name="description"
          className="note-editor__description"
          placeholder="Write something down..."
          rows={editing ? 6 : 3}
          value={form.description}
          onChange={handleChange}
          autoFocus={editing}
        />
      </div>

      <div className="note-editor__actions">
        <button type="button" className="btn btn--ghost btn--small" onClick={handleCancel}>
          <X size={15} /> Cancel
        </button>
        <button type="submit" className="btn btn--primary btn--small">
          <Pencil size={15} /> {editing ? 'Save changes' : 'Save note'}
        </button>
      </div>
    </form>
  );

  if (editing) {
    return (
      <div
        className="modal-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) handleCancel();
        }}
      >
        <div
          className="modal modal--compact"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-note-modal-title"
        >
          <header className="modal__header">
            <h2 id="edit-note-modal-title">Edit note</h2>
            <button
              type="button"
              className="icon-button"
              onClick={handleCancel}
              aria-label="Close editor"
            >
              <X size={19} />
            </button>
          </header>
          {formMarkup}
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className="note-editor__trigger" onClick={() => setOpen(true)}>
        <Plus size={20} />
        <span>Take a note...</span>
      </button>
    );
  }

  return formMarkup;
}
