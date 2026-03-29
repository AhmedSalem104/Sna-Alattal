'use client';

import { useEffect, useRef, useMemo } from 'react';

/* ── Gear SVG path generator ── */
function gearPath(cx: number, cy: number, outerR: number, teeth: number): string {
  const innerR = outerR * 0.82;
  const toothAngle = (Math.PI * 2) / teeth;
  const halfTop = (toothAngle * 0.3) / 2;
  const halfGap = (toothAngle * 0.7) / 2;
  const pts: string[] = [];

  for (let i = 0; i < teeth; i++) {
    const c = i * toothAngle;
    const a1 = c - halfGap, a2 = c - halfTop, a3 = c + halfTop, a4 = c + halfGap;
    const p = (a: number, r: number) => `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;

    if (i === 0) pts.push(`M ${p(a1, innerR)}`);
    pts.push(`L ${p(a2, outerR)}`);
    pts.push(`A ${outerR.toFixed(1)} ${outerR.toFixed(1)} 0 0 1 ${p(a3, outerR)}`);
    pts.push(`L ${p(a4, innerR)}`);

    const nextA1 = i < teeth - 1 ? (i + 1) * toothAngle - halfGap : -halfGap;
    const np = p(nextA1, innerR);
    pts.push(`A ${innerR.toFixed(1)} ${innerR.toFixed(1)} 0 0 1 ${np}`);
  }
  pts.push('Z');
  return pts.join(' ');
}

/* ── Single gear definition ── */
interface GearDef {
  id: number;
  size: number;
  teeth: number;
  x: string;       // CSS left/right position
  y: number;        // vh offset from top
  side: 'left' | 'right';
  speed: number;    // rotation multiplier
  reverse: boolean;
  opacity: number;
}

/* ── Predefined gear positions along the page ── */
const GEARS: GearDef[] = [
  { id: 1, size: 200, teeth: 14, x: '10px',  y: 5,   side: 'left',  speed: 0.08, reverse: false, opacity: 0.15 },
  { id: 2, size: 140, teeth: 10, x: '15px',  y: 15,  side: 'right', speed: 0.12, reverse: true,  opacity: 0.12 },
  { id: 3, size: 250, teeth: 16, x: '-20px', y: 28,  side: 'right', speed: 0.06, reverse: false, opacity: 0.15 },
  { id: 4, size: 160, teeth: 12, x: '5px',   y: 38,  side: 'left',  speed: 0.10, reverse: true,  opacity: 0.12 },
  { id: 5, size: 220, teeth: 18, x: '-10px', y: 50,  side: 'left',  speed: 0.07, reverse: false, opacity: 0.15 },
  { id: 6, size: 180, teeth: 14, x: '10px',  y: 60,  side: 'right', speed: 0.09, reverse: true,  opacity: 0.13 },
  { id: 7, size: 150, teeth: 10, x: '20px',  y: 70,  side: 'left',  speed: 0.11, reverse: false, opacity: 0.12 },
  { id: 8, size: 260, teeth: 20, x: '-15px', y: 80,  side: 'right', speed: 0.05, reverse: true,  opacity: 0.15 },
  { id: 9, size: 170, teeth: 12, x: '10px',  y: 88,  side: 'left',  speed: 0.09, reverse: false, opacity: 0.12 },
  { id: 10, size: 190, teeth: 16, x: '5px',  y: 95,  side: 'right', speed: 0.08, reverse: true,  opacity: 0.14 },
];

export function ScrollingGears() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Update a single CSS custom property on scroll -- zero React re-renders
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.setProperty('--scroll-y', String(window.scrollY));
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Set initial value
    if (containerRef.current) {
      containerRef.current.style.setProperty('--scroll-y', String(window.scrollY));
    }
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pre-compute gear paths (only once, never changes)
  const gearPaths = useMemo(() => {
    return GEARS.map((g) => {
      const cx = g.size / 2;
      const cy = g.size / 2;
      const outerR = g.size / 2 - 4;
      const hubR = g.size * 0.18;
      const boreR = g.size * 0.08;
      return {
        outer: gearPath(cx, cy, outerR, g.teeth),
        hub: { cx, cy, r: hubR },
        bore: { cx, cy, r: boreR },
      };
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ contain: 'layout style paint' } as React.CSSProperties}
    >
      {GEARS.map((gear, i) => {
        const paths = gearPaths[i];
        // Speed factor baked into CSS calc: scrollY * speed * direction
        const speedFactor = gear.speed * (gear.reverse ? -1 : 1);
        const posStyle: React.CSSProperties = {
          position: 'absolute',
          top: `${gear.y}vh`,
          [gear.side]: gear.x,
          width: gear.size,
          height: gear.size,
          // CSS-driven rotation: no React re-render on scroll
          transform: `rotate(calc(var(--scroll-y, 0) * ${speedFactor} * 1deg))`,
          willChange: 'transform',
          opacity: gear.opacity,
        };

        return (
          <svg
            key={gear.id}
            width={gear.size}
            height={gear.size}
            viewBox={`0 0 ${gear.size} ${gear.size}`}
            style={posStyle}
            className="text-primary"
          >
            <path
              d={paths.outer}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <circle
              cx={paths.hub.cx}
              cy={paths.hub.cy}
              r={paths.hub.r}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            />
            <circle
              cx={paths.bore.cx}
              cy={paths.bore.cy}
              r={paths.bore.r}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            />
          </svg>
        );
      })}
    </div>
  );
}
