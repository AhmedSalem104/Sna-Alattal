'use client';

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import {
  AlertCircle,
  WifiOff,
  Clock,
  Lock,
  ShieldX,
  FileX,
  ServerCrash,
  RefreshCw,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APIError, APIErrorCode } from '@/lib/api-client';
import Link from 'next/link';

interface ErrorStateProps {
  error: APIError | null;
  onRetry?: () => void;
  showHomeLink?: boolean;
  className?: string;
}

// Icon mapping for different error types
const errorIcons: Record<APIErrorCode, React.ComponentType<{ className?: string; size?: number }>> = {
  NETWORK_ERROR: WifiOff,
  TIMEOUT: Clock,
  UNAUTHORIZED: Lock,
  FORBIDDEN: ShieldX,
  NOT_FOUND: FileX,
  VALIDATION_ERROR: AlertCircle,
  SERVER_ERROR: ServerCrash,
  UNKNOWN: AlertCircle,
};

// Colors for different error types
const errorColors: Record<APIErrorCode, string> = {
  NETWORK_ERROR: 'text-warning-500',
  TIMEOUT: 'text-warning-500',
  UNAUTHORIZED: 'text-error-500',
  FORBIDDEN: 'text-error-500',
  NOT_FOUND: 'text-neutral-500',
  VALIDATION_ERROR: 'text-warning-500',
  SERVER_ERROR: 'text-error-500',
  UNKNOWN: 'text-neutral-500',
};

/**
 * Generic Error State Component
 * Displays appropriate error message and retry option
 */
export const ErrorState = memo(function ErrorState({
  error,
  onRetry,
  showHomeLink = false,
  className = ''
}: ErrorStateProps) {
  const t = useTranslations();

  if (!error) return null;

  const Icon = errorIcons[error.code] || AlertCircle;
  const iconColor = errorColors[error.code] || 'text-neutral-500';

  const messages: Record<APIErrorCode, { title: string; description: string }> = {
    NETWORK_ERROR: {
      title: t('errors.networkError.title') || 'Connection Error',
      description: t('errors.networkError.description') || 'Please check your internet connection and try again.',
    },
    TIMEOUT: {
      title: t('errors.timeout.title') || 'Request Timed Out',
      description: t('errors.timeout.description') || 'The server took too long to respond. Please try again.',
    },
    UNAUTHORIZED: {
      title: t('errors.unauthorized.title') || 'Session Expired',
      description: t('errors.unauthorized.description') || 'Please log in again to continue.',
    },
    FORBIDDEN: {
      title: t('errors.forbidden.title') || 'Access Denied',
      description: t('errors.forbidden.description') || 'You do not have permission to access this resource.',
    },
    NOT_FOUND: {
      title: t('errors.notFound.title') || 'Not Found',
      description: t('errors.notFound.description') || 'The requested content could not be found.',
    },
    VALIDATION_ERROR: {
      title: t('errors.validation.title') || 'Invalid Data',
      description: t('errors.validation.description') || 'Please check your input and try again.',
    },
    SERVER_ERROR: {
      title: t('errors.serverError.title') || 'Server Error',
      description: t('errors.serverError.description') || 'Something went wrong on our end. Please try again later.',
    },
    UNKNOWN: {
      title: t('errors.unknown.title') || 'Something Went Wrong',
      description: t('errors.unknown.description') || 'An unexpected error occurred.',
    },
  };

  const { title, description } = messages[error.code] || messages.UNKNOWN;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* Icon */}
      <div className={`w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 ${iconColor}`}>
        <Icon size={32} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-steel-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-neutral-500 max-w-md mb-6">
        {description}
      </p>

      {/* Validation errors details */}
      {error.code === 'VALIDATION_ERROR' && error.details && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6 text-start max-w-md w-full">
          <ul className="text-sm text-error-700 space-y-1">
            {Object.entries(error.details).map(([field, messages]) => (
              <li key={field}>
                <span className="font-medium">{field}:</span> {(messages as string[]).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Report ID */}
      {error.reportId && (
        <p className="text-xs text-neutral-400 mb-4">
          {t('errors.reportId') || 'Error ID'}: {error.reportId}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw size={16} />
            {t('common.retry') || 'Try Again'}
          </Button>
        )}

        {showHomeLink && (
          <Button variant="outline" asChild>
            <Link href="/" className="gap-2">
              <Home size={16} />
              {t('common.backToHome') || 'Back to Home'}
            </Link>
          </Button>
        )}

        {error.code === 'UNAUTHORIZED' && (
          <Button asChild>
            <Link href="/admin/login">
              {t('auth.login') || 'Log In'}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
});

/**
 * Inline Error Message
 * For displaying errors within forms or cards
 */
interface InlineErrorProps {
  message: string;
  className?: string;
}

export const InlineError = memo(function InlineError({ message, className = '' }: InlineErrorProps) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 text-error-600 text-sm ${className}`}>
      <AlertCircle size={14} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
});

/**
 * Field Error
 * For validation errors under form fields
 */
interface FieldErrorProps {
  errors?: string[];
  className?: string;
}

export const FieldError = memo(function FieldError({ errors, className = '' }: FieldErrorProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className={`mt-1 space-y-1 ${className}`}>
      {errors.map((error, index) => (
        <p key={index} className="text-sm text-error-600 flex items-center gap-1">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      ))}
    </div>
  );
});

/**
 * Toast-style Error Notification
 * For temporary error messages
 */
interface ErrorToastProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorToast = memo(function ErrorToast({
  message,
  onClose,
  type = 'error'
}: ErrorToastProps) {
  const bgColors = {
    error: 'bg-error-50 border-error-200 text-error-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-info-50 border-info-200 text-info-800',
  };

  const icons = {
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColors[type]}`}>
      <Icon size={18} className="shrink-0" />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <span className="sr-only">Close</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
});

/**
 * Empty State Component
 * For when there's no data to display
 */
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export const EmptyState = memo(function EmptyState({
  icon: Icon = FileX,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
        <Icon size={32} />
      </div>

      <h3 className="text-lg font-semibold text-steel-900 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-neutral-500 max-w-md mb-6">
          {description}
        </p>
      )}

      {action && (
        action.href ? (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  );
});

/**
 * Loading Skeleton
 * For loading states
 */
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = memo(function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`bg-neutral-200 animate-pulse ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
});

export default {
  ErrorState,
  InlineError,
  FieldError,
  ErrorToast,
  EmptyState,
  Skeleton,
};
