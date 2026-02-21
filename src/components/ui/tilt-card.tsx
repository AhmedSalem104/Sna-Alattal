'use client';

import { useRef, useCallback, useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt angle in degrees (default 3) */
  maxTilt?: number;
  /** Show gold glare highlight (default true) */
  glare?: boolean;
}

/**
 * 3D perspective tilt card with gold glare on hover.
 * Automatically disables on touch devices.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 3,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setTilt({
        rotateX: (0.5 - y) * maxTilt * 2,
        rotateY: (x - 0.5) * maxTilt * 2,
      });
      setGlarePos({ x: x * 100, y: y * 100 });
    },
    [isTouchDevice, maxTilt]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  // Before useEffect runs (SSR + first client render) → render the
  // non-interactive wrapper so the HTML tree is identical on both sides.
  // After mount, if it turns out to be a touch device we keep the plain div;
  // otherwise we upgrade to the tilt motion.div.
  if (isTouchDevice === null || isTouchDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
    >
      {children}

      {/* Gold glare overlay */}
      {glare && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(201,162,39,0.12) 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}
