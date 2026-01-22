'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Refs for smart hover timing
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load states from localStorage
  useEffect(() => {
    const savedPinned = localStorage.getItem('sidebar_pinned');

    if (savedPinned !== null) {
      const pinned = JSON.parse(savedPinned);
      setIsPinned(pinned);
      // If pinned, start expanded; otherwise start collapsed
      setIsCollapsed(!pinned);
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Smart hover handlers with delays
  const handleMouseEnter = useCallback(() => {
    if (isPinned) return;

    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    setIsHovering(true);

    // Small delay before opening (150ms) - feels responsive but prevents accidental triggers
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(false);
    }, 150);
  }, [isPinned]);

  const handleMouseLeave = useCallback(() => {
    if (isPinned) return;

    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setIsHovering(false);

    // Longer delay before closing (400ms) - gives user time to return
    leaveTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(true);
    }, 400);
  }, [isPinned]);

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
    // If pinning, expand; if unpinning, collapse
    setIsCollapsed(!newState);
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
    <div dir="rtl" className="min-h-screen h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex">
      {/* Sidebar - Desktop (on the right side for RTL) */}
      <div
        className="hidden lg:block sticky top-0 h-screen"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
          isPinned={isPinned}
          onPinToggle={togglePin}
          isHovering={isHovering}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header isCollapsed={isCollapsed} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
