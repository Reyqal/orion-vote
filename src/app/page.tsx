'use client';

import { useState, useEffect } from 'react';
import WebsiteCard from '@/components/WebsiteCard';

interface Website {
  id: string;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  voteCount: number;
  hasVoted: boolean;
}

export default function HomePage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const res = await fetch('/api/websites');
        const data = await res.json();
        setWebsites(data);
      } catch {
        console.error('Failed to fetch websites');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  return (
    <div className="relative">
      {/* Dot pattern background */}
      <div className="fixed inset-0 dot-bg pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-mint text-text text-xs font-bold mb-6 uppercase tracking-wider"
            style={{ border: '2px solid #2d3436', boxShadow: '3px 3px 0 #2d3436' }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-border animate-pulse" />
            Live Voting
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
            Vote for Your{' '}
            <span
              className="inline-block px-3 py-1 bg-accent rounded-lg -rotate-1"
              style={{ border: '3px solid #2d3436', boxShadow: '4px 4px 0 #2d3436' }}
            >
              Favorite
            </span>
            <br />Websites
          </h1>
          <p className="text-lg text-text-muted font-medium max-w-xl mx-auto">
            Preview deployed websites directly in your browser and vote for the ones you love.
            <span className="inline-block ml-1 font-bold text-text">One account = one vote.</span>
          </p>
        </div>
      </section>

      {/* Website Grid */}
      <section className="relative px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="neo-box rounded-xl overflow-hidden animate-pulse">
                  <div className="h-2 bg-sky" />
                  <div className="aspect-video bg-bg" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-bg rounded-lg w-3/4" />
                    <div className="h-4 bg-bg rounded-lg w-full" />
                    <div className="h-4 bg-bg rounded-lg w-1/2" />
                    <div className="h-10 bg-bg rounded-lg w-28 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : websites.length === 0 ? (
            <div className="text-center py-20">
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-xl bg-accent flex items-center justify-center text-5xl"
                style={{ border: '3px solid #2d3436', boxShadow: '5px 5px 0 #2d3436' }}
              >
                🌐
              </div>
              <h2 className="text-3xl font-black text-text mb-3">No websites yet</h2>
              <p className="text-text-muted font-medium max-w-md mx-auto">
                Websites will appear here once an admin adds them. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map((website, index) => (
                <WebsiteCard key={website.id} website={website} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4" style={{ borderTop: '3px solid #2d3436' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm font-bold text-text-muted">
          <span>Built with ♥ using Next.js & Prisma</span>
          <span>VoteHub © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
