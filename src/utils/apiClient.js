import axios from 'axios';
import { getToken } from './token';

const configuredBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim();

export const API_BASE_URL = configuredBase.endsWith('/')
  ? configuredBase.slice(0, -1)
  : configuredBase;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// The backend sends the JWT back in `token`; every protected route expects
// Authorization: Bearer <token>. Adding it here keeps services free of auth code.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
