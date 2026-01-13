// CrymadX Spot Trading Service
// Handles spot trading orders via ChangeNow swap service
// Market data from Binance proxy, trade execution via ChangeNow

import { api } from './api';
import { assetToChangeNowTicker, getPairBySymbol } from '../config/tradingPairs';
import { balanceService } from './balanceService';

// ============================================
// Spot Trading Types
// ============================================

export interface SpotTradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  isActive: boolean;
}

export interface SpotQuote {
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  estimatedAmount: string;
  minAmount: string;
  rate: number;
}

export interface SpotOrder {
  orderId: string;
  userId: string;
  baseAsset: string;
  quoteAsset: string;
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  price?: string;
  amount: string;
  total: string;
  filledAmount: string;
  filledTotal: string;
  averagePrice?: string;
  status: 'pending' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'failed';
  statusMessage?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  filledAt?: string;
  // ChangeNow order details
  changeNowId?: string;
  depositAddress?: string;
}

export interface CreateOrderRequest {
  baseAsset: string;
  quoteAsset: string;
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  amount: string;
  price?: string;
  // Explicit chain selection from user - bypasses auto-detection
  fromChain?: string;
  toChain?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order: SpotOrder;
}

export interface OrdersResponse {
  orders: SpotOrder[];
  total?: number;
}

export interface PairValidationResponse {
  valid: boolean;
  reason?: string;
  baseAsset?: string;
  quoteAsset?: string;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
  refundAmount: number;
  refundAsset: string;
}

// ChangeNow swap response types
interface SwapEstimateResponse {
  fromAmount: string;
  fromToken: string;
  toToken: string;
  estimatedAmount: string;
  rate: string;
  minAmount: string;
  maxAmount: string;
  validUntil: string;
}

interface SwapCreateResponse {
  orderId: string;
  changeNowId: string;
  fromAmount: string;
  estimatedToAmount: string;
  depositAddress: string;
  status: string;
}

interface SwapStatusResponse {
  orderId: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}

// Local storage for tracking orders (since backend doesn't have spot order persistence)
const ORDERS_STORAGE_KEY = 'crymadx_spot_orders';

// Chain ID to ChangeNow network mapping
// This maps CrymadX chainId to the network identifier expected by ChangeNow
const CHAIN_TO_CHANGENOW_NETWORK: Record<string, string> = {
  eth: 'eth',
  bsc: 'bsc',
  sol: 'sol',
  trx: 'trx',
  matic: 'matic',
  arb: 'arb',
  op: 'op',
  base: 'base',
  avax: 'avax',
  btc: 'btc',
  ltc: 'ltc',
  doge: 'doge',
  xrp: 'xrp',
  xlm: 'xlm',
};

// Backend chain name mapping
// The API gateway may translate chain names to ChangeNow network identifiers
const CHAIN_NAME_MAP: Record<string, string> = {
  eth: 'ETH',
  matic: 'POLYGON',
  arb: 'ARBITRUM',
  op: 'OPTIMISM',
  avax: 'AVAX',
  bsc: 'BNB',
  sol: 'SOL',
  base: 'BASE',
  trx: 'TRX',
  btc: 'BTC',
  ltc: 'LTC',
  doge: 'DOGE',
  xrp: 'XRP',
  xlm: 'XLM',
};

// ChangeNow network identifiers - these are what the backend swap service expects
// Maps our chainId to ChangeNow's network parameter
const CHANGENOW_NETWORK_MAP: Record<string, string> = {
  eth: 'eth',
  matic: 'matic',
  arb: 'arbitrum',
  op: 'op',
  avax: 'avaxc',
  bsc: 'bsc',
  sol: 'sol',
  base: 'base',
  trx: 'trx',
  btc: 'btc',
  ltc: 'ltc',
  doge: 'doge',
  xrp: 'xrp',
  xlm: 'xlm',
};

/**
 * Get the backend chain name for a chainId
 * Backend expects chain names like 'POLYGON', 'ARBITRUM', etc.
 */
const getBackendChainName = (chainId: string): string => {
  return CHAIN_NAME_MAP[chainId.toLowerCase()] || chainId.toUpperCase();
};

/**
 * Get the ChangeNow network identifier for a chainId
 * ChangeNow expects network identifiers like 'matic', 'arbitrum', etc.
 */
const getChangeNowNetwork = (chainId: string): string => {
  return CHANGENOW_NETWORK_MAP[chainId.toLowerCase()] || chainId.toLowerCase();
};

// Cache for user's token balances by network
let userTokenNetworksCache: Map<string, { chain: string; balance: string }[]> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30000; // 30 seconds

/**
 * Get user's balances for a specific token across all networks
 * Returns networks sorted by balance (highest first)
 */
const getUserTokenNetworks = async (token: string): Promise<{ chain: string; balance: string }[]> => {
  const now = Date.now();

  // Refresh cache if expired
  if (!userTokenNetworksCache || now - cacheTimestamp > CACHE_TTL) {
    try {
      const balances = await balanceService.getAllBalances('funding');
      userTokenNetworksCache = new Map();

      for (const balance of balances) {
        const symbol = balance.currency.toUpperCase();
        if (!userTokenNetworksCache.has(symbol)) {
          userTokenNetworksCache.set(symbol, []);
        }
        if (parseFloat(balance.available) > 0 && balance.chain) {
          userTokenNetworksCache.get(symbol)!.push({
            chain: balance.chain,
            balance: balance.available,
          });
        }
      }

      cacheTimestamp = now;
    } catch (error) {
      console.warn('[SpotTrading] Failed to fetch balances for network detection:', error);
      return [];
    }
  }

  const networks = userTokenNetworksCache?.get(token.toUpperCase()) || [];
  // Sort by balance descending
  return networks.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
};

/**
 * Detect the best network for a token based on user's balances
 * Prefers networks with higher balance
 */
const detectUserTokenNetwork = async (token: string, defaultNetwork?: string): Promise<string> => {
  const networks = await getUserTokenNetworks(token);

  if (networks.length > 0) {
    // Return the network with the highest balance
    const bestNetwork = networks[0].chain;
    console.log(`[SpotTrading] Detected ${token} network: ${bestNetwork} (balance: ${networks[0].balance})`);
    return CHAIN_TO_CHANGENOW_NETWORK[bestNetwork] || bestNetwork;
  }

  // Fallback to default network from config
  if (defaultNetwork) {
    console.log(`[SpotTrading] Using default network for ${token}: ${defaultNetwork}`);
    return defaultNetwork;
  }

  // Ultimate fallback based on token type
  const fallbacks: Record<string, string> = {
    USDC: 'eth',
    USDT: 'eth',
    DAI: 'eth',
  };

  const fallback = fallbacks[token.toUpperCase()] || token.toLowerCase();
  console.log(`[SpotTrading] Using fallback network for ${token}: ${fallback}`);
  return fallback;
};

const getStoredOrders = (): SpotOrder[] => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const storeOrder = (order: SpotOrder): void => {
  const orders = getStoredOrders();
  const existingIndex = orders.findIndex(o => o.orderId === order.orderId);
  if (existingIndex >= 0) {
    orders[existingIndex] = order;
  } else {
    orders.unshift(order);
  }
  // Keep only last 100 orders
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders.slice(0, 100)));
};

const mapSwapStatusToOrderStatus = (swapStatus: string): SpotOrder['status'] => {
  const statusMap: Record<string, SpotOrder['status']> = {
    pending: 'pending',
    waiting: 'open',
    confirming: 'partially_filled',
    exchanging: 'partially_filled',
    sending: 'partially_filled',
    finished: 'filled',
    complete: 'filled',
    failed: 'failed',
    refunded: 'cancelled',
  };
  return statusMap[swapStatus] || 'pending';
};

// ============================================
// Spot Trading Service
// ============================================

export const spotTradingService = {
  /**
   * Get available trading pairs from ChangeNow
   */
  getPairs: async (): Promise<{ pairs: SpotTradingPair[] }> => {
    try {
      const response = await api.get<{ pairs: Array<{ ticker: string; name: string; network: string }> }>('/api/swap/pairs', undefined, false);

      // Convert swap pairs to trading pairs format
      // Only show pairs that can trade against USDT
      const pairs: SpotTradingPair[] = response.pairs
        .filter(p => p.ticker.toLowerCase() !== 'usdt')
        .map(p => ({
          symbol: `${p.ticker.toUpperCase()}USDT`,
          baseAsset: p.ticker.toUpperCase(),
          quoteAsset: 'USDT',
          isActive: true,
        }));

      return { pairs };
    } catch (error) {
      console.error('Failed to fetch trading pairs:', error);
      return { pairs: [] };
    }
  },

  /**
   * Validate if a specific trading pair is supported
   */
  validatePair: async (symbol: string): Promise<PairValidationResponse> => {
    const { pairs } = await spotTradingService.getPairs();
    const pair = pairs.find(p => p.symbol === symbol);

    if (pair) {
      return { valid: true, baseAsset: pair.baseAsset, quoteAsset: pair.quoteAsset };
    }
    return { valid: false, reason: 'Trading pair not supported' };
  },

  /**
   * Get quote/estimate for a trade via ChangeNow swap estimate
   */
  getQuote: async (
    fromAsset: string,
    toAsset: string,
    amount: string,
    side: 'buy' | 'sell'
  ): Promise<SpotQuote> => {
    // For buy: we're buying base asset (e.g., BTC) with quote asset (e.g., USDT)
    // For sell: we're selling base asset (e.g., BTC) for quote asset (e.g., USDT)
    const actualFromAsset = side === 'buy' ? toAsset : fromAsset; // USDT for buy, BTC for sell
    const actualToAsset = side === 'buy' ? fromAsset : toAsset;   // BTC for buy, USDT for sell

    // Look up pair config to get proper networks
    const pairSymbol = `${fromAsset}${toAsset}`;
    const pairConfig = getPairBySymbol(pairSymbol);

    let fromTicker: string;
    let toTicker: string;
    let fromNetwork: string;
    let toNetwork: string;

    if (pairConfig) {
      if (side === 'buy') {
        fromTicker = pairConfig.changeNow.quoteTicker;
        toTicker = pairConfig.changeNow.baseTicker;
        fromNetwork = pairConfig.changeNow.quoteNetwork || pairConfig.changeNow.quoteTicker;
        toNetwork = pairConfig.changeNow.baseNetwork || pairConfig.changeNow.baseTicker;
      } else {
        fromTicker = pairConfig.changeNow.baseTicker;
        toTicker = pairConfig.changeNow.quoteTicker;
        fromNetwork = pairConfig.changeNow.baseNetwork || pairConfig.changeNow.baseTicker;
        toNetwork = pairConfig.changeNow.quoteNetwork || pairConfig.changeNow.quoteTicker;
      }
    } else {
      // Fallback: use the assetToChangeNowTicker helper
      fromTicker = assetToChangeNowTicker(actualFromAsset);
      toTicker = assetToChangeNowTicker(actualToAsset);
      fromNetwork = fromTicker;
      toNetwork = toTicker;
    }

    // For multi-chain tokens (USDC, USDT, DAI), detect user's actual chain
    const multiChainTokens = ['USDC', 'USDT', 'DAI'];
    let fromNetworkId: string;
    let toNetworkId: string;

    if (multiChainTokens.includes(actualFromAsset.toUpperCase())) {
      // Detect which chain the user has this token on
      const detectedChainId = await detectUserTokenNetwork(actualFromAsset, fromNetwork);
      fromNetworkId = getChangeNowNetwork(detectedChainId);
      console.log(`[SpotTrading] Quote: Using ${actualFromAsset} on network: ${fromNetworkId}`);
    } else {
      // For non-multichain tokens, use the network from config
      fromNetworkId = getChangeNowNetwork(fromNetwork);
    }

    if (multiChainTokens.includes(actualToAsset.toUpperCase())) {
      const detectedChainId = await detectUserTokenNetwork(actualToAsset, toNetwork);
      toNetworkId = getChangeNowNetwork(detectedChainId);
      console.log(`[SpotTrading] Quote: Using ${actualToAsset} on network: ${toNetworkId}`);
    } else {
      toNetworkId = getChangeNowNetwork(toNetwork);
    }

    console.log(`[SpotTrading] Quote request: ${actualFromAsset} (${fromNetworkId}) -> ${actualToAsset} (${toNetworkId})`);

    // Build request - ChangeNow API v2 format only
    // DO NOT include fromChain/fromToken as the gateway incorrectly concatenates them
    const response = await api.post<SwapEstimateResponse>('/api/swap/estimate', {
      // ChangeNow format - these go directly to ChangeNow API
      fromCurrency: actualFromAsset.toLowerCase(),
      fromNetwork: fromNetworkId.toLowerCase(),
      toCurrency: actualToAsset.toLowerCase(),
      toNetwork: toNetworkId.toLowerCase(),
      // Amount
      amount: amount,
      fromAmount: amount,
      flow: 'standard',
    });

    return {
      fromAsset: actualFromAsset,
      toAsset: actualToAsset,
      fromAmount: response.fromAmount,
      estimatedAmount: response.estimatedAmount,
      minAmount: response.minAmount,
      rate: parseFloat(response.rate),
    };
  },

  /**
   * Create a new order via ChangeNow swap
   * Note: Limit orders are simulated - they execute immediately at market rate
   */
  createOrder: async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const { baseAsset, quoteAsset, side, orderType, amount, price, fromChain: explicitFromChain, toChain: explicitToChain } = request;

    // For buy: spending quote asset (e.g., USDC) to get baseAsset (e.g., ARB)
    // For sell: spending baseAsset to get quote asset
    const fromToken = side === 'buy' ? quoteAsset : baseAsset;
    const toToken = side === 'buy' ? baseAsset : quoteAsset;

    // PRIORITY: Use explicit chain selection from user if provided
    // This bypasses all auto-detection and config lookups
    let fromNetworkId: string;
    let toNetworkId: string;

    if (explicitFromChain && explicitToChain) {
      // User explicitly selected chains - use them directly
      fromNetworkId = explicitFromChain;
      toNetworkId = explicitToChain;
      console.log(`[SpotTrading] Using EXPLICIT chain selection: ${fromToken} on ${fromNetworkId} -> ${toToken} on ${toNetworkId}`);
    } else {
      // Fallback to auto-detection (legacy behavior)
      const pairSymbol = `${baseAsset}${quoteAsset}`;
      const pairConfig = getPairBySymbol(pairSymbol);

      let fromNetwork: string;
      let toNetwork: string;

      if (pairConfig) {
        if (side === 'buy') {
          fromNetwork = pairConfig.changeNow.quoteNetwork || pairConfig.changeNow.quoteTicker;
          toNetwork = pairConfig.changeNow.baseNetwork || pairConfig.changeNow.baseTicker;
        } else {
          fromNetwork = pairConfig.changeNow.baseNetwork || pairConfig.changeNow.baseTicker;
          toNetwork = pairConfig.changeNow.quoteNetwork || pairConfig.changeNow.quoteTicker;
        }
      } else {
        const fromTicker = side === 'buy' ? assetToChangeNowTicker(quoteAsset) : assetToChangeNowTicker(baseAsset);
        const toTicker = side === 'buy' ? assetToChangeNowTicker(baseAsset) : assetToChangeNowTicker(quoteAsset);
        fromNetwork = fromTicker;
        toNetwork = toTicker;
      }

      // For multi-chain tokens, detect user's actual chain
      const multiChainTokens = ['USDC', 'USDT', 'DAI'];

      if (multiChainTokens.includes(fromToken.toUpperCase())) {
        const detectedChainId = await detectUserTokenNetwork(fromToken, fromNetwork);
        fromNetworkId = getChangeNowNetwork(detectedChainId);
        console.log(`[SpotTrading] Auto-detected ${fromToken} on network: ${fromNetworkId}`);
      } else {
        fromNetworkId = getChangeNowNetwork(fromNetwork);
      }

      if (multiChainTokens.includes(toToken.toUpperCase())) {
        const detectedChainId = await detectUserTokenNetwork(toToken, toNetwork);
        toNetworkId = getChangeNowNetwork(detectedChainId);
        console.log(`[SpotTrading] Auto-detected ${toToken} on network: ${toNetworkId}`);
      } else {
        toNetworkId = getChangeNowNetwork(toNetwork);
      }
    }

    // Calculate the amount to send
    // For BUY: User wants X amount of toToken (e.g., 10 ARB)
    //          We need to calculate how much fromToken (USDC) to send
    // For SELL: User wants to sell X amount of fromToken (e.g., 10 ARB)
    //           fromAmount is simply the amount they entered
    let fromAmount: string;
    let toAmount: string | undefined;

    if (side === 'buy') {
      // User entered how much of the base asset they want to RECEIVE (e.g., 10 ARB)
      // We need to calculate how much of the quote asset (USDC) to send
      toAmount = amount; // The amount of ARB user wants

      // Get the forward rate: USDC -> ARB
      // This tells us how many ARB we get per USDC
      const forwardEstimate = await api.post<SwapEstimateResponse>('/api/swap/estimate', {
        fromChain: fromNetworkId.toUpperCase(),    // MATIC
        fromToken: fromToken.toUpperCase(),         // USDC
        toChain: toNetworkId.toUpperCase(),         // ARBITRUM
        toToken: toToken.toUpperCase(),             // ARB
        amount: '1',                                 // 1 USDC -> X ARB
        flow: 'standard',
      });

      // forwardRate = how many ARB per 1 USDC (e.g., ~4.46)
      const forwardRate = parseFloat(forwardEstimate.estimatedAmount || forwardEstimate.rate || '0');
      if (forwardRate > 0) {
        // To get X ARB, we need: X / rate USDC
        // Add 2% buffer for rate fluctuations and fees
        const estimatedCost = (parseFloat(amount) / forwardRate) * 1.02;
        fromAmount = estimatedCost.toFixed(6);
        console.log(`[SpotTrading] Rate: 1 ${fromToken} = ${forwardRate.toFixed(4)} ${toToken}`);
        console.log(`[SpotTrading] To receive ${amount} ${toToken}, sending ~${fromAmount} ${fromToken} (includes 2% buffer)`);
      } else {
        // Fallback: use price if available
        const priceNum = parseFloat(price || '0');
        const amountNum = parseFloat(amount);
        fromAmount = (priceNum * amountNum * 1.02).toFixed(6);
        console.log(`[SpotTrading] Using price fallback: ${fromAmount} ${fromToken}`);
      }
    } else {
      // For sell orders, amount is already in base asset units (how much to sell)
      fromAmount = amount;
      toAmount = undefined;
    }

    if (side === 'buy') {
      console.log(`[SpotTrading] Creating BUY order: Sending ~${fromAmount} ${fromToken} (${fromNetworkId}) to receive ${amount} ${toToken} (${toNetworkId})`);
    } else {
      console.log(`[SpotTrading] Creating SELL order: ${fromAmount} ${fromToken} (${fromNetworkId}) -> ${toToken} (${toNetworkId})`);
    }

    // Get user's wallet addresses for destination and refund
    // Use the same approach as ConvertScreen - fetch wallets once and look up by chain
    let destinationAddress: string;
    let refundAddress: string;

    try {
      // Fetch user's wallets (same as ConvertScreen does)
      const { wallets } = await balanceService.getWallets();

      // Build wallet lookup map (uppercase chain -> address)
      const walletMap: Record<string, string> = {};
      wallets.forEach((wallet: { chain: string; address: string }) => {
        walletMap[wallet.chain.toUpperCase()] = wallet.address;
      });

      // Helper to get address for a chain (matching ConvertScreen logic)
      const getAddressForChain = (chain: string): string | null => {
        const normalizedChain = chain.toUpperCase();

        // Direct lookup
        if (walletMap[normalizedChain]) {
          return walletMap[normalizedChain];
        }

        // Map network IDs to wallet chain names
        const networkToWalletChain: Record<string, string> = {
          'MATIC': 'MATIC',
          'ARBITRUM': 'ARB',
          'ETH': 'ETH',
          'BASE': 'BASE',
          'OP': 'OP',
          'BSC': 'BSC',
          'AVAXC': 'AVAX',
          'AVAX': 'AVAX',
          'SOL': 'SOL',
          'TRX': 'TRX',
          'BTC': 'BTC',
        };

        const mappedChain = networkToWalletChain[normalizedChain];
        if (mappedChain && walletMap[mappedChain]) {
          return walletMap[mappedChain];
        }

        // For EVM chains, they share the same address
        const evmChains = ['ETH', 'MATIC', 'BASE', 'ARB', 'OP', 'AVAX', 'BSC'];
        if (evmChains.includes(normalizedChain) || evmChains.includes(mappedChain || '')) {
          for (const evmChain of evmChains) {
            if (walletMap[evmChain]) {
              return walletMap[evmChain];
            }
          }
        }

        return null;
      };

      // Get destination address (where swapped tokens go)
      const destAddr = getAddressForChain(toNetworkId);
      if (!destAddr) {
        throw new Error(`No wallet address found for ${toNetworkId}. Please set up your wallet first.`);
      }
      destinationAddress = destAddr;
      console.log(`[SpotTrading] Destination address (${toNetworkId}): ${destinationAddress}`);

      // Get refund address (where funds go if swap fails)
      const refundAddr = getAddressForChain(fromNetworkId);
      refundAddress = refundAddr || destinationAddress; // Fallback to destination if not found
      console.log(`[SpotTrading] Refund address (${fromNetworkId}): ${refundAddress}`);

    } catch (e: any) {
      console.error('[SpotTrading] Failed to get wallet addresses:', e);
      throw new Error(e.message || `Could not get wallet addresses. Please ensure your wallet is set up.`);
    }

    // Build request body
    // Use 'funding' wallet type since that's where user balances typically are for swaps
    const requestBody = {
      fromChain: fromNetworkId.toUpperCase(),
      fromToken: fromToken.toUpperCase(),
      toChain: toNetworkId.toUpperCase(),
      toToken: toToken.toUpperCase(),
      amount: fromAmount,
      destinationAddress,
      refundAddress,
      flow: 'standard',
      walletType: 'funding',  // Tell backend to check funding wallet for balance
    };

    console.log('[SpotTrading] Request body:', JSON.stringify(requestBody, null, 2));

    // Get estimate first to validate
    const estimate = await api.post<SwapEstimateResponse>('/api/swap/estimate', {
      fromChain: requestBody.fromChain,
      fromToken: requestBody.fromToken,
      toChain: requestBody.toChain,
      toToken: requestBody.toToken,
      amount: requestBody.amount,
      flow: 'standard',
    });

    // Create the swap order
    const swapResponse = await api.post<SwapCreateResponse>('/api/swap/create', requestBody);

    // Create spot order record
    const order: SpotOrder = {
      orderId: swapResponse.orderId,
      userId: '', // Will be set by the backend
      baseAsset,
      quoteAsset,
      side,
      orderType,
      price: price || estimate.rate,
      amount,
      total: fromAmount,
      filledAmount: '0',
      filledTotal: '0',
      status: mapSwapStatusToOrderStatus(swapResponse.status),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      changeNowId: swapResponse.changeNowId,
      depositAddress: swapResponse.depositAddress,
    };

    // Store locally for tracking
    storeOrder(order);

    return { success: true, order };
  },

  /**
   * Get order status from ChangeNow
   */
  getOrder: async (orderId: string): Promise<{ order: SpotOrder }> => {
    // First check local storage
    const storedOrders = getStoredOrders();
    const localOrder = storedOrders.find(o => o.orderId === orderId);

    if (!localOrder) {
      throw new Error('Order not found');
    }

    // Get latest status from backend
    try {
      const swapStatus = await api.get<SwapStatusResponse>(`/api/swap/status/${orderId}`);

      // Update local order with latest status
      const updatedOrder: SpotOrder = {
        ...localOrder,
        status: mapSwapStatusToOrderStatus(swapStatus.status),
        filledAmount: swapStatus.toAmount || localOrder.filledAmount,
        updatedAt: new Date().toISOString(),
        filledAt: swapStatus.completedAt,
      };

      storeOrder(updatedOrder);
      return { order: updatedOrder };
    } catch (error) {
      // Return local order if backend fetch fails
      return { order: localOrder };
    }
  },

  /**
   * Cancel an open order
   * Note: ChangeNow swaps cannot be cancelled once created
   */
  cancelOrder: async (orderId: string): Promise<CancelOrderResponse> => {
    const storedOrders = getStoredOrders();
    const order = storedOrders.find(o => o.orderId === orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Can only "cancel" orders that haven't started processing
    if (order.status !== 'pending' && order.status !== 'open') {
      throw new Error('Order cannot be cancelled - already processing');
    }

    // Mark as cancelled locally (ChangeNow doesn't support cancellation)
    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    storeOrder(order);

    return {
      success: true,
      message: 'Order marked as cancelled',
      refundAmount: 0,
      refundAsset: order.side === 'buy' ? order.quoteAsset : order.baseAsset,
    };
  },

  /**
   * Get user's open orders from local storage
   */
  getOpenOrders: async (): Promise<OrdersResponse> => {
    const orders = getStoredOrders().filter(o =>
      ['pending', 'open', 'partially_filled'].includes(o.status)
    );

    // Update status for each open order
    for (const order of orders) {
      try {
        await spotTradingService.getOrder(order.orderId);
      } catch {
        // Ignore errors, keep local status
      }
    }

    return { orders: getStoredOrders().filter(o =>
      ['pending', 'open', 'partially_filled'].includes(o.status)
    ), total: orders.length };
  },

  /**
   * Get order history from local storage and swap history
   */
  getOrderHistory: async (filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<OrdersResponse> => {
    let orders = getStoredOrders();

    // Apply status filter
    if (filters?.status) {
      orders = orders.filter(o => o.status === filters.status);
    }

    // Apply pagination
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    orders = orders.slice(offset, offset + limit);

    return { orders, total: orders.length };
  },

  /**
   * Format order status for display
   */
  getStatusDisplay: (status: SpotOrder['status']): { text: string; color: string } => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: 'Processing', color: '#f0b90b' },
      open: { text: 'Open', color: '#00d4aa' },
      partially_filled: { text: 'Partial Fill', color: '#00d4aa' },
      filled: { text: 'Filled', color: '#00e77f' },
      cancelled: { text: 'Cancelled', color: '#8a8f98' },
      failed: { text: 'Failed', color: '#ff3366' },
    };

    return statusMap[status] || { text: status, color: '#8a8f98' };
  },

  /**
   * Check if order is still pending/active
   */
  isOrderActive: (status: SpotOrder['status']): boolean => {
    return ['pending', 'open', 'partially_filled'].includes(status);
  },

  /**
   * Check if order can be cancelled
   */
  canCancel: (status: SpotOrder['status']): boolean => {
    return ['open', 'partially_filled'].includes(status);
  },

  /**
   * Format price for display
   */
  formatPrice: (price: string | number, decimals: number = 8): string => {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    if (priceNum >= 1) {
      return priceNum.toFixed(2);
    }
    return priceNum.toFixed(decimals);
  },

  /**
   * Format amount for display
   */
  formatAmount: (amount: string | number, decimals: number = 8): string => {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
    // Remove trailing zeros
    return parseFloat(amountNum.toFixed(decimals)).toString();
  },

  /**
   * Calculate total from amount and price
   */
  calculateTotal: (amount: string, price: string): string => {
    const total = parseFloat(amount) * parseFloat(price);
    return total.toFixed(8);
  },

  /**
   * Calculate amount from total and price
   */
  calculateAmount: (total: string, price: string): string => {
    const priceNum = parseFloat(price);
    if (priceNum === 0) return '0';
    const amount = parseFloat(total) / priceNum;
    return amount.toFixed(8);
  },
};

export default spotTradingService;
