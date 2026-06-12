'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div
          className="w-20 h-20 bg-coral flex items-center justify-center text-4xl"
          style={{ border: '4px solid #0a0a0a', boxShadow: '6px 6px 0 #0a0a0a' }}
        >
          🔒
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight">Access Denied</h1>
        <p className="text-text-muted font-bold">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div
          className="inline-block bg-primary text-white text-xs font-black uppercase tracking-widest px-3 py-1 mb-4"
          style={{ border: '3px solid #0a0a0a', boxShadow: '3px 3px 0 #0a0a0a' }}
        >
          Admin Dashboard
        </div>
        <h1 className="text-5xl font-black text-text uppercase tracking-tight leading-none">
          Manage<br />Websites
        </h1>
        <div className="mt-4 h-[4px] bg-border" />
      </div>
      <AdminPanel />
    </div>
  );
}