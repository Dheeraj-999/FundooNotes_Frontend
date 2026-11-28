import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const contextHolder = vi.hoisted(() => ({ value: {} }));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useOutletContext: () => contextHolder.value };
});

import TrashPage from '../TrashPage';

describe('TrashPage', () => {
  beforeEach(() => {
    contextHolder.value = {
      query: '',
      notes: [
        { id: 9, title: 'Trashed note', description: '', archived: false, trashed: true, labels: [] },
        { id: 10, title: 'Live note', description: '', archived: false, trashed: false, labels: [] },
      ],
      loading: false,
      error: '',
      reload: vi.fn(),
      restoreNote: vi.fn(),
      deleteNoteForever: vi.fn().mockResolvedValue(true),
    };
  });

  it('shows trashed notes and the restore-only actions', () => {
    render(<TrashPage />);
    expect(screen.getByRole('heading', { name: 'Trashed note' })).toBeInTheDocument();
    expect(screen.queryByText('Live note')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restore note' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pin note' })).not.toBeInTheDocument();
  });

  it('restores a note through the shared handler', async () => {
    const user = userEvent.setup();
    render(<TrashPage />);
    await user.click(screen.getByRole('button', { name: 'Restore note' }));
    await waitFor(() => expect(contextHolder.value.restoreNote).toHaveBeenCalledWith(9));
  });

  it('confirms before permanently deleting a trashed note', async () => {
    const user = userEvent.setup();
    render(<TrashPage />);

    await user.click(screen.getByRole('button', { name: 'Delete permanently' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText(/will be permanently removed/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete forever' }));
    await waitFor(() =>
      expect(contextHolder.value.deleteNoteForever).toHaveBeenCalledWith(9),
    );
  });
});
