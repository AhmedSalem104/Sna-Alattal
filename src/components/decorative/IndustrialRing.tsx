'use client';

import { motion } from 'framer-motion';

interface IndustrialRingProps {
  size?: number;
  rings?: number;
  className?: string;
  animate?: boolean;
  strokeWidth?: number;
  dashed?: boolean;
}

export function IndustrialRing({
  size = 300,
  rings = 3,
  className = '',
  animate = true,
  strokeWidth = 1,
  dashed = false,
}: IndustrialRingProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - strokeWidth;
  const ringSpacing = maxRadius / (rings + 1);

  const circleElements = Array.from({ length: rings }, (_, i) => {
    const radius = ringSpacing * (i + 1);
    const opacity = 1 - i * (0.3 / rings);

    return (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={dashed && i % 2 === 1 ? '8 4' : undefined}
        opacity={opacity}
      />
    );
  });

  if (animate) {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={className}
        aria-hidden="true"
        role="presentation"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {circleElements}
      </motion.svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      {circleElements}
    </svg>
  );
}
