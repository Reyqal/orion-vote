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
          className="w-20 h-20 rounded-xl bg-coral-light flex items-center justify-center text-4xl"
          style={{ border: '3px solid #2d3436', boxShadow: '5px 5px 0 #2d3436' }}
        >
          🔒
        </div>
        <h1 className="text-3xl font-black">Access Denied</h1>
        <p className="text-text-muted font-medium">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="relative mb-8 dot-bg">
        <div className="relative">
          <h1 className="text-4xl font-black text-text mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-text-muted font-medium">Manage participant websites for the voting system.</p>
        </div>
      </div>
      <AdminPanel />
    </div>
  );
}
