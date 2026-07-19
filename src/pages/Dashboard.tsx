import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '800px',
      margin: '80px auto',
      padding: '0 20px',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{ padding: '60px 40px' }}>
        <div style={{
          background: 'rgba(112, 93, 242, 0.1)',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(var(--accent-primary))',
          margin: '0 auto 24px auto'
        }}>
          <LayoutDashboard size={32} />
        </div>

        <h2 style={{ fontSize: '2.2rem', marginBottom: '16px' }}>
          Welcome, <span className="gradient-text">{user?.name || 'User'}</span>!
        </h2>
        
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 40px auto' }}>
          You have successfully registered and logged in to CareerTrack Lite.
          The Dashboard CRUD and Stats features will be fully integrated in Day 2!
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
