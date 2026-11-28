import { beforeEach, describe, expect, it } from 'vitest';
import { clearToken, getToken, isAuthenticated, setToken } from '../token';

describe('token helpers', () => {
  beforeEach(() => localStorage.clear());

  it('stores, reads and clears the JWT', () => {
    setToken('jwt-123');
    expect(getToken()).toBe('jwt-123');
    expect(isAuthenticated()).toBe(true);

    clearToken();
    expect(getToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it('ignores empty tokens', () => {
    setToken('');
    expect(getToken()).toBeNull();
  });
});
