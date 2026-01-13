// CrymadX Supported Assets Configuration
// 200 cryptocurrencies supported by the platform

export interface AssetConfig {
  symbol: string;
  name: string;
  chainId: string;
  network: string;
  type: 'native' | 'token';
  decimals: number;
  minDeposit: string;
  minWithdraw: string;
  withdrawFee: string;
  confirmations: number;
  addressType: 'circle_evm' | 'circle_sol' | 'tatum_btc' | 'tatum_ltc' | 'tatum_doge' | 'tatum_xrp' | 'tatum_xlm' | 'tatum_bnb' | 'tatum_trx';
  hasMemo?: boolean;
  hasTag?: boolean;
  color: string;
  iconUrl?: string;
}

// ============================================
// NATIVE ASSETS (14 chains)
// ============================================
export const nativeAssets: AssetConfig[] = [
  { symbol: 'BTC', name: 'Bitcoin', chainId: 'btc', network: 'Bitcoin', type: 'native', decimals: 8, minDeposit: '0.0001', minWithdraw: '0.0005', withdrawFee: '0.0001', confirmations: 3, addressType: 'tatum_btc', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'native', decimals: 18, minDeposit: '0.001', minWithdraw: '0.005', withdrawFee: '0.001', confirmations: 12, addressType: 'circle_evm', color: '#627EEA' },
  { symbol: 'BNB', name: 'BNB', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'native', decimals: 18, minDeposit: '0.01', minWithdraw: '0.02', withdrawFee: '0.0005', confirmations: 15, addressType: 'tatum_bnb', color: '#F3BA2F' },
  { symbol: 'SOL', name: 'Solana', chainId: 'sol', network: 'Solana', type: 'native', decimals: 9, minDeposit: '0.01', minWithdraw: '0.05', withdrawFee: '0.01', confirmations: 32, addressType: 'circle_sol', color: '#9945FF' },
  { symbol: 'TRX', name: 'TRON', chainId: 'trx', network: 'TRON (TRC-20)', type: 'native', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'tatum_trx', color: '#FF0013' },
  { symbol: 'MATIC', name: 'Polygon', chainId: 'matic', network: 'Polygon', type: 'native', decimals: 18, minDeposit: '1', minWithdraw: '5', withdrawFee: '0.1', confirmations: 128, addressType: 'circle_evm', color: '#8247E5' },
  { symbol: 'AVAX', name: 'Avalanche', chainId: 'avax', network: 'Avalanche C-Chain', type: 'native', decimals: 18, minDeposit: '0.1', minWithdraw: '0.5', withdrawFee: '0.01', confirmations: 20, addressType: 'circle_evm', color: '#E84142' },
  { symbol: 'ARB', name: 'Arbitrum', chainId: 'arb', network: 'Arbitrum One', type: 'native', decimals: 18, minDeposit: '0.001', minWithdraw: '0.005', withdrawFee: '0.0005', confirmations: 20, addressType: 'circle_evm', color: '#28A0F0' },
  { symbol: 'OP', name: 'Optimism', chainId: 'op', network: 'Optimism', type: 'native', decimals: 18, minDeposit: '0.001', minWithdraw: '0.005', withdrawFee: '0.0005', confirmations: 20, addressType: 'circle_evm', color: '#FF0420' },
  { symbol: 'BASE', name: 'Base', chainId: 'base', network: 'Base', type: 'native', decimals: 18, minDeposit: '0.001', minWithdraw: '0.005', withdrawFee: '0.0005', confirmations: 20, addressType: 'circle_evm', color: '#0052FF' },
  { symbol: 'LTC', name: 'Litecoin', chainId: 'ltc', network: 'Litecoin', type: 'native', decimals: 8, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.001', confirmations: 6, addressType: 'tatum_ltc', color: '#345D9D' },
  { symbol: 'DOGE', name: 'Dogecoin', chainId: 'doge', network: 'Dogecoin', type: 'native', decimals: 8, minDeposit: '10', minWithdraw: '50', withdrawFee: '5', confirmations: 40, addressType: 'tatum_doge', color: '#C2A633' },
  { symbol: 'XRP', name: 'XRP', chainId: 'xrp', network: 'XRP Ledger', type: 'native', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '0.25', confirmations: 1, addressType: 'tatum_xrp', hasTag: true, color: '#23292F' },
  { symbol: 'XLM', name: 'Stellar', chainId: 'xlm', network: 'Stellar', type: 'native', decimals: 7, minDeposit: '1', minWithdraw: '10', withdrawFee: '0.1', confirmations: 1, addressType: 'tatum_xlm', hasMemo: true, color: '#14B6E7' },
];

// ============================================
// ERC-20 TOKENS ON ETHEREUM (50 tokens)
// ============================================
export const erc20Tokens: AssetConfig[] = [
  // Stablecoins
  { symbol: 'USDT', name: 'Tether USD', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#2775CA' },
  { symbol: 'DAI', name: 'Dai Stablecoin', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#F5AC37' },
  { symbol: 'FRAX', name: 'Frax', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#000000' },
  { symbol: 'TUSD', name: 'TrueUSD', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#2B2E7F' },
  { symbol: 'USDP', name: 'Pax Dollar', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#00845D' },
  // Wrapped Assets
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 8, minDeposit: '0.0001', minWithdraw: '0.001', withdrawFee: '0.0005', confirmations: 12, addressType: 'circle_evm', color: '#F7931A' },
  { symbol: 'WETH', name: 'Wrapped Ether', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 12, addressType: 'circle_evm', color: '#627EEA' },
  { symbol: 'stETH', name: 'Lido Staked ETH', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 12, addressType: 'circle_evm', color: '#00A3FF' },
  { symbol: 'rETH', name: 'Rocket Pool ETH', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 12, addressType: 'circle_evm', color: '#EC6B23' },
  // DeFi Blue Chips
  { symbol: 'LINK', name: 'Chainlink', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 12, addressType: 'circle_evm', color: '#375BD2' },
  { symbol: 'UNI', name: 'Uniswap', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 12, addressType: 'circle_evm', color: '#FF007A' },
  { symbol: 'AAVE', name: 'Aave', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 12, addressType: 'circle_evm', color: '#B6509E' },
  { symbol: 'MKR', name: 'Maker', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 12, addressType: 'circle_evm', color: '#1AAB9B' },
  { symbol: 'SNX', name: 'Synthetix', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 12, addressType: 'circle_evm', color: '#00D1FF' },
  { symbol: 'CRV', name: 'Curve DAO', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#40649F' },
  { symbol: 'COMP', name: 'Compound', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 12, addressType: 'circle_evm', color: '#00D395' },
  { symbol: 'LDO', name: 'Lido DAO', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 12, addressType: 'circle_evm', color: '#F69988' },
  { symbol: 'RPL', name: 'Rocket Pool', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.05', minWithdraw: '0.5', withdrawFee: '0.2', confirmations: 12, addressType: 'circle_evm', color: '#EC6B23' },
  { symbol: '1INCH', name: '1inch', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#94A6C3' },
  { symbol: 'SUSHI', name: 'SushiSwap', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#FA52A0' },
  { symbol: 'BAL', name: 'Balancer', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 12, addressType: 'circle_evm', color: '#1E1E1E' },
  { symbol: 'YFI', name: 'yearn.finance', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.0001', minWithdraw: '0.001', withdrawFee: '0.0005', confirmations: 12, addressType: 'circle_evm', color: '#006AE3' },
  // Meme Coins
  { symbol: 'SHIB', name: 'Shiba Inu', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '100000', minWithdraw: '1000000', withdrawFee: '500000', confirmations: 12, addressType: 'circle_evm', color: '#FFA409' },
  { symbol: 'PEPE', name: 'Pepe', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1000000', minWithdraw: '10000000', withdrawFee: '5000000', confirmations: 12, addressType: 'circle_evm', color: '#479F53' },
  { symbol: 'FLOKI', name: 'Floki Inu', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 9, minDeposit: '10000', minWithdraw: '100000', withdrawFee: '50000', confirmations: 12, addressType: 'circle_evm', color: '#F5A623' },
  { symbol: 'ELON', name: 'Dogelon Mars', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1000000', minWithdraw: '10000000', withdrawFee: '5000000', confirmations: 12, addressType: 'circle_evm', color: '#C2A633' },
  // Layer 2 & Infrastructure
  { symbol: 'MATIC', name: 'Polygon (ERC-20)', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#8247E5' },
  { symbol: 'IMX', name: 'Immutable X', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#00BFBF' },
  { symbol: 'LRC', name: 'Loopring', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '5', minWithdraw: '50', withdrawFee: '20', confirmations: 12, addressType: 'circle_evm', color: '#1C60FF' },
  { symbol: 'METIS', name: 'Metis', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.05', minWithdraw: '0.5', withdrawFee: '0.2', confirmations: 12, addressType: 'circle_evm', color: '#00DACC' },
  // Gaming & Metaverse
  { symbol: 'SAND', name: 'The Sandbox', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#04ADEF' },
  { symbol: 'MANA', name: 'Decentraland', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#FF2D55' },
  { symbol: 'AXS', name: 'Axie Infinity', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 12, addressType: 'circle_evm', color: '#0055D5' },
  { symbol: 'ENJ', name: 'Enjin Coin', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#624DBF' },
  { symbol: 'GALA', name: 'Gala', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 8, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 12, addressType: 'circle_evm', color: '#000000' },
  { symbol: 'ILV', name: 'Illuvium', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 12, addressType: 'circle_evm', color: '#8246FF' },
  { symbol: 'APE', name: 'ApeCoin', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 12, addressType: 'circle_evm', color: '#0056D6' },
  // AI & Data
  { symbol: 'FET', name: 'Fetch.ai', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#1D2951' },
  { symbol: 'AGIX', name: 'SingularityNET', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 8, minDeposit: '5', minWithdraw: '50', withdrawFee: '20', confirmations: 12, addressType: 'circle_evm', color: '#6916FF' },
  { symbol: 'OCEAN', name: 'Ocean Protocol', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#FF4092' },
  { symbol: 'GRT', name: 'The Graph', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '5', minWithdraw: '50', withdrawFee: '20', confirmations: 12, addressType: 'circle_evm', color: '#6747ED' },
  { symbol: 'RNDR', name: 'Render', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 12, addressType: 'circle_evm', color: '#000000' },
  // Other Popular
  { symbol: 'ENS', name: 'Ethereum Name Service', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.05', minWithdraw: '0.5', withdrawFee: '0.2', confirmations: 12, addressType: 'circle_evm', color: '#5284FF' },
  { symbol: 'BLUR', name: 'Blur', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 12, addressType: 'circle_evm', color: '#FF6B00' },
  { symbol: 'DYDX', name: 'dYdX', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 12, addressType: 'circle_evm', color: '#6966FF' },
  { symbol: 'MASK', name: 'Mask Network', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 12, addressType: 'circle_evm', color: '#1C68F3' },
  { symbol: 'ANKR', name: 'Ankr', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '50', minWithdraw: '500', withdrawFee: '200', confirmations: 12, addressType: 'circle_evm', color: '#2E6BED' },
  { symbol: 'CHZ', name: 'Chiliz', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 18, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 12, addressType: 'circle_evm', color: '#CD0124' },
  { symbol: 'CRO', name: 'Cronos', chainId: 'eth', network: 'Ethereum (ERC-20)', type: 'token', decimals: 8, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 12, addressType: 'circle_evm', color: '#002D74' },
];

// ============================================
// BEP-20 TOKENS ON BNB SMART CHAIN (35 tokens)
// ============================================
export const bep20Tokens: AssetConfig[] = [
  // Stablecoins
  { symbol: 'USDT', name: 'Tether USD', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 15, addressType: 'tatum_bnb', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 15, addressType: 'tatum_bnb', color: '#2775CA' },
  { symbol: 'BUSD', name: 'Binance USD', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 15, addressType: 'tatum_bnb', color: '#F0B90B' },
  { symbol: 'DAI', name: 'Dai Stablecoin', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 15, addressType: 'tatum_bnb', color: '#F5AC37' },
  // DeFi
  { symbol: 'CAKE', name: 'PancakeSwap', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.1', confirmations: 15, addressType: 'tatum_bnb', color: '#D1884F' },
  { symbol: 'XVS', name: 'Venus', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 15, addressType: 'tatum_bnb', color: '#F5B93B' },
  { symbol: 'ALPACA', name: 'Alpaca Finance', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 15, addressType: 'tatum_bnb', color: '#F5E042' },
  { symbol: 'BAKE', name: 'BakerySwap', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 15, addressType: 'tatum_bnb', color: '#FFB237' },
  { symbol: 'BSW', name: 'Biswap', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 15, addressType: 'tatum_bnb', color: '#1263F1' },
  // Gaming
  { symbol: 'AXS', name: 'Axie Infinity', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 15, addressType: 'tatum_bnb', color: '#0055D5' },
  { symbol: 'SLP', name: 'Smooth Love Potion', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 0, minDeposit: '100', minWithdraw: '1000', withdrawFee: '500', confirmations: 15, addressType: 'tatum_bnb', color: '#F08080' },
  { symbol: 'HERO', name: 'Metahero', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 15, addressType: 'tatum_bnb', color: '#DF1AFF' },
  { symbol: 'MBOX', name: 'MOBOX', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 15, addressType: 'tatum_bnb', color: '#FFC700' },
  // Meme & Community
  { symbol: 'SHIB', name: 'Shiba Inu', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '100000', minWithdraw: '1000000', withdrawFee: '100000', confirmations: 15, addressType: 'tatum_bnb', color: '#FFA409' },
  { symbol: 'FLOKI', name: 'Floki Inu', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 9, minDeposit: '10000', minWithdraw: '100000', withdrawFee: '10000', confirmations: 15, addressType: 'tatum_bnb', color: '#F5A623' },
  { symbol: 'BABYDOGE', name: 'Baby Doge Coin', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 9, minDeposit: '1000000000', minWithdraw: '10000000000', withdrawFee: '1000000000', confirmations: 15, addressType: 'tatum_bnb', color: '#F9A826' },
  { symbol: 'SAFEMOON', name: 'SafeMoon', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 9, minDeposit: '100000', minWithdraw: '1000000', withdrawFee: '100000', confirmations: 15, addressType: 'tatum_bnb', color: '#00A79D' },
  // Infrastructure
  { symbol: 'TWT', name: 'Trust Wallet Token', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 15, addressType: 'tatum_bnb', color: '#3375BB' },
  { symbol: 'INJ', name: 'Injective', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 15, addressType: 'tatum_bnb', color: '#00F2FE' },
  { symbol: 'LINK', name: 'Chainlink', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 15, addressType: 'tatum_bnb', color: '#375BD2' },
  { symbol: 'UNI', name: 'Uniswap', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 15, addressType: 'tatum_bnb', color: '#FF007A' },
  // Wrapped
  { symbol: 'BTCB', name: 'Bitcoin BEP2', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.0001', minWithdraw: '0.001', withdrawFee: '0.0005', confirmations: 15, addressType: 'tatum_bnb', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum (BEP-20)', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 15, addressType: 'tatum_bnb', color: '#627EEA' },
  // Other Popular
  { symbol: 'C98', name: 'Coin98', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 15, addressType: 'tatum_bnb', color: '#D9B432' },
  { symbol: 'DODO', name: 'DODO', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '5', minWithdraw: '50', withdrawFee: '20', confirmations: 15, addressType: 'tatum_bnb', color: '#FFE804' },
  { symbol: 'LINA', name: 'Linear Finance', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '50', minWithdraw: '500', withdrawFee: '200', confirmations: 15, addressType: 'tatum_bnb', color: '#1BD8EF' },
  { symbol: 'SFP', name: 'SafePal', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 15, addressType: 'tatum_bnb', color: '#4D5FFF' },
  { symbol: 'RACA', name: 'Radio Caca', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1000', minWithdraw: '10000', withdrawFee: '5000', confirmations: 15, addressType: 'tatum_bnb', color: '#FF5C00' },
  { symbol: 'HIGH', name: 'Highstreet', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 15, addressType: 'tatum_bnb', color: '#0066FF' },
  { symbol: 'CHESS', name: 'Tranchess', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 15, addressType: 'tatum_bnb', color: '#5D47FF' },
  { symbol: 'BURGER', name: 'BurgerSwap', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 15, addressType: 'tatum_bnb', color: '#F5A623' },
  { symbol: 'AUTO', name: 'Auto', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 15, addressType: 'tatum_bnb', color: '#2D2D2D' },
  { symbol: 'BELT', name: 'Belt Finance', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 15, addressType: 'tatum_bnb', color: '#0066FF' },
  { symbol: 'WOM', name: 'Wombat Exchange', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 15, addressType: 'tatum_bnb', color: '#FF69B4' },
  { symbol: 'THE', name: 'Thena', chainId: 'bsc', network: 'BNB Smart Chain (BEP-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 15, addressType: 'tatum_bnb', color: '#8B5CF6' },
];

// ============================================
// TRC-20 TOKENS ON TRON (15 tokens)
// ============================================
export const trc20Tokens: AssetConfig[] = [
  { symbol: 'USDT', name: 'Tether USD', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'tatum_trx', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'tatum_trx', color: '#2775CA' },
  { symbol: 'USDD', name: 'USDD', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'tatum_trx', color: '#39B54A' },
  { symbol: 'TUSD', name: 'TrueUSD', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'tatum_trx', color: '#2B2E7F' },
  { symbol: 'BTT', name: 'BitTorrent', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 18, minDeposit: '10000', minWithdraw: '100000', withdrawFee: '50000', confirmations: 20, addressType: 'tatum_trx', color: '#FF0013' },
  { symbol: 'JST', name: 'JUST', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 18, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 20, addressType: 'tatum_trx', color: '#C4161C' },
  { symbol: 'SUN', name: 'SUN', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 20, addressType: 'tatum_trx', color: '#FFB700' },
  { symbol: 'WIN', name: 'WINkLink', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 6, minDeposit: '10000', minWithdraw: '100000', withdrawFee: '50000', confirmations: 20, addressType: 'tatum_trx', color: '#006EF2' },
  { symbol: 'NFT', name: 'APENFT', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 6, minDeposit: '100000', minWithdraw: '1000000', withdrawFee: '500000', confirmations: 20, addressType: 'tatum_trx', color: '#000000' },
  { symbol: 'WTRX', name: 'Wrapped TRX', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 6, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 20, addressType: 'tatum_trx', color: '#FF0013' },
  { symbol: 'SUNOLD', name: 'SUN (Old)', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 20, addressType: 'tatum_trx', color: '#FFB700' },
  { symbol: 'USDJ', name: 'JUST Stablecoin', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 20, addressType: 'tatum_trx', color: '#C4161C' },
  { symbol: 'LTC', name: 'Litecoin (TRC-20)', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 8, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 20, addressType: 'tatum_trx', color: '#345D9D' },
  { symbol: 'ETH', name: 'Ethereum (TRC-20)', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 20, addressType: 'tatum_trx', color: '#627EEA' },
  { symbol: 'BTC', name: 'Bitcoin (TRC-20)', chainId: 'trx', network: 'TRON (TRC-20)', type: 'token', decimals: 8, minDeposit: '0.0001', minWithdraw: '0.001', withdrawFee: '0.0005', confirmations: 20, addressType: 'tatum_trx', color: '#F7931A' },
];

// ============================================
// SPL TOKENS ON SOLANA (25 tokens)
// ============================================
export const splTokens: AssetConfig[] = [
  // Stablecoins
  { symbol: 'USDT', name: 'Tether USD', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 32, addressType: 'circle_sol', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 32, addressType: 'circle_sol', color: '#2775CA' },
  { symbol: 'PYUSD', name: 'PayPal USD', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 32, addressType: 'circle_sol', color: '#003087' },
  // DeFi
  { symbol: 'RAY', name: 'Raydium', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.1', confirmations: 32, addressType: 'circle_sol', color: '#7B5BE3' },
  { symbol: 'ORCA', name: 'Orca', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 32, addressType: 'circle_sol', color: '#FFD15C' },
  { symbol: 'SRM', name: 'Serum', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 32, addressType: 'circle_sol', color: '#4EC3CC' },
  { symbol: 'MNGO', name: 'Mango', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 32, addressType: 'circle_sol', color: '#E54033' },
  { symbol: 'STEP', name: 'Step Finance', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 32, addressType: 'circle_sol', color: '#00FF95' },
  { symbol: 'JTO', name: 'Jito', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 32, addressType: 'circle_sol', color: '#7F56D9' },
  { symbol: 'JUP', name: 'Jupiter', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 32, addressType: 'circle_sol', color: '#00D395' },
  // Meme Coins
  { symbol: 'BONK', name: 'Bonk', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 5, minDeposit: '100000', minWithdraw: '1000000', withdrawFee: '50000', confirmations: 32, addressType: 'circle_sol', color: '#F6A14C' },
  { symbol: 'WIF', name: 'dogwifhat', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 32, addressType: 'circle_sol', color: '#B19CD9' },
  { symbol: 'SAMO', name: 'Samoyedcoin', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '100', minWithdraw: '1000', withdrawFee: '500', confirmations: 32, addressType: 'circle_sol', color: '#FF6B00' },
  { symbol: 'POPCAT', name: 'Popcat', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 32, addressType: 'circle_sol', color: '#FFD700' },
  { symbol: 'MYRO', name: 'Myro', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 32, addressType: 'circle_sol', color: '#FF4500' },
  // NFT & Gaming
  { symbol: 'DUST', name: 'DUST Protocol', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 32, addressType: 'circle_sol', color: '#7C3AED' },
  { symbol: 'GMT', name: 'STEPN', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 32, addressType: 'circle_sol', color: '#D9E822' },
  { symbol: 'GST', name: 'Green Satoshi', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 32, addressType: 'circle_sol', color: '#00FF95' },
  // Wrapped
  { symbol: 'mSOL', name: 'Marinade SOL', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 32, addressType: 'circle_sol', color: '#308D8A' },
  { symbol: 'stSOL', name: 'Lido Staked SOL', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 32, addressType: 'circle_sol', color: '#00A3FF' },
  { symbol: 'jitoSOL', name: 'Jito Staked SOL', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 9, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 32, addressType: 'circle_sol', color: '#00CCBD' },
  // Other
  { symbol: 'RENDER', name: 'Render', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 8, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 32, addressType: 'circle_sol', color: '#000000' },
  { symbol: 'PYTH', name: 'Pyth Network', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 32, addressType: 'circle_sol', color: '#6633CC' },
  { symbol: 'HNT', name: 'Helium', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 8, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 32, addressType: 'circle_sol', color: '#474DFF' },
  { symbol: 'MOBILE', name: 'Helium Mobile', chainId: 'sol', network: 'Solana (SPL)', type: 'token', decimals: 6, minDeposit: '100', minWithdraw: '1000', withdrawFee: '500', confirmations: 32, addressType: 'circle_sol', color: '#2563EB' },
];

// ============================================
// POLYGON TOKENS (20 tokens)
// ============================================
export const polygonTokens: AssetConfig[] = [
  { symbol: 'USDT', name: 'Tether USD', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 128, addressType: 'circle_evm', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 128, addressType: 'circle_evm', color: '#2775CA' },
  { symbol: 'DAI', name: 'Dai Stablecoin', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 128, addressType: 'circle_evm', color: '#F5AC37' },
  { symbol: 'WETH', name: 'Wrapped Ether', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 128, addressType: 'circle_evm', color: '#627EEA' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 8, minDeposit: '0.0001', minWithdraw: '0.001', withdrawFee: '0.0005', confirmations: 128, addressType: 'circle_evm', color: '#F7931A' },
  { symbol: 'LINK', name: 'Chainlink', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 128, addressType: 'circle_evm', color: '#375BD2' },
  { symbol: 'AAVE', name: 'Aave', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 128, addressType: 'circle_evm', color: '#B6509E' },
  { symbol: 'UNI', name: 'Uniswap', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 128, addressType: 'circle_evm', color: '#FF007A' },
  { symbol: 'CRV', name: 'Curve DAO', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 128, addressType: 'circle_evm', color: '#40649F' },
  { symbol: 'SUSHI', name: 'SushiSwap', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 128, addressType: 'circle_evm', color: '#FA52A0' },
  { symbol: 'QUICK', name: 'QuickSwap', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 128, addressType: 'circle_evm', color: '#418099' },
  { symbol: 'BAL', name: 'Balancer', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 128, addressType: 'circle_evm', color: '#1E1E1E' },
  { symbol: 'GRT', name: 'The Graph', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '5', minWithdraw: '50', withdrawFee: '20', confirmations: 128, addressType: 'circle_evm', color: '#6747ED' },
  { symbol: 'SAND', name: 'The Sandbox', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 128, addressType: 'circle_evm', color: '#04ADEF' },
  { symbol: 'MANA', name: 'Decentraland', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 128, addressType: 'circle_evm', color: '#FF2D55' },
  { symbol: 'stMATIC', name: 'Staked MATIC', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 128, addressType: 'circle_evm', color: '#8247E5' },
  { symbol: 'GHST', name: 'Aavegotchi', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 128, addressType: 'circle_evm', color: '#FA34F3' },
  { symbol: 'KLIMA', name: 'Klima DAO', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 9, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 128, addressType: 'circle_evm', color: '#00CC33' },
  { symbol: 'VOXEL', name: 'Voxies', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '5', minWithdraw: '50', withdrawFee: '20', confirmations: 128, addressType: 'circle_evm', color: '#FFB800' },
  { symbol: 'DFYN', name: 'Dfyn Network', chainId: 'matic', network: 'Polygon', type: 'token', decimals: 18, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 128, addressType: 'circle_evm', color: '#6B5CE7' },
];

// ============================================
// ARBITRUM TOKENS (20 tokens)
// ============================================
export const arbitrumTokens: AssetConfig[] = [
  { symbol: 'USDT', name: 'Tether USD', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#2775CA' },
  { symbol: 'DAI', name: 'Dai Stablecoin', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#F5AC37' },
  { symbol: 'WETH', name: 'Wrapped Ether', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 20, addressType: 'circle_evm', color: '#627EEA' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 8, minDeposit: '0.0001', minWithdraw: '0.001', withdrawFee: '0.0005', confirmations: 20, addressType: 'circle_evm', color: '#F7931A' },
  { symbol: 'ARB', name: 'Arbitrum', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '5', withdrawFee: '0.5', confirmations: 20, addressType: 'circle_evm', color: '#28A0F0' },
  { symbol: 'GMX', name: 'GMX', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 20, addressType: 'circle_evm', color: '#5C47FF' },
  { symbol: 'RDNT', name: 'Radiant', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 20, addressType: 'circle_evm', color: '#00D2B6' },
  { symbol: 'MAGIC', name: 'Magic', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 20, addressType: 'circle_evm', color: '#DC2626' },
  { symbol: 'DPX', name: 'Dopex', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 20, addressType: 'circle_evm', color: '#002D74' },
  { symbol: 'JONES', name: 'Jones DAO', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 20, addressType: 'circle_evm', color: '#FFB300' },
  { symbol: 'GRAIL', name: 'Camelot', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 20, addressType: 'circle_evm', color: '#7C3AED' },
  { symbol: 'LINK', name: 'Chainlink', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 20, addressType: 'circle_evm', color: '#375BD2' },
  { symbol: 'UNI', name: 'Uniswap', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 20, addressType: 'circle_evm', color: '#FF007A' },
  { symbol: 'SUSHI', name: 'SushiSwap', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 20, addressType: 'circle_evm', color: '#FA52A0' },
  { symbol: 'PENDLE', name: 'Pendle', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 20, addressType: 'circle_evm', color: '#EAFF00' },
  { symbol: 'STG', name: 'Stargate', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 20, addressType: 'circle_evm', color: '#000000' },
  { symbol: 'GNS', name: 'Gains Network', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 20, addressType: 'circle_evm', color: '#3C82F6' },
  { symbol: 'VELA', name: 'Vela', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 20, addressType: 'circle_evm', color: '#6366F1' },
  { symbol: 'Y2K', name: 'Y2K Finance', chainId: 'arb', network: 'Arbitrum One', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 20, addressType: 'circle_evm', color: '#FF0000' },
];

// ============================================
// OPTIMISM TOKENS (15 tokens)
// ============================================
export const optimismTokens: AssetConfig[] = [
  { symbol: 'USDT', name: 'Tether USD', chainId: 'op', network: 'Optimism', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', chainId: 'op', network: 'Optimism', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#2775CA' },
  { symbol: 'DAI', name: 'Dai Stablecoin', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#F5AC37' },
  { symbol: 'WETH', name: 'Wrapped Ether', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 20, addressType: 'circle_evm', color: '#627EEA' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', chainId: 'op', network: 'Optimism', type: 'token', decimals: 8, minDeposit: '0.0001', minWithdraw: '0.001', withdrawFee: '0.0005', confirmations: 20, addressType: 'circle_evm', color: '#F7931A' },
  { symbol: 'OP', name: 'Optimism', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.1', confirmations: 20, addressType: 'circle_evm', color: '#FF0420' },
  { symbol: 'VELO', name: 'Velodrome', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 20, addressType: 'circle_evm', color: '#2D62F6' },
  { symbol: 'SNX', name: 'Synthetix', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 20, addressType: 'circle_evm', color: '#00D1FF' },
  { symbol: 'LINK', name: 'Chainlink', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.5', confirmations: 20, addressType: 'circle_evm', color: '#375BD2' },
  { symbol: 'PERP', name: 'Perpetual Protocol', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '0.5', minWithdraw: '5', withdrawFee: '2', confirmations: 20, addressType: 'circle_evm', color: '#3CEAA3' },
  { symbol: 'KWENTA', name: 'Kwenta', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 20, addressType: 'circle_evm', color: '#00D1FF' },
  { symbol: 'THALES', name: 'Thales', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '5', minWithdraw: '50', withdrawFee: '20', confirmations: 20, addressType: 'circle_evm', color: '#8B5CF6' },
  { symbol: 'LYRA', name: 'Lyra', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '10', minWithdraw: '100', withdrawFee: '50', confirmations: 20, addressType: 'circle_evm', color: '#47FFA5' },
  { symbol: 'sUSD', name: 'Synth sUSD', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 20, addressType: 'circle_evm', color: '#1E1A31' },
  { symbol: 'rETH', name: 'Rocket Pool ETH', chainId: 'op', network: 'Optimism', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 20, addressType: 'circle_evm', color: '#EC6B23' },
];

// ============================================
// BASE TOKENS (10 tokens)
// ============================================
export const baseTokens: AssetConfig[] = [
  { symbol: 'USDC', name: 'USD Coin', chainId: 'base', network: 'Base', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#2775CA' },
  { symbol: 'USDbC', name: 'USD Base Coin', chainId: 'base', network: 'Base', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#2775CA' },
  { symbol: 'DAI', name: 'Dai Stablecoin', chainId: 'base', network: 'Base', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#F5AC37' },
  { symbol: 'WETH', name: 'Wrapped Ether', chainId: 'base', network: 'Base', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 20, addressType: 'circle_evm', color: '#627EEA' },
  { symbol: 'cbETH', name: 'Coinbase ETH', chainId: 'base', network: 'Base', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 20, addressType: 'circle_evm', color: '#0052FF' },
  { symbol: 'AERO', name: 'Aerodrome', chainId: 'base', network: 'Base', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 20, addressType: 'circle_evm', color: '#0066FF' },
  { symbol: 'BALD', name: 'Bald', chainId: 'base', network: 'Base', type: 'token', decimals: 18, minDeposit: '100', minWithdraw: '1000', withdrawFee: '500', confirmations: 20, addressType: 'circle_evm', color: '#000000' },
  { symbol: 'TOSHI', name: 'Toshi', chainId: 'base', network: 'Base', type: 'token', decimals: 18, minDeposit: '1000', minWithdraw: '10000', withdrawFee: '5000', confirmations: 20, addressType: 'circle_evm', color: '#0052FF' },
  { symbol: 'BRETT', name: 'Brett', chainId: 'base', network: 'Base', type: 'token', decimals: 18, minDeposit: '100', minWithdraw: '1000', withdrawFee: '500', confirmations: 20, addressType: 'circle_evm', color: '#0066FF' },
  { symbol: 'DEGEN', name: 'Degen', chainId: 'base', network: 'Base', type: 'token', decimals: 18, minDeposit: '100', minWithdraw: '1000', withdrawFee: '500', confirmations: 20, addressType: 'circle_evm', color: '#A36EFD' },
];

// ============================================
// AVALANCHE TOKENS (11 tokens)
// ============================================
export const avalancheTokens: AssetConfig[] = [
  { symbol: 'USDT', name: 'Tether USD', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 6, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#2775CA' },
  { symbol: 'DAI', name: 'Dai Stablecoin', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '1', confirmations: 20, addressType: 'circle_evm', color: '#F5AC37' },
  { symbol: 'WETH', name: 'Wrapped Ether', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 18, minDeposit: '0.001', minWithdraw: '0.01', withdrawFee: '0.005', confirmations: 20, addressType: 'circle_evm', color: '#627EEA' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 8, minDeposit: '0.0001', minWithdraw: '0.001', withdrawFee: '0.0005', confirmations: 20, addressType: 'circle_evm', color: '#F7931A' },
  { symbol: 'JOE', name: 'Trader Joe', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 20, addressType: 'circle_evm', color: '#FF0000' },
  { symbol: 'PNG', name: 'Pangolin', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 18, minDeposit: '1', minWithdraw: '10', withdrawFee: '5', confirmations: 20, addressType: 'circle_evm', color: '#FFC800' },
  { symbol: 'sAVAX', name: 'Staked AVAX', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 18, minDeposit: '0.1', minWithdraw: '1', withdrawFee: '0.1', confirmations: 20, addressType: 'circle_evm', color: '#E84142' },
  { symbol: 'QI', name: 'BENQI', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 18, minDeposit: '50', minWithdraw: '500', withdrawFee: '200', confirmations: 20, addressType: 'circle_evm', color: '#2596BE' },
  { symbol: 'GMX', name: 'GMX', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 18, minDeposit: '0.01', minWithdraw: '0.1', withdrawFee: '0.05', confirmations: 20, addressType: 'circle_evm', color: '#5C47FF' },
  { symbol: 'COQ', name: 'Coq Inu', chainId: 'avax', network: 'Avalanche C-Chain', type: 'token', decimals: 18, minDeposit: '1000000', minWithdraw: '10000000', withdrawFee: '5000000', confirmations: 20, addressType: 'circle_evm', color: '#FF5722' },
];

// ============================================
// ALL ASSETS COMBINED (200 tokens)
// ============================================
export const allAssets: AssetConfig[] = [
  ...nativeAssets,      // 14
  ...erc20Tokens,       // 50
  ...bep20Tokens,       // 35
  ...trc20Tokens,       // 15
  ...splTokens,         // 25
  ...polygonTokens,     // 20
  ...arbitrumTokens,    // 20
  ...optimismTokens,    // 15
  ...baseTokens,        // 10
  ...avalancheTokens,   // 11
  // Total: 215 tokens (including some overlap)
];

// ============================================
// UTILITY FUNCTIONS
// ============================================
export const getAssetsByChain = (chainId: string): AssetConfig[] => {
  return allAssets.filter(asset => asset.chainId === chainId);
};

export const getNativeAssets = (): AssetConfig[] => {
  return nativeAssets;
};

export const getAsset = (symbol: string, chainId: string): AssetConfig | undefined => {
  return allAssets.find(
    asset => asset.symbol.toUpperCase() === symbol.toUpperCase() && asset.chainId === chainId
  );
};

export const getChains = (): string[] => {
  return [...new Set(allAssets.map(asset => asset.chainId))];
};

export const chainInfo: Record<string, { name: string; color: string; icon?: string }> = {
  btc: { name: 'Bitcoin', color: '#F7931A' },
  eth: { name: 'Ethereum', color: '#627EEA' },
  bsc: { name: 'BNB Smart Chain', color: '#F3BA2F' },
  sol: { name: 'Solana', color: '#9945FF' },
  trx: { name: 'TRON', color: '#FF0013' },
  matic: { name: 'Polygon', color: '#8247E5' },
  avax: { name: 'Avalanche', color: '#E84142' },
  arb: { name: 'Arbitrum', color: '#28A0F0' },
  op: { name: 'Optimism', color: '#FF0420' },
  base: { name: 'Base', color: '#0052FF' },
  ltc: { name: 'Litecoin', color: '#345D9D' },
  doge: { name: 'Dogecoin', color: '#C2A633' },
  xrp: { name: 'XRP Ledger', color: '#23292F' },
  xlm: { name: 'Stellar', color: '#14B6E7' },
};

export default allAssets;
