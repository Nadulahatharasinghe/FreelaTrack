import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>Freelancer Tracker</h1>
          </div>
          <ul className="nav-menu">
            <li>
              <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/clients" className={isActive('/clients') ? 'active' : ''}>
                Clients
              </Link>
            </li>
            <li>
              <Link to="/projects" className={isActive('/projects') ? 'active' : ''}>
                Projects
              </Link>
            </li>
            <li>
              <Link to="/income" className={isActive('/income') ? 'active' : ''}>
                Income
              </Link>
            </li>
            <li className="nav-user">
              <span>{user?.name}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
