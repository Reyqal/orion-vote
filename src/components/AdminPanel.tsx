'use client';

import { useState, useEffect } from 'react';

interface Website {
  id: string;
  title: string;
  description: string;
  url: string;
  voteCount: number;
  createdAt: string;
}

export default function AdminPanel() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchWebsites = async () => {
    try {
      const res = await fetch('/api/websites');
      const data = await res.json();
      setWebsites(data);
    } catch {
      console.error('Failed to fetch websites');
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, url }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setUrl('');
        setMessage({ type: 'success', text: '✓ Website added successfully!' });
        fetchWebsites();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to add website' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? All votes will be lost.')) return;

    try {
      const res = await fetch(`/api/websites/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchWebsites();
        setMessage({ type: 'success', text: '✓ Website deleted.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Website Form */}
      <div className="neo-box rounded-xl p-6">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center text-white text-sm" style={{ border: '2px solid #2d3436' }}>+</span>
          Add New Website
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-bold ${
              message.type === 'success'
                ? 'bg-mint-light/40 text-text border-2 border-border'
                : 'bg-coral-light/40 text-text border-2 border-border'
            }`}
            style={{ boxShadow: '2px 2px 0 #2d3436' }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-text mb-1.5 uppercase tracking-wide">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="My Awesome Website"
              className="neo-input"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text mb-1.5 uppercase tracking-wide">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="A brief description of the website..."
              className="neo-input resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text mb-1.5 uppercase tracking-wide">Deployed URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.vercel.app"
              className="neo-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-neo w-full text-center disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </span>
            ) : (
              '+ Add Website'
            )}
          </button>
        </form>
      </div>

      {/* Websites List */}
      <div className="neo-box rounded-xl p-6">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-text text-sm" style={{ border: '2px solid #2d3436' }}>☰</span>
          Manage Websites
          <span className="neo-badge bg-sky text-text ml-2">{websites.length}</span>
        </h2>

        {websites.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-text-muted font-bold">No websites added yet.</p>
            <p className="text-text-muted text-sm mt-1">Use the form above to add one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {websites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between p-4 rounded-lg bg-bg border-2 border-border group hover:shadow-[3px_3px_0_#2d3436] transition-all"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-bold text-text truncate">{site.title}</h3>
                  <p className="text-xs text-text-muted truncate font-medium">{site.url}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="neo-badge bg-accent text-text">
                    {site.voteCount} vote{site.voteCount !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => handleDelete(site.id)}
                    className="p-2 rounded-lg font-bold text-text-muted hover:text-danger hover:bg-coral-light/20 border-2 border-transparent hover:border-border transition-all cursor-pointer"
                    title="Delete website"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
