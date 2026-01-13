// CrymadX Swap Service
// Handles cryptocurrency swaps and conversions

import { api } from './api';
import type { SwapPair, SwapEstimate, SwapOrder } from '../types/api';

export interface SwapEstimateRequest {
  fromChain: string;    // Chain identifier: ETH, TRX, SOL, MATIC, etc.
  fromToken: string;    // Token symbol: USDT, ETH, BTC, etc.
  toChain: string;      // Chain identifier
  toToken: string;      // Token symbol
  amount: string;
  flow?: 'standard' | 'fixed';
}

export interface CreateSwapRequest {
  fromChain: string;
  fromToken: string;
  toChain: string;
  toToken: string;
  amount: string;
  destinationAddress: string;  // Required: address to receive swapped tokens
  flow?: 'standard' | 'fixed';
  rateId?: string;
  slippageTolerance?: number;
}

export const swapService = {
  /**
   * Get available swap pairs
   */
  getPairs: async (): Promise<{ pairs: SwapPair[] }> => {
    return api.get('/api/swap/pairs', undefined, false);
  },

  /**
   * Get swap estimate/quote
   */
  getEstimate: async (request: SwapEstimateRequest): Promise<{ estimate: SwapEstimate }> => {
    return api.post('/api/swap/estimate', request);
  },

  /**
   * Create a swap order
   */
  createSwap: async (request: CreateSwapRequest): Promise<{ order: SwapOrder }> => {
    return api.post('/api/swap/create', request);
  },

  /**
   * Get swap order status
   */
  getSwapStatus: async (orderId: string): Promise<{ order: SwapOrder }> => {
    return api.get(`/api/swap/status/${orderId}`);
  },

  /**
   * Get swap history
   */
  getSwapHistory: async (filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ orders: SwapOrder[]; total: number }> => {
    return api.get('/api/swap/history', filters as Record<string, any>);
  },

  /**
   * Calculate minimum receive amount with slippage
   */
  calculateMinReceive: (estimatedAmount: string, slippagePercent: number): string => {
    const amount = parseFloat(estimatedAmount);
    const minAmount = amount * (1 - slippagePercent / 100);
    return minAmount.toString();
  },

  /**
   * Format swap rate for display
   */
  formatRate: (rate: string | number, fromSymbol: string, toSymbol: string): string => {
    const rateNum = typeof rate === 'string' ? parseFloat(rate) : rate;
    return `1 ${fromSymbol} = ${rateNum.toFixed(6)} ${toSymbol}`;
  },

  /**
   * Get status display text and color
   */
  getStatusDisplay: (status: SwapOrder['status']): { text: string; color: string } => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: 'Pending', color: '#f0b90b' },
      waiting: { text: 'Waiting for deposit', color: '#f0b90b' },
      confirming: { text: 'Confirming', color: '#00d4aa' },
      exchanging: { text: 'Exchanging', color: '#00d4aa' },
      sending: { text: 'Sending', color: '#00d4aa' },
      finished: { text: 'Completed', color: '#00e77f' },
      failed: { text: 'Failed', color: '#ff3366' },
      refunded: { text: 'Refunded', color: '#8a8f98' },
    };

    return statusMap[status] || { text: status, color: '#8a8f98' };
  },

  /**
   * Check if swap is still pending/in progress
   */
  isSwapPending: (status: SwapOrder['status']): boolean => {
    return ['pending', 'waiting', 'confirming', 'exchanging', 'sending'].includes(status);
  },
};

export default swapService;
