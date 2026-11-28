import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockRegister = vi.hoisted(() => vi.fn());
const mockLogin = vi.hoisted(() => vi.fn());

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ register: mockRegister, login: mockLogin }),
}));

import RegisterPage from '../RegisterPage';

function renderRegister() {
  render(
    <MemoryRouter
      initialEntries={['/register']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<div>Dashboard screen</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillForm(user) {
  await user.type(screen.getByLabelText('First name'), 'Ada');
  await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
  await user.type(screen.getByLabelText('Password'), 'secret1');
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue({ token: 'jwt-123' });
  });

  it('validates input before calling the API', async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('registers and then logs in automatically', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ id: 1, firstName: 'Ada', email: 'ada@example.com' });
    renderRegister();

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(mockRegister).toHaveBeenCalledWith({
      firstName: 'Ada',
      email: 'ada@example.com',
      password: 'secret1',
    }));
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'secret1',
    });
    expect(await screen.findByText('Dashboard screen')).toBeInTheDocument();
  });

  it('shows a duplicate-email error from the backend', async () => {
    const user = userEvent.setup();
    mockRegister.mockRejectedValue({
      response: { status: 409, data: { message: 'Email is already registered' } },
    });
    renderRegister();

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email is already registered');
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
