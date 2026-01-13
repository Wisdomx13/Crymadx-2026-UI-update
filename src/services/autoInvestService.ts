// CrymadX Auto-Invest (DCA) Service
// Handles recurring investment plans

import { api } from './api';
import type { AutoInvestPlan, AutoInvestExecution } from '../types/api';

export type Frequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface CreatePlanRequest {
  name: string;
  asset: string;
  sourceAsset: string;
  amount: string;
  frequency: Frequency;
}

export interface UpdatePlanRequest {
  amount?: string;
  frequency?: Frequency;
  status?: 'active' | 'paused';
}

export const autoInvestService = {
  /**
   * Get user's auto-invest plans
   */
  getPlans: async (): Promise<{ plans: AutoInvestPlan[] }> => {
    return api.get('/api/autoinvest/plans');
  },

  /**
   * Get single plan details
   */
  getPlan: async (planId: string): Promise<{ plan: AutoInvestPlan }> => {
    return api.get(`/api/autoinvest/plans/${planId}`);
  },

  /**
   * Create a new auto-invest plan
   */
  createPlan: async (request: CreatePlanRequest): Promise<{
    message: string;
    plan: AutoInvestPlan;
  }> => {
    return api.post('/api/autoinvest/plans', request);
  },

  /**
   * Update an existing plan
   */
  updatePlan: async (planId: string, request: UpdatePlanRequest): Promise<{
    message: string;
    plan: AutoInvestPlan;
  }> => {
    return api.patch(`/api/autoinvest/plans/${planId}`, request);
  },

  /**
   * Delete a plan
   */
  deletePlan: async (planId: string): Promise<{ message: string }> => {
    return api.delete(`/api/autoinvest/plans/${planId}`);
  },

  /**
   * Pause a plan
   */
  pausePlan: async (planId: string): Promise<{ message: string }> => {
    return autoInvestService.updatePlan(planId, { status: 'paused' });
  },

  /**
   * Resume a paused plan
   */
  resumePlan: async (planId: string): Promise<{ message: string }> => {
    return autoInvestService.updatePlan(planId, { status: 'active' });
  },

  /**
   * Get execution history for a plan
   */
  getPlanHistory: async (planId: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<{
    history: AutoInvestExecution[];
    total: number;
  }> => {
    return api.get(`/api/autoinvest/plans/${planId}/history`, params as Record<string, any>);
  },

  /**
   * Execute a plan manually (one-time)
   */
  executeNow: async (planId: string): Promise<{
    message: string;
    execution: AutoInvestExecution;
  }> => {
    return api.post(`/api/autoinvest/plans/${planId}/execute`);
  },

  /**
   * Get frequency label
   */
  getFrequencyLabel: (frequency: Frequency): string => {
    const labels: Record<Frequency, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Every 2 Weeks',
      monthly: 'Monthly',
    };
    return labels[frequency];
  },

  /**
   * Calculate estimated annual investment
   */
  calculateAnnualInvestment: (amount: number, frequency: Frequency): number => {
    const multipliers: Record<Frequency, number> = {
      daily: 365,
      weekly: 52,
      biweekly: 26,
      monthly: 12,
    };
    return amount * multipliers[frequency];
  },

  /**
   * Get next execution time formatted
   */
  formatNextExecution: (nextExecution: string): string => {
    const date = new Date(nextExecution);
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return 'Overdue';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;

    const minutes = Math.floor(diff / (1000 * 60));
    return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  },

  /**
   * Get status color
   */
  getStatusColor: (status: string): string => {
    return status === 'active' ? '#00e77f' : '#f0b90b';
  },

  /**
   * Calculate average buy price
   */
  calculateAverageBuyPrice: (totalInvested: number, totalAcquired: number): number => {
    if (totalAcquired === 0) return 0;
    return totalInvested / totalAcquired;
  },
};

export default autoInvestService;
