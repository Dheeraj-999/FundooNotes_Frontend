import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const contextHolder = vi.hoisted(() => ({ value: {} }));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useOutletContext: () => contextHolder.value };
});

vi.mock('../../components/Toast', () => ({ useToast: () => ({ showToast: vi.fn() }) }));

import RemindersPage from '../RemindersPage';

describe('RemindersPage', () => {
  beforeEach(() => {
    contextHolder.value = {
      notes: [
        { id: 1, title: 'Launch plan', archived: false, trashed: false },
        { id: 2, title: 'Old idea', archived: true, trashed: false },
      ],
      reminders: [
        {
          id: 5,
          noteId: 1,
          noteTitle: 'Launch plan',
          reminderTime: '2099-11-30T10:00:00',
        },
      ],
      remindersLoading: false,
      deleteReminder: vi.fn().mockResolvedValue(true),
      openReminder: vi.fn(),
    };
  });

  it('lists reminders with their note, time and status', () => {
    render(<RemindersPage />);
    expect(screen.getByRole('heading', { name: 'Launch plan' })).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText(/2099/)).toBeInTheDocument();
  });

  it('only offers active notes when creating a reminder', () => {
    render(<RemindersPage />);
    const options = screen.getAllByRole('option').map((option) => option.textContent);
    expect(options).toContain('Launch plan');
    expect(options).not.toContain('Old idea');
  });

  it('offers a test alert so browser notifications can be verified', () => {
    render(<RemindersPage />);
    expect(screen.getByRole('button', { name: 'Test alert' })).toBeInTheDocument();
    expect(screen.getByText(/Browser alerts:/)).toBeInTheDocument();
  });

  it('opens the modal for creation, editing and deletion', async () => {
    const user = userEvent.setup();
    render(<RemindersPage />);

    await user.selectOptions(screen.getByLabelText('Choose a note'), '1');
    await user.click(screen.getByRole('button', { name: 'Set reminder' }));
    await waitFor(() =>
      expect(contextHolder.value.openReminder).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, title: 'Launch plan' }),
      ),
    );

    await user.click(screen.getByRole('button', { name: 'Edit reminder for Launch plan' }));
    expect(contextHolder.value.openReminder).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
      expect.objectContaining({ id: 5 }),
    );

    await user.click(screen.getByRole('button', { name: 'Delete reminder for Launch plan' }));
    await waitFor(() => expect(contextHolder.value.deleteReminder).toHaveBeenCalledWith(5));
  });
});
