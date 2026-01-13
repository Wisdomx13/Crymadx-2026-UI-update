// CrymadX Withdrawal Service
// Handles withdrawals and withdrawal verification

import { api } from './api';
import { chainConfigs } from './depositService';

export interface WithdrawalFeeEstimate {
  chain: string;
  networkFee: string;
  platformFee: string;
  totalFee: string;
  estimatedTime: string;
  minWithdrawal: string;
  maxWithdrawal: string;
}

export interface WithdrawalRequest {
  chain: string;
  amount: string;
  address: string;
  memo?: string;
  tag?: string;
  tokenAddress?: string;
  verificationToken?: string;
}

export interface WithdrawalResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: string;
  fee: string;
  netAmount: string;
  txHash?: string;
  estimatedCompletion?: string;
  createdAt: string;
}

export interface WithdrawalHistory {
  id: string;
  chain: string;
  amount: string;
  fee: string;
  netAmount: string;
  address: string;
  txHash?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

// Withdrawal limits by chain
export const withdrawalLimits: Record<string, {
  minWithdrawal: string;
  maxWithdrawal: string;
  dailyLimit: string;
  networkFee: string;
}> = {
  btc: { minWithdrawal: '0.0005', maxWithdrawal: '10', dailyLimit: '5', networkFee: '0.0001' },
  eth: { minWithdrawal: '0.01', maxWithdrawal: '100', dailyLimit: '50', networkFee: '0.005' },
  bsc: { minWithdrawal: '0.1', maxWithdrawal: '1000', dailyLimit: '500', networkFee: '0.001' },
  sol: { minWithdrawal: '0.1', maxWithdrawal: '5000', dailyLimit: '2500', networkFee: '0.01' },
  trx: { minWithdrawal: '10', maxWithdrawal: '100000', dailyLimit: '50000', networkFee: '1' },
  matic: { minWithdrawal: '10', maxWithdrawal: '50000', dailyLimit: '25000', networkFee: '1' },
  avax: { minWithdrawal: '0.5', maxWithdrawal: '1000', dailyLimit: '500', networkFee: '0.01' },
  arb: { minWithdrawal: '0.01', maxWithdrawal: '100', dailyLimit: '50', networkFee: '0.001' },
  op: { minWithdrawal: '0.01', maxWithdrawal: '100', dailyLimit: '50', networkFee: '0.001' },
  usdt: { minWithdrawal: '10', maxWithdrawal: '100000', dailyLimit: '50000', networkFee: '1' },
  usdc: { minWithdrawal: '10', maxWithdrawal: '100000', dailyLimit: '50000', networkFee: '1' },
};

export const withdrawalService = {
  /**
   * Get withdrawal fee estimate
   */
  getFeeEstimate: async (chain: string, amount: string): Promise<WithdrawalFeeEstimate> => {
    try {
      return await api.get<WithdrawalFeeEstimate>('/api/balance/withdraw/fee', {
        chain,
        amount,
      });
    } catch (error) {
      // Fallback to local config
      const limits = withdrawalLimits[chain.toLowerCase()] || {
        minWithdrawal: '0.01',
        maxWithdrawal: '1000',
        dailyLimit: '500',
        networkFee: '0.001',
      };

      const chainConfig = chainConfigs[chain.toLowerCase()];
      const networkFee = limits.networkFee;
      const platformFee = '0'; // Platform doesn't charge extra

      return {
        chain,
        networkFee,
        platformFee,
        totalFee: networkFee,
        estimatedTime: chainConfig ? `~${chainConfig.confirmations * 10} seconds` : '~10 minutes',
        minWithdrawal: limits.minWithdrawal,
        maxWithdrawal: limits.maxWithdrawal,
      };
    }
  },

  /**
   * Request OTP for withdrawal verification
   */
  requestWithdrawalOTP: async (): Promise<{ message: string }> => {
    return api.post('/api/otp/send', { purpose: 'withdrawal' });
  },

  /**
   * Verify OTP and get verification token
   */
  verifyWithdrawalOTP: async (code: string): Promise<{ verified: boolean; token?: string }> => {
    return api.post('/api/otp/verify', { code, purpose: 'withdrawal' });
  },

  /**
   * Create withdrawal request
   */
  createWithdrawal: async (request: WithdrawalRequest): Promise<{
    message: string;
    withdrawal: WithdrawalResponse;
  }> => {
    return api.post('/api/balance/withdraw', request);
  },

  /**
   * Get withdrawal status
   */
  getWithdrawalStatus: async (withdrawalId: string): Promise<WithdrawalResponse> => {
    const response = await api.get<{ withdrawal: WithdrawalResponse }>(`/api/balance/withdrawals/${withdrawalId}`);
    return response.withdrawal;
  },

  /**
   * Get withdrawal history
   */
  getWithdrawalHistory: async (filters?: {
    chain?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ withdrawals: WithdrawalHistory[]; total: number }> => {
    return api.get('/api/balance/transactions', {
      ...filters,
      type: 'withdrawal',
    });
  },

  /**
   * Cancel pending withdrawal
   */
  cancelWithdrawal: async (withdrawalId: string): Promise<{ message: string }> => {
    return api.post(`/api/balance/withdrawals/${withdrawalId}/cancel`, {});
  },

  /**
   * Validate withdrawal address format
   */
  validateAddress: (chain: string, address: string): { valid: boolean; error?: string } => {
    const chainLower = chain.toLowerCase();

    // Basic validation patterns
    const patterns: Record<string, RegExp> = {
      btc: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/,
      eth: /^0x[a-fA-F0-9]{40}$/,
      bsc: /^0x[a-fA-F0-9]{40}$/,
      matic: /^0x[a-fA-F0-9]{40}$/,
      arb: /^0x[a-fA-F0-9]{40}$/,
      op: /^0x[a-fA-F0-9]{40}$/,
      base: /^0x[a-fA-F0-9]{40}$/,
      avax: /^0x[a-fA-F0-9]{40}$/,
      sol: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      trx: /^T[a-zA-Z0-9]{33}$/,
    };

    const pattern = patterns[chainLower];
    if (!pattern) {
      // Unknown chain, allow any address
      return { valid: address.length > 10, error: address.length <= 10 ? 'Address too short' : undefined };
    }

    if (!pattern.test(address)) {
      return { valid: false, error: `Invalid ${chain.toUpperCase()} address format` };
    }

    return { valid: true };
  },

  /**
   * Get withdrawal limits for a chain
   */
  getLimits: (chain: string): {
    minWithdrawal: string;
    maxWithdrawal: string;
    dailyLimit: string;
    networkFee: string;
  } => {
    return withdrawalLimits[chain.toLowerCase()] || {
      minWithdrawal: '0.01',
      maxWithdrawal: '1000',
      dailyLimit: '500',
      networkFee: '0.001',
    };
  },

  /**
   * Format withdrawal status for display
   */
  getStatusDisplay: (status: WithdrawalHistory['status']): { text: string; color: string } => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: 'Pending', color: '#f0b90b' },
      processing: { text: 'Processing', color: '#00d4aa' },
      completed: { text: 'Completed', color: '#00e77f' },
      failed: { text: 'Failed', color: '#ff3366' },
      cancelled: { text: 'Cancelled', color: '#8a8f98' },
    };

    return statusMap[status] || { text: status, color: '#8a8f98' };
  },
};

export default withdrawalService;
