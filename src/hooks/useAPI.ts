'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { APIResponse, APIError, apiClient } from '@/lib/api-client';

/**
 * Custom hook for API calls with loading and error states
 */

interface UseAPIOptions<T> {
  /** Initial data value */
  initialData?: T;
  /** Auto-fetch on mount */
  immediate?: boolean;
  /** Dependencies for auto-refetch */
  deps?: unknown[];
  /** Callback on success */
  onSuccess?: (data: T) => void;
  /** Callback on error */
  onError?: (error: APIError) => void;
}

interface UseAPIReturn<T> {
  data: T | null;
  error: APIError | null;
  loading: boolean;
  execute: () => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

/**
 * useAPI - Generic hook for API calls
 *
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useAPI(
 *   () => publicAPI.getProducts({ limit: 4 }),
 *   { immediate: true }
 * );
 * ```
 */
export function useAPI<T>(
  fetcher: () => Promise<APIResponse<T>>,
  options: UseAPIOptions<T> = {}
): UseAPIReturn<T> {
  const {
    initialData = null,
    immediate = false,
    deps = [],
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<APIError | null>(null);
  const [loading, setLoading] = useState(immediate);

  // Ref to track if component is mounted
  const mountedRef = useRef(true);

  // Ref to track the latest fetcher
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async (): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetcherRef.current();

      if (!mountedRef.current) return null;

      if (response.error) {
        setError(response.error);
        onError?.(response.error);
        return null;
      }

      setData(response.data);
      if (response.data) {
        onSuccess?.(response.data);
      }
      return response.data;
    } catch (err) {
      if (!mountedRef.current) return null;

      const error: APIError = {
        code: 'UNKNOWN',
        message: err instanceof Error ? err.message : 'An error occurred',
      };
      setError(error);
      onError?.(error);
      return null;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  // Auto-fetch on mount or when deps change
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...deps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    reset,
    setData,
  };
}

/**
 * useMutation - Hook for mutations (POST, PUT, DELETE)
 *
 * @example
 * ```tsx
 * const { mutate, loading, error } = useMutation(
 *   (data) => apiClient.post('/api/contact', data)
 * );
 *
 * const handleSubmit = async (formData) => {
 *   const result = await mutate(formData);
 *   if (result) {
 *     // Success
 *   }
 * };
 * ```
 */
interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: APIError) => void;
}

interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  data: TData | null;
  error: APIError | null;
  loading: boolean;
  reset: () => void;
}

export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<APIResponse<TData>>,
  options: UseMutationOptions<TData> = {}
): UseMutationReturn<TData, TVariables> {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [loading, setLoading] = useState(false);

  const mountedRef = useRef(true);

  const mutate = useCallback(async (variables: TVariables): Promise<TData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(variables);

      if (!mountedRef.current) return null;

      if (response.error) {
        setError(response.error);
        onError?.(response.error);
        return null;
      }

      setData(response.data);
      if (response.data) {
        onSuccess?.(response.data);
      }
      return response.data;
    } catch (err) {
      if (!mountedRef.current) return null;

      const error: APIError = {
        code: 'UNKNOWN',
        message: err instanceof Error ? err.message : 'An error occurred',
      };
      setError(error);
      onError?.(error);
      return null;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [mutationFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    mutate,
    data,
    error,
    loading,
    reset,
  };
}

/**
 * useHealthCheck - Hook for checking API health
 *
 * @example
 * ```tsx
 * const { isHealthy, lastCheck, check } = useHealthCheck({ interval: 30000 });
 * ```
 */
interface UseHealthCheckOptions {
  /** Check interval in ms (default: 60000 = 1 min) */
  interval?: number;
  /** Start checking immediately */
  immediate?: boolean;
}

interface UseHealthCheckReturn {
  isHealthy: boolean | null;
  lastCheck: Date | null;
  checking: boolean;
  check: () => Promise<boolean>;
}

export function useHealthCheck(options: UseHealthCheckOptions = {}): UseHealthCheckReturn {
  const { interval = 60000, immediate = true } = options;

  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [checking, setChecking] = useState(false);

  const check = useCallback(async (): Promise<boolean> => {
    setChecking(true);

    try {
      const response = await apiClient.get<{ status: string }>('/api/health');

      const healthy = response.data?.status === 'healthy';
      setIsHealthy(healthy);
      setLastCheck(new Date());
      return healthy;
    } catch {
      setIsHealthy(false);
      setLastCheck(new Date());
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  // Initial check
  useEffect(() => {
    if (immediate) {
      check();
    }
  }, [immediate, check]);

  // Periodic check
  useEffect(() => {
    if (interval > 0) {
      const timer = setInterval(check, interval);
      return () => clearInterval(timer);
    }
  }, [interval, check]);

  return {
    isHealthy,
    lastCheck,
    checking,
    check,
  };
}

export default {
  useAPI,
  useMutation,
  useHealthCheck,
};
