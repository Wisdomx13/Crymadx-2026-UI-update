// CrymadX Balance Service
// Handles wallet balances, transactions, deposits, withdrawals, and wallet transfers

import { api } from './api';
import type {
  BalancesResponse,
  ChainBalance,
  Transaction,
  WalletAddress,
  PaginatedResponse,
} from '../types/api';
import { allAssets } from '../config/assets';

// Wallet types
export type WalletType = 'spot' | 'funding' | 'earn';

export interface TransactionFilters {
  chain?: string;
  type?: 'deposit' | 'withdrawal' | 'swap' | 'stake' | 'unstake';
  status?: string;
  limit?: number;
  offset?: number;
}

export interface WithdrawalRequest {
  chain: string;
  amount: string;
  address: string;
  memo?: string;
  tokenAddress?: string;
  verificationToken?: string; // From OTP verification
}

export interface TransferRequest {
  fromWallet: WalletType;
  toWallet: WalletType;
  chain: string;
  token: string;
  amount: string;
}

export interface TransferResponse {
  success: boolean;
  transferId?: string;
  message?: string;
  error?: string;
  balances?: {
    spot?: string;
    funding?: string;
    earn?: string;
  };
}

export interface TransferRecord {
  transferId: string;
  userId: string;
  fromWallet: WalletType;
  toWallet: WalletType;
  token: string;
  chain: string;
  amount: string;
  status: 'completed' | 'failed';
  createdAt: string;
}

// API response format from backend
interface ApiBalanceItem {
  chain: string;
  token: string;
  balance: string;
  walletType?: WalletType;
}

interface ApiBalancesResponse {
  balances: ApiBalanceItem[];
}

interface ApiWalletSummary {
  summary: {
    spot: { total: number; assets: number };
    funding: { total: number; assets: number };
    earn: { total: number; assets: number };
  };
  balances: ApiBalanceItem[];
}

// Transformed balance format for frontend
export interface Balance {
  currency: string;
  available: string;
  locked: string;
  chain?: string;
  name?: string;
  network?: string;
  walletType?: WalletType;
}

// Wallet-specific balance with all three wallet amounts
export interface WalletBalance {
  currency: string;
  name?: string;
  chain: string;
  spotBalance: string;
  fundingBalance: string;
  earnBalance: string;
}

export const balanceService = {
  /**
   * Get all wallet balances across all chains (default: spot wallet)
   * Returns all supported assets, merging with API balances
   * Assets with zero balance are included for full portfolio display
   */
  getAllBalances: async (walletType?: WalletType): Promise<Balance[]> => {
    let apiBalances: ApiBalanceItem[] = [];

    try {
      const url = walletType
        ? `/api/balance/balances?walletType=${walletType}`
        : '/api/balance/balances';
      const response = await api.get<ApiBalancesResponse>(url);
      if (response?.balances && Array.isArray(response.balances)) {
        apiBalances = response.balances;
      }
    } catch (error) {
      console.warn('Failed to fetch balances from API, showing all assets with zero balance');
    }

    // Create a lookup map from API balances (chainId -> symbol -> balance)
    const balanceMap = new Map<string, { balance: string; walletType?: WalletType }>();
    apiBalances.forEach((item) => {
      const key = `${item.chain.toLowerCase()}-${item.token.toUpperCase()}`;
      balanceMap.set(key, { balance: item.balance, walletType: item.walletType });
    });

    // Build complete list from all assets + merge API balances
    const allBalances: Balance[] = allAssets.map((asset) => {
      const key = `${asset.chainId}-${asset.symbol.toUpperCase()}`;
      const apiData = balanceMap.get(key);

      return {
        currency: asset.symbol,
        available: apiData?.balance || '0',
        locked: '0',
        chain: asset.chainId,
        name: asset.name,
        network: asset.network,
        walletType: apiData?.walletType || 'spot',
      };
    });

    return allBalances;
  },

  /**
   * Get wallet summary with totals for each wallet type
   */
  getWalletSummary: async (): Promise<ApiWalletSummary> => {
    try {
      const response = await api.get<ApiWalletSummary>('/api/balance/balances/summary');
      return response;
    } catch (error) {
      console.warn('Failed to fetch wallet summary');
      return {
        summary: {
          spot: { total: 0, assets: 0 },
          funding: { total: 0, assets: 0 },
          earn: { total: 0, assets: 0 },
        },
        balances: [],
      };
    }
  },

  /**
   * Get all balances organized by wallet type
   * Returns a combined view for wallet display
   */
  getAllWalletBalances: async (): Promise<WalletBalance[]> => {
    try {
      const response = await api.get<ApiBalancesResponse>('/api/balance/balances');
      const balances = response?.balances || [];

      // Group balances by chain+token
      const balanceMap = new Map<string, WalletBalance>();

      // Initialize with all assets
      allAssets.forEach((asset) => {
        const key = `${asset.chainId}-${asset.symbol}`;
        balanceMap.set(key, {
          currency: asset.symbol,
          name: asset.name,
          chain: asset.chainId,
          spotBalance: '0',
          fundingBalance: '0',
          earnBalance: '0',
        });
      });

      // Fill in actual balances
      balances.forEach((item) => {
        const key = `${item.chain.toLowerCase()}-${item.token.toUpperCase()}`;
        const existing = balanceMap.get(key);
        if (existing) {
          const walletType = item.walletType || 'spot';
          if (walletType === 'spot') existing.spotBalance = item.balance;
          else if (walletType === 'funding') existing.fundingBalance = item.balance;
          else if (walletType === 'earn') existing.earnBalance = item.balance;
        }
      });

      return Array.from(balanceMap.values());
    } catch (error) {
      console.warn('Failed to fetch wallet balances');
      return [];
    }
  },

  /**
   * Get balances for a specific wallet type
   */
  getWalletTypeBalances: async (walletType: WalletType): Promise<Balance[]> => {
    try {
      const response = await api.get<ApiBalancesResponse>(
        `/api/balance/balances/wallet/${walletType}`
      );
      return (response?.balances || []).map((item) => ({
        currency: item.token,
        available: item.balance,
        locked: '0',
        chain: item.chain,
        walletType: item.walletType,
      }));
    } catch (error) {
      console.warn(`Failed to fetch ${walletType} balances`);
      return [];
    }
  },

  /**
   * Transfer between wallet types (spot <-> funding <-> earn)
   */
  transfer: async (request: TransferRequest): Promise<TransferResponse> => {
    try {
      const response = await api.post<TransferResponse>('/api/balance/transfer', request);
      return response;
    } catch (error: any) {
      console.error('Transfer failed:', error);
      return {
        success: false,
        error: error?.message || 'Transfer failed',
      };
    }
  },

  /**
   * Get transfer history
   */
  getTransfers: async (
    limit = 50,
    offset = 0
  ): Promise<{ transfers: TransferRecord[]; total: number }> => {
    try {
      const response = await api.get<{ transfers: TransferRecord[]; total: number }>(
        `/api/balance/transfers?limit=${limit}&offset=${offset}`
      );
      return response;
    } catch (error) {
      console.warn('Failed to fetch transfers');
      return { transfers: [], total: 0 };
    }
  },

  /**
   * Get balance for a specific chain
   */
  getChainBalance: async (chain: string, walletType?: WalletType): Promise<ChainBalance> => {
    const url = walletType
      ? `/api/balance/balances/${chain}?walletType=${walletType}`
      : `/api/balance/balances/${chain}`;
    return api.get<ChainBalance>(url);
  },

  /**
   * Get all user wallet addresses
   */
  getWallets: async (): Promise<{ wallets: WalletAddress[] }> => {
    return api.get('/api/user/wallets');
  },

  /**
   * Get deposit address for a specific chain
   * Will generate one if it doesn't exist
   */
  getDepositAddress: async (
    chain: string
  ): Promise<{ address: string; memo?: string; qrCode?: string }> => {
    // First try to get from user wallets
    const { wallets } = await balanceService.getWallets();
    const wallet = wallets.find((w) => w.chain === chain);

    if (wallet) {
      return { address: wallet.address };
    }

    // If not found, the wallet-creation service should have created it on registration
    // Return the chain's wallet from balances
    const balance = await balanceService.getChainBalance(chain);
    return { address: balance.address };
  },

  /**
   * Get transaction history
   */
  getTransactions: async (
    filters?: TransactionFilters
  ): Promise<{ transactions: Transaction[]; total: number }> => {
    return api.get('/api/balance/transactions', filters as Record<string, any>);
  },

  /**
   * Request a withdrawal
   */
  requestWithdrawal: async (
    request: WithdrawalRequest
  ): Promise<{
    message: string;
    withdrawal: {
      id: string;
      status: string;
      amount: string;
      fee: string;
      netAmount: string;
      estimatedCompletion?: string;
    };
  }> => {
    return api.post('/api/balance/withdraw', request);
  },

  /**
   * Get withdrawal status
   */
  getWithdrawalStatus: async (
    withdrawalId: string
  ): Promise<{
    withdrawal: {
      id: string;
      status: string;
      txHash?: string;
      completedAt?: string;
    };
  }> => {
    return api.get(`/api/balance/withdrawals/${withdrawalId}`);
  },

  /**
   * Calculate portfolio total in USD
   */
  calculateTotalUsd: (balances: ChainBalance[]): number => {
    return balances.reduce((total, balance) => {
      const balanceUsd = parseFloat(balance.balanceUsd) || 0;
      const tokensUsd =
        balance.tokens?.reduce((sum, token) => {
          return sum + (parseFloat(token.balanceUsd) || 0);
        }, 0) || 0;
      return total + balanceUsd + tokensUsd;
    }, 0);
  },

  /**
   * Format balance for display
   */
  formatBalance: (balance: string, decimals: number = 8): string => {
    const num = parseFloat(balance);
    if (isNaN(num)) return '0';

    // For very small numbers, show more decimals
    if (num < 0.00001 && num > 0) {
      return num.toFixed(decimals);
    }

    // For larger numbers, show fewer decimals
    if (num >= 1000) {
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    if (num >= 1) {
      return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    return num.toLocaleString(undefined, { maximumFractionDigits: 6 });
  },
};

export default balanceService;
