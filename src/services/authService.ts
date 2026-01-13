// CrymadX Auth Service
// Handles authentication, registration, and session management

import { api, tokenManager } from './api';
import type {
  User,
  LoginResponse,
  RegisterResponse,
  AuthTokens,
  TwoFactorSetup,
  TwoFactorEnableResponse,
} from '../types/api';

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  referralCode?: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  /**
   * Register a new user account
   * Now returns requiresVerification instead of tokens
   */
  register: async (data: RegisterData): Promise<RegisterResponse & { requiresVerification?: boolean }> => {
    const response = await api.post<RegisterResponse & { requiresVerification?: boolean }>('/api/auth/register', data, false);

    // If verification is required, don't set tokens
    if (response.requiresVerification) {
      return response;
    }

    // Legacy: if tokens are returned directly (shouldn't happen anymore)
    if (response.tokens) {
      tokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      tokenManager.setUser(response.user);
    }

    return response;
  },

  /**
   * Verify email with OTP code
   */
  verifyEmail: async (email: string, code: string): Promise<VerifyEmailResponse> => {
    const response = await api.post<VerifyEmailResponse>('/api/auth/verify-email', { email, code }, false);

    if (response.tokens) {
      tokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      tokenManager.setUser(response.user);
    }

    return response;
  },

  /**
   * Resend verification code
   */
  resendVerificationCode: async (email: string): Promise<{ message: string }> => {
    return api.post('/api/auth/resend-verification', { email }, false);
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials, false);

    // If 2FA is required, don't store tokens yet
    if (response.requires2FA) {
      return response;
    }

    if (response.tokens && response.user) {
      tokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      tokenManager.setUser(response.user);
    }

    return response;
  },

  /**
   * Verify 2FA code during login
   * Uses the auth service complete-2fa endpoint which verifies 2FA and returns tokens
   */
  verify2FA: async (userId: string, code: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/complete-2fa', { userId, code }, false);

    if (response.tokens && response.user) {
      tokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      tokenManager.setUser(response.user);
    }

    return response;
  },

  /**
   * Logout and invalidate tokens
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get<{ user?: User } | User>('/api/auth/me');
      // Handle both wrapped {user:} and direct user response
      if (response && 'user' in response) {
        return response.user || null;
      }
      return response as User;
    } catch (error) {
      return null;
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<AuthTokens | null> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await api.post<{ tokens: AuthTokens }>(
        '/api/auth/refresh',
        { refreshToken },
        false
      );

      if (response.tokens) {
        tokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
        return response.tokens;
      }
      return null;
    } catch (error) {
      tokenManager.clearTokens();
      return null;
    }
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return api.post('/api/auth/forgot-password', { email }, false);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    return api.post('/api/auth/reset-password', { token, password }, false);
  },

  /**
   * Setup 2FA - get QR code and secret
   */
  setup2FA: async (): Promise<TwoFactorSetup> => {
    return api.post<TwoFactorSetup>('/api/2fa/setup', {});
  },

  /**
   * Enable 2FA after verifying code
   */
  enable2FA: async (code: string): Promise<TwoFactorEnableResponse> => {
    return api.post<TwoFactorEnableResponse>('/api/2fa/enable', { code });
  },

  /**
   * Disable 2FA
   */
  disable2FA: async (code: string): Promise<{ message: string }> => {
    return api.post('/api/2fa/disable', { code });
  },

  /**
   * Generate new backup codes
   */
  generateBackupCodes: async (code: string): Promise<{ backupCodes: string[] }> => {
    return api.post('/api/2fa/backup-codes', { code });
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenManager.isAuthenticated();
  },

  /**
   * Get stored user from local storage
   */
  getStoredUser: (): User | null => {
    return tokenManager.getUser();
  },
};

export default authService;
