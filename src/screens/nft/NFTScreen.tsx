import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Image,
  ShoppingCart,
  Tag,
  Sparkles,
  X,
  Check,
  Upload,
  Wallet,
  ArrowRight,
  Heart,
  Share2,
  ExternalLink,
  Grid,
  LayoutGrid,
  Filter,
  Search,
  TrendingUp,
  Clock,
  Zap,
  Award,
  ChevronDown,
  ChevronRight,
  Eye,
  Layers,
  Package,
  DollarSign,
  ArrowUpRight,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, ResponsiveLayout, CryptoIcon } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { LiquidGlassBackground, LiquidOrb } from '../../components/Glass3D';

// NFT Collection Data
interface NFTCollection {
  id: string;
  name: string;
  floor: number;
  volume24h: number;
  change24h: number;
  items: number;
  owners: number;
  image: string;
}

interface NFTItem {
  id: string;
  name: string;
  collection: string;
  image: string;
  price: number;
  lastSale: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  tokenId: string;
  owner: string;
  likes: number;
  isLiked: boolean;
  standard: 'ERC-721' | 'ERC-1155';
}

// High-quality NFT collection images (using picsum for demo)
const collections: NFTCollection[] = [
  { id: '1', name: 'CrymadX Originals', floor: 2.45, volume24h: 156.8, change24h: 12.5, items: 10000, owners: 4523, image: 'https://picsum.photos/seed/col1/200/200' },
  { id: '2', name: 'Crypto Punks Elite', floor: 45.2, volume24h: 892.3, change24h: -3.2, items: 5000, owners: 2890, image: 'https://picsum.photos/seed/col2/200/200' },
  { id: '3', name: 'Metaverse Lands', floor: 0.85, volume24h: 45.6, change24h: 28.9, items: 20000, owners: 8456, image: 'https://picsum.photos/seed/col3/200/200' },
  { id: '4', name: 'AI Art Genesis', floor: 1.2, volume24h: 78.9, change24h: 5.6, items: 8888, owners: 3421, image: 'https://picsum.photos/seed/col4/200/200' },
  { id: '5', name: 'Pixel Warriors', floor: 0.35, volume24h: 23.4, change24h: -8.1, items: 15000, owners: 6234, image: 'https://picsum.photos/seed/col5/200/200' },
];

const myNFTs: NFTItem[] = [
  { id: '1', name: 'CrymadX Genesis #1234', collection: 'CrymadX Originals', image: 'https://picsum.photos/seed/nft1/400/400', price: 2.8, lastSale: 2.5, rarity: 'Legendary', tokenId: '1234', owner: '0x1234...5678', likes: 245, isLiked: true, standard: 'ERC-721' },
  { id: '2', name: 'Metaverse Plot #567', collection: 'Metaverse Lands', image: 'https://picsum.photos/seed/nft2/400/400', price: 1.2, lastSale: 0.9, rarity: 'Rare', tokenId: '567', owner: '0x1234...5678', likes: 128, isLiked: false, standard: 'ERC-721' },
  { id: '3', name: 'AI Portrait #89', collection: 'AI Art Genesis', image: 'https://picsum.photos/seed/nft3/400/400', price: 1.8, lastSale: 1.5, rarity: 'Epic', tokenId: '89', owner: '0x1234...5678', likes: 312, isLiked: true, standard: 'ERC-721' },
];

const marketplaceNFTs: NFTItem[] = [
  { id: '4', name: 'Cosmic Ape #3421', collection: 'CrymadX Originals', image: 'https://picsum.photos/seed/nft4/400/400', price: 3.5, lastSale: 3.2, rarity: 'Legendary', tokenId: '3421', owner: '0xabcd...ef01', likes: 456, isLiked: false, standard: 'ERC-721' },
  { id: '5', name: 'Digital Dreams #78', collection: 'AI Art Genesis', image: 'https://picsum.photos/seed/nft5/400/400', price: 0.85, lastSale: 0.7, rarity: 'Uncommon', tokenId: '78', owner: '0x9876...5432', likes: 89, isLiked: false, standard: 'ERC-1155' },
  { id: '6', name: 'Warrior #2345', collection: 'Pixel Warriors', image: 'https://picsum.photos/seed/nft6/400/400', price: 0.42, lastSale: 0.38, rarity: 'Common', tokenId: '2345', owner: '0xfedc...ba98', likes: 67, isLiked: false, standard: 'ERC-721' },
  { id: '7', name: 'Land Parcel #1001', collection: 'Metaverse Lands', image: 'https://picsum.photos/seed/nft7/400/400', price: 1.5, lastSale: 1.2, rarity: 'Rare', tokenId: '1001', owner: '0x2468...1357', likes: 234, isLiked: true, standard: 'ERC-721' },
  { id: '8', name: 'Elite Punk #456', collection: 'Crypto Punks Elite', image: 'https://picsum.photos/seed/nft8/400/400', price: 48.5, lastSale: 45.0, rarity: 'Legendary', tokenId: '456', owner: '0x1357...2468', likes: 892, isLiked: false, standard: 'ERC-721' },
  { id: '9', name: 'Genesis Token #100', collection: 'CrymadX Originals', image: 'https://picsum.photos/seed/nft9/400/400', price: 5.2, lastSale: 4.8, rarity: 'Epic', tokenId: '100', owner: '0xaced...beef', likes: 567, isLiked: false, standard: 'ERC-1155' },
];

type TabType = 'marketplace' | 'my-nfts' | 'collections' | 'activity';

export const NFTScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors, mode } = useThemeMode();
  const isDark = mode === 'dark';
  const { isMobile } = usePresentationMode();

  const [activeTab, setActiveTab] = useState<TabType>('marketplace');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [buyStep, setBuyStep] = useState(1);
  const [sellStep, setSellStep] = useState(1);
  const [mintStep, setMintStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'ETH' | 'USDT' | 'BNB'>('ETH');
  const [sellPrice, setSellPrice] = useState('');

  // User wallet balances (mock data - would come from wallet context)
  const walletBalances = {
    ETH: 5.234,
    USDT: 12500.00,
    BNB: 8.45,
  };

  // Calculate NFT portfolio value
  const portfolioValue = myNFTs.reduce((sum, nft) => sum + nft.price, 0);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return '#fbbf24';
      case 'Epic': return '#a855f7';
      case 'Rare': return '#3b82f6';
      case 'Uncommon': return '#22c55e';
      default: return isDark ? colors.text.tertiary : '#6b7280';
    }
  };

  const handleBuy = (nft: NFTItem) => {
    setSelectedNFT(nft);
    setBuyStep(1);
    setShowBuyModal(true);
  };

  const handleSell = (nft: NFTItem) => {
    setSelectedNFT(nft);
    setSellStep(1);
    setSellPrice(nft.price.toString());
    setShowSellModal(true);
  };

  const filteredMarketplace = marketplaceNFTs.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.collection.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tab config
  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingCart size={18} /> },
    { id: 'my-nfts', label: 'My NFTs', icon: <Wallet size={18} /> },
    { id: 'collections', label: 'Collections', icon: <Layers size={18} /> },
    { id: 'activity', label: 'Activity', icon: <Clock size={18} /> },
  ];

  // Modal styles
  const modalOverlay = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '20px',
  };

  const modalContent = {
    background: isDark
      ? 'linear-gradient(145deg, rgba(30, 35, 41, 0.98), rgba(22, 24, 28, 0.98))'
      : '#ffffff',
    borderRadius: '20px',
    border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`,
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: isDark
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  };

  return (
    <ResponsiveLayout>
      {/* Background Effects */}
      <LiquidGlassBackground />

      {/* Floating Orbs */}
      <LiquidOrb size={120} color="green" delay={0} style={{ position: 'absolute', top: '10%', right: '15%' }} />
      <LiquidOrb size={80} color="cyan" delay={2} style={{ position: 'absolute', bottom: '20%', left: '10%' }} />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: isMobile ? '16px' : '24px', maxWidth: '1400px', margin: '0 auto' }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 800,
              color: isDark ? colors.text.primary : '#000000',
              marginBottom: '8px',
              background: isDark
                ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`
                : 'linear-gradient(135deg, #059669, #0891b2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              NFT Marketplace
            </h1>
            <p style={{ fontSize: '14px', color: isDark ? colors.text.tertiary : '#6b7280' }}>
              Buy, sell, and collect exclusive digital assets
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setMintStep(1); setShowMintModal(true); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: isDark
                ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`
                : 'linear-gradient(135deg, #059669, #0891b2)',
              border: 'none',
              borderRadius: '12px',
              color: isDark ? '#0a0e14' : '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${colors.primary[400]}40`,
            }}
          >
            <Sparkles size={18} />
            Create NFT
          </motion.button>
        </div>

        {/* Portfolio Summary Card */}
        <GlassCard style={{ marginBottom: '24px', padding: isMobile ? '16px' : '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '20px',
          }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '8px' }}>
                NFT Portfolio Value
              </p>
              <p style={{
                fontSize: '28px',
                fontWeight: 800,
                color: isDark ? colors.text.primary : '#000000',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {portfolioValue.toFixed(2)} ETH
              </p>
              <p style={{ fontSize: '13px', color: isDark ? colors.text.tertiary : '#6b7280' }}>
                ${(portfolioValue * 2345.67).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '8px' }}>
                NFTs Owned
              </p>
              <p style={{
                fontSize: '28px',
                fontWeight: 800,
                color: isDark ? colors.primary[400] : '#059669',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {myNFTs.length}
              </p>
              <p style={{ fontSize: '13px', color: isDark ? colors.text.tertiary : '#6b7280' }}>
                Across {new Set(myNFTs.map(n => n.collection)).size} collections
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '8px' }}>
                Available Balance
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CryptoIcon symbol="ETH" size={24} />
                <span style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: isDark ? colors.text.primary : '#000000',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {walletBalances.ETH.toFixed(3)} ETH
                </span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '8px' }}>
                Quick Actions
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/wallet/deposit')}
                  style={{
                    padding: '8px 16px',
                    background: isDark ? `${colors.primary[400]}15` : '#f0fdf4',
                    border: `1px solid ${isDark ? colors.primary[400] : '#059669'}40`,
                    borderRadius: '8px',
                    color: isDark ? colors.primary[400] : '#059669',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ArrowUpRight size={14} />
                  Deposit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/fiat')}
                  style={{
                    padding: '8px 16px',
                    background: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
                    border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: isDark ? colors.text.secondary : '#374151',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <DollarSign size={14} />
                  Buy ETH
                </motion.button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: activeTab === tab.id
                  ? isDark
                    ? `linear-gradient(135deg, ${colors.primary[400]}20, ${colors.secondary[400]}10)`
                    : '#000000'
                  : 'transparent',
                border: `1px solid ${
                  activeTab === tab.id
                    ? isDark ? colors.primary[400] : '#000000'
                    : isDark ? colors.glass.border : '#e5e7eb'
                }`,
                borderRadius: '12px',
                color: activeTab === tab.id
                  ? isDark ? colors.primary[400] : '#ffffff'
                  : isDark ? colors.text.tertiary : '#374151',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Search Bar (for Marketplace) */}
        {activeTab === 'marketplace' && (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDark ? colors.text.tertiary : '#9ca3af',
              }} />
              <input
                type="text"
                placeholder="Search NFTs, collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 46px',
                  background: isDark ? colors.background.card : '#ffffff',
                  border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`,
                  borderRadius: '12px',
                  color: isDark ? colors.text.primary : '#000000',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 20px',
                background: isDark ? colors.background.card : '#ffffff',
                border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`,
                borderRadius: '12px',
                color: isDark ? colors.text.secondary : '#374151',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Filter size={16} />
              Filters
            </motion.button>
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {filteredMarketplace.map((nft) => (
              <GlassCard key={nft.id} style={{ padding: 0, overflow: 'hidden' }}>
                {/* NFT Image */}
                <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                  <img
                    src={nft.image}
                    alt={nft.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Rarity Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 10px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: getRarityColor(nft.rarity),
                  }}>
                    {nft.rarity}
                  </div>
                  {/* Token Standard */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 8px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#fff',
                  }}>
                    {nft.standard}
                  </div>
                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: nft.isLiked ? '#ef4444' : '#fff',
                    }}
                  >
                    <Heart size={16} fill={nft.isLiked ? '#ef4444' : 'none'} />
                  </motion.button>
                </div>

                {/* NFT Info */}
                <div style={{ padding: '16px' }}>
                  <p style={{
                    fontSize: '12px',
                    color: isDark ? colors.primary[400] : '#059669',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}>
                    {nft.collection}
                  </p>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: isDark ? colors.text.primary : '#000000',
                    marginBottom: '12px',
                  }}>
                    {nft.name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}>
                    <div>
                      <p style={{ fontSize: '11px', color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '2px' }}>
                        Price
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CryptoIcon symbol="ETH" size={16} />
                        <span style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: isDark ? colors.text.primary : '#000000',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          {nft.price}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '2px' }}>
                        Last Sale
                      </p>
                      <span style={{
                        fontSize: '13px',
                        color: isDark ? colors.text.secondary : '#374151',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {nft.lastSale} ETH
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBuy(nft)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: isDark
                        ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`
                        : 'linear-gradient(135deg, #059669, #0891b2)',
                      border: 'none',
                      borderRadius: '10px',
                      color: isDark ? '#0a0e14' : '#ffffff',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <ShoppingCart size={16} />
                    Buy Now
                  </motion.button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* My NFTs Tab */}
        {activeTab === 'my-nfts' && (
          <div>
            {myNFTs.length === 0 ? (
              <GlassCard style={{ padding: '60px 24px', textAlign: 'center' }}>
                <Package size={48} color={isDark ? colors.text.tertiary : '#9ca3af'} style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>
                  No NFTs Yet
                </h3>
                <p style={{ fontSize: '14px', color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '24px' }}>
                  Start your collection by purchasing NFTs from the marketplace
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab('marketplace')}
                  style={{
                    padding: '12px 24px',
                    background: isDark ? colors.primary[400] : '#000000',
                    border: 'none',
                    borderRadius: '10px',
                    color: isDark ? '#0a0e14' : '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Browse Marketplace
                </motion.button>
              </GlassCard>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {myNFTs.map((nft) => (
                  <GlassCard key={nft.id} style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                      <img src={nft.image} alt={nft.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '4px 10px',
                        background: 'rgba(0,0,0,0.7)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: getRarityColor(nft.rarity),
                      }}>
                        {nft.rarity}
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 8px',
                        background: 'rgba(0,0,0,0.7)',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#fff',
                      }}>
                        {nft.standard}
                      </div>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <p style={{ fontSize: '12px', color: isDark ? colors.primary[400] : '#059669', fontWeight: 600, marginBottom: '4px' }}>
                        {nft.collection}
                      </p>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '12px' }}>
                        {nft.name}
                      </h3>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <p style={{ fontSize: '11px', color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '2px' }}>Est. Value</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CryptoIcon symbol="ETH" size={16} />
                            <span style={{ fontSize: '16px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', fontFamily: "'JetBrains Mono', monospace" }}>
                              {nft.price}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isDark ? colors.text.tertiary : '#6b7280' }}>
                          <Heart size={14} />
                          <span style={{ fontSize: '13px' }}>{nft.likes}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleSell(nft)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: isDark ? colors.primary[400] : '#000000',
                            border: 'none',
                            borderRadius: '8px',
                            color: isDark ? '#0a0e14' : '#ffffff',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <Tag size={14} />
                          List for Sale
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          style={{
                            padding: '10px 16px',
                            background: 'transparent',
                            border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`,
                            borderRadius: '8px',
                            color: isDark ? colors.text.secondary : '#374151',
                            cursor: 'pointer',
                          }}
                        >
                          <Share2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '2fr 1fr 1fr' : '50px 2fr 1fr 1fr 1fr 1fr',
              padding: '16px 20px',
              borderBottom: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`,
              fontSize: '12px',
              fontWeight: 700,
              color: isDark ? colors.text.tertiary : '#6b7280',
              textTransform: 'uppercase',
            }}>
              {!isMobile && <span>#</span>}
              <span>Collection</span>
              <span>Floor</span>
              {!isMobile && <span>Volume 24h</span>}
              <span>Change</span>
              {!isMobile && <span>Items</span>}
            </div>

            {/* Collection Rows */}
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                whileHover={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '2fr 1fr 1fr' : '50px 2fr 1fr 1fr 1fr 1fr',
                  padding: '16px 20px',
                  borderBottom: i < collections.length - 1 ? `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}` : 'none',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                {!isMobile && (
                  <span style={{ fontSize: '14px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280' }}>
                    {i + 1}
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={col.image} alt={col.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000' }}>{col.name}</p>
                    <p style={{ fontSize: '12px', color: isDark ? colors.text.tertiary : '#6b7280' }}>{col.owners.toLocaleString()} owners</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CryptoIcon symbol="ETH" size={14} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: isDark ? colors.text.primary : '#000000', fontFamily: "'JetBrains Mono', monospace" }}>
                    {col.floor}
                  </span>
                </div>
                {!isMobile && (
                  <span style={{ fontSize: '14px', fontWeight: 500, color: isDark ? colors.text.secondary : '#374151', fontFamily: "'JetBrains Mono', monospace" }}>
                    {col.volume24h} ETH
                  </span>
                )}
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: col.change24h >= 0 ? colors.trading.buy : colors.trading.sell,
                }}>
                  {col.change24h >= 0 ? '+' : ''}{col.change24h}%
                </span>
                {!isMobile && (
                  <span style={{ fontSize: '14px', color: isDark ? colors.text.secondary : '#374151' }}>
                    {col.items.toLocaleString()}
                  </span>
                )}
              </motion.div>
            ))}
          </GlassCard>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <GlassCard style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { type: 'Sale', nft: 'CrymadX Genesis #1234', from: '0x1234...5678', to: '0xabcd...ef01', price: 2.5, time: '2 hours ago' },
                { type: 'List', nft: 'Metaverse Plot #567', from: '0x1234...5678', to: '-', price: 1.2, time: '5 hours ago' },
                { type: 'Transfer', nft: 'AI Portrait #89', from: '0x9876...5432', to: '0x1234...5678', price: 0, time: '1 day ago' },
                { type: 'Mint', nft: 'Genesis Token #100', from: '-', to: '0x1234...5678', price: 0.1, time: '3 days ago' },
              ].map((activity, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb',
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: activity.type === 'Sale'
                        ? colors.trading.buyBg
                        : activity.type === 'List'
                        ? `${colors.primary[400]}15`
                        : isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {activity.type === 'Sale' ? <DollarSign size={18} color={colors.trading.buy} /> :
                       activity.type === 'List' ? <Tag size={18} color={colors.primary[400]} /> :
                       activity.type === 'Transfer' ? <ArrowRight size={18} color={isDark ? colors.text.tertiary : '#6b7280'} /> :
                       <Sparkles size={18} color={isDark ? colors.secondary[400] : '#0891b2'} />}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: isDark ? colors.text.primary : '#000000' }}>
                        {activity.type}
                      </p>
                      <p style={{ fontSize: '13px', color: isDark ? colors.text.tertiary : '#6b7280' }}>
                        {activity.nft}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {activity.price > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                        <CryptoIcon symbol="ETH" size={14} />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', fontFamily: "'JetBrains Mono', monospace" }}>
                          {activity.price}
                        </span>
                      </div>
                    )}
                    <p style={{ fontSize: '12px', color: isDark ? colors.text.tertiary : '#6b7280' }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </motion.div>

      {/* Buy NFT Modal */}
      <AnimatePresence>
        {showBuyModal && selectedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={modalOverlay}
            onClick={() => setShowBuyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={modalContent}
            >
              <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000' }}>
                    {buyStep === 3 ? 'Purchase Complete!' : 'Buy NFT'}
                  </h2>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowBuyModal(false)} style={{ background: 'none', border: 'none', color: isDark ? colors.text.tertiary : '#6b7280', cursor: 'pointer' }}>
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {[1, 2, 3].map((step) => (
                    <div key={step} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step <= buyStep ? colors.primary[400] : (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') }} />
                  ))}
                </div>

                {/* Step 1: Select Payment */}
                {buyStep === 1 && (
                  <div>
                    <div style={{ display: 'flex', gap: '16px', padding: '16px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb', borderRadius: '14px', marginBottom: '20px' }}>
                      <img src={selectedNFT.image} alt={selectedNFT.name} style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? colors.primary[400] : '#059669', marginBottom: '4px' }}>{selectedNFT.collection}</p>
                        <p style={{ fontSize: '16px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>{selectedNFT.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CryptoIcon symbol="ETH" size={18} />
                          <span style={{ fontSize: '18px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000' }}>{selectedNFT.price}</span>
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '14px', fontWeight: 600, color: isDark ? colors.text.primary : '#000000', marginBottom: '12px' }}>
                      Pay with
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      {(['ETH', 'USDT', 'BNB'] as const).map((currency) => (
                        <motion.button
                          key={currency}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedPayment(currency)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px',
                            background: selectedPayment === currency ? (isDark ? `${colors.primary[400]}15` : '#f0fdf4') : 'transparent',
                            border: `2px solid ${selectedPayment === currency ? colors.primary[400] : (isDark ? colors.glass.border : '#e5e7eb')}`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CryptoIcon symbol={currency} size={28} />
                            <div style={{ textAlign: 'left' }}>
                              <p style={{ fontSize: '14px', fontWeight: 600, color: isDark ? colors.text.primary : '#000000' }}>{currency}</p>
                              <p style={{ fontSize: '12px', color: isDark ? colors.text.tertiary : '#6b7280' }}>
                                Balance: {walletBalances[currency].toFixed(currency === 'USDT' ? 2 : 4)}
                              </p>
                            </div>
                          </div>
                          {selectedPayment === currency && <Check size={20} color={colors.primary[400]} />}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setBuyStep(2)}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: isDark ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})` : '#000000',
                        border: 'none',
                        borderRadius: '12px',
                        color: isDark ? '#0a0e14' : '#ffffff',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Confirm Purchase
                    </motion.button>
                  </div>
                )}

                {/* Step 2: Processing */}
                {buyStep === 2 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '60px', height: '60px', border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, borderTopColor: colors.primary[400], borderRadius: '50%', margin: '0 auto 20px' }}
                    />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>
                      Processing Purchase
                    </h3>
                    <p style={{ fontSize: '14px', color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '20px' }}>
                      Transferring NFT to your wallet...
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3 }}
                      onAnimationComplete={() => setBuyStep(3)}
                      style={{ height: '4px', background: colors.primary[400], borderRadius: '2px' }}
                    />
                  </div>
                )}

                {/* Step 3: Success */}
                {buyStep === 3 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ width: '80px', height: '80px', borderRadius: '50%', background: colors.trading.buyBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}
                    >
                      <Check size={40} color={colors.trading.buy} />
                    </motion.div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>
                      NFT Purchased!
                    </h3>
                    <p style={{ fontSize: '14px', color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '24px' }}>
                      {selectedNFT.name} is now in your wallet
                    </p>
                    <img src={selectedNFT.image} alt={selectedNFT.name} style={{ width: '120px', height: '120px', borderRadius: '12px', marginBottom: '24px' }} />
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { setShowBuyModal(false); setActiveTab('my-nfts'); }}
                        style={{ flex: 1, padding: '14px', background: isDark ? colors.primary[400] : '#000000', border: 'none', borderRadius: '12px', color: isDark ? '#0a0e14' : '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        View My NFTs
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setShowBuyModal(false)}
                        style={{ padding: '14px 20px', background: 'transparent', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`, borderRadius: '12px', color: isDark ? colors.text.primary : '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <ExternalLink size={16} />
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sell NFT Modal */}
      <AnimatePresence>
        {showSellModal && selectedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={modalOverlay}
            onClick={() => setShowSellModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={modalContent}
            >
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000' }}>
                    {sellStep === 3 ? 'Listed Successfully!' : 'List NFT for Sale'}
                  </h2>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowSellModal(false)} style={{ background: 'none', border: 'none', color: isDark ? colors.text.tertiary : '#6b7280', cursor: 'pointer' }}>
                    <X size={24} />
                  </motion.button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {[1, 2, 3].map((step) => (
                    <div key={step} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step <= sellStep ? colors.primary[400] : (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') }} />
                  ))}
                </div>

                {sellStep === 1 && (
                  <div>
                    <div style={{ display: 'flex', gap: '16px', padding: '16px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb', borderRadius: '14px', marginBottom: '20px' }}>
                      <img src={selectedNFT.image} alt={selectedNFT.name} style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontSize: '12px', color: isDark ? colors.primary[400] : '#059669', marginBottom: '4px' }}>{selectedNFT.collection}</p>
                        <p style={{ fontSize: '16px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000' }}>{selectedNFT.name}</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>
                        Set Price (ETH)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
                          <CryptoIcon symbol="ETH" size={20} />
                        </div>
                        <input
                          type="number"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '14px 14px 14px 44px',
                            background: isDark ? colors.background.card : '#f9fafb',
                            border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`,
                            borderRadius: '12px',
                            color: isDark ? colors.text.primary : '#000000',
                            fontSize: '18px',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            outline: 'none',
                          }}
                        />
                      </div>
                      <p style={{ fontSize: '12px', color: isDark ? colors.text.tertiary : '#6b7280', marginTop: '8px' }}>
                        Floor price: {selectedNFT.price} ETH | You receive: {(parseFloat(sellPrice || '0') * 0.975).toFixed(4)} ETH (2.5% fee)
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSellStep(2)}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: isDark ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})` : '#000000',
                        border: 'none',
                        borderRadius: '12px',
                        color: isDark ? '#0a0e14' : '#ffffff',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      List for Sale
                    </motion.button>
                  </div>
                )}

                {sellStep === 2 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '60px', height: '60px', border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, borderTopColor: colors.primary[400], borderRadius: '50%', margin: '0 auto 20px' }}
                    />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>Creating Listing</h3>
                    <p style={{ fontSize: '14px', color: isDark ? colors.text.tertiary : '#6b7280' }}>Please wait...</p>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                      onAnimationComplete={() => setSellStep(3)}
                      style={{ height: '4px', background: colors.primary[400], borderRadius: '2px', marginTop: '20px' }}
                    />
                  </div>
                )}

                {sellStep === 3 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: '80px', height: '80px', borderRadius: '50%', background: colors.trading.buyBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <Check size={40} color={colors.trading.buy} />
                    </motion.div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>NFT Listed!</h3>
                    <p style={{ fontSize: '14px', color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '24px' }}>{selectedNFT.name} is now available for {sellPrice} ETH</p>
                    <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowSellModal(false)} style={{ width: '100%', padding: '14px', background: isDark ? colors.primary[400] : '#000000', border: 'none', borderRadius: '12px', color: isDark ? '#0a0e14' : '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                      Done
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mint NFT Modal */}
      <AnimatePresence>
        {showMintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={modalOverlay}
            onClick={() => setShowMintModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={modalContent}
            >
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000' }}>
                    {mintStep === 4 ? 'NFT Created!' : 'Create NFT'}
                  </h2>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowMintModal(false)} style={{ background: 'none', border: 'none', color: isDark ? colors.text.tertiary : '#6b7280', cursor: 'pointer' }}>
                    <X size={24} />
                  </motion.button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step <= mintStep ? colors.primary[400] : (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') }} />
                  ))}
                </div>

                {mintStep === 1 && (
                  <div>
                    <div style={{ border: `2px dashed ${isDark ? colors.glass.border : '#d1d5db'}`, borderRadius: '16px', padding: '40px 20px', textAlign: 'center', marginBottom: '20px', cursor: 'pointer' }}>
                      <Upload size={48} color={isDark ? colors.text.tertiary : '#9ca3af'} style={{ marginBottom: '16px' }} />
                      <p style={{ fontSize: '16px', fontWeight: 600, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>Upload your artwork</p>
                      <p style={{ fontSize: '13px', color: isDark ? colors.text.tertiary : '#6b7280' }}>PNG, JPG, GIF, WEBP, MP4 (Max 100MB)</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} onClick={() => setMintStep(2)} style={{ width: '100%', padding: '14px', background: isDark ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})` : '#000000', border: 'none', borderRadius: '12px', color: isDark ? '#0a0e14' : '#ffffff', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
                      Continue
                    </motion.button>
                  </div>
                )}

                {mintStep === 2 && (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>Name *</label>
                      <input placeholder="Enter NFT name" style={{ width: '100%', padding: '14px', background: isDark ? colors.background.card : '#f9fafb', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`, borderRadius: '12px', color: isDark ? colors.text.primary : '#000000', fontSize: '14px', outline: 'none' }} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>Description</label>
                      <textarea placeholder="Describe your NFT..." rows={3} style={{ width: '100%', padding: '14px', background: isDark ? colors.background.card : '#f9fafb', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`, borderRadius: '12px', color: isDark ? colors.text.primary : '#000000', fontSize: '14px', outline: 'none', resize: 'none' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>Token Standard</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {['ERC-721', 'ERC-1155'].map((std) => (
                          <motion.button key={std} whileHover={{ scale: 1.02 }} style={{ flex: 1, padding: '12px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`, borderRadius: '10px', color: isDark ? colors.text.primary : '#000000', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                            {std}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} onClick={() => setMintStep(3)} style={{ width: '100%', padding: '14px', background: isDark ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})` : '#000000', border: 'none', borderRadius: '12px', color: isDark ? '#0a0e14' : '#ffffff', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
                      Continue
                    </motion.button>
                  </div>
                )}

                {mintStep === 3 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '60px', height: '60px', border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, borderTopColor: colors.primary[400], borderRadius: '50%', margin: '0 auto 20px' }}
                    />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>Minting NFT</h3>
                    <p style={{ fontSize: '14px', color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '20px' }}>Uploading to IPFS and minting on blockchain...</p>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4 }}
                      onAnimationComplete={() => setMintStep(4)}
                      style={{ height: '4px', background: colors.primary[400], borderRadius: '2px' }}
                    />
                  </div>
                )}

                {mintStep === 4 && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: '80px', height: '80px', borderRadius: '50%', background: colors.trading.buyBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <Award size={40} color={colors.trading.buy} />
                    </motion.div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '8px' }}>NFT Created!</h3>
                    <p style={{ fontSize: '14px', color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '24px' }}>Your NFT has been minted successfully</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <motion.button whileHover={{ scale: 1.02 }} onClick={() => { setShowMintModal(false); setActiveTab('my-nfts'); }} style={{ flex: 1, padding: '14px', background: isDark ? colors.primary[400] : '#000000', border: 'none', borderRadius: '12px', color: isDark ? '#0a0e14' : '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                        View NFT
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} onClick={() => setMintStep(1)} style={{ padding: '14px 20px', background: 'transparent', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`, borderRadius: '12px', color: isDark ? colors.text.primary : '#000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                        Create Another
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

export default NFTScreen;
