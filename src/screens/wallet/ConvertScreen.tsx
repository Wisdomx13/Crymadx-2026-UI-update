import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDownUp,
  ChevronDown,
  CheckCircle,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { CryptoIcon, ResponsiveLayout, Button } from '../../components';
import { balanceService, swapService, priceService } from '../../services';
import type { SwapEstimate } from '../../types/api';

interface CryptoAsset {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  chain: string;      // Chain identifier: ETH, TRX, SOL, MATIC, etc.
  network?: string;   // Network display name
}

// Map chain IDs to wallet address column names
const chainToWalletColumn: Record<string, string> = {
  ETH: 'evm_address',
  MATIC: 'evm_address',
  BASE: 'evm_address',
  ARB: 'evm_address',
  OP: 'evm_address',
  AVAX: 'evm_address',
  SOL: 'sol_address',
  BTC: 'btc_address',
  LTC: 'ltc_address',
  DOGE: 'doge_address',
  XRP: 'xrp_address',
  XLM: 'xlm_address',
  BNB: 'bnb_address',
  TRX: 'trx_address',
};

export const ConvertScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useThemeMode();

  // Asset and swap state
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [fromAsset, setFromAsset] = useState<CryptoAsset | null>(null);
  const [toAsset, setToAsset] = useState<CryptoAsset | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // API state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<SwapEstimate | null>(null);
  const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState('');

  // User wallets for destination addresses
  const [userWallets, setUserWallets] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Fetch balances, prices, and user wallets
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [balances, prices, walletsResponse] = await Promise.all([
        balanceService.getAllBalances(),
        priceService.getAllPrices(),
        balanceService.getWallets().catch(() => ({ wallets: [] })),
      ]);

      // Build wallet addresses lookup by chain
      const walletMap: Record<string, string> = {};
      walletsResponse.wallets.forEach((wallet: { chain: string; address: string }) => {
        // Map chain to address (e.g., 'eth' -> '0x...')
        walletMap[wallet.chain.toUpperCase()] = wallet.address;
      });
      setUserWallets(walletMap);

      // Build prices lookup - getAllPrices returns Record<string, PriceData>
      const pricesMap: Record<string, number> = {};
      Object.entries(prices).forEach(([symbol, priceData]) => {
        pricesMap[symbol.toUpperCase()] = priceData.usd;
      });

      // Transform balances to assets
      // balanceService.getAllBalances() returns Balance[] with {currency, available, locked, chain, name, network}
      const transformedAssets: CryptoAsset[] = balances.map((balance) => {
        const price = pricesMap[balance.currency.toUpperCase()] || 0;
        return {
          symbol: balance.currency,
          name: balance.name || balance.currency,
          balance: balance.available,
          price,
          chain: balance.chain || 'ETH',    // Default to ETH if not specified
          network: balance.network || 'Ethereum',
        };
      });

      setAssets(transformedAssets);

      // Set defaults if available
      if (transformedAssets.length > 0) {
        const btc = transformedAssets.find(a => a.symbol === 'BTC');
        const usdt = transformedAssets.find(a => a.symbol === 'USDT');
        setFromAsset(btc || transformedAssets[0]);
        setToAsset(usdt || transformedAssets[1] || transformedAssets[0]);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load assets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Normalize chain ID to uppercase for backend API
  const normalizeChain = (chain: string): string => chain.toUpperCase();

  // Get swap estimate when amount changes
  useEffect(() => {
    if (!fromAsset || !toAsset || !fromAmount || parseFloat(fromAmount) <= 0) {
      setEstimate(null);
      return;
    }

    const getEstimate = async () => {
      setIsLoadingEstimate(true);
      try {
        const response = await swapService.getEstimate({
          fromChain: normalizeChain(fromAsset.chain),
          fromToken: fromAsset.symbol.toUpperCase(),
          toChain: normalizeChain(toAsset.chain),
          toToken: toAsset.symbol.toUpperCase(),
          amount: fromAmount,
        });
        setEstimate(response.estimate);
      } catch (err) {
        // Use local calculation as fallback
        console.log('Using local rate calculation');
        setEstimate(null);
      } finally {
        setIsLoadingEstimate(false);
      }
    };

    const timeoutId = setTimeout(getEstimate, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [fromAsset, toAsset, fromAmount]);

  const exchangeRate = fromAsset && toAsset && fromAsset.price > 0 && toAsset.price > 0
    ? fromAsset.price / toAsset.price
    : 0;

  const toAmount = estimate?.toAmount
    || (fromAmount && exchangeRate > 0 ? (parseFloat(fromAmount) * exchangeRate).toFixed(6) : '');

  const handleSwap = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setFromAmount('');
    setEstimate(null);
  };

  // Get user's wallet address for a specific chain
  const getDestinationAddress = (chain: string): string | null => {
    // Normalize chain to uppercase for lookup
    const normalizedChain = chain.toUpperCase();

    // Direct chain lookup
    if (userWallets[normalizedChain]) {
      return userWallets[normalizedChain];
    }

    // For EVM chains, they share the same address
    const evmChains = ['ETH', 'MATIC', 'BASE', 'ARB', 'OP', 'AVAX', 'BSC'];
    if (evmChains.includes(normalizedChain)) {
      // Find any EVM address
      for (const evmChain of evmChains) {
        if (userWallets[evmChain]) {
          return userWallets[evmChain];
        }
      }
    }
    return null;
  };

  const handleConvert = async () => {
    if (!fromAsset || !toAsset || !fromAmount) return;

    // Validate sufficient balance
    const fromBalance = parseFloat(fromAsset.balance.replace(/,/g, ''));
    const fromAmountNum = parseFloat(fromAmount);
    if (fromAmountNum > fromBalance) {
      setError(`Insufficient balance. You have ${fromAsset.balance} ${fromAsset.symbol} available.`);
      return;
    }

    // Get the destination address for the receiving chain (use uppercase for lookup)
    const normalizedToChain = normalizeChain(toAsset.chain);
    const destinationAddress = getDestinationAddress(normalizedToChain);
    if (!destinationAddress) {
      setError(`No wallet address found for ${toAsset.chain}. Please set up your wallet first.`);
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      // Use normalized uppercase chain IDs for backend API
      const response = await swapService.createSwap({
        fromChain: normalizeChain(fromAsset.chain),
        fromToken: fromAsset.symbol.toUpperCase(),
        toChain: normalizedToChain,
        toToken: toAsset.symbol.toUpperCase(),
        amount: fromAmount,
        destinationAddress, // User's wallet address for the destination chain
        rateId: estimate?.rateId,
      });

      setConvertedAmount(toAmount);
      setShowSuccess(true);

      // Refresh balances
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <ResponsiveLayout activeNav="wallet" title="Convert">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 size={40} color={colors.primary[400]} />
          </motion.div>
          <p style={{ color: colors.text.secondary, marginTop: '16px' }}>
            Loading your assets...
          </p>
        </div>
      </ResponsiveLayout>
    );
  }

  if (showSuccess && fromAsset && toAsset) {
    return (
      <ResponsiveLayout activeNav="wallet" title="Convert">
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '60px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `${colors.status.success}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <CheckCircle size={50} color={colors.status.success} />
          </motion.div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, color: colors.text.primary, marginBottom: '8px' }}>
            Conversion Successful!
          </h2>
          <p style={{ fontSize: '14px', color: colors.text.tertiary, marginBottom: '32px' }}>
            You have successfully converted your assets
          </p>

          <div
            style={{
              padding: '24px',
              background: colors.background.secondary,
              borderRadius: '16px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <CryptoIcon symbol={fromAsset.symbol} size={40} />
                <p style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary, marginTop: '8px' }}>
                  -{fromAmount} {fromAsset.symbol}
                </p>
              </div>
              <ArrowDownUp size={24} color={colors.primary[400]} style={{ transform: 'rotate(90deg)' }} />
              <div style={{ textAlign: 'center' }}>
                <CryptoIcon symbol={toAsset.symbol} size={40} />
                <p style={{ fontSize: '18px', fontWeight: 700, color: colors.status.success, marginTop: '8px' }}>
                  +{convertedAmount} {toAsset.symbol}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => {
                setShowSuccess(false);
                setFromAmount('');
                setConvertedAmount('');
              }}
            >
              Convert More
            </Button>
            <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/dashboard')}>
              Done
            </Button>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  // No assets available
  if (!fromAsset || !toAsset) {
    return (
      <ResponsiveLayout activeNav="wallet" title="Convert">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          textAlign: 'center',
        }}>
          <AlertCircle size={40} color={colors.text.tertiary} />
          <p style={{ color: colors.text.secondary, marginTop: '16px', marginBottom: '16px' }}>
            No assets available for conversion
          </p>
          <Button variant="primary" onClick={() => navigate('/wallet/deposit')}>
            Deposit Funds
          </Button>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activeNav="wallet" title="Convert">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={18} color={colors.status.error} />
            <span style={{ flex: 1, fontSize: '13px', color: colors.status.error }}>
              {error}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: colors.status.error,
              }}
            >
              ✕
            </motion.button>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px',
              background: 'rgba(0, 255, 136, 0.1)',
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '12px',
              color: colors.text.primary,
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: colors.text.primary }}>
              Convert
            </h1>
            <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
              Instantly swap between cryptocurrencies
            </p>
          </div>
        </motion.div>

        {/* Convert Card */}
        <div
          style={{
            padding: '24px',
            background: colors.background.secondary,
            border: `1px solid ${colors.glass.border}`,
            borderRadius: '20px',
            marginBottom: '24px',
          }}
        >
          {/* From */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>
              From
            </label>
            <div
              style={{
                padding: '16px',
                background: 'rgba(0, 255, 136, 0.05)',
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <motion.button
                    whileHover={{ background: 'rgba(0, 255, 136, 0.1)' }}
                    onClick={() => setShowFromDropdown(!showFromDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      background: 'rgba(0, 255, 136, 0.05)',
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    <CryptoIcon symbol={fromAsset.symbol} size={28} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
                        {fromAsset.symbol}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        color: colors.text.tertiary,
                      }}>
                        {fromAsset.chain}
                      </span>
                    </div>
                    <ChevronDown size={16} color={colors.text.tertiary} />
                  </motion.button>

                  {showFromDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '8px',
                        width: '240px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        background: colors.background.secondary,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '12px',
                        zIndex: 100,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                      }}
                    >
                      {assets.filter(a => !(a.symbol === toAsset?.symbol && a.chain === toAsset?.chain)).map((asset) => (
                        <motion.div
                          key={`${asset.symbol}-${asset.chain}`}
                          whileHover={{ background: 'rgba(0, 255, 136, 0.1)' }}
                          onClick={() => {
                            setFromAsset(asset);
                            setShowFromDropdown(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <CryptoIcon symbol={asset.symbol} size={24} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                                {asset.symbol}
                              </p>
                              <span style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                background: 'rgba(0, 255, 136, 0.15)',
                                borderRadius: '4px',
                                color: colors.primary[400],
                              }}>
                                {asset.chain}
                              </span>
                            </div>
                            <p style={{ fontSize: '11px', color: colors.text.tertiary }}>
                              {asset.balance} available
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                  Available: {fromAsset.balance} {fromAsset.symbol}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: colors.text.primary,
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFromAmount(fromAsset.balance.replace(',', ''))}
                  style={{
                    padding: '6px 12px',
                    background: `${colors.primary[400]}20`,
                    border: 'none',
                    borderRadius: '6px',
                    color: colors.primary[400],
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  MAX
                </motion.button>
              </div>
              {fromAmount && (
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginTop: '8px' }}>
                  ≈ ${(parseFloat(fromAmount) * fromAsset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-8px 0' }}>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwap}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: colors.gradients.primary,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: colors.shadows.glow,
                zIndex: 10,
              }}
            >
              <ArrowDownUp size={20} color={colors.background.primary} />
            </motion.button>
          </div>

          {/* To */}
          <div>
            <label style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>
              To
            </label>
            <div
              style={{
                padding: '16px',
                background: 'rgba(0, 255, 136, 0.05)',
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <motion.button
                    whileHover={{ background: 'rgba(0, 255, 136, 0.1)' }}
                    onClick={() => setShowToDropdown(!showToDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      background: 'rgba(0, 255, 136, 0.05)',
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    <CryptoIcon symbol={toAsset.symbol} size={28} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
                        {toAsset.symbol}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        color: colors.text.tertiary,
                      }}>
                        {toAsset.chain}
                      </span>
                    </div>
                    <ChevronDown size={16} color={colors.text.tertiary} />
                  </motion.button>

                  {showToDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '8px',
                        width: '240px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        background: colors.background.secondary,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '12px',
                        zIndex: 100,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                      }}
                    >
                      {assets.filter(a => !(a.symbol === fromAsset?.symbol && a.chain === fromAsset?.chain)).map((asset) => (
                        <motion.div
                          key={`${asset.symbol}-${asset.chain}`}
                          whileHover={{ background: 'rgba(0, 255, 136, 0.1)' }}
                          onClick={() => {
                            setToAsset(asset);
                            setShowToDropdown(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <CryptoIcon symbol={asset.symbol} size={24} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                                {asset.symbol}
                              </p>
                              <span style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                background: 'rgba(0, 255, 136, 0.15)',
                                borderRadius: '4px',
                                color: colors.primary[400],
                              }}>
                                {asset.chain}
                              </span>
                            </div>
                            <p style={{ fontSize: '11px', color: colors.text.tertiary }}>
                              {asset.name}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                  Balance: {toAsset.balance} {toAsset.symbol}
                </p>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: toAmount ? colors.status.success : colors.text.tertiary }}>
                {toAmount || '0.00'}
              </p>
              {toAmount && (
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginTop: '8px' }}>
                  ≈ ${(parseFloat(toAmount) * toAsset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Exchange Rate */}
        <div
          style={{
            padding: '16px 20px',
            background: colors.background.secondary,
            border: `1px solid ${colors.glass.border}`,
            borderRadius: '14px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isLoadingEstimate ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw size={18} color={colors.primary[400]} />
              </motion.div>
            ) : (
              <Zap size={18} color={colors.primary[400]} />
            )}
            <span style={{ fontSize: '14px', color: colors.text.secondary }}>Exchange Rate</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
            {isLoadingEstimate ? 'Loading...' : (
              estimate?.rate
                ? `1 ${fromAsset.symbol} = ${estimate.rate} ${toAsset.symbol}`
                : exchangeRate > 0
                  ? `1 ${fromAsset.symbol} = ${exchangeRate.toFixed(6)} ${toAsset.symbol}`
                  : 'Rate unavailable'
            )}
          </span>
        </div>

        {/* Convert Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleConvert}
          loading={isConverting}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0}
          leftIcon={<ArrowDownUp size={18} />}
        >
          Convert
        </Button>
      </div>
    </ResponsiveLayout>
  );
};

export default ConvertScreen;
