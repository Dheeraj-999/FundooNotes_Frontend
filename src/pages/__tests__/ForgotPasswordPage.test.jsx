import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockRequest = vi.hoisted(() => vi.fn());
vi.mock('../../services/authService', () => ({ requestPasswordReset: mockRequest }));

import ForgotPasswordPage from '../ForgotPasswordPage';

function renderForgotPassword() {
  render(
    <MemoryRouter
      initialEntries={['/forgot-password']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<div>Reset screen</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ForgotPasswordPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('validates the email before calling the API', async () => {
    const user = userEvent.setup();
    renderForgotPassword();

    await user.click(screen.getByRole('button', { name: /send verification code/i }));
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('shows a confirmation and links to the reset screen with the email', async () => {
    const user = userEvent.setup();
    mockRequest.mockResolvedValue({ message: 'If the email is registered, a verification code has been sent.' });
    renderForgotPassword();

    await user.type(screen.getByLabelText('Email address'), '  ada@example.com ');
    await user.click(screen.getByRole('button', { name: /send verification code/i }));

    await waitFor(() => expect(mockRequest).toHaveBeenCalledWith({ email: 'ada@example.com' }));
    expect(await screen.findByText('Check your inbox')).toBeInTheDocument();
    expect(screen.getByText(/ada@example.com/)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /enter verification code/i }));
    expect(screen.getByText('Reset screen')).toBeInTheDocument();
  });

  it('shows the backend error message when sending fails', async () => {
    const user = userEvent.setup();
    mockRequest.mockRejectedValue({
      response: { status: 503, data: { message: 'Unable to send the verification email.' } },
    });
    renderForgotPassword();

    await user.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: /send verification code/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to send the verification email.');
  });
});
