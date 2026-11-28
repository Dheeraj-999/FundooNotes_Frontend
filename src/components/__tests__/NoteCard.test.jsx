import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteCard from '../NoteCard';

const note = {
  id: 7,
  title: 'Project ideas',
  description: 'A short description',
  pinned: false,
  labels: [{ id: 3, name: 'Work' }],
};

describe('NoteCard', () => {
  it('renders title, description and label chips', () => {
    render(<NoteCard note={note} />);
    expect(screen.getByRole('heading', { name: note.title })).toBeInTheDocument();
    expect(screen.getByText(note.description)).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('calls the right action handlers with the note id', async () => {
    const user = userEvent.setup();
    const handlers = {
      onPin: vi.fn(),
      onArchive: vi.fn(),
      onTrash: vi.fn(),
      onManageLabels: vi.fn(),
    };
    render(<NoteCard note={note} {...handlers} />);

    await user.click(screen.getByRole('button', { name: 'Pin note' }));
    await user.click(screen.getByRole('button', { name: 'Archive note' }));
    await user.click(screen.getByRole('button', { name: 'Move to trash' }));
    await user.click(screen.getByRole('button', { name: 'Manage labels' }));

    expect(handlers.onPin).toHaveBeenCalledWith(7);
    expect(handlers.onArchive).toHaveBeenCalledWith(7);
    expect(handlers.onTrash).toHaveBeenCalledWith(7);
    expect(handlers.onManageLabels).toHaveBeenCalledWith(note);
  });

  it('shows restore-only actions in the trash view', async () => {
    const user = userEvent.setup();
    const onRestore = vi.fn();
    render(<NoteCard note={{ ...note, trashed: true }} view="trash" onRestore={onRestore} />);

    expect(screen.queryByRole('button', { name: 'Pin note' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Restore note' }));
    expect(onRestore).toHaveBeenCalledWith(7);
  });

  it('opens the reminder dialog with the whole note', async () => {
    const user = userEvent.setup();
    const onManageReminder = vi.fn();
    render(<NoteCard note={note} onManageReminder={onManageReminder} />);

    await user.click(screen.getByRole('button', { name: 'Set reminder' }));
    expect(onManageReminder).toHaveBeenCalledWith(note);
  });
});
