export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email = '', password = '' } = {}) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export function validateRegister({ firstName = '', email = '', password = '' } = {}) {
  const errors = validateLogin({ email, password });
  if (!firstName.trim()) errors.firstName = 'First name is required';
  if (password && password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
}

export function validateNote({ title = '' } = {}) {
  const errors = {};
  if (!title.trim()) errors.title = 'Note title is required';
  return errors;
}

export function validateLabel({ name = '' } = {}) {
  const errors = {};
  if (!name.trim()) errors.name = 'Label name is required';
  else if (name.trim().length > 50) errors.name = 'Label name cannot exceed 50 characters';
  return errors;
}

/** datetime-local gives "YYYY-MM-DDTHH:mm"; the backend expects seconds too. */
export function toBackendDateTime(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return `${value}:00`;
  return value;
}

/** Trims the backend's "YYYY-MM-DDTHH:mm:ss" for a datetime-local input. */
export function toInputDateTime(value) {
  return value ? String(value).slice(0, 16) : '';
}

export function validateReminderTime(value) {
  if (!value) return 'Reminder time is required';
  const timestamp = Date.parse(toBackendDateTime(value));
  if (Number.isNaN(timestamp)) return 'Enter a valid date and time';
  if (timestamp <= Date.now()) return 'Reminder time must be in the future';
  return '';
}
