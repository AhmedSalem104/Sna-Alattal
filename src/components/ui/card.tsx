import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva(
  'bg-card text-card-foreground transition-all duration-300',
  {
    variants: {
      variant: {
        // Default - Slight rounding with shadow
        default: 'rounded-sm border shadow-sm hover:shadow-md',

        // Industrial - Sharp edges with gold accent bar
        industrial:
          'rounded-none border border-metal-200 relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-primary before:transition-all before:duration-300 hover:border-primary hover:shadow-industrial-md hover:-translate-y-1 hover:before:w-1.5',

        // Industrial Dark - For dark backgrounds
        industrialDark:
          'rounded-none bg-steel-800 border border-steel-700 text-white relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-primary hover:border-primary hover:shadow-gold',

        // Elevated - More prominent shadow
        elevated: 'rounded-sm border-0 shadow-industrial-md hover:shadow-industrial-lg',

        // Outline - Just border, no shadow
        outline: 'rounded-sm border-2 border-metal-200 shadow-none hover:border-primary',

        // Ghost - Minimal styling
        ghost: 'rounded-sm border-0 shadow-none bg-transparent hover:bg-metal-50',

        // Glass - Glassmorphism effect
        glass: 'rounded-sm bg-white/10 backdrop-blur-md border border-white/20',

        // Stat - For statistics/metrics display
        stat: 'rounded-none bg-steel-800 border-l-4 border-primary text-white relative overflow-hidden before:absolute before:top-0 before:right-0 before:w-32 before:h-32 before:bg-primary/5 before:rounded-full before:-translate-y-1/2 before:translate-x-1/2',
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
        hover && 'cursor-pointer',
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
    className={cn('flex flex-col space-y-1.5 p-6', className)}
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
      'text-xl font-bold leading-none tracking-tight',
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
    className={cn('text-sm text-muted-foreground mt-1', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Industrial Card Image component
const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { aspectRatio?: 'video' | 'square' | 'product' }
>(({ className, aspectRatio = 'video', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative overflow-hidden',
      aspectRatio === 'video' && 'aspect-video',
      aspectRatio === 'square' && 'aspect-square',
      aspectRatio === 'product' && 'aspect-[4/3]',
      className
    )}
    {...props}
  >
    {children}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  </div>
));
CardImage.displayName = 'CardImage';

// Industrial Badge for cards
const CardBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'gold' | 'success' | 'warning' | 'error';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider',
      variant === 'default' && 'bg-steel-800 text-white',
      variant === 'gold' && 'bg-primary text-steel-900',
      variant === 'success' && 'bg-industrial-success text-white',
      variant === 'warning' && 'bg-industrial-warning text-steel-900',
      variant === 'error' && 'bg-industrial-error text-white',
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
