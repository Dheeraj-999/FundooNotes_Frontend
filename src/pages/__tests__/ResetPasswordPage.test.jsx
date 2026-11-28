import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockReset = vi.hoisted(() => vi.fn());
vi.mock('../../services/authService', () => ({ resetPassword: mockReset }));

import ResetPasswordPage from '../ResetPasswordPage';

function renderResetPassword() {
  render(
    <MemoryRouter
      initialEntries={[{ pathname: '/reset-password', state: { email: 'ada@example.com' } }]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/login" element={<div>Login screen</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ResetPasswordPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('prefills the email passed from the previous step and validates the form', async () => {
    const user = userEvent.setup();
    renderResetPassword();

    expect(screen.getByLabelText('Email address')).toHaveValue('ada@example.com');
    await user.click(screen.getByRole('button', { name: /^reset password$/i }));

    expect(screen.getByText('Verification code is required')).toBeInTheDocument();
    expect(screen.getByText('New password is required')).toBeInTheDocument();
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('sends the trimmed code and new password to the API', async () => {
    const user = userEvent.setup();
    mockReset.mockResolvedValue({ message: 'Password updated successfully' });
    renderResetPassword();

    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.type(screen.getByLabelText('New password'), 'secret1');
    await user.type(screen.getByLabelText('Confirm new password'), 'secret1');
    await user.click(screen.getByRole('button', { name: /^reset password$/i }));

    await waitFor(() => expect(mockReset).toHaveBeenCalledWith({
      email: 'ada@example.com',
      otp: '123456',
      newPassword: 'secret1',
    }));
    expect(await screen.findByText('Password updated')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /go to sign in/i }));
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('rejects mismatched passwords locally', async () => {
    const user = userEvent.setup();
    renderResetPassword();

    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.type(screen.getByLabelText('New password'), 'secret1');
    await user.type(screen.getByLabelText('Confirm new password'), 'different');
    await user.click(screen.getByRole('button', { name: /^reset password$/i }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('shows the backend error message for an invalid code', async () => {
    const user = userEvent.setup();
    mockReset.mockRejectedValue({
      response: { status: 400, data: { message: 'Invalid or expired verification code' } },
    });
    renderResetPassword();

    await user.type(screen.getByLabelText('Verification code'), '000000');
    await user.type(screen.getByLabelText('New password'), 'secret1');
    await user.type(screen.getByLabelText('Confirm new password'), 'secret1');
    await user.click(screen.getByRole('button', { name: /^reset password$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid or expired verification code');
  });
});
