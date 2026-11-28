import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/** Shared shell: search state and one notes request for every protected page. */
export default function AppLayout() {
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notesState = useNotes();

  const counts = useMemo(
    () => ({
      active: notesState.notes.filter((note) => !note.archived && !note.trashed).length,
      archived: notesState.notes.filter((note) => note.archived && !note.trashed).length,
      trashed: notesState.notes.filter((note) => note.trashed).length,
    }),
    [notesState.notes],
  );

  const outletContext = useMemo(
    () => ({ query, setQuery, ...notesState }),
    [query, notesState],
  );

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        counts={counts}
      />
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="main-panel">
        <Navbar
          query={query}
          onQueryChange={setQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="content">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
}
