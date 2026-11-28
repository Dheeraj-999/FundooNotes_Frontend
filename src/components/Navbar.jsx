import { LogOut, Menu, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SearchBar from './SearchBar';

export default function Navbar({ query, onQueryChange, onMenuClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__menu"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>

      <div className="topbar__search">
        <SearchBar value={query} onChange={onQueryChange} />
      </div>

      <div className="topbar__actions">
        <span className="topbar__avatar" aria-hidden="true">
          <UserRound size={19} />
        </span>
        <button
          type="button"
          className="btn btn--ghost btn--small topbar__logout"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
}
