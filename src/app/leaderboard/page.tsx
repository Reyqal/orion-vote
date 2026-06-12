'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Website {
  id: string;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  voteCount: number;
  hasVoted: boolean;
}

export default function LeaderboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const res = await fetch('/api/websites');
        const data = await res.json();
        const list = data.websites || data.data || data;
        // Urutkan berdasarkan voteCount terbanyak
        setWebsites([...list].sort((a: Website, b: Website) => b.voteCount - a.voteCount));
      } catch {
        console.error('Gagal mengambil data website');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  const totalVotes = websites.reduce((sum, w) => sum + w.voteCount, 0);

  return (
    <div className="relative min-h-screen">
      {/* Dot pattern background */}
      <div className="fixed inset-0 dot-bg pointer-events-none" />

      {/* ─── MARQUEE TICKER ─── */}
      <div
        className="relative overflow-hidden bg-primary"
        style={{ borderBottom: '4px solid #0a0a0a' }}
      >
        <div
          className="flex whitespace-nowrap text-white font-black text-sm uppercase tracking-widest py-2"
          style={{ animation: 'marquee 18s linear infinite' }}
        >
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="mr-8">
              ★ PROGRAMMING TADULAKO &nbsp;&nbsp;
              ★ BATCH ORION &nbsp;&nbsp;
              ★ 2026 &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ─── HEADER ─── */}
      <section className="relative px-4 sm:px-6 md:px-12 lg:px-16 pt-10 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1 bg-mint text-text text-xs font-black mb-5 uppercase tracking-widest transition-all hover:-translate-y-0.5"
            style={{ border: '3px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}
          >
            <span className="w-2 h-2 bg-text rounded-full animate-pulse" />
            ← Kembali ke Voting
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="flex flex-wrap items-center gap-2 sm:gap-3 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.1] sm:leading-[0.92]">
                <span>🏆</span>
                <span
                  className="inline-block bg-accent px-2 -skew-x-2"
                  style={{ border: '4px solid #0a0a0a', boxShadow: '6px 6px 0 #0a0a0a' }}
                >
                  Papan Peringkat
                </span>
              </h1>
              <p className="text-sm font-bold text-text-muted mt-4">
                Berdasarkan total suara. Diperbarui secara real-time.
              </p>
            </div>

            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto mt-4 lg:mt-0">
              <div
                className="flex-1 sm:flex-none bg-primary text-white p-4 sm:p-6 text-center sm:min-w-[130px] lg:min-w-[140px]"
                style={{ border: '4px solid #0a0a0a', boxShadow: '6px 6px 0 #0a0a0a' }}
              >
                <div className="text-4xl sm:text-5xl font-black">{websites.length}</div>
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1">
                  Website Aktif
                </div>
              </div>
              <div
                className="flex-1 sm:flex-none bg-coral text-white p-4 sm:p-6 text-center sm:min-w-[130px] lg:min-w-[140px]"
                style={{ border: '4px solid #0a0a0a', boxShadow: '6px 6px 0 #0a0a0a' }}
              >
                <div className="text-4xl sm:text-5xl font-black">{totalVotes}</div>
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1">
                  Total Suara
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 h-[4px] bg-border" />
        </div>
      </section>

      {/* ─── LEADERBOARD TABLE ─── */}
      <section className="relative px-4 sm:px-6 md:px-12 lg:px-16 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div
              className="bg-surface overflow-hidden"
              style={{ border: '4px solid #0a0a0a', boxShadow: '8px 8px 0 #0a0a0a' }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-4 sm:px-5 py-5 animate-pulse"
                  style={{ borderBottom: '3px solid #0a0a0a' }}
                >
                  <div className="w-10 h-10 bg-bg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-bg w-1/2" />
                    <div className="h-3 bg-bg w-3/4" />
                  </div>
                  <div className="w-16 h-7 bg-bg" />
                </div>
              ))}
            </div>
          ) : websites.length === 0 ? (
            <div
              className="text-center py-20 bg-surface"
              style={{ border: '4px solid #0a0a0a', boxShadow: '8px 8px 0 #0a0a0a' }}
            >
              <div
                className="w-20 h-20 mx-auto mb-4 bg-accent flex items-center justify-center text-4xl"
                style={{ border: '4px solid #0a0a0a', boxShadow: '5px 5px 0 #0a0a0a' }}
              >
                🏆
              </div>
              <h2 className="text-2xl font-black uppercase mb-2">Belum Ada Peringkat</h2>
              <p className="text-text-muted font-bold text-sm">
                Karya peserta akan muncul di sini setelah mendapatkan suara.
              </p>
            </div>
          ) : (
            <div
              className="bg-surface overflow-hidden"
              style={{ border: '4px solid #0a0a0a', boxShadow: '8px 8px 0 #0a0a0a' }}
            >
              {/* ── Desktop Table Header (hidden on mobile) ── */}
              <div
                className="hidden sm:grid grid-cols-[60px_1fr_100px] gap-4 px-5 py-3 bg-text text-bg text-xs font-black uppercase tracking-widest"
                style={{ borderBottom: '4px solid #0a0a0a' }}
              >
                <span>Peringkat</span>
                <span>Website</span>
                <span className="text-center">Suara</span>
              </div>

              {/* ── Mobile Header (hidden on desktop) ── */}
              <div
                className="sm:hidden px-4 py-3 bg-text text-bg text-xs font-black uppercase tracking-widest"
                style={{ borderBottom: '4px solid #0a0a0a' }}
              >
                🏆 Peringkat
              </div>

              {/* ── Rows ── */}
              {websites.map((site, idx) => {
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
                const rowBg = idx % 2 === 0 ? 'bg-surface' : 'bg-bg';
                const isTop3 = idx < 3;

                return (
                  <div
                    key={site.id}
                    style={{ borderBottom: '3px solid #0a0a0a' }}
                    className={rowBg}
                  >
                    {/* ── Desktop Row ── */}
                    <div
                      className={`hidden sm:grid grid-cols-[60px_1fr_100px] gap-4 px-5 py-4 items-center hover:bg-accent/20 transition-colors`}
                    >
                      {/* Rank */}
                      <div>
                        {medal ? (
                          <span className="text-3xl">{medal}</span>
                        ) : (
                          <span
                            className="w-9 h-9 flex items-center justify-center bg-bg text-text text-sm font-black"
                            style={{ border: '3px solid #0a0a0a' }}
                          >
                            {idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Website Info */}
                      <div className="min-w-0">
                        <h3 className="font-black text-text truncate text-sm uppercase tracking-tight">
                          {site.title}
                        </h3>
                      </div>

                      {/* Vote Count */}
                      <div className="text-center">
                        <span className="inline-block neo-badge bg-accent text-text">
                          {site.voteCount} suara
                        </span>
                      </div>
                    </div>

                    {/* ── Mobile Row (card-style) ── */}
                    <div className="sm:hidden p-4 hover:bg-accent/20 transition-colors">
                      <div className="flex items-start gap-3">
                        {/* Rank */}
                        <div className="shrink-0 pt-0.5">
                          {medal ? (
                            <span className="text-2xl">{medal}</span>
                          ) : (
                            <span
                              className="w-8 h-8 flex items-center justify-center bg-bg text-text text-xs font-black"
                              style={{ border: '3px solid #0a0a0a' }}
                            >
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className={`font-black text-text truncate text-sm uppercase tracking-tight ${isTop3 ? 'text-base' : ''}`}>
                              {site.title}
                            </h3>
                            <span className="neo-badge bg-accent text-text shrink-0 text-[10px]">
                              {site.voteCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="relative py-6 px-4 sm:px-6 md:px-12 lg:px-16 bg-text"
        style={{ borderTop: '4px solid #0a0a0a' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm font-black text-bg/70 uppercase tracking-widest">
          <span>@programming.tadulako</span>
          <span>OrionVote © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}