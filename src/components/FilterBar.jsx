export default function FilterBar({ filters = [], active = 'all', onChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter notes">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`filter-chip ${active === filter.id ? 'filter-chip--active' : ''}`}
          aria-pressed={active === filter.id}
          onClick={() => onChange?.(filter.id)}
        >
          {filter.label}
          {typeof filter.count === 'number' && <span>{filter.count}</span>}
        </button>
      ))}
    </div>
  );
}
