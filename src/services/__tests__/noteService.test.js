import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
}));

vi.mock('../../utils/apiClient', () => ({ default: mockApi }));

import {
  createNote,
  getAllNotes,
  toggleArchiveNote,
  togglePinNote,
  toggleTrashNote,
} from '../noteService';

describe('noteService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the exact note endpoints', async () => {
    mockApi.get.mockResolvedValue({ data: [{ id: 1 }] });
    mockApi.post.mockResolvedValue({ data: { id: 2 } });
    mockApi.patch.mockResolvedValue({ data: { id: 3 } });

    await expect(getAllNotes()).resolves.toEqual([{ id: 1 }]);
    expect(mockApi.get).toHaveBeenCalledWith('/notes');

    await expect(createNote({ title: 'Idea' })).resolves.toEqual({ id: 2 });
    expect(mockApi.post).toHaveBeenCalledWith('/notes', { title: 'Idea' });

    await togglePinNote(3);
    expect(mockApi.patch).toHaveBeenCalledWith('/notes/3/pin');

    await toggleArchiveNote(3);
    expect(mockApi.patch).toHaveBeenCalledWith('/notes/3/archive');

    await toggleTrashNote(3);
    expect(mockApi.patch).toHaveBeenCalledWith('/notes/3/trash');
  });
});
