import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteEditor from '../NoteEditor';

describe('NoteEditor', () => {
  it('validates the title before saving', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<NoteEditor onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: /take a note/i }));
    await user.click(screen.getByRole('button', { name: 'Save note' }));
    expect(screen.getByText('Note title is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('submits trimmed fields and closes after a successful save', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue({ id: 1 });
    render(<NoteEditor onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: /take a note/i }));
    await user.type(screen.getByLabelText('Title'), '  Launch plan  ');
    await user.type(screen.getByLabelText('Description'), '  Ship it  ');
    await user.click(screen.getByRole('button', { name: 'Save note' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith({
      title: 'Launch plan',
      description: 'Ship it',
    }));
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Save note' })).not.toBeInTheDocument();
    });
  });

  it('prefills a saved note and saves edited values', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue({ id: 7 });
    const onClose = vi.fn();
    render(
      <NoteEditor
        note={{ id: 7, title: 'Old title', description: 'Old body' }}
        onSave={onSave}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Edit note' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('Old title');
    expect(screen.getByLabelText('Description')).toHaveValue('Old body');

    await user.clear(screen.getByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), '  New title  ');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({ title: 'New title', description: 'Old body' }),
    );
    expect(onClose).toHaveBeenCalled();
  });
});
