import { Link, NavLink, useLocation } from 'react-router-dom';
import BrandMark from './BrandMark';

// Left menu. On desktop it is always visible; on mobile it slides in (open = true).
export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();

  // "/products" should stay highlighted on the details and edit pages,
  // but not on "/products/add" because that has its own menu item.
  const productsActive = pathname.startsWith('/products') && pathname !== '/products/add';

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main menu">
      <div className="sidebar-brand d-flex align-items-center justify-content-between">
        <Link to="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none" onClick={onClose}>
          <BrandMark />
          <span className="brand-font sidebar-brand-name">Product Admin</span>
        </Link>
        <button type="button" className="btn-close btn-close-white d-lg-none" aria-label="Close menu" onClick={onClose}></button>
      </div>

      <nav className="sidebar-nav" aria-label="Sections">
        <div className="sidebar-section">Manage</div>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="sidebar-icon"><i className="bi bi-speedometer2" aria-hidden="true"></i></span>Dashboard
        </NavLink>
        <NavLink to="/products" className={() => `sidebar-link ${productsActive ? 'active' : ''}`} onClick={onClose}>
          <span className="sidebar-icon"><i className="bi bi-box-seam" aria-hidden="true"></i></span>Products
        </NavLink>
        <NavLink to="/products/add" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="sidebar-icon"><i className="bi bi-plus-lg" aria-hidden="true"></i></span>Add product
        </NavLink>
      </nav>

      <div className="sidebar-footer small">
        <span className="status-dot" aria-hidden="true"></span>
        Connected to dummyjson.com
      </div>
    </aside>
  );
}
