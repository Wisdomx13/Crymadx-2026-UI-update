import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDownUp,
  ChevronDown,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { CryptoIcon, ResponsiveLayout, Button } from '../../components';

const cryptoAssets = [
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.05234', price: 87345.50 },
  { symbol: 'ETH', name: 'Ethereum', balance: '2.4521', price: 2987.40 },
  { symbol: 'USDT', name: 'Tether', balance: '1250.00', price: 1.00 },
  { symbol: 'BNB', name: 'BNB', balance: '5.234', price: 612.45 },
  { symbol: 'SOL', name: 'Solana', balance: '45.23', price: 126.66 },
  { symbol: 'XRP', name: 'Ripple', balance: '500.00', price: 1.93 },
  { symbol: 'ADA', name: 'Cardano', balance: '1234.56', price: 0.46 },
  { symbol: 'DOGE', name: 'Dogecoin', balance: '5000.00', price: 0.32 },
  { symbol: 'DOT', name: 'Polkadot', balance: '100.00', price: 7.89 },
  { symbol: 'MATIC', name: 'Polygon', balance: '2500.00', price: 0.85 },
];

export const ConvertScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useThemeMode();
  const [fromAsset, setFromAsset] = useState(cryptoAssets[0]);
  const [toAsset, setToAsset] = useState(cryptoAssets[2]);
  const [fromAmount, setFromAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const exchangeRate = fromAsset.price / toAsset.price;
  const toAmount = fromAmount ? (parseFloat(fromAmount) * exchangeRate).toFixed(6) : '';

  const handleSwap = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setFromAmount('');
  };

  const handleConvert = async () => {
    setIsConverting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConverting(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
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
                  +{toAmount} {toAsset.symbol}
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

  return (
    <ResponsiveLayout activeNav="wallet" title="Convert">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                    <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
                      {fromAsset.symbol}
                    </span>
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
                        width: '200px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        background: colors.background.secondary,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '12px',
                        zIndex: 100,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                      }}
                    >
                      {cryptoAssets.filter(a => a.symbol !== toAsset.symbol).map((asset) => (
                        <motion.div
                          key={asset.symbol}
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
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                              {asset.symbol}
                            </p>
                            <p style={{ fontSize: '11px', color: colors.text.tertiary }}>
                              {asset.balance}
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
                    <span style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
                      {toAsset.symbol}
                    </span>
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
                        width: '200px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        background: colors.background.secondary,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '12px',
                        zIndex: 100,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                      }}
                    >
                      {cryptoAssets.filter(a => a.symbol !== fromAsset.symbol).map((asset) => (
                        <motion.div
                          key={asset.symbol}
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
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                              {asset.symbol}
                            </p>
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
            <Zap size={18} color={colors.primary[400]} />
            <span style={{ fontSize: '14px', color: colors.text.secondary }}>Exchange Rate</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
            1 {fromAsset.symbol} = {exchangeRate.toFixed(6)} {toAsset.symbol}
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
