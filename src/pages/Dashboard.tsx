import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Bookmark, 
  Send, 
  ClipboardCheck, 
  Calendar, 
  XCircle, 
  Award, 
  Plus, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string | null;
  source: string;
  status: string;
  applicationDate: string;
  notes: string | null;
}

interface Stats {
  total: number;
  saved: number;
  applied: number;
  assessment: number;
  interview: number;
  rejected: number;
  offer: number;
}

export const Dashboard: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [source, setSource] = useState('LinkedIn');
  const [status, setStatus] = useState('Saved');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Details modal state
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard statistics');
      }
      setStats(data.stats);
      setRecentApps(data.recentApplications);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!companyName.trim() || !jobTitle.trim() || !source) {
      setFormError('Company name, job title, and source are required');
      return;
    }

    setFormLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName,
          jobTitle,
          jobUrl,
          source,
          status,
          applicationDate,
          notes
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add application');
      }

      // Reset Form fields
      setCompanyName('');
      setJobTitle('');
      setJobUrl('');
      setSource('LinkedIn');
      setStatus('Saved');
      setApplicationDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setIsAddModalOpen(false);
      
      // Refresh Dashboard Data
      fetchDashboardData();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'saved': return 'badge-saved';
      case 'applied': return 'badge-applied';
      case 'assessment': return 'badge-assessment';
      case 'interview': return 'badge-interview';
      case 'rejected': return 'badge-rejected';
      case 'offer': return 'badge-offer';
      default: return 'badge-saved';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '16px' }}>
        <Loader2 className="animate-pulse" size={40} style={{ color: 'hsl(var(--accent-primary))', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading statistics and reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', border: '1px solid hsl(var(--color-danger) / 0.3)' }}>
          <AlertCircle size={48} style={{ color: 'hsl(var(--color-danger))', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Oops, Something Went Wrong</h3>
          <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '24px' }}>{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in page-container">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-5 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Dashboard</h1>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>
            Welcome back, <strong style={{ color: 'hsl(var(--text-primary))' }}>{user?.name}</strong>. Here is your job application status.
          </p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary flex items-center gap-2 px-6 py-3">
          <Plus size={18} /> Add Application
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {/* Card 1 - Total */}
          <div className="glass-panel" style={{
            padding: '20px',
            textAlign: 'center',
            borderLeft: '4px solid hsl(var(--accent-primary))',
            boxShadow: 'var(--glow-shadow)',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }} onClick={() => navigate('/applications')}>
            <Briefcase size={22} style={{ color: 'hsl(var(--accent-primary))', marginBottom: '10px' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.total}</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', fontWeight: 700 }}>Total</div>
          </div>

          {/* Card 2 - Saved */}
          <div className="glass-panel" style={{
            padding: '20px',
            textAlign: 'center',
            borderLeft: '4px solid hsl(var(--text-muted))',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }} onClick={() => navigate('/applications?status=Saved')}>
            <Bookmark size={22} style={{ color: 'hsl(var(--text-secondary))', marginBottom: '10px' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.saved}</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', fontWeight: 700 }}>Saved</div>
          </div>

          {/* Card 3 - Applied */}
          <div className="glass-panel" style={{
            padding: '20px',
            textAlign: 'center',
            borderLeft: '4px solid hsl(var(--color-info))',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }} onClick={() => navigate('/applications?status=Applied')}>
            <Send size={22} style={{ color: 'hsl(var(--color-info))', marginBottom: '10px' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.applied}</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', fontWeight: 700 }}>Applied</div>
          </div>

          {/* Card 4 - Assessment */}
          <div className="glass-panel" style={{
            padding: '20px',
            textAlign: 'center',
            borderLeft: '4px solid hsl(var(--accent-primary))',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }} onClick={() => navigate('/applications?status=Assessment')}>
            <ClipboardCheck size={22} style={{ color: 'hsl(var(--accent-primary))', marginBottom: '10px' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.assessment}</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', fontWeight: 700 }}>Assessment</div>
          </div>

          {/* Card 5 - Interview */}
          <div className="glass-panel" style={{
            padding: '20px',
            textAlign: 'center',
            borderLeft: '4px solid hsl(var(--color-warning))',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }} onClick={() => navigate('/applications?status=Interview')}>
            <Calendar size={22} style={{ color: 'hsl(var(--color-warning))', marginBottom: '10px' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.interview}</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', fontWeight: 700 }}>Interview</div>
          </div>

          {/* Card 6 - Rejected */}
          <div className="glass-panel" style={{
            padding: '20px',
            textAlign: 'center',
            borderLeft: '4px solid hsl(var(--color-danger))',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }} onClick={() => navigate('/applications?status=Rejected')}>
            <XCircle size={22} style={{ color: 'hsl(var(--color-danger))', marginBottom: '10px' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.rejected}</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', fontWeight: 700 }}>Rejected</div>
          </div>

          {/* Card 7 - Offer */}
          <div className="glass-panel" style={{
            padding: '20px',
            textAlign: 'center',
            borderLeft: '4px solid hsl(var(--color-success))',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }} onClick={() => navigate('/applications?status=Offer')}>
            <Award size={22} style={{ color: 'hsl(var(--color-success))', marginBottom: '10px' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.offer}</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', fontWeight: 700 }}>Offers</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem' }}>Recently Added Applications</h3>
            {recentApps.length > 0 && (
              <button 
                onClick={() => navigate('/applications')} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.85rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {recentApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'hsl(var(--text-secondary))' }}>
              <Briefcase size={40} style={{ color: 'hsl(var(--text-muted))', marginBottom: '16px' }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>No applications tracked yet.</p>
              <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ padding: '10px 20px' }}>
                Create Your First Job Record
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentApps.map((app) => (
                <div 
                  key={app.id} 
                  className="glass-panel" 
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid hsl(var(--border-color))',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: 'rgba(25, 31, 46, 0.4)'
                  }}
                  onClick={() => setSelectedApp(app)}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'hsl(var(--accent-primary) / 0.5)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'hsl(var(--border-color))'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{app.jobTitle}</h4>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>
                      <span style={{ fontWeight: 600, color: 'hsl(var(--text-primary))' }}>{app.companyName}</span>
                      <span>&bull;</span>
                      <span>Source: {app.source}</span>
                      <span>&bull;</span>
                      <span>{new Date(app.applicationDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                    <ChevronRight size={18} style={{ color: 'hsl(var(--text-muted))' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: 'rgba(10,12,18,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} style={{ color: 'hsl(var(--accent-primary))' }} />
              Add Job Application
            </h3>

            {formError && (
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
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="company">Company Name *</label>
                  <input
                    id="company"
                    type="text"
                    required
                    placeholder="e.g. Google"
                    className="form-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="title">Job Title *</label>
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    className="form-input"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    disabled={formLoading}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="source">Source *</label>
                  <select
                    id="source"
                    className="form-input"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    disabled={formLoading}
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Bdjobs">Bdjobs</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Wellfound">Wellfound</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="status">Status *</label>
                  <select
                    id="status"
                    className="form-input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={formLoading}
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Offer">Offer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="date">Application Date *</label>
                  <input
                    id="date"
                    type="date"
                    required
                    className="form-input"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="url">Job Post URL</label>
                  <input
                    id="url"
                    type="url"
                    placeholder="https://example.com/job"
                    className="form-input"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    disabled={formLoading}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label" htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  placeholder="Paste description or write personal notes..."
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {formLoading ? (
                    <>
                      <Loader2 size={16} className="animate-pulse" style={{ animation: 'spin 1s linear infinite' }} />
                      Saving...
                    </>
                  ) : (
                    'Save Record'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: 'rgba(10,12,18,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel w-full max-w-lg p-8"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className={`badge ${getStatusBadgeClass(selectedApp.status)}`} style={{ marginBottom: '12px' }}>
                  {selectedApp.status}
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{selectedApp.jobTitle}</h3>
                <h4 style={{ color: 'hsl(var(--accent-primary))', fontSize: '1.1rem', fontWeight: 600 }}>{selectedApp.companyName}</h4>
              </div>
            </div>

            {/* Info list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '24px 0', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                <Clock size={16} style={{ color: 'hsl(var(--text-muted))' }} />
                <span style={{ color: 'hsl(var(--text-secondary))' }}>Applied on:</span>
                <strong style={{ marginLeft: 'auto' }}>{new Date(selectedApp.applicationDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                <MapPin size={16} style={{ color: 'hsl(var(--text-muted))' }} />
                <span style={{ color: 'hsl(var(--text-secondary))' }}>Source:</span>
                <strong style={{ marginLeft: 'auto' }}>{selectedApp.source}</strong>
              </div>

              {selectedApp.jobUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                  <ExternalLink size={16} style={{ color: 'hsl(var(--text-muted))' }} />
                  <span style={{ color: 'hsl(var(--text-secondary))' }}>Job Link:</span>
                  <a 
                    href={selectedApp.jobUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                  >
                    Visit Job Post
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', marginBottom: '8px', fontWeight: 600 }}>
                <FileText size={16} />
                <span>Notes:</span>
              </div>
              <div style={{
                background: 'hsl(var(--bg-tertiary) / 0.4)',
                border: '1px solid hsl(var(--border-color))',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                color: selectedApp.notes ? 'hsl(var(--text-primary))' : 'hsl(var(--text-muted))',
                whiteSpace: 'pre-wrap',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {selectedApp.notes || 'No description notes provided.'}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedApp(null)} 
                className="btn btn-secondary"
              >
                Close View
              </button>
              <button 
                onClick={() => {
                  setSelectedApp(null);
                  navigate('/applications');
                }} 
                className="btn btn-primary"
              >
                Edit details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
