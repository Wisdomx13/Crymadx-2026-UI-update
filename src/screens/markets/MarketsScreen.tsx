import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  TrendingDown,
  X,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { CryptoIcon, ResponsiveLayout, GlassCard } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { LiquidGlassBackground } from '../../components/Glass3D';

// ============================================
// TYPES
// ============================================
interface MarketData {
  symbol: string;
  name: string;
  pair: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: string;
  quoteVolume: number;
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
  FET: 'Fetch.ai', AGIX: 'SingularityNET', RNDR: 'Render', ROSE: 'Oasis Network',
  SUI: 'Sui', SEI: 'Sei', TIA: 'Celestia', WIF: 'dogwifhat', BONK: 'Bonk',
  PEPE: 'Pepe', FLOKI: 'Floki', ORDI: 'ORDI', STX: 'Stacks', KAS: 'Kaspa',
  MINA: 'Mina Protocol', GMX: 'GMX', PENDLE: 'Pendle', JUP: 'Jupiter',
  W: 'Wormhole', ENA: 'Ethena', TON: 'Toncoin', NOT: 'Notcoin', TAO: 'Bittensor',
};

const getCoinName = (symbol: string): string => coinNames[symbol] || symbol;

// Static fallback market data
const staticMarketData: MarketData[] = [
  { symbol: 'BTC', name: 'Bitcoin', pair: 'BTC/USDT', price: 97234.52, change24h: 2.34, high24h: 98450.00, low24h: 94120.00, volume: '28.5B', quoteVolume: 28500000000 },
  { symbol: 'ETH', name: 'Ethereum', pair: 'ETH/USDT', price: 3456.78, change24h: 3.21, high24h: 3520.00, low24h: 3340.00, volume: '15.2B', quoteVolume: 15200000000 },
  { symbol: 'BNB', name: 'BNB', pair: 'BNB/USDT', price: 712.45, change24h: 1.87, high24h: 725.00, low24h: 695.00, volume: '1.8B', quoteVolume: 1800000000 },
  { symbol: 'SOL', name: 'Solana', pair: 'SOL/USDT', price: 198.34, change24h: 5.67, high24h: 205.00, low24h: 186.00, volume: '4.2B', quoteVolume: 4200000000 },
  { symbol: 'XRP', name: 'Ripple', pair: 'XRP/USDT', price: 2.34, change24h: 4.12, high24h: 2.45, low24h: 2.21, volume: '3.1B', quoteVolume: 3100000000 },
  { symbol: 'ADA', name: 'Cardano', pair: 'ADA/USDT', price: 1.12, change24h: -1.23, high24h: 1.18, low24h: 1.08, volume: '890M', quoteVolume: 890000000 },
  { symbol: 'DOGE', name: 'Dogecoin', pair: 'DOGE/USDT', price: 0.3845, change24h: 6.78, high24h: 0.4012, low24h: 0.3567, volume: '2.3B', quoteVolume: 2300000000 },
  { symbol: 'AVAX', name: 'Avalanche', pair: 'AVAX/USDT', price: 42.56, change24h: 3.45, high24h: 44.20, low24h: 40.80, volume: '620M', quoteVolume: 620000000 },
  { symbol: 'DOT', name: 'Polkadot', pair: 'DOT/USDT', price: 8.92, change24h: -0.87, high24h: 9.15, low24h: 8.67, volume: '412M', quoteVolume: 412000000 },
  { symbol: 'LINK', name: 'Chainlink', pair: 'LINK/USDT', price: 24.67, change24h: 2.98, high24h: 25.40, low24h: 23.80, volume: '580M', quoteVolume: 580000000 },
  { symbol: 'MATIC', name: 'Polygon', pair: 'MATIC/USDT', price: 0.5234, change24h: 1.56, high24h: 0.5412, low24h: 0.5089, volume: '345M', quoteVolume: 345000000 },
  { symbol: 'SHIB', name: 'Shiba Inu', pair: 'SHIB/USDT', price: 0.00002456, change24h: 8.34, high24h: 0.00002612, low24h: 0.00002234, volume: '890M', quoteVolume: 890000000 },
  { symbol: 'LTC', name: 'Litecoin', pair: 'LTC/USDT', price: 112.34, change24h: 1.23, high24h: 115.20, low24h: 109.50, volume: '456M', quoteVolume: 456000000 },
  { symbol: 'UNI', name: 'Uniswap', pair: 'UNI/USDT', price: 14.56, change24h: 4.56, high24h: 15.12, low24h: 13.89, volume: '289M', quoteVolume: 289000000 },
  { symbol: 'ATOM', name: 'Cosmos', pair: 'ATOM/USDT', price: 9.87, change24h: -2.34, high24h: 10.23, low24h: 9.56, volume: '234M', quoteVolume: 234000000 },
  { symbol: 'TRX', name: 'TRON', pair: 'TRX/USDT', price: 0.2567, change24h: 0.89, high24h: 0.2612, low24h: 0.2498, volume: '567M', quoteVolume: 567000000 },
  { symbol: 'ETC', name: 'Ethereum Classic', pair: 'ETC/USDT', price: 28.45, change24h: 2.12, high24h: 29.30, low24h: 27.60, volume: '178M', quoteVolume: 178000000 },
  { symbol: 'XLM', name: 'Stellar', pair: 'XLM/USDT', price: 0.4523, change24h: 3.67, high24h: 0.4689, low24h: 0.4345, volume: '298M', quoteVolume: 298000000 },
  { symbol: 'NEAR', name: 'NEAR Protocol', pair: 'NEAR/USDT', price: 5.67, change24h: 5.89, high24h: 5.98, low24h: 5.32, volume: '345M', quoteVolume: 345000000 },
  { symbol: 'APT', name: 'Aptos', pair: 'APT/USDT', price: 12.34, change24h: -1.56, high24h: 12.89, low24h: 11.98, volume: '256M', quoteVolume: 256000000 },
  { symbol: 'FIL', name: 'Filecoin', pair: 'FIL/USDT', price: 6.78, change24h: 2.34, high24h: 7.12, low24h: 6.45, volume: '189M', quoteVolume: 189000000 },
  { symbol: 'ARB', name: 'Arbitrum', pair: 'ARB/USDT', price: 1.23, change24h: 4.78, high24h: 1.29, low24h: 1.16, volume: '312M', quoteVolume: 312000000 },
  { symbol: 'OP', name: 'Optimism', pair: 'OP/USDT', price: 2.45, change24h: 3.21, high24h: 2.56, low24h: 2.34, volume: '234M', quoteVolume: 234000000 },
  { symbol: 'INJ', name: 'Injective', pair: 'INJ/USDT', price: 34.56, change24h: 6.78, high24h: 36.20, low24h: 32.10, volume: '278M', quoteVolume: 278000000 },
  { symbol: 'HBAR', name: 'Hedera', pair: 'HBAR/USDT', price: 0.3123, change24h: 2.89, high24h: 0.3234, low24h: 0.3012, volume: '198M', quoteVolume: 198000000 },
  { symbol: 'VET', name: 'VeChain', pair: 'VET/USDT', price: 0.0534, change24h: -0.56, high24h: 0.0556, low24h: 0.0512, volume: '145M', quoteVolume: 145000000 },
  { symbol: 'ALGO', name: 'Algorand', pair: 'ALGO/USDT', price: 0.4567, change24h: 1.23, high24h: 0.4678, low24h: 0.4423, volume: '134M', quoteVolume: 134000000 },
  { symbol: 'GRT', name: 'The Graph', pair: 'GRT/USDT', price: 0.2345, change24h: 5.67, high24h: 0.2456, low24h: 0.2198, volume: '167M', quoteVolume: 167000000 },
  { symbol: 'SAND', name: 'The Sandbox', pair: 'SAND/USDT', price: 0.6789, change24h: 3.45, high24h: 0.7012, low24h: 0.6534, volume: '123M', quoteVolume: 123000000 },
  { symbol: 'MANA', name: 'Decentraland', pair: 'MANA/USDT', price: 0.5678, change24h: 2.34, high24h: 0.5890, low24h: 0.5456, volume: '112M', quoteVolume: 112000000 },
  { symbol: 'AAVE', name: 'Aave', pair: 'AAVE/USDT', price: 312.45, change24h: 4.56, high24h: 325.00, low24h: 298.00, volume: '189M', quoteVolume: 189000000 },
  { symbol: 'MKR', name: 'Maker', pair: 'MKR/USDT', price: 1876.54, change24h: 1.89, high24h: 1920.00, low24h: 1834.00, volume: '78M', quoteVolume: 78000000 },
  { symbol: 'RUNE', name: 'THORChain', pair: 'RUNE/USDT', price: 6.78, change24h: 7.89, high24h: 7.23, low24h: 6.23, volume: '145M', quoteVolume: 145000000 },
  { symbol: 'FTM', name: 'Fantom', pair: 'FTM/USDT', price: 1.12, change24h: 5.67, high24h: 1.19, low24h: 1.04, volume: '234M', quoteVolume: 234000000 },
  { symbol: 'SUI', name: 'Sui', pair: 'SUI/USDT', price: 4.56, change24h: 7.89, high24h: 4.89, low24h: 4.18, volume: '456M', quoteVolume: 456000000 },
  { symbol: 'SEI', name: 'Sei', pair: 'SEI/USDT', price: 0.5678, change24h: 5.67, high24h: 0.6012, low24h: 0.5312, volume: '234M', quoteVolume: 234000000 },
  { symbol: 'TIA', name: 'Celestia', pair: 'TIA/USDT', price: 6.78, change24h: 4.34, high24h: 7.12, low24h: 6.45, volume: '178M', quoteVolume: 178000000 },
  { symbol: 'WIF', name: 'dogwifhat', pair: 'WIF/USDT', price: 2.12, change24h: 12.34, high24h: 2.34, low24h: 1.86, volume: '567M', quoteVolume: 567000000 },
  { symbol: 'BONK', name: 'Bonk', pair: 'BONK/USDT', price: 0.00002345, change24h: 15.67, high24h: 0.00002678, low24h: 0.00001989, volume: '345M', quoteVolume: 345000000 },
  { symbol: 'PEPE', name: 'Pepe', pair: 'PEPE/USDT', price: 0.00001234, change24h: 18.90, high24h: 0.00001456, low24h: 0.00001023, volume: '890M', quoteVolume: 890000000 },
  { symbol: 'FLOKI', name: 'Floki', pair: 'FLOKI/USDT', price: 0.0002345, change24h: 10.23, high24h: 0.0002567, low24h: 0.0002112, volume: '234M', quoteVolume: 234000000 },
  { symbol: 'ORDI', name: 'ORDI', pair: 'ORDI/USDT', price: 45.67, change24h: 8.90, high24h: 49.20, low24h: 41.30, volume: '178M', quoteVolume: 178000000 },
  { symbol: 'STX', name: 'Stacks', pair: 'STX/USDT', price: 2.12, change24h: 6.78, high24h: 2.28, low24h: 1.96, volume: '145M', quoteVolume: 145000000 },
  { symbol: 'TON', name: 'Toncoin', pair: 'TON/USDT', price: 5.67, change24h: 3.45, high24h: 5.89, low24h: 5.45, volume: '345M', quoteVolume: 345000000 },
  { symbol: 'TAO', name: 'Bittensor', pair: 'TAO/USDT', price: 456.78, change24h: 5.67, high24h: 478.00, low24h: 432.00, volume: '145M', quoteVolume: 145000000 },
];

// Format volume helper
const formatVolume = (volume: number): string => {
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B';
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M';
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K';
  return volume.toFixed(2);
};

// Format price helper
const formatPrice = (price: number): string => {
  if (price >= 1000) return '$' + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return '$' + price.toFixed(4);
  if (price >= 0.0001) return '$' + price.toFixed(6);
  return '$' + price.toFixed(8);
};

export const MarketsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarketTab, setActiveMarketTab] = useState<'hot' | 'gainers' | 'losers' | 'new'>('hot');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceAnimations, setPriceAnimations] = useState<{[key: string]: 'up' | 'down' | null}>({});
  const itemsPerPage = isMobile ? 15 : 20;

  // Fetch market data
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('API response not ok');
        const tickers = await response.json();

        const usdtPairs = tickers
          .filter((t: any) => t.symbol.endsWith('USDT'))
          .map((t: any) => {
            const symbol = t.symbol.replace('USDT', '');
            const quoteVolume = parseFloat(t.quoteVolume) || 0;
            return {
              symbol,
              name: getCoinName(symbol),
              pair: `${symbol}/USDT`,
              price: parseFloat(t.lastPrice) || 0,
              change24h: parseFloat(t.priceChangePercent) || 0,
              high24h: parseFloat(t.highPrice) || 0,
              low24h: parseFloat(t.lowPrice) || 0,
              volume: formatVolume(quoteVolume),
              quoteVolume,
            };
          })
          .filter((p: MarketData) => p.price > 0 && p.quoteVolume > 10000)
          .sort((a: MarketData, b: MarketData) => b.quoteVolume - a.quoteVolume);

        if (usdtPairs.length > 0) {
          setMarketData(usdtPairs);
        } else {
          throw new Error('No data');
        }
        setLoading(false);
      } catch (error) {
        console.log('Using static market data');
        setMarketData(staticMarketData);
        setLoading(false);
      }
    };

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  // Price animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (marketData.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(marketData.length, 20));
        const symbol = marketData[randomIndex].symbol;
        const direction = Math.random() > 0.5 ? 'up' : 'down';
        setPriceAnimations(prev => ({ ...prev, [symbol]: direction }));
        setTimeout(() => {
          setPriceAnimations(prev => ({ ...prev, [symbol]: null }));
        }, 500);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [marketData.length]);

  // Filter and sort markets
  const filteredMarkets = marketData.filter((market) =>
    market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.pair.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    if (activeMarketTab === 'gainers') return b.change24h - a.change24h;
    if (activeMarketTab === 'losers') return a.change24h - b.change24h;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedMarkets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMarkets = sortedMarkets.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeMarketTab]);

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
      {/* Background - Dark mode only */}
      {isDark && <LiquidGlassBackground intensity="low" showOrbs={true} showRings={false} showCubes={false} />}
      {!isDark && <div style={{ position: 'fixed', inset: 0, background: '#ffffff', zIndex: 0, pointerEvents: 'none' }} />}

      {/* Markets Section - Same style as Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Outer border wrapper */}
        <div style={{
          border: isDark ? `2px solid ${colors.glass.border}` : '2px solid #000000',
          borderRadius: '16px',
          padding: '2px',
          background: isDark ? 'transparent' : '#ffffff',
        }}>
          <GlassCard variant="elevated" padding="none">
            <div style={{ padding: isMobile ? '12px' : '16px' }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000' }}>
                    Markets
                  </h2>
                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {(['hot', 'gainers', 'losers', 'new'] as const).map((tab) => (
                      <motion.button
                        key={tab}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveMarketTab(tab)}
                        style={{
                          padding: '6px 12px',
                          background: activeMarketTab === tab ? (isDark ? colors.primary[400] : '#000000') : 'transparent',
                          border: activeMarketTab === tab ? 'none' : `1px solid ${isDark ? colors.glass.border : '#000000'}`,
                          borderRadius: '6px',
                          color: activeMarketTab === tab ? '#ffffff' : (isDark ? colors.text.secondary : '#000000'),
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {tab === 'hot' ? '🔥 Hot' : tab === 'gainers' ? '📈 Gainers' : tab === 'losers' ? '📉 Losers' : '✨ New'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: isDark ? colors.background.card : '#ffffff',
                  border: `1px solid ${isDark ? colors.glass.border : '#000000'}`,
                  borderRadius: '8px',
                  width: isMobile ? '100%' : '240px',
                }}>
                  <Search size={16} color={colors.text.tertiary} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: isDark ? colors.text.primary : '#000000',
                      fontSize: '13px',
                    }}
                  />
                  {searchQuery && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    >
                      <X size={14} color={colors.text.tertiary} />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Table Header - Desktop */}
              {!isMobile && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
                  gap: '10px',
                  padding: '10px 12px',
                  background: isDark ? colors.background.card : '#f3f4f6',
                  borderRadius: '6px',
                  marginBottom: '4px',
                  border: isDark ? 'none' : '1px solid #e5e7eb',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#374151', textTransform: 'uppercase' }}>Pair</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#374151', textTransform: 'uppercase', textAlign: 'right' }}>Price</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#374151', textTransform: 'uppercase', textAlign: 'right' }}>24h</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#374151', textTransform: 'uppercase', textAlign: 'right' }}>High</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#374151', textTransform: 'uppercase', textAlign: 'right' }}>Vol</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#374151', textTransform: 'uppercase', textAlign: 'center' }}>Trade</span>
                </div>
              )}

              {/* Market Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {paginatedMarkets.map((market, index) => (
                  <motion.div
                    key={market.symbol}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      backgroundColor: priceAnimations[market.symbol] === 'up'
                        ? 'rgba(0, 200, 83, 0.12)'
                        : priceAnimations[market.symbol] === 'down'
                          ? 'rgba(255, 71, 87, 0.12)'
                          : 'transparent'
                    }}
                    transition={{ delay: 0.02 * index, backgroundColor: { duration: 0.3 } }}
                    whileHover={{ background: isDark ? colors.background.hover : '#f9fafb', scale: 1.002 }}
                    onClick={() => navigate(`/trade/${market.symbol.toLowerCase()}`)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr auto' : '2fr 1fr 1fr 1fr 1fr 80px',
                      gap: isMobile ? '6px' : '10px',
                      alignItems: 'center',
                      padding: isMobile ? '10px 8px' : '10px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Pair Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CryptoIcon symbol={market.symbol} size={isMobile ? 28 : 32} />
                      <div>
                        <p style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000' }}>
                          {market.pair}
                        </p>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary }}>{market.name}</p>
                      </div>
                    </div>

                    {/* Price - Desktop */}
                    {!isMobile && (
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isDark ? colors.text.primary : '#000000',
                        fontFamily: "'JetBrains Mono', monospace",
                        textAlign: 'right',
                      }}>
                        {formatPrice(market.price)}
                      </p>
                    )}

                    {/* 24h Change */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        padding: '4px 8px',
                        background: market.change24h >= 0 ? colors.trading.buyBg : colors.trading.sellBg,
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: market.change24h >= 0 ? colors.trading.buy : colors.trading.sell,
                      }}>
                        {market.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                      </span>
                      {isMobile && (
                        <p style={{ fontSize: '12px', color: isDark ? colors.text.primary : '#000000', marginTop: '4px', fontWeight: 600 }}>
                          {formatPrice(market.price)}
                        </p>
                      )}
                    </div>

                    {/* High - Desktop */}
                    {!isMobile && (
                      <p style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: colors.text.secondary,
                        fontFamily: "'JetBrains Mono', monospace",
                        textAlign: 'right',
                      }}>
                        {formatPrice(market.high24h)}
                      </p>
                    )}

                    {/* Volume - Desktop */}
                    {!isMobile && (
                      <p style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: colors.text.secondary,
                        fontFamily: "'JetBrains Mono', monospace",
                        textAlign: 'right',
                      }}>
                        ${market.volume}
                      </p>
                    )}

                    {/* Trade Button - Desktop */}
                    {!isMobile && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.stopPropagation(); navigate(`/trade/${market.symbol.toLowerCase()}`); }}
                          style={{
                            padding: '6px 14px',
                            background: colors.gradients.primarySolid,
                            border: 'none',
                            borderRadius: '6px',
                            color: colors.background.primary,
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Trade
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  padding: '0 4px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}>
                  <span style={{ fontSize: '12px', color: colors.text.tertiary }}>
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedMarkets.length)} of {sortedMarkets.length}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: `1px solid ${isDark ? colors.glass.border : '#000000'}`,
                        background: 'transparent',
                        color: currentPage === 1 ? colors.text.muted : (isDark ? colors.text.secondary : '#000000'),
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 1 ? 0.5 : 1,
                      }}
                    >
                      Prev
                    </motion.button>
                    <span style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isDark ? colors.text.primary : '#000000',
                    }}>
                      {currentPage} / {totalPages}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: `1px solid ${isDark ? colors.glass.border : '#000000'}`,
                        background: 'transparent',
                        color: currentPage === totalPages ? colors.text.muted : (isDark ? colors.text.secondary : '#000000'),
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                      }}
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </ResponsiveLayout>
  );
};

export default MarketsScreen;
