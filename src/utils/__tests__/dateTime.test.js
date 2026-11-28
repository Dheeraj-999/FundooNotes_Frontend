import { describe, expect, it } from 'vitest';
import { formatReminderTime, isPastReminder, parseLocalDateTime } from '../dateTime';

describe('dateTime', () => {
  it('parses backend LocalDateTime strings as local wall-clock time', () => {
    const date = parseLocalDateTime('2026-11-30T10:15:00');
    expect(date).not.toBeNull();
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(10);
    expect(date.getDate()).toBe(30);
    expect(date.getHours()).toBe(10);
    expect(date.getMinutes()).toBe(15);
    expect(parseLocalDateTime('not a date')).toBeNull();
  });

  it('formats a reminder for display', () => {
    const formatted = formatReminderTime('2026-11-30T10:00:00');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('30');
    expect(formatted).not.toBe('2026-11-30T10:00:00');
  });

  it('detects past reminders without depending on a timezone suffix', () => {
    expect(isPastReminder('2020-01-01T09:00:00')).toBe(true);
    expect(isPastReminder('2099-01-01T09:00:00')).toBe(false);
    expect(isPastReminder('')).toBe(false);
  });
});
