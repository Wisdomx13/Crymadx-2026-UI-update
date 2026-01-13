// CrymadX Savings Service
// Handles savings products, deposits, and withdrawals

import { api } from './api';
import type { SavingsProduct, SavingsDeposit } from '../types/api';

export interface CreateDepositRequest {
  productId: string;
  asset: string;
  amount: string;
  autoRenew?: boolean;
}

export interface WithdrawSavingsRequest {
  depositId: string;
  amount?: string; // Optional for flexible, full for fixed
}

export interface SavingsStats {
  activeDeposits: number;
  totalDeposited: string;
  totalInterestEarned: string;
  totalValue: string;
}

export const savingsService = {
  /**
   * Get available savings products
   */
  getProducts: async (): Promise<{ products: SavingsProduct[] }> => {
    return api.get('/api/savings/products');
  },

  /**
   * Get user's savings deposits
   */
  getDeposits: async (): Promise<{
    deposits: SavingsDeposit[];
    totalDeposited: string;
    totalInterest: string;
  }> => {
    return api.get('/api/savings/deposits');
  },

  /**
   * Get user's savings stats (totals)
   */
  getStats: async (): Promise<SavingsStats> => {
    try {
      return await api.get('/api/savings/stats');
    } catch (error) {
      console.warn('Failed to fetch savings stats');
      return {
        activeDeposits: 0,
        totalDeposited: '0',
        totalInterestEarned: '0',
        totalValue: '0',
      };
    }
  },

  /**
   * Create a new savings deposit
   */
  createDeposit: async (request: CreateDepositRequest): Promise<{
    message: string;
    deposit: SavingsDeposit;
  }> => {
    return api.post('/api/savings/deposit', request);
  },

  /**
   * Withdraw from savings
   */
  withdraw: async (request: WithdrawSavingsRequest): Promise<{
    message: string;
    withdrawal: {
      amount: string;
      interest: string;
      total: string;
      status: string;
    };
  }> => {
    return api.post('/api/savings/withdraw', request);
  },

  /**
   * Toggle auto-renew for a deposit
   */
  toggleAutoRenew: async (depositId: string, autoRenew: boolean): Promise<{ message: string }> => {
    return api.patch(`/api/savings/deposits/${depositId}`, { autoRenew });
  },

  /**
   * Calculate estimated earnings
   */
  calculateEarnings: (amount: number, apy: number, days: number): number => {
    const dailyRate = apy / 100 / 365;
    return amount * dailyRate * days;
  },

  /**
   * Format APY for display
   */
  formatApy: (apy: number): string => {
    return `${apy.toFixed(2)}% APY`;
  },

  /**
   * Get product type label
   */
  getProductTypeLabel: (lockPeriod: number): string => {
    if (lockPeriod === 0) return 'Flexible';
    if (lockPeriod <= 7) return `${lockPeriod}-Day`;
    if (lockPeriod <= 30) return `${lockPeriod}-Day`;
    if (lockPeriod <= 90) return `${lockPeriod}-Day`;
    return `${lockPeriod}-Day`;
  },

  /**
   * Check if deposit can be withdrawn early
   */
  canWithdrawEarly: (deposit: SavingsDeposit): boolean => {
    // Flexible deposits can always be withdrawn
    if (!deposit.unlockDate) return true;

    // Check if lock period has passed
    const unlockDate = new Date(deposit.unlockDate);
    return new Date() >= unlockDate;
  },

  /**
   * Calculate days until unlock
   */
  daysUntilUnlock: (unlockDate: string): number => {
    const unlock = new Date(unlockDate);
    const now = new Date();
    const diff = unlock.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  },
};

export default savingsService;
