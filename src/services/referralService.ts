// CrymadX Referral Service
// Handles referral codes, tracking, and rewards

import { api } from './api';
import type { ReferralInfo, Referral, ReferralRewards } from '../types/api';

export const referralService = {
  /**
   * Get referral program info (public)
   */
  getProgramInfo: async (): Promise<{
    program: {
      rewardType: string;
      rewardPercentage: number;
      description: string;
      minTradeVolume: string;
      cooldownDays: number;
    };
  }> => {
    return api.get('/api/referral/info', undefined, false);
  },

  /**
   * Get user's referral code and link
   */
  getReferralCode: async (): Promise<ReferralInfo> => {
    return api.get('/api/referral/code');
  },

  /**
   * Apply a referral code (for new users)
   */
  applyReferralCode: async (referralCode: string): Promise<{
    message: string;
    referrer: string;
  }> => {
    return api.post('/api/referral/apply', { referralCode });
  },

  /**
   * Get list of user's referrals
   */
  getReferrals: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ referrals: Referral[]; total: number }> => {
    return api.get('/api/referral/referrals', params as Record<string, any>);
  },

  /**
   * Get referral rewards summary
   */
  getRewards: async (): Promise<{
    rewards: ReferralRewards;
    history: Array<{
      amount: string;
      source: string;
      status: 'pending' | 'paid';
      createdAt: string;
    }>;
  }> => {
    return api.get('/api/referral/rewards');
  },

  /**
   * Generate referral link
   */
  generateReferralLink: (code: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?ref=${code}`;
  },

  /**
   * Copy referral link to clipboard
   */
  copyReferralLink: async (code: string): Promise<boolean> => {
    const link = referralService.generateReferralLink(code);
    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  },

  /**
   * Copy referral code to clipboard
   */
  copyReferralCode: async (code: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  },

  /**
   * Format reward amount
   */
  formatReward: (amount: string, currency: string = 'USDT'): string => {
    const num = parseFloat(amount);
    return `${num.toFixed(2)} ${currency}`;
  },

  /**
   * Get referral status badge color
   */
  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      pending: '#f0b90b',
      qualified: '#00e77f',
      active: '#00d4aa',
      inactive: '#8a8f98',
    };
    return colors[status] || '#8a8f98';
  },

  /**
   * Calculate potential earnings
   */
  calculatePotentialEarnings: (
    referralVolume: number,
    commissionRate: number
  ): number => {
    return referralVolume * (commissionRate / 100);
  },
};

export default referralService;
