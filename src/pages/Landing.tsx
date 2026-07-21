import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Landing: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in flex flex-col items-center min-h-[calc(100vh-70px)] px-5 py-16 max-w-6xl mx-auto">

      {/* Hero */}
      <div className="text-center max-w-3xl mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-widest"
          style={{ background: 'rgba(112,93,242,0.1)', border: '1px solid rgba(112,93,242,0.2)', color: 'hsl(var(--accent-primary))' }}>
          <Sparkles size={13} />
          Organize Your Job Search Smarter
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
          Master Your Job Search with{' '}
          <span className="gradient-text">CareerTrack Lite</span>
        </h1>

        <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: 'hsl(var(--text-secondary))' }}>
          A simple, secure, and clean dashboard to manage all your job applications.
          Track progress and stay on top of interview cycles.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary px-7 py-3 text-base flex items-center gap-2">
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary px-7 py-3 text-base flex items-center gap-2">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary px-7 py-3 text-base">
                Log In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-20">
        {[
          {
            icon: <Briefcase size={24} />,
            title: 'Track Applications',
            desc: 'Store job post URL, source, application date, and custom notes. Never lose track of where you applied.'
          },
          {
            icon: <ShieldCheck size={24} />,
            title: 'Secure & Personal',
            desc: 'Built on bcrypt password hashing and JWT tokens. Your data is private — only you can access it.'
          },
          {
            icon: <BarChart3 size={24} />,
            title: 'Analytics & Stats',
            desc: 'Instantly view metrics for your pipeline: applied, interviews, rejections, and pending offers.'
          }
        ].map((f) => (
          <div key={f.title} className="glass-panel p-7 hover:scale-[1.02] transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(112,93,242,0.1)', color: 'hsl(var(--accent-primary))' }}>
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--text-secondary))' }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full pt-8 text-center text-sm flex flex-col gap-2"
        style={{ borderTop: '1px solid hsl(var(--border-color))', color: 'hsl(var(--text-muted))' }}>
        <div><strong>CareerTrack Lite</strong> &copy; {new Date().getFullYear()} — All rights reserved.</div>
        <div style={{ color: 'hsl(var(--text-secondary))' }}>
          Developed by: <strong>Sayma Shimu</strong> | Student ID: <strong>CT-2026-LITE-045</strong>
        </div>
      </footer>
    </div>
  );
};
