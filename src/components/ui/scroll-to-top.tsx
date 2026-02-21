'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export function ScrollToTop({ threshold = 400, className }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  const checkScrollPosition = useCallback(() => {
    setIsVisible(window.scrollY > threshold);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    if (window.scrollY < 100) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    return () => window.removeEventListener('scroll', checkScrollPosition);
  }, [checkScrollPosition]);

  return (
    <button
      onClick={scrollToTop}
      aria-label="العودة للأعلى"
      title="العودة للأعلى"
      className={cn(
        'fixed z-50 flex items-center justify-center',
        'w-12 h-12',
        'bg-steel-800 text-white',
        'shadow-lg border border-steel-700',
        'bottom-6 ltr:right-6 rtl:left-6',
        'transition-all duration-300 ease-out',
        'hover:bg-primary hover:text-primary-foreground hover:border-primary',
        'hover:shadow-gold-glow hover:scale-105',
        'active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none',
        className
      )}
    >
      <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
}
