import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReminderModal from '../ReminderModal';

function futureInput() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

describe('ReminderModal', () => {
  it('requires a future time', async () => {
    const onSave = vi.fn();
    render(<ReminderModal note={{ title: 'Launch' }} onSave={onSave} />);

    fireEvent.click(screen.getByRole('button', { name: 'Set reminder' }));
    expect(screen.getByText('Reminder time is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('sends the backend format with seconds and closes after saving', async () => {
    const onSave = vi.fn().mockResolvedValue({ id: 1 });
    const onClose = vi.fn();
    render(
      <ReminderModal note={{ title: 'Launch' }} onSave={onSave} onClose={onClose} />,
    );

    const value = futureInput();
    fireEvent.change(screen.getByLabelText('Date and time'), { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: 'Set reminder' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(`${value}:00`));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('prefills the time when editing', () => {
    render(
      <ReminderModal
        note={{ title: 'Launch' }}
        reminder={{ id: 1, reminderTime: '2099-01-01T09:30:00' }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Edit reminder' })).toBeInTheDocument();
    expect(screen.getByLabelText('Date and time')).toHaveValue('2099-01-01T09:30');
  });
});
