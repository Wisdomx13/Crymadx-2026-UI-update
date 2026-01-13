import React, { useState, useEffect, useCallback } from 'react';
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
  Loader2,
  AlertCircle,
  RefreshCw,
  Key,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { CryptoIcon, ResponsiveLayout, Button, Input } from '../../components';
import { balanceService, withdrawalService, withdrawalLimits, priceService } from '../../services';
import type { Balance } from '../../services/balanceService';
import { nativeAssets, chainInfo } from '../../config/assets';

// Build chain mapping from assets config
const chainMapping: Record<string, { network: string; chainId: string }> = {};
nativeAssets.forEach(asset => {
  // Map by symbol (e.g., BTC, ETH) and also by chainId
  chainMapping[asset.symbol.toUpperCase()] = {
    network: asset.network,
    chainId: asset.chainId,
  };
});

interface CryptoAsset {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  network: string;
  chainId: string;
}

type Step = 'select' | 'amount' | 'otp' | 'confirm' | 'success';

export const WithdrawScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useThemeMode();
  const [step, setStep] = useState<Step>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(null);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // New state for real API integration
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [feeEstimate, setFeeEstimate] = useState<{ networkFee: string; totalFee: string; receiveAmount: string } | null>(null);
  const [isLoadingFee, setIsLoadingFee] = useState(false);

  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Success state
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Fetch balances
  const fetchAssets = useCallback(async () => {
    setIsLoadingAssets(true);
    setError(null);

    try {
      const [balances, prices] = await Promise.all([
        balanceService.getAllBalances(),
        priceService.getAllPrices(),
      ]);

      const transformedAssets: CryptoAsset[] = balances
        .filter((b: Balance) => parseFloat(b.available) > 0)
        .map((balance: Balance) => {
          const symbol = balance.currency.toUpperCase();
          const chain = chainMapping[symbol] || { network: 'Unknown', chainId: symbol.toLowerCase() };
          const price = prices[symbol]?.usd || 0;
          const availableNum = parseFloat(balance.available);
          const usdValue = availableNum * price;

          return {
            symbol,
            name: balance.currency,
            balance: balance.available,
            usdValue: usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            network: chain.network,
            chainId: chain.chainId,
          };
        });

      setAssets(transformedAssets);
    } catch (err: any) {
      console.error('Error fetching assets:', err);
      setError(err.message || 'Failed to load assets');
    } finally {
      setIsLoadingAssets(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Validate address when it changes
  useEffect(() => {
    if (withdrawAddress && selectedCrypto) {
      const validation = withdrawalService.validateAddress(selectedCrypto.chainId, withdrawAddress);
      setAddressError(validation.valid ? null : validation.error || 'Invalid address');
    } else {
      setAddressError(null);
    }
  }, [withdrawAddress, selectedCrypto]);

  // Fetch fee estimate when amount changes
  useEffect(() => {
    if (amount && selectedCrypto && parseFloat(amount) > 0) {
      const fetchFee = async () => {
        setIsLoadingFee(true);
        try {
          const estimate = await withdrawalService.getFeeEstimate(selectedCrypto.chainId, amount);
          const receiveAmount = (parseFloat(amount) - parseFloat(estimate.totalFee)).toFixed(8);
          setFeeEstimate({
            networkFee: estimate.networkFee,
            totalFee: estimate.totalFee,
            receiveAmount: parseFloat(receiveAmount) > 0 ? receiveAmount : '0',
          });
        } catch (err) {
          console.error('Error fetching fee estimate:', err);
          // Use default fees
          const limits = withdrawalLimits[selectedCrypto.chainId] || { minWithdrawal: '0.001', networkFee: '0.001' };
          const fee = limits.networkFee;
          const receiveAmount = (parseFloat(amount) - parseFloat(fee)).toFixed(8);
          setFeeEstimate({
            networkFee: fee,
            totalFee: fee,
            receiveAmount: parseFloat(receiveAmount) > 0 ? receiveAmount : '0',
          });
        } finally {
          setIsLoadingFee(false);
        }
      };

      const debounce = setTimeout(fetchFee, 500);
      return () => clearTimeout(debounce);
    } else {
      setFeeEstimate(null);
    }
  }, [amount, selectedCrypto]);

  const filteredCrypto = assets.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCrypto = (crypto: CryptoAsset) => {
    setSelectedCrypto(crypto);
    setWithdrawAddress('');
    setAmount('');
    setAddressError(null);
    setFeeEstimate(null);
    setStep('amount');
  };

  const handleContinueToOtp = async () => {
    // Validate before proceeding
    if (!withdrawAddress || addressError) {
      setError('Please enter a valid withdrawal address');
      return;
    }

    const amountNum = parseFloat(amount);
    const balanceNum = parseFloat(selectedCrypto?.balance || '0');

    if (amountNum <= 0 || amountNum > balanceNum) {
      setError('Invalid withdrawal amount');
      return;
    }

    setStep('otp');
    setOtpCode('');
    setOtpError(null);
    setOtpSent(false);
    setOtpToken(null);
  };

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setOtpError(null);

    try {
      await withdrawalService.requestWithdrawalOTP();
      setOtpSent(true);
      setOtpCountdown(60);
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setOtpError(err.message || 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setOtpError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setOtpError(null);

    try {
      const result = await withdrawalService.verifyWithdrawalOTP(otpCode);
      if (result.verified) {
        setOtpToken(result.token || 'verified');
        setStep('confirm');
      } else {
        setOtpError('Invalid OTP code');
      }
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setOtpError(err.message || 'Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedCrypto || !feeEstimate) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await withdrawalService.createWithdrawal({
        chain: selectedCrypto.chainId,
        amount,
        address: withdrawAddress,
        verificationToken: otpToken || undefined,
      });

      setTransactionId(response.withdrawal?.id || null);
      setStep('success');
    } catch (err: any) {
      console.error('Withdrawal error:', err);
      setError(err.message || 'Withdrawal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'select') {
      navigate('/wallet');
    } else if (step === 'amount') {
      setStep('select');
    } else if (step === 'otp') {
      setStep('amount');
    } else if (step === 'confirm') {
      setStep('otp');
    }
  };

  const limits = selectedCrypto ? withdrawalLimits[selectedCrypto.chainId] : null;

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
            onClick={handleBack}
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
              {step === 'otp' && 'Verify with OTP'}
              {step === 'confirm' && 'Confirm your withdrawal'}
              {step === 'success' && 'Withdrawal submitted'}
            </p>
          </div>
        </motion.div>

        {/* Progress Steps */}
        {step !== 'success' && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {['select', 'amount', 'otp', 'confirm'].map((s, i) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: ['select', 'amount', 'otp', 'confirm'].indexOf(step) >= i
                    ? colors.primary[400]
                    : colors.glass.border,
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <AlertCircle size={20} color="#ef4444" />
            <span style={{ fontSize: '14px', color: '#ef4444' }}>{error}</span>
          </motion.div>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchAssets}
                  disabled={isLoadingAssets}
                  style={{
                    padding: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.text.tertiary,
                  }}
                >
                  <RefreshCw size={18} className={isLoadingAssets ? 'animate-spin' : ''} />
                </motion.button>
              </div>

              {/* Loading state */}
              {isLoadingAssets ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 20px',
                  background: colors.background.secondary,
                  borderRadius: '16px',
                }}>
                  <Loader2 size={32} color={colors.primary[400]} className="animate-spin" />
                  <p style={{ marginTop: '16px', color: colors.text.tertiary }}>Loading assets...</p>
                </div>
              ) : filteredCrypto.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 20px',
                  background: colors.background.secondary,
                  borderRadius: '16px',
                }}>
                  <Wallet size={48} color={colors.text.tertiary} />
                  <p style={{ marginTop: '16px', color: colors.text.secondary, fontWeight: 600 }}>
                    No withdrawable assets
                  </p>
                  <p style={{ marginTop: '8px', color: colors.text.tertiary, fontSize: '14px' }}>
                    Deposit funds to start withdrawing
                  </p>
                </div>
              ) : (
                /* Crypto List */
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
                            {crypto.network}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                            {parseFloat(crypto.balance).toFixed(6)} {crypto.symbol}
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
              )}
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
                    {selectedCrypto.symbol}
                  </p>
                  <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                    Available: {parseFloat(selectedCrypto.balance).toFixed(6)} {selectedCrypto.symbol}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Network</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: colors.primary[400] }}>
                    {selectedCrypto.network}
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
                    placeholder={`Enter ${selectedCrypto.symbol} ${selectedCrypto.network} address`}
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    leftIcon={<Wallet size={18} />}
                    error={addressError || undefined}
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
                      onClick={() => {
                        const maxAmount = parseFloat(selectedCrypto.balance);
                        const fee = feeEstimate?.totalFee || limits?.networkFee || '0';
                        const netMax = Math.max(0, maxAmount - parseFloat(fee));
                        setAmount(netMax.toFixed(8));
                      }}
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
                  {limits && (
                    <p style={{ fontSize: '12px', color: colors.text.tertiary, marginTop: '8px' }}>
                      Minimum withdrawal: {limits.minWithdrawal} {selectedCrypto.symbol}
                    </p>
                  )}
                </div>

                {/* Fee Info */}
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(0, 255, 136, 0.05)',
                    borderRadius: '12px',
                  }}
                >
                  {isLoadingFee ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Loader2 size={16} className="animate-spin" color={colors.text.tertiary} />
                      <span style={{ fontSize: '13px', color: colors.text.tertiary }}>Calculating fees...</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: colors.text.tertiary }}>Network Fee</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                          {feeEstimate?.networkFee || limits?.networkFee || '—'} {selectedCrypto.symbol}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: colors.text.tertiary }}>You'll receive</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: colors.primary[400] }}>
                          {feeEstimate?.receiveAmount || '0'} {selectedCrypto.symbol}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleContinueToOtp}
                disabled={!withdrawAddress || !!addressError || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(selectedCrypto.balance)}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 'otp' && selectedCrypto && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div
                style={{
                  padding: '32px 24px',
                  background: colors.background.secondary,
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '16px',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  style={{
                    width: '72px',
                    height: '72px',
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    background: 'rgba(0, 255, 136, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Key size={32} color={colors.primary[400]} />
                </motion.div>

                <h3 style={{ fontSize: '20px', fontWeight: 700, color: colors.text.primary, marginBottom: '8px' }}>
                  Security Verification
                </h3>
                <p style={{ fontSize: '14px', color: colors.text.tertiary, marginBottom: '24px' }}>
                  For your security, please verify this withdrawal with OTP
                </p>

                {!otpSent ? (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleSendOtp}
                    loading={isSendingOtp}
                  >
                    Send OTP to Email
                  </Button>
                ) : (
                  <>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '8px', display: 'block' }}>
                        Enter 6-digit OTP code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        style={{
                          width: '100%',
                          padding: '16px',
                          background: 'rgba(0, 255, 136, 0.05)',
                          border: `1px solid ${otpError ? '#ef4444' : colors.glass.border}`,
                          borderRadius: '12px',
                          fontSize: '24px',
                          fontWeight: 700,
                          textAlign: 'center',
                          letterSpacing: '8px',
                          color: colors.text.primary,
                          outline: 'none',
                        }}
                      />
                    </div>

                    {otpError && (
                      <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '16px' }}>
                        {otpError}
                      </p>
                    )}

                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleVerifyOtp}
                      loading={isLoading}
                      disabled={otpCode.length !== 6}
                      style={{ marginBottom: '16px' }}
                    >
                      Verify OTP
                    </Button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendOtp}
                      disabled={otpCountdown > 0 || isSendingOtp}
                      style={{
                        padding: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: otpCountdown > 0 ? colors.text.tertiary : colors.primary[400],
                        fontSize: '14px',
                        cursor: otpCountdown > 0 ? 'default' : 'pointer',
                      }}
                    >
                      {otpCountdown > 0 ? `Resend OTP in ${otpCountdown}s` : 'Resend OTP'}
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {step === 'confirm' && selectedCrypto && feeEstimate && (
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
                        {selectedCrypto.symbol}
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
                      {feeEstimate.totalFee} {selectedCrypto.symbol}
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
                      {feeEstimate.receiveAmount} {selectedCrypto.symbol}
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
                  {transactionId || 'Processing...'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="outline" size="lg" fullWidth onClick={() => navigate('/wallet/history')}>
                  View History
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/wallet')}>
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
