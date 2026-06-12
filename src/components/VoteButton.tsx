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
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleVote = async () => {
    if (!session) {
      signIn('google');
      return;
    }

    setLoading(true);
    setAnimate(true);

    const newVoted = !voted;
    const newCount = newVoted ? count + 1 : count - 1;
    setVoted(newVoted);
    setCount(newCount);

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId }),
      });

      if (res.ok) {
        const data = await res.json();
        setVoted(data.voted);
        setCount(data.voteCount);
        onVoteChange?.(data.voted, data.voteCount);
      } else {
        setVoted(!newVoted);
        setCount(newVoted ? newCount - 1 : newCount + 1);
      }
    } catch {
      setVoted(!newVoted);
      setCount(newVoted ? newCount - 1 : newCount + 1);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimate(false), 400);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`${
        voted ? 'btn-neo-voted' : 'btn-neo'
      } flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer`}
    >
      <span
        className={`text-lg transition-transform duration-200 ${
          animate ? 'scale-125' : 'scale-100'
        }`}
        style={animate && voted ? { animation: 'wiggle 0.4s ease' } : {}}
      >
        {voted ? '♥' : '♡'}
      </span>
      <span>{voted ? 'Voted!' : 'Vote'}</span>
      <span
        className={`inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 rounded-md text-xs font-black ${
          voted
            ? 'bg-white/30 text-white border-2 border-white/40'
            : 'bg-white/20 text-white border-2 border-white/30'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
