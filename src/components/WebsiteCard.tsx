'use client';

import { useState } from 'react';
import VoteButton from './VoteButton';

interface Website {
  id: string;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  voteCount: number;
  hasVoted: boolean;
}

const accentColors = [
  { bg: 'bg-accent', hex: '#FFE500' },
  { bg: 'bg-sky', hex: '#00D4FF' },
  { bg: 'bg-mint', hex: '#00FF88' },
  { bg: 'bg-coral', hex: '#FF2D55' },
  { bg: 'bg-primary', hex: '#0052FF' },
  { bg: 'bg-primary-light', hex: '#4d85ff' },
];

export default function WebsiteCard({ website, index = 0 }: { website: Website; index?: number }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      className="bg-surface overflow-hidden neo-hover transition-all"
      style={{ border: '4px solid #0a0a0a', boxShadow: '8px 8px 0 #0a0a0a' }}
    >
      {/* Color accent bar */}
      <div
        className={`h-3 ${accent.bg}`}
        style={{ borderBottom: '4px solid #0a0a0a' }}
      />

      {/* Image Preview (Screenshot API) */}
      <div
        className="relative w-full aspect-video bg-bg-alt overflow-hidden"
        style={{ borderBottom: '4px solid #0a0a0a' }}
      >
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg stripe-bg">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
                  />
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted">Loading...</span>
                </div>
              </div>
            )}
            
            <img 
              src={`https://api.microlink.io?url=${encodeURIComponent(website.url)}&screenshot=true&embed=screenshot.url`}
              alt={`Preview of ${website.title}`}
              className={`w-full h-full object-cover border-0 transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy" 
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-bg stripe-bg">
            <div
              className="w-14 h-14 bg-accent flex items-center justify-center text-2xl"
              style={{ border: '4px solid #0a0a0a', boxShadow: '4px 4px 0 #0a0a0a' }}
            >
              🌐
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-text-muted">
              Preview unavailable
            </p>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black text-primary underline decoration-2 underline-offset-4 uppercase tracking-wider hover:text-primary-dark transition-colors"
            >
              Open in new tab →
            </a>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Index badge + title */}
        <div className="flex items-start gap-3 mb-3">
          <span
            className="text-xs font-black px-2 py-0.5 shrink-0 mt-0.5"
            style={{
              background: accent.hex,
              border: '3px solid #0a0a0a',
              boxShadow: '2px 2px 0 #0a0a0a',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-base font-black text-text uppercase tracking-tight leading-tight">
            {website.title}
          </h3>
        </div>

        <p className="text-sm text-text-muted whitespace-pre-line font-medium mb-5 line-clamp-3 pl-[calc(1.5rem+12px)]">
          {website.description}
        </p>

        <div className="flex items-center justify-between" style={{ paddingTop: '1rem', borderTop: '3px solid #0a0a0a' }}>
          <VoteButton
            websiteId={website.id}
            initialVoted={website.hasVoted}
            initialCount={website.voteCount}
          />

          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-text-muted hover:text-primary transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit
          </a>
        </div>
      </div>
    </div>
  );
}