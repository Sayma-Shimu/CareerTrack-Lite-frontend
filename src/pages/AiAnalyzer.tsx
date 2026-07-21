import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Loader2, AlertCircle, Lightbulb, Code2, BookOpen, Tag, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface AiResult {
  summary: string;
  requiredSkills: string[];
  preparationTopics: string[];
  keywords: string[];
  interviewQuestions: string[];
}

const Section: React.FC<{ icon: React.ReactNode; title: string; items: string[]; color: string }> = ({ icon, title, items, color }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '12px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-primary))' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '1rem' }}>
          <span style={{ color }}>{icon}</span>
          {title}
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <ul style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: 'hsl(var(--text-secondary))' }}>
              <span style={{ color, marginTop: '2px', flexShrink: 0 }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const AiAnalyzer: React.FC = () => {
  const { token } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      setError('Please paste a job description (at least 30 characters).');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ jobDescription })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in page-container">

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, hsl(var(--accent-primary)), hsl(var(--accent-secondary)))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--glow-shadow)'
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>AI Job Analyzer</h1>
        </div>
        <p style={{ color: 'hsl(var(--text-secondary))', maxWidth: '600px' }}>
          Paste a job description and get an instant AI-powered breakdown — summary, required skills, preparation topics, keywords and interview questions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>

        {/* Input Panel */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '10px' }}>
            Paste Job Description
          </label>
          <textarea
            className="form-input"
            placeholder="e.g. We are looking for a React developer with 2+ years of experience in TypeScript, REST APIs..."
            style={{ width: '100%', minHeight: '260px', resize: 'vertical', fontSize: '0.9rem', lineHeight: 1.6 }}
            value={jobDescription}
            onChange={(e) => { setJobDescription(e.target.value); setError(null); }}
            disabled={loading}
          />

          {error && (
            <div className="alert alert-danger" style={{ marginTop: '14px' }}>
              <AlertCircle size={16} /><span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '16px', height: '48px', fontSize: '0.95rem' }}
            disabled={loading || jobDescription.trim().length < 30}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>
            ) : (
              <><Sparkles size={18} /> Analyze with AI</>
            )}
          </button>

          <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))', marginTop: '10px', textAlign: 'center' }}>
            Powered by Google Gemini · Results are AI-generated and may vary
          </p>
        </div>

        {/* Results Panel */}
        {result && (
          <div className="animate-fade-in">

            {/* Summary */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '12px', borderLeft: '4px solid hsl(var(--accent-primary))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '10px', color: 'hsl(var(--accent-primary))' }}>
                <Lightbulb size={18} /> Summary
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.7, color: 'hsl(var(--text-secondary))' }}>{result.summary}</p>
            </div>

            <Section icon={<Code2 size={16} />} title="Required Skills" items={result.requiredSkills} color="hsl(var(--color-info))" />
            <Section icon={<BookOpen size={16} />} title="Preparation Topics" items={result.preparationTopics} color="hsl(var(--color-warning))" />
            <Section icon={<Tag size={16} />} title="Keywords" items={result.keywords} color="hsl(var(--color-success))" />
            <Section icon={<MessageSquare size={16} />} title="Possible Interview Questions" items={result.interviewQuestions} color="hsl(var(--accent-secondary))" />
          </div>
        )}
      </div>
    </div>
  );
};
