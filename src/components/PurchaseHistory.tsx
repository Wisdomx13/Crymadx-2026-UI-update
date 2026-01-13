import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';
import { PurchaseHistoryItem } from '../services/nftService';
import { getChainConfig, getChainColor, getExplorerTxUrl } from '../config/chains';

interface PurchaseHistoryProps {
  purchases: PurchaseHistoryItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({
  purchases,
  isLoading = false,
  onRefresh,
}) => {
  const { colors, isDark } = useThemeMode();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="#22c55e" />;
      case 'failed':
      case 'refunded':
        return <XCircle size={16} color="#ef4444" />;
      case 'pending':
      case 'processing':
        return <Loader2 size={16} color={colors.primary[400]} className="animate-spin" />;
      default:
        return <Clock size={16} color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'failed':
      case 'refunded':
        return '#ef4444';
      case 'pending':
      case 'processing':
        return colors.primary[400];
      default:
        return isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatPrice = (price: string, currency: string): string => {
    const num = parseFloat(price);
    if (isNaN(num)) return `0 ${currency}`;
    if (num >= 1) return `${num.toFixed(2)} ${currency}`;
    return `${num.toFixed(4)} ${currency}`;
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
        }}
      >
        <Loader2 size={32} color={colors.primary[400]} className="animate-spin" />
        <p
          style={{
            marginTop: '16px',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            fontSize: '14px',
          }}
        >
          Loading purchase history...
        </p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <ShoppingBag size={36} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} />
        </div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: isDark ? '#fff' : '#1a1a1a',
            marginBottom: '8px',
          }}
        >
          No Purchases Yet
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            maxWidth: '280px',
          }}
        >
          Your NFT purchases will appear here once you buy something from the marketplace.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with refresh */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: isDark ? '#fff' : '#1a1a1a',
          }}
        >
          {purchases.length} Purchase{purchases.length !== 1 ? 's' : ''}
        </h3>
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
              border: 'none',
              cursor: 'pointer',
              color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              fontSize: '13px',
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </motion.button>
        )}
      </div>

      {/* Purchase List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {purchases.map((purchase) => {
          const chainConfig = getChainConfig(purchase.nft.chain);
          const chainColor = getChainColor(purchase.nft.chain);

          return (
            <motion.div
              key={purchase.purchaseId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                borderRadius: '16px',
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              {/* NFT Image */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[400]})`,
                }}
              >
                {purchase.nft.image ? (
                  <img
                    src={purchase.nft.image}
                    alt={purchase.nft.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ImageIcon size={24} color="rgba(255,255,255,0.5)" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isDark ? '#fff' : '#1a1a1a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {purchase.nft.name}
                  </h4>
                  {/* Chain badge */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: `${chainColor}20`,
                      color: chainColor,
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: chainColor,
                      }}
                    />
                    {chainConfig?.shortName}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  {purchase.nft.collection}
                </p>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: colors.primary[400],
                    marginBottom: '4px',
                  }}
                >
                  {formatPrice(purchase.total, purchase.currency)}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                  }}
                >
                  {formatDate(purchase.purchasedAt)}
                </p>
              </div>

              {/* Status */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  minWidth: '80px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: `${getStatusColor(purchase.status)}15`,
                  }}
                >
                  {getStatusIcon(purchase.status)}
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: getStatusColor(purchase.status),
                    }}
                  >
                    {getStatusText(purchase.status)}
                  </span>
                </div>
                {purchase.txHash && purchase.status === 'completed' && (
                  <a
                    href={getExplorerTxUrl(purchase.nft.chain, purchase.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: colors.primary[400],
                      fontSize: '11px',
                      textDecoration: 'none',
                    }}
                  >
                    View TX <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PurchaseHistory;
