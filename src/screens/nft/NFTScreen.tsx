import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  HelpCircle,
  Grid,
  List,
  Search,
  ExternalLink,
  Tag,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  X,
  ShoppingBag,
  Clock,
  Wallet,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, ResponsiveLayout, Button } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import {
  nftService,
  ListNFTRequest,
  OpenSeaCollection,
  OpenSeaListing,
  PlatformNFT,
  OwnedNFT,
  PurchaseHistoryItem,
} from '../../services/nftService';
import type { NFT, NFTListing } from '../../types/api';
import { NFTBuyCard } from '../../components/NFTBuyCard';
import { NFTPurchaseModal } from '../../components/NFTPurchaseModal';
import { ChainFilter, ChainFilterCompact } from '../../components/ChainFilter';
import { PurchaseHistory } from '../../components/PurchaseHistory';
import { CHAIN_LIST, ALL_CHAINS_OPTION } from '../../config/chains';

// Fallback mock data
// Generate placeholder SVG data URI
const generateNFTPlaceholder = (tokenId: string, hue: number): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:hsl(${hue},70%,30%)"/><stop offset="100%" style="stop-color:hsl(${(hue + 40) % 360},70%,20%)"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="200" y="180" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="60" font-family="Arial">NFT</text><text x="200" y="240" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="24" font-family="Arial">#${tokenId}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const mockNFTs: NFT[] = [
  {
    tokenId: '1234',
    contractAddress: '0x1234...5678',
    name: 'CrymadX Genesis #1234',
    description: 'Genesis collection NFT',
    image: generateNFTPlaceholder('1234', 170),
    collection: 'CrymadX Genesis',
    floorPrice: '0.5',
    attributes: [
      { trait_type: 'Background', value: 'Ocean Blue' },
      { trait_type: 'Rarity', value: 'Rare' },
    ],
  },
  {
    tokenId: '5678',
    contractAddress: '0x1234...5678',
    name: 'CrymadX Genesis #5678',
    description: 'Genesis collection NFT',
    image: generateNFTPlaceholder('5678', 40),
    collection: 'CrymadX Genesis',
    floorPrice: '0.8',
    attributes: [
      { trait_type: 'Background', value: 'Sunset' },
      { trait_type: 'Rarity', value: 'Epic' },
    ],
  },
];

const mockListings: NFTListing[] = [];

type TabType = 'owned' | 'buy' | 'history' | 'listed' | 'browse';

export const NFTScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('owned');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>(mockNFTs);
  const [myListings, setMyListings] = useState<NFTListing[]>(mockListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [showListModal, setShowListModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [listPrice, setListPrice] = useState('');

  // OpenSea marketplace state (browse tab)
  const [trendingCollections, setTrendingCollections] = useState<OpenSeaCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<OpenSeaCollection | null>(null);
  const [collectionListings, setCollectionListings] = useState<OpenSeaListing[]>([]);
  const [isLoadingMarketplace, setIsLoadingMarketplace] = useState(false);

  // Platform NFT purchase state
  const [platformListings, setPlatformListings] = useState<PlatformNFT[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(false);
  const [purchaseModalNFT, setPurchaseModalNFT] = useState<PlatformNFT | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // My platform NFTs state
  const [myPlatformNFTs, setMyPlatformNFTs] = useState<OwnedNFT[]>([]);
  const [isLoadingMyNFTs, setIsLoadingMyNFTs] = useState(false);

  // Purchase history state
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Fetch NFT data
  const fetchNFTData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ownedRes, myListingsRes] = await Promise.all([
        nftService.getOwnedNFTs(),
        nftService.getMyListings(),
      ]);

      if (ownedRes.nfts && ownedRes.nfts.length > 0) {
        setOwnedNFTs(ownedRes.nfts);
      }

      if (myListingsRes.listings) {
        setMyListings(myListingsRes.listings);
      }
    } catch (error) {
      console.error('Error fetching NFT data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch platform listings for buying
  const fetchPlatformListings = useCallback(async () => {
    setIsLoadingPlatform(true);
    try {
      const response = await nftService.getPlatformListings(selectedChain);
      if (response.listings) {
        setPlatformListings(response.listings);
      }
    } catch (error) {
      console.error('Error fetching platform listings:', error);
      setPlatformListings([]);
    } finally {
      setIsLoadingPlatform(false);
    }
  }, [selectedChain]);

  // Fetch my platform NFTs
  const fetchMyPlatformNFTs = useCallback(async () => {
    setIsLoadingMyNFTs(true);
    try {
      const response = await nftService.getMyPlatformNFTs(selectedChain);
      if (response.nfts) {
        setMyPlatformNFTs(response.nfts);
      }
    } catch (error) {
      console.error('Error fetching my platform NFTs:', error);
      setMyPlatformNFTs([]);
    } finally {
      setIsLoadingMyNFTs(false);
    }
  }, [selectedChain]);

  // Fetch purchase history
  const fetchPurchaseHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const response = await nftService.getPurchaseHistory();
      if (response.purchases) {
        setPurchaseHistory(response.purchases);
      }
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      setPurchaseHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchNFTData();
  }, [fetchNFTData]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'buy') {
      fetchPlatformListings();
    } else if (activeTab === 'owned') {
      fetchMyPlatformNFTs();
    } else if (activeTab === 'history') {
      fetchPurchaseHistory();
    }
  }, [activeTab, fetchPlatformListings, fetchMyPlatformNFTs, fetchPurchaseHistory]);

  // Refetch platform listings when chain filter changes
  useEffect(() => {
    if (activeTab === 'buy') {
      fetchPlatformListings();
    } else if (activeTab === 'owned') {
      fetchMyPlatformNFTs();
    }
  }, [selectedChain, activeTab, fetchPlatformListings, fetchMyPlatformNFTs]);

  // Fetch trending collections from OpenSea (browse tab)
  const fetchTrendingCollections = useCallback(async () => {
    setIsLoadingMarketplace(true);
    try {
      const response = await nftService.getTrendingCollections();
      if (response.collections) {
        setTrendingCollections(response.collections);
      }
    } catch (error) {
      console.error('Error fetching trending collections:', error);
      setTrendingCollections([]);
    } finally {
      setIsLoadingMarketplace(false);
    }
  }, []);

  // Fetch listings for a specific collection
  const fetchCollectionListings = useCallback(async (collectionSlug: string) => {
    setIsLoadingMarketplace(true);
    try {
      const response = await nftService.getCollectionListings(collectionSlug, { limit: 20 });
      if (response.listings) {
        setCollectionListings(response.listings);
      }
    } catch (error) {
      console.error('Error fetching collection listings:', error);
      setCollectionListings([]);
    } finally {
      setIsLoadingMarketplace(false);
    }
  }, []);

  // Load trending collections when browse tab is selected
  useEffect(() => {
    if (activeTab === 'browse' && trendingCollections.length === 0) {
      fetchTrendingCollections();
    }
  }, [activeTab, trendingCollections.length, fetchTrendingCollections]);

  // Load collection listings when a collection is selected
  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionListings(selectedCollection.slug);
    }
  }, [selectedCollection, fetchCollectionListings]);

  const handleSelectCollection = (collection: OpenSeaCollection) => {
    setSelectedCollection(collection);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
    setCollectionListings([]);
  };

  const handleListNFT = (nft: NFT) => {
    setSelectedNFT(nft);
    setListPrice('');
    setShowListModal(true);
  };

  const confirmListNFT = async () => {
    if (!selectedNFT || !listPrice) return;

    try {
      const request: ListNFTRequest = {
        contractAddress: selectedNFT.contractAddress,
        tokenId: selectedNFT.tokenId,
        price: listPrice,
        currency: 'ETH',
      };
      await nftService.listNFT(request);
      setShowListModal(false);
      setSelectedNFT(null);
      setListPrice('');
      fetchNFTData();
    } catch (error) {
      console.error('Error listing NFT:', error);
    }
  };

  const handleCancelListing = async (listingId: string) => {
    try {
      await nftService.cancelListing(listingId);
      fetchNFTData();
    } catch (error) {
      console.error('Error canceling listing:', error);
    }
  };

  // Handle buy button click
  const handleBuyClick = (nft: PlatformNFT) => {
    setPurchaseModalNFT(nft);
    setShowPurchaseModal(true);
  };

  // Handle purchase success
  const handlePurchaseSuccess = () => {
    setShowPurchaseModal(false);
    setPurchaseModalNFT(null);
    // Refresh platform listings and purchase history
    fetchPlatformListings();
    fetchPurchaseHistory();
    fetchMyPlatformNFTs();
  };

  const filteredNFTs = ownedNFTs.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.collection?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlatformListings = platformListings.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.collection?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMyPlatformNFTs = myPlatformNFTs.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.collection?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NFTCard: React.FC<{ nft: NFT; showListButton?: boolean; listing?: NFTListing }> = ({
    nft,
    showListButton,
    listing,
  }) => (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
        border: `1px solid ${colors.glass.border}`,
      }}
    >
      {/* NFT Image */}
      <div style={{
        position: 'relative',
        aspectRatio: '1',
        background: colors.background.card,
        overflow: 'hidden',
      }}>
        <img
          src={nftService.formatIPFSUrl(nft.image)}
          alt={nft.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="${isDark ? '#1a1a2e' : '#f0f0f0'}"/><text x="200" y="200" text-anchor="middle" fill="${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}" font-size="24" font-family="Arial">${nft.name.slice(0, 10)}</text></svg>`;
            (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
          }}
        />
        {nft.collection && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            padding: '4px 10px',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            fontSize: '11px',
            color: '#fff',
            fontWeight: 600,
          }}>
            {nft.collection}
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div style={{ padding: '14px' }}>
        <p style={{
          fontSize: '14px',
          fontWeight: 600,
          color: colors.text.primary,
          marginBottom: '6px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {nft.name}
        </p>

        {nft.floorPrice && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '10px',
          }}>
            <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Floor:</span>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.primary[400],
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {nft.floorPrice} ETH
            </span>
          </div>
        )}

        {listing && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '10px',
          }}>
            <Tag size={12} color={colors.trading.buy} />
            <span style={{
              fontSize: '14px',
              fontWeight: 700,
              color: colors.trading.buy,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {nftService.formatPrice(listing.price, listing.currency)}
            </span>
          </div>
        )}

        {showListButton && (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => handleListNFT(nft)}
          >
            List for Sale
          </Button>
        )}

        {listing && activeTab === 'listed' && (
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => handleCancelListing(listing.id)}
            style={{ color: colors.status.error }}
          >
            Cancel Listing
          </Button>
        )}
      </div>
    </motion.div>
  );

  // Owned NFT Card for platform NFTs
  const OwnedNFTCard: React.FC<{ nft: OwnedNFT }> = ({ nft }) => (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
        border: `1px solid ${colors.glass.border}`,
      }}
    >
      <div style={{
        position: 'relative',
        aspectRatio: '1',
        background: colors.background.card,
        overflow: 'hidden',
      }}>
        <img
          src={nftService.formatIPFSUrl(nft.image)}
          alt={nft.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="${isDark ? '#1a1a2e' : '#f0f0f0'}"/><text x="200" y="200" text-anchor="middle" fill="${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}" font-size="24" font-family="Arial">${nft.name.slice(0, 10)}</text></svg>`;
            (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
          }}
        />
        {/* Chain badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '4px 8px',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: '6px',
          fontSize: '10px',
          color: '#fff',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: nftService.getChainColor(nft.chain),
          }} />
          {nft.chain.toUpperCase()}
        </div>
        {nft.collection && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            padding: '4px 10px',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            fontSize: '11px',
            color: '#fff',
            fontWeight: 600,
          }}>
            {nft.collection}
          </div>
        )}
      </div>

      <div style={{ padding: '14px' }}>
        <p style={{
          fontSize: '14px',
          fontWeight: 600,
          color: colors.text.primary,
          marginBottom: '6px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {nft.name}
        </p>

        {nft.floorPrice && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Floor:</span>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: colors.primary[400],
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {nft.floorPrice}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'owned', label: 'My NFTs', icon: <Wallet size={14} /> },
    { key: 'buy', label: 'Buy NFTs', icon: <ShoppingBag size={14} /> },
    { key: 'history', label: 'History', icon: <Clock size={14} /> },
    { key: 'listed', label: 'My Listings', icon: <Tag size={14} /> },
    { key: 'browse', label: 'Browse', icon: <ExternalLink size={14} /> },
  ];

  return (
    <ResponsiveLayout activeNav="wallet" title="NFT Gallery">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              style={{
                padding: '10px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                cursor: 'pointer',
                color: colors.text.primary,
                display: 'flex',
              }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h1 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              color: colors.text.primary,
            }}>
              NFT Gallery
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (activeTab === 'buy') fetchPlatformListings();
                else if (activeTab === 'owned') fetchMyPlatformNFTs();
                else if (activeTab === 'history') fetchPurchaseHistory();
                else fetchNFTData();
              }}
              style={{
                padding: '10px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                cursor: 'pointer',
                color: colors.text.tertiary,
                display: 'flex',
              }}
            >
              {isLoading || isLoadingPlatform || isLoadingMyNFTs || isLoadingHistory ? (
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <RefreshCw size={20} />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                cursor: 'pointer',
                color: colors.text.tertiary,
                display: 'flex',
              }}
            >
              <HelpCircle size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" padding="lg" style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '20px',
            }}>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Owned NFTs
                </p>
                <p style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: colors.text.primary,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {myPlatformNFTs.length || ownedNFTs.length}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Listed
                </p>
                <p style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: colors.status.warning,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {myListings.length}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Available to Buy
                </p>
                <p style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: colors.trading.buy,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {platformListings.length}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Purchases
                </p>
                <p style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: colors.primary[400],
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {purchaseHistory.length}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '4px',
            background: colors.background.card,
            padding: '4px',
            borderRadius: '12px',
            border: `1px solid ${colors.glass.border}`,
            overflowX: 'auto',
          }}>
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: isMobile ? '8px 12px' : '10px 16px',
                  background: activeTab === tab.key ? colors.primary[400] : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  color: activeTab === tab.key ? '#000' : colors.text.secondary,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Search & View Toggle */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: colors.background.card,
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '10px',
              flex: isMobile ? 1 : 'none',
            }}>
              <Search size={16} color={colors.text.tertiary} />
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: colors.text.primary,
                  fontSize: '13px',
                  width: isMobile ? '100%' : '150px',
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              background: colors.background.card,
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '8px 12px',
                  background: viewMode === 'grid' ? colors.primary[400] : 'transparent',
                  border: 'none',
                  color: viewMode === 'grid' ? '#000' : colors.text.tertiary,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <Grid size={16} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                style={{
                  padding: '8px 12px',
                  background: viewMode === 'list' ? colors.primary[400] : 'transparent',
                  border: 'none',
                  color: viewMode === 'list' ? '#000' : colors.text.tertiary,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <List size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Chain Filter (for buy and owned tabs) */}
        {(activeTab === 'buy' || activeTab === 'owned') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '20px' }}
          >
            <ChainFilterCompact
              selectedChain={selectedChain}
              onChainChange={setSelectedChain}
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* My NFTs Tab */}
          {activeTab === 'owned' && (
            isLoadingMyNFTs ? (
              <GlassCard variant="subtle" padding="lg">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Loader2 size={48} color={colors.primary[400]} style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
                    Loading Your NFTs...
                  </p>
                </div>
              </GlassCard>
            ) : filteredMyPlatformNFTs.length === 0 && filteredNFTs.length === 0 ? (
              <GlassCard variant="subtle" padding="lg">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <ImageIcon size={48} color={colors.text.tertiary} style={{ marginBottom: '16px' }} />
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                    No NFTs Found
                  </p>
                  <p style={{ fontSize: '14px', color: colors.text.tertiary, marginBottom: '20px' }}>
                    {searchQuery ? 'Try a different search term' : 'Your NFT collection is empty. Buy some NFTs to get started!'}
                  </p>
                  <Button variant="primary" onClick={() => setActiveTab('buy')}>
                    Browse NFTs to Buy
                  </Button>
                </div>
              </GlassCard>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid'
                  ? `repeat(auto-fill, minmax(${isMobile ? '150px' : '220px'}, 1fr))`
                  : '1fr',
                gap: '16px',
              }}>
                {/* Show platform NFTs first */}
                {filteredMyPlatformNFTs.map((nft, index) => (
                  <motion.div
                    key={`${nft.contractAddress}-${nft.tokenId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + index * 0.03 }}
                  >
                    <OwnedNFTCard nft={nft} />
                  </motion.div>
                ))}
                {/* Then show other owned NFTs */}
                {filteredNFTs.map((nft, index) => (
                  <motion.div
                    key={`${nft.contractAddress}-${nft.tokenId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + (filteredMyPlatformNFTs.length + index) * 0.03 }}
                  >
                    <NFTCard nft={nft} showListButton />
                  </motion.div>
                ))}
              </div>
            )
          )}

          {/* Buy NFTs Tab */}
          {activeTab === 'buy' && (
            isLoadingPlatform ? (
              <GlassCard variant="subtle" padding="lg">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Loader2 size={48} color={colors.primary[400]} style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
                    Loading NFTs for Sale...
                  </p>
                </div>
              </GlassCard>
            ) : filteredPlatformListings.length === 0 ? (
              <GlassCard variant="subtle" padding="lg">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <ShoppingBag size={48} color={colors.text.tertiary} style={{ marginBottom: '16px' }} />
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                    No NFTs Available
                  </p>
                  <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
                    {searchQuery ? 'Try a different search term' : 'Check back later for new listings!'}
                  </p>
                </div>
              </GlassCard>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid'
                  ? `repeat(auto-fill, minmax(${isMobile ? '160px' : '240px'}, 1fr))`
                  : '1fr',
                gap: '16px',
              }}>
                {filteredPlatformListings.map((nft, index) => (
                  <motion.div
                    key={nft.listingId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + index * 0.03 }}
                  >
                    <NFTBuyCard
                      nft={nft}
                      onBuyClick={handleBuyClick}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            )
          )}

          {/* Purchase History Tab */}
          {activeTab === 'history' && (
            <GlassCard variant="subtle" padding="lg">
              <PurchaseHistory
                purchases={purchaseHistory}
                isLoading={isLoadingHistory}
                onRefresh={fetchPurchaseHistory}
              />
            </GlassCard>
          )}

          {/* My Listings Tab */}
          {activeTab === 'listed' && (
            myListings.length === 0 ? (
              <GlassCard variant="subtle" padding="lg">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Tag size={48} color={colors.text.tertiary} style={{ marginBottom: '16px' }} />
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                    No Active Listings
                  </p>
                  <p style={{ fontSize: '14px', color: colors.text.tertiary, marginBottom: '20px' }}>
                    List an NFT from your collection to sell it on the marketplace
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setActiveTab('owned')}
                  >
                    View My NFTs
                  </Button>
                </div>
              </GlassCard>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid'
                  ? `repeat(auto-fill, minmax(${isMobile ? '150px' : '220px'}, 1fr))`
                  : '1fr',
                gap: '16px',
              }}>
                {myListings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                  >
                    <NFTCard nft={listing.nft} listing={listing} />
                  </motion.div>
                ))}
              </div>
            )
          )}

          {/* Browse OpenSea Tab */}
          {activeTab === 'browse' && (
            isLoadingMarketplace ? (
              <GlassCard variant="subtle" padding="lg">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Loader2 size={48} color={colors.primary[400]} style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
                    Loading Collections...
                  </p>
                </div>
              </GlassCard>
            ) : selectedCollection ? (
              // Show collection listings
              <div>
                {/* Collection Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                  padding: '16px',
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderRadius: '12px',
                  border: `1px solid ${colors.glass.border}`,
                }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackToCollections}
                    style={{
                      padding: '8px',
                      background: colors.background.card,
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: colors.text.primary,
                      display: 'flex',
                    }}
                  >
                    <ArrowLeft size={18} />
                  </motion.button>
                  {selectedCollection.imageUrl && (
                    <img
                      src={selectedCollection.imageUrl}
                      alt={selectedCollection.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary, marginBottom: '4px' }}>
                      {selectedCollection.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        background: nftService.getChainColor(selectedCollection.chain) + '20',
                        color: nftService.getChainColor(selectedCollection.chain),
                        borderRadius: '4px',
                      }}>
                        {nftService.getChainName(selectedCollection.chain)}
                      </span>
                      <span style={{ fontSize: '13px', color: colors.text.tertiary }}>
                        {collectionListings.length} listings
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => nftService.openOnOpenSea(selectedCollection.openseaUrl)}
                    style={{
                      padding: '8px 12px',
                      background: '#2081E2',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <ExternalLink size={14} />
                    OpenSea
                  </motion.button>
                </div>

                {/* Listings Grid */}
                {collectionListings.length === 0 ? (
                  <GlassCard variant="subtle" padding="lg">
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Tag size={48} color={colors.text.tertiary} style={{ marginBottom: '16px' }} />
                      <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                        No Active Listings
                      </p>
                      <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
                        This collection has no NFTs currently for sale
                      </p>
                    </div>
                  </GlassCard>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '150px' : '200px'}, 1fr))`,
                    gap: '16px',
                  }}>
                    {collectionListings.map((listing, index) => (
                      <motion.div
                        key={listing.orderHash}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          border: `1px solid ${colors.glass.border}`,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          const url = listing.openseaUrl || `https://opensea.io/assets/${listing.chain}/${listing.contractAddress}/${listing.tokenId}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <div style={{
                          aspectRatio: '1',
                          background: colors.background.card,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}>
                          {listing.imageUrl ? (
                            <img
                              src={listing.imageUrl}
                              alt={listing.name || `#${listing.tokenId}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`;
                              }}
                            />
                          ) : (
                            <ImageIcon size={32} color={colors.text.tertiary} />
                          )}
                        </div>
                        <div style={{ padding: '12px' }}>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.text.primary,
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {listing.name || `#${listing.tokenId}`}
                          </p>
                          <p style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: colors.primary[400],
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>
                            {listing.price.amount} {listing.price.currency}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Show trending collections
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.text.primary,
                  marginBottom: '16px',
                }}>
                  Trending Collections
                </h3>
                {trendingCollections.length === 0 ? (
                  <GlassCard variant="subtle" padding="lg">
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Tag size={48} color={colors.text.tertiary} style={{ marginBottom: '16px' }} />
                      <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                        Loading Collections...
                      </p>
                      <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
                        Browse NFT collections from OpenSea
                      </p>
                    </div>
                  </GlassCard>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '150px' : '280px'}, 1fr))`,
                    gap: '16px',
                  }}>
                    {trendingCollections.map((collection, index) => (
                      <motion.div
                        key={collection.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        onClick={() => handleSelectCollection(collection)}
                        style={{
                          borderRadius: '16px',
                          overflow: 'hidden',
                          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          border: `1px solid ${colors.glass.border}`,
                          cursor: 'pointer',
                        }}
                      >
                        {/* Banner/Image */}
                        <div style={{
                          height: '100px',
                          background: collection.bannerImageUrl
                            ? `url(${collection.bannerImageUrl}) center/cover`
                            : `linear-gradient(135deg, ${nftService.getChainColor(collection.chain)}40, ${colors.background.card})`,
                          position: 'relative',
                        }}>
                          {collection.imageUrl && (
                            <img
                              src={collection.imageUrl}
                              alt={collection.name}
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                border: `3px solid ${colors.background.card}`,
                                position: 'absolute',
                                bottom: '-28px',
                                left: '16px',
                                objectFit: 'cover',
                                background: colors.background.card,
                              }}
                            />
                          )}
                        </div>
                        <div style={{ padding: '36px 16px 16px' }}>
                          <h4 style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: colors.text.primary,
                            marginBottom: '6px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {collection.name}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 6px',
                              background: nftService.getChainColor(collection.chain) + '20',
                              color: nftService.getChainColor(collection.chain),
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}>
                              {nftService.getChainName(collection.chain)}
                            </span>
                            {collection.category && (
                              <span style={{
                                fontSize: '11px',
                                color: colors.text.tertiary,
                              }}>
                                {collection.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </motion.div>
      </div>

      {/* List NFT Modal */}
      <AnimatePresence>
        {showListModal && selectedNFT && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowListModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '420px',
                zIndex: 1001,
              }}
            >
              <GlassCard variant="prominent" padding="lg" glow>
                {/* Modal Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: colors.text.primary,
                  }}>
                    List NFT for Sale
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowListModal(false)}
                    style={{
                      padding: '8px',
                      background: colors.background.card,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: colors.text.tertiary,
                      display: 'flex',
                    }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                {/* NFT Preview */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}>
                  <img
                    src={nftService.formatIPFSUrl(selectedNFT.image)}
                    alt={selectedNFT.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                  <div>
                    <p style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}>
                      {selectedNFT.name}
                    </p>
                    <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                      {selectedNFT.collection}
                    </p>
                  </div>
                </div>

                {/* Price Input */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text.secondary,
                    marginBottom: '8px',
                  }}>
                    List Price
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: colors.background.card,
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '10px',
                  }}>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: colors.text.primary,
                        fontSize: '18px',
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: colors.text.secondary,
                    }}>
                      ETH
                    </span>
                  </div>
                  {selectedNFT.floorPrice && (
                    <p style={{
                      fontSize: '12px',
                      color: colors.text.tertiary,
                      marginTop: '6px',
                    }}>
                      Floor price: {selectedNFT.floorPrice} ETH
                    </p>
                  )}
                </div>

                {/* List Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={confirmListNFT}
                  disabled={!listPrice || parseFloat(listPrice) <= 0}
                >
                  List for {listPrice || '0'} ETH
                </Button>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Purchase Modal */}
      <NFTPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => {
          setShowPurchaseModal(false);
          setPurchaseModalNFT(null);
        }}
        nft={purchaseModalNFT}
        onPurchaseComplete={handlePurchaseSuccess}
      />
    </ResponsiveLayout>
  );
};

export default NFTScreen;
