import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  ExternalLink,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  TrendingUp,
  Grid,
  List,
  ChevronRight,
  Store,
  Sparkles,
  X,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, ResponsiveLayout, Button } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { nftService, OpenSeaCollection, OpenSeaListing, PlatformNFT } from '../../services/nftService';
import { NFTBuyCard } from '../../components/NFTBuyCard';
import { NFTPurchaseModal } from '../../components/NFTPurchaseModal';
import { ChainFilterCompact } from '../../components/ChainFilter';

export const NFTMarketplaceScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();

  // Tab state
  type TabType = 'platform' | 'opensea';
  const [activeTab, setActiveTab] = useState<TabType>('platform');

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [trendingCollections, setTrendingCollections] = useState<OpenSeaCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<OpenSeaCollection | null>(null);
  const [collectionListings, setCollectionListings] = useState<OpenSeaListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [searchResults, setSearchResults] = useState<OpenSeaCollection[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Platform NFT state
  const [platformListings, setPlatformListings] = useState<PlatformNFT[]>([]);
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [purchaseModalNFT, setPurchaseModalNFT] = useState<PlatformNFT | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Fetch platform listings on mount and when chain changes
  useEffect(() => {
    if (activeTab === 'platform') {
      fetchPlatformListings();
    }
  }, [activeTab, selectedChain]);

  // Fetch trending collections when opensea tab is selected
  useEffect(() => {
    if (activeTab === 'opensea' && trendingCollections.length === 0) {
      fetchTrendingCollections();
    }
  }, [activeTab]);

  const fetchPlatformListings = async () => {
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
  };

  const fetchTrendingCollections = async () => {
    setIsLoading(true);
    try {
      const response = await nftService.getTrendingCollections();
      if (response.collections) {
        setTrendingCollections(response.collections);
      }
    } catch (error) {
      console.error('Error fetching trending collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to batch requests with delay to avoid rate limiting
  const batchFetchWithDelay = async <T,>(
    items: T[],
    fetchFn: (item: T) => Promise<T>,
    batchSize: number = 5,
    delayMs: number = 300
  ): Promise<T[]> => {
    const results: T[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(fetchFn));
      results.push(...batchResults);
      // Add delay between batches (except for the last batch)
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    return results;
  };

  const fetchCollectionListings = async (collection: OpenSeaCollection) => {
    setIsLoadingListings(true);
    setSelectedCollection(collection);
    try {
      // Fetch fewer listings to reduce API calls
      const response = await nftService.getCollectionListings(collection.slug, { limit: 20 });
      if (response.listings) {
        // Set initial listings without images first (for faster UI)
        setCollectionListings(response.listings);

        // Then enrich with images in batches to avoid rate limiting
        const enrichedListings = await batchFetchWithDelay(
          response.listings,
          async (listing) => {
            try {
              const nftResponse = await nftService.getOpenSeaNFT(
                listing.chain,
                listing.contractAddress,
                listing.tokenId
              );
              if (nftResponse.nft) {
                return {
                  ...listing,
                  imageUrl: nftResponse.nft.imageUrl,
                  name: nftResponse.nft.name,
                  openseaUrl: nftResponse.nft.openseaUrl,
                };
              }
            } catch (err) {
              console.warn(`Failed to fetch NFT metadata for token ${listing.tokenId}:`, err);
            }
            return listing;
          },
          3, // Process 3 NFTs at a time
          500 // Wait 500ms between batches
        );
        setCollectionListings(enrichedListings);
      }
    } catch (error) {
      console.error('Error fetching collection listings:', error);
      setCollectionListings([]);
    } finally {
      setIsLoadingListings(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await nftService.searchCollections(searchQuery);
      if (response.collections) {
        setSearchResults(response.collections);
      }
    } catch (error) {
      console.error('Error searching collections:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
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
    fetchPlatformListings();
  };

  // Filter platform listings by search
  const filteredPlatformListings = platformListings.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.collection?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Collection Card Component
  const CollectionCard: React.FC<{ collection: OpenSeaCollection }> = ({ collection }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => fetchCollectionListings(collection)}
      style={{
        cursor: 'pointer',
        borderRadius: '16px',
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(145deg, rgba(20, 30, 25, 0.9), rgba(10, 20, 15, 0.95))'
          : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.95))',
        border: `1px solid ${isDark ? 'rgba(0, 255, 136, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
        boxShadow: isDark
          ? '0 4px 20px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Banner/Image */}
      <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
        {collection.bannerImageUrl || collection.imageUrl ? (
          <img
            src={collection.bannerImageUrl || collection.imageUrl}
            alt={collection.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[400]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon size={48} color="rgba(255,255,255,0.5)" />
          </div>
        )}
        {/* Collection avatar */}
        {collection.imageUrl && (
          <div
            style={{
              position: 'absolute',
              bottom: '-24px',
              left: '16px',
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: `3px solid ${isDark ? '#0a1410' : '#fff'}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <img
              src={collection.imageUrl}
              alt={collection.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '32px 16px 16px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: isDark ? '#fff' : '#1a1a1a',
            marginBottom: '8px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {collection.name}
        </h3>
        {collection.description && (
          <p
            style={{
              fontSize: '12px',
              color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '12px',
              minHeight: '34px',
            }}
          >
            {collection.description}
          </p>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: colors.primary[400],
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <TrendingUp size={12} />
            View Collection
          </span>
          <ChevronRight size={16} color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} />
        </div>
      </div>
    </motion.div>
  );

  // NFT Listing Card Component
  const ListingCard: React.FC<{ listing: OpenSeaListing }> = ({ listing }) => {
    const handleClick = () => {
      if (listing.openseaUrl) {
        window.open(listing.openseaUrl, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          borderRadius: '16px',
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(145deg, rgba(20, 30, 25, 0.9), rgba(10, 20, 15, 0.95))'
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.95))',
          border: `1px solid ${isDark ? 'rgba(0, 255, 136, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* NFT Image */}
        <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden' }}>
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.name || `#${listing.tokenId}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                // Fallback to placeholder on image load error
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.style.background = `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[400]})`;
                  parent.style.display = 'flex';
                  parent.style.alignItems = 'center';
                  parent.style.justifyContent = 'center';
                }
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[400]})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ImageIcon size={48} color="rgba(255,255,255,0.5)" />
            </div>
          )}
          {/* Price badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
              {listing.price?.amount || '—'} {listing.price?.currency || 'ETH'}
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '12px' }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#fff' : '#1a1a1a',
              marginBottom: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {listing.name || `#${listing.tokenId}`}
          </h4>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              }}
            >
              {nftService.getChainName(listing.chain)}
            </span>
            <span
              style={{
                fontSize: '10px',
                color: listing.status === 'ACTIVE' ? colors.primary[400] : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                fontWeight: 600,
              }}
            >
              {listing.status}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Collection Detail View
  const CollectionDetailView = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Back button and collection header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedCollection(null);
            setCollectionListings([]);
          }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#fff' : '#1a1a1a',
          }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: isDark ? '#fff' : '#1a1a1a',
              marginBottom: '4px',
            }}
          >
            {selectedCollection?.name}
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            }}
          >
            {collectionListings.length} items for sale
          </p>
        </div>
        {selectedCollection?.openseaUrl && (
          <motion.a
            href={selectedCollection.openseaUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ExternalLink size={14} />
            View on OpenSea
          </motion.a>
        )}
      </div>

      {/* Listings grid */}
      {isLoadingListings ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          <Loader2 size={32} color={colors.primary[400]} className="animate-spin" />
        </div>
      ) : collectionListings.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {collectionListings.map((listing, index) => (
            <ListingCard key={`${listing.orderHash}-${index}`} listing={listing} />
          ))}
        </div>
      ) : (
        <GlassCard style={{ padding: '60px', textAlign: 'center' }}>
          <ImageIcon
            size={48}
            color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
            style={{ marginBottom: '16px' }}
          />
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#fff' : '#1a1a1a',
              marginBottom: '8px',
            }}
          >
            No Listings Found
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            }}
          >
            This collection has no active listings at the moment.
          </p>
        </GlassCard>
      )}
    </motion.div>
  );

  // Platform NFTs view - Buy from CrymadX
  const PlatformNFTsView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Chain Filter */}
      <div style={{ marginBottom: '24px' }}>
        <ChainFilterCompact
          selectedChain={selectedChain}
          onChainChange={setSelectedChain}
        />
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <GlassCard style={{ padding: '16px 24px', flex: '1', minWidth: '150px' }}>
          <p style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', marginBottom: '4px' }}>
            Available NFTs
          </p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: colors.primary[400] }}>
            {filteredPlatformListings.length}
          </p>
        </GlassCard>
        <GlassCard style={{ padding: '16px 24px', flex: '1', minWidth: '150px' }}>
          <p style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', marginBottom: '4px' }}>
            Collections
          </p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: isDark ? '#fff' : '#1a1a1a' }}>
            {new Set(filteredPlatformListings.map(n => n.collection)).size}
          </p>
        </GlassCard>
      </div>

      {/* NFT Grid */}
      {isLoadingPlatform ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          <Loader2 size={32} color={colors.primary[400]} className="animate-spin" />
          <p style={{ marginTop: '16px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
            Loading NFTs...
          </p>
        </div>
      ) : filteredPlatformListings.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredPlatformListings.map((nft, index) => (
            <motion.div
              key={nft.listingId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <NFTBuyCard
                nft={nft}
                onBuyClick={handleBuyClick}
                viewMode="grid"
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <GlassCard style={{ padding: '60px', textAlign: 'center' }}>
          <ShoppingBag
            size={48}
            color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
            style={{ marginBottom: '16px' }}
          />
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#fff' : '#1a1a1a',
              marginBottom: '8px',
            }}
          >
            No NFTs Available
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              marginBottom: '16px',
            }}
          >
            {searchQuery ? 'No NFTs match your search. Try a different term.' : 'Check back later for new listings!'}
          </p>
          <Button onClick={fetchPlatformListings}>
            <RefreshCw size={14} />
            Refresh
          </Button>
        </GlassCard>
      )}
    </motion.div>
  );

  // Main collections grid view
  const CollectionsGridView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: isDark ? '#fff' : '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Search size={20} color={colors.primary[400]} />
              Search Results
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearSearch}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: isDark ? '#fff' : '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <X size={14} />
              Clear
            </motion.button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {searchResults.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Collections */}
      <div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: isDark ? '#fff' : '#1a1a1a',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={20} color={colors.primary[400]} />
          Trending Collections
        </h2>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
            }}
          >
            <Loader2 size={32} color={colors.primary[400]} className="animate-spin" />
          </div>
        ) : trendingCollections.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {trendingCollections.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
        ) : (
          <GlassCard style={{ padding: '60px', textAlign: 'center' }}>
            <Store
              size={48}
              color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              style={{ marginBottom: '16px' }}
            />
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: isDark ? '#fff' : '#1a1a1a',
                marginBottom: '8px',
              }}
            >
              No Collections Available
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                marginBottom: '16px',
              }}
            >
              Unable to load trending collections. Please try again later.
            </p>
            <Button onClick={fetchTrendingCollections}>
              <RefreshCw size={14} />
              Retry
            </Button>
          </GlassCard>
        )}
      </div>
    </motion.div>
  );

  return (
    <ResponsiveLayout>
      <div style={{ padding: isMobile ? '16px' : '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/markets')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#fff' : '#1a1a1a',
              }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h1
                style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: isDark ? '#fff' : '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Store size={28} color={colors.primary[400]} />
                NFT Marketplace
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  marginTop: '4px',
                }}
              >
                {activeTab === 'platform' ? 'Buy NFTs directly from CrymadX' : 'Browse NFT collections from OpenSea'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '4px',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              borderRadius: '12px',
            }}
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('platform')}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: activeTab === 'platform' ? colors.primary[400] : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'platform' ? '#000' : isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShoppingCart size={16} />
              Buy NFTs
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('opensea')}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                background: activeTab === 'opensea' ? colors.primary[400] : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'opensea' ? '#000' : isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ExternalLink size={16} />
              Browse OpenSea
            </motion.button>
          </div>

          {/* Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: isMobile ? '1 1 100%' : '0 0 auto',
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: 1,
                minWidth: isMobile ? '100%' : '300px',
              }}
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                }}
              />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  borderRadius: '12px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  color: isDark ? '#fff' : '#1a1a1a',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
                border: 'none',
                cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: searchQuery.trim() ? 1 : 0.5,
              }}
            >
              {isSearching ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Search
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'platform' ? (
            <PlatformNFTsView key="platform" />
          ) : selectedCollection ? (
            <CollectionDetailView key="detail" />
          ) : (
            <CollectionsGridView key="grid" />
          )}
        </AnimatePresence>

        {/* Powered by footer */}
        {activeTab === 'opensea' && (
          <div
            style={{
              marginTop: '48px',
              paddingTop: '24px',
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              Powered by OpenSea API
              <ExternalLink size={12} />
            </p>
          </div>
        )}
      </div>

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

export default NFTMarketplaceScreen;
