import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldAlert, Sparkles, Loader2, Eye, EyeOff, Briefcase } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) { setError('All fields are required'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setSuccess(true);
      login(data.token, data.user);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper animate-fade-in">
      <div className="auth-card">
        <div className="auth-card-bar" />

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="navbar-logo">
            <Briefcase size={26} color="white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2">Welcome Back</h2>
          <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>
            Log in to manage your applications
          </p>
        </div>

        {error && (
          <div className="alert alert-danger mb-5">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success mb-5">
            <Sparkles size={18} />
            <span>Login successful! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail size={18} className="input-icon-left" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="form-input input-with-icon-left w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={18} className="input-icon-left" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="form-input input-with-icon-both w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-13 text-base mt-2"
            style={{ height: '52px' }}
            disabled={loading || success}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Logging in...</>
            ) : 'Log In'}
          </button>
        </form>

        <p className="text-center mt-7 text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-bold" style={{ color: 'hsl(var(--accent-primary))' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
