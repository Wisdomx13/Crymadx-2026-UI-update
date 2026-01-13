// CrymadX API Client
// Base configuration and HTTP client for all API calls

// Use environment variable with hardcoded fallback for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend.crymadx.io';

// Token storage keys
const ACCESS_TOKEN_KEY = 'crymadx_access_token';
const REFRESH_TOKEN_KEY = 'crymadx_refresh_token';
const USER_KEY = 'crymadx_user';

// Auth state change event for cross-component communication
export const AUTH_LOGOUT_EVENT = 'crymadx_auth_logout';

const dispatchLogoutEvent = () => {
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
};

// Token management
export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (triggerLogoutEvent: boolean = false): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    if (triggerLogoutEvent) {
      dispatchLogoutEvent();
    }
  },

  getUser: (): any | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken();
  }
};

// Request interceptor - adds auth header
const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = tokenManager.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Token refresh logic
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      tokenManager.clearTokens(true); // Trigger logout event
      return null;
    }

    const data = await response.json();
    if (data.tokens) {
      tokenManager.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      return data.tokens.accessToken;
    }
    return null;
  } catch (error) {
    tokenManager.clearTokens(true); // Trigger logout event
    return null;
  }
};

// Generic API request handler
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  includeAuth?: boolean;
  isFormData?: boolean;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    params,
    includeAuth = true,
    isFormData = false,
  } = options;

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Build headers
  const headers: HeadersInit = isFormData
    ? {}
    : { 'Content-Type': 'application/json' };

  if (includeAuth) {
    const token = tokenManager.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Build request config
  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    let response = await fetch(url, config);

    // Handle 401 - try to refresh token
    if (response.status === 401 && includeAuth) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          onTokenRefreshed(newToken);
          // Retry the original request
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, { ...config, headers });
        } else {
          // Token refresh failed - clearTokens(true) already dispatched AUTH_LOGOUT_EVENT
          // AuthContext will handle the logout state change
          // Don't hard redirect - let the app handle navigation gracefully
          throw new Error('Session expired. Please login again.');
        }
      } else {
        // Wait for token refresh
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(async (token: string) => {
            headers['Authorization'] = `Bearer ${token}`;
            try {
              const retryResponse = await fetch(url, { ...config, headers });
              const data = await retryResponse.json();
              resolve(data);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    }

    // Parse response - handle non-JSON responses gracefully
    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Non-JSON response (likely HTML 404 page)
      const text = await response.text();
      if (!response.ok) {
        // Create a proper error for non-JSON error responses
        const error: any = new Error(`HTTP error ${response.status}`);
        error.status = response.status;
        throw error;
      }
      // Try to parse as JSON anyway (some servers don't set content-type correctly)
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const error: any = new Error(data.error || data.message || `HTTP error ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error: any) {
    // Only log errors that aren't expected 404s
    if (error?.status !== 404 && !error?.message?.includes('404')) {
      console.error('API Request Error:', error);
    }
    throw error;
  }
};

// Convenience methods
export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>, includeAuth = true) =>
    apiRequest<T>(endpoint, { method: 'GET', params, includeAuth }),

  post: <T>(endpoint: string, body?: any, includeAuth = true) =>
    apiRequest<T>(endpoint, { method: 'POST', body, includeAuth }),

  put: <T>(endpoint: string, body?: any, includeAuth = true) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, includeAuth }),

  patch: <T>(endpoint: string, body?: any, includeAuth = true) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body, includeAuth }),

  delete: <T>(endpoint: string, includeAuth = true) =>
    apiRequest<T>(endpoint, { method: 'DELETE', includeAuth }),

  upload: <T>(endpoint: string, formData: FormData, includeAuth = true) =>
    apiRequest<T>(endpoint, { method: 'POST', body: formData, includeAuth, isFormData: true }),
};

export default api;
