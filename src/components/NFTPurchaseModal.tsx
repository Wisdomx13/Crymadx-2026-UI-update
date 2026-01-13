import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Wallet,
  Tag,
  Info,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';
import { nftService, PlatformNFT, PurchaseEstimate, PurchaseResult } from '../services/nftService';
import { SUPPORTED_CHAINS, getChainConfig, getExplorerTxUrl } from '../config/chains';

interface NFTPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: PlatformNFT | null;
  onPurchaseComplete?: (result: PurchaseResult) => void;
}

type ModalStep = 'confirm' | 'processing' | 'success' | 'error';

export const NFTPurchaseModal: React.FC<NFTPurchaseModalProps> = ({
  isOpen,
  onClose,
  nft,
  onPurchaseComplete,
}) => {
  const { colors, isDark } = useThemeMode();
  const [step, setStep] = useState<ModalStep>('confirm');
  const [estimate, setEstimate] = useState<PurchaseEstimate | null>(null);
  const [isLoadingEstimate, setIsLoadingEstimate] = useState(true);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Get chain config only if nft exists
  const chainConfig = nft ? getChainConfig(nft.chain) : null;

  // Fetch purchase estimate
  useEffect(() => {
    if (isOpen && nft?.listingId) {
      fetchEstimate();
    }
  }, [isOpen, nft?.listingId]);

  const fetchEstimate = async () => {
    if (!nft) return;
    setIsLoadingEstimate(true);
    try {
      const est = await nftService.getPurchaseEstimate(nft.listingId);
      setEstimate(est);
    } catch (error: any) {
      console.error('Error fetching estimate:', error);
      // Create a local estimate as fallback
      const price = parseFloat(nft.price);
      const fee = price * 0.025;
      setEstimate({
        listingId: nft.listingId,
        nftName: nft.name,
        nftImage: nft.image,
        price: nft.price,
        platformFee: fee.toFixed(6),
        platformFeePercent: 2.5,
        total: (price + fee).toFixed(6),
        currency: nft.currency,
        chain: nft.chain,
        userBalance: '0',
        hasSufficientBalance: false,
      });
    } finally {
      setIsLoadingEstimate(false);
    }
  };

  const handlePurchase = async () => {
    if (!nft) return;
    setStep('processing');
    setErrorMessage('');

    try {
      const result = await nftService.purchaseNFT(nft.listingId);

      // Poll for completion
      const finalResult = await nftService.pollPurchaseStatus(
        result.purchaseId,
        (status) => {
          setPurchaseResult(status);
        }
      );

      setPurchaseResult(finalResult);
      setStep('success');
      onPurchaseComplete?.(finalResult);
    } catch (error: any) {
      console.error('Purchase error:', error);
      setErrorMessage(error.message || 'Purchase failed. Please try again.');
      setStep('error');
    }
  };

  const handleClose = () => {
    if (step === 'processing') return; // Don't allow closing during processing
    setStep('confirm');
    setPurchaseResult(null);
    setErrorMessage('');
    onClose();
  };

  const formatBalance = (balance: string, currency: string): string => {
    const num = parseFloat(balance);
    if (isNaN(num)) return `0.0000 ${currency}`;
    return `${num.toFixed(4)} ${currency}`;
  };

  // Modal backdrop - also check nft to prevent accessing null properties
  if (!isOpen || !nft) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '480px',
            borderRadius: '24px',
            background: isDark
              ? 'linear-gradient(145deg, rgba(15, 25, 20, 0.98), rgba(10, 20, 15, 0.98))'
              : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.98))',
            border: `1px solid ${isDark ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 136, 0.1)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: isDark ? '#fff' : '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <ShoppingCart size={22} color={colors.primary[400]} />
              {step === 'confirm' && 'Confirm Purchase'}
              {step === 'processing' && 'Processing...'}
              {step === 'success' && 'Purchase Complete!'}
              {step === 'error' && 'Purchase Failed'}
            </h2>
            {step !== 'processing' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                }}
              >
                <X size={18} />
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            <AnimatePresence mode="wait">
              {/* Confirm Step */}
              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* NFT Preview */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: '24px',
                      padding: '16px',
                      borderRadius: '16px',
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    }}
                  >
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={nft.image}
                        alt={nft.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          // Use inline SVG data URI as fallback (no network needed)
                          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#2a3a4a"/><text x="50" y="55" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="16" font-family="Arial">NFT</text></svg>`;
                          (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '12px',
                          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                          marginBottom: '4px',
                        }}
                      >
                        {nft.collection}
                      </p>
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: isDark ? '#fff' : '#1a1a1a',
                          marginBottom: '8px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {nft.name}
                      </h3>
                      {/* Chain Badge */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: `${chainConfig?.color}20`,
                          color: chainConfig?.color,
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: chainConfig?.color,
                          }}
                        />
                        {chainConfig?.name || nft.chain}
                      </span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {isLoadingEstimate ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                      }}
                    >
                      <Loader2 size={24} color={colors.primary[400]} className="animate-spin" />
                    </div>
                  ) : estimate ? (
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        marginBottom: '20px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <span style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: '14px' }}>
                          Price
                        </span>
                        <span style={{ color: isDark ? '#fff' : '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
                          {estimate.price} {estimate.currency}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <span
                          style={{
                            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          Platform Fee ({estimate.platformFeePercent}%)
                          <Info size={12} />
                        </span>
                        <span style={{ color: isDark ? '#fff' : '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
                          {estimate.platformFee} {estimate.currency}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '1px',
                          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          margin: '12px 0',
                        }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ color: isDark ? '#fff' : '#1a1a1a', fontWeight: 700, fontSize: '16px' }}>
                          Total
                        </span>
                        <span style={{ color: colors.primary[400], fontWeight: 700, fontSize: '16px' }}>
                          {estimate.total} {estimate.currency}
                        </span>
                      </div>
                      {estimate.totalUsd && (
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: '12px' }}>
                            ≈ ${estimate.totalUsd} USD
                          </span>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Balance Display */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: estimate?.hasSufficientBalance
                        ? `${colors.primary[400]}15`
                        : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${
                        estimate?.hasSufficientBalance ? colors.primary[400] : 'rgba(239, 68, 68, 0.3)'
                      }`,
                      marginBottom: '24px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Wallet size={18} color={estimate?.hasSufficientBalance ? colors.primary[400] : '#ef4444'} />
                      <span
                        style={{
                          color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                          fontSize: '14px',
                        }}
                      >
                        Your Balance
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          color: estimate?.hasSufficientBalance ? colors.primary[400] : '#ef4444',
                          fontWeight: 700,
                          fontSize: '14px',
                        }}
                      >
                        {formatBalance(estimate?.userBalance || '0', nft.currency)}
                      </span>
                      {!estimate?.hasSufficientBalance && (
                        <p
                          style={{
                            color: '#ef4444',
                            fontSize: '11px',
                            marginTop: '2px',
                          }}
                        >
                          Insufficient balance
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        border: 'none',
                        cursor: 'pointer',
                        color: isDark ? '#fff' : '#1a1a1a',
                        fontSize: '15px',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: estimate?.hasSufficientBalance ? 1.02 : 1 }}
                      whileTap={{ scale: estimate?.hasSufficientBalance ? 0.98 : 1 }}
                      onClick={handlePurchase}
                      disabled={!estimate?.hasSufficientBalance || isLoadingEstimate}
                      style={{
                        flex: 2,
                        padding: '14px',
                        borderRadius: '12px',
                        background: estimate?.hasSufficientBalance
                          ? `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`
                          : isDark
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(0,0,0,0.1)',
                        border: 'none',
                        cursor: estimate?.hasSufficientBalance ? 'pointer' : 'not-allowed',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: estimate?.hasSufficientBalance ? 1 : 0.5,
                      }}
                    >
                      Confirm Purchase
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Processing Step */}
              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '64px',
                      height: '64px',
                      margin: '0 auto 24px',
                      borderRadius: '50%',
                      border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderTopColor: colors.primary[400],
                    }}
                  />
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: isDark ? '#fff' : '#1a1a1a',
                      marginBottom: '8px',
                    }}
                  >
                    Processing Purchase
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                    }}
                  >
                    Please wait while we complete your transaction...
                  </p>
                  {purchaseResult && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: colors.primary[400],
                        marginTop: '16px',
                      }}
                    >
                      Status: {purchaseResult.status}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Success Step */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    style={{
                      width: '72px',
                      height: '72px',
                      margin: '0 auto 24px',
                      borderRadius: '50%',
                      background: `${colors.primary[400]}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle size={40} color={colors.primary[400]} />
                  </motion.div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: isDark ? '#fff' : '#1a1a1a',
                      marginBottom: '8px',
                    }}
                  >
                    Purchase Successful!
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                      marginBottom: '24px',
                    }}
                  >
                    {nft.name} has been added to your collection.
                  </p>
                  {purchaseResult?.txHash && (
                    <a
                      href={getExplorerTxUrl(nft.chain, purchaseResult.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: colors.primary[400],
                        fontSize: '13px',
                        textDecoration: 'none',
                        marginBottom: '24px',
                      }}
                    >
                      View Transaction <ExternalLink size={14} />
                    </a>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
                      border: 'none',
                      cursor: 'pointer',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: 700,
                    }}
                  >
                    View My NFTs
                  </motion.button>
                </motion.div>
              )}

              {/* Error Step */}
              {step === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    style={{
                      width: '72px',
                      height: '72px',
                      margin: '0 auto 24px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AlertCircle size={40} color="#ef4444" />
                  </motion.div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: isDark ? '#fff' : '#1a1a1a',
                      marginBottom: '8px',
                    }}
                  >
                    Purchase Failed
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                      marginBottom: '24px',
                    }}
                  >
                    {errorMessage}
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        border: 'none',
                        cursor: 'pointer',
                        color: isDark ? '#fff' : '#1a1a1a',
                        fontSize: '15px',
                        fontWeight: 600,
                      }}
                    >
                      Close
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setStep('confirm');
                        setErrorMessage('');
                        fetchEstimate();
                      }}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
                        border: 'none',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 700,
                      }}
                    >
                      Try Again
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NFTPurchaseModal;
