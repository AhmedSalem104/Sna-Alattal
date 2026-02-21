'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { type ReactNode, useEffect } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps page content with a subtle fade + rise entrance animation.
 * Scrolls to top on every route change.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // Scroll to top instantly on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
