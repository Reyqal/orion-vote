'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-accent border-b-[4px] border-border" style={{ borderBottom: '4px solid #0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 bg-primary flex items-center justify-center text-white font-black text-xl transition-all group-hover:-translate-y-1"
              style={{ border: '4px solid #0a0a0a', boxShadow: '4px 4px 0 #0a0a0a' }}
            >
              ★
            </div>
            <span className="text-xl font-black text-text uppercase tracking-tight hidden sm:block">
              Orion<span className="text-primary">Vote</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/leaderboard"
              className="neo-badge bg-coral text-white hover:-translate-y-0.5 transition-transform"
            >
              🏆 Ranking
            </Link>

            {session?.user?.isAdmin && (
              <Link
                href="/admin"
                className="neo-badge bg-mint text-text hover:-translate-y-0.5 transition-transform"
              >
                ⚙ Admin
              </Link>
            )}

            {status === 'loading' ? (
              <div className="w-9 h-9 bg-bg border-4 border-border animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface transition-all cursor-pointer hover:-translate-y-0.5"
                  style={{ border: '4px solid #0a0a0a', boxShadow: '4px 4px 0 #0a0a0a' }}
                >
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-6 h-6 border-2 border-border"
                    />
                  )}
                  <span className="text-sm font-black uppercase hidden sm:block">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  <span className="text-xs font-black">▼</span>
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-surface py-0"
                    style={{ border: '4px solid #0a0a0a', boxShadow: '6px 6px 0 #0a0a0a' }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: '3px solid #0a0a0a' }}>
                      <p className="text-sm font-black uppercase">{session.user?.name}</p>
                      <p className="text-xs text-text-muted truncate font-bold">{session.user?.email}</p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-3 text-sm font-black uppercase text-coral hover:bg-coral hover:text-white transition-colors cursor-pointer"
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