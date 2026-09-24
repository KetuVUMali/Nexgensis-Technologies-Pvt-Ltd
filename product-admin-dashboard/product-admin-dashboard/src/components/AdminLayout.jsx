import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// The frame around every logged-in page: sidebar + top bar + the page itself (<Outlet />).
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // New page: close the mobile menu and start at the top.
  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!sidebarOpen) return;
    function handleKeyDown(event) {
      if (event.key === 'Escape') setSidebarOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}

      <div className="app-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main id="main-content" className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
