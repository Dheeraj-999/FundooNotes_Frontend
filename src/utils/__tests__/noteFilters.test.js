import { describe, expect, it } from 'vitest';
import { filterNotes, matchesQuery } from '../noteFilters';

const notes = [
  { id: 1, title: 'Roadmap', description: 'Q4 plan', archived: false, trashed: false, labels: [{ name: 'Work' }] },
  { id: 2, title: 'Old roadmap', description: '', archived: true, trashed: false, labels: [] },
  { id: 3, title: 'Roadmap (old)', description: '', archived: false, trashed: true, labels: [] },
];

describe('noteFilters', () => {
  it('matches title, description and labels case-insensitively', () => {
    expect(matchesQuery(notes[0], 'WORK')).toBe(true);
    expect(matchesQuery(notes[0], 'q4')).toBe(true);
    expect(matchesQuery(notes[1], 'nothing')).toBe(false);
    expect(matchesQuery(notes[1], '')).toBe(true);
  });

  it('filters by archived and trashed flags', () => {
    expect(filterNotes(notes, { archived: false, trashed: false }).map((n) => n.id)).toEqual([1]);
    expect(filterNotes(notes, { archived: true, trashed: false }).map((n) => n.id)).toEqual([2]);
    expect(filterNotes(notes, { trashed: true }).map((n) => n.id)).toEqual([3]);
    expect(filterNotes(notes, { query: 'roadmap' }).map((n) => n.id)).toEqual([1, 2, 3]);
  });
});
