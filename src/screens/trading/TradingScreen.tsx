import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, ChevronDown, Search, ArrowUp, ArrowDown, Loader2, Sun, Moon, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useThemeMode } from '../../theme';
import { spotTradingService, balanceService, tokenManager } from '../../services';
import type { SpotOrder } from '../../services/spotTradingService';
import { getActivePairs, getPairBySymbol, getBinanceSymbol, type TradingPairConfig } from '../../config/tradingPairs';

// Backend API URL for Binance proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend.crymadx.io';

// ============================================
// TYPES
// ============================================
interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  baseName: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
  quoteVolume: number;
  // Reference to config for ChangeNow execution
  config: TradingPairConfig;
  // Binance symbol for price feed (may differ from symbol)
  binanceSymbol: string | null;
  // TradingView symbol for charts (e.g., "BINANCE:BTCUSDT" or "COINBASE:ARBUSD")
  tradingViewSymbol: string;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface Trade {
  price: number;
  amount: number;
  time: string;
  side: 'buy' | 'sell';
}

// ============================================
// COIN LOGO HELPER
// ============================================
const getCoinLogo = (symbol: string): string => {
  const s = symbol.toLowerCase();
  // Use multiple CDN sources for better coverage
  return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${s}.png`;
};

const CoinLogo: React.FC<{ symbol: string; size?: number }> = ({ symbol, size = 24 }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fallbackSrc = `https://ui-avatars.com/api/?name=${symbol}&background=1e2329&color=eaecef&size=${size * 2}&bold=true&length=3`;

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      background: '#2b3139',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <img
        src={error ? fallbackSrc : getCoinLogo(symbol)}
        alt={symbol}
        width={size}
        height={size}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        style={{
          objectFit: 'cover',
          opacity: loaded || error ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      />
    </div>
  );
};

// ============================================
// FORMAT HELPERS
// ============================================
const formatPrice = (price: number): string => {
  if (price >= 1000) return price.toFixed(2);
  if (price >= 1) return price.toFixed(4);
  if (price >= 0.0001) return price.toFixed(6);
  return price.toFixed(8);
};

const formatAmount = (amount: number): string => amount.toFixed(5);

const formatVolume = (volume: number): string => {
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B';
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M';
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K';
  return volume.toFixed(2);
};

// ============================================
// MAIN TRADING SCREEN
// ============================================
export const TradingScreen: React.FC = () => {
  const { pair } = useParams<{ pair: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme, colors: themeColors } = useThemeMode();

  // State
  const [allPairs, setAllPairs] = useState<TradingPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [showPairDropdown, setShowPairDropdown] = useState(false);
  const [pairSearch, setPairSearch] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('tradingFavorites');
    return saved ? JSON.parse(saved) : ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
  });
  const [orderBook, setOrderBook] = useState<{ asks: OrderBookEntry[]; bids: OrderBookEntry[] }>({ asks: [], bids: [] });
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPairs, setLoadingPairs] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Real balances
  const [quoteBalance, setQuoteBalance] = useState<number>(0);
  const [baseBalance, setBaseBalance] = useState<number>(0);
  const [loadingBalances, setLoadingBalances] = useState(false);

  // Order state
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [openOrders, setOpenOrders] = useState<SpotOrder[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Chain selection state - for explicit network selection
  const [fromChain, setFromChain] = useState<string>('matic'); // Default to Polygon for USDC
  const [toChain, setToChain] = useState<string>('arbitrum'); // Default to Arbitrum
  const [showFromChainDropdown, setShowFromChainDropdown] = useState(false);
  const [showToChainDropdown, setShowToChainDropdown] = useState(false);

  // Available chains for selection
  const availableChains = [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH' },
    { id: 'matic', name: 'Polygon', symbol: 'MATIC' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB' },
    { id: 'base', name: 'Base', symbol: 'BASE' },
    { id: 'op', name: 'Optimism', symbol: 'OP' },
    { id: 'bsc', name: 'BNB Chain', symbol: 'BNB' },
    { id: 'avaxc', name: 'Avalanche', symbol: 'AVAX' },
    { id: 'sol', name: 'Solana', symbol: 'SOL' },
    { id: 'trx', name: 'Tron', symbol: 'TRX' },
  ];

  const chartRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // WebSocket refs removed - using polling instead due to network restrictions

  // Colors
  const colors = {
    bg: isDark ? '#0b0e11' : '#ffffff',
    cardBg: isDark ? '#1e2329' : '#ffffff',
    panelBg: isDark ? '#181a20' : '#fafafa',
    border: isDark ? '#2b3139' : '#eaecef',
    text: isDark ? '#eaecef' : '#1e2329',
    textSecondary: isDark ? '#848e9c' : '#707a8a',
    green: '#0ecb81',
    red: '#f6465d',
    greenBg: isDark ? 'rgba(14, 203, 129, 0.1)' : 'rgba(14, 203, 129, 0.1)',
    redBg: isDark ? 'rgba(246, 70, 93, 0.1)' : 'rgba(246, 70, 93, 0.1)',
  };

  // Fetch trading pairs from our config + Binance price data
  useEffect(() => {
    const fetchPairs = async () => {
      try {
        setLoadingPairs(true);
        setLoadError(null);

        // Get our configured trading pairs (with ChangeNow mappings)
        const configuredPairs = getActivePairs();

        // Get Binance ticker data for price feeds
        const tickersRes = await fetch(`${API_BASE_URL}/api/binance/ticker/24hr`);

        if (!tickersRes.ok) {
          throw new Error('Failed to fetch market data');
        }

        const tickers = await tickersRes.json();

        // Create a map of Binance ticker data
        const tickerMap = new Map<string, any>();
        tickers.forEach((t: any) => tickerMap.set(t.symbol, t));

        // Build trading pairs from our config, enriched with Binance price data
        const tradingPairs: TradingPair[] = configuredPairs.map((config) => {
          // Get Binance ticker data if available
          const binanceSymbol = config.binanceSymbol;
          const ticker = binanceSymbol ? tickerMap.get(binanceSymbol) : null;

          // TradingView symbol - use config if specified, otherwise default to Binance
          const tradingViewSymbol = config.tradingViewSymbol ||
            (binanceSymbol ? `BINANCE:${binanceSymbol}` : `BINANCE:${config.symbol}`);

          return {
            symbol: config.symbol,
            baseAsset: config.baseAsset,
            quoteAsset: config.quoteAsset,
            baseName: config.baseName,
            price: ticker ? parseFloat(ticker.lastPrice) || 0 : 0,
            change: ticker ? parseFloat(ticker.priceChangePercent) || 0 : 0,
            high: ticker ? parseFloat(ticker.highPrice) || 0 : 0,
            low: ticker ? parseFloat(ticker.lowPrice) || 0 : 0,
            volume: ticker ? parseFloat(ticker.volume) || 0 : 0,
            quoteVolume: ticker ? parseFloat(ticker.quoteVolume) || 0 : 0,
            config,
            binanceSymbol,
            tradingViewSymbol,
          };
        })
        // Filter out pairs without price data (Binance doesn't have them)
        .filter((p) => p.price > 0)
        // Sort by volume
        .sort((a, b) => b.quoteVolume - a.quoteVolume);

        if (tradingPairs.length === 0) {
          throw new Error('No trading pairs available');
        }

        setAllPairs(tradingPairs);

        // Set default or URL-based pair
        const urlSymbol = pair?.toUpperCase().replace('_', '');
        const foundPair = tradingPairs.find((p) => p.symbol === urlSymbol) || tradingPairs[0];
        setSelectedPair(foundPair);
        setLoadingPairs(false);
      } catch (error) {
        console.error('Failed to fetch pairs:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load market data. Please try again.');
        setLoadingPairs(false);
      }
    };

    fetchPairs();
  }, []);

  // Update pair from URL
  useEffect(() => {
    if (pair && allPairs.length > 0) {
      const urlSymbol = pair.toUpperCase().replace('_', '');
      const found = allPairs.find(p => p.symbol === urlSymbol);
      if (found) setSelectedPair(found);
    }
  }, [pair, allPairs]);

  // Polling for price updates (since WebSocket is blocked)
  useEffect(() => {
    if (!selectedPair || !selectedPair.binanceSymbol) return;

    const fetchTicker = async () => {
      try {
        // Use binanceSymbol for API call (may differ from our internal symbol)
        const res = await fetch(`${API_BASE_URL}/api/binance/ticker/24hr?symbol=${selectedPair.binanceSymbol}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedPair(prev => prev ? {
            ...prev,
            price: parseFloat(data.lastPrice),
            change: parseFloat(data.priceChangePercent),
            high: parseFloat(data.highPrice),
            low: parseFloat(data.lowPrice),
            volume: parseFloat(data.volume),
            quoteVolume: parseFloat(data.quoteVolume),
          } : null);
        }
      } catch (error) {
        console.error('Failed to fetch ticker:', error);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(fetchTicker, 5000);

    return () => clearInterval(interval);
  }, [selectedPair?.binanceSymbol]);

  // Polling for order book depth (since WebSocket is blocked)
  useEffect(() => {
    if (!selectedPair || !selectedPair.binanceSymbol) return;

    const fetchDepth = async () => {
      try {
        // Use binanceSymbol for API call
        const res = await fetch(`${API_BASE_URL}/api/binance/depth?symbol=${selectedPair.binanceSymbol}&limit=15`);
        if (res.ok) {
          const data = await res.json();
          const asks = data.asks.map(([price, amount]: [string, string]) => ({
            price: parseFloat(price),
            amount: parseFloat(amount),
            total: parseFloat(price) * parseFloat(amount),
          })).reverse();

          const bids = data.bids.map(([price, amount]: [string, string]) => ({
            price: parseFloat(price),
            amount: parseFloat(amount),
            total: parseFloat(price) * parseFloat(amount),
          }));

          setOrderBook({ asks, bids });
        }
      } catch (error) {
        console.error('Failed to fetch depth:', error);
      }
    };

    // Fetch immediately
    fetchDepth();

    // Poll every 3 seconds
    const interval = setInterval(fetchDepth, 3000);

    return () => clearInterval(interval);
  }, [selectedPair?.binanceSymbol]);

  // Polling for recent trades (since WebSocket is blocked)
  useEffect(() => {
    if (!selectedPair || !selectedPair.binanceSymbol) return;

    const fetchTrades = async () => {
      try {
        // Use binanceSymbol for API call
        const res = await fetch(`${API_BASE_URL}/api/binance/trades?symbol=${selectedPair.binanceSymbol}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          const trades = data.map((t: any) => ({
            price: parseFloat(t.price),
            amount: parseFloat(t.qty),
            time: new Date(t.time).toLocaleTimeString(),
            side: t.isBuyerMaker ? 'sell' : 'buy',
          })).reverse();
          setRecentTrades(trades);
        }
      } catch (error) {
        console.error('Failed to fetch trades:', error);
      }
    };

    // Fetch immediately
    fetchTrades();

    // Poll every 3 seconds
    const interval = setInterval(fetchTrades, 3000);

    return () => clearInterval(interval);
  }, [selectedPair?.binanceSymbol]);

  // Fetch real balances when pair changes
  const fetchBalances = useCallback(async () => {
    if (!selectedPair) return;

    // Check if user is logged in
    if (!tokenManager.isAuthenticated()) {
      setQuoteBalance(0);
      setBaseBalance(0);
      return;
    }

    try {
      setLoadingBalances(true);
      const balances = await balanceService.getAllBalances();

      // Find balances for current pair assets
      const quoteAsset = selectedPair.quoteAsset;
      const baseAsset = selectedPair.baseAsset;

      let quoteBal = 0;
      let baseBal = 0;

      // Sum up balances across all chains for each asset
      balances.forEach(balance => {
        if (balance.currency.toUpperCase() === quoteAsset) {
          quoteBal += parseFloat(balance.available) || 0;
        }
        if (balance.currency.toUpperCase() === baseAsset) {
          baseBal += parseFloat(balance.available) || 0;
        }
      });

      setQuoteBalance(quoteBal);
      setBaseBalance(baseBal);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      setQuoteBalance(0);
      setBaseBalance(0);
    } finally {
      setLoadingBalances(false);
    }
  }, [selectedPair?.quoteAsset, selectedPair?.baseAsset]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Fetch open orders when authenticated
  useEffect(() => {
    const fetchOpenOrders = async () => {
      if (!tokenManager.isAuthenticated()) {
        setOpenOrders([]);
        return;
      }

      try {
        const { orders } = await spotTradingService.getOpenOrders();
        setOpenOrders(orders || []);
      } catch (error) {
        console.error('Failed to fetch open orders:', error);
      }
    };

    fetchOpenOrders();
    // Poll for order updates every 10 seconds
    const interval = setInterval(fetchOpenOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update price input when pair changes
  useEffect(() => {
    if (selectedPair) {
      setPrice(formatPrice(selectedPair.price));
      setIsFavorite(favorites.includes(selectedPair.symbol));
    }
  }, [selectedPair?.symbol, favorites]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPairDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load TradingView chart
  useEffect(() => {
    if (!chartRef.current || !selectedPair) return;

    // Use tradingViewSymbol for chart (can be Binance, Coinbase, etc.)
    const currentSymbol = selectedPair.tradingViewSymbol;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: currentSymbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: isDark ? 'dark' : 'light',
      style: '1',
      locale: 'en',
      allow_symbol_change: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
    });

    chartRef.current.innerHTML = '';
    chartRef.current.appendChild(script);
  }, [selectedPair?.tradingViewSymbol, isDark]);

  // Handle pair selection
  const handlePairSelect = (newPair: TradingPair) => {
    setSelectedPair(newPair);
    setShowPairDropdown(false);
    navigate(`/trade/${newPair.baseAsset.toLowerCase()}${newPair.quoteAsset.toLowerCase()}`);
  };

  // Toggle favorite
  const toggleFavorite = () => {
    if (!selectedPair) return;

    setFavorites(prev => {
      const newFavs = prev.includes(selectedPair.symbol)
        ? prev.filter(s => s !== selectedPair.symbol)
        : [...prev, selectedPair.symbol];
      localStorage.setItem('tradingFavorites', JSON.stringify(newFavs));
      return newFavs;
    });
    setIsFavorite(!isFavorite);
  };

  // Handle slider
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    const balance = activeTab === 'buy' ? quoteBalance : baseBalance;
    if (activeTab === 'buy' && parseFloat(price) > 0) {
      setAmount(((balance * value / 100) / parseFloat(price)).toFixed(6));
    } else {
      setAmount((balance * value / 100).toFixed(6));
    }
  };

  // Handle order submit
  const handleSubmit = async () => {
    if (!amount || !selectedPair) return;

    // Clear previous messages
    setOrderError(null);
    setOrderSuccess(null);

    // Check if user is authenticated
    if (!tokenManager.isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setOrderError('Please enter a valid amount');
      return;
    }

    // Validate price for limit orders
    if (orderType === 'limit') {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        setOrderError('Please enter a valid price');
        return;
      }
    }

    // Check balance
    const requiredBalance = activeTab === 'buy'
      ? amountNum * (orderType === 'limit' ? parseFloat(price) : selectedPair.price)
      : amountNum;
    const availableBalance = activeTab === 'buy' ? quoteBalance : baseBalance;

    if (requiredBalance > availableBalance) {
      setOrderError(`Insufficient ${activeTab === 'buy' ? selectedPair.quoteAsset : selectedPair.baseAsset} balance`);
      return;
    }

    setLoading(true);

    try {
      const { order } = await spotTradingService.createOrder({
        baseAsset: selectedPair.baseAsset,
        quoteAsset: selectedPair.quoteAsset,
        side: activeTab,
        orderType: orderType,
        amount: amount,
        price: orderType === 'limit' ? price : undefined,
        // Pass explicit chain selection from user
        fromChain: fromChain,
        toChain: toChain,
      });

      // Show success message
      const orderTypeText = orderType === 'market' ? 'Market' : 'Limit';
      const sideText = activeTab === 'buy' ? 'Buy' : 'Sell';
      setOrderSuccess(`${orderTypeText} ${sideText} order placed successfully!`);

      // Reset form
      setAmount('');
      setSliderValue(0);

      // Refresh balances
      fetchBalances();

      // Add to open orders if limit order
      if (orderType === 'limit' && order) {
        setOpenOrders(prev => [order, ...prev]);
      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => setOrderSuccess(null), 5000);

    } catch (error: any) {
      console.error('Order failed:', error);
      setOrderError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      await spotTradingService.cancelOrder(orderId);
      setOpenOrders(prev => prev.filter(o => o.orderId !== orderId));
      setOrderSuccess('Order cancelled successfully');
      fetchBalances();
      setTimeout(() => setOrderSuccess(null), 3000);
    } catch (error: any) {
      setOrderError(error.message || 'Failed to cancel order');
    }
  };

  // Calculate total
  const total = useMemo(() => {
    const p = parseFloat(price) || 0;
    const a = parseFloat(amount) || 0;
    return (p * a).toFixed(2);
  }, [price, amount]);

  // Filtered pairs for dropdown
  const filteredPairs = useMemo(() => {
    return allPairs.filter(p =>
      p.symbol.toLowerCase().includes(pairSearch.toLowerCase()) ||
      p.baseAsset.toLowerCase().includes(pairSearch.toLowerCase())
    ).slice(0, 50); // Limit to 50 for performance
  }, [allPairs, pairSearch]);

  // Max total for depth bars
  const maxTotal = useMemo(() => {
    const allTotals = [...orderBook.asks, ...orderBook.bids].map(o => o.total);
    return Math.max(...allTotals, 1);
  }, [orderBook]);

  if (loadingPairs) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <Loader2 size={40} color={colors.green} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ color: colors.textSecondary }}>Loading markets...</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (loadError || !selectedPair) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: colors.redBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '32px' }}>!</span>
        </div>
        <span style={{ color: colors.text, fontSize: '18px', fontWeight: 600 }}>
          Unable to Load Trading Data
        </span>
        <span style={{ color: colors.textSecondary, textAlign: 'center', maxWidth: '400px' }}>
          {loadError || 'Could not connect to market data. This may be due to network restrictions or Binance API availability in your region.'}
        </span>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '8px',
            padding: '12px 24px',
            background: colors.green,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
        <button
          onClick={() => navigate('/markets')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            color: colors.textSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Go to Markets
        </button>
      </div>
    );
  }

  const base = selectedPair.baseAsset;
  const quote = selectedPair.quoteAsset;

  // Navigation links matching HomePage
  const navLinks = [
    { label: 'Buy Crypto', href: '/p2p' },
    { label: 'Markets', href: '/markets' },
    { label: 'Trade', href: '/trade' },
    { label: 'Swap', href: '/wallet/convert' },
    { label: 'Earn', href: '/earn' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* ========== MAIN NAVIGATION HEADER ========== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: `1px solid ${colors.border}`,
        background: colors.cardBg,
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <img
            src="/crymadx-logo.png"
            alt="CrymadX"
            style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Navigation Links - matching HomePage style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href ||
              (link.label === 'Trade' && location.pathname.startsWith('/trade')) ||
              (link.label === 'Swap' && location.pathname === '/wallet/convert');
            return (
              <div
                key={link.label}
                onClick={() => navigate(link.href)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: isActive
                    ? isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16, 185, 129, 0.08)'
                    : 'transparent',
                  color: isActive
                    ? isDark ? '#ffffff' : '#059669'
                    : isDark ? 'rgba(255,255,255,0.85)' : '#374151',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16, 185, 129, 0.08)';
                    e.currentTarget.style.color = isDark ? '#ffffff' : '#059669';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.85)' : '#374151';
                  }
                }}
              >
                {link.label}
              </div>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <div
          onClick={toggleTheme}
          style={{
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </div>
      </div>

      {/* ========== TRADING HEADER ========== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderBottom: `1px solid ${colors.border}`,
        background: colors.cardBg,
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        {/* Pair Selector */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setShowPairDropdown(!showPairDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '4px',
              background: showPairDropdown ? colors.panelBg : 'transparent',
            }}
          >
            <Star
              size={16}
              fill={isFavorite ? '#f0b90b' : 'none'}
              color={isFavorite ? '#f0b90b' : colors.textSecondary}
              style={{ cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
            />
            <CoinLogo symbol={base} size={24} />
            <span style={{ fontSize: '18px', fontWeight: 600, color: colors.text }}>
              {base}/{quote}
            </span>
            <ChevronDown size={16} color={colors.textSecondary} />
          </div>

          {/* Dropdown */}
          {showPairDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              width: '360px',
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: colors.panelBg,
                  borderRadius: '4px',
                }}>
                  <Search size={14} color={colors.textSecondary} />
                  <input
                    type="text"
                    placeholder="Search coin..."
                    value={pairSearch}
                    onChange={(e) => setPairSearch(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: colors.text,
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {filteredPairs.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: colors.textSecondary }}>
                    No pairs found
                  </div>
                ) : (
                  filteredPairs.map((p) => (
                    <div
                      key={p.symbol}
                      onClick={() => handlePairSelect(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        background: p.symbol === selectedPair.symbol ? colors.panelBg : 'transparent',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = colors.panelBg}
                      onMouseLeave={(e) => e.currentTarget.style.background = p.symbol === selectedPair.symbol ? colors.panelBg : 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CoinLogo symbol={p.baseAsset} size={24} />
                        <div>
                          <span style={{ color: colors.text, fontSize: '13px', fontWeight: 600 }}>
                            {p.baseAsset}/{p.quoteAsset}
                          </span>
                          <div style={{ fontSize: '11px', color: colors.textSecondary }}>
                            Vol: {formatVolume(p.quoteVolume)}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: colors.text, fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>
                          {formatPrice(p.price)}
                        </div>
                        <div style={{
                          color: p.change >= 0 ? colors.green : colors.red,
                          fontSize: '12px',
                          fontFamily: "'JetBrains Mono', monospace"
                        }}>
                          {p.change >= 0 ? '+' : ''}{p.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div>
          <div style={{
            fontSize: '24px',
            fontWeight: 600,
            color: selectedPair.change >= 0 ? colors.green : colors.red,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {formatPrice(selectedPair.price)}
          </div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>
            ≈ ${formatPrice(selectedPair.price)} USD
          </div>
        </div>

        {/* 24h Stats */}
        <div style={{ display: 'flex', gap: '32px', marginLeft: 'auto' }}>
          <div>
            <div style={{ fontSize: '11px', color: colors.textSecondary }}>24h Change</div>
            <div style={{
              fontSize: '13px',
              color: selectedPair.change >= 0 ? colors.green : colors.red,
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {selectedPair.change >= 0 ? '+' : ''}{selectedPair.change.toFixed(2)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: colors.textSecondary }}>24h High</div>
            <div style={{ fontSize: '13px', color: colors.text, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
              {formatPrice(selectedPair.high)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: colors.textSecondary }}>24h Low</div>
            <div style={{ fontSize: '13px', color: colors.text, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
              {formatPrice(selectedPair.low)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: colors.textSecondary }}>24h Volume({base})</div>
            <div style={{ fontSize: '13px', color: colors.text, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
              {formatVolume(selectedPair.volume)}
            </div>
          </div>
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* LEFT: ORDER BOOK */}
        <div style={{
          width: '280px',
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          background: colors.cardBg,
        }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}` }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Order Book</span>
          </div>

          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            padding: '8px 16px',
            fontSize: '11px',
            color: colors.textSecondary,
          }}>
            <span>Price({quote})</span>
            <span style={{ textAlign: 'right' }}>Amount({base})</span>
            <span style={{ textAlign: 'right' }}>Total</span>
          </div>

          {/* Asks */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {orderBook.asks.map((order, i) => (
              <div key={`ask-${i}`} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '4px 16px',
                fontSize: '12px',
                position: 'relative',
                cursor: 'pointer',
              }}>
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(order.total / maxTotal) * 100}%`,
                  background: colors.redBg,
                }} />
                <span style={{ color: colors.red, position: 'relative', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatPrice(order.price)}
                </span>
                <span style={{ textAlign: 'right', color: colors.text, position: 'relative', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatAmount(order.amount)}
                </span>
                <span style={{ textAlign: 'right', color: colors.text, position: 'relative', fontFamily: "'JetBrains Mono', monospace" }}>
                  {order.total.toFixed(2)}
                </span>
              </div>
            ))}

            {/* Mid Price */}
            <div style={{
              padding: '12px 16px',
              borderTop: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`,
              background: colors.panelBg,
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: selectedPair.change >= 0 ? colors.green : colors.red,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {formatPrice(selectedPair.price)}
                {selectedPair.change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              </span>
            </div>

            {/* Bids */}
            {orderBook.bids.map((order, i) => (
              <div key={`bid-${i}`} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '4px 16px',
                fontSize: '12px',
                position: 'relative',
                cursor: 'pointer',
              }}>
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: `${(order.total / maxTotal) * 100}%`,
                  background: colors.greenBg,
                }} />
                <span style={{ color: colors.green, position: 'relative', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatPrice(order.price)}
                </span>
                <span style={{ textAlign: 'right', color: colors.text, position: 'relative', fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatAmount(order.amount)}
                </span>
                <span style={{ textAlign: 'right', color: colors.text, position: 'relative', fontFamily: "'JetBrains Mono', monospace" }}>
                  {order.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: CHART */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          <div ref={chartRef} style={{ flex: 1, minHeight: 0 }} />
          {/* Hide TradingView watermark with CSS overlay */}
          <style>{`
            .tradingview-widget-copyright { display: none !important; }
            [class*="tv-embed-widget-copyright"] { display: none !important; }
          `}</style>
        </div>

        {/* RIGHT: TRADE PANEL + RECENT TRADES */}
        <div style={{
          width: '320px',
          borderLeft: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          background: colors.cardBg,
        }}>
          {/* Trade Form */}
          <div style={{ padding: '16px', borderBottom: `1px solid ${colors.border}` }}>
            {/* Buy/Sell Tabs */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <button
                onClick={() => setActiveTab('buy')}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  background: activeTab === 'buy' ? colors.green : 'transparent',
                  color: activeTab === 'buy' ? '#fff' : colors.textSecondary,
                  borderRadius: '4px 0 0 4px',
                }}
              >
                BUY
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  background: activeTab === 'sell' ? colors.red : 'transparent',
                  color: activeTab === 'sell' ? '#fff' : colors.textSecondary,
                  borderRadius: '0 4px 4px 0',
                }}
              >
                SELL
              </button>
            </div>

            {/* Order Type */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              {(['limit', 'market'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: orderType === type ? colors.text : colors.textSecondary,
                    borderBottom: orderType === type ? `2px solid ${activeTab === 'buy' ? colors.green : colors.red}` : '2px solid transparent',
                    paddingBottom: '4px',
                    textTransform: 'capitalize',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Chain Selectors - From and To */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* From Chain */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>
                    {activeTab === 'buy' ? 'Pay From' : 'Sell From'}
                  </div>
                  <button
                    onClick={() => {
                      setShowFromChainDropdown(!showFromChainDropdown);
                      setShowToChainDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: colors.panelBg,
                      border: `1px solid ${showFromChainDropdown ? (activeTab === 'buy' ? colors.green : colors.red) : colors.border}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: colors.text,
                      fontSize: '12px',
                    }}
                  >
                    <span>{availableChains.find(c => c.id === fromChain)?.name || fromChain}</span>
                    <ChevronDown size={14} color={colors.textSecondary} />
                  </button>
                  {showFromChainDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '4px',
                      marginTop: '4px',
                      maxHeight: '150px',
                      overflowY: 'auto',
                      zIndex: 100,
                    }}>
                      {availableChains.map(chain => (
                        <div
                          key={chain.id}
                          onClick={() => {
                            setFromChain(chain.id);
                            setShowFromChainDropdown(false);
                          }}
                          style={{
                            padding: '8px 10px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: fromChain === chain.id ? (activeTab === 'buy' ? colors.green : colors.red) : colors.text,
                            background: fromChain === chain.id ? colors.panelBg : 'transparent',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = colors.panelBg}
                          onMouseLeave={(e) => e.currentTarget.style.background = fromChain === chain.id ? colors.panelBg : 'transparent'}
                        >
                          {chain.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* To Chain */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>
                    Receive On
                  </div>
                  <button
                    onClick={() => {
                      setShowToChainDropdown(!showToChainDropdown);
                      setShowFromChainDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: colors.panelBg,
                      border: `1px solid ${showToChainDropdown ? (activeTab === 'buy' ? colors.green : colors.red) : colors.border}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: colors.text,
                      fontSize: '12px',
                    }}
                  >
                    <span>{availableChains.find(c => c.id === toChain)?.name || toChain}</span>
                    <ChevronDown size={14} color={colors.textSecondary} />
                  </button>
                  {showToChainDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '4px',
                      marginTop: '4px',
                      maxHeight: '150px',
                      overflowY: 'auto',
                      zIndex: 100,
                    }}>
                      {availableChains.map(chain => (
                        <div
                          key={chain.id}
                          onClick={() => {
                            setToChain(chain.id);
                            setShowToChainDropdown(false);
                          }}
                          style={{
                            padding: '8px 10px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: toChain === chain.id ? (activeTab === 'buy' ? colors.green : colors.red) : colors.text,
                            background: toChain === chain.id ? colors.panelBg : 'transparent',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = colors.panelBg}
                          onMouseLeave={(e) => e.currentTarget.style.background = toChain === chain.id ? colors.panelBg : 'transparent'}
                        >
                          {chain.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Input */}
            {orderType === 'limit' && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Price</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: colors.panelBg,
                  borderRadius: '4px',
                  padding: '8px 12px',
                }}>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: colors.text,
                      fontSize: '14px',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  />
                  <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{quote}</span>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Amount</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: colors.panelBg,
                borderRadius: '4px',
                padding: '8px 12px',
              }}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: colors.text,
                    fontSize: '14px',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                />
                <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{base}</span>
              </div>
            </div>

            {/* Slider */}
            <div style={{ marginBottom: '12px' }}>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: activeTab === 'buy' ? colors.green : colors.red }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: colors.textSecondary }}>
                {[0, 25, 50, 75, 100].map((v) => (
                  <span key={v} onClick={() => handleSliderChange(v)} style={{ cursor: 'pointer' }}>{v}%</span>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>Total</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: colors.panelBg,
                borderRadius: '4px',
                padding: '8px 12px',
              }}>
                <span style={{ flex: 1, color: colors.text, fontSize: '14px', fontFamily: "'JetBrains Mono', monospace" }}>{total}</span>
                <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{quote}</span>
              </div>
            </div>

            {/* Balance */}
            <div style={{ marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: colors.textSecondary }}>Available</span>
                <span style={{ color: colors.text, fontFamily: "'JetBrains Mono', monospace" }}>
                  {loadingBalances ? (
                    <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : tokenManager.isAuthenticated() ? (
                    activeTab === 'buy' ? `${quoteBalance.toFixed(2)} ${quote}` : `${baseBalance.toFixed(6)} ${base}`
                  ) : (
                    <span style={{ color: colors.textSecondary }}>Login to view</span>
                  )}
                </span>
              </div>
            </div>

            {/* Order Error */}
            {orderError && (
              <div style={{
                marginBottom: '12px',
                padding: '10px 12px',
                background: 'rgba(246, 70, 93, 0.1)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <AlertCircle size={16} color={colors.red} />
                <span style={{ color: colors.red, fontSize: '12px', flex: 1 }}>{orderError}</span>
                <X
                  size={14}
                  color={colors.red}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOrderError(null)}
                />
              </div>
            )}

            {/* Order Success */}
            {orderSuccess && (
              <div style={{
                marginBottom: '12px',
                padding: '10px 12px',
                background: 'rgba(14, 203, 129, 0.1)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <CheckCircle size={16} color={colors.green} />
                <span style={{ color: colors.green, fontSize: '12px', flex: 1 }}>{orderSuccess}</span>
                <X
                  size={14}
                  color={colors.green}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOrderSuccess(null)}
                />
              </div>
            )}

            {/* Login Prompt */}
            {showLoginPrompt && (
              <div style={{
                marginBottom: '12px',
                padding: '12px',
                background: colors.panelBg,
                borderRadius: '4px',
                textAlign: 'center',
              }}>
                <p style={{ color: colors.text, fontSize: '13px', marginBottom: '12px' }}>
                  Please login to start trading
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: colors.green,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'transparent',
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Register
                  </button>
                </div>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  style={{
                    marginTop: '8px',
                    background: 'none',
                    border: 'none',
                    color: colors.textSecondary,
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !amount}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '4px',
                cursor: loading || !amount ? 'not-allowed' : 'pointer',
                opacity: loading || !amount ? 0.6 : 1,
                background: activeTab === 'buy' ? colors.green : colors.red,
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {activeTab === 'buy' ? `Buy ${base}` : `Sell ${base}`}
            </button>

            {/* Open Orders Section */}
            {openOrders.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
                  Open Orders ({openOrders.length})
                </div>
                {openOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.orderId}
                    style={{
                      padding: '8px',
                      marginBottom: '6px',
                      background: colors.panelBg,
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: order.side === 'buy' ? colors.green : colors.red, fontWeight: 600 }}>
                        {order.side.toUpperCase()} {order.baseAsset}
                      </span>
                      <X
                        size={12}
                        color={colors.textSecondary}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCancelOrder(order.orderId)}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textSecondary }}>
                      <span>Price: {order.price}</span>
                      <span>Amt: {parseFloat(order.amount).toFixed(6)}</span>
                    </div>
                    <div style={{
                      marginTop: '4px',
                      color: spotTradingService.getStatusDisplay(order.status).color,
                      fontSize: '10px',
                    }}>
                      {spotTradingService.getStatusDisplay(order.status).text}
                    </div>
                  </div>
                ))}
                {openOrders.length > 3 && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: colors.textSecondary,
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/wallet/history')}
                  >
                    View all {openOrders.length} orders
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Trades */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>Market Trades</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              padding: '8px 16px',
              fontSize: '11px',
              color: colors.textSecondary,
            }}>
              <span>Price({quote})</span>
              <span style={{ textAlign: 'right' }}>Amount({base})</span>
              <span style={{ textAlign: 'right' }}>Time</span>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {recentTrades.map((trade, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  padding: '4px 16px',
                  fontSize: '12px',
                }}>
                  <span style={{ color: trade.side === 'buy' ? colors.green : colors.red, fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatPrice(trade.price)}
                  </span>
                  <span style={{ textAlign: 'right', color: colors.text, fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatAmount(trade.amount)}
                  </span>
                  <span style={{ textAlign: 'right', color: colors.textSecondary }}>{trade.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TradingScreen;
