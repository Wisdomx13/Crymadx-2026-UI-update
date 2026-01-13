// CrymadX Portfolio Service
// Handles portfolio analytics and performance tracking
// Calculates portfolio data from user balances and live prices

import { balanceService } from './balanceService';
import { priceService } from './priceService';
import type { PortfolioOverview, PortfolioAllocation, PortfolioPerformance } from '../types/api';

export type TimePeriod = '1d' | '7d' | '30d' | '90d' | '1y' | 'all';

export const portfolioService = {
  /**
   * Get portfolio overview - calculated from real balances and prices
   */
  getOverview: async (): Promise<{
    portfolio: PortfolioOverview;
    allocation: PortfolioAllocation[];
  }> => {
    try {
      // Fetch balances and prices in parallel
      const [balances, prices] = await Promise.all([
        balanceService.getAllBalances(),
        priceService.getAllPrices(),
      ]);

      let totalValue = 0;
      let totalChange24h = 0;
      const allocations: PortfolioAllocation[] = [];

      // Calculate total value and allocation for each asset
      for (const balance of balances) {
        const symbol = balance.currency.toUpperCase();
        const amount = parseFloat(balance.available) + parseFloat(balance.locked || '0');

        if (amount <= 0) continue;

        // Get price data
        const priceData = prices[symbol];
        let usdValue = 0;
        let change24h = 0;

        if (symbol === 'USDT' || symbol === 'USD' || symbol === 'USDC') {
          // Stablecoins are $1
          usdValue = amount;
          change24h = 0;
        } else if (priceData) {
          usdValue = amount * priceData.usd;
          change24h = priceData.change24h;
        }

        if (usdValue > 0.01) {
          totalValue += usdValue;
          totalChange24h += usdValue * (change24h / 100);
          allocations.push({
            asset: symbol,
            value: usdValue.toFixed(2),
            percent: 0, // Will calculate after total is known
          });
        }
      }

      // Calculate percentages
      allocations.forEach(alloc => {
        alloc.percent = totalValue > 0 ? (parseFloat(alloc.value) / totalValue) * 100 : 0;
      });

      // Sort by value descending
      allocations.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

      // Take top 5 and group rest as "Others"
      let finalAllocations = allocations.slice(0, 5);
      if (allocations.length > 5) {
        const othersValue = allocations.slice(5).reduce((sum, a) => sum + parseFloat(a.value), 0);
        const othersPercent = allocations.slice(5).reduce((sum, a) => sum + a.percent, 0);
        if (othersValue > 0.01) {
          finalAllocations.push({
            asset: 'Others',
            value: othersValue.toFixed(2),
            percent: othersPercent,
          });
        }
      }

      // Calculate 24h change percentage
      const change24hPercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;

      // Create portfolio overview
      // Note: Total cost and PnL would need transaction history to calculate accurately
      // For now, we estimate based on current value
      const portfolio: PortfolioOverview = {
        totalValue: totalValue.toFixed(2),
        totalCost: totalValue.toFixed(2), // Would need deposit history
        totalPnl: '0.00', // Would need transaction history
        totalPnlPercent: 0,
        change24h: totalChange24h.toFixed(2),
        change24hPercent,
      };

      return { portfolio, allocation: finalAllocations };
    } catch (error) {
      console.error('Failed to calculate portfolio overview:', error);
      // Return empty portfolio on error
      return {
        portfolio: {
          totalValue: '0.00',
          totalCost: '0.00',
          totalPnl: '0.00',
          totalPnlPercent: 0,
          change24h: '0.00',
          change24hPercent: 0,
        },
        allocation: [],
      };
    }
  },

  /**
   * Get portfolio value history
   * Note: Without historical balance data, we generate a simulated chart
   */
  getHistory: async (period: TimePeriod = '30d'): Promise<{
    history: Array<{
      timestamp: string;
      value: string;
    }>;
  }> => {
    // Get current portfolio value
    const { portfolio } = await portfolioService.getOverview();
    const currentValue = parseFloat(portfolio.totalValue);

    // Generate simulated history based on period
    // In production, this would come from historical balance snapshots
    const dataPoints = portfolioService.getDataPointsForPeriod(period);
    const history: Array<{ timestamp: string; value: string }> = [];
    const now = new Date();

    for (let i = dataPoints; i >= 0; i--) {
      const date = new Date(now);
      const millisPerPoint = portfolioService.getMillisPerPeriod(period) / dataPoints;
      date.setTime(date.getTime() - (i * millisPerPoint));

      // Simulate some variance (±5%)
      const variance = 1 + (Math.sin(i * 0.5) * 0.05);
      const value = currentValue * variance;

      history.push({
        timestamp: date.toISOString(),
        value: value.toFixed(2),
      });
    }

    return { history };
  },

  /**
   * Get performance metrics
   */
  getPerformance: async (): Promise<{ performance: PortfolioPerformance }> => {
    const { portfolio } = await portfolioService.getOverview();
    const change24hPercent = portfolio.change24hPercent;

    // Simulate other timeframe performances based on 24h change
    // In production, this would come from historical data
    const performance: PortfolioPerformance = {
      daily: { return: change24hPercent, pnl: portfolio.change24h },
      weekly: { return: change24hPercent * 2.5, pnl: (parseFloat(portfolio.change24h) * 2.5).toFixed(2) },
      monthly: { return: change24hPercent * 8, pnl: (parseFloat(portfolio.change24h) * 8).toFixed(2) },
      yearly: { return: change24hPercent * 50, pnl: (parseFloat(portfolio.change24h) * 50).toFixed(2) },
      allTime: { return: change24hPercent * 50, pnl: (parseFloat(portfolio.change24h) * 50).toFixed(2) },
    };

    return { performance };
  },

  /**
   * Helper: Get number of data points for chart based on period
   */
  getDataPointsForPeriod: (period: TimePeriod): number => {
    const points: Record<TimePeriod, number> = {
      '1d': 24,
      '7d': 28,
      '30d': 30,
      '90d': 45,
      '1y': 52,
      all: 60,
    };
    return points[period];
  },

  /**
   * Helper: Get milliseconds for period
   */
  getMillisPerPeriod: (period: TimePeriod): number => {
    const day = 24 * 60 * 60 * 1000;
    const millis: Record<TimePeriod, number> = {
      '1d': day,
      '7d': 7 * day,
      '30d': 30 * day,
      '90d': 90 * day,
      '1y': 365 * day,
      all: 365 * 2 * day,
    };
    return millis[period];
  },

  /**
   * Format currency value
   */
  formatCurrency: (value: string | number, currency: string = 'USD'): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  },

  /**
   * Format percentage
   */
  formatPercent: (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  },

  /**
   * Get color for value change
   */
  getChangeColor: (value: number): string => {
    if (value > 0) return '#00e77f';
    if (value < 0) return '#ff3366';
    return '#8a8f98';
  },

  /**
   * Calculate portfolio diversity score (0-100)
   */
  calculateDiversityScore: (allocation: PortfolioAllocation[]): number => {
    if (allocation.length === 0) return 0;
    if (allocation.length === 1) return 10;

    // Use Herfindahl-Hirschman Index (HHI)
    const hhi = allocation.reduce((sum, asset) => {
      return sum + Math.pow(asset.percent, 2);
    }, 0);

    // Convert HHI to 0-100 score (lower HHI = more diverse = higher score)
    // Perfect monopoly HHI = 10000, perfect competition approaches 0
    const maxHHI = 10000;
    const score = Math.max(0, 100 - (hhi / maxHHI) * 100);

    return Math.round(score);
  },

  /**
   * Get time period label
   */
  getPeriodLabel: (period: TimePeriod): string => {
    const labels: Record<TimePeriod, string> = {
      '1d': '24 Hours',
      '7d': '7 Days',
      '30d': '30 Days',
      '90d': '90 Days',
      '1y': '1 Year',
      all: 'All Time',
    };
    return labels[period];
  },

  /**
   * Generate chart data from history
   */
  generateChartData: (
    history: Array<{ timestamp: string; value: string }>
  ): Array<{ date: string; value: number }> => {
    return history.map((point) => ({
      date: new Date(point.timestamp).toLocaleDateString(),
      value: parseFloat(point.value),
    }));
  },

  /**
   * Calculate allocation percentages from balances
   */
  calculateAllocation: (
    balances: Array<{ symbol: string; balanceUsd: string }>
  ): PortfolioAllocation[] => {
    const total = balances.reduce((sum, b) => sum + parseFloat(b.balanceUsd), 0);

    if (total === 0) return [];

    return balances
      .map((balance) => ({
        asset: balance.symbol,
        value: balance.balanceUsd,
        percent: (parseFloat(balance.balanceUsd) / total) * 100,
      }))
      .filter((a) => a.percent > 0)
      .sort((a, b) => b.percent - a.percent);
  },
};

export default portfolioService;
