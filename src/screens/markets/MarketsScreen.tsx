import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Flame,
  Zap,
  Clock,
  Activity,
  BarChart2,
  X,
  Loader2,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, CryptoIcon, ResponsiveLayout } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { LiquidGlassBackground, LiquidOrb } from '../../components/Glass3D';
import { priceService } from '../../services';

// ============================================
// TYPES
// ============================================
interface MarketData {
  symbol: string;
  baseAsset: string;
  name: string;
  pair: string;
  price: number;
  change24h: number;
  high: number;
  low: number;
  volume: string;
  quoteVolume: number;
  rank: number;
}

interface MarketStats {
  totalMarketCap: string;
  totalVolume24h: string;
  btcDominance: string;
  activeMarkets: number;
}

// ============================================
// COIN NAME MAPPING
// ============================================
const coinNames: Record<string, string> = {
  BTC: 'Bitcoin', ETH: 'Ethereum', BNB: 'BNB', SOL: 'Solana', XRP: 'Ripple',
  ADA: 'Cardano', DOGE: 'Dogecoin', AVAX: 'Avalanche', MATIC: 'Polygon',
  LINK: 'Chainlink', DOT: 'Polkadot', UNI: 'Uniswap', SHIB: 'Shiba Inu',
  LTC: 'Litecoin', ATOM: 'Cosmos', TRX: 'TRON', ETC: 'Ethereum Classic',
  XLM: 'Stellar', NEAR: 'NEAR Protocol', APT: 'Aptos', FIL: 'Filecoin',
  ARB: 'Arbitrum', OP: 'Optimism', IMX: 'Immutable X', INJ: 'Injective',
  HBAR: 'Hedera', VET: 'VeChain', ALGO: 'Algorand', GRT: 'The Graph',
  SAND: 'The Sandbox', MANA: 'Decentraland', AAVE: 'Aave', MKR: 'Maker',
  SNX: 'Synthetix', CRV: 'Curve DAO', LDO: 'Lido DAO', RUNE: 'THORChain',
  FTM: 'Fantom', EGLD: 'MultiversX', FLOW: 'Flow', XTZ: 'Tezos',
  AXS: 'Axie Infinity', ENJ: 'Enjin Coin', CHZ: 'Chiliz', GALA: 'Gala',
  APE: 'ApeCoin', DYDX: 'dYdX', '1INCH': '1inch', SUSHI: 'SushiSwap',
  COMP: 'Compound', BAL: 'Balancer', YFI: 'yearn.finance', ZRX: '0x Protocol',
  REN: 'Ren', OCEAN: 'Ocean Protocol', FET: 'Fetch.ai', AGIX: 'SingularityNET',
  RNDR: 'Render', ROSE: 'Oasis Network', KAVA: 'Kava', ZIL: 'Zilliqa',
  QTUM: 'Qtum', ICX: 'ICON', ONT: 'Ontology', ZEN: 'Horizen', WAVES: 'Waves',
  STORJ: 'Storj', CELO: 'Celo', SKL: 'SKALE', ANKR: 'Ankr', SXP: 'Solar',
  AUDIO: 'Audius', MASK: 'Mask Network', BAND: 'Band Protocol', BAT: 'Basic Attention',
  BLUR: 'Blur', WLD: 'Worldcoin', SUI: 'Sui', SEI: 'Sei', TIA: 'Celestia',
  PYTH: 'Pyth Network', JTO: 'Jito', WIF: 'dogwifhat', BONK: 'Bonk',
  PEPE: 'Pepe', FLOKI: 'Floki', MEME: 'Memecoin', ORDI: 'ORDI',
  STX: 'Stacks', KAS: 'Kaspa', MINA: 'Mina Protocol', GMX: 'GMX',
  PENDLE: 'Pendle', JUP: 'Jupiter', W: 'Wormhole', ENA: 'Ethena',
  TON: 'Toncoin', NOT: 'Notcoin', CORE: 'Core', TAO: 'Bittensor',
  BRETT: 'Brett', POPCAT: 'Popcat', MEW: 'cat in a dogs world',
  TURBO: 'Turbo', NEIRO: 'First Neiro On Ethereum', WEN: 'WEN',
};

const getCoinName = (symbol: string): string => coinNames[symbol] || symbol;

// Format volume
const formatVolume = (volume: number): string => {
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B';
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M';
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K';
  return volume.toFixed(2);
};

// Format price
const formatPrice = (price: number): string => {
  if (price >= 1000) return '$' + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return '$' + price.toFixed(4);
  if (price >= 0.0001) return '$' + price.toFixed(6);
  return '$' + price.toFixed(8);
};

const categories = [
  { id: 'all', label: 'All', icon: null },
  { id: 'favorites', label: 'Favorites', icon: <Star size={14} /> },
  { id: 'spot', label: 'Spot', icon: null },
  { id: 'futures', label: 'Futures', icon: <Zap size={14} /> },
  { id: 'new', label: 'New Listings', icon: <Clock size={14} /> },
  { id: 'gainers', label: 'Top Gainers', icon: <TrendingUp size={14} /> },
  { id: 'losers', label: 'Top Losers', icon: <TrendingDown size={14} /> },
];

// Mini sparkline chart component
const MiniSparkline: React.FC<{ positive: boolean; colors: any }> = ({ positive, colors }) => {
  const points = positive
    ? 'M0,20 L10,18 L20,22 L30,15 L40,17 L50,10 L60,8 L70,12 L80,5'
    : 'M0,5 L10,8 L20,6 L30,12 L40,10 L50,15 L60,18 L70,14 L80,20';

  return (
    <svg width="80" height="24" viewBox="0 0 80 24" style={{ opacity: 0.7 }}>
      <path
        d={points}
        fill="none"
        stroke={positive ? colors.trading.buy : colors.trading.sell}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MarketsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors } = useThemeMode();
  const { requireAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'volume' | 'change' | 'price'>('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('marketFavorites');
    return saved ? JSON.parse(saved) : ['BTC', 'ETH', 'SOL', 'AVAX'];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketStats, setMarketStats] = useState<MarketStats>({
    totalMarketCap: '$0',
    totalVolume24h: '$0',
    btcDominance: '0%',
    activeMarkets: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const itemsPerPage = isMobile ? 10 : 15;

  // Fetch market data from backend price service
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);

        const prices = await priceService.getAllPrices();
        const backendPairs = Object.entries(prices).map(([symbol, data], index) => ({
          symbol,
          baseAsset: symbol,
          name: getCoinName(symbol),
          pair: `${symbol}/USDT`,
          price: data.usd,
          change24h: data.change24h,
          high: data.high24h || data.usd * 1.02,
          low: data.low24h || data.usd * 0.98,
          volume: formatVolume(data.volume24h || 0),
          quoteVolume: data.volume24h || 0,
          rank: index + 1,
        }));

        // Sort by volume and re-rank
        const sortedPairs = backendPairs
          .sort((a, b) => b.quoteVolume - a.quoteVolume)
          .map((p, index) => ({ ...p, rank: index + 1 }));

        setMarketData(sortedPairs);

        // Calculate market stats
        const totalVolume = sortedPairs.reduce((sum: number, p: MarketData) => sum + p.quoteVolume, 0);

        setMarketStats({
          totalMarketCap: '$1.72T',
          totalVolume24h: '$' + formatVolume(totalVolume),
          btcDominance: '49.8%',
          activeMarkets: sortedPairs.length,
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
        setLoading(false);
      }
    };

    fetchMarkets();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMarkets, 30000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket cleanup (disabled - using polling instead)
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleTrade = (symbol: string) => {
    navigate(`/trade/${symbol.toLowerCase()}usdt`);
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol];
      localStorage.setItem('marketFavorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const filteredMarkets = marketData.filter((market) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!market.name.toLowerCase().includes(query) &&
          !market.symbol.toLowerCase().includes(query) &&
          !market.pair.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (activeCategory === 'favorites' && !favorites.includes(market.symbol)) return false;
    if (activeCategory === 'gainers' && market.change24h <= 0) return false;
    if (activeCategory === 'losers' && market.change24h >= 0) return false;
    return true;
  });

  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'volume') {
      comparison = b.quoteVolume - a.quoteVolume;
    } else if (sortBy === 'change') {
      comparison = b.change24h - a.change24h;
    } else if (sortBy === 'price') {
      comparison = b.price - a.price;
    }
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedMarkets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMarkets = sortedMarkets.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, sortBy, sortOrder]);

  if (loading) {
    return (
      <ResponsiveLayout activeNav="markets" title="Markets">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <Loader2 size={40} color={colors.primary[400]} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ color: colors.text.tertiary }}>Loading markets...</span>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activeNav="markets" title="Markets">
      {/* Premium Liquid Glass Background */}
      <LiquidGlassBackground
        intensity="low"
        showOrbs={true}
        showRings={false}
        showCubes={false}
      />
      <LiquidOrb
        size={160}
        color="cyan"
        style={{ position: 'fixed', top: '10%', right: '-4%', zIndex: 0 }}
        delay={0}
        duration={11}
      />
      <LiquidOrb
        size={130}
        color="green"
        style={{ position: 'fixed', bottom: '20%', left: '-3%', zIndex: 0 }}
        delay={2}
        duration={13}
      />

      {/* Page Header */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '24px' }}
        >
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: colors.text.primary,
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(26, 143, 255, 0.15), rgba(0, 212, 170, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChart2 size={22} color={colors.primary[400]} />
            </motion.div>
            Markets
          </h1>
          <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
            Explore {marketData.length}+ cryptocurrency pairs with real-time data
          </p>
        </motion.div>
      )}

      {/* Market Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: isMobile ? '16px' : '24px' }}
      >
        <GlassCard padding={isMobile ? 'sm' : 'md'}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '16px',
          }}>
            {[
              { label: 'Market Cap', value: marketStats.totalMarketCap, change: 2.34, icon: <Activity size={16} /> },
              { label: '24h Volume', value: marketStats.totalVolume24h, change: 5.67, icon: <BarChart2 size={16} /> },
              { label: 'BTC Dom.', value: marketStats.btcDominance, change: -0.34, icon: <TrendingUp size={16} /> },
              { label: 'Active Markets', value: marketData.length.toString(), change: null, icon: <Zap size={16} /> },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  padding: isMobile ? '12px' : '16px',
                  background: 'linear-gradient(135deg, rgba(26, 143, 255, 0.05), rgba(0, 212, 170, 0.03))',
                  borderRadius: '12px',
                  border: `1px solid ${colors.glass.border}`,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '6px',
                }}>
                  <span style={{ color: colors.primary[400] }}>{stat.icon}</span>
                  <p style={{
                    fontSize: isMobile ? '10px' : '12px',
                    color: colors.text.tertiary,
                  }}>
                    {stat.label}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: isMobile ? '16px' : '20px',
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: colors.text.primary,
                  }}>
                    {stat.value}
                  </span>
                  {stat.change !== null && (
                    <span style={{
                      fontSize: isMobile ? '10px' : '12px',
                      fontWeight: 500,
                      color: stat.change >= 0 ? colors.trading.buy : colors.trading.sell,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}>
                      {stat.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {stat.change >= 0 ? '+' : ''}{stat.change}%
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Trending Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: isMobile ? '16px' : '24px' }}
      >
        <GlassCard padding={isMobile ? 'sm' : 'md'}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Flame size={isMobile ? 16 : 18} color="#F7931A" />
            </motion.div>
            <h2 style={{
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: 600,
              color: colors.text.primary,
            }}>
              Trending Now
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
            gap: isMobile ? '8px' : '12px',
          }}>
            {marketData.slice(0, isMobile ? 4 : 6).map((market, index) => (
              <motion.div
                key={market.symbol}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => handleTrade(market.symbol)}
                style={{
                  padding: isMobile ? '12px' : '16px',
                  background: 'linear-gradient(135deg, rgba(26, 143, 255, 0.05), rgba(0, 212, 170, 0.03))',
                  borderRadius: '12px',
                  border: `1px solid ${colors.glass.border}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: isMobile ? '8px' : '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CryptoIcon symbol={market.symbol} size={isMobile ? 24 : 28} />
                    <div>
                      <p style={{
                        fontSize: isMobile ? '12px' : '14px',
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}>
                        {market.symbol}
                      </p>
                      <p style={{
                        fontSize: isMobile ? '10px' : '11px',
                        color: colors.text.tertiary,
                      }}>
                        {market.name}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(market.symbol); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Star
                      size={16}
                      color={favorites.includes(market.symbol) ? '#F7931A' : colors.text.tertiary}
                      fill={favorites.includes(market.symbol) ? '#F7931A' : 'none'}
                    />
                  </motion.button>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <MiniSparkline positive={market.change24h >= 0} colors={colors} />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}>
                  <span style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: colors.text.primary,
                  }}>
                    {formatPrice(market.price)}
                  </span>
                  <span style={{
                    fontSize: isMobile ? '11px' : '12px',
                    fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    padding: isMobile ? '3px 6px' : '4px 8px',
                    borderRadius: '6px',
                    background: market.change24h >= 0 ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                    color: market.change24h >= 0 ? colors.trading.buy : colors.trading.sell,
                  }}>
                    {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Markets Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard padding={isMobile ? 'sm' : 'md'}>
          {/* Filters */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            marginBottom: isMobile ? '12px' : '16px',
            gap: isMobile ? '10px' : '12px',
          }}>
            {/* Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '10px 12px' : '10px 14px',
              background: 'rgba(26, 143, 255, 0.03)',
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '10px',
              flex: isMobile ? 1 : 'none',
              minWidth: isMobile ? 'auto' : '280px',
              order: isMobile ? 1 : 0,
            }}>
              <Search size={16} color={colors.text.tertiary} />
              <input
                type="text"
                placeholder="Search coin name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: colors.text.primary,
                  fontSize: isMobile ? '13px' : '14px',
                }}
              />
              {searchQuery && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    color: colors.text.tertiary,
                  }}
                >
                  <X size={14} />
                </motion.button>
              )}
            </div>

            {/* Categories */}
            <div style={{
              display: 'flex',
              gap: '3px',
              padding: '4px',
              background: 'rgba(26, 143, 255, 0.03)',
              borderRadius: '10px',
              border: `1px solid ${colors.glass.border}`,
              overflowX: 'auto',
              order: isMobile ? 0 : 1,
            }}>
              {categories.slice(0, isMobile ? 4 : categories.length).map((cat) => (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: isMobile ? '6px 10px' : '8px 12px',
                    borderRadius: '8px',
                    fontSize: isMobile ? '11px' : '12px',
                    fontWeight: 600,
                    background: activeCategory === cat.id
                      ? 'linear-gradient(135deg, rgba(26, 143, 255, 0.15), rgba(0, 212, 170, 0.1))'
                      : 'transparent',
                    color: activeCategory === cat.id ? colors.primary[400] : colors.text.tertiary,
                    border: activeCategory === cat.id ? `1px solid rgba(26, 143, 255, 0.3)` : '1px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Table - Desktop */}
          {!isMobile && (
            <div style={{
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {/* Column Headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 2fr 1.5fr 1.2fr 1fr 1fr 1fr 100px',
                padding: '14px 20px',
                background: 'linear-gradient(135deg, rgba(26, 143, 255, 0.03), rgba(0, 212, 170, 0.02))',
                borderBottom: `1px solid ${colors.glass.border}`,
                fontSize: '11px',
                fontWeight: 600,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                <span></span>
                <span>Market</span>
                <button
                  onClick={() => { setSortBy('price'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: sortBy === 'price' ? colors.primary[400] : colors.text.tertiary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textAlign: 'right',
                    justifyContent: 'flex-end',
                    fontSize: 'inherit',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Price <ArrowUpDown size={12} />
                </button>
                <button
                  onClick={() => { setSortBy('change'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: sortBy === 'change' ? colors.primary[400] : colors.text.tertiary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textAlign: 'right',
                    justifyContent: 'flex-end',
                    fontSize: 'inherit',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  24h Change <ArrowUpDown size={12} />
                </button>
                <span style={{ textAlign: 'right' }}>24h High</span>
                <span style={{ textAlign: 'right' }}>24h Low</span>
                <button
                  onClick={() => { setSortBy('volume'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: sortBy === 'volume' ? colors.primary[400] : colors.text.tertiary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textAlign: 'right',
                    justifyContent: 'flex-end',
                    fontSize: 'inherit',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Volume <ArrowUpDown size={12} />
                </button>
                <span style={{ textAlign: 'center' }}>Action</span>
              </div>

              {/* Market Rows */}
              {paginatedMarkets.map((market, index) => (
                <motion.div
                  key={market.pair}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * index }}
                  whileHover={{ background: 'rgba(26, 143, 255, 0.06)' }}
                  onClick={() => handleTrade(market.symbol)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 2fr 1.5fr 1.2fr 1fr 1fr 1fr 100px',
                    padding: '14px 20px',
                    borderBottom: index < paginatedMarkets.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    alignItems: 'center',
                  }}
                >
                  {/* Star */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(market.symbol); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: favorites.includes(market.symbol) ? '#F7931A' : colors.text.tertiary,
                      padding: '4px',
                    }}
                  >
                    <Star size={16} fill={favorites.includes(market.symbol) ? '#F7931A' : 'none'} />
                  </motion.button>

                  {/* Market Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CryptoIcon symbol={market.symbol} size={36} />
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}>
                        {market.pair}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: colors.text.tertiary,
                      }}>
                        {market.name}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{
                    textAlign: 'right',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '14px',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}>
                    {formatPrice(market.price)}
                  </div>

                  {/* 24h Change */}
                  <div style={{
                    textAlign: 'right',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                  }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: market.change24h >= 0 ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                      color: market.change24h >= 0 ? colors.trading.buy : colors.trading.sell,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      {market.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                    </span>
                  </div>

                  {/* 24h High */}
                  <div style={{
                    textAlign: 'right',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    color: colors.text.secondary,
                  }}>
                    {formatPrice(market.high)}
                  </div>

                  {/* 24h Low */}
                  <div style={{
                    textAlign: 'right',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    color: colors.text.secondary,
                  }}>
                    {formatPrice(market.low)}
                  </div>

                  {/* Volume */}
                  <div style={{
                    textAlign: 'right',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                    color: colors.text.secondary,
                  }}>
                    {market.volume === '0' || market.volume === '$0' ? 'N/A' : `$${market.volume}`}
                  </div>

                  {/* Trade Button */}
                  <div style={{ textAlign: 'center' }}>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 2px 12px rgba(0, 255, 136, 0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => { e.stopPropagation(); handleTrade(market.symbol); }}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#0b0e11',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      Trade
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Mobile List View */}
          {isMobile && (
            <div style={{
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              {/* Mobile Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: 'linear-gradient(135deg, rgba(26, 143, 255, 0.03), rgba(0, 212, 170, 0.02))',
                borderBottom: `1px solid ${colors.glass.border}`,
                fontSize: '10px',
                fontWeight: 600,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
              }}>
                <span>Market</span>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    onClick={() => { setSortBy('price'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: sortBy === 'price' ? colors.primary[400] : colors.text.tertiary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    Price <ArrowUpDown size={10} />
                  </button>
                  <button
                    onClick={() => { setSortBy('change'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: sortBy === 'change' ? colors.primary[400] : colors.text.tertiary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    24h <ArrowUpDown size={10} />
                  </button>
                </div>
              </div>

              {/* Mobile Market Rows */}
              {paginatedMarkets.map((market, index) => (
                <motion.div
                  key={market.pair}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.03 * index }}
                  whileHover={{ background: 'rgba(26, 143, 255, 0.06)' }}
                  onClick={() => handleTrade(market.symbol)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderBottom: index < paginatedMarkets.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {/* Left: Star + Market Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(market.symbol); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: favorites.includes(market.symbol) ? '#F7931A' : colors.text.tertiary,
                        padding: '2px',
                      }}
                    >
                      <Star size={14} fill={favorites.includes(market.symbol) ? '#F7931A' : 'none'} />
                    </motion.button>
                    <CryptoIcon symbol={market.symbol} size={28} />
                    <div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}>
                        {market.symbol}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: colors.text.tertiary,
                      }}>
                        {market.name}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price + Change */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.text.primary,
                      marginBottom: '2px',
                    }}>
                      {formatPrice(market.price)}
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: market.change24h >= 0 ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                    }}>
                      {market.change24h >= 0 ? (
                        <TrendingUp size={10} color={colors.trading.buy} />
                      ) : (
                        <TrendingDown size={10} color={colors.trading.sell} />
                      )}
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        fontWeight: 600,
                        color: market.change24h >= 0 ? colors.trading.buy : colors.trading.sell,
                      }}>
                        {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            marginTop: isMobile ? '12px' : '20px',
            padding: '0 4px',
            gap: isMobile ? '10px' : '0',
          }}>
            <span style={{
              fontSize: isMobile ? '11px' : '13px',
              color: colors.text.tertiary,
              textAlign: isMobile ? 'center' : 'left',
            }}>
              Showing {startIndex + 1}-{Math.min(endIndex, sortedMarkets.length)} of {sortedMarkets.length} markets
            </span>

            <div style={{ display: 'flex', gap: isMobile ? '4px' : '8px', justifyContent: 'center', alignItems: 'center' }}>
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: isMobile ? '6px 10px' : '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.glass.border}`,
                  background: 'transparent',
                  color: currentPage === 1 ? colors.text.muted : colors.text.secondary,
                  fontSize: isMobile ? '11px' : '13px',
                  fontWeight: 500,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                Prev
              </motion.button>

              {/* Page Numbers */}
              {(() => {
                const pages: (number | string)[] = [];
                const maxVisible = isMobile ? 3 : 5;

                if (totalPages <= maxVisible + 2) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (currentPage > 3) pages.push('...');

                  const start = Math.max(2, currentPage - 1);
                  const end = Math.min(totalPages - 1, currentPage + 1);

                  for (let i = start; i <= end; i++) pages.push(i);

                  if (currentPage < totalPages - 2) pages.push('...');
                  pages.push(totalPages);
                }

                return pages.map((page, i) => (
                  <motion.button
                    key={i}
                    whileHover={typeof page === 'number' ? { scale: 1.05 } : {}}
                    whileTap={typeof page === 'number' ? { scale: 0.95 } : {}}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={typeof page !== 'number'}
                    style={{
                      width: isMobile ? '28px' : '32px',
                      height: isMobile ? '28px' : '32px',
                      borderRadius: '8px',
                      border: page === currentPage ? 'none' : `1px solid ${colors.glass.border}`,
                      background: page === currentPage
                        ? colors.gradients.primarySolid
                        : 'transparent',
                      color: page === currentPage ? '#ffffff' : colors.text.tertiary,
                      fontSize: isMobile ? '11px' : '13px',
                      fontWeight: page === currentPage ? 700 : 500,
                      cursor: typeof page === 'number' ? 'pointer' : 'default',
                    }}
                  >
                    {page}
                  </motion.button>
                ));
              })()}

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: isMobile ? '6px 10px' : '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.glass.border}`,
                  background: 'transparent',
                  color: currentPage === totalPages ? colors.text.muted : colors.text.secondary,
                  fontSize: isMobile ? '11px' : '13px',
                  fontWeight: 500,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                Next
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </ResponsiveLayout>
  );
};

export default MarketsScreen;
