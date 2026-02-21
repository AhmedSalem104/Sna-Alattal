'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in scroll progress (0-0.3) for stagger effects */
  delay?: number;
  /** Fade out when scrolling past */
  fadeOut?: boolean;
  /** Distance to travel */
  distance?: number;
}

/**
 * Reveals individual elements based on scroll position.
 * Use inside a section for staggered reveals of child elements.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  fadeOut = false,
  distance = 30,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const entryStart = 0.05 + delay;
  const entryEnd = 0.22 + delay;

  // Opacity
  const opacity = useTransform(
    scrollYProgress,
    fadeOut
      ? [0, entryStart, entryEnd, 0.82, 1]
      : [0, entryStart, entryEnd, 1, 1],
    fadeOut
      ? [0, 0, 1, 1, 0]
      : [0, 0, 1, 1, 1]
  );

  // Subtle vertical movement only
  const y = useTransform(
    scrollYProgress,
    [0, entryStart, entryEnd, 1],
    [distance, distance, 0, 0]
  );

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
