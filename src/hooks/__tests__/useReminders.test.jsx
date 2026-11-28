import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockReminderApi = vi.hoisted(() => ({
  getReminders: vi.fn(),
  createReminder: vi.fn(),
  updateReminder: vi.fn(),
  deleteReminder: vi.fn(),
}));

vi.mock('../../services/reminderService', () => mockReminderApi);

import { ToastProvider } from '../../components/Toast';
import { useReminders } from '../useReminders';

function RemindersProbe() {
  const { reminders, addReminder, deleteReminder } = useReminders();
  return (
    <div>
      <span data-testid="reminders">{reminders.map((item) => item.id).join(',')}</span>
      <button onClick={() => addReminder(7, '2099-01-01T09:00:00')}>Add</button>
      <button onClick={() => deleteReminder(2)}>Delete</button>
    </div>
  );
}

describe('useReminders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReminderApi.getReminders.mockResolvedValue([{ id: 1, noteId: 3 }]);
    mockReminderApi.createReminder.mockResolvedValue({ id: 2, noteId: 7 });
    mockReminderApi.deleteReminder.mockResolvedValue({ status: 204 });
  });

  it('loads reminders and keeps local state in sync with mutations', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <RemindersProbe />
      </ToastProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('reminders')).toHaveTextContent('1'));

    await user.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(screen.getByTestId('reminders')).toHaveTextContent('1,2'));
    expect(mockReminderApi.createReminder).toHaveBeenCalledWith(7, '2099-01-01T09:00:00');

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.getByTestId('reminders')).toHaveTextContent('1'));
  });
});
