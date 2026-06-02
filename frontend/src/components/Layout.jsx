import { NavLink } from 'react-router-dom';
import './Layout.css';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/orders', label: 'Orders', icon: '🛒' },
];

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="container navbar-inner">
          <div className="brand">
            <span className="brand-icon">📋</span>
            Inventory Manager
          </div>
          <nav className="nav-links">
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
        </div>
      </header>
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
