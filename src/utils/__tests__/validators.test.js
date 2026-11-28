import { describe, expect, it } from 'vitest';
import {
  toBackendDateTime,
  toInputDateTime,
  validateLogin,
  validateRegister,
  validateReminderTime,
} from '../validators';

describe('form validation', () => {
  it('requires a valid email and password on login', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    });
    expect(validateLogin({ email: 'not-an-email', password: 'secret' }).email).toBe(
      'Enter a valid email',
    );
    expect(validateLogin({ email: 'ada@example.com', password: 'secret' })).toEqual({});
  });

  it('requires a first name and a six-character password on registration', () => {
    const errors = validateRegister({
      firstName: '',
      email: 'ada@example.com',
      password: '123',
    });
    expect(errors.firstName).toBe('First name is required');
    expect(errors.password).toBe('Password must be at least 6 characters');
    expect(validateRegister({ firstName: 'Ada', email: 'ada@example.com', password: 'secret1' })).toEqual({});
  });

  it('only accepts future reminder times', () => {
    expect(validateReminderTime('')).toBe('Reminder time is required');
    expect(validateReminderTime('2020-01-01T10:00')).toBe('Reminder time must be in the future');
    const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const pad = (value) => String(value).padStart(2, '0');
    const future = `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-${pad(futureDate.getDate())}T${pad(futureDate.getHours())}:${pad(futureDate.getMinutes())}`;
    expect(validateReminderTime(future)).toBe('');
  });

  it('converts between datetime-local and backend time strings', () => {
    expect(toBackendDateTime('2026-11-30T10:30')).toBe('2026-11-30T10:30:00');
    expect(toBackendDateTime('2026-11-30T10:30:45')).toBe('2026-11-30T10:30:45');
    expect(toInputDateTime('2026-11-30T10:30:45')).toBe('2026-11-30T10:30');
  });
});
