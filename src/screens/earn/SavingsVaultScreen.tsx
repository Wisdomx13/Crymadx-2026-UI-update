import React, { useState, useEffect } from 'react';
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
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, CryptoIcon, ResponsiveLayout, Button } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { savingsService, balanceService } from '../../services';
import { useAuth } from '../../context/AuthContext';

interface SavingsProduct {
  id: string;
  symbol: string;
  name: string;
  apr: number;
  minAmount: number;
  lockPeriod: number;
  type: 'flexible' | 'locked';
}

interface UserBalance {
  asset: string;
  available: string;
}

export const SavingsVaultScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'flexible' | 'locked'>('flexible');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const [subscribeAmount, setSubscribeAmount] = useState('');
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [userBalances, setUserBalances] = useState<Record<string, string>>({});
  const [totalSavings, setTotalSavings] = useState('0.00');
  const [totalEarnings, setTotalEarnings] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  // Fetch savings products and user data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products from backend
        const productsResponse = await savingsService.getProducts();
        if (productsResponse.products) {
          // Map backend products to our format
          const mappedProducts: SavingsProduct[] = productsResponse.products.map((p: any) => ({
            id: p.id || p.name,
            symbol: p.asset || p.symbol || p.name?.split(' ')[0] || 'USDT',
            name: p.name,
            apr: p.apy || p.apr || 5,
            minAmount: p.minDeposit || 10,
            lockPeriod: p.lockPeriod || 0,
            type: p.lockPeriod && p.lockPeriod > 0 ? 'locked' : 'flexible',
          }));
          setProducts(mappedProducts);
        }

        // Fetch user deposits if authenticated
        if (isAuthenticated) {
          try {
            const depositsResponse = await savingsService.getDeposits();
            if (depositsResponse) {
              setTotalSavings(depositsResponse.totalDeposited || '0.00');
              setTotalEarnings(depositsResponse.totalInterest || '0.00');
            }

            // Fetch user balances - getAllBalances returns Balance[] directly
            const balances = await balanceService.getAllBalances();
            if (balances && balances.length > 0) {
              const balanceMap: Record<string, string> = {};
              balances.forEach((b) => {
                balanceMap[b.currency.toUpperCase()] = b.available;
              });
              setUserBalances(balanceMap);
            }
          } catch (err) {
            console.log('User data fetch error (may not be logged in):', err);
          }
        }
      } catch (error) {
        console.error('Failed to fetch savings products:', error);
        // Show empty state - no mock data
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Filter products by tab
  const filteredProducts = products.filter(p =>
    activeTab === 'flexible' ? p.type === 'flexible' || p.lockPeriod === 0 : p.type === 'locked' || p.lockPeriod > 0
  );

  const handleSubscribe = (product: SavingsProduct) => {
    setSelectedProduct(product);
    setSubscribeAmount('');
    setSubscribeError(null);
    setShowSubscribeModal(true);
  };

  const confirmSubscribe = async () => {
    if (!selectedProduct || !subscribeAmount) return;

    setSubscribing(true);
    setSubscribeError(null);
    try {
      await savingsService.createDeposit({
        productId: selectedProduct.id,
        asset: selectedProduct.symbol,
        amount: subscribeAmount,
        autoRenew: false,
      });

      // Refresh user deposits
      const depositsResponse = await savingsService.getDeposits();
      if (depositsResponse) {
        setTotalSavings(depositsResponse.totalDeposited || '0.00');
        setTotalEarnings(depositsResponse.totalInterest || '0.00');
      }

      setShowSubscribeModal(false);
      setSelectedProduct(null);
      setSubscribeAmount('');
      setSubscribeError(null);
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setSubscribeError('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const getUserBalance = (symbol: string): string => {
    return userBalances[symbol] || '0.00';
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
                  ${totalSavings}
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
                  +${totalEarnings}
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
          {loading ? (
            <GlassCard variant="default" padding="lg">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <Loader2 size={32} color={colors.primary[400]} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </GlassCard>
          ) : filteredProducts.length === 0 ? (
            <GlassCard variant="default" padding="lg">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                <DollarSign size={48} color={colors.text.tertiary} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.secondary, marginBottom: '8px' }}>
                  No {activeTab} savings products available
                </p>
                <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                  Check back later for new savings opportunities
                </p>
              </div>
            </GlassCard>
          ) : (
          <GlassCard variant="default" padding="none">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ background: isDark ? 'rgba(26, 143, 255, 0.05)' : 'rgba(16, 185, 129, 0.05)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '14px 16px' : '16px 20px',
                  borderBottom: index < filteredProducts.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
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
          )}
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

                {/* Error Banner */}
                {subscribeError && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}
                  >
                    <AlertCircle size={16} color={colors.status.error} />
                    <span style={{ flex: 1, fontSize: '13px', color: colors.status.error }}>
                      {subscribeError}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSubscribeError(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: colors.status.error,
                      }}
                    >
                      <X size={14} />
                    </motion.button>
                  </div>
                )}

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
                    Available: {getUserBalance(selectedProduct.symbol)} {selectedProduct.symbol}
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
                      onClick={() => setSubscribeAmount((parseFloat(getUserBalance(selectedProduct.symbol)) * pct / 100).toString())}
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
                  disabled={subscribing || !subscribeAmount || parseFloat(subscribeAmount) < selectedProduct.minAmount}
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
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
