'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroScrollFadeProps {
  children: ReactNode;
}

/**
 * Cinematic hero scroll-away effect.
 * Fades out + subtle upward drift as the user scrolls past.
 * Uses transformOrigin: 'center top' to prevent horizontal expansion.
 */
export function HeroScrollFade({ children }: HeroScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Smooth fade out
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Subtle upward drift (no zoom — avoids horizontal shift)
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -30]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ opacity, y }}>
        {children}
      </motion.div>
    </div>
  );
}
