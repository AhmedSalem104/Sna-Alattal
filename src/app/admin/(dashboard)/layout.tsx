'use client';

import { SessionProvider } from 'next-auth/react';
import { DashboardShell } from '@/components/admin';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#admin-main-content"
        className="skip-to-main"
      >
        تخطى إلى المحتوى الرئيسي
      </a>
      <DashboardShell>{children}</DashboardShell>
    </SessionProvider>
  );
}
