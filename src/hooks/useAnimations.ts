'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';

// ═══════════════════════════════════════════
// Shared Easing Constants
// ═══════════════════════════════════════════

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
export const SPRING_CONFIG = { type: 'spring' as const, stiffness: 300, damping: 30 };

// ═══════════════════════════════════════════
// Shared Animation Variants
// ═══════════════════════════════════════════

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: EASE_OUT_EXPO },
  }),
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO },
  }),
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO },
  }),
};

export const clipRevealVariants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: {
    clipPath: 'inset(0 0 0 0)',
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export function getSlideVariants(isRTL: boolean) {
  return {
    fromLeft: {
      hidden: { opacity: 0, x: isRTL ? 40 : -40 },
      visible: (i: number = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, delay: i * 0.15, ease: EASE_OUT_EXPO },
      }),
    },
    fromRight: {
      hidden: { opacity: 0, x: isRTL ? -40 : 40 },
      visible: (i: number = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, delay: i * 0.15, ease: EASE_OUT_EXPO },
      }),
    },
  };
}

// ═══════════════════════════════════════════
// useCountUp Hook
// ═══════════════════════════════════════════

export function useCountUp(
  target: number,
  duration: number = 2000,
  inView: boolean = false,
  startDelay: number = 0
): number {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now() + startDelay;
    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration, startDelay]);

  return count;
}

// ═══════════════════════════════════════════
// useParallax Hook
// ═══════════════════════════════════════════

export function useParallax(
  ref: React.RefObject<HTMLElement>,
  range: [number, number] = [-30, 30]
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['start end', 'end start'],
  });
  return useTransform(scrollYProgress, [0, 1], range);
}
