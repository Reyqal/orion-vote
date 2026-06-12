'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface VoteButtonProps {
  websiteId: string;
  initialVoted: boolean;
  initialCount: number;
  onVoteChange?: (voted: boolean, count: number) => void;
}

export default function VoteButton({
  websiteId,
  initialVoted,
  initialCount,
  onVoteChange,
}: VoteButtonProps) {
  const { data: session } = useSession();
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleVote = async () => {
    // 1. Cek login
    if (!session) {
      signIn('google');
      return;
    }

    // 2. Cegah spam klik (tapi tombol tidak usah dibuat disable visual)
    if (isProcessing) return;

    // 3. Simpan state lama untuk jaga-jaga kalau error (Rollback)
    const prevVoted = voted;
    const prevCount = count;

    // 4. OPTIMISTIC UPDATE: Berubah secara instan di layar detik itu juga!
    const newVoted = !voted;
    const newCount = newVoted ? count + 1 : count - 1;
    setVoted(newVoted);
    setCount(newCount);
    
    // 5. Nyalakan animasi & kunci proses background
    setAnimate(true);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId }),
      });

      if (res.ok) {
        const data = await res.json();
        // Beri tahu parent component jika ada
        onVoteChange?.(data.voted, data.voteCount);
      } else {
        // ROLLBACK: Kalau server gagal, kembalikan seperti semula
        setVoted(prevVoted);
        setCount(prevCount);
      }
    } catch {
      // ROLLBACK: Kalau internet putus, kembalikan seperti semula
      setVoted(prevVoted);
      setCount(prevCount);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setAnimate(false), 400);
    }
  };

  return (
    <button
      onClick={handleVote}
      // HAPUS efek disable visual di sini agar terasa sangat instan
      className={`${
        voted ? 'btn-neo-voted' : 'btn-neo'
      } flex items-center gap-2 cursor-pointer active:scale-95 transition-transform`}
    >
      <span
        className={`text-lg transition-transform duration-200 ${
          animate ? 'scale-125' : 'scale-100'
        }`}
        style={animate && voted ? { animation: 'wiggle 0.4s ease' } : {}}
      >
        {voted ? '♥' : '♡'}
      </span>
      <span className="uppercase tracking-widest font-black text-sm">
        {voted ? 'Voted!' : 'Vote'}
      </span>
      <span
        className={`inline-flex items-center justify-center min-w-[1.75rem] h-6 px-1.5 text-xs font-black ${
          voted
            ? 'bg-white/30 text-white border-2 border-white/50'
            : 'bg-white/20 text-white border-2 border-white/40'
        }`}
      >
        {count}
      </span>
    </button>
  );
}