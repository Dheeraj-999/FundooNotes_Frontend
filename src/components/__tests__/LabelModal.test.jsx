import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LabelModal from '../LabelModal';

const note = { id: 7, title: 'Launch plan', labels: [{ id: 1, name: 'Work' }] };
const labels = [
  { id: 1, name: 'Work' },
  { id: 2, name: 'Personal' },
];

describe('LabelModal', () => {
  it('shows assigned labels as checked and toggles them', async () => {
    const user = userEvent.setup();
    const onAssign = vi.fn().mockResolvedValue(true);
    const onRemove = vi.fn().mockResolvedValue(true);
    render(
      <LabelModal note={note} labels={labels} onAssign={onAssign} onRemove={onRemove} />,
    );

    expect(screen.getByLabelText('Work')).toBeChecked();
    expect(screen.getByLabelText('Personal')).not.toBeChecked();

    await user.click(screen.getByLabelText('Personal'));
    await waitFor(() => expect(onAssign).toHaveBeenCalledWith(2));

    await user.click(screen.getByLabelText('Work'));
    await waitFor(() => expect(onRemove).toHaveBeenCalledWith(1));
  });

  it('creates a label and assigns it to the note', async () => {
    const user = userEvent.setup();
    const created = { id: 3, name: 'Ideas' };
    const onCreate = vi.fn().mockResolvedValue(created);
    const onAssign = vi.fn().mockResolvedValue(true);
    render(
      <LabelModal note={note} labels={labels} onCreate={onCreate} onAssign={onAssign} />,
    );

    await user.type(screen.getByLabelText('New label'), 'Ideas');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => expect(onCreate).toHaveBeenCalledWith('Ideas'));
    expect(onAssign).toHaveBeenCalledWith(3);
  });
});
