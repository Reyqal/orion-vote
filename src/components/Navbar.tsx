'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-accent border-b-3 border-border" style={{ borderBottom: '3px solid #2d3436' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary border-3 border-border flex items-center justify-center text-white font-black text-xl shadow-[3px_3px_0_#2d3436] group-hover:shadow-[5px_5px_0_#2d3436] group-hover:-translate-y-0.5 transition-all" style={{ border: '3px solid #2d3436' }}>
              ★
            </div>
            <span className="text-xl font-black text-text hidden sm:block tracking-tight">
              VoteHub
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {session?.user?.isAdmin && (
              <Link
                href="/admin"
                className="neo-badge bg-mint text-text">
                ⚙ Admin
              </Link>
            )}

            {status === 'loading' ? (
              <div className="w-9 h-9 rounded-lg bg-bg border-2 border-border animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border-2 border-border shadow-[3px_3px_0_#2d3436] hover:shadow-[4px_4px_0_#2d3436] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-7 h-7 rounded-md border-2 border-border"
                    />
                  )}
                  <span className="text-sm font-bold hidden sm:block">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-lg neo-box py-1">
                    <div className="px-4 py-3 border-b-2 border-border">
                      <p className="text-sm font-bold">{session.user?.name}</p>
                      <p className="text-xs text-text-muted truncate">{session.user?.email}</p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-danger hover:bg-coral-light/30 transition-colors cursor-pointer"
                    >
                      ✕ Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="btn-neo-accent flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
