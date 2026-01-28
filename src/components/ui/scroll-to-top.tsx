'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  /** Distance in pixels before the button appears */
  threshold?: number;
  /** Custom className for styling */
  className?: string;
}

export function ScrollToTop({ threshold = 400, className }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Check scroll position
  const checkScrollPosition = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    setIsVisible(scrollY > threshold);
  }, [threshold]);

  // Smooth scroll to top
  const scrollToTop = useCallback(() => {
    // If already at top, do nothing (or could add a small shake animation)
    if (window.scrollY < 100) {
      return;
    }

    setIsScrolling(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  }, []);

  useEffect(() => {
    // Check initial position
    checkScrollPosition();

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', checkScrollPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  return (
    <button
      onClick={scrollToTop}
      aria-label="العودة للأعلى"
      title="العودة للأعلى"
      className={cn(
        // Base styles
        'fixed z-50 flex items-center justify-center',
        'w-12 h-12 rounded-full',
        'bg-primary text-primary-foreground',
        'shadow-lg shadow-primary/25',
        'border-2 border-primary-foreground/10',

        // Position - bottom left for RTL, bottom right for LTR
        'bottom-6 ltr:right-6 rtl:left-6',

        // Transitions
        'transition-all duration-300 ease-out',

        // Hover effects
        'hover:scale-110 hover:shadow-xl hover:shadow-primary/30',
        'hover:bg-primary-600',

        // Active/Press effect
        'active:scale-95',

        // Focus styles for accessibility
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',

        // Visibility animation
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none',

        // Scrolling state
        isScrolling && 'animate-pulse',

        className
      )}
    >
      <ChevronUp
        className={cn(
          'w-6 h-6 transition-transform duration-200',
          'group-hover:-translate-y-0.5'
        )}
        strokeWidth={2.5}
      />

      {/* Ripple effect on hover */}
      <span
        className={cn(
          'absolute inset-0 rounded-full',
          'bg-white/20 scale-0',
          'transition-transform duration-300',
          'hover:scale-100'
        )}
        aria-hidden="true"
      />
    </button>
  );
}
