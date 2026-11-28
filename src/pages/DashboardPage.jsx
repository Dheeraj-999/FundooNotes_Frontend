import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import LabelModal from '../components/LabelModal';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import NoteList from '../components/NoteList';
import { filterNotes } from '../utils/noteFilters';

export default function DashboardPage() {
  const {
    query,
    notes,
    loading,
    error,
    reload,
    addNote,
    pinNote,
    archiveNote,
    trashNote,
    labels = [],
    addLabel,
    assignLabel,
    unassignLabel,
    updateNoteLabels,
    openReminder,
    openEditor,
  } = useOutletContext();
  const [filter, setFilter] = useState('all');
  const [labelNote, setLabelNote] = useState(null);

  const activeNotes = filterNotes(notes, { archived: false, trashed: false });
  const searchText = query.trim().toLowerCase();
  const matchingNotes = filterNotes(activeNotes, { query });
  const visibleNotes = (filter === 'pinned'
    ? matchingNotes.filter((note) => note.pinned)
    : matchingNotes
  ).slice().sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.id - a.id);

  const filters = [
    { id: 'all', label: 'All notes', count: activeNotes.length },
    { id: 'pinned', label: 'Pinned', count: activeNotes.filter((note) => note.pinned).length },
  ];

  const handleAssignLabel = async (labelId) => {
    const success = await assignLabel?.(labelId, labelNote.id);
    if (!success || !labelNote) return;
    const label = labels.find((item) => item.id === labelId);
    const nextLabels = [
      ...(labelNote.labels || []).filter((item) => item.id !== labelId),
      ...(label ? [label] : []),
    ];
    updateNoteLabels?.(labelNote.id, nextLabels);
    setLabelNote((current) => (current ? { ...current, labels: nextLabels } : current));
  };

  const handleRemoveLabel = async (labelId) => {
    const success = await unassignLabel?.(labelId, labelNote.id);
    if (!success || !labelNote) return;
    const nextLabels = (labelNote.labels || []).filter((item) => item.id !== labelId);
    updateNoteLabels?.(labelNote.id, nextLabels);
    setLabelNote((current) => (current ? { ...current, labels: nextLabels } : current));
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Your workspace</p>
          <h1 className="page-title">All notes</h1>
          <p className="page-subtitle">
            A clear view of everything you're working on.
          </p>
        </div>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn--ghost btn--small" onClick={reload}>
            Retry
          </button>
        </div>
      )}

      <NoteEditor onSave={addNote} />

      <div className="notes-toolbar">
        <FilterBar filters={filters} active={filter} onChange={setFilter} />
        {searchText && (
          <span className="search-summary">
            <SearchX size={15} /> {visibleNotes.length} result{visibleNotes.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <NoteList
        notes={visibleNotes}
        loading={loading}
        emptyTitle={searchText ? 'No matching notes' : filter === 'pinned' ? 'No pinned notes' : 'Your board is empty'}
        emptyDescription={
          searchText
            ? 'Try another word or clear the search box.'
            : 'Use the box above to create your first note.'
        }
        renderNote={(note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={openEditor}
            onPin={pinNote}
            onArchive={archiveNote}
            onTrash={trashNote}
            onManageLabels={setLabelNote}
            onManageReminder={openReminder}
          />
        )}
      />

      {labelNote && (
        <LabelModal
          note={labelNote}
          labels={labels}
          onClose={() => setLabelNote(null)}
          onAssign={handleAssignLabel}
          onRemove={handleRemoveLabel}
          onCreate={(name) => addLabel?.(name)}
        />
      )}
    </section>
  );
}
