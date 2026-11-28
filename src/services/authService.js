import apiClient from '../utils/apiClient';

/** POST /api/users/register -> { id, firstName, email } */
export function registerUser(payload) {
  return apiClient.post('/users/register', payload).then((response) => response.data);
}

/** POST /api/users/login -> { token, message } */
export function loginUser(payload) {
  return apiClient.post('/users/login', payload).then((response) => response.data);
}
