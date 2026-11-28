import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockLogin = vi.hoisted(() => vi.fn());
vi.mock('../../hooks/useAuth', () => ({ useAuth: () => ({ login: mockLogin }) }));

import LoginPage from '../LoginPage';

function renderLogin() {
  render(
    <MemoryRouter
      initialEntries={['/login']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard screen</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('validates empty fields before calling the API', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('logs in with trimmed credentials and navigates to the dashboard', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ token: 'jwt-123', message: 'Login successful' });
    renderLogin();

    await user.type(screen.getByLabelText('Email address'), '  ada@example.com ');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'secret1',
    }));
    expect(await screen.findByText('Dashboard screen')).toBeInTheDocument();
  });

  it('shows the backend error message when credentials are invalid', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue({
      response: { status: 401, data: { message: 'Invalid email or password' } },
    });
    renderLogin();

    await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
  });
});
