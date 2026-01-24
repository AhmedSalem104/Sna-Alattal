import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Default - Primary gold
        default:
          'rounded-sm border-transparent bg-primary text-primary-foreground hover:bg-primary/80',

        // Industrial - Sharp with border
        industrial:
          'rounded-none border-2 border-primary/30 bg-primary/10 text-primary uppercase tracking-wider',

        // Industrial Dark
        industrialDark:
          'rounded-none border-2 border-steel-600 bg-steel-800 text-white uppercase tracking-wider',

        // Secondary
        secondary:
          'rounded-sm border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',

        // Destructive
        destructive:
          'rounded-sm border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',

        // Outline
        outline: 'rounded-sm text-foreground border-metal-300',

        // Gold (legacy)
        gold: 'rounded-sm border-transparent bg-primary text-steel-900 hover:bg-primary/80',

        // Success
        success:
          'rounded-sm border-transparent bg-industrial-success text-white',

        // Success Light
        successLight:
          'rounded-none border-2 border-industrial-success/30 bg-industrial-success/10 text-industrial-success uppercase tracking-wider',

        // Warning
        warning:
          'rounded-sm border-transparent bg-industrial-warning text-steel-900',

        // Warning Light
        warningLight:
          'rounded-none border-2 border-industrial-warning/30 bg-industrial-warning/10 text-industrial-warning uppercase tracking-wider',

        // Error
        error:
          'rounded-sm border-transparent bg-industrial-error text-white',

        // Error Light
        errorLight:
          'rounded-none border-2 border-industrial-error/30 bg-industrial-error/10 text-industrial-error uppercase tracking-wider',

        // Info
        info:
          'rounded-sm border-transparent bg-industrial-info text-white',

        // Info Light
        infoLight:
          'rounded-none border-2 border-industrial-info/30 bg-industrial-info/10 text-industrial-info uppercase tracking-wider',

        // Muted / Draft
        muted:
          'rounded-sm border-transparent bg-metal-200 text-metal-600',

        // Featured
        featured:
          'rounded-none border-2 border-primary bg-primary/20 text-primary uppercase tracking-wider font-bold',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  role?: string;
}

function Badge({ className, variant, size, role = 'status', ...props }: BadgeProps) {
  return (
    <span
      role={role}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
