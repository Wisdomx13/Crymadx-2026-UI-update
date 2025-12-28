import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Shield,
  Wallet,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { CryptoIcon, ResponsiveLayout, Button, Input } from '../../components';

// Crypto list with balances
const cryptoList = [
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.05234', usdValue: '4,523.45', network: 'Bitcoin', fee: '0.0001' },
  { symbol: 'ETH', name: 'Ethereum', balance: '2.4521', usdValue: '7,234.12', network: 'ERC-20', fee: '0.002' },
  { symbol: 'USDT', name: 'Tether', balance: '1,250.00', usdValue: '1,250.00', network: 'TRC-20', fee: '1' },
  { symbol: 'BNB', name: 'BNB', balance: '5.234', usdValue: '3,234.56', network: 'BEP-20', fee: '0.001' },
  { symbol: 'SOL', name: 'Solana', balance: '45.23', usdValue: '5,678.90', network: 'Solana', fee: '0.01' },
  { symbol: 'XRP', name: 'Ripple', balance: '500.00', usdValue: '965.00', network: 'XRP Ledger', fee: '0.25' },
  { symbol: 'ADA', name: 'Cardano', balance: '1,234.56', usdValue: '567.89', network: 'Cardano', fee: '1' },
  { symbol: 'DOGE', name: 'Dogecoin', balance: '5,000.00', usdValue: '1,625.00', network: 'Dogecoin', fee: '5' },
  { symbol: 'DOT', name: 'Polkadot', balance: '100.00', usdValue: '789.00', network: 'Polkadot', fee: '0.1' },
  { symbol: 'MATIC', name: 'Polygon', balance: '2,500.00', usdValue: '2,125.00', network: 'Polygon', fee: '1' },
];

type Step = 'select' | 'amount' | 'confirm' | 'success';

export const WithdrawScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useThemeMode();
  const [step, setStep] = useState<Step>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<typeof cryptoList[0] | null>(null);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setStep('amount');
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep('success');
  };

  const receiveAmount = selectedCrypto
    ? (parseFloat(amount || '0') - parseFloat(selectedCrypto.fee)).toFixed(6)
    : '0';

  return (
    <ResponsiveLayout activeNav="wallet" title="Withdraw">
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
            onClick={() => step === 'select' ? navigate('/dashboard') : setStep('select')}
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
              Withdraw Crypto
            </h1>
            <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
              {step === 'select' && 'Select cryptocurrency to withdraw'}
              {step === 'amount' && 'Enter withdrawal details'}
              {step === 'confirm' && 'Confirm your withdrawal'}
              {step === 'success' && 'Withdrawal submitted'}
            </p>
          </div>
        </motion.div>

        {/* Progress Steps */}
        {step !== 'success' && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {['select', 'amount', 'confirm'].map((s, i) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: ['select', 'amount', 'confirm'].indexOf(step) >= i
                    ? colors.primary[400]
                    : colors.glass.border,
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'select' && (
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
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                          {crypto.balance} {crypto.symbol}
                        </p>
                        <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                          ≈ ${crypto.usdValue}
                        </p>
                      </div>
                      <ChevronRight size={18} color={colors.text.tertiary} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'amount' && selectedCrypto && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Selected Crypto */}
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
                    {selectedCrypto.name}
                  </p>
                  <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                    Available: {selectedCrypto.balance} {selectedCrypto.symbol}
                  </p>
                </div>
              </div>

              {/* Withdrawal Form */}
              <div
                style={{
                  padding: '24px',
                  background: colors.background.secondary,
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '16px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <Input
                    label="Withdrawal Address"
                    placeholder={`Enter ${selectedCrypto.symbol} address`}
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    leftIcon={<Wallet size={18} />}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                    Amount
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
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}
                    />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: colors.text.secondary }}>
                      {selectedCrypto.symbol}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAmount(selectedCrypto.balance.replace(',', ''))}
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
                </div>

                {/* Fee Info */}
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(0, 255, 136, 0.05)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.text.tertiary }}>Network Fee</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                      {selectedCrypto.fee} {selectedCrypto.symbol}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: colors.text.tertiary }}>You'll receive</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: colors.primary[400] }}>
                      {parseFloat(receiveAmount) > 0 ? receiveAmount : '0'} {selectedCrypto.symbol}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setStep('confirm')}
                disabled={!withdrawAddress || !amount || parseFloat(amount) <= 0}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 'confirm' && selectedCrypto && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div
                style={{
                  padding: '24px',
                  background: colors.background.secondary,
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '16px',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, marginBottom: '24px' }}>
                  Confirm Withdrawal
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: colors.text.tertiary }}>Asset</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CryptoIcon symbol={selectedCrypto.symbol} size={24} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                        {selectedCrypto.name}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: colors.text.tertiary }}>Amount</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                      {amount} {selectedCrypto.symbol}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: colors.text.tertiary }}>Network</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                      {selectedCrypto.network}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: colors.text.tertiary }}>Fee</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                      {selectedCrypto.fee} {selectedCrypto.symbol}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(0, 255, 136, 0.05)',
                      borderRadius: '8px',
                    }}
                  >
                    <p style={{ fontSize: '12px', color: colors.text.tertiary, marginBottom: '4px' }}>
                      To Address
                    </p>
                    <p style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", color: colors.text.primary, wordBreak: 'break-all' }}>
                      {withdrawAddress}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: `1px solid ${colors.glass.border}` }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>You'll receive</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: colors.primary[400] }}>
                      {receiveAmount} {selectedCrypto.symbol}
                    </span>
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
                  marginBottom: '24px',
                }}
              >
                <AlertTriangle size={20} color="#FFC107" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: colors.text.secondary }}>
                  Please verify the withdrawal address. Transactions cannot be reversed once submitted.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleConfirm}
                loading={isLoading}
                leftIcon={<Shield size={18} />}
              >
                Confirm Withdrawal
              </Button>
            </motion.div>
          )}

          {step === 'success' && selectedCrypto && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
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
                Withdrawal Submitted!
              </h2>
              <p style={{ fontSize: '14px', color: colors.text.tertiary, marginBottom: '32px' }}>
                Your withdrawal of {amount} {selectedCrypto.symbol} has been submitted and is being processed.
              </p>

              <div
                style={{
                  padding: '20px',
                  background: colors.background.secondary,
                  borderRadius: '16px',
                  marginBottom: '24px',
                }}
              >
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px' }}>
                  Transaction ID
                </p>
                <p style={{ fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", color: colors.primary[400] }}>
                  TX{Math.random().toString(36).substring(2, 15).toUpperCase()}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="outline" size="lg" fullWidth onClick={() => navigate('/wallet/history')}>
                  View History
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/dashboard')}>
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ResponsiveLayout>
  );
};

export default WithdrawScreen;
