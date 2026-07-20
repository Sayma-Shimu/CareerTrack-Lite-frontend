import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  FileText
} from 'lucide-react';

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

export const Applications: React.FC = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL query params
  const statusParam = searchParams.get('status') || '';
  
  // State
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(statusParam);
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);

  // Form State
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [source, setSource] = useState('LinkedIn');
  const [status, setStatus] = useState('Saved');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Update status state when query param changes
  useEffect(() => {
    setStatusFilter(statusParam);
  }, [statusParam]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (statusFilter) queryParams.append('status', statusFilter);
      if (sourceFilter) queryParams.append('source', sourceFilter);
      queryParams.append('sort', sortBy);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/applications?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load applications');
      }

      setApplications(data.applications);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [token, searchQuery, statusFilter, sourceFilter, sortBy]);

  // Open add modal
  const openAddModal = () => {
    setFormError(null);
    setCompanyName('');
    setJobTitle('');
    setJobUrl('');
    setSource('LinkedIn');
    setStatus('Saved');
    setApplicationDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (app: Application) => {
    setFormError(null);
    setCompanyName(app.companyName);
    setJobTitle(app.jobTitle);
    setJobUrl(app.jobUrl || '');
    setSource(app.source);
    setStatus(app.status);
    setApplicationDate(new Date(app.applicationDate).toISOString().split('T')[0]);
    setNotes(app.notes || '');
    setEditingApp(app);
  };

  // Submit Add
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

      setIsAddModalOpen(false);
      fetchApplications();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingApp) return;

    if (!companyName.trim() || !jobTitle.trim() || !source) {
      setFormError('Company name, job title, and source are required');
      return;
    }

    setFormLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/applications/${editingApp.id}`, {
        method: 'PATCH',
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
        throw new Error(data.error || 'Failed to update application');
      }

      setEditingApp(null);
      fetchApplications();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Action
  const handleDelete = async () => {
    if (!deletingApp) return;

    setFormLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/applications/${deletingApp.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete application');
      }

      setDeletingApp(null);
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Error occurred while deleting application');
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

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Applications</h1>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>
            Manage, filter, and track all your active and archived job applications.
          </p>
        </div>
        <button 
          onClick={openAddModal} 
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <Plus size={18} />
          Add Application
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel" style={{
        padding: '20px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '32px',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ flex: '1', minWidth: '260px', position: 'relative' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'hsl(var(--text-muted))'
          }} />
          <input
            type="text"
            placeholder="Search by company or job title..."
            className="form-input"
            style={{ paddingLeft: '44px', width: '100%' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters and Sorting */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: 'auto' }}>
          
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: 'hsl(var(--text-muted))' }} />
            <select
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setSearchParams({ status: e.target.value });
              }}
            >
              <option value="">All Statuses</option>
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>
          </div>

          {/* Source Filter */}
          <select
            className="form-input"
            style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Bdjobs">Bdjobs</option>
            <option value="Indeed">Indeed</option>
            <option value="Wellfound">Wellfound</option>
            <option value="Facebook">Facebook</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} style={{ color: 'hsl(var(--text-muted))' }} />
            <select
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', flexDirection: 'column', gap: '16px' }}>
          <Loader2 className="animate-pulse" size={32} style={{ color: 'hsl(var(--accent-primary))', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'hsl(var(--text-secondary))' }}>Loading applications list...</p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', border: '1px solid hsl(var(--color-danger) / 0.3)' }}>
          <AlertCircle size={40} style={{ color: 'hsl(var(--color-danger))', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Failed to load applications</h3>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>{error}</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '80px 40px', textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>
          <Briefcase size={48} style={{ color: 'hsl(var(--text-muted))', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No records found</h3>
          <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
            Try tweaking your search terms, changing the filters, or add a new job record to get started.
          </p>
          <button onClick={openAddModal} className="btn btn-primary">Add Application</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px'
        }}>
          {applications.map((app) => (
            <div 
              key={app.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                minHeight: '200px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'hsl(var(--accent-primary) / 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'hsl(var(--border-color))'}
            >
              <div>
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>{app.jobTitle}</h3>
                    <h4 style={{ color: 'hsl(var(--accent-primary))', fontSize: '0.95rem', fontWeight: 600 }}>{app.companyName}</h4>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} style={{ color: 'hsl(var(--text-muted))' }} />
                    <span>Source: {app.source}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} style={{ color: 'hsl(var(--text-muted))' }} />
                    <span>Applied: {new Date(app.applicationDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                borderTop: '1px solid hsl(var(--border-color))', 
                paddingTop: '16px',
                marginTop: 'auto',
                justifyContent: 'flex-end'
              }}>
                <button 
                  onClick={() => setViewingApp(app)} 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="View Details"
                >
                  <Eye size={14} />
                  View
                </button>
                <button 
                  onClick={() => openEditModal(app)} 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Edit"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button 
                  onClick={() => setDeletingApp(app)} 
                  className="btn btn-danger" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 12, 18, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px',
            width: '100%',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
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
                  <label className="form-label" htmlFor="add-company">Company Name *</label>
                  <input
                    id="add-company"
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
                  <label className="form-label" htmlFor="add-title">Job Title *</label>
                  <input
                    id="add-title"
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
                  <label className="form-label" htmlFor="add-source">Source *</label>
                  <select
                    id="add-source"
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
                  <label className="form-label" htmlFor="add-status">Status *</label>
                  <select
                    id="add-status"
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
                  <label className="form-label" htmlFor="add-date">Application Date *</label>
                  <input
                    id="add-date"
                    type="date"
                    required
                    className="form-input"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="add-url">Job Post URL</label>
                  <input
                    id="add-url"
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
                <label className="form-label" htmlFor="add-notes">Notes</label>
                <textarea
                  id="add-notes"
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

      {/* Edit Application Modal */}
      {editingApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 12, 18, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px',
            width: '100%',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit2 size={20} style={{ color: 'hsl(var(--accent-primary))' }} />
              Edit Job Application
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

            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-company">Company Name *</label>
                  <input
                    id="edit-company"
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
                  <label className="form-label" htmlFor="edit-title">Job Title *</label>
                  <input
                    id="edit-title"
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
                  <label className="form-label" htmlFor="edit-source">Source *</label>
                  <select
                    id="edit-source"
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
                  <label className="form-label" htmlFor="edit-status">Status *</label>
                  <select
                    id="edit-status"
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
                  <label className="form-label" htmlFor="edit-date">Application Date *</label>
                  <input
                    id="edit-date"
                    type="date"
                    required
                    className="form-input"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-url">Job Post URL</label>
                  <input
                    id="edit-url"
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
                <label className="form-label" htmlFor="edit-notes">Notes</label>
                <textarea
                  id="edit-notes"
                  placeholder="Notes..."
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
                  onClick={() => setEditingApp(null)}
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
                      Updating...
                    </>
                  ) : (
                    'Update Record'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {viewingApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 12, 18, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '550px',
            width: '100%',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className={`badge ${getStatusBadgeClass(viewingApp.status)}`} style={{ marginBottom: '12px' }}>
                  {viewingApp.status}
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{viewingApp.jobTitle}</h3>
                <h4 style={{ color: 'hsl(var(--accent-primary))', fontSize: '1.1rem', fontWeight: 600 }}>{viewingApp.companyName}</h4>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '24px 0', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                <Clock size={16} style={{ color: 'hsl(var(--text-muted))' }} />
                <span style={{ color: 'hsl(var(--text-secondary))' }}>Applied on:</span>
                <strong style={{ marginLeft: 'auto' }}>{new Date(viewingApp.applicationDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                <MapPin size={16} style={{ color: 'hsl(var(--text-muted))' }} />
                <span style={{ color: 'hsl(var(--text-secondary))' }}>Source:</span>
                <strong style={{ marginLeft: 'auto' }}>{viewingApp.source}</strong>
              </div>

              {viewingApp.jobUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                  <ExternalLink size={16} style={{ color: 'hsl(var(--text-muted))' }} />
                  <span style={{ color: 'hsl(var(--text-secondary))' }}>Job Link:</span>
                  <a 
                    href={viewingApp.jobUrl} 
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
                color: viewingApp.notes ? 'hsl(var(--text-primary))' : 'hsl(var(--text-muted))',
                whiteSpace: 'pre-wrap',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {viewingApp.notes || 'No description notes provided.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setViewingApp(null)} className="btn btn-secondary">Close</button>
              <button 
                onClick={() => {
                  const targetApp = viewingApp;
                  setViewingApp(null);
                  openEditModal(targetApp);
                }} 
                className="btn btn-primary"
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 12, 18, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '450px',
            width: '100%',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            textAlign: 'center'
          }} onClick={(e) => e.stopPropagation()}>
            <Trash2 size={48} style={{ color: 'hsl(var(--color-danger))', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Delete Application?</h3>
            <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '24px', fontSize: '0.95rem' }}>
              Are you sure you want to delete your application for <strong style={{ color: 'hsl(var(--text-primary))' }}>{deletingApp.jobTitle}</strong> at <strong style={{ color: 'hsl(var(--text-primary))' }}>{deletingApp.companyName}</strong>? This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setDeletingApp(null)} 
                className="btn btn-secondary"
                disabled={formLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="btn btn-danger"
                disabled={formLoading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                {formLoading ? (
                  <>
                    <Loader2 size={16} className="animate-pulse" style={{ animation: 'spin 1s linear infinite' }} />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
