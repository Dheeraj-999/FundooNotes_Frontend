import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLabels } from '../hooks/useLabels';
import { useNotes } from '../hooks/useNotes';
import { useReminderAlerts } from '../hooks/useReminderAlerts';
import { useReminders } from '../hooks/useReminders';
import { getPageTitle } from '../utils/pageTitles';
import Navbar from './Navbar';
import NoteEditor from './NoteEditor';
import ReminderModal from './ReminderModal';
import Sidebar from './Sidebar';

/** Shared shell: one request per resource, shared search and one reminder dialog. */
export default function AppLayout() {
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const notesState = useNotes();
  const labelsState = useLabels();
  const remindersState = useReminders();
  useReminderAlerts(remindersState.reminders, notesState.notes);

  useEffect(() => {
    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  const counts = useMemo(
    () => ({
      active: notesState.notes.filter((note) => !note.archived && !note.trashed).length,
      archived: notesState.notes.filter((note) => note.archived && !note.trashed).length,
      trashed: notesState.notes.filter((note) => note.trashed).length,
      labels: labelsState.labels.length,
      reminders: remindersState.reminders.length,
    }),
    [notesState.notes, labelsState.labels, remindersState.reminders],
  );

  const selectLabel = useCallback(
    (label) => {
      setSelectedLabelId(label.id);
      navigate('/labels');
    },
    [navigate],
  );

  const openReminder = useCallback((note, reminder = null) => {
    setReminderTarget({ note, reminder });
  }, []);

  const openEditor = useCallback((note) => {
    setEditingNote(note);
  }, []);

  const saveEditedNote = useCallback(
    (payload) => {
      if (!editingNote) return Promise.resolve(null);
      return notesState.editNote(editingNote.id, payload);
    },
    [editingNote, notesState],
  );

  const updateNoteLabels = useCallback(
    (noteId, nextLabels) => {
      notesState.setNotes((current) =>
        current.map((note) => (note.id === noteId ? { ...note, labels: nextLabels } : note)),
      );
    },
    [notesState.setNotes],
  );

  const saveReminder = useCallback(
    (reminderTime) => {
      if (!reminderTarget) return Promise.resolve(null);
      const { note, reminder } = reminderTarget;
      return reminder
        ? remindersState.updateReminder(reminder.id, reminderTime)
        : remindersState.addReminder(note.id, reminderTime);
    },
    [reminderTarget, remindersState],
  );

  const outletContext = useMemo(
    () => ({
      query,
      setQuery,
      ...notesState,
      labels: labelsState.labels,
      labelsLoading: labelsState.loading,
      addLabel: labelsState.addLabel,
      renameLabel: labelsState.renameLabel,
      deleteLabel: labelsState.deleteLabel,
      assignLabel: labelsState.assignLabel,
      unassignLabel: labelsState.unassignLabel,
      selectedLabelId,
      setSelectedLabelId,
      selectLabel,
      updateNoteLabels,
      reminders: remindersState.reminders,
      remindersLoading: remindersState.loading,
      reloadReminders: remindersState.loadReminders,
      addReminder: remindersState.addReminder,
      updateReminder: remindersState.updateReminder,
      deleteReminder: remindersState.deleteReminder,
      openReminder,
      openEditor,
    }),
    [
      query,
      notesState,
      labelsState,
      remindersState,
      selectedLabelId,
      selectLabel,
      updateNoteLabels,
      openReminder,
      openEditor,
    ],
  );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        counts={counts}
        labels={labelsState.labels}
        onSelectLabel={selectLabel}
        activeLabelId={selectedLabelId}
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
        <main id="main-content" className="content">
          <Outlet context={outletContext} />
        </main>
      </div>

      {reminderTarget && (
        <ReminderModal
          note={reminderTarget.note}
          reminder={reminderTarget.reminder}
          onSave={saveReminder}
          onClose={() => setReminderTarget(null)}
        />
      )}

      {editingNote && (
        <NoteEditor
          note={editingNote}
          onSave={saveEditedNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}
