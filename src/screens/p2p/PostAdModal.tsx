import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Info, Loader2, CreditCard, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { usePresentationMode } from '../../components/PresentationMode';
import { CryptoIcon } from '../../components';
import { p2pService, CreateP2POrderParams, UserPaymentMethod } from '../../services/p2pService';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const cryptoOptions = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP'];
const fiatOptions = ['USD', 'EUR', 'GBP', 'NGN', 'INR', 'AED'];

// Map payment method types to display names
const paymentTypeLabels: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  paypal: 'PayPal',
  wise: 'Wise',
  zelle: 'Zelle',
  venmo: 'Venmo',
  cashapp: 'Cash App',
  revolut: 'Revolut',
  other: 'Other',
};

export const PostAdModal: React.FC<PostAdModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { colors, isDark } = useThemeMode();
  const { isMobile } = usePresentationMode();

  const [type, setType] = useState<'buy' | 'sell'>('sell');
  const [crypto, setCrypto] = useState('USDT');
  const [fiat, setFiat] = useState('USD');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [minLimit, setMinLimit] = useState('10');
  const [maxLimit, setMaxLimit] = useState('');
  const [selectedPaymentMethodIds, setSelectedPaymentMethodIds] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User's saved payment methods
  const [userPaymentMethods, setUserPaymentMethods] = useState<UserPaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [paymentMethodsError, setPaymentMethodsError] = useState<string | null>(null);

  // Fetch user's saved payment methods
  useEffect(() => {
    if (!isOpen) return;

    const fetchPaymentMethods = async () => {
      setLoadingPaymentMethods(true);
      setPaymentMethodsError(null);
      try {
        const response = await p2pService.getPaymentMethods();
        setUserPaymentMethods(response?.paymentMethods || []);
        // Auto-select default payment method
        const defaultMethod = response?.paymentMethods?.find(m => m.isDefault);
        if (defaultMethod && selectedPaymentMethodIds.length === 0) {
          setSelectedPaymentMethodIds([defaultMethod.id]);
        }
      } catch (err: any) {
        // Silently handle 404 and HTML parse errors (backend endpoint doesn't exist yet)
        const errorMessage = err?.message || '';
        const is404OrNotFound =
          err?.status === 404 ||
          errorMessage.includes('404') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('Unexpected token') ||
          errorMessage.includes('DOCTYPE');

        if (!is404OrNotFound) {
          console.error('Failed to fetch payment methods:', err);
          setPaymentMethodsError('Could not load your saved payment methods');
        }
        // Otherwise silently fail - user can still create ad without saved methods
        setUserPaymentMethods([]);
      } finally {
        setLoadingPaymentMethods(false);
      }
    };

    fetchPaymentMethods();
  }, [isOpen]);

  // Toggle payment method selection by ID
  const togglePaymentMethod = (methodId: string) => {
    if (selectedPaymentMethodIds.includes(methodId)) {
      if (selectedPaymentMethodIds.length > 1) {
        setSelectedPaymentMethodIds(selectedPaymentMethodIds.filter(id => id !== methodId));
      }
    } else {
      setSelectedPaymentMethodIds([...selectedPaymentMethodIds, methodId]);
    }
  };

  // Navigate to payment methods management
  const handleManagePaymentMethods = () => {
    onClose();
    navigate('/p2p/payment-methods');
  };

  const handleSubmit = async () => {
    if (!price || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(price) <= 0 || parseFloat(amount) <= 0) {
      setError('Price and amount must be greater than 0');
      return;
    }

    if (selectedPaymentMethodIds.length === 0) {
      setError('Please select at least one payment method');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the selected payment method labels for the API
      const selectedMethods = userPaymentMethods
        .filter(m => selectedPaymentMethodIds.includes(m.id))
        .map(m => paymentTypeLabels[m.type] || m.type);

      const params: CreateP2POrderParams = {
        type,
        crypto,
        fiat,
        price,
        amount,
        minLimit: minLimit || '10',
        maxLimit: maxLimit || (parseFloat(amount) * parseFloat(price)).toString(),
        paymentMethods: selectedMethods.length > 0 ? selectedMethods : ['Bank Transfer'],
        timeLimit,
      };

      await p2pService.createOrder(params);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: isDark ? 'rgba(20, 20, 30, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            borderRadius: '20px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: colors.text.primary,
            }}>
              Post New Ad
            </h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} color={colors.text.secondary} />
            </motion.button>
          </div>

          {/* Form Content */}
          <div style={{ padding: '24px' }}>
            {/* Buy/Sell Toggle */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                I want to
              </label>
              <div style={{
                display: 'flex',
                gap: '8px',
                padding: '4px',
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderRadius: '12px',
              }}>
                {(['sell', 'buy'] as const).map((t) => (
                  <motion.button
                    key={t}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType(t)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: type === t
                        ? t === 'buy' ? colors.trading.buyBg : colors.trading.sellBg
                        : 'transparent',
                      color: type === t
                        ? t === 'buy' ? colors.trading.buy : colors.trading.sell
                        : colors.text.tertiary,
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {t} Crypto
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Crypto Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                Cryptocurrency
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {cryptoOptions.map((c) => (
                  <motion.button
                    key={c}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCrypto(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${crypto === c ? colors.primary[400] : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      background: crypto === c ? `${colors.primary[400]}15` : 'transparent',
                      color: crypto === c ? colors.primary[400] : colors.text.secondary,
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    <CryptoIcon symbol={c} size={16} />
                    {c}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Fiat Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                Fiat Currency
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {fiatOptions.map((f) => (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFiat(f)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${fiat === f ? colors.primary[400] : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      background: fiat === f ? `${colors.primary[400]}15` : 'transparent',
                      color: fiat === f ? colors.primary[400] : colors.text.secondary,
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {f}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                Price per {crypto} ({fiat})
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  color: colors.text.primary,
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                Total Amount ({crypto})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  color: colors.text.primary,
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
              {price && amount && (
                <p style={{ fontSize: '12px', color: colors.text.tertiary, marginTop: '6px' }}>
                  Total value: {fiat} {(parseFloat(price || '0') * parseFloat(amount || '0')).toFixed(2)}
                </p>
              )}
            </div>

            {/* Order Limits */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                  Min Limit ({fiat})
                </label>
                <input
                  type="number"
                  value={minLimit}
                  onChange={(e) => setMinLimit(e.target.value)}
                  placeholder="10"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    color: colors.text.primary,
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                  Max Limit ({fiat})
                </label>
                <input
                  type="number"
                  value={maxLimit}
                  onChange={(e) => setMaxLimit(e.target.value)}
                  placeholder="Auto"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    color: colors.text.primary,
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: colors.text.secondary }}>
                  Payment Methods
                </label>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleManagePaymentMethods}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: colors.primary[400],
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Settings size={12} />
                  Manage
                </motion.button>
              </div>

              {/* Loading state */}
              {loadingPaymentMethods && (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <Loader2 size={20} color={colors.primary[400]} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              )}

              {/* No saved payment methods */}
              {!loadingPaymentMethods && userPaymentMethods.length === 0 && (
                <div style={{
                  padding: '20px',
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <CreditCard size={32} color={colors.text.tertiary} style={{ opacity: 0.5, marginBottom: '10px' }} />
                  <p style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '12px' }}>
                    You haven't added any payment methods yet
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleManagePaymentMethods}
                    style={{
                      padding: '10px 16px',
                      background: colors.primary[400],
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Plus size={14} />
                    Add Payment Method
                  </motion.button>
                </div>
              )}

              {/* User's saved payment methods */}
              {!loadingPaymentMethods && userPaymentMethods.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {userPaymentMethods.map((method) => {
                    const isSelected = selectedPaymentMethodIds.includes(method.id);
                    return (
                      <motion.button
                        key={method.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => togglePaymentMethod(method.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: `1px solid ${isSelected ? colors.primary[400] : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                          background: isSelected ? `${colors.primary[400]}10` : 'transparent',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? colors.primary[400] : colors.text.tertiary}`,
                            background: isSelected ? colors.primary[400] : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {isSelected && <CheckCircle size={12} color="#fff" />}
                          </div>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                              {method.label}
                            </p>
                            <p style={{ fontSize: '11px', color: colors.text.tertiary }}>
                              {paymentTypeLabels[method.type] || method.type}
                              {method.isDefault && (
                                <span style={{ marginLeft: '6px', color: colors.primary[400] }}>• Default</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}

                  {/* Add more button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleManagePaymentMethods}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '12px',
                      borderRadius: '10px',
                      border: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      background: 'transparent',
                      color: colors.text.tertiary,
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    Add Another Payment Method
                  </motion.button>
                </div>
              )}
            </div>

            {/* Time Limit */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                Payment Time Limit: {timeLimit} minutes
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTimeLimit(Math.max(15, timeLimit - 15))}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={16} color={colors.text.secondary} />
                </motion.button>
                <div style={{
                  flex: 1,
                  height: '6px',
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  borderRadius: '3px',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${((timeLimit - 15) / 45) * 100}%`,
                    background: colors.primary[400],
                    borderRadius: '3px',
                  }} />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTimeLimit(Math.min(60, timeLimit + 15))}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={16} color={colors.text.secondary} />
                </motion.button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '12px 16px',
                background: `${colors.status.error}15`,
                borderRadius: '10px',
                marginBottom: '16px',
              }}>
                <p style={{ fontSize: '13px', color: colors.status.error }}>{error}</p>
              </div>
            )}

            {/* Info */}
            <div style={{
              display: 'flex',
              gap: '10px',
              padding: '12px 16px',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: '10px',
              marginBottom: '20px',
            }}>
              <Info size={18} color={colors.primary[400]} style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '12px', color: colors.text.tertiary, lineHeight: 1.5 }}>
                {type === 'sell'
                  ? 'When a buyer initiates a trade, your crypto will be locked in escrow until the buyer confirms payment.'
                  : 'When you create a buy order, sellers will be able to initiate trades with you.'}
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={loading || !price || !amount || selectedPaymentMethodIds.length === 0}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: loading || !price || !amount || selectedPaymentMethodIds.length === 0
                  ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  : `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[500]})`,
                color: loading || !price || !amount || selectedPaymentMethodIds.length === 0 ? colors.text.tertiary : '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading || !price || !amount || selectedPaymentMethodIds.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Creating Order...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create {type === 'sell' ? 'Sell' : 'Buy'} Order
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostAdModal;
