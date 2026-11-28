import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { mockLoginUser, mockRegisterUser } = vi.hoisted(() => ({
  mockLoginUser: vi.fn(),
  mockRegisterUser: vi.fn(),
}));

vi.mock('../../services/authService', () => ({
  loginUser: mockLoginUser,
  registerUser: mockRegisterUser,
}));

import { AuthProvider, useAuth } from '../useAuth';

function AuthProbe() {
  const { token, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-state">{isAuthenticated ? `in:${token}` : 'out'}</span>
      <button onClick={() => login({ email: 'ada@example.com', password: 'secret1' })}>
        Log in
      </button>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('stores the JWT after login and clears it after logout', async () => {
    const user = userEvent.setup();
    mockLoginUser.mockResolvedValue({ token: 'jwt-123', message: 'Login successful' });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    expect(screen.getByTestId('auth-state')).toHaveTextContent('out');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('in:jwt-123');
    });
    expect(localStorage.getItem('token')).toBe('jwt-123');

    await user.click(screen.getByRole('button', { name: 'Log out' }));
    expect(screen.getByTestId('auth-state')).toHaveTextContent('out');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
