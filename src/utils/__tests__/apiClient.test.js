import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockRequestUse, mockGetToken } = vi.hoisted(() => ({
  mockRequestUse: vi.fn(),
  mockGetToken: vi.fn(() => 'jwt-123'),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: { request: { use: mockRequestUse } },
    })),
  },
}));

vi.mock('../token', () => ({ getToken: mockGetToken }));

import axios from 'axios';
import apiClient, { API_BASE_URL } from '../apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    // The client and its interceptor are registered once at import time, so only
    // reset the token stub here.
    mockGetToken.mockReset();
    mockGetToken.mockReturnValue('jwt-123');
  });

  it('uses the /api base URL and JSON headers', () => {
    expect(API_BASE_URL).toBe('/api');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '/api',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(apiClient).toBeDefined();
  });

  it('attaches a Bearer token to every request when logged in', () => {
    const interceptor = mockRequestUse.mock.calls[0][0];
    expect(interceptor({ headers: {} }).headers.Authorization).toBe('Bearer jwt-123');

    mockGetToken.mockReturnValue(null);
    expect(interceptor({ headers: {} }).headers.Authorization).toBeUndefined();
  });
});
