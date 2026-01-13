/**
 * CrymadX Trading Pairs Configuration
 *
 * This defines the supported trading pairs with mappings to:
 * - Binance symbols (for price feeds/charts display)
 * - ChangeNow tickers (for actual trade execution)
 *
 * The frontend displays Binance data but executes trades via ChangeNow.
 */

export interface TradingPairConfig {
  // CrymadX internal symbol (e.g., "BTCUSDT")
  symbol: string;
  // Base asset symbol (e.g., "BTC")
  baseAsset: string;
  // Quote asset symbol (e.g., "USDT")
  quoteAsset: string;
  // Display name (e.g., "Bitcoin")
  baseName: string;
  // Whether this pair is active for trading
  isActive: boolean;
  // Binance symbol for price feed (null if no Binance equivalent)
  binanceSymbol: string | null;
  // TradingView symbol for charts (e.g., "BINANCE:BTCUSDT" or "COINBASE:ARBUSD")
  // If not specified, defaults to BINANCE:{binanceSymbol}
  tradingViewSymbol?: string;
  // ChangeNow tickers for execution
  changeNow: {
    // Base asset ticker in ChangeNow (e.g., "btc")
    baseTicker: string;
    // Quote asset ticker in ChangeNow (e.g., "usdt")
    quoteTicker: string;
    // Network/chain for base asset (optional, for multi-chain tokens)
    baseNetwork?: string;
    // Network/chain for quote asset (optional)
    quoteNetwork?: string;
  };
  // Minimum order size in base asset
  minOrderSize: number;
  // Price decimal places for display
  priceDecimals: number;
  // Amount decimal places for display
  amountDecimals: number;
  // Category for grouping (e.g., "major", "defi", "layer2", "meme")
  category: string;
}

/**
 * All supported trading pairs
 * Add new pairs here to enable them in the trading UI
 */
export const TRADING_PAIRS: TradingPairConfig[] = [
  // ============================================
  // MAJOR CRYPTOCURRENCIES
  // ============================================
  {
    symbol: 'BTCUSDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    baseName: 'Bitcoin',
    isActive: true,
    binanceSymbol: 'BTCUSDT',
    changeNow: { baseTicker: 'btc', quoteTicker: 'usdt' },
    minOrderSize: 0.0001,
    priceDecimals: 2,
    amountDecimals: 6,
    category: 'major',
  },
  {
    symbol: 'ETHUSDT',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    baseName: 'Ethereum',
    isActive: true,
    binanceSymbol: 'ETHUSDT',
    changeNow: { baseTicker: 'eth', quoteTicker: 'usdt' },
    minOrderSize: 0.001,
    priceDecimals: 2,
    amountDecimals: 5,
    category: 'major',
  },
  {
    symbol: 'BNBUSDT',
    baseAsset: 'BNB',
    quoteAsset: 'USDT',
    baseName: 'BNB',
    isActive: true,
    binanceSymbol: 'BNBUSDT',
    changeNow: { baseTicker: 'bnb', quoteTicker: 'usdt' },
    minOrderSize: 0.01,
    priceDecimals: 2,
    amountDecimals: 4,
    category: 'major',
  },
  {
    symbol: 'SOLUSDT',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    baseName: 'Solana',
    isActive: true,
    binanceSymbol: 'SOLUSDT',
    changeNow: { baseTicker: 'sol', quoteTicker: 'usdt' },
    minOrderSize: 0.1,
    priceDecimals: 2,
    amountDecimals: 3,
    category: 'major',
  },
  {
    symbol: 'XRPUSDT',
    baseAsset: 'XRP',
    quoteAsset: 'USDT',
    baseName: 'XRP',
    isActive: true,
    binanceSymbol: 'XRPUSDT',
    changeNow: { baseTicker: 'xrp', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'major',
  },
  {
    symbol: 'ADAUSDT',
    baseAsset: 'ADA',
    quoteAsset: 'USDT',
    baseName: 'Cardano',
    isActive: true,
    binanceSymbol: 'ADAUSDT',
    changeNow: { baseTicker: 'ada', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'major',
  },
  {
    symbol: 'DOGEUSDT',
    baseAsset: 'DOGE',
    quoteAsset: 'USDT',
    baseName: 'Dogecoin',
    isActive: true,
    binanceSymbol: 'DOGEUSDT',
    changeNow: { baseTicker: 'doge', quoteTicker: 'usdt' },
    minOrderSize: 50,
    priceDecimals: 5,
    amountDecimals: 0,
    category: 'major',
  },
  {
    symbol: 'LTCUSDT',
    baseAsset: 'LTC',
    quoteAsset: 'USDT',
    baseName: 'Litecoin',
    isActive: true,
    binanceSymbol: 'LTCUSDT',
    changeNow: { baseTicker: 'ltc', quoteTicker: 'usdt' },
    minOrderSize: 0.1,
    priceDecimals: 2,
    amountDecimals: 3,
    category: 'major',
  },
  {
    symbol: 'TRXUSDT',
    baseAsset: 'TRX',
    quoteAsset: 'USDT',
    baseName: 'TRON',
    isActive: true,
    binanceSymbol: 'TRXUSDT',
    changeNow: { baseTicker: 'trx', quoteTicker: 'usdt' },
    minOrderSize: 100,
    priceDecimals: 5,
    amountDecimals: 0,
    category: 'major',
  },
  {
    symbol: 'DOTUSDT',
    baseAsset: 'DOT',
    quoteAsset: 'USDT',
    baseName: 'Polkadot',
    isActive: true,
    binanceSymbol: 'DOTUSDT',
    changeNow: { baseTicker: 'dot', quoteTicker: 'usdt' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'major',
  },
  {
    symbol: 'AVAXUSDT',
    baseAsset: 'AVAX',
    quoteAsset: 'USDT',
    baseName: 'Avalanche',
    isActive: true,
    binanceSymbol: 'AVAXUSDT',
    changeNow: { baseTicker: 'avax', quoteTicker: 'usdt' },
    minOrderSize: 0.5,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'major',
  },
  {
    symbol: 'MATICUSDT',
    baseAsset: 'MATIC',
    quoteAsset: 'USDT',
    baseName: 'Polygon',
    isActive: true,
    binanceSymbol: 'MATICUSDT',
    changeNow: { baseTicker: 'matic', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'major',
  },
  {
    symbol: 'LINKUSDT',
    baseAsset: 'LINK',
    quoteAsset: 'USDT',
    baseName: 'Chainlink',
    isActive: true,
    binanceSymbol: 'LINKUSDT',
    changeNow: { baseTicker: 'link', quoteTicker: 'usdt' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'major',
  },
  {
    symbol: 'ATOMUSDT',
    baseAsset: 'ATOM',
    quoteAsset: 'USDT',
    baseName: 'Cosmos',
    isActive: true,
    binanceSymbol: 'ATOMUSDT',
    changeNow: { baseTicker: 'atom', quoteTicker: 'usdt' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'major',
  },
  {
    symbol: 'XLMUSDT',
    baseAsset: 'XLM',
    quoteAsset: 'USDT',
    baseName: 'Stellar',
    isActive: true,
    binanceSymbol: 'XLMUSDT',
    changeNow: { baseTicker: 'xlm', quoteTicker: 'usdt' },
    minOrderSize: 50,
    priceDecimals: 5,
    amountDecimals: 0,
    category: 'major',
  },
  {
    symbol: 'NEARUSDT',
    baseAsset: 'NEAR',
    quoteAsset: 'USDT',
    baseName: 'NEAR Protocol',
    isActive: true,
    binanceSymbol: 'NEARUSDT',
    changeNow: { baseTicker: 'near', quoteTicker: 'usdt' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'major',
  },
  {
    symbol: 'ALGOUSDT',
    baseAsset: 'ALGO',
    quoteAsset: 'USDT',
    baseName: 'Algorand',
    isActive: true,
    binanceSymbol: 'ALGOUSDT',
    changeNow: { baseTicker: 'algo', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'major',
  },
  {
    symbol: 'ETCUSDT',
    baseAsset: 'ETC',
    quoteAsset: 'USDT',
    baseName: 'Ethereum Classic',
    isActive: true,
    binanceSymbol: 'ETCUSDT',
    changeNow: { baseTicker: 'etc', quoteTicker: 'usdt' },
    minOrderSize: 0.5,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'major',
  },
  {
    symbol: 'FILUSDT',
    baseAsset: 'FIL',
    quoteAsset: 'USDT',
    baseName: 'Filecoin',
    isActive: true,
    binanceSymbol: 'FILUSDT',
    changeNow: { baseTicker: 'fil', quoteTicker: 'usdt' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'major',
  },
  {
    symbol: 'HBARUSDT',
    baseAsset: 'HBAR',
    quoteAsset: 'USDT',
    baseName: 'Hedera',
    isActive: true,
    binanceSymbol: 'HBARUSDT',
    changeNow: { baseTicker: 'hbar', quoteTicker: 'usdt' },
    minOrderSize: 100,
    priceDecimals: 5,
    amountDecimals: 0,
    category: 'major',
  },
  {
    symbol: 'TONUSDT',
    baseAsset: 'TON',
    quoteAsset: 'USDT',
    baseName: 'Toncoin',
    isActive: true,
    binanceSymbol: 'TONUSDT',
    changeNow: { baseTicker: 'ton', quoteTicker: 'usdt' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'major',
  },
  {
    symbol: 'SUIUSDT',
    baseAsset: 'SUI',
    quoteAsset: 'USDT',
    baseName: 'Sui',
    isActive: true,
    binanceSymbol: 'SUIUSDT',
    changeNow: { baseTicker: 'sui', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'major',
  },

  // ============================================
  // LAYER 2 / SCALING SOLUTIONS
  // ============================================
  {
    symbol: 'ARBUSDT',
    baseAsset: 'ARB',
    quoteAsset: 'USDT',
    baseName: 'Arbitrum',
    isActive: true,
    binanceSymbol: 'ARBUSDT',
    changeNow: { baseTicker: 'arb', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'layer2',
  },
  {
    symbol: 'OPUSDT',
    baseAsset: 'OP',
    quoteAsset: 'USDT',
    baseName: 'Optimism',
    isActive: true,
    binanceSymbol: 'OPUSDT',
    changeNow: { baseTicker: 'op', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'layer2',
  },
  {
    symbol: 'STXUSDT',
    baseAsset: 'STX',
    quoteAsset: 'USDT',
    baseName: 'Stacks',
    isActive: true,
    binanceSymbol: 'STXUSDT',
    changeNow: { baseTicker: 'stx', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'layer2',
  },
  {
    symbol: 'IMXUSDT',
    baseAsset: 'IMX',
    quoteAsset: 'USDT',
    baseName: 'Immutable X',
    isActive: true,
    binanceSymbol: 'IMXUSDT',
    changeNow: { baseTicker: 'imx', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'layer2',
  },
  {
    symbol: 'MANTAUSDT',
    baseAsset: 'MANTA',
    quoteAsset: 'USDT',
    baseName: 'Manta Network',
    isActive: true,
    binanceSymbol: 'MANTAUSDT',
    changeNow: { baseTicker: 'manta', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'layer2',
  },

  // ============================================
  // DEFI TOKENS
  // ============================================
  {
    symbol: 'UNIUSDT',
    baseAsset: 'UNI',
    quoteAsset: 'USDT',
    baseName: 'Uniswap',
    isActive: true,
    binanceSymbol: 'UNIUSDT',
    changeNow: { baseTicker: 'uni', quoteTicker: 'usdt' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'defi',
  },
  {
    symbol: 'AAVEUSDT',
    baseAsset: 'AAVE',
    quoteAsset: 'USDT',
    baseName: 'Aave',
    isActive: true,
    binanceSymbol: 'AAVEUSDT',
    changeNow: { baseTicker: 'aave', quoteTicker: 'usdt' },
    minOrderSize: 0.1,
    priceDecimals: 2,
    amountDecimals: 3,
    category: 'defi',
  },
  {
    symbol: 'MKRUSDT',
    baseAsset: 'MKR',
    quoteAsset: 'USDT',
    baseName: 'Maker',
    isActive: true,
    binanceSymbol: 'MKRUSDT',
    changeNow: { baseTicker: 'mkr', quoteTicker: 'usdt' },
    minOrderSize: 0.01,
    priceDecimals: 2,
    amountDecimals: 4,
    category: 'defi',
  },
  {
    symbol: 'CRVUSDT',
    baseAsset: 'CRV',
    quoteAsset: 'USDT',
    baseName: 'Curve',
    isActive: true,
    binanceSymbol: 'CRVUSDT',
    changeNow: { baseTicker: 'crv', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'defi',
  },
  {
    symbol: 'COMPUSDT',
    baseAsset: 'COMP',
    quoteAsset: 'USDT',
    baseName: 'Compound',
    isActive: true,
    binanceSymbol: 'COMPUSDT',
    changeNow: { baseTicker: 'comp', quoteTicker: 'usdt' },
    minOrderSize: 0.1,
    priceDecimals: 2,
    amountDecimals: 3,
    category: 'defi',
  },
  {
    symbol: 'LDOUSDT',
    baseAsset: 'LDO',
    quoteAsset: 'USDT',
    baseName: 'Lido DAO',
    isActive: true,
    binanceSymbol: 'LDOUSDT',
    changeNow: { baseTicker: 'ldo', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'defi',
  },
  {
    symbol: 'SNXUSDT',
    baseAsset: 'SNX',
    quoteAsset: 'USDT',
    baseName: 'Synthetix',
    isActive: true,
    binanceSymbol: 'SNXUSDT',
    changeNow: { baseTicker: 'snx', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'defi',
  },
  {
    symbol: 'GRTUSDT',
    baseAsset: 'GRT',
    quoteAsset: 'USDT',
    baseName: 'The Graph',
    isActive: true,
    binanceSymbol: 'GRTUSDT',
    changeNow: { baseTicker: 'grt', quoteTicker: 'usdt' },
    minOrderSize: 50,
    priceDecimals: 5,
    amountDecimals: 0,
    category: 'defi',
  },
  {
    symbol: 'GMXUSDT',
    baseAsset: 'GMX',
    quoteAsset: 'USDT',
    baseName: 'GMX',
    isActive: true,
    binanceSymbol: 'GMXUSDT',
    changeNow: { baseTicker: 'gmx', quoteTicker: 'usdt' },
    minOrderSize: 0.5,
    priceDecimals: 2,
    amountDecimals: 2,
    category: 'defi',
  },
  {
    symbol: 'SUSHIUSDT',
    baseAsset: 'SUSHI',
    quoteAsset: 'USDT',
    baseName: 'SushiSwap',
    isActive: true,
    binanceSymbol: 'SUSHIUSDT',
    changeNow: { baseTicker: 'sushi', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'defi',
  },
  {
    symbol: '1INCHUSDT',
    baseAsset: '1INCH',
    quoteAsset: 'USDT',
    baseName: '1inch',
    isActive: true,
    binanceSymbol: '1INCHUSDT',
    changeNow: { baseTicker: '1inch', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'defi',
  },
  {
    symbol: 'DYDXUSDT',
    baseAsset: 'DYDX',
    quoteAsset: 'USDT',
    baseName: 'dYdX',
    isActive: true,
    binanceSymbol: 'DYDXUSDT',
    changeNow: { baseTicker: 'dydx', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'defi',
  },

  // ============================================
  // STABLECOINS (for reference/conversion)
  // ============================================
  {
    symbol: 'USDCUSDT',
    baseAsset: 'USDC',
    quoteAsset: 'USDT',
    baseName: 'USD Coin',
    isActive: true,
    binanceSymbol: 'USDCUSDT',
    changeNow: { baseTicker: 'usdc', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 2,
    category: 'stablecoin',
  },
  {
    symbol: 'DAIUSDT',
    baseAsset: 'DAI',
    quoteAsset: 'USDT',
    baseName: 'Dai',
    isActive: true,
    binanceSymbol: 'DAIUSDT',
    changeNow: { baseTicker: 'dai', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 2,
    category: 'stablecoin',
  },

  // ============================================
  // USDC PAIRS (Buy with USDC)
  // Uses Coinbase TradingView charts for proper USDC pairs
  // Executes via ChangeNow USDC (on Ethereum network by default)
  // Network specification is required for multi-chain tokens like USDC
  // ============================================
  {
    symbol: 'ARBUSDC',
    baseAsset: 'ARB',
    quoteAsset: 'USDC',
    baseName: 'Arbitrum',
    isActive: true,
    binanceSymbol: 'ARBUSDT', // For price polling fallback
    tradingViewSymbol: 'COINBASE:ARBUSD', // Coinbase ARB/USD chart
    changeNow: { baseTicker: 'arb', quoteTicker: 'usdc', baseNetwork: 'arb', quoteNetwork: 'eth' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'usdc',
  },
  {
    symbol: 'BTCUSDC',
    baseAsset: 'BTC',
    quoteAsset: 'USDC',
    baseName: 'Bitcoin',
    isActive: true,
    binanceSymbol: 'BTCUSDC',
    tradingViewSymbol: 'COINBASE:BTCUSD', // Coinbase BTC/USD chart
    changeNow: { baseTicker: 'btc', quoteTicker: 'usdc', baseNetwork: 'btc', quoteNetwork: 'eth' },
    minOrderSize: 0.0001,
    priceDecimals: 2,
    amountDecimals: 6,
    category: 'usdc',
  },
  {
    symbol: 'ETHUSDC',
    baseAsset: 'ETH',
    quoteAsset: 'USDC',
    baseName: 'Ethereum',
    isActive: true,
    binanceSymbol: 'ETHUSDC',
    tradingViewSymbol: 'COINBASE:ETHUSD', // Coinbase ETH/USD chart
    changeNow: { baseTicker: 'eth', quoteTicker: 'usdc', baseNetwork: 'eth', quoteNetwork: 'eth' },
    minOrderSize: 0.001,
    priceDecimals: 2,
    amountDecimals: 5,
    category: 'usdc',
  },
  {
    symbol: 'SOLUSDC',
    baseAsset: 'SOL',
    quoteAsset: 'USDC',
    baseName: 'Solana',
    isActive: true,
    binanceSymbol: 'SOLUSDC',
    tradingViewSymbol: 'COINBASE:SOLUSD', // Coinbase SOL/USD chart
    changeNow: { baseTicker: 'sol', quoteTicker: 'usdc', baseNetwork: 'sol', quoteNetwork: 'eth' },
    minOrderSize: 0.1,
    priceDecimals: 2,
    amountDecimals: 3,
    category: 'usdc',
  },
  {
    symbol: 'BNBUSDC',
    baseAsset: 'BNB',
    quoteAsset: 'USDC',
    baseName: 'BNB',
    isActive: true,
    binanceSymbol: 'BNBUSDC',
    tradingViewSymbol: 'BINANCE:BNBUSDC', // Binance has BNB/USDC
    changeNow: { baseTicker: 'bnb', quoteTicker: 'usdc', baseNetwork: 'bsc', quoteNetwork: 'eth' },
    minOrderSize: 0.01,
    priceDecimals: 2,
    amountDecimals: 4,
    category: 'usdc',
  },
  {
    symbol: 'XRPUSDC',
    baseAsset: 'XRP',
    quoteAsset: 'USDC',
    baseName: 'XRP',
    isActive: true,
    binanceSymbol: 'XRPUSDT',
    tradingViewSymbol: 'COINBASE:XRPUSD', // Coinbase XRP/USD chart
    changeNow: { baseTicker: 'xrp', quoteTicker: 'usdc', baseNetwork: 'xrp', quoteNetwork: 'eth' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'usdc',
  },
  {
    symbol: 'ADAUSDC',
    baseAsset: 'ADA',
    quoteAsset: 'USDC',
    baseName: 'Cardano',
    isActive: true,
    binanceSymbol: 'ADAUSDT',
    tradingViewSymbol: 'COINBASE:ADAUSD', // Coinbase ADA/USD chart
    changeNow: { baseTicker: 'ada', quoteTicker: 'usdc', baseNetwork: 'ada', quoteNetwork: 'eth' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'usdc',
  },
  {
    symbol: 'AVAXUSDC',
    baseAsset: 'AVAX',
    quoteAsset: 'USDC',
    baseName: 'Avalanche',
    isActive: true,
    binanceSymbol: 'AVAXUSDC',
    tradingViewSymbol: 'COINBASE:AVAXUSD', // Coinbase AVAX/USD chart
    changeNow: { baseTicker: 'avax', quoteTicker: 'usdc', baseNetwork: 'avax', quoteNetwork: 'eth' },
    minOrderSize: 0.5,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'usdc',
  },
  {
    symbol: 'MATICUSDC',
    baseAsset: 'MATIC',
    quoteAsset: 'USDC',
    baseName: 'Polygon',
    isActive: true,
    binanceSymbol: 'MATICUSDC',
    tradingViewSymbol: 'COINBASE:MATICUSD', // Coinbase MATIC/USD chart
    changeNow: { baseTicker: 'matic', quoteTicker: 'usdc', baseNetwork: 'matic', quoteNetwork: 'eth' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'usdc',
  },
  {
    symbol: 'OPUSDC',
    baseAsset: 'OP',
    quoteAsset: 'USDC',
    baseName: 'Optimism',
    isActive: true,
    binanceSymbol: 'OPUSDT',
    tradingViewSymbol: 'COINBASE:OPUSD', // Coinbase OP/USD chart
    changeNow: { baseTicker: 'op', quoteTicker: 'usdc', baseNetwork: 'op', quoteNetwork: 'eth' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'usdc',
  },
  {
    symbol: 'LINKUSDC',
    baseAsset: 'LINK',
    quoteAsset: 'USDC',
    baseName: 'Chainlink',
    isActive: true,
    binanceSymbol: 'LINKUSDT',
    tradingViewSymbol: 'COINBASE:LINKUSD', // Coinbase LINK/USD chart
    changeNow: { baseTicker: 'link', quoteTicker: 'usdc', baseNetwork: 'eth', quoteNetwork: 'eth' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'usdc',
  },
  {
    symbol: 'DOGEUSDC',
    baseAsset: 'DOGE',
    quoteAsset: 'USDC',
    baseName: 'Dogecoin',
    isActive: true,
    binanceSymbol: 'DOGEUSDC',
    tradingViewSymbol: 'COINBASE:DOGEUSD', // Coinbase DOGE/USD chart
    changeNow: { baseTicker: 'doge', quoteTicker: 'usdc', baseNetwork: 'doge', quoteNetwork: 'eth' },
    minOrderSize: 50,
    priceDecimals: 5,
    amountDecimals: 0,
    category: 'usdc',
  },
  {
    symbol: 'DOTUSDC',
    baseAsset: 'DOT',
    quoteAsset: 'USDC',
    baseName: 'Polkadot',
    isActive: true,
    binanceSymbol: 'DOTUSDC',
    tradingViewSymbol: 'COINBASE:DOTUSD', // Coinbase DOT/USD chart
    changeNow: { baseTicker: 'dot', quoteTicker: 'usdc', baseNetwork: 'dot', quoteNetwork: 'eth' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'usdc',
  },
  {
    symbol: 'UNIUSDC',
    baseAsset: 'UNI',
    quoteAsset: 'USDC',
    baseName: 'Uniswap',
    isActive: true,
    binanceSymbol: 'UNIUSDT',
    tradingViewSymbol: 'COINBASE:UNIUSD', // Coinbase UNI/USD chart
    changeNow: { baseTicker: 'uni', quoteTicker: 'usdc', baseNetwork: 'eth', quoteNetwork: 'eth' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'usdc',
  },
  {
    symbol: 'AAVEUSDC',
    baseAsset: 'AAVE',
    quoteAsset: 'USDC',
    baseName: 'Aave',
    isActive: true,
    binanceSymbol: 'AAVEUSDT',
    tradingViewSymbol: 'COINBASE:AAVEUSD', // Coinbase AAVE/USD chart
    changeNow: { baseTicker: 'aave', quoteTicker: 'usdc', baseNetwork: 'eth', quoteNetwork: 'eth' },
    minOrderSize: 0.1,
    priceDecimals: 2,
    amountDecimals: 3,
    category: 'usdc',
  },
  {
    symbol: 'LTCUSDC',
    baseAsset: 'LTC',
    quoteAsset: 'USDC',
    baseName: 'Litecoin',
    isActive: true,
    binanceSymbol: 'LTCUSDC',
    tradingViewSymbol: 'COINBASE:LTCUSD', // Coinbase LTC/USD chart
    changeNow: { baseTicker: 'ltc', quoteTicker: 'usdc', baseNetwork: 'ltc', quoteNetwork: 'eth' },
    minOrderSize: 0.1,
    priceDecimals: 2,
    amountDecimals: 3,
    category: 'usdc',
  },
  {
    symbol: 'ATOMUSDC',
    baseAsset: 'ATOM',
    quoteAsset: 'USDC',
    baseName: 'Cosmos',
    isActive: true,
    binanceSymbol: 'ATOMUSDC',
    tradingViewSymbol: 'COINBASE:ATOMUSD', // Coinbase ATOM/USD chart
    changeNow: { baseTicker: 'atom', quoteTicker: 'usdc', baseNetwork: 'atom', quoteNetwork: 'eth' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'usdc',
  },
  {
    symbol: 'NEARUSDC',
    baseAsset: 'NEAR',
    quoteAsset: 'USDC',
    baseName: 'NEAR Protocol',
    isActive: true,
    binanceSymbol: 'NEARUSDC',
    tradingViewSymbol: 'COINBASE:NEARUSD', // Coinbase NEAR/USD chart
    changeNow: { baseTicker: 'near', quoteTicker: 'usdc', baseNetwork: 'near', quoteNetwork: 'eth' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'usdc',
  },
  {
    symbol: 'APTUSDC',
    baseAsset: 'APT',
    quoteAsset: 'USDC',
    baseName: 'Aptos',
    isActive: true,
    binanceSymbol: 'APTUSDC',
    tradingViewSymbol: 'COINBASE:APTUSD', // Coinbase APT/USD chart
    changeNow: { baseTicker: 'apt', quoteTicker: 'usdc', baseNetwork: 'apt', quoteNetwork: 'eth' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'usdc',
  },

  // ============================================
  // GAMING / METAVERSE
  // ============================================
  {
    symbol: 'SANDUSDT',
    baseAsset: 'SAND',
    quoteAsset: 'USDT',
    baseName: 'The Sandbox',
    isActive: true,
    binanceSymbol: 'SANDUSDT',
    changeNow: { baseTicker: 'sand', quoteTicker: 'usdt' },
    minOrderSize: 20,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'gaming',
  },
  {
    symbol: 'MANAUSDT',
    baseAsset: 'MANA',
    quoteAsset: 'USDT',
    baseName: 'Decentraland',
    isActive: true,
    binanceSymbol: 'MANAUSDT',
    changeNow: { baseTicker: 'mana', quoteTicker: 'usdt' },
    minOrderSize: 20,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'gaming',
  },
  {
    symbol: 'AXSUSDT',
    baseAsset: 'AXS',
    quoteAsset: 'USDT',
    baseName: 'Axie Infinity',
    isActive: true,
    binanceSymbol: 'AXSUSDT',
    changeNow: { baseTicker: 'axs', quoteTicker: 'usdt' },
    minOrderSize: 1,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'gaming',
  },
  {
    symbol: 'APEUSDT',
    baseAsset: 'APE',
    quoteAsset: 'USDT',
    baseName: 'ApeCoin',
    isActive: true,
    binanceSymbol: 'APEUSDT',
    changeNow: { baseTicker: 'ape', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'gaming',
  },
  {
    symbol: 'GALAUSDT',
    baseAsset: 'GALA',
    quoteAsset: 'USDT',
    baseName: 'Gala',
    isActive: true,
    binanceSymbol: 'GALAUSDT',
    changeNow: { baseTicker: 'gala', quoteTicker: 'usdt' },
    minOrderSize: 100,
    priceDecimals: 5,
    amountDecimals: 0,
    category: 'gaming',
  },
  {
    symbol: 'ENJUSDT',
    baseAsset: 'ENJ',
    quoteAsset: 'USDT',
    baseName: 'Enjin Coin',
    isActive: true,
    binanceSymbol: 'ENJUSDT',
    changeNow: { baseTicker: 'enj', quoteTicker: 'usdt' },
    minOrderSize: 20,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'gaming',
  },
  {
    symbol: 'RNDRUSDT',
    baseAsset: 'RNDR',
    quoteAsset: 'USDT',
    baseName: 'Render',
    isActive: true,
    binanceSymbol: 'RNDRUSDT',
    changeNow: { baseTicker: 'rndr', quoteTicker: 'usdt' },
    minOrderSize: 2,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'gaming',
  },

  // ============================================
  // MEME COINS
  // ============================================
  {
    symbol: 'SHIBUSDT',
    baseAsset: 'SHIB',
    quoteAsset: 'USDT',
    baseName: 'Shiba Inu',
    isActive: true,
    binanceSymbol: 'SHIBUSDT',
    changeNow: { baseTicker: 'shib', quoteTicker: 'usdt' },
    minOrderSize: 1000000,
    priceDecimals: 8,
    amountDecimals: 0,
    category: 'meme',
  },
  {
    symbol: 'PEPEUSDT',
    baseAsset: 'PEPE',
    quoteAsset: 'USDT',
    baseName: 'Pepe',
    isActive: true,
    binanceSymbol: 'PEPEUSDT',
    changeNow: { baseTicker: 'pepe', quoteTicker: 'usdt' },
    minOrderSize: 10000000,
    priceDecimals: 8,
    amountDecimals: 0,
    category: 'meme',
  },
  {
    symbol: 'FLOKIUSDT',
    baseAsset: 'FLOKI',
    quoteAsset: 'USDT',
    baseName: 'FLOKI',
    isActive: true,
    binanceSymbol: 'FLOKIUSDT',
    changeNow: { baseTicker: 'floki', quoteTicker: 'usdt' },
    minOrderSize: 100000,
    priceDecimals: 8,
    amountDecimals: 0,
    category: 'meme',
  },
  {
    symbol: 'BONKUSDT',
    baseAsset: 'BONK',
    quoteAsset: 'USDT',
    baseName: 'Bonk',
    isActive: true,
    binanceSymbol: 'BONKUSDT',
    changeNow: { baseTicker: 'bonk', quoteTicker: 'usdt' },
    minOrderSize: 10000000,
    priceDecimals: 8,
    amountDecimals: 0,
    category: 'meme',
  },
  {
    symbol: 'WIFUSDT',
    baseAsset: 'WIF',
    quoteAsset: 'USDT',
    baseName: 'dogwifhat',
    isActive: true,
    binanceSymbol: 'WIFUSDT',
    changeNow: { baseTicker: 'wif', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'meme',
  },

  // ============================================
  // AI / INFRASTRUCTURE
  // ============================================
  {
    symbol: 'FETUSDT',
    baseAsset: 'FET',
    quoteAsset: 'USDT',
    baseName: 'Fetch.ai',
    isActive: true,
    binanceSymbol: 'FETUSDT',
    changeNow: { baseTicker: 'fet', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'ai',
  },
  {
    symbol: 'OCEANUSDT',
    baseAsset: 'OCEAN',
    quoteAsset: 'USDT',
    baseName: 'Ocean Protocol',
    isActive: true,
    binanceSymbol: 'OCEANUSDT',
    changeNow: { baseTicker: 'ocean', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'ai',
  },
  {
    symbol: 'ENSUSDT',
    baseAsset: 'ENS',
    quoteAsset: 'USDT',
    baseName: 'Ethereum Name Service',
    isActive: true,
    binanceSymbol: 'ENSUSDT',
    changeNow: { baseTicker: 'ens', quoteTicker: 'usdt' },
    minOrderSize: 0.5,
    priceDecimals: 3,
    amountDecimals: 2,
    category: 'ai',
  },

  // ============================================
  // SOLANA ECOSYSTEM
  // ============================================
  {
    symbol: 'JUPUSDT',
    baseAsset: 'JUP',
    quoteAsset: 'USDT',
    baseName: 'Jupiter',
    isActive: true,
    binanceSymbol: 'JUPUSDT',
    changeNow: { baseTicker: 'jup', quoteTicker: 'usdt' },
    minOrderSize: 10,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'solana',
  },
  {
    symbol: 'RAYUSDT',
    baseAsset: 'RAY',
    quoteAsset: 'USDT',
    baseName: 'Raydium',
    isActive: true,
    binanceSymbol: 'RAYUSDT',
    changeNow: { baseTicker: 'ray', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'solana',
  },
  {
    symbol: 'PYTHUSDT',
    baseAsset: 'PYTH',
    quoteAsset: 'USDT',
    baseName: 'Pyth Network',
    isActive: true,
    binanceSymbol: 'PYTHUSDT',
    changeNow: { baseTicker: 'pyth', quoteTicker: 'usdt' },
    minOrderSize: 20,
    priceDecimals: 4,
    amountDecimals: 1,
    category: 'solana',
  },

  // ============================================
  // BNB CHAIN ECOSYSTEM
  // ============================================
  {
    symbol: 'CAKEUSDT',
    baseAsset: 'CAKE',
    quoteAsset: 'USDT',
    baseName: 'PancakeSwap',
    isActive: true,
    binanceSymbol: 'CAKEUSDT',
    changeNow: { baseTicker: 'cake', quoteTicker: 'usdt' },
    minOrderSize: 5,
    priceDecimals: 3,
    amountDecimals: 1,
    category: 'bnb',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all active trading pairs
 */
export const getActivePairs = (): TradingPairConfig[] => {
  return TRADING_PAIRS.filter(p => p.isActive);
};

/**
 * Get trading pair by symbol
 */
export const getPairBySymbol = (symbol: string): TradingPairConfig | undefined => {
  return TRADING_PAIRS.find(p => p.symbol === symbol);
};

/**
 * Get trading pair by base asset
 */
export const getPairsByBaseAsset = (baseAsset: string): TradingPairConfig[] => {
  return TRADING_PAIRS.filter(p => p.baseAsset === baseAsset && p.isActive);
};

/**
 * Get trading pairs by category
 */
export const getPairsByCategory = (category: string): TradingPairConfig[] => {
  return TRADING_PAIRS.filter(p => p.category === category && p.isActive);
};

/**
 * Get ChangeNow tickers for a pair
 */
export const getChangeNowTickers = (symbol: string): { baseTicker: string; quoteTicker: string } | null => {
  const pair = getPairBySymbol(symbol);
  if (!pair) return null;
  return {
    baseTicker: pair.changeNow.baseTicker,
    quoteTicker: pair.changeNow.quoteTicker,
  };
};

/**
 * Get Binance symbol for a pair (for price feed)
 */
export const getBinanceSymbol = (symbol: string): string | null => {
  const pair = getPairBySymbol(symbol);
  return pair?.binanceSymbol || null;
};

/**
 * Check if a pair has Binance price feed
 */
export const hasBinanceFeed = (symbol: string): boolean => {
  const pair = getPairBySymbol(symbol);
  return !!pair?.binanceSymbol;
};

/**
 * Get all categories
 */
export const getCategories = (): string[] => {
  const categories = new Set(TRADING_PAIRS.map(p => p.category));
  return Array.from(categories);
};

/**
 * Map base asset to ChangeNow ticker
 * Used by spotTradingService for order execution
 */
export const assetToChangeNowTicker = (asset: string): string => {
  // Find any pair with this base asset to get the ChangeNow ticker
  const pair = TRADING_PAIRS.find(p => p.baseAsset === asset);
  if (pair) {
    return pair.changeNow.baseTicker;
  }
  // Fallback: lowercase the asset name
  return asset.toLowerCase();
};

/**
 * Get price decimals for formatting
 */
export const getPriceDecimals = (symbol: string): number => {
  const pair = getPairBySymbol(symbol);
  return pair?.priceDecimals || 4;
};

/**
 * Get amount decimals for formatting
 */
export const getAmountDecimals = (symbol: string): number => {
  const pair = getPairBySymbol(symbol);
  return pair?.amountDecimals || 4;
};

export default TRADING_PAIRS;
