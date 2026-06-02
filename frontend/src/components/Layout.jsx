import { NavLink } from 'react-router-dom';
import './Layout.css';

const links = [
  { to: '/', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/products', label: 'Inventory', icon: '📦' },
  { to: '/orders', label: 'Orders', icon: '📋' },
  { to: '/customers', label: 'Customers', icon: '👥' },
];

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">📦</span>
          Inventory Manager
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Topbar */}
        <header className="topbar" style={{ justifyContent: 'flex-end' }}>
          <div className="topbar-right">
            <div className="user-profile">
              <div className="avatar">A</div>
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
