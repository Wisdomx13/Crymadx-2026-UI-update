// CrymadX User Service
// Handles user profile, settings, and account management

import { api } from './api';
import type { UserProfile, LoginHistory, User } from '../types/api';

export interface UpdateProfileData {
  fullName?: string;
  preferredCurrency?: string;
  timezone?: string;
  notificationSettings?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<{ profile: UserProfile }> => {
    return api.get('/api/user/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<{ message: string; profile: UserProfile }> => {
    return api.put('/api/user/profile', data);
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    return api.post('/api/user/change-password', data);
  },

  /**
   * Get login history
   */
  getLoginHistory: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ history: LoginHistory[]; total: number }> => {
    return api.get('/api/user/login-history', params as Record<string, any>);
  },

  /**
   * Get active sessions
   */
  getActiveSessions: async (): Promise<{
    sessions: Array<{
      id: string;
      device: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>;
  }> => {
    return api.get('/api/user/sessions');
  },

  /**
   * Revoke a session
   */
  revokeSession: async (sessionId: string): Promise<{ message: string }> => {
    return api.delete(`/api/user/sessions/${sessionId}`);
  },

  /**
   * Revoke all other sessions
   */
  revokeAllOtherSessions: async (): Promise<{ message: string }> => {
    return api.post('/api/user/sessions/revoke-all');
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (file: File): Promise<{ message: string; avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.upload('/api/user/avatar', formData);
  },

  /**
   * Set avatar from URL (for predefined avatars)
   */
  setAvatarUrl: async (avatarUrl: string): Promise<{ message: string }> => {
    return api.put('/api/user/avatar', { avatarUrl });
  },

  /**
   * Delete account (requires password confirmation)
   */
  deleteAccount: async (password: string): Promise<{ message: string }> => {
    return api.post('/api/user/delete-account', { password });
  },

  /**
   * Export user data (GDPR)
   */
  exportData: async (): Promise<Blob> => {
    const response = await fetch('/api/user/export-data', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('crymadx_access_token')}`,
      },
    });
    return response.blob();
  },

  /**
   * Get user's KYC status
   */
  getKycStatus: async (): Promise<{
    status: 'not_started' | 'pending' | 'verified' | 'rejected';
    level: number;
    submittedAt?: string;
    rejectionReason?: string;
  }> => {
    return api.get('/api/user/kyc-status');
  },

  /**
   * Set anti-phishing code
   */
  setAntiPhishingCode: async (code: string): Promise<{ message: string }> => {
    return api.post('/api/user/anti-phishing', { code });
  },

  /**
   * Get anti-phishing status
   */
  getAntiPhishingStatus: async (): Promise<{ isSet: boolean; maskedCode: string | null }> => {
    return api.get('/api/user/anti-phishing');
  },

  /**
   * Format user display name
   */
  formatDisplayName: (user: User): string => {
    if (user.fullName) {
      return user.fullName;
    }
    // Extract name from email
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  },

  /**
   * Get initials for avatar fallback
   */
  getInitials: (user: User): string => {
    if (user.fullName) {
      const parts = user.fullName.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return user.fullName.slice(0, 2).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  },
};

export default userService;
