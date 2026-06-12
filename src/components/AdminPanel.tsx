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

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editLoading, setEditLoading] = useState(false);

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

  const startEdit = (site: Website) => {
    setEditingId(site.id);
    setEditTitle(site.title);
    setEditDescription(site.description);
    setEditUrl(site.url);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditUrl('');
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setEditLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/websites/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription, url: editUrl }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '✓ Website updated successfully!' });
        cancelEdit();
        fetchWebsites();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update website' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ─── ADD WEBSITE ─── */}
      <div
        className="bg-surface p-6"
        style={{ border: '4px solid #0a0a0a', boxShadow: '8px 8px 0 #0a0a0a' }}
      >
        <h2 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
          <span
            className="w-8 h-8 bg-mint flex items-center justify-center text-text text-sm font-black"
            style={{ border: '3px solid #0a0a0a', boxShadow: '2px 2px 0 #0a0a0a' }}
          >
            +
          </span>
          Add New Website
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 text-sm font-black uppercase tracking-wide ${
              message.type === 'success'
                ? 'bg-mint text-text'
                : 'bg-coral text-white'
            }`}
            style={{ border: '3px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-text mb-1.5 uppercase tracking-widest">Title</label>
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
            <label className="block text-xs font-black text-text mb-1.5 uppercase tracking-widest">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="A brief description..."
              className="neo-input resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-text mb-1.5 uppercase tracking-widest">Deployed URL</label>
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

      {/* ─── EDIT MODAL ─── */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div
            className="bg-surface w-full max-w-lg p-6 relative"
            style={{ border: '4px solid #0a0a0a', boxShadow: '8px 8px 0 #0a0a0a' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <span
                  className="w-8 h-8 bg-sky flex items-center justify-center text-text text-sm font-black"
                  style={{ border: '3px solid #0a0a0a', boxShadow: '2px 2px 0 #0a0a0a' }}
                >
                  ✎
                </span>
                Edit Website
              </h2>
              <button
                onClick={cancelEdit}
                className="w-8 h-8 flex items-center justify-center font-black text-text hover:bg-coral hover:text-white transition-colors cursor-pointer"
                style={{ border: '3px solid #0a0a0a' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-text mb-1.5 uppercase tracking-widest">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="neo-input"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-text mb-1.5 uppercase tracking-widest">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  rows={3}
                  className="neo-input resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-text mb-1.5 uppercase tracking-widest">Deployed URL</label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  required
                  className="neo-input"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="btn-neo flex-1 text-center disabled:opacity-50 cursor-pointer"
                >
                  {editLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    '✓ Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-neo-accent cursor-pointer"
                  style={{ background: '#b2bec3' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MANAGE WEBSITES ─── */}
      <div
        className="bg-surface p-6"
        style={{ border: '4px solid #0a0a0a', boxShadow: '8px 8px 0 #0a0a0a' }}
      >
        <h2 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-3">
          <span
            className="w-8 h-8 bg-accent flex items-center justify-center text-text text-sm font-black"
            style={{ border: '3px solid #0a0a0a', boxShadow: '2px 2px 0 #0a0a0a' }}
          >
            ☰
          </span>
          Manage Websites
          <span
            className="neo-badge bg-sky text-text ml-1"
          >
            {websites.length}
          </span>
        </h2>

        {websites.length === 0 ? (
          <div className="text-center py-10 bg-bg stripe-bg" style={{ border: '3px solid #0a0a0a' }}>
            <p className="text-text-muted font-black uppercase text-sm">No websites added yet.</p>
            <p className="text-text-muted text-xs mt-1 font-bold">Use the form above to add one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {websites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between p-4 bg-bg hover:bg-accent/20 transition-colors"
                style={{ border: '3px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-black text-text truncate uppercase text-sm tracking-tight">{site.title}</h3>
                  <p className="text-xs text-text-muted truncate font-bold">{site.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="neo-badge bg-accent text-text"
                  >
                    {site.voteCount} vote{site.voteCount !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => startEdit(site)}
                    className="p-2 font-black text-text-muted hover:text-white hover:bg-sky transition-all cursor-pointer"
                    style={{ border: '3px solid #0a0a0a' }}
                    title="Edit website"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(site.id)}
                    className="p-2 font-black text-text-muted hover:text-white hover:bg-coral transition-all cursor-pointer"
                    style={{ border: '3px solid #0a0a0a' }}
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