import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Copy,
  CheckCircle,
  QrCode,
  ChevronRight,
  Info,
  Shield,
  Clock,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { CryptoIcon, ResponsiveLayout } from '../../components';

// Crypto list for deposit
const cryptoList = [
  { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', minDeposit: '0.0001', confirmations: 3 },
  { symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', minDeposit: '0.001', confirmations: 12 },
  { symbol: 'USDT', name: 'Tether', network: 'TRC-20', minDeposit: '1', confirmations: 20 },
  { symbol: 'BNB', name: 'BNB', network: 'BEP-20', minDeposit: '0.01', confirmations: 15 },
  { symbol: 'SOL', name: 'Solana', network: 'Solana', minDeposit: '0.01', confirmations: 32 },
  { symbol: 'XRP', name: 'Ripple', network: 'XRP Ledger', minDeposit: '1', confirmations: 1 },
  { symbol: 'ADA', name: 'Cardano', network: 'Cardano', minDeposit: '1', confirmations: 15 },
  { symbol: 'DOGE', name: 'Dogecoin', network: 'Dogecoin', minDeposit: '10', confirmations: 20 },
  { symbol: 'DOT', name: 'Polkadot', network: 'Polkadot', minDeposit: '0.1', confirmations: 25 },
  { symbol: 'MATIC', name: 'Polygon', network: 'Polygon', minDeposit: '1', confirmations: 128 },
  { symbol: 'AVAX', name: 'Avalanche', network: 'C-Chain', minDeposit: '0.1', confirmations: 20 },
  { symbol: 'LINK', name: 'Chainlink', network: 'ERC-20', minDeposit: '0.1', confirmations: 12 },
  { symbol: 'ATOM', name: 'Cosmos', network: 'Cosmos', minDeposit: '0.1', confirmations: 10 },
  { symbol: 'UNI', name: 'Uniswap', network: 'ERC-20', minDeposit: '0.1', confirmations: 12 },
  { symbol: 'LTC', name: 'Litecoin', network: 'Litecoin', minDeposit: '0.01', confirmations: 6 },
  { symbol: 'SHIB', name: 'Shiba Inu', network: 'ERC-20', minDeposit: '100000', confirmations: 12 },
  { symbol: 'TRX', name: 'TRON', network: 'TRC-20', minDeposit: '1', confirmations: 20 },
  { symbol: 'NEAR', name: 'NEAR Protocol', network: 'NEAR', minDeposit: '0.1', confirmations: 5 },
  { symbol: 'ARB', name: 'Arbitrum', network: 'Arbitrum', minDeposit: '0.1', confirmations: 20 },
  { symbol: 'OP', name: 'Optimism', network: 'Optimism', minDeposit: '0.1', confirmations: 20 },
];

const generateAddress = (symbol: string) => {
  const prefixes: Record<string, string> = {
    BTC: '1', ETH: '0x', USDT: 'T', BNB: 'bnb1', SOL: '', XRP: 'r',
    ADA: 'addr1', DOGE: 'D', DOT: '1', MATIC: '0x', AVAX: '0x',
    LINK: '0x', ATOM: 'cosmos1', UNI: '0x', LTC: 'L', SHIB: '0x',
    TRX: 'T', NEAR: '', ARB: '0x', OP: '0x',
  };
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  const prefix = prefixes[symbol] || '0x';
  const length = symbol === 'BTC' ? 34 : symbol === 'SOL' ? 44 : 42;
  let result = prefix;
  for (let i = prefix.length; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const DepositScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useThemeMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<typeof cryptoList[0] | null>(null);
  const [depositAddress, setDepositAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const handleSelectCrypto = (crypto: typeof cryptoList[0]) => {
    setSelectedCrypto(crypto);
    setDepositAddress(generateAddress(crypto.symbol));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                    key={crypto.symbol}
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
                      <CryptoIcon symbol={crypto.symbol} size={40} />
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
                <CryptoIcon symbol={selectedCrypto.symbol} size={48} />
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
                  onClick={() => setSelectedCrypto(null)}
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

              {/* Deposit Address */}
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
                    <QrCode size={140} color="#000" />
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
