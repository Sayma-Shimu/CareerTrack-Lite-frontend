import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="glass-panel" style={{
      borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 20px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(18, 22, 32, 0.8)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'linear-gradient(135deg, hsl(var(--accent-primary)), hsl(var(--accent-secondary)))',
          borderRadius: 'var(--radius-sm)',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--glow-shadow)'
        }}>
          <Briefcase size={20} color="white" />
        </div>
        <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          CareerTrack Lite
        </span>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user ? (
          <>
            <Link 
              to="/dashboard" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: isActive('/dashboard') ? 'hsl(var(--accent-primary))' : 'hsl(var(--text-secondary))',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link 
              to="/applications" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: isActive('/applications') ? 'hsl(var(--accent-primary))' : 'hsl(var(--text-secondary))',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              <Briefcase size={18} />
              Applications
            </Link>
            
            <div style={{ height: '20px', width: '1px', background: 'hsl(var(--border-color))' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>
                <UserIcon size={16} />
                <span>{user.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
