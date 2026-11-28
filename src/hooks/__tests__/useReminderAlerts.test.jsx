import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  showToast: vi.fn(),
  showBrowserNotification: vi.fn(),
  playAlertSound: vi.fn(),
}));

vi.mock('../../components/Toast', () => ({ useToast: () => ({ showToast: mocks.showToast }) }));
vi.mock('../../utils/notifications', () => ({
  showBrowserNotification: mocks.showBrowserNotification,
  playAlertSound: mocks.playAlertSound,
}));

import { useReminderAlerts } from '../useReminderAlerts';

function localDateTime(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function Harness({ reminders }) {
  useReminderAlerts(reminders, [{ id: 1, title: 'Launch plan' }]);
  return null;
}

describe('useReminderAlerts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('alerts once when a reminder becomes due', () => {
    const due = new Date(Date.now() - 1000);
    const reminder = { id: 7, noteId: 1, reminderTime: localDateTime(due) };
    const view = render(<Harness reminders={[reminder]} />);

    expect(mocks.showToast).toHaveBeenCalledWith('Reminder: Launch plan', 'info');
    expect(mocks.showBrowserNotification).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Fundoo Notes reminder', body: 'Launch plan' }),
    );
    expect(mocks.playAlertSound).toHaveBeenCalledOnce();

    view.rerender(<Harness reminders={[reminder]} />);
    expect(mocks.showToast).toHaveBeenCalledOnce();
  });

  it('ignores future reminders', () => {
    const future = new Date(Date.now() + 60 * 60 * 1000);
    render(<Harness reminders={[{ id: 8, noteId: 1, reminderTime: localDateTime(future) }]} />);

    expect(mocks.showToast).not.toHaveBeenCalled();
    expect(mocks.showBrowserNotification).not.toHaveBeenCalled();
  });
});
