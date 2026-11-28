import { useOutletContext } from 'react-router-dom';
import { Info } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import NoteList from '../components/NoteList';
import { filterNotes } from '../utils/noteFilters';

export default function ArchivePage() {
  const {
    query,
    notes,
    loading,
    error,
    reload,
    unarchiveNote,
    trashNote,
    openEditor,
  } = useOutletContext();

  const archivedNotes = filterNotes(notes, {
    archived: true,
    trashed: false,
    query,
  });

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Workspace</p>
          <h1 className="page-title">Archive</h1>
          <p className="page-subtitle">Notes you've tucked away, still close at hand.</p>
        </div>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn--ghost btn--small" onClick={reload}>Retry</button>
        </div>
      )}

      {archivedNotes.length > 0 && (
        <div className="section-banner">
          <Info size={17} />
          <span>Archived notes are out of your dashboard but easy to restore.</span>
        </div>
      )}

      <NoteList
        notes={archivedNotes}
        loading={loading}
        emptyTitle="Archive is empty"
        emptyDescription="Archive a note from the dashboard and it will appear here."
        renderNote={(note) => (
          <NoteCard
            key={note.id}
            note={note}
            view="archive"
            onEdit={openEditor}
            onUnarchive={unarchiveNote}
            onTrash={trashNote}
          />
        )}
      />
    </section>
  );
}
