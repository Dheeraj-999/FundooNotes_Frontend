const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

/**
 * The backend's GlobalExceptionHandler returns:
 * { timestamp, status, error, message, path, validationErrors }
 */
export function normalizeApiError(error, fallback = DEFAULT_MESSAGE) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  let message = data?.message || fallback;
  if (status === 401 && !data?.message) {
    message = 'Your session has expired. Please log in again.';
  }

  return {
    status,
    message,
    validationErrors: data?.validationErrors || null,
  };
}

export function getErrorMessage(error, fallback) {
  return normalizeApiError(error, fallback).message;
}

export function getValidationErrors(error) {
  return normalizeApiError(error).validationErrors || {};
}
