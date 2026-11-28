import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const contextHolder = vi.hoisted(() => ({ value: {} }));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useOutletContext: () => contextHolder.value };
});

import LabelPage from '../LabelPage';

describe('LabelPage', () => {
  beforeEach(() => {
    contextHolder.value = {
      notes: [
        { id: 1, title: 'Launch', description: '', archived: false, trashed: false, pinned: false, labels: [{ id: 1, name: 'Work' }] },
        { id: 2, title: 'Diary', description: '', archived: false, trashed: false, pinned: false, labels: [{ id: 2, name: 'Personal' }] },
      ],
      query: '',
      loading: false,
      labels: [{ id: 1, name: 'Work' }, { id: 2, name: 'Personal' }],
      labelsLoading: false,
      addLabel: vi.fn().mockResolvedValue({ id: 3, name: 'Ideas' }),
      renameLabel: vi.fn().mockResolvedValue({ id: 1, name: 'Office' }),
      deleteLabel: vi.fn().mockResolvedValue(true),
      selectedLabelId: null,
      setSelectedLabelId: vi.fn(),
      pinNote: vi.fn(),
      archiveNote: vi.fn(),
      trashNote: vi.fn(),
    };
  });

  it('validates and creates a new label', async () => {
    const user = userEvent.setup();
    render(<LabelPage />);

    await user.click(screen.getByRole('button', { name: 'Create label' }));
    expect(screen.getByText('Label name is required')).toBeInTheDocument();

    await user.type(screen.getByLabelText('New label'), 'Ideas');
    await user.click(screen.getByRole('button', { name: 'Create label' }));
    await waitFor(() => expect(contextHolder.value.addLabel).toHaveBeenCalledWith('Ideas'));
  });

  it('renames and deletes labels through the shared handlers', async () => {
    const user = userEvent.setup();
    render(<LabelPage />);

    await user.click(screen.getByRole('button', { name: 'Rename Work' }));
    const input = screen.getByLabelText('Rename label');
    await user.clear(input);
    await user.type(input, 'Office');
    await user.click(screen.getByRole('button', { name: 'Save Work' }));
    await waitFor(() => expect(contextHolder.value.renameLabel).toHaveBeenCalledWith(1, 'Office'));

    await user.click(screen.getByRole('button', { name: 'Delete Personal' }));
    await waitFor(() => expect(contextHolder.value.deleteLabel).toHaveBeenCalledWith(2));
  });

  it('shows only notes carrying the selected label', () => {
    contextHolder.value.selectedLabelId = 1;
    render(<LabelPage />);

    expect(screen.getByText('Notes in')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Launch' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Diary' })).not.toBeInTheDocument();
  });
});
