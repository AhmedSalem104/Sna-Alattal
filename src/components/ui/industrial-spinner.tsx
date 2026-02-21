'use client';

import { cn } from '@/lib/utils';

interface IndustrialSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: { outer: 'w-6 h-6', dot: 'w-1.5 h-1.5', border: 'border-2' },
  md: { outer: 'w-10 h-10', dot: 'w-2 h-2', border: 'border-[3px]' },
  lg: { outer: 'w-14 h-14', dot: 'w-3 h-3', border: 'border-4' },
};

/**
 * Industrial-themed loading spinner.
 * Outer ring rotates, inner gold dot pulses.
 */
export function IndustrialSpinner({
  size = 'md',
  label,
  className,
}: IndustrialSpinnerProps) {
  const s = sizeMap[size];

  return (
    <div className={cn('flex flex-col items-center gap-3', className)} role="status">
      <div className="relative">
        {/* Rotating outer ring */}
        <div
          className={cn(
            s.outer,
            s.border,
            'rounded-full border-neutral-200 border-t-primary animate-spin'
          )}
        />
        {/* Pulsing gold center dot */}
        <div
          className={cn(
            s.dot,
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'rounded-full bg-primary animate-pulse-soft'
          )}
        />
      </div>
      {label && (
        <span className="text-sm text-neutral-500 font-medium">{label}</span>
      )}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
}
