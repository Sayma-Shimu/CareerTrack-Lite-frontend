import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export const Register: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend Validations
    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      
      // Save auth token & user context
      login(data.token, data.user);
      
      // Small timeout to show the success state before redirecting
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '450px',
      margin: '80px auto',
      padding: '0 20px',
      width: '100%'
    }}>
      <div className="glass-panel" style={{ padding: '40px 30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, hsl(var(--accent-primary)), hsl(var(--accent-secondary)))'
        }} />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>
            Start managing and tracking your job applications today
          </p>
        </div>

        {error && (
          <div style={{
            background: 'hsl(var(--color-danger) / 0.15)',
            border: '1px solid hsl(var(--color-danger) / 0.3)',
            color: 'hsl(var(--color-danger))',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: 'hsl(var(--color-success) / 0.15)',
            border: '1px solid hsl(var(--color-success) / 0.3)',
            color: 'hsl(var(--color-success))',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={18} />
            <span>Registration successful! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-muted))'
              }} />
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="form-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-muted))'
              }} />
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="form-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-muted))'
              }} />
              <input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                className="form-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-muted))'
              }} />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat password"
                className="form-input"
                style={{ paddingLeft: '44px', width: '100%' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || success}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px', height: '48px' }}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-pulse" style={{ animation: 'spin 1s linear infinite' }} />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'hsl(var(--text-secondary))',
          fontSize: '0.9rem'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
