import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../../utils/apiClient', () => ({ default: mockApi }));

import {
  assignLabelToNote,
  createLabel,
  deleteLabel,
  getLabels,
  removeLabelFromNote,
  updateLabel,
} from '../labelService';

describe('labelService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the exact label endpoints', async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    mockApi.post.mockResolvedValue({ data: { id: 1, name: 'Work' } });
    mockApi.put.mockResolvedValue({ data: { id: 1, name: 'Office' } });
    mockApi.delete.mockResolvedValue({ status: 204 });

    await expect(getLabels()).resolves.toEqual([]);
    expect(mockApi.get).toHaveBeenCalledWith('/labels');

    await expect(createLabel('Work')).resolves.toEqual({ id: 1, name: 'Work' });
    expect(mockApi.post).toHaveBeenCalledWith('/labels', { name: 'Work' });

    await expect(updateLabel(1, 'Office')).resolves.toEqual({ id: 1, name: 'Office' });
    expect(mockApi.put).toHaveBeenCalledWith('/labels/1', { name: 'Office' });

    await deleteLabel(1);
    expect(mockApi.delete).toHaveBeenCalledWith('/labels/1');

    await assignLabelToNote(1, 9);
    expect(mockApi.post).toHaveBeenCalledWith('/labels/1/notes/9');

    await removeLabelFromNote(1, 9);
    expect(mockApi.delete).toHaveBeenCalledWith('/labels/1/notes/9');
  });
});
