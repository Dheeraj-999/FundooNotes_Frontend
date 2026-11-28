import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const contextHolder = vi.hoisted(() => ({ value: {} }));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useOutletContext: () => contextHolder.value };
});

import DashboardPage from '../DashboardPage';

const notes = [
  { id: 1, title: 'Project plan', description: 'Ship the app', pinned: false, archived: false, trashed: false, labels: [] },
  { id: 2, title: 'Old idea', description: '', pinned: false, archived: true, trashed: false, labels: [] },
  { id: 3, title: 'Deleted thought', description: '', pinned: false, archived: false, trashed: true, labels: [] },
];

describe('DashboardPage', () => {
  beforeEach(() => {
    contextHolder.value = {
      query: '',
      notes,
      loading: false,
      error: '',
      reload: vi.fn(),
      addNote: vi.fn(),
      pinNote: vi.fn(),
      archiveNote: vi.fn(),
      trashNote: vi.fn(),
    };
  });

  it('shows only active notes', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: 'Project plan' })).toBeInTheDocument();
    expect(screen.queryByText('Old idea')).not.toBeInTheDocument();
    expect(screen.queryByText('Deleted thought')).not.toBeInTheDocument();
  });

  it('filters notes by the shared search query', () => {
    contextHolder.value.query = 'ship';
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: 'Project plan' })).toBeInTheDocument();
    expect(screen.getByText(/1 result/)).toBeInTheDocument();
  });

  it('delegates note actions to the hook handler', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);
    await user.click(screen.getByRole('button', { name: 'Pin note' }));
    await waitFor(() => expect(contextHolder.value.pinNote).toHaveBeenCalledWith(1));
  });
});
