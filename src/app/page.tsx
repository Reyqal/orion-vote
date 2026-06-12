'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
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

// Supabase client khusus untuk realtime (pakai anon key, aman di frontend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWebsites = useCallback(async () => {
    try {
      const res = await fetch('/api/websites');
      const data = await res.json();
      setWebsites(data.websites || data.data || data);
    } catch {
      console.error('Gagal mengambil data website');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch data awal
    fetchWebsites();

    // Subscribe ke perubahan tabel Vote di Supabase Realtime
    const channel = supabase
      .channel('realtime-votes')
      .on(
        'postgres_changes',
        {
          event: '*',       // listen INSERT dan DELETE (vote & unvote)
          schema: 'public',
          table: 'Vote',
        },
        () => {
          // Setiap ada perubahan vote, refetch data terbaru
          fetchWebsites();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime terhubung');
        }
      });

    // Cleanup saat komponen unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchWebsites]);

  // Callback untuk update vote count secara optimistic (tanpa tunggu refetch)
  const handleVoteChange = useCallback((websiteId: string, voted: boolean, count: number) => {
    setWebsites((prev) =>
      prev.map((w) =>
        w.id === websiteId ? { ...w, voteCount: count, hasVoted: voted } : w
      )
    );
  }, []);

  const totalVotes = websites.reduce((sum, w) => sum + (w.voteCount || 0), 0);

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

      {/* ─── HERO ─── */}
      <section className="relative px-6 md:px-12 lg:px-16 pt-14 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 bg-mint text-text text-xs font-black mb-5 uppercase tracking-widest"
                style={{ border: '3px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}
              >
                <span className="w-2 h-2 bg-text rounded-full animate-pulse" />
                Voting Langsung
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] uppercase mb-6">
                Dukung<br />
                <span
                  className="inline-block bg-accent px-2 -skew-x-2 relative"
                  style={{ border: '4px solid #0a0a0a', boxShadow: '6px 6px 0 #0a0a0a' }}
                >
                  WEBSITE
                </span>
                <br />
                <span className="inline-block mt-4 sm:mt-5">
                  Favoritmu
                </span>
              </h1>

              <p className="text-base font-bold text-text-muted max-w-lg leading-relaxed">
                Lihat pratinjau karya website peserta langsung dari browser-mu.<br />
                <strong className="text-text">Satu akun = satu suara.</strong> Gunakan suaramu dengan bijak.
              </p>
            </div>

            {/* Stats Box */}
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
                <div className="text-4xl sm:text-5xl font-black transition-all duration-300">
                  {totalVotes}
                </div>
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1">
                  Total Suara
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal rule */}
          <div className="mt-10 h-[4px] bg-border" />
        </div>
      </section>

      {/* ─── WEBSITE GRID ─── */}
      <section className="relative px-6 md:px-12 lg:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-8">
            <span
              className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-text text-bg"
              style={{ border: '3px solid #0a0a0a' }}
            >
              Karya Peserta
            </span>
            <div className="flex-1 h-[3px] bg-border" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-surface animate-pulse"
                  style={{ border: '4px solid #0a0a0a', boxShadow: '8px 8px 0 #0a0a0a' }}
                >
                  <div className="h-2 bg-accent" style={{ borderBottom: '4px solid #0a0a0a' }} />
                  <div className="aspect-video bg-bg-alt" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-bg rounded-none w-3/4" />
                    <div className="h-4 bg-bg rounded-none w-full" />
                    <div className="h-10 bg-accent/30 w-28 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : websites.length === 0 ? (
            <div
              className="text-center py-20 bg-surface"
              style={{ border: '4px solid #0a0a0a', boxShadow: '8px 8px 0 #0a0a0a' }}
            >
              <div
                className="w-24 h-24 mx-auto mb-6 bg-accent flex items-center justify-center text-5xl"
                style={{ border: '4px solid #0a0a0a', boxShadow: '5px 5px 0 #0a0a0a' }}
              >
                🌐
              </div>
              <h2 className="text-3xl font-black text-text mb-3 uppercase">Belum ada website</h2>
              <p className="text-text-muted font-bold max-w-md mx-auto">
                Karya peserta akan muncul di sini setelah admin menambahkannya. Cek lagi nanti ya!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {websites.map((website, index) => (
                <WebsiteCard
                  key={website.id}
                  website={website}
                  index={index}
                  onVoteChange={(voted, count) =>
                    handleVoteChange(website.id, voted, count)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="relative py-6 px-6 md:px-12 lg:px-16 bg-text"
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