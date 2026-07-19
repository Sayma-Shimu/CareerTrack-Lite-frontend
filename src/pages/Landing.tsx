import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, BarChart3, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Landing: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '80px 20px 40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)',
    }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '80px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(112, 93, 242, 0.1)',
          border: '1px solid rgba(112, 93, 242, 0.2)',
          borderRadius: '50px',
          padding: '6px 16px',
          color: 'hsl(var(--accent-primary))',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '24px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <Sparkles size={14} />
          Organize Your Job Search Smarter
        </div>
        
        <h1 style={{
          fontSize: '3.5rem',
          lineHeight: '1.1',
          marginBottom: '24px',
          fontWeight: 800
        }}>
          Master Your Job Search with <span className="gradient-text">CareerTrack Lite</span>
        </h1>
        
        <p style={{
          color: 'hsl(var(--text-secondary))',
          fontSize: '1.2rem',
          lineHeight: '1.6',
          marginBottom: '40px'
        }}>
          A simple, secure, and clean dashboard to manage all your job applications.
          Track progress, prepare, and stay on top of interview cycles.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                Log In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        width: '100%',
        marginBottom: '100px'
      }}>
        <div className="glass-panel" style={{ padding: '30px', transition: 'all 0.3s ease' }}>
          <div style={{
            background: 'rgba(112, 93, 242, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'hsl(var(--accent-primary))',
            marginBottom: '20px'
          }}>
            <Briefcase size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Track Applications</h3>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Store details such as job post URL, source, application date, and custom notes. Never lose track of where you applied.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px', transition: 'all 0.3s ease' }}>
          <div style={{
            background: 'rgba(112, 93, 242, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'hsl(var(--accent-primary))',
            marginBottom: '20px'
          }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Secure & Personal</h3>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Your data is protected. Built on cryptographically secure bcrypt password hashing and JSON Web Tokens. Access is yours alone.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px', transition: 'all 0.3s ease' }}>
          <div style={{
            background: 'rgba(112, 93, 242, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'hsl(var(--accent-primary))',
            marginBottom: '20px'
          }}>
            <BarChart3 size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Analytics & Statistics</h3>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Instantly view summary metrics for your job pipeline: applied jobs, interviews scheduled, rejections, and pending offers.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <footer style={{
        marginTop: 'auto',
        width: '100%',
        borderTop: '1px solid hsl(var(--border-color))',
        padding: '30px 0',
        textAlign: 'center',
        color: 'hsl(var(--text-muted))',
        fontSize: '0.9rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div>
          <strong>CareerTrack Lite</strong> &copy; {new Date().getFullYear()} - All rights reserved.
        </div>
        <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>
          Developed by: <strong>Sayma Shimu</strong> | Student ID: <strong>CT-2026-LITE-045</strong>
        </div>
      </footer>
    </div>
  );
};
