import { describe, expect, it } from 'vitest';
import { getPageTitle } from '../pageTitles';

describe('getPageTitle', () => {
  it('uses a readable title per route', () => {
    expect(getPageTitle('/dashboard')).toBe('All notes — Fundoo Notes');
    expect(getPageTitle('/reminders')).toBe('Reminders — Fundoo Notes');
    expect(getPageTitle('/unknown')).toBe('Fundoo Notes');
    expect(getPageTitle()).toBe('Fundoo Notes');
  });
});
