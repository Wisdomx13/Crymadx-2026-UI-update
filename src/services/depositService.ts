// CrymadX Deposit Service
// Handles deposit addresses and deposit tracking

import { api } from './api';

export interface DepositAddress {
  chain: string;
  address: string;
  memo?: string;
  tag?: string;
  network: string;
  minDeposit?: string;
  confirmations?: number;
}

export interface DepositHistory {
  id: string;
  chain: string;
  amount: string;
  txHash: string;
  status: 'pending' | 'confirming' | 'completed' | 'failed';
  confirmations: number;
  requiredConfirmations: number;
  createdAt: string;
  completedAt?: string;
}

// Chain configuration with deposit info
export const chainConfigs: Record<string, {
  symbol: string;
  name: string;
  network: string;
  minDeposit: string;
  confirmations: number;
  chainId: string;
}> = {
  btc: { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', minDeposit: '0.0001', confirmations: 3, chainId: 'btc' },
  eth: { symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', minDeposit: '0.001', confirmations: 12, chainId: 'eth' },
  bsc: { symbol: 'BNB', name: 'BNB Chain', network: 'BEP-20', minDeposit: '0.01', confirmations: 15, chainId: 'bsc' },
  sol: { symbol: 'SOL', name: 'Solana', network: 'Solana', minDeposit: '0.01', confirmations: 32, chainId: 'sol' },
  trx: { symbol: 'TRX', name: 'TRON', network: 'TRC-20', minDeposit: '1', confirmations: 20, chainId: 'trx' },
  matic: { symbol: 'MATIC', name: 'Polygon', network: 'Polygon', minDeposit: '1', confirmations: 128, chainId: 'matic' },
  avax: { symbol: 'AVAX', name: 'Avalanche', network: 'C-Chain', minDeposit: '0.1', confirmations: 20, chainId: 'avax' },
  arb: { symbol: 'ARB', name: 'Arbitrum', network: 'Arbitrum One', minDeposit: '0.001', confirmations: 20, chainId: 'arb' },
  op: { symbol: 'OP', name: 'Optimism', network: 'Optimism', minDeposit: '0.001', confirmations: 20, chainId: 'op' },
  base: { symbol: 'BASE', name: 'Base', network: 'Base', minDeposit: '0.001', confirmations: 20, chainId: 'base' },
  ltc: { symbol: 'LTC', name: 'Litecoin', network: 'Litecoin', minDeposit: '0.001', confirmations: 6, chainId: 'ltc' },
  doge: { symbol: 'DOGE', name: 'Dogecoin', network: 'Dogecoin', minDeposit: '10', confirmations: 40, chainId: 'doge' },
  xrp: { symbol: 'XRP', name: 'Ripple', network: 'XRP Ledger', minDeposit: '1', confirmations: 1, chainId: 'xrp' },
  xlm: { symbol: 'XLM', name: 'Stellar', network: 'Stellar', minDeposit: '1', confirmations: 1, chainId: 'xlm' },
};

// Token configuration for deposits
export const tokenConfigs: Record<string, {
  symbol: string;
  name: string;
  chains: string[];
  minDeposit: string;
}> = {
  usdt: { symbol: 'USDT', name: 'Tether', chains: ['eth', 'bsc', 'trx', 'sol', 'matic', 'arb', 'op'], minDeposit: '1' },
  usdc: { symbol: 'USDC', name: 'USD Coin', chains: ['eth', 'bsc', 'sol', 'matic', 'arb', 'op', 'base'], minDeposit: '1' },
  link: { symbol: 'LINK', name: 'Chainlink', chains: ['eth'], minDeposit: '0.1' },
  uni: { symbol: 'UNI', name: 'Uniswap', chains: ['eth'], minDeposit: '0.1' },
  shib: { symbol: 'SHIB', name: 'Shiba Inu', chains: ['eth'], minDeposit: '100000' },
};

export const depositService = {
  /**
   * Get deposit address for a specific chain
   */
  getDepositAddress: async (chain: string): Promise<DepositAddress> => {
    const chainConfig = chainConfigs[chain.toLowerCase()];

    try {
      // Get all wallets and find the one for this chain
      const { wallets } = await api.get<{ wallets: Array<{ chain: string; address: string; memo?: string; tag?: string }> }>('/api/user/wallets');

      const wallet = wallets.find(w => w.chain.toLowerCase() === chain.toLowerCase());

      if (wallet) {
        return {
          chain,
          address: wallet.address,
          memo: wallet.memo || wallet.tag, // XLM uses memo, XRP uses tag
          tag: wallet.tag,
          network: chainConfig?.network || chain,
          minDeposit: chainConfig?.minDeposit,
          confirmations: chainConfig?.confirmations,
        };
      }

      // Wallet not found for this chain
      throw new Error(`No wallet found for chain: ${chain}`);
    } catch (error: any) {
      // If wallets endpoint fails, try fallback to balance service
      try {
        const balanceResponse = await api.get<{ address?: string }>(`/api/balance/balances/${chain}`);

        if (balanceResponse?.address) {
          return {
            chain,
            address: balanceResponse.address,
            network: chainConfig?.network || chain,
            minDeposit: chainConfig?.minDeposit,
            confirmations: chainConfig?.confirmations,
          };
        }
      } catch {
        // Balance endpoint also failed
      }

      // Return placeholder if no address found
      return {
        chain,
        address: 'Address not available - please contact support',
        network: chainConfig?.network || chain,
        minDeposit: chainConfig?.minDeposit,
        confirmations: chainConfig?.confirmations,
      };
    }
  },

  /**
   * Get all deposit addresses
   */
  getAllDepositAddresses: async (): Promise<DepositAddress[]> => {
    const { wallets } = await api.get<{ wallets: Array<{ chain: string; address: string; memo?: string }> }>('/api/user/wallets');

    return wallets.map(wallet => {
      const chainConfig = chainConfigs[wallet.chain.toLowerCase()];
      return {
        chain: wallet.chain,
        address: wallet.address,
        memo: wallet.memo,
        network: chainConfig?.network || wallet.chain,
        minDeposit: chainConfig?.minDeposit,
        confirmations: chainConfig?.confirmations,
      };
    });
  },

  /**
   * Get deposit history
   */
  getDepositHistory: async (filters?: {
    chain?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ deposits: DepositHistory[]; total: number }> => {
    return api.get('/api/balance/transactions', {
      ...filters,
      type: 'deposit',
    });
  },

  /**
   * Get available chains for deposit
   */
  getAvailableChains: (): typeof chainConfigs => {
    return chainConfigs;
  },

  /**
   * Get tokens available for deposit on a chain
   */
  getTokensForChain: (chain: string): Array<{ symbol: string; name: string; minDeposit: string }> => {
    const tokens: Array<{ symbol: string; name: string; minDeposit: string }> = [];

    Object.entries(tokenConfigs).forEach(([_, config]) => {
      if (config.chains.includes(chain.toLowerCase())) {
        tokens.push({
          symbol: config.symbol,
          name: config.name,
          minDeposit: config.minDeposit,
        });
      }
    });

    return tokens;
  },

  /**
   * Format chain display info
   */
  getChainInfo: (chain: string): {
    symbol: string;
    name: string;
    network: string;
    minDeposit: string;
    confirmations: number;
  } | null => {
    return chainConfigs[chain.toLowerCase()] || null;
  },
};

export default depositService;
