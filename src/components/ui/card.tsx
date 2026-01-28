import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva(
  'bg-white text-neutral-900 transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        // Default - White bg, subtle border, soft shadow with gold accent on hover
        default: [
          'rounded-xl',
          'border border-neutral-200',
          'shadow-soft-sm',
          'hover:shadow-soft-md hover:shadow-primary-200/30',
          'hover:border-primary/40',
          'relative',
          'before:absolute before:inset-y-0 before:right-0 before:w-0.5',
          'before:bg-transparent before:transition-all before:duration-300 before:rounded-l-full',
          'hover:before:bg-primary',
        ].join(' '),

        // Elevated - Stronger shadow, no border
        elevated: [
          'rounded-xl',
          'border-0',
          'shadow-soft-md',
          'hover:shadow-soft-lg',
          'hover:-translate-y-0.5',
          'relative',
          'before:absolute before:inset-y-4 before:right-0 before:w-0.5',
          'before:bg-transparent before:transition-all before:duration-300 before:rounded-l-full',
          'hover:before:bg-primary',
        ].join(' '),

        // Outline - Border only, transparent bg
        outline: [
          'rounded-xl',
          'border-2 border-neutral-200',
          'bg-transparent',
          'shadow-none',
          'hover:border-primary',
          'hover:bg-primary-50/30',
        ].join(' '),

        // Ghost - No border, no shadow, subtle hover bg with gold accent
        ghost: [
          'rounded-xl',
          'border-0',
          'bg-transparent',
          'shadow-none',
          'hover:bg-neutral-50',
          'relative',
          'before:absolute before:inset-y-2 before:right-0 before:w-0.5',
          'before:bg-transparent before:transition-all before:duration-300 before:rounded-l-full',
          'hover:before:bg-primary/70',
        ].join(' '),

        // Glass - Backdrop blur effect with gold accent
        glass: [
          'rounded-xl',
          'bg-white/60 dark:bg-neutral-900/60',
          'backdrop-blur-xl backdrop-saturate-150',
          'border border-white/40 dark:border-neutral-700/40',
          'shadow-soft-md',
          'hover:bg-white/70 dark:hover:bg-neutral-900/70',
          'hover:border-primary/40',
          'hover:shadow-soft-lg hover:shadow-primary-200/20',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant }),
        hover && 'cursor-pointer active:scale-[0.98]',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-tight tracking-tight text-neutral-900',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-neutral-500 mt-1.5 leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center p-5 pt-3 border-t border-neutral-100',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Modern Card Image component with smooth overlay
const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    aspectRatio?: 'video' | 'square' | 'product' | 'wide';
  }
>(({ className, aspectRatio = 'video', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative overflow-hidden rounded-t-xl',
      aspectRatio === 'video' && 'aspect-video',
      aspectRatio === 'square' && 'aspect-square',
      aspectRatio === 'product' && 'aspect-[4/3]',
      aspectRatio === 'wide' && 'aspect-[21/9]',
      className
    )}
    {...props}
  >
    {children}
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
  </div>
));
CardImage.displayName = 'CardImage';

// Modern Badge for cards
const CardBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'gold' | 'success' | 'warning' | 'error';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-md',
      'backdrop-blur-sm transition-all duration-200',
      variant === 'default' && 'bg-neutral-900/80 text-white',
      variant === 'gold' && 'bg-primary/90 text-primary-foreground',
      variant === 'success' && 'bg-success/90 text-white',
      variant === 'warning' && 'bg-warning/90 text-steel-900',
      variant === 'error' && 'bg-error/90 text-white',
      className
    )}
    {...props}
  />
));
CardBadge.displayName = 'CardBadge';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardBadge,
  cardVariants,
};
