import EmptyState from './EmptyState';

export default function NoteList({
  notes = [],
  loading = false,
  emptyTitle,
  emptyDescription,
  renderNote,
}) {
  if (loading) {
    return (
      <div className="loading-state" role="status">
        <span className="spinner" />
        <p>Loading your notes...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return <div className="note-grid">{notes.map((note) => renderNote(note))}</div>;
}
