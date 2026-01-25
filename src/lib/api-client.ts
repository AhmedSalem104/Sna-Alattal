/**
 * Centralized API Client
 * Single source of truth for all API calls
 */

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
};

// Error types
export type APIErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export interface APIError {
  code: APIErrorCode;
  message: string;
  status?: number;
  details?: Record<string, string[]>;
  reportId?: string;
}

export interface APIResponse<T> {
  data: T | null;
  error: APIError | null;
  status: number;
}

// Helper to determine if request is safe to retry
const isSafeToRetry = (method: string, status: number): boolean => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return safeMethods.includes(method.toUpperCase()) && retryableStatuses.includes(status);
};

// Map HTTP status to error code
const getErrorCode = (status: number): APIErrorCode => {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 422) return 'VALIDATION_ERROR';
  if (status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN';
};

// Generate report ID for errors
const generateReportId = (): string => {
  return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Sleep helper for retries
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Logger (sanitizes sensitive data)
const logAPIError = (endpoint: string, method: string, status: number, error: APIError) => {
  const sanitizedLog = {
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    status,
    errorCode: error.code,
    message: error.message,
    reportId: error.reportId,
  };
  console.error('[API Error]', JSON.stringify(sanitizedLog));
};

// Main API client class
class APIClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set auth token
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // Generic fetch with error handling and retries
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle successful response
      if (response.ok) {
        const data = await response.json().catch(() => null);
        return { data, error: null, status: response.status };
      }

      // Handle error response
      const errorData = await response.json().catch(() => ({}));
      const reportId = generateReportId();

      const error: APIError = {
        code: getErrorCode(response.status),
        message: errorData.message || errorData.error || 'An error occurred',
        status: response.status,
        details: errorData.errors || errorData.details,
        reportId,
      };

      // Log the error
      logAPIError(endpoint, method, response.status, error);

      // Retry if safe
      if (isSafeToRetry(method, response.status) && retryCount < API_CONFIG.retries) {
        await sleep(API_CONFIG.retryDelay * (retryCount + 1));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      return { data: null, error, status: response.status };

    } catch (err) {
      clearTimeout(timeoutId);

      const isTimeout = err instanceof Error && err.name === 'AbortError';
      const reportId = generateReportId();

      const error: APIError = {
        code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: isTimeout
          ? 'Request timed out. Please try again.'
          : 'Network error. Please check your connection.',
        reportId,
      };

      logAPIError(endpoint, method, 0, error);

      // Retry network errors
      if (retryCount < API_CONFIG.retries) {
        await sleep(API_CONFIG.retryDelay * (retryCount + 1));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      return { data: null, error, status: 0 };
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<APIResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url = `${endpoint}?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload with progress (FormData)
  async upload<T>(endpoint: string, formData: FormData): Promise<APIResponse<T>> {
    const headers = { ...this.defaultHeaders };
    delete headers['Content-Type']; // Let browser set it for FormData

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }
}

// Singleton instance
export const apiClient = new APIClient();

// Public API Endpoints (no auth required)
export const publicAPI = {
  // Products
  getProducts: (params?: { limit?: number; featured?: boolean; categoryId?: string }) =>
    apiClient.get<unknown[]>('/api/public/products', params as Record<string, string>),

  // Solutions
  getSolutions: (params?: { limit?: number; featured?: boolean }) =>
    apiClient.get<unknown[]>('/api/public/solutions', params as Record<string, string>),

  // News
  getNews: (params?: { limit?: number; featured?: boolean }) =>
    apiClient.get<{ news: unknown[] }>('/api/public/news', params as Record<string, string>),

  // Slides
  getSlides: () => apiClient.get<unknown[]>('/api/public/slides'),

  // Clients
  getClients: (params?: { featured?: boolean; limit?: number }) =>
    apiClient.get<unknown[]>('/api/public/clients', params as Record<string, string>),

  // Team
  getTeam: (params?: { limit?: number }) =>
    apiClient.get<unknown[]>('/api/public/team', params as Record<string, string>),

  // Certificates
  getCertificates: (params?: { limit?: number }) =>
    apiClient.get<unknown[]>('/api/public/certificates', params as Record<string, string>),

  // Exhibitions
  getExhibitions: (params?: { limit?: number }) =>
    apiClient.get<unknown[]>('/api/public/exhibitions', params as Record<string, string>),

  // TV Interviews
  getTVInterviews: (params?: { limit?: number }) =>
    apiClient.get<unknown[]>('/api/public/tv-interviews', params as Record<string, string>),

  // Catalogues
  getCatalogues: (params?: { limit?: number }) =>
    apiClient.get<unknown[]>('/api/public/catalogues', params as Record<string, string>),

  // Categories
  getCategories: () => apiClient.get<unknown[]>('/api/public/categories'),

  // Contact
  submitContact: (data: { name: string; email: string; phone?: string; company?: string; message: string }) =>
    apiClient.post('/api/contact', data),

  // Health check
  healthCheck: () => apiClient.get<{ status: string; timestamp: string }>('/api/health'),
};

// Error message helper for UI
export const getErrorMessage = (error: APIError | null, locale: string = 'ar'): string => {
  if (!error) return '';

  const messages: Record<APIErrorCode, Record<string, string>> = {
    NETWORK_ERROR: {
      ar: 'خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.',
      en: 'Network error. Please check your connection.',
      tr: 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
    },
    TIMEOUT: {
      ar: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
      en: 'Request timed out. Please try again.',
      tr: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
    },
    UNAUTHORIZED: {
      ar: 'يرجى تسجيل الدخول للمتابعة.',
      en: 'Please login to continue.',
      tr: 'Devam etmek için lütfen giriş yapın.',
    },
    FORBIDDEN: {
      ar: 'ليس لديك صلاحية للوصول إلى هذا المحتوى.',
      en: 'You do not have permission to access this content.',
      tr: 'Bu içeriğe erişim izniniz yok.',
    },
    NOT_FOUND: {
      ar: 'المحتوى المطلوب غير موجود.',
      en: 'The requested content was not found.',
      tr: 'İstenen içerik bulunamadı.',
    },
    VALIDATION_ERROR: {
      ar: 'يرجى التحقق من البيانات المدخلة.',
      en: 'Please check your input.',
      tr: 'Lütfen girdinizi kontrol edin.',
    },
    SERVER_ERROR: {
      ar: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
      en: 'Server error. Please try again later.',
      tr: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    },
    UNKNOWN: {
      ar: 'حدث خطأ غير متوقع.',
      en: 'An unexpected error occurred.',
      tr: 'Beklenmeyen bir hata oluştu.',
    },
  };

  return messages[error.code]?.[locale] || messages[error.code]?.en || error.message;
};

export default apiClient;
