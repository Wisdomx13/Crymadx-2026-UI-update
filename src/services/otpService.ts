// CrymadX OTP Service
// Handles email OTP for sensitive operations

import { api } from './api';

export type OTPAction = 'withdrawal' | 'large_swap' | 'disable_2fa' | 'delete_account';

export const otpService = {
  /**
   * Send OTP to user's email
   */
  sendOTP: async (action: OTPAction): Promise<{
    message: string;
    expiresIn: number;
  }> => {
    return api.post('/api/otp/send', { action });
  },

  /**
   * Verify OTP code
   */
  verifyOTP: async (code: string, action: OTPAction): Promise<{
    message: string;
    verificationToken: string;
    expiresIn: number;
  }> => {
    return api.post('/api/otp/verify', { code, action });
  },

  /**
   * Get action description for display
   */
  getActionDescription: (action: OTPAction): string => {
    const descriptions: Record<OTPAction, string> = {
      withdrawal: 'Withdrawal Request',
      large_swap: 'Large Swap Transaction',
      disable_2fa: 'Disable Two-Factor Authentication',
      delete_account: 'Delete Account',
    };
    return descriptions[action];
  },

  /**
   * Format expiry time
   */
  formatExpiry: (expiresIn: number): string => {
    const minutes = Math.floor(expiresIn / 60);
    const seconds = expiresIn % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
};

export default otpService;
