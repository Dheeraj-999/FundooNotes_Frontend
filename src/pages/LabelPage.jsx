import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Check, FilterX, Pencil, Plus, Tag, Trash2, X } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import NoteCard from '../components/NoteCard';
import NoteList from '../components/NoteList';
import { filterNotes } from '../utils/noteFilters';
import { validateLabel } from '../utils/validators';

export default function LabelPage() {
  const {
    notes,
    query,
    loading,
    labels = [],
    labelsLoading,
    addLabel,
    renameLabel,
    deleteLabel,
    selectedLabelId,
    setSelectedLabelId,
    pinNote,
    archiveNote,
    trashNote,
    openReminder,
    openEditor,
  } = useOutletContext();

  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const selectedLabel = labels.find((label) => label.id === selectedLabelId);
  const activeNotes = filterNotes(notes, { archived: false, trashed: false, query });
  const labelledNotes = selectedLabel
    ? activeNotes.filter((note) => (note.labels || []).some((label) => label.id === selectedLabel.id))
    : [];

  const handleCreate = async (event) => {
    event.preventDefault();
    const error = validateLabel({ name }).name;
    setFormError(error || '');
    if (error) return;
    const created = await addLabel?.(name);
    if (created) setName('');
  };

  const startEditing = (label) => {
    setEditingId(label.id);
    setEditingName(label.name);
  };

  const handleRename = async (labelId) => {
    const error = validateLabel({ name: editingName }).name;
    if (error) return;
    const updated = await renameLabel?.(labelId, editingName);
    if (updated) {
      setEditingId(null);
      setEditingName('');
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Workspace</p>
          <h1 className="page-title">Labels</h1>
          <p className="page-subtitle">Group related notes and find them in a click.</p>
        </div>
      </header>

      <form className="label-manager" onSubmit={handleCreate}>
        <div className="field">
          <label className="sr-only" htmlFor="label-name">New label</label>
          <input
            id="label-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setFormError('');
            }}
            placeholder="New label name"
            aria-invalid={Boolean(formError)}
          />
        </div>
        <button type="submit" className="btn btn--primary btn--small">
          <Plus size={16} /> Create label
        </button>
        {formError && <span className="field__error">{formError}</span>}
      </form>

      {labelsLoading ? (
        <div className="loading-state" role="status">
          <span className="spinner" />
          <p>Loading labels...</p>
        </div>
      ) : labels.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No labels yet"
          description="Create a label above, then add it to notes from the dashboard."
        />
      ) : (
        <div className="label-list">
          {labels.map((label) => {
            const count = activeNotes.filter((note) =>
              (note.labels || []).some((item) => item.id === label.id),
            ).length;
            const isSelected = selectedLabelId === label.id;

            return (
              <div key={label.id} className={`label-row ${isSelected ? 'label-row--selected' : ''}`}>
                <Tag size={17} aria-hidden="true" />
                {editingId === label.id ? (
                  <>
                    <div className="field label-row__edit">
                      <label className="sr-only" htmlFor={`edit-label-${label.id}`}>Rename label</label>
                      <input
                        id={`edit-label-${label.id}`}
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => handleRename(label.id)}
                      aria-label={`Save ${label.name}`}
                    >
                      <Check size={17} />
                    </button>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => setEditingId(null)}
                      aria-label="Cancel rename"
                    >
                      <X size={17} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="label-row__name"
                      onClick={() => setSelectedLabelId(isSelected ? null : label.id)}
                    >
                      {label.name}
                    </button>
                    <span className="label-row__count">{count} note{count === 1 ? '' : 's'}</span>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => startEditing(label)}
                      aria-label={`Rename ${label.name}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-button icon-button--danger"
                      onClick={() => deleteLabel?.(label.id)}
                      aria-label={`Delete ${label.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedLabel && (
        <section className="labelled-notes">
          <div className="labelled-notes__header">
            <div>
              <p className="page-eyebrow">Filtered view</p>
              <h2 className="labelled-notes__title">
                Notes in <span>{selectedLabel.name}</span>
              </h2>
            </div>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => setSelectedLabelId(null)}
            >
              <FilterX size={16} /> Clear filter
            </button>
          </div>

          <NoteList
            notes={labelledNotes}
            loading={loading}
            emptyTitle="Nothing tagged yet"
            emptyDescription="Open a note from the dashboard and add this label to it."
            renderNote={(note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={pinNote}
                onArchive={archiveNote}
                onTrash={trashNote}
                onEdit={openEditor}
                onManageReminder={openReminder}
              />
            )}
          />
        </section>
      )}
    </section>
  );
}
