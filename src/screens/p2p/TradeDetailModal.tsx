import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Clock,
  Shield,
  AlertTriangle,
  Check,
  Star,
  Loader2,
  MessageCircle,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { usePresentationMode } from '../../components/PresentationMode';
import { p2pService, P2PTrade, P2PMessage } from '../../services/p2pService';

interface TradeDetailModalProps {
  isOpen: boolean;
  trade: P2PTrade | null;
  onClose: () => void;
  onTradeUpdate?: (trade: P2PTrade) => void;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({
  isOpen,
  trade,
  onClose,
  onTradeUpdate,
}) => {
  const { colors, isDark } = useThemeMode();
  const { isMobile } = usePresentationMode();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [messages, setMessages] = useState<P2PMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [tradeDetails, setTradeDetails] = useState<P2PTrade | null>(trade);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  // Fetch messages and trade details
  useEffect(() => {
    if (!isOpen || !trade) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [messagesRes, tradeRes] = await Promise.all([
          p2pService.getMessages(trade.id),
          p2pService.getTradeDetails(trade.id),
        ]);
        setMessages(messagesRes.messages || []);
        setTradeDetails(tradeRes.trade);
      } catch (err) {
        console.error('Failed to load trade data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates every 5 seconds
    pollIntervalRef.current = setInterval(async () => {
      try {
        const [messagesRes, tradeRes] = await Promise.all([
          p2pService.getMessages(trade.id),
          p2pService.getTradeDetails(trade.id),
        ]);
        setMessages(messagesRes.messages || []);
        setTradeDetails(tradeRes.trade);
      } catch {
        // Silently fail polling
      }
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isOpen, trade]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !trade) return;

    setSendingMessage(true);
    try {
      const response = await p2pService.sendMessage(trade.id, newMessage.trim());
      setMessages([...messages, response.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!trade) return;

    setActionLoading(true);
    setActionError(null);
    try {
      const response = await p2pService.confirmPayment(trade.id);
      setTradeDetails(response.trade);
      onTradeUpdate?.(response.trade);
    } catch (err: any) {
      setActionError('Failed to confirm payment: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReleaseCrypto = async () => {
    if (!trade) return;

    if (!confirm('Are you sure you want to release the crypto? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      const response = await p2pService.releaseCrypto(trade.id);
      setTradeDetails(response.trade);
      onTradeUpdate?.(response.trade);
    } catch (err: any) {
      setActionError('Failed to release crypto: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelTrade = async () => {
    if (!trade) return;

    if (!confirm('Are you sure you want to cancel this trade?')) {
      return;
    }

    setActionLoading(true);
    setActionError(null);
    try {
      await p2pService.cancelTrade(trade.id, 'User cancelled');
      onClose();
    } catch (err: any) {
      setActionError('Failed to cancel trade: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleInitiateDispute = async () => {
    if (!trade || !disputeReason.trim()) return;

    setActionLoading(true);
    setActionError(null);
    try {
      await p2pService.initiateDispute(trade.id, disputeReason.trim());
      setShowDispute(false);
      setDisputeReason('');
      // Refresh trade details
      const tradeRes = await p2pService.getTradeDetails(trade.id);
      setTradeDetails(tradeRes.trade);
      onTradeUpdate?.(tradeRes.trade);
    } catch (err: any) {
      setActionError('Failed to initiate dispute: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRateTrade = async () => {
    if (!trade) return;

    try {
      await p2pService.rateTrade(trade.id, rating);
      setShowRating(false);
    } catch {
      // Silent fail
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.status.success;
      case 'cancelled':
        return colors.status.error;
      case 'disputed':
        return colors.status.warning;
      default:
        return colors.primary[400];
    }
  };

  const getTimeRemaining = () => {
    if (!tradeDetails?.paymentDeadline) return null;
    const deadline = new Date(tradeDetails.paymentDeadline).getTime();
    const now = Date.now();
    const remaining = deadline - now;

    if (remaining <= 0) return 'Expired';

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !trade) return null;

  const currentTrade = tradeDetails || trade;
  const isBuyer = currentTrade.isBuyer;
  const status = currentTrade.status;

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
          padding: isMobile ? '0' : '20px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '800px',
            height: isMobile ? '100%' : '90vh',
            maxHeight: isMobile ? '100%' : '700px',
            display: 'flex',
            flexDirection: 'column',
            background: isDark ? 'rgba(20, 20, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            borderRadius: isMobile ? '0' : '20px',
            border: isMobile ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          }}>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 700,
                color: colors.text.primary,
                marginBottom: '4px',
              }}>
                Trade #{trade.id.slice(0, 8)}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: isBuyer ? colors.trading.buyBg : colors.trading.sellBg,
                  color: isBuyer ? colors.trading.buy : colors.trading.sell,
                }}>
                  {isBuyer ? 'Buying' : 'Selling'}
                </span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: `${getStatusColor(status)}20`,
                  color: getStatusColor(status),
                }}>
                  {status.replace('_', ' ')}
                </span>
              </div>
            </div>
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

          {/* Error Banner */}
          <AnimatePresence>
            {actionError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <AlertTriangle size={16} color={colors.status.error} />
                <span style={{ flex: 1, fontSize: '13px', color: colors.status.error }}>
                  {actionError}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActionError(null)}
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Trade Info Panel */}
            <div style={{
              width: isMobile ? '100%' : '280px',
              borderRight: isMobile ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              padding: '16px',
              overflowY: 'auto',
              display: isMobile ? 'none' : 'block',
            }}>
              {/* Trade Details */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: colors.text.tertiary, marginBottom: '12px' }}>
                  Trade Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Crypto</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                      {currentTrade.crypto || 'USDT'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Amount</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                      {parseFloat(currentTrade.cryptoAmount || currentTrade.amount || '0').toFixed(4)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Price</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                      ${currentTrade.price || '0.00'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: colors.text.tertiary }}>Total</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: colors.primary[400] }}>
                      ${parseFloat(currentTrade.fiatAmount || currentTrade.total || '0').toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Counterparty */}
              {currentTrade.counterparty && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: colors.text.tertiary, marginBottom: '12px' }}>
                    {isBuyer ? 'Seller' : 'Buyer'}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '10px',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors.primary[400]}30, ${colors.secondary[400]}30)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <User size={18} color={colors.primary[400]} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                        {currentTrade.counterparty.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Star size={12} color={colors.status.warning} fill={colors.status.warning} />
                        <span style={{ fontSize: '11px', color: colors.text.tertiary }}>
                          {currentTrade.counterparty.rating.toFixed(1)} • {currentTrade.counterparty.completedOrders} orders
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Time Remaining */}
              {(status === 'pending' || status === 'payment_sent') && (
                <div style={{
                  padding: '12px',
                  background: `${colors.status.warning}15`,
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Clock size={16} color={colors.status.warning} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: colors.status.warning }}>
                      Time Remaining
                    </span>
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: colors.text.primary }}>
                    {getTimeRemaining()}
                  </p>
                </div>
              )}

              {/* Escrow Status */}
              <div style={{
                padding: '12px',
                background: `${colors.primary[400]}10`,
                borderRadius: '10px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} color={colors.primary[400]} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: colors.primary[400] }}>
                    Escrow: {currentTrade.escrowStatus || 'Locked'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Buyer: Confirm Payment (when pending) */}
                {isBuyer && status === 'pending' && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmPayment}
                    disabled={actionLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: colors.trading.buy,
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      opacity: actionLoading ? 0.7 : 1,
                    }}
                  >
                    {actionLoading ? 'Processing...' : "I've Paid"}
                  </motion.button>
                )}

                {/* Seller: Release Crypto (when payment_sent) */}
                {!isBuyer && status === 'payment_sent' && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReleaseCrypto}
                    disabled={actionLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: colors.status.success,
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      opacity: actionLoading ? 0.7 : 1,
                    }}
                  >
                    {actionLoading ? 'Processing...' : 'Release Crypto'}
                  </motion.button>
                )}

                {/* Cancel (only if pending and buyer) */}
                {status === 'pending' && isBuyer && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelTrade}
                    disabled={actionLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: `1px solid ${colors.status.error}`,
                      background: 'transparent',
                      color: colors.status.error,
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancel Trade
                  </motion.button>
                )}

                {/* Dispute Button */}
                {(status === 'pending' || status === 'payment_sent') && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDispute(true)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: `1px solid ${colors.status.warning}`,
                      background: 'transparent',
                      color: colors.status.warning,
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <AlertTriangle size={14} />
                    Open Dispute
                  </motion.button>
                )}

                {/* Rate Trade */}
                {status === 'completed' && !showRating && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowRating(true)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: colors.primary[400],
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Star size={14} />
                    Rate Trade
                  </motion.button>
                )}
              </div>
            </div>

            {/* Chat Panel */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* Chat Header (mobile only) */}
              {isMobile && (
                <div style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Total Amount</p>
                      <p style={{ fontSize: '18px', fontWeight: 700, color: colors.primary[400] }}>
                        ${parseFloat(currentTrade.fiatAmount || currentTrade.total || '0').toFixed(2)}
                      </p>
                    </div>
                    {status === 'pending' && isBuyer && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmPayment}
                        disabled={actionLoading}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: colors.trading.buy,
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        I've Paid
                      </motion.button>
                    )}
                    {!isBuyer && status === 'payment_sent' && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReleaseCrypto}
                        disabled={actionLoading}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: colors.status.success,
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Release
                      </motion.button>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {loading && (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Loader2 size={24} color={colors.primary[400]} style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                )}

                {!loading && messages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <MessageCircle size={32} color={colors.text.tertiary} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                      No messages yet. Send a message to start the conversation.
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.isOwn ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: msg.isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.isOwn
                        ? colors.primary[400]
                        : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                      color: msg.isOwn ? '#fff' : colors.text.primary,
                    }}>
                      {!msg.isOwn && (
                        <p style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          marginBottom: '4px',
                          color: msg.isOwn ? 'rgba(255,255,255,0.8)' : colors.text.tertiary,
                        }}>
                          {msg.senderName}
                        </p>
                      )}
                      <p style={{ fontSize: '14px', lineHeight: 1.5 }}>{msg.message}</p>
                      {msg.attachmentUrl && (
                        <div style={{ marginTop: '8px' }}>
                          <img
                            src={msg.attachmentUrl}
                            alt="Attachment"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              borderRadius: '8px',
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <span style={{
                      fontSize: '10px',
                      color: colors.text.tertiary,
                      marginTop: '4px',
                    }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              {(status === 'pending' || status === 'payment_sent' || status === 'disputed') && (
                <div style={{
                  padding: '12px 16px',
                  borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                  }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        color: colors.text.primary,
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        border: 'none',
                        background: newMessage.trim() ? colors.primary[400] : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {sendingMessage ? (
                        <Loader2 size={18} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <Send size={18} color={newMessage.trim() ? '#fff' : colors.text.tertiary} />
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rating Modal */}
          {showRating && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}>
              <div style={{
                background: isDark ? 'rgba(30,30,40,0.98)' : '#fff',
                borderRadius: '16px',
                padding: '24px',
                width: '100%',
                maxWidth: '320px',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary, marginBottom: '16px', textAlign: 'center' }}>
                  Rate this trade
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <Star
                        size={32}
                        color={colors.status.warning}
                        fill={star <= rating ? colors.status.warning : 'transparent'}
                      />
                    </motion.button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowRating(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                      background: 'transparent',
                      color: colors.text.secondary,
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Skip
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRateTrade}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: colors.primary[400],
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Submit
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Dispute Modal */}
          {showDispute && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}>
              <div style={{
                background: isDark ? 'rgba(30,30,40,0.98)' : '#fff',
                borderRadius: '16px',
                padding: '24px',
                width: '100%',
                maxWidth: '400px',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: colors.text.primary, marginBottom: '8px' }}>
                  Open Dispute
                </h3>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '16px' }}>
                  Please describe the issue you are facing with this trade.
                </p>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Describe your issue..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    color: colors.text.primary,
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    marginBottom: '16px',
                  }}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDispute(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                      background: 'transparent',
                      color: colors.text.secondary,
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInitiateDispute}
                    disabled={!disputeReason.trim() || actionLoading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: colors.status.warning,
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: !disputeReason.trim() || actionLoading ? 'not-allowed' : 'pointer',
                      opacity: !disputeReason.trim() || actionLoading ? 0.7 : 1,
                    }}
                  >
                    {actionLoading ? 'Submitting...' : 'Submit Dispute'}
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TradeDetailModal;
