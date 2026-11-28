/**
 * The backend sends LocalDateTime strings with no timezone suffix.
 * new Date("2026-11-30T10:00:00") is parsed as local time by the JS engine, but
 * parsing the parts explicitly keeps the behaviour identical everywhere.
 */
export function parseLocalDateTime(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(String(value));
  if (!match) return null;

  const [, year, month, day, hour, minute, second = '00'] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatReminderTime(value) {
  const date = parseLocalDateTime(value);
  if (!date) return String(value ?? '');
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function isPastReminder(value) {
  const date = parseLocalDateTime(value);
  return date ? date.getTime() < Date.now() : false;
}
