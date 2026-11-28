import {
  Archive,
  ArchiveRestore,
  Bell,
  Pencil,
  Pin,
  PinOff,
  RotateCcw,
  Tag,
  Trash2,
} from 'lucide-react';

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      className="icon-button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Icon size={17} />
    </button>
  );
}

/** Presentational note card: the parent owns every API call. */
export default function NoteCard({
  note,
  view = 'active',
  onEdit,
  onPin,
  onArchive,
  onUnarchive,
  onTrash,
  onRestore,
  onDeleteForever,
  onManageLabels,
  onManageReminder,
}) {
  const labels = Array.isArray(note.labels) ? note.labels : [];

  return (
    <article className={`note-card ${note.pinned ? 'note-card--pinned' : ''}`}>
      <div className="note-card__header">
        <h3>{note.title}</h3>
        {note.pinned && <Pin size={16} className="note-card__pin" aria-label="Pinned" />}
      </div>

      {note.description && <p className="note-card__body">{note.description}</p>}

      {labels.length > 0 && (
        <div className="note-card__labels">
          {labels.map((label) => (
            <span key={label.id} className="chip chip--label">
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div className="note-card__footer">
        <span className="note-card__meta">
          {view === 'archive' ? 'Archived' : view === 'trash' ? 'In trash' : 'Note'}
        </span>
        <div className="note-card__actions">
          {view === 'trash' ? (
            <>
              <ActionButton icon={RotateCcw} label="Restore note" onClick={() => onRestore?.(note.id)} />
              <ActionButton
                icon={Trash2}
                label="Delete permanently"
                onClick={() => onDeleteForever?.(note)}
              />
            </>
          ) : view === 'archive' ? (
            <>
              <ActionButton
                icon={ArchiveRestore}
                label="Unarchive note"
                onClick={() => onUnarchive?.(note.id)}
              />
              {onEdit && (
                <ActionButton icon={Pencil} label="Edit note" onClick={() => onEdit(note)} />
              )}
              <ActionButton icon={Trash2} label="Move to trash" onClick={() => onTrash?.(note.id)} />
            </>
          ) : (
            <>
              <ActionButton
                icon={note.pinned ? PinOff : Pin}
                label={note.pinned ? 'Unpin note' : 'Pin note'}
                onClick={() => onPin?.(note.id)}
              />
              {onEdit && (
                <ActionButton icon={Pencil} label="Edit note" onClick={() => onEdit(note)} />
              )}
              {onManageReminder && (
                <ActionButton
                  icon={Bell}
                  label="Set reminder"
                  onClick={() => onManageReminder(note)}
                />
              )}
              {onManageLabels && (
                <ActionButton
                  icon={Tag}
                  label="Manage labels"
                  onClick={() => onManageLabels(note)}
                />
              )}
              <ActionButton icon={Archive} label="Archive note" onClick={() => onArchive?.(note.id)} />
              <ActionButton icon={Trash2} label="Move to trash" onClick={() => onTrash?.(note.id)} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
