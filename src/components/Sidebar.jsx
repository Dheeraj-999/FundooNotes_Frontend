import { Archive, Bell, FileUp, Lightbulb, Plus, Tag, Trash2, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Brand from './Brand';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Notes', icon: Lightbulb, key: 'active' },
  { to: '/archive', label: 'Archive', icon: Archive, key: 'archived' },
  { to: '/trash', label: 'Trash', icon: Trash2, key: 'trashed' },
  { to: '/reminders', label: 'Reminders', icon: Bell, key: 'reminders' },
  { to: '/labels', label: 'Labels', icon: Tag, key: 'labels' },
  { to: '/import', label: 'Import', icon: FileUp },
];

export default function Sidebar({
  open = false,
  onClose,
  counts = {},
  labels = [],
  onSelectLabel,
  activeLabelId,
}) {
  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} aria-label="Main navigation">
      <div className="sidebar__brand">
        <Brand compact />
        <button
          type="button"
          className="sidebar__close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={19} />
        </button>
      </div>

      <nav className="sidebar__nav">
        <p className="sidebar__heading">Workspace</p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
            onClick={onClose}
          >
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
            {counts[key] > 0 && <span className="nav-item__badge">{counts[key]}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__labels">
        <div className="sidebar__label-header">
          <p className="sidebar__heading">Labels</p>
          <NavLink to="/labels" className="sidebar__add" aria-label="Manage labels" onClick={onClose}>
            <Plus size={16} />
          </NavLink>
        </div>
        {labels.length === 0 ? (
          <p className="sidebar__hint">Create a label to group your notes.</p>
        ) : (
          labels.map((label) => (
            <button
              key={label.id}
              type="button"
              className={`sidebar__label ${activeLabelId === label.id ? 'sidebar__label--active' : ''}`}
              onClick={() => {
                onSelectLabel?.(label);
                onClose?.();
              }}
            >
              <Tag size={16} aria-hidden="true" />
              <span>{label.name}</span>
            </button>
          ))
        )}
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__tip">
          <span className="sidebar__tip-dot" />
          <div>
            <strong>Stay organised</strong>
            <p>Pin what matters. Archive what doesn't.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
