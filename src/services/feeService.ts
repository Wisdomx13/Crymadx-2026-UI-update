// CrymadX Fee Service
// Handles fee information and estimates

import { api } from './api';
import type { FeeStructure, FeeEstimate } from '../types/api';

export interface FeeEstimateRequest {
  chain: string;
  type: 'withdrawal' | 'swap';
  amount: string;
  tokenAddress?: string;
}

export const feeService = {
  /**
   * Get all platform fees
   */
  getAllFees: async (): Promise<{ fees: FeeStructure }> => {
    return api.get('/api/fees/fees', undefined, false);
  },

  /**
   * Get fees for specific chain
   */
  getChainFees: async (chain: string): Promise<{
    chain: string;
    withdrawal: {
      percentage: number;
      minimum: string;
      network: string;
    };
    gasPrice?: {
      slow: string;
      standard: string;
      fast: string;
    };
  }> => {
    return api.get(`/api/fees/fees/${chain}`, undefined, false);
  },

  /**
   * Estimate transaction fee
   */
  estimateFee: async (request: FeeEstimateRequest): Promise<{
    estimatedFee: FeeEstimate;
    gasEstimate?: {
      gasLimit: number;
      gasPrice: string;
      totalGas: string;
    };
  }> => {
    return api.post('/api/fees/fees/estimate', request, false);
  },

  /**
   * Calculate net amount after fees
   */
  calculateNetAmount: (amount: number, feePercent: number, fixedFee: number): number => {
    const percentFee = amount * (feePercent / 100);
    return Math.max(0, amount - percentFee - fixedFee);
  },

  /**
   * Format fee for display
   */
  formatFee: (fee: string | number, symbol?: string): string => {
    const num = typeof fee === 'string' ? parseFloat(fee) : fee;
    const formatted = num < 0.0001 ? num.toExponential(2) : num.toFixed(6);
    return symbol ? `${formatted} ${symbol}` : formatted;
  },

  /**
   * Format fee as USD
   */
  formatFeeUsd: (feeUsd: string | number): string => {
    const num = typeof feeUsd === 'string' ? parseFloat(feeUsd) : feeUsd;
    return `$${num.toFixed(2)}`;
  },

  /**
   * Get gas price recommendation
   */
  getGasRecommendation: (gasPrice: { slow: string; standard: string; fast: string }): {
    level: 'slow' | 'standard' | 'fast';
    price: string;
    description: string;
  } => {
    // Default to standard
    return {
      level: 'standard',
      price: gasPrice.standard,
      description: 'Recommended - typically confirms in ~3 minutes',
    };
  },
};

export default feeService;
