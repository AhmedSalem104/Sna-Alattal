import * as React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  /** Unique ID for the form field */
  id: string;
  /** Label text to display */
  label: string;
  /** Error message to display */
  error?: string;
  /** Success message to display */
  success?: string;
  /** Hint/helper text to display */
  hint?: string;
  /** Whether the field is required */
  required?: boolean;
  /** The input element to render */
  children: React.ReactElement;
  /** Additional className for the container */
  className?: string;
}

/**
 * Enhanced form field component with WCAG 2.1 compliant validation feedback
 *
 * Features:
 * - Proper ARIA attributes for screen readers
 * - Visual and semantic error/success states
 * - Required field indicator
 * - Helper text support
 * - Live validation feedback
 *
 * @example
 * ```tsx
 * <FormField
 *   id="email"
 *   label="Email Address"
 *   error={errors.email?.message}
 *   hint="We'll never share your email"
 *   required
 * >
 *   <Input type="email" {...register('email')} />
 * </FormField>
 * ```
 */
export function FormField({
  id,
  label,
  error,
  success,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <Label htmlFor={id} className="text-gray-900 font-medium">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required field">
            *
          </span>
        )}
      </Label>

      {/* Input with enhanced attributes */}
      {React.cloneElement(children, {
        id,
        'aria-invalid': hasError,
        'aria-describedby': cn(
          hint && `${id}-hint`,
          error && `${id}-error`,
          success && `${id}-success`
        )
          .split(' ')
          .filter(Boolean)
          .join(' ') || undefined,
        'aria-required': required,
        className: cn(
          children.props.className,
          hasError && 'border-red-500 focus:ring-red-500',
          hasSuccess && 'border-green-500 focus:ring-green-500'
        ),
      })}

      {/* Hint text */}
      {hint && !error && !success && (
        <div
          id={`${id}-hint`}
          className="flex items-start gap-1.5 text-sm text-gray-600"
        >
          <Info size={14} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{hint}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          className="flex items-start gap-1.5 text-sm text-red-600"
        >
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Success message */}
      {success && !error && (
        <div
          id={`${id}-success`}
          role="status"
          aria-live="polite"
          className="flex items-start gap-1.5 text-sm text-green-600"
        >
          <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
