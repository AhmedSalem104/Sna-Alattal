import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-primary/20 bg-primary/10 text-primary',

        secondary:
          'border-secondary/20 bg-secondary/10 text-secondary-foreground',

        outline:
          'border-border bg-transparent text-foreground',

        success:
          'border-success-100 bg-success-50 text-success dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',

        warning:
          'border-warning-100 bg-warning-50 text-warning dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',

        error:
          'border-error-100 bg-error-50 text-error dark:border-red-800 dark:bg-red-950 dark:text-red-400',

        info:
          'border-info-100 bg-info-50 text-info dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400',

        gold:
          'border-primary/30 bg-primary/15 text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  role?: string;
}

function Badge({ className, variant, role = 'status', ...props }: BadgeProps) {
  return (
    <span
      role={role}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
