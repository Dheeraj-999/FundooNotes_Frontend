import { useOutletContext } from 'react-router-dom';
import { Info } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import NoteList from '../components/NoteList';
import { filterNotes } from '../utils/noteFilters';

export default function TrashPage() {
  const { query, notes, loading, error, reload, restoreNote } = useOutletContext();

  const trashedNotes = filterNotes(notes, { trashed: true, query });

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Workspace</p>
          <h1 className="page-title">Trash</h1>
          <p className="page-subtitle">Recently removed notes can be brought back.</p>
        </div>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn--ghost btn--small" onClick={reload}>Retry</button>
        </div>
      )}

      {trashedNotes.length > 0 && (
        <div className="section-banner">
          <Info size={17} />
          <span>
            Restore brings a note back to the dashboard. Permanent deletion is not
            available in the backend yet.
          </span>
        </div>
      )}

      <NoteList
        notes={trashedNotes}
        loading={loading}
        emptyTitle="Trash is empty"
        emptyDescription="Notes you move to trash will rest here until you restore them."
        renderNote={(note) => (
          <NoteCard key={note.id} note={note} view="trash" onRestore={restoreNote} />
        )}
      />
    </section>
  );
}
