import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { validateNote } from '../utils/validators';

const EMPTY_NOTE = { title: '', description: '' };

export default function NoteEditor({ onSave }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_NOTE);
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

    const created = await onSave?.({
      title: form.title.trim(),
      description: form.description.trim(),
    });
    if (created) {
      setForm(EMPTY_NOTE);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_NOTE);
    setError('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button type="button" className="note-editor__trigger" onClick={() => setOpen(true)}>
        <Plus size={20} />
        <span>Take a note...</span>
      </button>
    );
  }

  return (
    <form className="note-editor" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="sr-only" htmlFor="note-title">Title</label>
        <input
          id="note-title"
          name="title"
          className="note-editor__title"
          placeholder="Note title"
          value={form.title}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'note-title-error' : undefined}
          autoFocus
        />
        {error && <span className="field__error" id="note-title-error">{error}</span>}
      </div>

      <div className="field">
        <label className="sr-only" htmlFor="note-description">Description</label>
        <textarea
          id="note-description"
          name="description"
          className="note-editor__description"
          placeholder="Write something down..."
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="note-editor__actions">
        <button type="button" className="btn btn--ghost btn--small" onClick={handleCancel}>
          <X size={15} /> Cancel
        </button>
        <button type="submit" className="btn btn--primary btn--small">
          Save note
        </button>
      </div>
    </form>
  );
}
