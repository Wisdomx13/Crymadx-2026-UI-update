// Token Service - Fetches platform-supported tokens from the backend
// These are the cryptocurrencies available for deposits, withdrawals, and trading

import { api } from './api';

export type NetworkType =
  | 'ethereum'
  | 'bsc'
  | 'polygon'
  | 'arbitrum'
  | 'optimism'
  | 'avalanche'
  | 'solana'
  | 'tron'
  | 'bitcoin'
  | 'litecoin'
  | 'ripple'
  | 'stellar'
  | 'dogecoin';

export interface TokenNetwork {
  id: string;
  network: NetworkType;
  networkName: string;
  contractAddress: string | null;
  decimals: number;
  isNative: boolean;
  depositEnabled: boolean;
  withdrawEnabled: boolean;
  swapEnabled: boolean;
  minDeposit: string;
  minWithdraw: string;
  withdrawFee: string;
  confirmations: number;
}

export interface Token {
  _id: string;
  symbol: string;
  name: string;
  network: NetworkType;
  contractAddress?: string;
  decimals: number;
  logoUrl?: string;
  isNative: boolean;
  status: 'active' | 'inactive' | 'pending';
  depositEnabled: boolean;
  withdrawEnabled: boolean;
  swapEnabled: boolean;
  minDeposit: string;
  minWithdraw: string;
  withdrawFee: string;
  confirmations: number;
}

export interface GroupedToken {
  symbol: string;
  name: string;
  logoUrl?: string;
  networks: TokenNetwork[];
}

export interface Network {
  id: NetworkType;
  name: string;
  chainId?: number;
  nativeCurrency: string;
  isEVM: boolean;
}

// Cache for tokens (5 minute TTL)
let tokensCache: Token[] | null = null;
let groupedTokensCache: GroupedToken[] | null = null;
let networksCache: Network[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const isCacheValid = () => Date.now() - cacheTimestamp < CACHE_TTL;

export const tokenService = {
  /**
   * Get all active tokens (flat list)
   */
  getAllTokens: async (forceRefresh = false): Promise<Token[]> => {
    if (!forceRefresh && tokensCache && isCacheValid()) {
      return tokensCache;
    }

    const response = await api.get<{ tokens: Token[] }>('/api/tokens', undefined, false);
    tokensCache = response.tokens;
    cacheTimestamp = Date.now();
    return response.tokens;
  },

  /**
   * Get tokens grouped by symbol (for UI display)
   * Each symbol shows all available networks
   */
  getGroupedTokens: async (forceRefresh = false): Promise<GroupedToken[]> => {
    if (!forceRefresh && groupedTokensCache && isCacheValid()) {
      return groupedTokensCache;
    }

    const response = await api.get<{ tokens: GroupedToken[]; total: number }>(
      '/api/tokens/grouped',
      undefined,
      false
    );
    groupedTokensCache = response.tokens;
    cacheTimestamp = Date.now();
    return response.tokens;
  },

  /**
   * Get token by symbol with all available networks
   */
  getTokenBySymbol: async (symbol: string): Promise<{
    symbol: string;
    name: string;
    logoUrl?: string;
    networks: TokenNetwork[];
  } | null> => {
    try {
      const response = await api.get<{
        symbol: string;
        name: string;
        logoUrl?: string;
        networks: TokenNetwork[];
      }>(`/api/tokens/symbol/${symbol.toUpperCase()}`, undefined, false);
      return response;
    } catch (error) {
      console.error(`Token ${symbol} not found:`, error);
      return null;
    }
  },

  /**
   * Get supported networks
   */
  getNetworks: async (forceRefresh = false): Promise<Network[]> => {
    if (!forceRefresh && networksCache && isCacheValid()) {
      return networksCache;
    }

    const response = await api.get<{ networks: Network[] }>('/api/tokens/networks', undefined, false);
    networksCache = response.networks;
    return response.networks;
  },

  /**
   * Get tokens available for deposit
   */
  getDepositableTokens: async (): Promise<GroupedToken[]> => {
    const tokens = await tokenService.getGroupedTokens();
    return tokens.filter(token =>
      token.networks.some(n => n.depositEnabled)
    ).map(token => ({
      ...token,
      networks: token.networks.filter(n => n.depositEnabled),
    }));
  },

  /**
   * Get tokens available for withdrawal
   */
  getWithdrawableTokens: async (): Promise<GroupedToken[]> => {
    const tokens = await tokenService.getGroupedTokens();
    return tokens.filter(token =>
      token.networks.some(n => n.withdrawEnabled)
    ).map(token => ({
      ...token,
      networks: token.networks.filter(n => n.withdrawEnabled),
    }));
  },

  /**
   * Get tokens available for swap/convert
   */
  getSwappableTokens: async (): Promise<GroupedToken[]> => {
    const tokens = await tokenService.getGroupedTokens();
    return tokens.filter(token =>
      token.networks.some(n => n.swapEnabled)
    ).map(token => ({
      ...token,
      networks: token.networks.filter(n => n.swapEnabled),
    }));
  },

  /**
   * Find specific token by symbol and network
   */
  findToken: async (symbol: string, network: NetworkType): Promise<Token | null> => {
    const tokens = await tokenService.getAllTokens();
    return tokens.find(t =>
      t.symbol.toUpperCase() === symbol.toUpperCase() && t.network === network
    ) || null;
  },

  /**
   * Get token logo URL with fallback
   */
  getTokenLogo: (token: { symbol: string; logoUrl?: string }): string => {
    if (token.logoUrl) return token.logoUrl;
    // Fallback to CoinGecko or placeholder
    return `https://assets.coingecko.com/coins/images/1/small/${token.symbol.toLowerCase()}.png`;
  },

  /**
   * Clear the cache (call after token updates)
   */
  clearCache: () => {
    tokensCache = null;
    groupedTokensCache = null;
    networksCache = null;
    cacheTimestamp = 0;
  },
};

export default tokenService;
