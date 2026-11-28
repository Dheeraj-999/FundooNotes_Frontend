import { NotebookPen } from 'lucide-react';

export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <span className="brand__mark" aria-hidden="true">
        <NotebookPen size={compact ? 20 : 24} strokeWidth={2.2} />
      </span>
      <span className="brand__text">
        Fundoo<span>Notes</span>
      </span>
    </div>
  );
}
