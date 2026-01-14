// CrymadX Wallet Service
// Handles wallet creation, initialization, and status checking

import { api } from './api';

export interface Wallet {
  chain: string;
  address: string;
  type?: string;
  walletId?: string;
  provider?: string;
  memo?: string;
  tag?: string;
  createdAt?: string;
}

export interface WalletStatus {
  totalExpected: number;
  created: number;
  missing: string[];
  wallets: Wallet[];
}

// All chains that should be created for each user
const EXPECTED_CHAINS = [
  // Circle EVM (shared address)
  'eth',
  // Circle Solana
  'sol',
  // Tatum chains
  'btc',
  'ltc',
  'doge',
  'xrp',
  'xlm',
  'bnb',
  'trx',
];

// Chain display names for logging
const CHAIN_NAMES: Record<string, string> = {
  eth: 'Ethereum (EVM)',
  sol: 'Solana',
  btc: 'Bitcoin',
  ltc: 'Litecoin',
  doge: 'Dogecoin',
  xrp: 'Ripple',
  xlm: 'Stellar',
  bnb: 'BNB Chain',
  trx: 'TRON',
};

export const walletService = {
  /**
   * Get all wallets for the current user
   */
  getWallets: async (): Promise<Wallet[]> => {
    try {
      const response = await api.get<{ wallets: Wallet[] | Record<string, Wallet> }>('/api/user/wallets');

      // Handle both array and object formats from backend
      if (Array.isArray(response.wallets)) {
        return response.wallets;
      } else if (response.wallets && typeof response.wallets === 'object') {
        // Convert object format to array
        return Object.entries(response.wallets).map(([chain, wallet]) => ({
          chain: chain.toLowerCase(),
          ...wallet,
        }));
      }

      return [];
    } catch (error) {
      console.error('[WalletService] Failed to get wallets:', error);
      return [];
    }
  },

  /**
   * Check wallet creation status - which wallets exist vs which are missing
   */
  getWalletStatus: async (): Promise<WalletStatus> => {
    const wallets = await walletService.getWallets();
    const createdChains = wallets.map(w => w.chain.toLowerCase());
    const missing = EXPECTED_CHAINS.filter(chain => !createdChains.includes(chain));

    return {
      totalExpected: EXPECTED_CHAINS.length,
      created: createdChains.length,
      missing,
      wallets,
    };
  },

  /**
   * Request creation of missing wallets
   * This calls the backend endpoint to queue wallet creation
   */
  initializeMissingWallets: async (): Promise<{ queued: string[]; alreadyExists: string[]; errors: string[] }> => {
    const status = await walletService.getWalletStatus();

    if (status.missing.length === 0) {
      console.log('[WalletService] All wallets already exist');
      return { queued: [], alreadyExists: EXPECTED_CHAINS, errors: [] };
    }

    console.log('[WalletService] Missing wallets:', status.missing.map(c => CHAIN_NAMES[c] || c).join(', '));

    try {
      // Try the dedicated endpoint first
      const response = await api.post<{
        queued?: string[];
        alreadyExists?: string[];
        message?: string;
        error?: string;
      }>('/api/user/wallets/initialize', {
        chains: status.missing,
      });

      if (response.queued) {
        console.log('[WalletService] Queued wallet creation for:', response.queued.join(', '));
      }

      return {
        queued: response.queued || [],
        alreadyExists: response.alreadyExists || [],
        errors: response.error ? [response.error] : [],
      };
    } catch (error: any) {
      // If endpoint doesn't exist (404), try alternative approaches
      if (error.status === 404) {
        console.log('[WalletService] Initialize endpoint not found, trying alternative...');

        // Try triggering wallet creation by calling a trigger endpoint
        try {
          const triggerResponse = await api.post<{ success: boolean; message?: string }>(
            '/api/user/wallets/create-missing'
          );

          if (triggerResponse.success) {
            return { queued: status.missing, alreadyExists: [], errors: [] };
          }
        } catch (triggerError: any) {
          if (triggerError.status === 404) {
            console.warn('[WalletService] No wallet initialization endpoint available on backend');
            console.warn('[WalletService] Backend needs POST /api/user/wallets/initialize endpoint');
          }
        }
      }

      console.error('[WalletService] Failed to initialize wallets:', error);
      return {
        queued: [],
        alreadyExists: [],
        errors: [error.message || 'Failed to initialize wallets'],
      };
    }
  },

  /**
   * Ensure all wallets are created for the user
   * Called on login to check and create missing wallets
   */
  ensureAllWalletsCreated: async (): Promise<{
    complete: boolean;
    status: WalletStatus;
    initializationResult?: { queued: string[]; alreadyExists: string[]; errors: string[] };
  }> => {
    console.log('[WalletService] Checking wallet status...');

    const status = await walletService.getWalletStatus();

    console.log(`[WalletService] Wallet status: ${status.created}/${status.totalExpected} created`);

    if (status.missing.length === 0) {
      console.log('[WalletService] All wallets are available');
      return { complete: true, status };
    }

    console.log('[WalletService] Missing wallets detected, attempting to initialize...');
    const initResult = await walletService.initializeMissingWallets();

    return {
      complete: initResult.errors.length === 0 && initResult.queued.length > 0,
      status,
      initializationResult: initResult,
    };
  },

  /**
   * Poll for wallet creation completion
   * Useful for showing progress to the user
   */
  waitForWallets: async (
    targetChains: string[],
    maxAttempts: number = 10,
    intervalMs: number = 3000,
    onProgress?: (status: WalletStatus) => void
  ): Promise<{ success: boolean; status: WalletStatus }> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const status = await walletService.getWalletStatus();

      if (onProgress) {
        onProgress(status);
      }

      // Check if all target chains are now created
      const stillMissing = targetChains.filter(chain => status.missing.includes(chain));

      if (stillMissing.length === 0) {
        console.log('[WalletService] All requested wallets are now available');
        return { success: true, status };
      }

      console.log(`[WalletService] Attempt ${attempt}/${maxAttempts}: Still waiting for ${stillMissing.length} wallets`);

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }

    const finalStatus = await walletService.getWalletStatus();
    return { success: false, status: finalStatus };
  },

  /**
   * Get expected chains list
   */
  getExpectedChains: (): string[] => {
    return [...EXPECTED_CHAINS];
  },

  /**
   * Get chain display name
   */
  getChainName: (chain: string): string => {
    return CHAIN_NAMES[chain.toLowerCase()] || chain.toUpperCase();
  },
};

export default walletService;
