import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full text-sm text-steel-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-metal-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        // Default - Light with industrial styling
        default:
          'rounded-none border-2 border-metal-200 bg-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:border-primary',

        // Industrial - Sharp edges with gold focus
        industrial:
          'rounded-none border-2 border-metal-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20',

        // Industrial Dark - For dark backgrounds (like hero sections)
        industrialDark:
          'rounded-none border-2 border-steel-700 bg-steel-800 text-white placeholder:text-steel-400 focus:border-primary focus:ring-2 focus:ring-primary/20',

        // Ghost - Minimal styling
        ghost:
          'rounded-none border-0 bg-metal-50 focus:bg-white focus:ring-2 focus:ring-primary/20',

        // Underline - Bottom border only
        underline:
          'rounded-none border-0 border-b-2 border-metal-200 bg-transparent px-0 focus:border-primary',
      },
      inputSize: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-3 py-1 text-xs',
        lg: 'h-12 px-4 py-3',
        xl: 'h-14 px-4 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant, inputSize }),
          error && 'border-industrial-error focus:border-industrial-error focus:ring-industrial-error/20',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Search Input with icon
const SearchInput = React.forwardRef<
  HTMLInputElement,
  InputProps & { iconPosition?: 'left' | 'right' }
>(({ className, iconPosition = 'left', ...props }, ref) => {
  return (
    <div className="relative">
      <svg
        className={cn(
          'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
          iconPosition === 'left' ? 'left-3' : 'right-3'
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <Input
        ref={ref}
        className={cn(
          iconPosition === 'left' ? 'pl-10' : 'pr-10',
          className
        )}
        {...props}
      />
    </div>
  );
});
SearchInput.displayName = 'SearchInput';

export { Input, SearchInput, inputVariants };
