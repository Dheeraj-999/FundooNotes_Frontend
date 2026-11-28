import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNoteApi = vi.hoisted(() => ({
  getAllNotes: vi.fn(),
  createNote: vi.fn(),
  togglePinNote: vi.fn(),
}));

vi.mock('../../services/noteService', () => mockNoteApi);

import { ToastProvider } from '../../components/Toast';
import { useNotes } from '../useNotes';

function NotesProbe() {
  const { notes, loading, addNote, pinNote } = useNotes();
  return (
    <div>
      <span data-testid="loading">{loading ? 'loading' : 'ready'}</span>
      <span data-testid="titles">{notes.map((note) => note.title).join(',')}</span>
      <button onClick={() => addNote({ title: 'New note', description: '' })}>Add</button>
      <button onClick={() => pinNote(1)}>Pin</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <ToastProvider>
      <NotesProbe />
    </ToastProvider>,
  );
}

describe('useNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNoteApi.getAllNotes.mockResolvedValue([{ id: 1, title: 'First' }]);
    mockNoteApi.createNote.mockResolvedValue({ id: 2, title: 'New note' });
    mockNoteApi.togglePinNote.mockResolvedValue({ id: 1, title: 'First', pinned: true });
  });

  it('loads notes on mount', async () => {
    renderProbe();
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    await waitFor(() => expect(screen.getByTestId('titles')).toHaveTextContent('First'));
    expect(screen.getByTestId('loading')).toHaveTextContent('ready');
  });

  it('adds and updates notes in local state after API calls', async () => {
    const user = userEvent.setup();
    renderProbe();
    await waitFor(() => expect(screen.getByTestId('titles')).toHaveTextContent('First'));

    await user.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(screen.getByTestId('titles')).toHaveTextContent('New note,First'));

    await user.click(screen.getByRole('button', { name: 'Pin' }));
    await waitFor(() => expect(mockNoteApi.togglePinNote).toHaveBeenCalledWith(1));
  });
});
