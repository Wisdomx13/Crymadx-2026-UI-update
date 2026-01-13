import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  HelpCircle,
  Plus,
  Play,
  Pause,
  Trash2,
  Clock,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  X,
  Loader2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, CryptoIcon, ResponsiveLayout, Button } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { autoInvestService, Frequency, CreatePlanRequest } from '../../services/autoInvestService';
import type { AutoInvestPlan } from '../../types/api';

// Fallback mock data
const mockPlans: AutoInvestPlan[] = [];

// Available assets for auto-invest
const availableAssets = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'BNB', name: 'BNB' },
  { symbol: 'XRP', name: 'Ripple' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'AVAX', name: 'Avalanche' },
];

const frequencies: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 Weeks' },
  { value: 'monthly', label: 'Monthly' },
];

export const AutoInvestScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<AutoInvestPlan[]>(mockPlans);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  // Form state
  const [planName, setPlanName] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [investAmount, setInvestAmount] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('weekly');

  // Fetch plans
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await autoInvestService.getPlans();
      if (response.plans) {
        setPlans(response.plans);
      }
    } catch (error) {
      console.error('Error fetching auto-invest plans:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleCreatePlan = async () => {
    if (!planName || !investAmount) return;

    try {
      const request: CreatePlanRequest = {
        name: planName,
        asset: selectedAsset,
        sourceAsset: 'USDT',
        amount: investAmount,
        frequency,
      };
      await autoInvestService.createPlan(request);
      setShowCreateModal(false);
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const handleTogglePlan = async (plan: AutoInvestPlan) => {
    setProcessingPlanId(plan.id);
    try {
      if (plan.status === 'active') {
        await autoInvestService.pausePlan(plan.id);
      } else {
        await autoInvestService.resumePlan(plan.id);
      }
      fetchPlans();
    } catch (error) {
      console.error('Error toggling plan:', error);
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    setProcessingPlanId(planId);
    try {
      await autoInvestService.deletePlan(planId);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleExecuteNow = async (planId: string) => {
    setProcessingPlanId(planId);
    try {
      await autoInvestService.executeNow(planId);
      fetchPlans();
    } catch (error) {
      console.error('Error executing plan:', error);
    } finally {
      setProcessingPlanId(null);
    }
  };

  const resetForm = () => {
    setPlanName('');
    setSelectedAsset('BTC');
    setInvestAmount('');
    setFrequency('weekly');
  };

  const totalInvested = plans.reduce((sum, plan) => sum + parseFloat(plan.totalInvested || '0'), 0);
  const activePlans = plans.filter(p => p.status === 'active').length;

  return (
    <ResponsiveLayout activeNav="earn" title="Auto-Invest">
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
              Auto-Invest (DCA)
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchPlans}
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
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '10px 16px',
                background: colors.primary[400],
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              <Plus size={18} />
              {!isMobile && 'Create Plan'}
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
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Total Plans
                </p>
                <p style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: colors.text.primary,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {plans.length}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Active Plans
                </p>
                <p style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: colors.trading.buy,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {activePlans}
                </p>
              </div>
              <div style={{ gridColumn: isMobile ? 'span 2' : 'auto' }}>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '4px' }}>
                  Total Invested
                </p>
                <p style={{
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: colors.primary[400],
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  ${totalInvested.toLocaleString()}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Plans List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {plans.length === 0 ? (
            <GlassCard variant="subtle" padding="lg">
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Calendar size={48} color={colors.text.tertiary} style={{ marginBottom: '16px' }} />
                <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                  No Auto-Invest Plans
                </p>
                <p style={{ fontSize: '14px', color: colors.text.tertiary, marginBottom: '20px' }}>
                  Create a recurring investment plan to dollar-cost average into your favorite assets
                </p>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Plus size={16} />}
                  onClick={() => setShowCreateModal(true)}
                >
                  Create First Plan
                </Button>
              </div>
            </GlassCard>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <GlassCard variant="default" padding="lg">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <CryptoIcon symbol={plan.asset} size={42} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
                              {plan.name}
                            </p>
                            <span style={{
                              padding: '3px 10px',
                              background: plan.status === 'active' ? `${colors.trading.buy}20` : `${colors.status.warning}20`,
                              color: plan.status === 'active' ? colors.trading.buy : colors.status.warning,
                              fontSize: '11px',
                              fontWeight: 600,
                              borderRadius: '20px',
                            }}>
                              {plan.status === 'active' ? 'Active' : 'Paused'}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: colors.text.tertiary, marginTop: '2px' }}>
                            Buy {plan.asset} with {plan.sourceAsset}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleTogglePlan(plan)}
                          disabled={processingPlanId === plan.id}
                          style={{
                            padding: '8px',
                            background: colors.background.card,
                            border: `1px solid ${colors.glass.border}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: plan.status === 'active' ? colors.status.warning : colors.trading.buy,
                            display: 'flex',
                            opacity: processingPlanId === plan.id ? 0.5 : 1,
                          }}
                        >
                          {plan.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeletePlan(plan.id)}
                          disabled={processingPlanId === plan.id}
                          style={{
                            padding: '8px',
                            background: colors.background.card,
                            border: `1px solid ${colors.glass.border}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: colors.status.error,
                            display: 'flex',
                            opacity: processingPlanId === plan.id ? 0.5 : 1,
                          }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Plan Details */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                      gap: '16px',
                      padding: '16px',
                      background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                      borderRadius: '10px',
                      marginBottom: '16px',
                    }}>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>
                          Amount
                        </p>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: colors.text.primary,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          ${parseFloat(plan.amount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>
                          Frequency
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                          {autoInvestService.getFrequencyLabel(plan.frequency)}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>
                          Total Invested
                        </p>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: colors.primary[400],
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          ${parseFloat(plan.totalInvested || '0').toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: colors.text.tertiary, marginBottom: '4px' }}>
                          {plan.asset} Acquired
                        </p>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: colors.trading.buy,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          {parseFloat(plan.totalAcquired || '0').toFixed(6)}
                        </p>
                      </div>
                    </div>

                    {/* Next Execution */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: plan.status === 'active'
                        ? (isDark ? 'rgba(0, 200, 83, 0.1)' : 'rgba(16, 185, 129, 0.1)')
                        : (isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'),
                      borderRadius: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={14} color={plan.status === 'active' ? colors.trading.buy : colors.text.tertiary} />
                        <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                          Next execution: {plan.status === 'active'
                            ? autoInvestService.formatNextExecution(plan.nextExecution)
                            : 'Paused'}
                        </span>
                      </div>
                      {plan.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Zap size={14} />}
                          onClick={() => handleExecuteNow(plan.id)}
                          disabled={processingPlanId === plan.id}
                        >
                          Execute Now
                        </Button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
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
                  Dollar-cost averaging reduces impact of volatility
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color={colors.trading.buy} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                  Automatic purchases at your chosen frequency
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} color={colors.trading.buy} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>
                  Pause or cancel plans anytime with no penalties
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Create Plan Modal */}
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
                maxWidth: '480px',
                maxHeight: '90vh',
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
                  marginBottom: '24px',
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: colors.text.primary,
                  }}>
                    Create Auto-Invest Plan
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

                {/* Plan Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text.secondary,
                    marginBottom: '8px',
                  }}>
                    Plan Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Weekly BTC"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: colors.background.card,
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '10px',
                      color: colors.text.primary,
                      fontSize: '15px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Asset Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text.secondary,
                    marginBottom: '8px',
                  }}>
                    Asset to Buy
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                  }}>
                    {availableAssets.map((asset) => (
                      <motion.button
                        key={asset.symbol}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAsset(asset.symbol)}
                        style={{
                          padding: '12px 8px',
                          background: selectedAsset === asset.symbol ? colors.primary[400] : colors.background.card,
                          border: `1px solid ${selectedAsset === asset.symbol ? colors.primary[400] : colors.glass.border}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CryptoIcon symbol={asset.symbol} size={24} />
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: selectedAsset === asset.symbol ? '#000' : colors.text.primary,
                        }}>
                          {asset.symbol}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text.secondary,
                    marginBottom: '8px',
                  }}>
                    Investment Amount (USDT)
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
                    <DollarSign size={18} color={colors.text.tertiary} />
                    <input
                      type="number"
                      placeholder="100"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
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
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.secondary }}>
                      USDT
                    </span>
                  </div>
                  {/* Quick amounts */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[50, 100, 250, 500].map((amt) => (
                      <motion.button
                        key={amt}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInvestAmount(amt.toString())}
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
                        ${amt}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text.secondary,
                    marginBottom: '8px',
                  }}>
                    Frequency
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {frequencies.map((freq) => (
                      <motion.button
                        key={freq.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFrequency(freq.value)}
                        style={{
                          flex: 1,
                          padding: '12px 8px',
                          background: frequency === freq.value ? colors.primary[400] : colors.background.card,
                          border: `1px solid ${frequency === freq.value ? colors.primary[400] : colors.glass.border}`,
                          borderRadius: '8px',
                          color: frequency === freq.value ? '#000' : colors.text.secondary,
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {freq.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div style={{
                  padding: '16px',
                  background: isDark ? 'rgba(0, 200, 83, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>Per Investment</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text.primary }}>
                      ${parseFloat(investAmount || '0').toLocaleString()} USDT
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: colors.text.secondary }}>Est. Annual Total</span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.trading.buy,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      ${autoInvestService.calculateAnnualInvestment(parseFloat(investAmount) || 0, frequency).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Create Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCreatePlan}
                  disabled={!planName || !investAmount || parseFloat(investAmount) <= 0}
                >
                  Create Plan
                </Button>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

export default AutoInvestScreen;
