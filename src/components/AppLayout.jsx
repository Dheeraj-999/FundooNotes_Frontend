import { useCallback, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLabels } from '../hooks/useLabels';
import { useNotes } from '../hooks/useNotes';
import { useReminders } from '../hooks/useReminders';
import Navbar from './Navbar';
import ReminderModal from './ReminderModal';
import Sidebar from './Sidebar';

/** Shared shell: one request per resource, shared search and one reminder dialog. */
export default function AppLayout() {
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [reminderTarget, setReminderTarget] = useState(null);
  const navigate = useNavigate();
  const notesState = useNotes();
  const labelsState = useLabels();
  const remindersState = useReminders();

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
    ],
  );

  return (
    <div className="app-shell">
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
        <main className="content">
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
    </div>
  );
}
