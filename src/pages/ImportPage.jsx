import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, FileSpreadsheet, Upload } from 'lucide-react';
import { useToast } from '../components/Toast';
import { importNotes } from '../services/importService';
import { getErrorMessage } from '../utils/errors';

export default function ImportPage() {
  const { reload } = useOutletContext();
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] || null);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Choose an .xlsx file first');
      return;
    }
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setError('Only .xlsx files are supported');
      return;
    }

    setStatus('uploading');
    setError('');
    try {
      const data = await importNotes(file);
      setResult(data);
      setStatus('success');
      showToast(data?.message || 'Excel import started');
      reload?.();
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, 'Unable to upload the file.'));
      setStatus('error');
      showToast(getErrorMessage(uploadError, 'Unable to upload the file.'), 'error');
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Workspace</p>
          <h1 className="page-title">Import notes</h1>
          <p className="page-subtitle">Bring notes in from an Excel spreadsheet.</p>
        </div>
      </header>

      <form className="import-panel" onSubmit={handleSubmit} noValidate>
        <div className="import-panel__icon"><FileSpreadsheet size={26} /></div>
        <h2>Upload an .xlsx file</h2>
        <p>The backend starts a batch job that adds the notes to your account.</p>

        <div className="field">
          <label className="sr-only" htmlFor="import-file">Excel file</label>
          <input
            id="import-file"
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'import-error' : undefined}
          />
        </div>

        {file && <p className="import-panel__filename">Selected: {file.name}</p>}
        {error && (
          <span className="field__error" id="import-error" role="alert">{error}</span>
        )}

        <button
          type="submit"
          className="btn btn--primary btn--small"
          disabled={status === 'uploading'}
        >
          {status === 'uploading' ? (
            <><span className="spinner spinner--small" /> Uploading...</>
          ) : (
            <><Upload size={16} /> Start import</>
          )}
        </button>
      </form>

      {status === 'success' && result && (
        <div className="import-result" role="status">
          <CheckCircle2 size={20} />
          <div>
            <strong>{result.message || 'Import started'}</strong>
            <p>
              Job #{result.executionId} · Status: {result.status}. Notes appear once the
              batch job finishes; refresh the dashboard in a moment.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
