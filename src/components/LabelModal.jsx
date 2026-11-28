import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { validateLabel } from '../utils/validators';

export default function LabelModal({
  note,
  labels = [],
  onClose,
  onAssign,
  onRemove,
  onCreate,
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const assignedIds = new Set((note.labels || []).map((label) => label.id));

  const handleToggle = async (label, checked) => {
    if (checked) await onAssign?.(label.id);
    else await onRemove?.(label.id);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const validationError = validateLabel({ name }).name;
    setError(validationError || '');
    if (validationError) return;

    const created = await onCreate?.(name);
    if (created) {
      setName('');
      await onAssign?.(created.id);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="label-modal-title">
        <header className="modal__header">
          <h2 id="label-modal-title">Labels</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close labels">
            <X size={19} />
          </button>
        </header>

        <p className="modal__hint">
          Organise <strong>{note.title}</strong> with labels.
        </p>

        <div className="label-options">
          {labels.length === 0 && <p className="modal__empty">No labels yet — create one below.</p>}
          {labels.map((label) => (
            <label key={label.id} className="label-option">
              <input
                type="checkbox"
                checked={assignedIds.has(label.id)}
                onChange={(event) => handleToggle(label, event.target.checked)}
              />
              <span>{label.name}</span>
            </label>
          ))}
        </div>

        <form className="inline-form" onSubmit={handleCreate}>
          <div className="field">
            <label className="sr-only" htmlFor="new-label-name">New label</label>
            <input
              id="new-label-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
              placeholder="Create a new label"
              aria-invalid={Boolean(error)}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--small">
            <Plus size={16} /> Add
          </button>
          {error && <span className="field__error">{error}</span>}
        </form>

        <footer className="modal__footer">
          <button type="button" className="btn btn--ghost btn--small" onClick={onClose}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
