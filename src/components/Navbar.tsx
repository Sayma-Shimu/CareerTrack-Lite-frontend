import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, LayoutDashboard, User as UserIcon, Menu, X, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (path: string) => location.pathname === path;
  const close = () => setMenuOpen(false);

  return (
    <header className="navbar">
      {/* Brand */}
      <Link to="/" className="navbar-brand" onClick={close}>
        <div className="navbar-logo">
          <Briefcase size={20} color="white" />
        </div>
        <span className="gradient-text navbar-title">CareerTrack Lite</span>
      </Link>

      {/* Desktop nav */}
      <nav className="navbar-desktop">
        {user ? (
          <>
            <Link to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/applications"
              className={`nav-link ${isActive('/applications') ? 'nav-link-active' : ''}`}>
              <Briefcase size={18} /> Applications
            </Link>
            <Link to="/ai-analyzer"
              className={`nav-link ${isActive('/ai-analyzer') ? 'nav-link-active' : ''}`}>
              <Sparkles size={18} /> AI Analyzer
            </Link>
            <div className="nav-divider" />
            <span className="nav-user hidden md:flex">
              <UserIcon size={16} />{user.name}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm flex items-center gap-1">
              <LogOut size={14} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </nav>

      {/* Hamburger button */}
      <button className="navbar-hamburger md:hidden" onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu">
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {user ? (
            <>
              <div className="mobile-user-info">
                <UserIcon size={16} /><span>{user.name}</span>
              </div>
              <Link to="/dashboard"
                className={`mobile-nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
                onClick={close}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/applications"
                className={`mobile-nav-link ${isActive('/applications') ? 'nav-link-active' : ''}`}
                onClick={close}>
                <Briefcase size={18} /> Applications
              </Link>
              <Link to="/ai-analyzer"
                className={`mobile-nav-link ${isActive('/ai-analyzer') ? 'nav-link-active' : ''}`}
                onClick={close}>
                <Sparkles size={18} /> AI Analyzer
              </Link>
              <button onClick={handleLogout}
                className="btn btn-secondary w-full justify-center flex items-center gap-2 mt-2">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary w-full justify-center" onClick={close}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary w-full justify-center" onClick={close}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
