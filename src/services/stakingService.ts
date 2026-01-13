// CrymadX Staking Service
// Handles staking positions, rewards, and operations

import { api } from './api';
import type { StakingOption, StakingPosition, StakingStats } from '../types/api';

export interface StakeRequest {
  chain: string;
  amount: string;
  protocol?: string;
}

export interface UnstakeRequest {
  positionId: string;
  amount?: string; // Optional - defaults to full amount
}

export const stakingService = {
  /**
   * Get available staking options
   */
  getOptions: async (): Promise<{ options: StakingOption[] }> => {
    return api.get('/api/staking/options', undefined, false);
  },

  /**
   * Get user's staking positions
   */
  getPositions: async (): Promise<{
    positions: StakingPosition[];
    totalStakedUsd: string;
    totalRewardsUsd: string;
  }> => {
    return api.get('/api/staking/positions');
  },

  /**
   * Stake assets
   */
  stake: async (request: StakeRequest): Promise<{
    message: string;
    position: {
      id: string;
      chain: string;
      amount: string;
      status: string;
      txHash?: string;
    };
  }> => {
    return api.post('/api/staking/stake', request);
  },

  /**
   * Unstake assets
   */
  unstake: async (request: UnstakeRequest): Promise<{
    message: string;
    unstake: {
      id: string;
      amount: string;
      status: string;
      estimatedCompletion: string;
    };
  }> => {
    return api.post('/api/staking/unstake', request);
  },

  /**
   * Claim staking rewards
   */
  claimRewards: async (positionId: string): Promise<{
    message: string;
    claimed: {
      amount: string;
      txHash?: string;
    };
  }> => {
    return api.post(`/api/staking/positions/${positionId}/claim`);
  },

  /**
   * Get staking statistics
   */
  getStats: async (): Promise<{ totalStaked: number; totalRewards: number; positions: number }> => {
    try {
      const response = await api.get<{ stats: StakingStats }>('/api/staking/stats');
      return {
        totalStaked: parseFloat(response.stats?.totalStaked || '0'),
        totalRewards: parseFloat(response.stats?.totalRewards || '0'),
        positions: response.stats?.positions || 0,
      };
    } catch (error) {
      console.warn('Failed to fetch staking stats');
      return { totalStaked: 0, totalRewards: 0, positions: 0 };
    }
  },

  /**
   * Calculate estimated rewards
   */
  calculateRewards: (amount: number, apy: number, days: number): number => {
    const dailyRate = apy / 100 / 365;
    return amount * dailyRate * days;
  },

  /**
   * Format APY for display
   */
  formatApy: (apy: number): string => {
    return `${apy.toFixed(2)}%`;
  },

  /**
   * Get protocol display info
   */
  getProtocolInfo: (protocol: string): { name: string; icon: string; color: string } => {
    const protocols: Record<string, { name: string; icon: string; color: string }> = {
      lido: { name: 'Lido', icon: '🔷', color: '#00a3ff' },
      marinade: { name: 'Marinade', icon: '🍝', color: '#ff6b6b' },
      rocket_pool: { name: 'Rocket Pool', icon: '🚀', color: '#ff9500' },
      native: { name: 'Native Staking', icon: '⭐', color: '#00e77f' },
    };

    return protocols[protocol] || { name: protocol, icon: '💎', color: '#02c076' };
  },

  /**
   * Format unbonding period
   */
  formatUnbondingPeriod: (days: number): string => {
    if (days === 0) return 'Instant';
    if (days === 1) return '1 day';
    return `${days} days`;
  },

  /**
   * Check if position can be unstaked
   */
  canUnstake: (position: StakingPosition): boolean => {
    // Check if there's any staked amount
    return parseFloat(position.stakedAmount) > 0;
  },
};

export default stakingService;
