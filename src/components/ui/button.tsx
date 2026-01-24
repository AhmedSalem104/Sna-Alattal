import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary Industrial - Gold with offset shadow
        default:
          'bg-primary text-primary-foreground hover:bg-primary-600 shadow-sm hover:shadow-md rounded-sm',

        // Industrial - Full industrial style with offset shadow
        industrial:
          'bg-gradient-to-r from-primary to-primary-600 text-steel-900 font-bold uppercase tracking-wider shadow-offset hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 rounded-none',

        // Industrial Outline
        industrialOutline:
          'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-steel-900 font-bold uppercase tracking-wider rounded-none',

        // Industrial Dark
        industrialDark:
          'bg-steel-800 text-white border-2 border-steel-700 hover:bg-steel-700 hover:border-primary font-bold uppercase tracking-wider rounded-none',

        // Destructive
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-sm',

        // Outline
        outline:
          'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-sm',

        // Secondary
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-sm',

        // Ghost
        ghost: 'hover:bg-accent hover:text-accent-foreground rounded-sm',

        // Link
        link: 'text-primary underline-offset-4 hover:underline',

        // Gold (legacy support)
        gold: 'bg-primary text-steel-900 hover:bg-primary-600 font-semibold rounded-sm',

        // Gold Outline (legacy support)
        goldOutline:
          'border-2 border-primary text-primary hover:bg-primary hover:text-steel-900 font-semibold rounded-sm',

        // Success
        success:
          'bg-industrial-success text-white hover:bg-industrial-success/90 rounded-sm',

        // Warning
        warning:
          'bg-industrial-warning text-steel-900 hover:bg-industrial-warning/90 rounded-sm',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-8 text-base',
        xl: 'h-12 px-10 text-base',
        '2xl': 'h-14 px-12 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
