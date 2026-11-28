import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const contextHolder = vi.hoisted(() => ({ value: {} }));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useOutletContext: () => contextHolder.value };
});

import ArchivePage from '../ArchivePage';

describe('ArchivePage', () => {
  beforeEach(() => {
    contextHolder.value = {
      query: '',
      notes: [
        { id: 5, title: 'Archived note', description: '', archived: true, trashed: false, labels: [] },
        { id: 6, title: 'Active note', description: '', archived: false, trashed: false, labels: [] },
      ],
      loading: false,
      error: '',
      reload: vi.fn(),
      unarchiveNote: vi.fn(),
      trashNote: vi.fn(),
    };
  });

  it('shows archived notes only', () => {
    render(<ArchivePage />);
    expect(screen.getByRole('heading', { name: 'Archived note' })).toBeInTheDocument();
    expect(screen.queryByText('Active note')).not.toBeInTheDocument();
    expect(screen.getByText(/Archived notes are out of your dashboard/)).toBeInTheDocument();
  });

  it('delegates unarchive and trash actions', async () => {
    const user = userEvent.setup();
    render(<ArchivePage />);
    await user.click(screen.getByRole('button', { name: 'Unarchive note' }));
    await user.click(screen.getByRole('button', { name: 'Move to trash' }));

    await waitFor(() => {
      expect(contextHolder.value.unarchiveNote).toHaveBeenCalledWith(5);
      expect(contextHolder.value.trashNote).toHaveBeenCalledWith(5);
    });
  });
});
