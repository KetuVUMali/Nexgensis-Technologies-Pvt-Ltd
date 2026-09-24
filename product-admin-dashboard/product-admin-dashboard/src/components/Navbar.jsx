import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { getUser, logout } from '../utils/auth';

// Name of the current page, shown in the top bar on big screens.
function getPageTitle(pathname) {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/products') return 'Products';
  if (pathname === '/products/add') return 'Add product';
  if (pathname.endsWith('/edit')) return 'Edit product';
  if (pathname.startsWith('/products/')) return 'Product details';
  return '';
}

// Top bar: menu button (mobile), page title, theme toggle, logged-in user and Log out.
export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = getUser();

  function handleLogout() {
    logout(); // remove token + user from localStorage
    navigate('/login', { replace: true });
  }

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : '';
  const initials = user ? `${(user.firstName || user.username || '?').charAt(0)}${(user.lastName || '').charAt(0)}`.toUpperCase() : '';

  return (
    <header className="topbar">
      <button type="button" className="icon-btn d-lg-none" onClick={onMenuClick} aria-label="Open menu">
        <i className="bi bi-list fs-5" aria-hidden="true"></i>
      </button>
      <span className="brand-font fw-bold d-lg-none">Product Admin</span>
      <span className="topbar-title brand-font d-none d-lg-block">{getPageTitle(pathname)}</span>

      <div className="ms-auto d-flex align-items-center gap-2">
        <ThemeToggle />
        {user && (
          <div className="user-chip d-none d-sm-flex align-items-center gap-2">
            <span className="avatar" aria-hidden="true">{initials}</span>
            <div className="lh-sm pe-2">
              <div className="small fw-semibold">{fullName}</div>
              <div className="user-handle">@{user.username}</div>
            </div>
          </div>
        )}
        <button type="button" className="btn btn-outline-secondary btn-sm logout-btn" onClick={handleLogout} title="Log out">
          <i className="bi bi-box-arrow-right me-sm-2" aria-hidden="true"></i>
          <span className="d-none d-sm-inline">Log out</span>
          <span className="visually-hidden d-sm-none">Log out</span>
        </button>
      </div>
    </header>
  );
}
