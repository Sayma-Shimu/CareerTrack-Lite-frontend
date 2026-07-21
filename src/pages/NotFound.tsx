import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileQuestion, Home, LayoutDashboard } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center text-center min-h-[calc(100vh-70px)] px-5 py-10">

      <FileQuestion size={80} className="mb-6 opacity-80"
        style={{ color: 'hsl(var(--accent-primary))' }} />

      <h1 className="text-8xl font-extrabold leading-none mb-3 gradient-text">404</h1>

      <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>

      <p className="text-base max-w-sm mb-10 leading-relaxed"
        style={{ color: 'hsl(var(--text-secondary))' }}>
        The page you are looking for does not exist or has been moved.
      </p>

      <div className="flex gap-3 justify-center flex-wrap">
        <Link to="/" className="btn btn-secondary flex items-center gap-2">
          <Home size={16} /> Go Home
        </Link>
        {user && (
          <Link to="/dashboard" className="btn btn-primary flex items-center gap-2">
            <LayoutDashboard size={16} /> Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};
