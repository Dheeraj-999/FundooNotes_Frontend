import { FileText } from 'lucide-react';

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'When you add something, it will show up here.',
  icon: Icon = FileText,
  action,
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon"><Icon size={28} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
