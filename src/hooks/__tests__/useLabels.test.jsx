import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockLabelApi = vi.hoisted(() => ({
  getLabels: vi.fn(),
  createLabel: vi.fn(),
  deleteLabel: vi.fn(),
  assignLabelToNote: vi.fn(),
}));

vi.mock('../../services/labelService', () => mockLabelApi);

import { ToastProvider } from '../../components/Toast';
import { useLabels } from '../useLabels';

function LabelsProbe() {
  const { labels, addLabel, deleteLabel, assignLabel } = useLabels();
  return (
    <div>
      <span data-testid="labels">{labels.map((label) => label.name).join(',')}</span>
      <button onClick={() => addLabel('Work')}>Add</button>
      <button onClick={() => deleteLabel(2)}>Delete</button>
      <button onClick={() => assignLabel(1, 7)}>Assign</button>
    </div>
  );
}

describe('useLabels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLabelApi.getLabels.mockResolvedValue([{ id: 1, name: 'Home' }]);
    mockLabelApi.createLabel.mockResolvedValue({ id: 2, name: 'Work' });
    mockLabelApi.deleteLabel.mockResolvedValue({ status: 204 });
    mockLabelApi.assignLabelToNote.mockResolvedValue({ status: 204 });
  });

  it('loads labels and keeps state in sync with mutations', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <LabelsProbe />
      </ToastProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('labels')).toHaveTextContent('Home'));

    await user.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(screen.getByTestId('labels')).toHaveTextContent('Home,Work'));

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.getByTestId('labels')).toHaveTextContent('Home'));

    await user.click(screen.getByRole('button', { name: 'Assign' }));
    await waitFor(() => expect(mockLabelApi.assignLabelToNote).toHaveBeenCalledWith(1, 7));
  });
});
