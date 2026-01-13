// CrymadX Price Service
// Handles cryptocurrency price data and conversions

import { api } from './api';
import type { PricesResponse, SinglePriceResponse, PriceData } from '../types/api';

export interface ConversionResult {
  from: {
    symbol: string;
    amount: string;
  };
  to: {
    currency: string;
    amount: string;
  };
  rate: number;
}

// API response format from backend
interface ApiPriceItem {
  symbol: string;
  price: number;
  change24h: number;
  lastUpdated: string;
}

interface ApiPricesResponse {
  prices: ApiPriceItem[];
  count: number;
}

export const priceService = {
  /**
   * Get current prices for all supported assets
   * Transforms API array format to Record<symbol, PriceData> for frontend
   */
  getAllPrices: async (vs: string = 'USD'): Promise<Record<string, PriceData>> => {
    const response = await api.get<ApiPricesResponse>('/api/prices', { vs }, false);

    // Transform array to Record<symbol, PriceData>
    const pricesRecord: Record<string, PriceData> = {};

    if (response?.prices && Array.isArray(response.prices)) {
      response.prices.forEach((item) => {
        pricesRecord[item.symbol] = {
          usd: item.price,
          change24h: item.change24h,
          volume24h: 0, // API doesn't provide volume yet
        };
      });
    }

    return pricesRecord;
  },

  /**
   * Get price for a specific asset
   */
  getPrice: async (symbol: string): Promise<SinglePriceResponse> => {
    return api.get<SinglePriceResponse>(`/api/prices/${symbol}`, undefined, false);
  },

  /**
   * Convert crypto amount to fiat
   */
  convert: async (symbol: string, amount: string, to: string = 'USD'): Promise<ConversionResult> => {
    return api.get<ConversionResult>(`/api/prices/convert/${symbol}/${amount}`, { to }, false);
  },

  /**
   * Format price for display
   */
  formatPrice: (price: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  },

  /**
   * Format percentage change
   */
  formatChange: (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  },

  /**
   * Get color for price change
   */
  getChangeColor: (change: number): string => {
    if (change > 0) return '#00e77f'; // Green
    if (change < 0) return '#ff3366'; // Red
    return '#8a8f98'; // Neutral
  },

  /**
   * Format large numbers (market cap, volume)
   */
  formatLargeNumber: (num: number): string => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    }
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  },

  /**
   * Sort prices by various criteria
   */
  sortPrices: (
    prices: Record<string, PriceData>,
    sortBy: 'name' | 'price' | 'change' | 'volume' = 'price',
    ascending: boolean = false
  ): Array<[string, PriceData]> => {
    const entries = Object.entries(prices);

    entries.sort(([aSymbol, aData], [bSymbol, bData]) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = aSymbol.localeCompare(bSymbol);
          break;
        case 'price':
          comparison = bData.usd - aData.usd;
          break;
        case 'change':
          comparison = bData.change24h - aData.change24h;
          break;
        case 'volume':
          comparison = bData.volume24h - aData.volume24h;
          break;
      }

      return ascending ? -comparison : comparison;
    });

    return entries;
  },

  /**
   * Calculate portfolio value change
   */
  calculatePortfolioChange: (
    holdings: Record<string, number>,
    prices: Record<string, PriceData>
  ): { totalValue: number; totalChange: number; changePercent: number } => {
    let totalValue = 0;
    let weightedChange = 0;

    Object.entries(holdings).forEach(([symbol, amount]) => {
      const priceData = prices[symbol];
      if (priceData) {
        const value = amount * priceData.usd;
        totalValue += value;
        weightedChange += value * (priceData.change24h / 100);
      }
    });

    const changePercent = totalValue > 0 ? (weightedChange / totalValue) * 100 : 0;

    return {
      totalValue,
      totalChange: weightedChange,
      changePercent,
    };
  },
};

export default priceService;
