import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApi = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock('../../utils/apiClient', () => ({ default: mockApi }));

import { importNotes } from '../importService';

describe('importService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uploads the file as multipart form data to the batch endpoint', async () => {
    const file = new File(['notes'], 'notes.xlsx');
    const expected = { message: 'Excel import job started successfully', executionId: 4, status: 'COMPLETED' };
    mockApi.post.mockResolvedValue({ data: expected });

    await expect(importNotes(file)).resolves.toEqual(expected);

    const [path, body, config] = mockApi.post.mock.calls[0];
    expect(path).toBe('/batch/import/notes');
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('file')).toBe(file);
    expect(config.headers['Content-Type']).toBeUndefined();
  });
});
