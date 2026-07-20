import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileQuestion, Home, LayoutDashboard } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 70px)',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <FileQuestion
        size={80}
        style={{ color: 'hsl(var(--accent-primary))', marginBottom: '24px', opacity: 0.8 }}
      />

      <h1
        style={{
          fontSize: '6rem',
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: '12px',
          background: 'linear-gradient(135deg, hsl(var(--accent-primary)), hsl(var(--accent-secondary)))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </h1>

      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
        Page Not Found
      </h2>
      <p
        style={{
          color: 'hsl(var(--text-secondary))',
          fontSize: '1rem',
          maxWidth: '400px',
          marginBottom: '36px',
          lineHeight: '1.6',
        }}
      >
        The page you are looking for does not exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          to="/"
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Home size={16} />
          Go Home
        </Link>
        {user && (
          <Link
            to="/dashboard"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <LayoutDashboard size={16} />
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};
