import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../../utils/apiClient', () => ({ default: mockApi }));

import {
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder,
} from '../reminderService';

describe('reminderService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the exact reminder endpoints and payloads', async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    mockApi.post.mockResolvedValue({ data: { id: 1 } });
    mockApi.put.mockResolvedValue({ data: { id: 1 } });
    mockApi.delete.mockResolvedValue({ status: 204 });

    await expect(getReminders()).resolves.toEqual([]);
    expect(mockApi.get).toHaveBeenCalledWith('/reminders');

    await expect(createReminder(7, '2026-11-30T10:00:00')).resolves.toEqual({ id: 1 });
    expect(mockApi.post).toHaveBeenCalledWith('/reminders', {
      noteId: 7,
      reminderTime: '2026-11-30T10:00:00',
    });

    await expect(updateReminder(1, '2026-12-01T09:30:00')).resolves.toEqual({ id: 1 });
    expect(mockApi.put).toHaveBeenCalledWith('/reminders/1', {
      reminderTime: '2026-12-01T09:30:00',
    });

    await deleteReminder(1);
    expect(mockApi.delete).toHaveBeenCalledWith('/reminders/1');
  });
});
