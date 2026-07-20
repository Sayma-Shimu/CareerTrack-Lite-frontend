import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, LayoutDashboard, User as UserIcon, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        <div className="navbar-logo">
          <Briefcase size={20} color="white" />
        </div>
        <span className="gradient-text navbar-title">CareerTrack Lite</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="navbar-desktop">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link
              to="/applications"
              className={`nav-link ${isActive('/applications') ? 'nav-link-active' : ''}`}
            >
              <Briefcase size={18} />
              Applications
            </Link>
            <div className="nav-divider" />
            <div className="nav-user">
              <UserIcon size={16} />
              <span>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              <LogOut size={14} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </nav>

      {/* Mobile Hamburger */}
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {user ? (
            <>
              <div className="mobile-user-info">
                <UserIcon size={16} />
                <span>{user.name}</span>
              </div>
              <Link
                to="/dashboard"
                className={`mobile-nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
                onClick={closeMenu}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                to="/applications"
                className={`mobile-nav-link ${isActive('/applications') ? 'nav-link-active' : ''}`}
                onClick={closeMenu}
              >
                <Briefcase size={18} />
                Applications
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeMenu}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
