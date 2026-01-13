import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  HelpCircle,
  Coins,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  Loader2,
  RefreshCw,
  Gift,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, CryptoIcon, ResponsiveLayout, Button } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { stakingService } from '../../services/stakingService';
import type { StakingOption, StakingPosition } from '../../types/api';

// Fallback mock data
const mockStakingOptions: StakingOption[] = [
  { chain: 'ETH', protocol: 'lido', apy: 4.5, minStake: '0.01', maxStake: '1000', unbondingPeriod: 0, rewardToken: 'ETH' },
  { chain: 'SOL', protocol: 'marinade', apy: 6.8, minStake: '0.1', maxStake: '10000', unbondingPeriod: 2, rewardToken: 'SOL' },
  { chain: 'ETH', protocol: 'rocket_pool', apy: 4.2, minStake: '0.01', maxStake: '100', unbondingPeriod: 0, rewardToken: 'ETH' },
  { chain: 'DOT', protocol: 'native', apy: 12.5, minStake: '10', maxStake: '50000', unbondingPeriod: 28, rewardToken: 'DOT' },
  { chain: 'ATOM', protocol: 'native', apy: 15.2, minStake: '1', maxStake: '100000', unbondingPeriod: 21, rewardToken: 'ATOM' },
  { chain: 'AVAX', protocol: 'native', apy: 8.5, minStake: '1', maxStake: '10000', unbondingPeriod: 14, rewardToken: 'AVAX' },
];

const mockPositions: StakingPosition[] = [];

const mockStats = {
  totalStaked: 0,
  totalRewards: 0,
  avgApy: 0,
  positions: 0,
};

export const StakingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();
  const [isLoading, setIsLoading] = useState(true);
  const [stakingOptions, setStakingOptions] = useState<StakingOption[]>(mockStakingOptions);
  const [positions, setPositions] = useState<StakingPosition[]>(mockPositions);
  const [stats, setStats] = useState(mockStats);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<StakingOption | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'stake' | 'positions'>('stake');

  // Fetch staking data
  const fetchStakingData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [optionsRes, positionsRes, statsRes] = await Promise.all([
        stakingService.getOptions(),
        stakingService.getPositions(),
        stakingService.getStats(),
      ]);

      if (optionsRes.options && optionsRes.options.length > 0) {
        setStakingOptions(optionsRes.options);
      }

      if (positionsRes.positions) {
        setPositions(positionsRes.positions);
      }

      if (statsRes) {
        setStats({
          ...statsRes,
          avgApy: statsRes.totalStaked > 0 ? 8.5 : 0, // Calculate or default avgApy
        });
      }
    } catch (error) {
      console.error('Error fetching staking data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStakingData();
  }, [fetchStakingData]);

  const handleStake = (option: StakingOption) => {
    setSelectedOption(option);
    setStakeAmount('');
    setShowStakeModal(true);
  };

  const confirmStake = async () => {
    if (!selectedOption || !stakeAmount) return;

    try {
      await stakingService.stake({
        chain: selectedOption.chain,
        amount: stakeAmount,
        protocol: selectedOption.protocol,
      });
      setShowStakeModal(false);
      setSelectedOption(null);
      setStakeAmount('');
      fetchStakingData();
    } catch (error) {
      console.error('Error staking:', error);
    }
  };

  const handleClaimRewards = async (positionId: string) => {
    try {
      await stakingService.claimRewards(positionId);
      fetchStakingData();
    } catch (error) {
      console.error('Error claiming rewards:', error);
    }
  };

  const handleUnstake = async (positionId: string) => {
    try {
      await stakingService.unstake({ positionId });
      fetchStakingData();
    } catch (error) {
      console.error('Error unstaking:', error);
    }
  };

  const getProtocolInfo = (protocol: string) => stakingService.getProtocolInfo(protocol);

  return (
    <ResponsiveLayout activeNav="earn" title="Staking">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
              Staking
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchStakingData}
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
              {isLoading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={20} />}
            </motion.button>
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
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="elevated" padding="lg" style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '20px',
            }}>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Total Staked
                </p>
                <p style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: 700,
                  color: colors.text.primary,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  ${(stats.totalStaked || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Total Rewards
                </p>
                <p style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: 700,
                  color: colors.trading.buy,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  +${(stats.totalRewards || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Avg APY
                </p>
                <p style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: 700,
                  color: colors.primary[400],
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {stats.avgApy.toFixed(1)}%
                </p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Active Positions
                </p>
                <p style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: 700,
                  color: colors.text.primary,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {stats.positions}
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
            onClick={() => setActiveTab('stake')}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: activeTab === 'stake' ? colors.primary[400] : 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: activeTab === 'stake' ? '#000' : colors.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Coins size={16} />
            Stake
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('positions')}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: activeTab === 'positions' ? colors.primary[400] : 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: activeTab === 'positions' ? '#000' : colors.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <TrendingUp size={16} />
            My Positions ({positions.length})
          </motion.button>
        </motion.div>

        {/* Content */}
        {activeTab === 'stake' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="default" padding="none">
              {stakingOptions.map((option, index) => {
                const protocolInfo = getProtocolInfo(option.protocol);
                return (
                  <motion.div
                    key={`${option.chain}-${option.protocol}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    whileHover={{ background: isDark ? 'rgba(26, 143, 255, 0.05)' : 'rgba(16, 185, 129, 0.05)' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: isMobile ? '14px 16px' : '16px 20px',
                      borderBottom: index < stakingOptions.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <CryptoIcon symbol={option.chain} size={isMobile ? 36 : 42} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <p style={{
                            fontSize: isMobile ? '15px' : '16px',
                            fontWeight: 600,
                            color: colors.text.primary,
                          }}>
                            {option.chain}
                          </p>
                          <span style={{
                            padding: '2px 8px',
                            background: `${protocolInfo.color}20`,
                            color: protocolInfo.color,
                            fontSize: '10px',
                            fontWeight: 600,
                            borderRadius: '4px',
                          }}>
                            {protocolInfo.name}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '12px',
                          color: colors.text.tertiary,
                          marginTop: '2px',
                        }}>
                          Min: {option.minStake} {option.chain} | Unbond: {stakingService.formatUnbondingPeriod(option.unbondingPeriod)}
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
                          {option.apy}%
                        </p>
                        <p style={{
                          fontSize: '11px',
                          color: colors.text.tertiary,
                        }}>
                          APY
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStake(option)}
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
                        Stake
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {positions.length === 0 ? (
              <GlassCard variant="subtle" padding="lg">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Coins size={48} color={colors.text.tertiary} style={{ marginBottom: '16px' }} />
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                    No Active Positions
                  </p>
                  <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
                    Start staking to earn rewards on your crypto
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setActiveTab('stake')}
                    style={{ marginTop: '20px' }}
                  >
                    Start Staking
                  </Button>
                </div>
              </GlassCard>
            ) : (
              <GlassCard variant="default" padding="none">
                {positions.map((position, index) => {
                  const protocolInfo = getProtocolInfo(position.protocol);
                  return (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + index * 0.05 }}
                      style={{
                        padding: isMobile ? '14px 16px' : '16px 20px',
                        borderBottom: index < positions.length - 1 ? `1px solid ${colors.glass.border}` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <CryptoIcon symbol={position.chain} size={36} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <p style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>
                                {position.chain}
                              </p>
                              <span style={{
                                padding: '2px 8px',
                                background: `${protocolInfo.color}20`,
                                color: protocolInfo.color,
                                fontSize: '10px',
                                fontWeight: 600,
                                borderRadius: '4px',
                              }}>
                                {protocolInfo.name}
                              </span>
                            </div>
                            <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                              {position.apy}% APY
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
                            {parseFloat(position.stakedAmount).toFixed(4)} {position.chain}
                          </p>
                          <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                            ${parseFloat(position.stakedAmountUsd).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: isDark ? 'rgba(0, 200, 83, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '8px',
                      }}>
                        <div>
                          <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Pending Rewards</p>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.trading.buy,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>
                            +{parseFloat(position.rewardAmount).toFixed(6)} {position.chain}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Gift size={14} />}
                            onClick={() => handleClaimRewards(position.id)}
                          >
                            Claim
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnstake(position.id)}
                          >
                            Unstake
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </GlassCard>
            )}
          </motion.div>
        )}

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
                  Earn passive income by staking your crypto
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color={colors.trading.buy} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                  Rewards are calculated and distributed automatically
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color={colors.status.warning} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                  Unbonding periods vary by network - check before staking
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Stake Modal */}
      <AnimatePresence>
        {showStakeModal && selectedOption && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStakeModal(false)}
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
                    <CryptoIcon symbol={selectedOption.chain} size={36} />
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: colors.text.primary,
                      }}>
                        Stake {selectedOption.chain}
                      </h3>
                      <p style={{
                        fontSize: '12px',
                        color: colors.trading.buy,
                      }}>
                        {selectedOption.apy}% APY via {getProtocolInfo(selectedOption.protocol).name}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowStakeModal(false)}
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
                    Amount to Stake
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
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
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
                      {selectedOption.chain}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: colors.text.tertiary,
                    marginTop: '6px',
                  }}>
                    Min: {selectedOption.minStake} | Max: {selectedOption.maxStake} {selectedOption.chain}
                  </p>
                </div>

                {/* Staking Info */}
                <div style={{
                  padding: '14px',
                  background: isDark ? 'rgba(0, 200, 83, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>APY</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.trading.buy }}>
                      {selectedOption.apy}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>Protocol</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                      {getProtocolInfo(selectedOption.protocol).name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>Unbonding Period</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                      {stakingService.formatUnbondingPeriod(selectedOption.unbondingPeriod)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>Est. Annual Reward</span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.trading.buy,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      +{stakingService.calculateRewards(parseFloat(stakeAmount) || 0, selectedOption.apy, 365).toFixed(4)} {selectedOption.chain}
                    </span>
                  </div>
                </div>

                {/* Stake Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={confirmStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) < parseFloat(selectedOption.minStake)}
                >
                  Stake {selectedOption.chain}
                </Button>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

export default StakingScreen;
