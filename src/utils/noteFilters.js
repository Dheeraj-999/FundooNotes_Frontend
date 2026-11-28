/** Client-side matching because the backend has no search endpoint. */
export function matchesQuery(note, query = '') {
  const searchText = query.trim().toLowerCase();
  if (!searchText) return true;

  return (
    note.title.toLowerCase().includes(searchText) ||
    (note.description || '').toLowerCase().includes(searchText) ||
    (note.labels || []).some((label) => label.name.toLowerCase().includes(searchText))
  );
}

export function filterNotes(notes = [], { archived, trashed, query = '' } = {}) {
  return notes.filter((note) => {
    if (typeof archived === 'boolean' && note.archived !== archived) return false;
    if (typeof trashed === 'boolean' && note.trashed !== trashed) return false;
    return matchesQuery(note, query);
  });
}
