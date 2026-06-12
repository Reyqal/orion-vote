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

const colorVariants = [
  'bg-sky',
  'bg-mint-light',
  'bg-accent',
  'bg-coral-light',
  'bg-pink',
  'bg-primary-light',
];

export default function WebsiteCard({ website, index = 0 }: { website: Website; index?: number }) {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const accentColor = colorVariants[index % colorVariants.length];

  return (
    <div className="neo-box rounded-xl overflow-hidden neo-hover">
      {/* Color accent bar */}
      <div className={`h-2 ${accentColor}`} style={{ borderBottom: '3px solid #2d3436' }} />

      {/* Iframe Preview */}
      <div className="relative w-full aspect-video bg-bg-alt overflow-hidden" style={{ borderBottom: '3px solid #2d3436' }}>
        {!iframeError ? (
          <>
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-bold text-text-muted">Loading preview...</span>
                </div>
              </div>
            )}
            <iframe
              src={website.embedUrl}
              className={`w-full h-full border-0 transition-opacity duration-300 ${
                iframeLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sandbox="allow-scripts allow-same-origin allow-popups"
              loading="lazy"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeError(true)}
              title={website.title}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-bg stripe-bg">
            <div className="w-14 h-14 rounded-lg bg-accent border-3 border-border flex items-center justify-center text-2xl shadow-[3px_3px_0_#2d3436]" style={{ border: '3px solid #2d3436' }}>
              🌐
            </div>
            <p className="text-sm font-bold text-text-muted">
              Preview unavailable
            </p>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-primary underline decoration-3 underline-offset-4 hover:text-primary-dark transition-colors"
            >
              Open in new tab →
            </a>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="text-lg font-black text-text mb-1 tracking-tight">
          {website.title}
        </h3>

        <p className="text-sm text-text-muted font-medium mb-4 line-clamp-2">
          {website.description}
        </p>

        <div className="flex items-center justify-between">
          <VoteButton
            websiteId={website.id}
            initialVoted={website.hasVoted}
            initialCount={website.voteCount}
          />

          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors underline decoration-2 underline-offset-2"
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
