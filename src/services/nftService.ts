// CrymadX NFT Service
// Handles NFT portfolio, marketplace, and transactions
// Integrates with OpenSea for marketplace browsing

import { api } from './api';
import type { NFT, NFTListing } from '../types/api';

export interface ListNFTRequest {
  contractAddress: string;
  tokenId: string;
  price: string;
  currency: string;
  expirationDays?: number;
}

export interface MarketplaceFilters {
  collection?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: 'price_asc' | 'price_desc' | 'recent';
  limit?: number;
  offset?: number;
}

// OpenSea marketplace types
export interface OpenSeaCollection {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  bannerImageUrl: string;
  floorPrice?: string;
  chain: string;
  contractAddress: string;
  openseaUrl: string;
  category?: string;
}

export interface OpenSeaListing {
  orderHash: string;
  chain: string;
  contractAddress: string;
  tokenId: string;
  price: {
    amount: string;
    currency: string;
  };
  seller: string;
  expirationTime: string;
  status: string;
  // Optional enriched fields (fetched separately)
  imageUrl?: string;
  name?: string;
  openseaUrl?: string;
}

export interface OpenSeaNFT {
  identifier: string;
  collection: string;
  contract: string;
  name: string;
  description: string;
  imageUrl: string;
  openseaUrl: string;
  chain: string;
  tokenStandard: string;
}

// ==========================================
// Platform NFT Marketplace Types
// ==========================================

export type SupportedChain = 'ethereum' | 'polygon' | 'base' | 'arbitrum';

export interface PlatformNFT {
  listingId: string;
  tokenId: string;
  contractAddress: string;
  chain: SupportedChain;
  name: string;
  description?: string;
  image: string;
  collection: string;
  collectionImage?: string;
  price: string;
  currency: string;
  priceUsd?: string;
  seller: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  tokenStandard: 'ERC721' | 'ERC1155';
  quantity?: number;
  createdAt: string;
  expiresAt?: string;
}

export interface PurchaseEstimate {
  listingId: string;
  nftName: string;
  nftImage: string;
  price: string;
  platformFee: string;
  platformFeePercent: number;
  networkFee?: string;
  total: string;
  currency: string;
  chain: SupportedChain;
  priceUsd?: string;
  totalUsd?: string;
  userBalance: string;
  hasSufficientBalance: boolean;
}

export interface PurchaseRequest {
  listingId: string;
}

export interface PurchaseResult {
  purchaseId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  message: string;
  txHash?: string;
  nft?: PlatformNFT;
}

export interface PurchaseHistoryItem {
  purchaseId: string;
  listingId: string;
  nft: {
    tokenId: string;
    contractAddress: string;
    name: string;
    image: string;
    collection: string;
    chain: SupportedChain;
  };
  price: string;
  platformFee: string;
  total: string;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  txHash?: string;
  purchasedAt: string;
  completedAt?: string;
}

export interface OwnedNFT {
  tokenId: string;
  contractAddress: string;
  chain: SupportedChain;
  name: string;
  description?: string;
  image: string;
  collection: string;
  collectionImage?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  tokenStandard: 'ERC721' | 'ERC1155';
  balance?: number;
  floorPrice?: string;
  lastSalePrice?: string;
  acquiredAt?: string;
}

export const nftService = {
  /**
   * Get user's owned NFTs
   */
  getOwnedNFTs: async (chain: string = 'POLYGON'): Promise<{
    nfts: NFT[];
    total: number;
  }> => {
    return api.get('/api/nft/owned', { chain });
  },

  /**
   * Get NFT details
   */
  getNFTDetails: async (contractAddress: string, tokenId: string): Promise<{ nft: NFT }> => {
    return api.get(`/api/nft/details/${contractAddress}/${tokenId}`, undefined, false);
  },

  /**
   * Get collection details
   */
  getCollection: async (contractAddress: string): Promise<{
    collection: {
      contractAddress: string;
      name: string;
      description?: string;
      totalSupply: number;
      floorPrice: string;
      volume24h: string;
      owners: number;
    };
  }> => {
    return api.get(`/api/nft/collection/${contractAddress}`, undefined, false);
  },

  /**
   * List NFT for sale
   */
  listNFT: async (request: ListNFTRequest): Promise<{
    message: string;
    listing: {
      id: string;
      tokenId: string;
      price: string;
      expiresAt: string;
    };
  }> => {
    return api.post('/api/nft/list', request);
  },

  /**
   * Cancel NFT listing
   */
  cancelListing: async (listingId: string): Promise<{ message: string }> => {
    return api.delete(`/api/nft/listings/${listingId}`);
  },

  /**
   * Browse marketplace
   */
  getMarketplace: async (filters?: MarketplaceFilters): Promise<{
    listings: NFTListing[];
    total: number;
  }> => {
    return api.get('/api/nft/marketplace', filters as Record<string, any>, false);
  },

  /**
   * Buy NFT from marketplace
   */
  buyNFT: async (listingId: string): Promise<{
    message: string;
    transaction: {
      txHash: string;
      tokenId: string;
      price: string;
      status: string;
    };
  }> => {
    return api.post(`/api/nft/buy/${listingId}`);
  },

  /**
   * Get user's listings
   */
  getMyListings: async (): Promise<{ listings: NFTListing[] }> => {
    return api.get('/api/nft/my-listings');
  },

  /**
   * Format IPFS URL for display
   */
  formatIPFSUrl: (ipfsUrl: string): string => {
    if (ipfsUrl.startsWith('ipfs://')) {
      return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    return ipfsUrl;
  },

  /**
   * Truncate address for display
   */
  truncateAddress: (address: string): string => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  /**
   * Format NFT price
   */
  formatPrice: (price: string, currency: string): string => {
    const num = parseFloat(price);
    return `${num.toFixed(4)} ${currency}`;
  },

  // ==========================================
  // OpenSea Marketplace Methods
  // ==========================================

  /**
   * Get trending/popular collections from OpenSea
   */
  getTrendingCollections: async (): Promise<{ collections: OpenSeaCollection[] }> => {
    return api.get('/api/nft/marketplace/trending', undefined, false);
  },

  /**
   * Get collections from OpenSea
   */
  getCollections: async (params?: {
    chain?: string;
    limit?: number;
    next?: string;
  }): Promise<{ collections: OpenSeaCollection[]; next?: string }> => {
    return api.get('/api/nft/marketplace/collections', params as Record<string, any>, false);
  },

  /**
   * Get collection details by slug
   */
  getCollectionBySlug: async (slug: string): Promise<{ collection: OpenSeaCollection }> => {
    return api.get(`/api/nft/marketplace/collection/${slug}`, undefined, false);
  },

  /**
   * Get active listings for a collection (NFTs for sale)
   */
  getCollectionListings: async (
    collectionSlug: string,
    params?: { limit?: number; next?: string }
  ): Promise<{ listings: OpenSeaListing[]; next?: string; total: number }> => {
    return api.get(`/api/nft/marketplace/listings/${collectionSlug}`, params as Record<string, any>, false);
  },

  /**
   * Get NFTs from a collection
   */
  getCollectionNFTs: async (
    chain: string,
    contractAddress: string,
    params?: { limit?: number; next?: string }
  ): Promise<{ nfts: OpenSeaNFT[]; next?: string; total: number }> => {
    return api.get(`/api/nft/marketplace/nfts/${chain}/${contractAddress}`, params as Record<string, any>, false);
  },

  /**
   * Get single NFT details from OpenSea
   */
  getOpenSeaNFT: async (
    chain: string,
    contractAddress: string,
    tokenId: string
  ): Promise<{ nft: OpenSeaNFT }> => {
    const response = await api.get<{ nft: any }>(`/api/nft/marketplace/nft/${chain}/${contractAddress}/${tokenId}`, undefined, false);
    // Transform snake_case to camelCase
    if (response.nft) {
      const n = response.nft;
      return {
        nft: {
          identifier: n.identifier || '',
          collection: n.collection || '',
          contract: n.contract || '',
          name: n.name || '',
          description: n.description || '',
          imageUrl: n.image_url || n.display_image_url || n.imageUrl || '',
          openseaUrl: n.opensea_url || n.openseaUrl || '',
          chain: chain,
          tokenStandard: n.token_standard || n.tokenStandard || 'erc721',
        },
      };
    }
    return response as { nft: OpenSeaNFT };
  },

  /**
   * Get best listing for a specific NFT
   */
  getNFTListing: async (
    chain: string,
    contractAddress: string,
    tokenId: string
  ): Promise<{ listing: OpenSeaListing | null }> => {
    return api.get(`/api/nft/marketplace/nft/${chain}/${contractAddress}/${tokenId}/listing`, undefined, false);
  },

  /**
   * Search collections
   */
  searchCollections: async (query: string, limit?: number): Promise<{ collections: OpenSeaCollection[] }> => {
    return api.get('/api/nft/marketplace/search/collections', { q: query, limit }, false);
  },

  /**
   * Get chain display name
   */
  getChainName: (chain: string): string => {
    const chains: Record<string, string> = {
      ethereum: 'Ethereum',
      polygon: 'Polygon',
      arbitrum: 'Arbitrum',
      optimism: 'Optimism',
      base: 'Base',
      avalanche: 'Avalanche',
      solana: 'Solana',
    };
    return chains[chain.toLowerCase()] || chain;
  },

  /**
   * Get chain icon/color
   */
  getChainColor: (chain: string): string => {
    const colors: Record<string, string> = {
      ethereum: '#627EEA',
      polygon: '#8247E5',
      arbitrum: '#28A0F0',
      optimism: '#FF0420',
      base: '#0052FF',
      avalanche: '#E84142',
      solana: '#9945FF',
    };
    return colors[chain.toLowerCase()] || '#888888';
  },

  /**
   * Format ETH price for display
   */
  formatEthPrice: (ethAmount: string): string => {
    const num = parseFloat(ethAmount);
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K ETH`;
    }
    if (num >= 1) {
      return `${num.toFixed(2)} ETH`;
    }
    return `${num.toFixed(4)} ETH`;
  },

  /**
   * Open NFT on OpenSea
   */
  openOnOpenSea: (openseaUrl: string): void => {
    window.open(openseaUrl, '_blank', 'noopener,noreferrer');
  },

  // ==========================================
  // Platform NFT Purchase Methods
  // ==========================================

  /**
   * Get NFTs available for purchase from platform wallets
   */
  getPlatformListings: async (chain?: string): Promise<{ listings: PlatformNFT[]; total: number }> => {
    const params = chain && chain !== 'all' ? { chain } : {};
    return api.get('/api/nft/platform/listings', params, false);
  },

  /**
   * Get a single platform listing by ID
   */
  getPlatformListing: async (listingId: string): Promise<{ listing: PlatformNFT }> => {
    return api.get(`/api/nft/platform/listings/${listingId}`, undefined, false);
  },

  /**
   * Get purchase cost estimate with fee breakdown
   */
  getPurchaseEstimate: async (listingId: string): Promise<PurchaseEstimate> => {
    return api.get(`/api/nft/purchase/estimate/${listingId}`);
  },

  /**
   * Execute NFT purchase using internal balance
   */
  purchaseNFT: async (listingId: string): Promise<PurchaseResult> => {
    return api.post('/api/nft/purchase', { listingId });
  },

  /**
   * Get purchase status by ID
   */
  getPurchaseStatus: async (purchaseId: string): Promise<PurchaseResult> => {
    return api.get(`/api/nft/purchase/${purchaseId}`);
  },

  /**
   * Get user's purchase history
   */
  getPurchaseHistory: async (): Promise<{ purchases: PurchaseHistoryItem[]; total: number }> => {
    return api.get('/api/nft/purchases/history');
  },

  /**
   * Get user's owned NFTs from platform wallets (multi-chain)
   */
  getMyPlatformNFTs: async (chain?: string): Promise<{ nfts: OwnedNFT[]; total: number }> => {
    const params = chain && chain !== 'all' ? { chain } : {};
    return api.get('/api/nft/owned/platform', params);
  },

  /**
   * Poll purchase status until completion or failure
   */
  pollPurchaseStatus: async (
    purchaseId: string,
    onStatusChange?: (status: PurchaseResult) => void,
    maxAttempts: number = 30,
    intervalMs: number = 2000
  ): Promise<PurchaseResult> => {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await nftService.getPurchaseStatus(purchaseId);

      if (onStatusChange) {
        onStatusChange(status);
      }

      if (status.status === 'completed') {
        return status;
      } else if (status.status === 'failed' || status.status === 'refunded') {
        throw new Error(status.message || 'Purchase failed');
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));
      attempts++;
    }

    throw new Error('Purchase status check timed out. Please check your purchase history.');
  },

  /**
   * Format currency amount for display
   */
  formatCurrencyAmount: (amount: string, currency: string): string => {
    const num = parseFloat(amount);
    if (isNaN(num)) return `0 ${currency}`;

    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K ${currency}`;
    }
    if (num >= 1) {
      return `${num.toFixed(4)} ${currency}`;
    }
    if (num >= 0.0001) {
      return `${num.toFixed(6)} ${currency}`;
    }
    return `${num.toExponential(2)} ${currency}`;
  },

  /**
   * Calculate platform fee (2.5%)
   */
  calculatePlatformFee: (price: string): string => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) return '0';
    return (priceNum * 0.025).toFixed(6);
  },

  /**
   * Calculate total with fee
   */
  calculateTotal: (price: string): string => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) return '0';
    return (priceNum * 1.025).toFixed(6);
  },
};

export default nftService;
