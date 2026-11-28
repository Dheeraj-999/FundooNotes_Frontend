import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../hooks/useAuth';
import ProtectedRoute from '../ProtectedRoute';

function renderProtectedRoute() {
  return render(
    <MemoryRouter
      initialEntries={['/dashboard']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>Login screen</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard screen</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to login when there is no token', async () => {
    localStorage.clear();
    renderProtectedRoute();
    expect(await screen.findByText('Login screen')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard screen')).not.toBeInTheDocument();
  });

  it('renders the protected page when a token exists', () => {
    localStorage.setItem('token', 'jwt-123');
    renderProtectedRoute();
    expect(screen.getByText('Dashboard screen')).toBeInTheDocument();
  });
});
