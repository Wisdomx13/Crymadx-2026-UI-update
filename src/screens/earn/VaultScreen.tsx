import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Lock,
  Plus,
  AlertTriangle,
  CheckCircle,
  X,
  TrendingUp,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, CryptoIcon, ResponsiveLayout, Button } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';

// Lock period options
const lockPeriods = [
  { days: 30, apr: 8, label: '30 Days' },
  { days: 60, apr: 10, label: '60 Days' },
  { days: 90, apr: 12, label: '90 Days' },
  { days: 180, apr: 15, label: '180 Days' },
  { days: 365, apr: 18, label: '1 Year' },
];

// Supported assets for vault
const vaultAssets = [
  { symbol: 'USDT', name: 'Tether', balance: '0.00' },
  { symbol: 'USDC', name: 'USD Coin', balance: '0.00' },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.00' },
  { symbol: 'ETH', name: 'Ethereum', balance: '0.00' },
  { symbol: 'BNB', name: 'BNB', balance: '0.00' },
];

// Mock active vaults
const activeVaults = [
  { id: 1, symbol: 'USDT', amount: 5000, apr: 12, daysLeft: 0, earned: 147.95, period: 90, startDate: '2024-09-25' },
  { id: 2, symbol: 'USDC', amount: 2500, apr: 5.5, daysLeft: 0, earned: 11.30, period: 30, startDate: '2024-11-23' },
];

export const VaultScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(vaultAssets[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(lockPeriods[2]);
  const [vaultAmount, setVaultAmount] = useState('');
  const [showAssetSelector, setShowAssetSelector] = useState(false);

  const totalLocked = activeVaults.reduce((sum, v) => sum + v.amount, 0);
  const totalEarned = activeVaults.reduce((sum, v) => sum + v.earned, 0);
  const avgApy = activeVaults.length > 0
    ? activeVaults.reduce((sum, v) => sum + v.apr, 0) / activeVaults.length
    : 0;

  const getBreakFee = (period: number) => {
    if (period <= 30) return 2;
    if (period <= 90) return 5;
    if (period <= 180) return 8;
    return 12;
  };

  const handleCreateVault = () => {
    setShowCreateModal(false);
    setVaultAmount('');
  };

  return (
    <ResponsiveLayout activeNav="vault" title="Vault">
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
              Vault
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
            <Clock size={20} />
          </motion.button>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" padding="lg" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                padding: '12px',
                background: isDark ? 'rgba(240, 185, 11, 0.15)' : 'rgba(217, 119, 6, 0.12)',
                borderRadius: '12px',
              }}>
                <Lock size={24} color={isDark ? '#F0B90B' : '#D97706'} />
              </div>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary }}>Total Locked</p>
                <p style={{
                  fontSize: isMobile ? '26px' : '32px',
                  fontWeight: 700,
                  color: colors.text.primary,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  ${totalLocked.toLocaleString()}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
            }}>
              <div style={{
                padding: '12px',
                background: colors.background.card,
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 700,
                  color: colors.trading.buy,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  ${totalEarned.toFixed(2)}
                </p>
                <p style={{ fontSize: '11px', color: colors.text.tertiary }}>Earned</p>
              </div>
              <div style={{
                padding: '12px',
                background: colors.background.card,
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 700,
                  color: colors.text.primary,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {activeVaults.length}
                </p>
                <p style={{ fontSize: '11px', color: colors.text.tertiary }}>Active</p>
              </div>
              <div style={{
                padding: '12px',
                background: colors.background.card,
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 700,
                  color: colors.primary[400],
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {avgApy.toFixed(0)}%
                </p>
                <p style={{ fontSize: '11px', color: colors.text.tertiary }}>Avg APY</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Create Vault Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: '24px' }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} style={{ marginRight: '8px' }} />
            Create Vault
          </Button>
        </motion.div>

        {/* Active Vaults */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: colors.text.primary,
            marginBottom: '12px',
          }}>
            Active Vaults
          </h2>

          <GlassCard variant="default" padding="none">
            {activeVaults.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
              }}>
                <Lock size={48} color={colors.text.tertiary} style={{ marginBottom: '12px' }} />
                <p style={{ fontSize: '14px', color: colors.text.secondary }}>
                  No active vaults
                </p>
                <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                  Create a vault to start earning higher returns
                </p>
              </div>
            ) : (
              activeVaults.map((vault, index) => (
                <motion.div
                  key={vault.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  style={{
                    padding: isMobile ? '14px 16px' : '16px 20px',
                    borderBottom: index < activeVaults.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CryptoIcon symbol={vault.symbol} size={36} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <p style={{
                            fontSize: '15px',
                            fontWeight: 600,
                            color: colors.text.primary,
                          }}>
                            {vault.symbol}
                          </p>
                          <span style={{
                            padding: '2px 8px',
                            background: isDark ? 'rgba(240, 185, 11, 0.15)' : 'rgba(217, 119, 6, 0.12)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: isDark ? '#F0B90B' : '#D97706',
                          }}>
                            {vault.period}D
                          </span>
                        </div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary }}>
                          {vault.apr}%
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: colors.text.primary,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {vault.amount.toLocaleString()}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: colors.trading.buy,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        +{vault.earned.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    height: '6px',
                    background: colors.background.card,
                    borderRadius: '3px',
                    marginBottom: '8px',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - (vault.daysLeft / vault.period) * 100}%` }}
                      style={{
                        height: '100%',
                        background: colors.primary[400],
                        borderRadius: '3px',
                      }}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '11px', color: colors.text.tertiary }}>
                      {vault.daysLeft}d left
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '6px 12px',
                        background: isDark ? 'rgba(255, 71, 87, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                        border: 'none',
                        borderRadius: '6px',
                        color: colors.trading.sell,
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Break ({getBreakFee(vault.period)}% fee)
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </GlassCard>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: '24px' }}
        >
          <GlassCard variant="subtle" padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color={colors.trading.buy} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                  Lock assets for higher APY
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={16} color={colors.gold[400]} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                  Early break incurs 2-12% fee
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Create Vault Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
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
                maxWidth: '450px',
                maxHeight: '85vh',
                overflowY: 'auto',
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
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: colors.text.primary,
                  }}>
                    Create Vault
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreateModal(false)}
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

                {/* Asset Selector */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text.secondary,
                    marginBottom: '8px',
                  }}>
                    Select Asset
                  </label>
                  <motion.button
                    whileHover={{ borderColor: colors.primary[400] }}
                    onClick={() => setShowAssetSelector(!showAssetSelector)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: colors.background.card,
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CryptoIcon symbol={selectedAsset.symbol} size={28} />
                      <span style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>
                        {selectedAsset.symbol}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: colors.text.tertiary }}>
                      Balance: {selectedAsset.balance}
                    </span>
                  </motion.button>

                  {/* Asset Dropdown */}
                  <AnimatePresence>
                    {showAssetSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          marginTop: '8px',
                          background: colors.background.secondary,
                          border: `1px solid ${colors.glass.border}`,
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        {vaultAssets.map((asset) => (
                          <motion.div
                            key={asset.symbol}
                            whileHover={{ background: colors.background.hover }}
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowAssetSelector(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              cursor: 'pointer',
                              background: selectedAsset.symbol === asset.symbol ? `${colors.primary[400]}15` : 'transparent',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <CryptoIcon symbol={asset.symbol} size={28} />
                              <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                                {asset.symbol}
                              </span>
                            </div>
                            <span style={{ fontSize: '12px', color: colors.text.tertiary }}>
                              {asset.balance}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                      value={vaultAmount}
                      onChange={(e) => setVaultAmount(e.target.value)}
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
                      {selectedAsset.symbol}
                    </span>
                  </div>
                </div>

                {/* Lock Period */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text.secondary,
                    marginBottom: '8px',
                  }}>
                    Lock Period
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                  }}>
                    {lockPeriods.map((period) => (
                      <motion.button
                        key={period.days}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPeriod(period)}
                        style={{
                          padding: '12px 8px',
                          background: selectedPeriod.days === period.days
                            ? colors.primary[400]
                            : colors.background.card,
                          border: `1px solid ${selectedPeriod.days === period.days ? colors.primary[400] : colors.glass.border}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        <p style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: selectedPeriod.days === period.days ? '#000' : colors.text.primary,
                        }}>
                          {period.label}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: selectedPeriod.days === period.days ? '#000' : colors.trading.buy,
                        }}>
                          {period.apr}% APY
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Estimated Earnings */}
                <div style={{
                  padding: '14px',
                  background: isDark ? 'rgba(240, 185, 11, 0.1)' : 'rgba(217, 119, 6, 0.08)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                      Est. Total Earnings
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: colors.trading.buy,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {((parseFloat(vaultAmount) || 0) * selectedPeriod.apr / 100 * selectedPeriod.days / 365).toFixed(4)} {selectedAsset.symbol}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                      Early Break Fee
                    </span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.trading.sell,
                    }}>
                      {getBreakFee(selectedPeriod.days)}%
                    </span>
                  </div>
                </div>

                {/* Create Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCreateVault}
                  disabled={!vaultAmount || parseFloat(vaultAmount) <= 0}
                >
                  <Lock size={16} style={{ marginRight: '8px' }} />
                  Lock Funds
                </Button>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

export default VaultScreen;
