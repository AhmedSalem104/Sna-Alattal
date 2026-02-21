'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollSceneProps {
  children: ReactNode;
  className?: string;
  /** Fade out when scrolling past */
  fadeOut?: boolean;
  /** Apply subtle scale zoom effect */
  scaleEffect?: boolean;
  /** Vertical offset distance in px (default 40) */
  distance?: number;
}

/**
 * Cinematic scroll scene wrapper.
 * Uses ONLY opacity + subtle vertical movement + optional scale.
 * No horizontal transforms (causes layout shift on full-width sections).
 */
export function ScrollScene({
  children,
  className,
  fadeOut = true,
  scaleEffect = false,
  distance = 40,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Smooth opacity: fade in early, stay visible, fade out late
  const opacity = useTransform(
    scrollYProgress,
    fadeOut ? [0, 0.18, 0.82, 1] : [0, 0.18, 1, 1],
    fadeOut ? [0, 1, 1, 0] : [0, 1, 1, 1]
  );

  // Subtle vertical rise on entry, gentle drift up on exit
  const y = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [distance, 0, 0, fadeOut ? -(distance * 0.4) : 0]
  );

  // Very subtle scale (0.97 not 0.92 — avoids visible gaps on sides)
  const scale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    scaleEffect
      ? [0.97, 1, 1, fadeOut ? 0.98 : 1]
      : [1, 1, 1, 1]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ opacity, y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
