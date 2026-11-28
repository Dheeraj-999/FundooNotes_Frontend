import apiClient from '../utils/apiClient';

/** POST /api/users/register -> { id, firstName, email } */
export function registerUser(payload) {
  return apiClient.post('/users/register', payload).then((response) => response.data);
}

/** POST /api/users/login -> { token, message } */
export function loginUser(payload) {
  return apiClient.post('/users/login', payload).then((response) => response.data);
}

/** POST /api/users/forgot-password -> { message }; the code is emailed, never returned. */
export function requestPasswordReset(payload) {
  return apiClient.post('/users/forgot-password', payload).then((response) => response.data);
}

/** POST /api/users/reset-password -> { message } */
export function resetPassword(payload) {
  return apiClient.post('/users/reset-password', payload).then((response) => response.data);
}
