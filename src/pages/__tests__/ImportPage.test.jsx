import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const contextHolder = vi.hoisted(() => ({ value: {} }));
const mockImportService = vi.hoisted(() => ({ importNotes: vi.fn() }));
const mockToast = vi.hoisted(() => ({ showToast: vi.fn() }));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useOutletContext: () => contextHolder.value };
});
vi.mock('../../services/importService', () => mockImportService);
vi.mock('../../components/Toast', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useToast: () => ({ showToast: mockToast.showToast }) };
});

import ImportPage from '../ImportPage';

describe('ImportPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    contextHolder.value = { reload: vi.fn() };
  });

  it('rejects non-xlsx files before calling the API', async () => {
    render(<ImportPage />);
    const file = new File(['notes'], 'notes.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Excel file'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Start import' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Only .xlsx files are supported');
    expect(mockImportService.importNotes).not.toHaveBeenCalled();
  });

  it('uploads an xlsx file, shows the job result and refreshes notes', async () => {
    mockImportService.importNotes.mockResolvedValue({
      message: 'Excel import job started successfully',
      executionId: 12,
      status: 'STARTED',
    });
    render(<ImportPage />);

    const file = new File(['notes'], 'notes.xlsx');
    fireEvent.change(screen.getByLabelText('Excel file'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Start import' }));

    await waitFor(() => expect(mockImportService.importNotes).toHaveBeenCalledWith(file));
    await waitFor(() => expect(screen.getByText(/Job #12/)).toBeInTheDocument());
    expect(contextHolder.value.reload).toHaveBeenCalled();
    expect(mockToast.showToast).toHaveBeenCalledWith('Excel import job started successfully');
  });

  it('shows a backend error message when the upload fails', async () => {
    mockImportService.importNotes.mockRejectedValue({
      response: { data: { message: 'Only .xlsx files are supported' } },
    });
    render(<ImportPage />);

    const file = new File(['notes'], 'notes.xlsx');
    fireEvent.change(screen.getByLabelText('Excel file'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Start import' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Only .xlsx files are supported'),
    );
  });
});
