'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { Loader2 } from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPinned, setIsPinned] = useState(true);

  // Load states from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar_collapsed');
    const savedPinned = localStorage.getItem('sidebar_pinned');

    if (savedCollapsed) {
      setIsCollapsed(JSON.parse(savedCollapsed));
    }
    if (savedPinned !== null) {
      setIsPinned(JSON.parse(savedPinned));
    }
  }, []);

  // Toggle sidebar collapsed state
  const toggleSidebar = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', JSON.stringify(newState));
  }, [isCollapsed]);

  // Toggle pin state
  const togglePin = useCallback(() => {
    const newState = !isPinned;
    setIsPinned(newState);
    localStorage.setItem('sidebar_pinned', JSON.stringify(newState));
  }, [isPinned]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-xl">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 h-12 w-12 animate-ping text-primary/20">
              <Loader2 className="h-12 w-12" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">جاري التحميل...</p>
            <p className="text-sm text-gray-500">يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex">
      {/* Main Content - comes first in DOM but flex makes sidebar appear on right in RTL */}
      <div className="flex-1 min-h-screen flex flex-col transition-all duration-400">
        <Header isCollapsed={isCollapsed} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar - Desktop (on the right side for RTL) */}
      <div className="hidden lg:flex">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
          isPinned={isPinned}
          onPinToggle={togglePin}
        />
      </div>
    </div>
  );
}
