'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A thin gold progress bar fixed at the very top of the page.
 * Shows how far the user has scrolled through the page.
 * Creates a sense of journey progression.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary to-primary/60 z-[9999] origin-left"
      style={{ scaleX }}
    />
  );
}
