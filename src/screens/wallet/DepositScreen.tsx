import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Copy,
  CheckCircle,
  ChevronRight,
  Info,
  Shield,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useThemeMode } from '../../theme/ThemeContext';
import { CryptoIcon, ResponsiveLayout, Button } from '../../components';
import { depositService } from '../../services';
import { allAssets } from '../../config/assets';

interface CryptoOption {
  symbol: string;
  name: string;
  network: string;
  minDeposit: string;
  confirmations: number;
  chainId: string;
  logoUrl?: string;
}

export const DepositScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useThemeMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [depositAddress, setDepositAddress] = useState('');
  const [memo, setMemo] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // API state
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Token list - use local assets config (200+ tokens)
  const cryptoList: CryptoOption[] = allAssets.map((asset) => ({
    symbol: asset.symbol,
    name: asset.name,
    network: asset.network,
    minDeposit: asset.minDeposit,
    confirmations: asset.confirmations,
    chainId: asset.chainId,
  }));

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const filteredCrypto = cryptoList.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchDepositAddress = useCallback(async (chainId: string) => {
    setIsLoadingAddress(true);
    setError(null);

    try {
      const addressInfo = await depositService.getDepositAddress(chainId);
      setDepositAddress(addressInfo.address);
      setMemo(addressInfo.memo);
    } catch (err: any) {
      console.error('Error fetching deposit address:', err);
      setError(err.message || 'Failed to get deposit address');
      setDepositAddress('');
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  const handleSelectCrypto = (crypto: CryptoOption) => {
    setSelectedCrypto(crypto);
    fetchDepositAddress(crypto.chainId);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMemo = () => {
    if (memo) {
      navigator.clipboard.writeText(memo);
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    }
  };

  return (
    <ResponsiveLayout activeNav="wallet" title="Deposit">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            onClick={() => navigate('/wallet')}
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
              Deposit Crypto
            </h1>
            <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
              Select a cryptocurrency to deposit
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedCrypto ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Search */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  background: colors.background.secondary,
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '14px',
                  marginBottom: '24px',
                }}
              >
                <Search size={20} color={colors.text.tertiary} />
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
                    fontSize: '15px',
                    color: colors.text.primary,
                  }}
                />
              </div>

              {/* Crypto List */}
              {filteredCrypto.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    background: colors.background.secondary,
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '16px',
                  }}
                >
                  <AlertCircle size={48} color={colors.text.tertiary} />
                  <p style={{ marginTop: '16px', color: colors.text.secondary, fontWeight: 600 }}>
                    {searchQuery ? 'No tokens found' : 'No depositable tokens available'}
                  </p>
                  <p style={{ marginTop: '8px', color: colors.text.tertiary, fontSize: '14px' }}>
                    {searchQuery ? 'Try a different search term' : 'Please check back later'}
                  </p>
                </div>
              ) : (
              <div
                style={{
                  background: colors.background.secondary,
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                {filteredCrypto.map((crypto, index) => (
                  <motion.div
                    key={`${crypto.symbol}-${crypto.chainId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ background: 'rgba(0, 255, 136, 0.05)' }}
                    onClick={() => handleSelectCrypto(crypto)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: index < filteredCrypto.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <CryptoIcon symbol={crypto.symbol} size={40} logoUrl={crypto.logoUrl} />
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>
                          {crypto.symbol}
                        </p>
                        <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                          {crypto.name}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          color: colors.primary[400],
                          padding: '4px 10px',
                          background: `${colors.primary[400]}15`,
                          borderRadius: '6px',
                        }}
                      >
                        {crypto.network}
                      </span>
                      <ChevronRight size={18} color={colors.text.tertiary} />
                    </div>
                  </motion.div>
                ))}
              </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Selected Crypto Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  background: colors.background.secondary,
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '16px',
                  marginBottom: '24px',
                }}
              >
                <CryptoIcon symbol={selectedCrypto.symbol} size={48} logoUrl={selectedCrypto.logoUrl} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary }}>
                    {selectedCrypto.name} ({selectedCrypto.symbol})
                  </p>
                  <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                    Network: {selectedCrypto.network}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCrypto(null);
                    setDepositAddress('');
                    setMemo(undefined);
                    setError(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '8px',
                    color: colors.text.secondary,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Change
                </motion.button>
              </div>

              {/* Loading State */}
              {isLoadingAddress && (
                <div
                  style={{
                    padding: '60px 24px',
                    background: colors.background.secondary,
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '16px',
                    marginBottom: '24px',
                    textAlign: 'center',
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', marginBottom: '16px' }}
                  >
                    <Loader2 size={40} color={colors.primary[400]} />
                  </motion.div>
                  <p style={{ color: colors.text.secondary }}>
                    Fetching your deposit address...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !isLoadingAddress && (
                <div
                  style={{
                    padding: '24px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <AlertCircle size={24} color={colors.status.error} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary, marginBottom: '4px' }}>
                        Failed to get deposit address
                      </p>
                      <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                        {error}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => fetchDepositAddress(selectedCrypto.chainId)}
                      leftIcon={<RefreshCw size={16} />}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}

              {/* Deposit Address */}
              {depositAddress && !isLoadingAddress && (
                <div
                  style={{
                    padding: '24px',
                    background: colors.background.secondary,
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div
                      style={{
                        width: '180px',
                        height: '180px',
                        margin: '0 auto 20px',
                        padding: '12px',
                        background: '#fff',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <QRCodeSVG
                        value={depositAddress}
                        size={156}
                        level="M"
                        includeMargin={false}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>
                    <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                      Scan QR code or copy address below
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                      {selectedCrypto.symbol} Deposit Address
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        background: 'rgba(0, 255, 136, 0.05)',
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '12px',
                      }}
                    >
                      <p
                        style={{
                          flex: 1,
                          fontSize: '13px',
                          fontFamily: "'JetBrains Mono', monospace",
                          color: colors.text.primary,
                          wordBreak: 'break-all',
                        }}
                      >
                        {depositAddress}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopy}
                        style={{
                          padding: '10px 16px',
                          background: copied ? colors.status.success : colors.gradients.primary,
                          border: 'none',
                          borderRadius: '8px',
                          color: colors.background.primary,
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Memo/Tag field if required */}
                  {memo && (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                        Memo / Tag (Required)
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 16px',
                          background: 'rgba(255, 193, 7, 0.1)',
                          border: '1px solid rgba(255, 193, 7, 0.3)',
                          borderRadius: '12px',
                        }}
                      >
                        <p
                          style={{
                            flex: 1,
                            fontSize: '13px',
                            fontFamily: "'JetBrains Mono', monospace",
                            color: colors.text.primary,
                            wordBreak: 'break-all',
                          }}
                        >
                          {memo}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyMemo}
                          style={{
                            padding: '10px 16px',
                            background: copiedMemo ? colors.status.success : '#FFC107',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#000',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {copiedMemo ? <CheckCircle size={16} /> : <Copy size={16} />}
                          {copiedMemo ? 'Copied!' : 'Copy'}
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Info Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                    <div
                      style={{
                        padding: '14px',
                        background: 'rgba(0, 255, 136, 0.05)',
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <Shield size={18} color={colors.primary[400]} />
                      <div>
                        <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Min Deposit</p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                          {selectedCrypto.minDeposit} {selectedCrypto.symbol}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '14px',
                        background: 'rgba(0, 255, 136, 0.05)',
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <Clock size={18} color={colors.primary[400]} />
                      <div>
                        <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Confirmations</p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                          {selectedCrypto.confirmations} blocks
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '12px',
                }}
              >
                <Info size={20} color="#FFC107" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#FFC107', marginBottom: '4px' }}>
                    Important
                  </p>
                  <p style={{ fontSize: '13px', color: colors.text.secondary, lineHeight: 1.6 }}>
                    Only send {selectedCrypto.symbol} to this address. Sending any other cryptocurrency may result in permanent loss.
                    Make sure to use the {selectedCrypto.network} network.
                    {memo && ' Include the memo/tag with your deposit or your funds may be lost.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ResponsiveLayout>
  );
};

export default DepositScreen;
