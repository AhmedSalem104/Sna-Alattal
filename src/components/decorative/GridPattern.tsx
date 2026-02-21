'use client';

interface GridPatternProps {
  spacing?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

export function GridPattern({
  spacing = 40,
  color = '#C9A227',
  opacity = 0.04,
  className = '',
}: GridPatternProps) {
  const patternId = `grid-pattern-${spacing}`;

  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <pattern
          id={patternId}
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
