import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { clearToken, getToken, setToken } from '../utils/token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    if (!data?.token) {
      throw new Error('Login response did not contain a token');
    }
    setToken(data.token);
    setTokenState(data.token);
    return data;
  }, []);

  const register = useCallback((details) => registerUser(details), []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), login, register, logout }),
    [token, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
