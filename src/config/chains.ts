// CrymadX Supported Blockchain Networks Configuration
// Used for NFT marketplace multi-chain support

export type ChainId = 'ethereum' | 'polygon' | 'base' | 'arbitrum';

export interface ChainConfig {
  id: ChainId;
  name: string;
  shortName: string;
  currency: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  explorerUrl: string;
  explorerName: string;
  alchemyNetwork: string;
  chainIdHex: string;
  chainIdDecimal: number;
}

export const SUPPORTED_CHAINS: Record<ChainId, ChainConfig> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    shortName: 'ETH',
    currency: 'ETH',
    color: '#627EEA',
    gradientFrom: '#627EEA',
    gradientTo: '#3C3C3D',
    explorerUrl: 'https://etherscan.io',
    explorerName: 'Etherscan',
    alchemyNetwork: 'eth-mainnet',
    chainIdHex: '0x1',
    chainIdDecimal: 1,
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    shortName: 'MATIC',
    currency: 'MATIC',
    color: '#8247E5',
    gradientFrom: '#8247E5',
    gradientTo: '#A982FF',
    explorerUrl: 'https://polygonscan.com',
    explorerName: 'PolygonScan',
    alchemyNetwork: 'polygon-mainnet',
    chainIdHex: '0x89',
    chainIdDecimal: 137,
  },
  base: {
    id: 'base',
    name: 'Base',
    shortName: 'BASE',
    currency: 'ETH',
    color: '#0052FF',
    gradientFrom: '#0052FF',
    gradientTo: '#3385FF',
    explorerUrl: 'https://basescan.org',
    explorerName: 'BaseScan',
    alchemyNetwork: 'base-mainnet',
    chainIdHex: '0x2105',
    chainIdDecimal: 8453,
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum',
    shortName: 'ARB',
    currency: 'ETH',
    color: '#28A0F0',
    gradientFrom: '#28A0F0',
    gradientTo: '#1C4A6E',
    explorerUrl: 'https://arbiscan.io',
    explorerName: 'Arbiscan',
    alchemyNetwork: 'arb-mainnet',
    chainIdHex: '0xa4b1',
    chainIdDecimal: 42161,
  },
};

export const CHAIN_LIST: ChainConfig[] = Object.values(SUPPORTED_CHAINS);

export const ALL_CHAINS_OPTION = {
  id: 'all' as const,
  name: 'All Chains',
  shortName: 'ALL',
  color: '#00FF88',
};

// Helper functions
export const getChainConfig = (chainId: string): ChainConfig | undefined => {
  return SUPPORTED_CHAINS[chainId as ChainId];
};

export const getChainColor = (chainId: string): string => {
  return SUPPORTED_CHAINS[chainId as ChainId]?.color || '#888888';
};

export const getChainName = (chainId: string): string => {
  return SUPPORTED_CHAINS[chainId as ChainId]?.name || chainId;
};

export const getChainCurrency = (chainId: string): string => {
  return SUPPORTED_CHAINS[chainId as ChainId]?.currency || 'ETH';
};

export const getExplorerTxUrl = (chainId: string, txHash: string): string => {
  const chain = SUPPORTED_CHAINS[chainId as ChainId];
  if (!chain) return '';
  return `${chain.explorerUrl}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (chainId: string, address: string): string => {
  const chain = SUPPORTED_CHAINS[chainId as ChainId];
  if (!chain) return '';
  return `${chain.explorerUrl}/address/${address}`;
};

export const getExplorerNFTUrl = (chainId: string, contractAddress: string, tokenId: string): string => {
  const chain = SUPPORTED_CHAINS[chainId as ChainId];
  if (!chain) return '';
  return `${chain.explorerUrl}/nft/${contractAddress}/${tokenId}`;
};

export default SUPPORTED_CHAINS;
