import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Landing: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in" style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>

      {/* Hero */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 60px' }}>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{ background: 'rgba(112,93,242,0.12)', border: '1px solid rgba(112,93,242,0.25)', color: 'hsl(var(--accent-primary))' }}>
          <Sparkles size={13} />
          Organize Your Job Search Smarter
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', maxWidth: '780px' }}>
          Master Your Job Search with{' '}
          <span className="gradient-text">CareerTrack Lite</span>
        </h1>

        {/* Subtext */}
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '40px', maxWidth: '560px', color: 'hsl(var(--text-secondary))' }}>
          A simple, secure, and clean dashboard to manage all your job applications.
          Track progress and stay on top of interview cycles.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', gap: '8px' }}>
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', gap: '8px' }}>
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                Log In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(112,93,242,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--accent-primary))', marginBottom: '20px' }}>
              <Briefcase size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Track Applications</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'hsl(var(--text-secondary))' }}>
              Store job post URL, source, application date, and custom notes. Never lose track of where you applied.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(112,93,242,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--accent-primary))', marginBottom: '20px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Secure & Personal</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'hsl(var(--text-secondary))' }}>
              Built on bcrypt password hashing and JWT tokens. Your data is private — only you can access it.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(112,93,242,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--accent-primary))', marginBottom: '20px' }}>
              <BarChart3 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Analytics & Stats</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'hsl(var(--text-secondary))' }}>
              Instantly view metrics for your pipeline: applied, interviews, rejections, and pending offers.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid hsl(var(--border-color))', padding: '28px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '0.88rem', color: 'hsl(var(--text-muted))' }}>
          <strong>CareerTrack Lite</strong> &copy; {new Date().getFullYear()} — All rights reserved.
        </div>
        <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>
          Developed by: <strong>Sayma Shimu</strong> | Student ID: <strong>CT-2026-LITE-045</strong>
        </div>
      </footer>

    </div>
  );
};
