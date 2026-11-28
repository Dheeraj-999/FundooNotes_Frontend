import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../utils/apiClient', () => ({
  default: { post: vi.fn() },
}));

import apiClient from '../../utils/apiClient';
import { loginUser, registerUser } from '../authService';

describe('authService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('registers with firstName, email and password', async () => {
    const payload = { firstName: 'Ada', email: 'ada@example.com', password: 'secret1' };
    apiClient.post.mockResolvedValue({ data: { id: 1, firstName: 'Ada', email: payload.email } });

    await expect(registerUser(payload)).resolves.toEqual({
      id: 1,
      firstName: 'Ada',
      email: payload.email,
    });
    expect(apiClient.post).toHaveBeenCalledWith('/users/register', payload);
  });

  it('logs in and unwraps the token response', async () => {
    const credentials = { email: 'ada@example.com', password: 'secret1' };
    apiClient.post.mockResolvedValue({ data: { token: 'jwt-123', message: 'Login successful' } });

    await expect(loginUser(credentials)).resolves.toEqual({
      token: 'jwt-123',
      message: 'Login successful',
    });
    expect(apiClient.post).toHaveBeenCalledWith('/users/login', credentials);
  });
});
