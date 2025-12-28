import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  HelpCircle,
  TrendingUp,
  Lock,
  Unlock,
  ChevronRight,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  X,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, CryptoIcon, ResponsiveLayout, Button } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';

// Savings products
const savingsProducts = [
  { symbol: 'USDT', name: 'Tether', apr: 5.5, minAmount: 10, balance: '0.00' },
  { symbol: 'BTC', name: 'Bitcoin', apr: 1.2, minAmount: 0.001, balance: '0.00' },
  { symbol: 'ETH', name: 'Ethereum', apr: 2.5, minAmount: 0.01, balance: '0.00' },
  { symbol: 'USDC', name: 'USD Coin', apr: 5.2, minAmount: 10, balance: '0.00' },
  { symbol: 'BNB', name: 'BNB', apr: 3.8, minAmount: 0.1, balance: '0.00' },
  { symbol: 'SOL', name: 'Solana', apr: 4.2, minAmount: 0.5, balance: '0.00' },
  { symbol: 'XRP', name: 'Ripple', apr: 3.0, minAmount: 50, balance: '0.00' },
  { symbol: 'ADA', name: 'Cardano', apr: 3.5, minAmount: 100, balance: '0.00' },
];

export const SavingsVaultScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();
  const [activeTab, setActiveTab] = useState<'flexible' | 'locked'>('flexible');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof savingsProducts[0] | null>(null);
  const [subscribeAmount, setSubscribeAmount] = useState('');

  const handleSubscribe = (product: typeof savingsProducts[0]) => {
    setSelectedProduct(product);
    setSubscribeAmount('');
    setShowSubscribeModal(true);
  };

  const confirmSubscribe = () => {
    // Mock subscription
    setShowSubscribeModal(false);
    setSelectedProduct(null);
    setSubscribeAmount('');
  };

  return (
    <ResponsiveLayout activeNav="earn" title="Savings Vault">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              style={{
                padding: '10px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                cursor: 'pointer',
                color: colors.text.primary,
                display: 'flex',
              }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h1 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              color: colors.text.primary,
            }}>
              Savings Vault
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '10px',
              background: colors.background.card,
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '10px',
              cursor: 'pointer',
              color: colors.text.tertiary,
              display: 'flex',
            }}
          >
            <HelpCircle size={20} />
          </motion.button>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" padding="lg" style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px',
            }}>
              <div>
                <p style={{
                  fontSize: '13px',
                  color: colors.text.tertiary,
                  marginBottom: '4px',
                }}>
                  Total Savings
                </p>
                <p style={{
                  fontSize: isMobile ? '28px' : '32px',
                  fontWeight: 700,
                  color: colors.text.primary,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  $0.00
                </p>
              </div>
              <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                <p style={{
                  fontSize: '13px',
                  color: colors.text.tertiary,
                  marginBottom: '4px',
                }}>
                  Total Earnings
                </p>
                <p style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: colors.trading.buy,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  +$0.00
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            background: colors.background.card,
            padding: '4px',
            borderRadius: '12px',
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('flexible')}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: activeTab === 'flexible' ? colors.primary[400] : 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: activeTab === 'flexible' ? '#000' : colors.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Unlock size={16} />
            Flexible
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('locked')}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: activeTab === 'locked' ? colors.primary[400] : 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: activeTab === 'locked' ? '#000' : colors.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Lock size={16} />
            Locked
          </motion.button>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '20px' }}
        >
          <GlassCard variant="subtle" padding="md">
            <p style={{
              fontSize: '13px',
              color: colors.text.secondary,
              lineHeight: 1.6,
            }}>
              {activeTab === 'flexible'
                ? 'Earn interest with no lock-up period. Withdraw anytime.'
                : 'Lock your assets for higher APY. Early withdrawal incurs fees.'}
            </p>
          </GlassCard>
        </motion.div>

        {/* Savings Products List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard variant="default" padding="none">
            {savingsProducts.map((product, index) => (
              <motion.div
                key={product.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ background: isDark ? 'rgba(26, 143, 255, 0.05)' : 'rgba(16, 185, 129, 0.05)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '14px 16px' : '16px 20px',
                  borderBottom: index < savingsProducts.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <CryptoIcon symbol={product.symbol} size={isMobile ? 36 : 42} />
                  <div>
                    <p style={{
                      fontSize: isMobile ? '15px' : '16px',
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}>
                      {product.symbol}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: colors.text.tertiary,
                    }}>
                      Min. {product.minAmount} {product.symbol}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: 700,
                      color: colors.trading.buy,
                    }}>
                      {product.apr}%
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: colors.text.tertiary,
                    }}>
                      APR
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSubscribe(product)}
                    style={{
                      padding: '8px 16px',
                      background: colors.primary[400],
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </GlassCard>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '24px' }}
        >
          <GlassCard variant="subtle" padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color={colors.trading.buy} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                  Earn daily interest on your crypto holdings
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color={colors.trading.buy} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                  {activeTab === 'flexible' ? 'No lock-up period - withdraw anytime' : 'Higher APY for longer lock periods'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color={colors.trading.buy} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                  Interest paid daily to your account
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Subscribe Modal */}
      <AnimatePresence>
        {showSubscribeModal && selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubscribeModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '420px',
                zIndex: 1001,
              }}
            >
              <GlassCard variant="prominent" padding="lg" glow>
                {/* Modal Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CryptoIcon symbol={selectedProduct.symbol} size={36} />
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: colors.text.primary,
                      }}>
                        Subscribe {selectedProduct.symbol}
                      </h3>
                      <p style={{
                        fontSize: '12px',
                        color: colors.trading.buy,
                      }}>
                        {selectedProduct.apr}% APR
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSubscribeModal(false)}
                    style={{
                      padding: '8px',
                      background: colors.background.card,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: colors.text.tertiary,
                      display: 'flex',
                    }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                {/* Amount Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text.secondary,
                    marginBottom: '8px',
                  }}>
                    Amount
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: colors.background.card,
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '10px',
                  }}>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={subscribeAmount}
                      onChange={(e) => setSubscribeAmount(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: colors.text.primary,
                        fontSize: '18px',
                        fontWeight: 600,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: colors.text.secondary,
                    }}>
                      {selectedProduct.symbol}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: colors.text.tertiary,
                    marginTop: '6px',
                  }}>
                    Available: {selectedProduct.balance} {selectedProduct.symbol}
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '20px',
                }}>
                  {[25, 50, 75, 100].map((pct) => (
                    <motion.button
                      key={pct}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSubscribeAmount((parseFloat(selectedProduct.balance || '0') * pct / 100).toString())}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: colors.background.card,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: '6px',
                        color: colors.text.secondary,
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {pct}%
                    </motion.button>
                  ))}
                </div>

                {/* Estimated Earnings */}
                <div style={{
                  padding: '14px',
                  background: isDark ? 'rgba(0, 200, 83, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                      Est. Daily Earnings
                    </span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.trading.buy,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {((parseFloat(subscribeAmount) || 0) * selectedProduct.apr / 100 / 365).toFixed(6)} {selectedProduct.symbol}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                      Est. Annual Earnings
                    </span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.trading.buy,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {((parseFloat(subscribeAmount) || 0) * selectedProduct.apr / 100).toFixed(6)} {selectedProduct.symbol}
                    </span>
                  </div>
                </div>

                {/* Subscribe Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={confirmSubscribe}
                  disabled={!subscribeAmount || parseFloat(subscribeAmount) < selectedProduct.minAmount}
                >
                  Subscribe
                </Button>
                <p style={{
                  fontSize: '11px',
                  color: colors.text.tertiary,
                  textAlign: 'center',
                  marginTop: '12px',
                }}>
                  Minimum: {selectedProduct.minAmount} {selectedProduct.symbol}
                </p>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

export default SavingsVaultScreen;
