'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface IndustrialGearProps {
  size?: number;
  teeth?: number;
  className?: string;
  animate?: boolean;
  strokeWidth?: number;
  reverse?: boolean;
}

function generateGearPath(size: number, teeth: number): string {
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size / 2 - 4;
  const dedendumRadius = outerRadius * 0.82;
  const toothAngle = (Math.PI * 2) / teeth;
  const toothTop = toothAngle * 0.3;
  const toothGap = toothAngle * 0.7;
  const halfTop = toothTop / 2;
  const halfGap = toothGap / 2;

  const points: string[] = [];

  for (let i = 0; i < teeth; i++) {
    const centerAngle = i * toothAngle;

    // Bottom-left of tooth (on dedendum circle)
    const a1 = centerAngle - halfGap;
    // Top-left of tooth (on outer circle)
    const a2 = centerAngle - halfTop;
    // Top-right of tooth (on outer circle)
    const a3 = centerAngle + halfTop;
    // Bottom-right of tooth (on dedendum circle)
    const a4 = centerAngle + halfGap;

    const x1 = cx + Math.cos(a1) * dedendumRadius;
    const y1 = cy + Math.sin(a1) * dedendumRadius;
    const x2 = cx + Math.cos(a2) * outerRadius;
    const y2 = cy + Math.sin(a2) * outerRadius;
    const x3 = cx + Math.cos(a3) * outerRadius;
    const y3 = cy + Math.sin(a3) * outerRadius;
    const x4 = cx + Math.cos(a4) * dedendumRadius;
    const y4 = cy + Math.sin(a4) * dedendumRadius;

    if (i === 0) {
      points.push(`M ${x1.toFixed(1)} ${y1.toFixed(1)}`);
    }

    // Straight line up to tooth top-left
    points.push(`L ${x2.toFixed(1)} ${y2.toFixed(1)}`);
    // Arc across tooth top
    points.push(`A ${outerRadius.toFixed(1)} ${outerRadius.toFixed(1)} 0 0 1 ${x3.toFixed(1)} ${y3.toFixed(1)}`);
    // Straight line down to tooth bottom-right
    points.push(`L ${x4.toFixed(1)} ${y4.toFixed(1)}`);

    // Arc across gap to next tooth bottom-left
    if (i < teeth - 1) {
      const nextA1 = (i + 1) * toothAngle - halfGap;
      const nx1 = cx + Math.cos(nextA1) * dedendumRadius;
      const ny1 = cy + Math.sin(nextA1) * dedendumRadius;
      points.push(`A ${dedendumRadius.toFixed(1)} ${dedendumRadius.toFixed(1)} 0 0 1 ${nx1.toFixed(1)} ${ny1.toFixed(1)}`);
    } else {
      // Close back to start
      const startA = 0 * toothAngle - halfGap;
      const sx = cx + Math.cos(startA) * dedendumRadius;
      const sy = cy + Math.sin(startA) * dedendumRadius;
      points.push(`A ${dedendumRadius.toFixed(1)} ${dedendumRadius.toFixed(1)} 0 0 1 ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
  }

  points.push('Z');
  return points.join(' ');
}

export function IndustrialGear({
  size = 200,
  teeth = 12,
  className = '',
  animate = true,
  strokeWidth = 1.5,
  reverse = false,
}: IndustrialGearProps) {
  const gearPath = useMemo(
    () => generateGearPath(size, teeth),
    [size, teeth]
  );

  const cx = size / 2;
  const cy = size / 2;
  const hubRadius = size * 0.18;
  const boreRadius = size * 0.08;
  const spokeCount = Math.min(teeth, 6);

  // Round SVG numeric attributes to 2 decimal places to avoid SSR/CSR
  // floating-point serialisation differences that cause hydration mismatches.
  const r = (n: number) => Math.round(n * 100) / 100;

  // Generate spokes
  const spokes = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      lines.push({
        x1: r(cx + Math.cos(angle) * (boreRadius + 2)),
        y1: r(cy + Math.sin(angle) * (boreRadius + 2)),
        x2: r(cx + Math.cos(angle) * (hubRadius + size * 0.14)),
        y2: r(cy + Math.sin(angle) * (hubRadius + size * 0.14)),
      });
    }
    return lines;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cx, cy, boreRadius, hubRadius, spokeCount, size]);

  const svgContent = (
    <>
      {/* Gear teeth outline */}
      <path
        d={gearPath}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Hub circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r(hubRadius)}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Center bore */}
      <circle
        cx={cx}
        cy={cy}
        r={r(boreRadius)}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* Spokes */}
      {spokes.map((spoke, i) => (
        <line
          key={i}
          x1={spoke.x1}
          y1={spoke.y1}
          x2={spoke.x2}
          y2={spoke.y2}
          stroke="currentColor"
          strokeWidth={strokeWidth * 0.8}
        />
      ))}
    </>
  );

  if (animate) {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={className}
        aria-hidden="true"
        role="presentation"
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {svgContent}
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
      {svgContent}
    </svg>
  );
}
