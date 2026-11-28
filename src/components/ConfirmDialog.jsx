import { AlertTriangle, X } from 'lucide-react';

/** Shared confirmation dialog for destructive actions. */
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onClose,
}) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        className="modal modal--compact"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <header className="modal__header">
          <h2 id="confirm-dialog-title">{title}</h2>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close confirmation"
          >
            <X size={19} />
          </button>
        </header>

        <p className="modal__hint" id="confirm-dialog-message">
          <AlertTriangle size={16} /> {message}
        </p>

        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn--ghost btn--small" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger btn--small" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
