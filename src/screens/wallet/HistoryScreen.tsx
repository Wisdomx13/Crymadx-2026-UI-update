import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Download,
  Loader2,
} from 'lucide-react';
import { ResponsiveLayout } from '../../components/ResponsiveLayout';
import { CryptoIcon } from '../../components/CryptoIcon';
import { useThemeMode } from '../../theme/ThemeContext';
import { balanceService } from '../../services';
import { useAuth } from '../../context/AuthContext';

type TransactionType = 'all' | 'deposit' | 'withdraw' | 'convert';
type TransactionStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'convert';
  asset: string;
  assetTo?: string;
  amount: number;
  amountTo?: number;
  status: TransactionStatus;
  date: string;
  time: string;
  txHash?: string;
  network?: string;
  fee?: number;
  address?: string;
}

export const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors, mode } = useThemeMode();
  const { isAuthenticated } = useAuth();
  const isDark = mode === 'dark';

  const [filter, setFilter] = useState<TransactionType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await balanceService.getTransactions();
        if (response.transactions) {
          const mappedTransactions: Transaction[] = response.transactions.map((tx: any) => {
            const createdAt = new Date(tx.createdAt || tx.timestamp || Date.now());
            return {
              id: tx.id || tx.txId,
              type: tx.type?.toLowerCase() || 'deposit',
              asset: tx.asset || tx.currency || 'USDT',
              assetTo: tx.toAsset || tx.toCurrency,
              amount: parseFloat(tx.amount || '0'),
              amountTo: tx.toAmount ? parseFloat(tx.toAmount) : undefined,
              status: (tx.status?.toLowerCase() || 'pending') as TransactionStatus,
              date: createdAt.toISOString().split('T')[0],
              time: createdAt.toTimeString().split(' ')[0],
              txHash: tx.txHash || tx.transactionHash,
              network: tx.network || tx.chain,
              fee: tx.fee ? parseFloat(tx.fee) : undefined,
              address: tx.address || tx.toAddress || tx.fromAddress,
            };
          });
          setTransactions(mappedTransactions);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isAuthenticated]);

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filter === 'all' || tx.type === filter;
    const matchesSearch = tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.assetTo && tx.assetTo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return colors.status.success;
      case 'pending':
        return colors.status.warning;
      case 'failed':
        return colors.status.error;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft size={16} />;
      case 'withdraw':
        return <ArrowUpRight size={16} />;
      case 'convert':
        return <ArrowLeftRight size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return colors.status.success;
      case 'withdraw':
        return colors.status.error;
      case 'convert':
        return colors.primary[400];
    }
  };

  const filterButtons: { id: TransactionType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'deposit', label: 'Deposits' },
    { id: 'withdraw', label: 'Withdrawals' },
    { id: 'convert', label: 'Conversions' },
  ];

  return (
    <ResponsiveLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
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
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: colors.background.card,
              border: `1px solid ${colors.glass.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: colors.text.primary,
            }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: colors.text.primary,
              margin: 0,
            }}>
              Transaction History
            </h1>
            <p style={{
              fontSize: '14px',
              color: colors.text.secondary,
              margin: '4px 0 0 0',
            }}>
              View all your deposits, withdrawals, and conversions
            </p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* Search Bar */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              flex: 1,
              minWidth: '200px',
              position: 'relative',
            }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.text.tertiary,
                }}
              />
              <input
                type="text"
                placeholder="Search by asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  borderRadius: '12px',
                  background: colors.background.card,
                  border: `1px solid ${colors.glass.border}`,
                  color: colors.text.primary,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: showFilters ? `${colors.primary[400]}20` : colors.background.card,
                border: `1px solid ${showFilters ? colors.primary[400] : colors.glass.border}`,
                color: showFilters ? colors.primary[400] : colors.text.secondary,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <Filter size={18} />
              Filters
              <ChevronDown
                size={16}
                style={{
                  transform: showFilters ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                color: colors.text.secondary,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <Download size={18} />
              Export
            </motion.button>
          </div>

          {/* Filter Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            {filterButtons.map((btn) => (
              <motion.button
                key={btn.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(btn.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: filter === btn.id
                    ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[500]})`
                    : colors.background.card,
                  border: `1px solid ${filter === btn.id ? 'transparent' : colors.glass.border}`,
                  color: filter === btn.id ? '#fff' : colors.text.secondary,
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: colors.background.card,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.glass.border}`,
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 120px',
            padding: '16px 24px',
            borderBottom: `1px solid ${colors.glass.border}`,
            gap: '12px',
          }}>
            {['Type', 'Asset', 'Amount', 'Date & Time', 'Status'].map((header) => (
              <span key={header} style={{
                fontSize: '12px',
                fontWeight: 600,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {header}
              </span>
            ))}
          </div>

          {/* Transactions */}
          {loading ? (
            <div style={{
              padding: '60px 24px',
              textAlign: 'center',
            }}>
              <Loader2 size={40} style={{ color: colors.primary[400], marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '14px', color: colors.text.secondary }}>Loading transactions...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ background: `${colors.primary[400]}08` }}
                onClick={() => setSelectedTransaction(tx)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 120px',
                  padding: '16px 24px',
                  borderBottom: `1px solid ${colors.glass.border}`,
                  gap: '12px',
                  cursor: 'pointer',
                  alignItems: 'center',
                }}
              >
                {/* Type */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${getTypeColor(tx.type)}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getTypeColor(tx.type),
                  }}>
                    {getTypeIcon(tx.type)}
                  </div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: colors.text.primary,
                    textTransform: 'capitalize',
                  }}>
                    {tx.type}
                  </span>
                </div>

                {/* Asset */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CryptoIcon symbol={tx.asset} size={28} />
                  <div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: colors.text.primary,
                    }}>
                      {tx.asset}
                    </span>
                    {tx.assetTo && (
                      <span style={{
                        fontSize: '12px',
                        color: colors.text.tertiary,
                      }}>
                        {' → '}{tx.assetTo}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: tx.type === 'deposit' ? colors.status.success :
                           tx.type === 'withdraw' ? colors.status.error : colors.text.primary,
                  }}>
                    {tx.type === 'deposit' ? '+' : tx.type === 'withdraw' ? '-' : ''}
                    {tx.amount} {tx.asset}
                  </span>
                  {tx.amountTo && (
                    <div style={{
                      fontSize: '12px',
                      color: colors.status.success,
                    }}>
                      +{tx.amountTo} {tx.assetTo}
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div>
                  <div style={{
                    fontSize: '14px',
                    color: colors.text.primary,
                  }}>
                    {tx.date}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: colors.text.tertiary,
                  }}>
                    {tx.time}
                  </div>
                </div>

                {/* Status */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(tx.status),
                    boxShadow: `0 0 8px ${getStatusColor(tx.status)}`,
                  }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: getStatusColor(tx.status),
                    textTransform: 'capitalize',
                  }}>
                    {tx.status}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{
              padding: '60px 24px',
              textAlign: 'center',
            }}>
              <Search size={48} style={{ color: colors.text.tertiary, marginBottom: '16px' }} />
              <p style={{
                fontSize: '16px',
                color: colors.text.secondary,
                margin: 0,
              }}>
                No transactions found
              </p>
              <p style={{
                fontSize: '14px',
                color: colors.text.tertiary,
                margin: '8px 0 0 0',
              }}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </motion.div>

        {/* Transaction Detail Modal */}
        <AnimatePresence>
          {selectedTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTransaction(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '24px',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  background: isDark
                    ? 'linear-gradient(145deg, rgba(10, 25, 15, 0.98), rgba(5, 15, 10, 0.98))'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98))',
                  backdropFilter: 'blur(40px)',
                  borderRadius: '24px',
                  border: `1px solid ${colors.glass.border}`,
                  padding: '32px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Modal Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${getTypeColor(selectedTransaction.type)}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getTypeColor(selectedTransaction.type),
                  }}>
                    {getTypeIcon(selectedTransaction.type)}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: colors.text.primary,
                      margin: 0,
                      textTransform: 'capitalize',
                    }}>
                      {selectedTransaction.type} Details
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: colors.text.tertiary,
                      margin: '4px 0 0 0',
                    }}>
                      Transaction #{selectedTransaction.id}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Amount */}
                  <div style={{
                    padding: '16px',
                    background: colors.background.card,
                    borderRadius: '12px',
                    border: `1px solid ${colors.glass.border}`,
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: selectedTransaction.type === 'deposit' ? colors.status.success :
                             selectedTransaction.type === 'withdraw' ? colors.status.error : colors.text.primary,
                    }}>
                      {selectedTransaction.type === 'deposit' ? '+' : selectedTransaction.type === 'withdraw' ? '-' : ''}
                      {selectedTransaction.amount} {selectedTransaction.asset}
                    </div>
                    {selectedTransaction.amountTo && (
                      <div style={{
                        fontSize: '16px',
                        color: colors.status.success,
                        marginTop: '8px',
                      }}>
                        → +{selectedTransaction.amountTo} {selectedTransaction.assetTo}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: `1px solid ${colors.glass.border}`,
                  }}>
                    <span style={{ fontSize: '14px', color: colors.text.tertiary }}>Status</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getStatusColor(selectedTransaction.status),
                      }} />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: getStatusColor(selectedTransaction.status),
                        textTransform: 'capitalize',
                      }}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: `1px solid ${colors.glass.border}`,
                  }}>
                    <span style={{ fontSize: '14px', color: colors.text.tertiary }}>Date & Time</span>
                    <span style={{ fontSize: '14px', color: colors.text.primary }}>
                      {selectedTransaction.date} {selectedTransaction.time}
                    </span>
                  </div>

                  {/* Network */}
                  {selectedTransaction.network && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: `1px solid ${colors.glass.border}`,
                    }}>
                      <span style={{ fontSize: '14px', color: colors.text.tertiary }}>Network</span>
                      <span style={{ fontSize: '14px', color: colors.text.primary }}>
                        {selectedTransaction.network}
                      </span>
                    </div>
                  )}

                  {/* Fee */}
                  {selectedTransaction.fee && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: `1px solid ${colors.glass.border}`,
                    }}>
                      <span style={{ fontSize: '14px', color: colors.text.tertiary }}>Network Fee</span>
                      <span style={{ fontSize: '14px', color: colors.text.primary }}>
                        {selectedTransaction.fee} {selectedTransaction.asset}
                      </span>
                    </div>
                  )}

                  {/* Address */}
                  {selectedTransaction.address && (
                    <div style={{
                      padding: '12px 0',
                      borderBottom: `1px solid ${colors.glass.border}`,
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}>
                        <span style={{ fontSize: '14px', color: colors.text.tertiary }}>
                          {selectedTransaction.type === 'deposit' ? 'From Address' : 'To Address'}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(selectedTransaction.address!, 'address')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: colors.primary[400],
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {copiedField === 'address' ? <Check size={14} /> : <Copy size={14} />}
                          {copiedField === 'address' ? 'Copied!' : 'Copy'}
                        </motion.button>
                      </div>
                      <span style={{
                        fontSize: '13px',
                        color: colors.text.secondary,
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                      }}>
                        {selectedTransaction.address}
                      </span>
                    </div>
                  )}

                  {/* TX Hash */}
                  {selectedTransaction.txHash && (
                    <div style={{
                      padding: '12px 0',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}>
                        <span style={{ fontSize: '14px', color: colors.text.tertiary }}>Transaction Hash</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(selectedTransaction.txHash!, 'txHash')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: colors.primary[400],
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                            }}
                          >
                            {copiedField === 'txHash' ? <Check size={14} /> : <Copy size={14} />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: colors.primary[400],
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <ExternalLink size={14} />
                          </motion.button>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '13px',
                        color: colors.text.secondary,
                        fontFamily: 'monospace',
                      }}>
                        {selectedTransaction.txHash}
                      </span>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTransaction(null)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    marginTop: '24px',
                    borderRadius: '12px',
                    background: colors.background.card,
                    border: `1px solid ${colors.glass.border}`,
                    color: colors.text.primary,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ResponsiveLayout>
  );
};

export default HistoryScreen;
