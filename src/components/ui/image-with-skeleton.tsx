'use client';

import { useState, useCallback } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithSkeletonProps extends Omit<ImageProps, 'onLoad'> {
  /** Optional wrapper className */
  wrapperClassName?: string;
}

/**
 * Image wrapper that shows a shimmer skeleton until the image loads,
 * then fades in the image smoothly.
 */
export function ImageWithSkeleton({
  wrapperClassName,
  className,
  alt,
  ...props
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  const onLoad = useCallback(() => setLoaded(true), []);

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      {/* Shimmer skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-100" aria-hidden="true">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      )}

      {/* Actual image */}
      <Image
        {...props}
        alt={alt}
        className={cn(
          'transition-opacity duration-500 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={onLoad}
      />
    </div>
  );
}
