import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Trophy,
  Zap,
  Star,
  Clock,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Target,
  Crown,
  Flame,
  TrendingUp,
  Users,
  Loader2,
  AlertCircle,
  Diamond,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Glass3DCard, Glass3DStat } from '../../components/Glass3D';
import { ResponsiveLayout } from '../../components';
import { rewardsService, RewardsTask, UserRewardsSummary, RewardsTier, RewardHistoryItem } from '../../services/rewardsService';
import { tokenManager } from '../../services';

// Task icon mapping
const taskIcons: Record<string, React.ReactNode> = {
  'login': <CheckCircle size={20} />,
  'trade': <Zap size={20} />,
  'deposit': <Target size={20} />,
  'volume100': <TrendingUp size={20} />,
  'trades5': <TrendingUp size={20} />,
  'referral': <Users size={20} />,
};

// Tier icon mapping
const tierIcons: Record<string, React.ReactNode> = {
  'Bronze': <Star size={24} />,
  'Silver': <Trophy size={24} />,
  'Gold': <Crown size={24} />,
  'Platinum': <Flame size={24} />,
  'Diamond': <Diamond size={24} />,
};

// Tier color mapping
const tierColors: Record<string, string> = {
  'Bronze': '#CD7F32',
  'Silver': '#C0C0C0',
  'Gold': '#FFD700',
  'Platinum': '#E5E4E2',
  'Diamond': '#B9F2FF',
};

export const RewardsScreen: React.FC = () => {
  const { colors, isDark } = useThemeMode();
  const [activeTab, setActiveTab] = useState<'tasks' | 'tiers' | 'history'>('tasks');
  const [_isMobile, setIsMobile] = useState(false);

  // API state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRewards, setUserRewards] = useState<UserRewardsSummary | null>(null);
  const [dailyTasks, setDailyTasks] = useState<RewardsTask[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<RewardsTask[]>([]);
  const [tiers, setTiers] = useState<RewardsTier[]>([]);
  const [history, setHistory] = useState<RewardHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [claimingTaskId, setClaimingTaskId] = useState<string | null>(null);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Fetch rewards data
  useEffect(() => {
    const fetchData = async () => {
      if (!tokenManager.isAuthenticated()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [summaryData, tasksData, tiersData] = await Promise.all([
          rewardsService.getSummary(),
          rewardsService.getTasks(),
          rewardsService.getTiers(),
        ]);

        setUserRewards(summaryData);
        setDailyTasks(tasksData.daily || []);
        setWeeklyTasks(tasksData.weekly || []);

        // Mark current tier
        const tiersWithCurrent = (tiersData.tiers || []).map(tier => ({
          ...tier,
          current: tier.name === summaryData.currentTier,
        }));
        setTiers(tiersWithCurrent);
      } catch (err: any) {
        console.error('Failed to fetch rewards data:', err);
        setError(err.message || 'Failed to load rewards');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch history when tab changes
  useEffect(() => {
    if (activeTab === 'history' && history.length === 0 && tokenManager.isAuthenticated()) {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await rewardsService.getHistory(1, 20);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleClaimTask = async (taskId: string) => {
    setClaimingTaskId(taskId);
    try {
      const result = await rewardsService.claimTask(taskId);

      // Update task as claimed
      const updateTasks = (tasks: RewardsTask[]) =>
        tasks.map(t => t.id === taskId ? { ...t, claimed: true } : t);

      setDailyTasks(updateTasks(dailyTasks));
      setWeeklyTasks(updateTasks(weeklyTasks));

      // Update user points
      if (userRewards) {
        setUserRewards({
          ...userRewards,
          totalPoints: userRewards.totalPoints + result.pointsEarned,
          completedTasks: userRewards.completedTasks + 1,
        });
      }
    } catch (err: any) {
      console.error('Failed to claim task:', err);
    } finally {
      setClaimingTaskId(null);
    }
  };

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: <Target size={16} /> },
    { id: 'tiers', label: 'VIP Tiers', icon: <Crown size={16} /> },
    { id: 'history', label: 'History', icon: <Clock size={16} /> },
  ];

  const renderTaskCard = (task: RewardsTask, index: number) => {
    const isCompleted = task.completed || task.claimed;
    const canClaim = task.progress >= task.target && !task.claimed;
    const isClaiming = claimingTaskId === task.id;

    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        style={{
          padding: '20px',
          background: isCompleted
            ? isDark ? 'rgba(0, 255, 170, 0.05)' : 'rgba(16, 185, 129, 0.08)'
            : isDark ? 'rgba(4, 26, 15, 0.5)' : '#ffffff',
          border: `1px solid ${isCompleted ? colors.primary[400] : colors.glass.border}`,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: isCompleted
              ? colors.gradients.primary
              : isDark ? 'rgba(0, 255, 170, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isCompleted ? colors.background.primary : colors.primary[400],
            flexShrink: 0,
          }}
        >
          {taskIcons[task.id] || <Target size={20} />}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              {task.title}
            </h4>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: colors.primary[400],
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {task.reward} {task.rewardType === 'points' ? 'Points' : 'USDT'}
            </span>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: colors.text.tertiary,
              marginBottom: '8px',
            }}
          >
            {task.description}
          </p>

          {/* Progress bar */}
          <div
            style={{
              height: '4px',
              background: isDark ? 'rgba(0, 255, 170, 0.1)' : 'rgba(16, 185, 129, 0.15)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((task.progress / task.target) * 100, 100)}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                height: '100%',
                background: isCompleted
                  ? colors.primary[400]
                  : colors.gradients.primary,
                borderRadius: '2px',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '4px',
            }}
          >
            <span style={{ fontSize: '11px', color: colors.text.tertiary }}>
              Progress
            </span>
            <span
              style={{
                fontSize: '11px',
                color: colors.text.secondary,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {task.progress}/{task.target}
            </span>
          </div>
        </div>

        {task.claimed ? (
          <div
            style={{
              padding: '8px 16px',
              background: isDark ? 'rgba(0, 255, 170, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              color: colors.primary[400],
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Claimed
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: canClaim ? 1.02 : 1 }}
            whileTap={{ scale: canClaim ? 0.98 : 1 }}
            disabled={!canClaim || isClaiming}
            onClick={() => canClaim && handleClaimTask(task.id)}
            style={{
              padding: '8px 16px',
              background: canClaim
                ? colors.gradients.primary
                : isDark ? 'rgba(0, 255, 170, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: canClaim ? colors.background.primary : colors.text.tertiary,
              fontSize: '12px',
              fontWeight: 600,
              cursor: canClaim ? 'pointer' : 'not-allowed',
              opacity: canClaim ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isClaiming ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 size={14} />
                </motion.div>
                Claiming...
              </>
            ) : (
              'Claim'
            )}
          </motion.button>
        )}
      </motion.div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <ResponsiveLayout activeNav="rewards" title="Rewards">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: '16px',
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 size={40} color={colors.primary[400]} />
          </motion.div>
          <p style={{ color: colors.text.tertiary }}>Loading rewards...</p>
        </div>
      </ResponsiveLayout>
    );
  }

  // Not authenticated state
  if (!tokenManager.isAuthenticated()) {
    return (
      <ResponsiveLayout activeNav="rewards" title="Rewards">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: '16px',
          textAlign: 'center',
        }}>
          <Gift size={64} color={colors.text.tertiary} style={{ opacity: 0.5 }} />
          <h2 style={{ color: colors.text.primary, fontSize: '24px', fontWeight: 700 }}>
            Login to View Rewards
          </h2>
          <p style={{ color: colors.text.tertiary, maxWidth: '400px' }}>
            Sign in to your account to view and earn rewards, complete tasks, and track your VIP tier progress.
          </p>
        </div>
      </ResponsiveLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ResponsiveLayout activeNav="rewards" title="Rewards">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: '16px',
          textAlign: 'center',
        }}>
          <AlertCircle size={64} color={colors.status.error} style={{ opacity: 0.5 }} />
          <h2 style={{ color: colors.text.primary, fontSize: '24px', fontWeight: 700 }}>
            Failed to Load Rewards
          </h2>
          <p style={{ color: colors.text.tertiary, maxWidth: '400px' }}>
            {error}
          </p>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout activeNav="rewards" title="Rewards">
      {/* Background effects */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: colors.gradients.mesh,
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Gift size={32} color={colors.primary[400]} />
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: colors.text.primary,
                }}
              >
                Rewards Hub
              </h1>
              <span
                style={{
                  padding: '4px 12px',
                  background: colors.gradients.primary,
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: colors.background.primary,
                  textTransform: 'uppercase',
                }}
              >
                New
              </span>
            </div>
            <p style={{ fontSize: '15px', color: colors.text.tertiary }}>
              Complete tasks and earn rewards
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <Glass3DStat
            label="Total Points"
            value={userRewards?.totalPoints?.toLocaleString() || '0'}
            icon={<Sparkles size={20} />}
            trend="up"
          />
          <Glass3DStat
            label="Pending Rewards"
            value={userRewards?.pendingRewards || '$0.00'}
            icon={<Gift size={20} />}
          />
          <Glass3DStat
            label="Tasks Completed"
            value={userRewards?.completedTasks?.toString() || '0'}
            icon={<CheckCircle size={20} />}
          />
          <Glass3DStat
            label="Current Tier"
            value={userRewards?.currentTier || 'Bronze'}
            icon={<Crown size={20} />}
          />
        </motion.div>

        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '32px' }}
        >
          <Glass3DCard depth={1}>
            <div style={{ padding: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: colors.text.primary,
                      marginBottom: '4px',
                    }}
                  >
                    Tier Progress
                  </h3>
                  <p style={{ fontSize: '13px', color: colors.text.tertiary }}>
                    {userRewards?.tierProgress || 0}% to {userRewards?.nextTier || 'Silver'}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: tierColors[userRewards?.currentTier || 'Bronze'] || '#CD7F32',
                    }}
                  >
                    {userRewards?.currentTier || 'Bronze'}
                  </span>
                  <ChevronRight size={16} color={colors.text.tertiary} />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: tierColors[userRewards?.nextTier || 'Silver'] || '#C0C0C0',
                    }}
                  >
                    {userRewards?.nextTier || 'Silver'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: '8px',
                  background: isDark ? 'rgba(0, 255, 170, 0.1)' : 'rgba(16, 185, 129, 0.15)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${userRewards?.tierProgress || 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: colors.gradients.primary,
                    borderRadius: '4px',
                    boxShadow: colors.shadows.glow,
                  }}
                />
              </div>
            </div>
          </Glass3DCard>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Glass3DCard depth={2}>
            <div style={{ padding: '24px' }}>
              {/* Tab Headers */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '24px',
                }}
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background:
                        activeTab === tab.id
                          ? 'rgba(0, 255, 170, 0.15)'
                          : 'transparent',
                      border: `1px solid ${
                        activeTab === tab.id
                          ? colors.primary[400]
                          : colors.glass.border
                      }`,
                      borderRadius: '10px',
                      color:
                        activeTab === tab.id
                          ? colors.primary[400]
                          : colors.text.tertiary,
                      fontSize: '14px',
                      fontWeight: activeTab === tab.id ? 600 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <div>
                  {/* Daily Tasks */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: colors.text.primary,
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Zap size={18} color={colors.status.warning} />
                      Daily Tasks
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {dailyTasks.length > 0 ? (
                        dailyTasks.map((task, index) => renderTaskCard(task, index))
                      ) : (
                        <div style={{
                          padding: '40px',
                          textAlign: 'center',
                          color: colors.text.tertiary,
                        }}>
                          No daily tasks available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weekly Tasks */}
                  <div>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: colors.text.primary,
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Trophy size={18} color={colors.primary[400]} />
                      Weekly Challenges
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {weeklyTasks.length > 0 ? (
                        weeklyTasks.map((task, index) =>
                          renderTaskCard(task, index + dailyTasks.length)
                        )
                      ) : (
                        <div style={{
                          padding: '40px',
                          textAlign: 'center',
                          color: colors.text.tertiary,
                        }}>
                          No weekly tasks available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tiers Tab */}
              {activeTab === 'tiers' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(tiers.length, 5)}, 1fr)`,
                    gap: '16px',
                  }}
                >
                  {tiers.map((tier, index) => (
                    <motion.div
                      key={tier.id || tier.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        padding: '24px',
                        background: tier.current
                          ? isDark ? 'rgba(0, 255, 170, 0.05)' : 'rgba(16, 185, 129, 0.08)'
                          : isDark ? 'rgba(4, 26, 15, 0.5)' : '#ffffff',
                        border: `1px solid ${
                          tier.current ? colors.primary[400] : colors.glass.border
                        }`,
                        borderRadius: '16px',
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      {tier.current && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '4px 12px',
                            background: colors.gradients.primary,
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: colors.background.primary,
                            textTransform: 'uppercase',
                          }}
                        >
                          Current
                        </div>
                      )}

                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${tier.color || tierColors[tier.name] || '#CD7F32'}, ${tier.color || tierColors[tier.name] || '#CD7F32'}88)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                          color: colors.background.primary,
                        }}
                      >
                        {tierIcons[tier.name] || <Star size={24} />}
                      </div>

                      <h4
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: tier.color || tierColors[tier.name] || '#CD7F32',
                          marginBottom: '4px',
                        }}
                      >
                        {tier.name}
                      </h4>
                      <p
                        style={{
                          fontSize: '12px',
                          color: colors.text.tertiary,
                          marginBottom: '8px',
                        }}
                      >
                        Min. Volume: {tier.minVolume}
                      </p>
                      {tier.tradingFee && (
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.primary[400],
                            marginBottom: '12px',
                          }}
                        >
                          {tier.tradingFee} Fee
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        {tier.benefits.map((benefit, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '12px',
                              color: colors.text.secondary,
                            }}
                          >
                            <CheckCircle size={12} color={colors.primary[400]} />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  {historyLoading ? (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '60px',
                    }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 size={32} color={colors.primary[400]} />
                      </motion.div>
                    </div>
                  ) : history.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {history.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          style={{
                            padding: '16px 20px',
                            background: isDark ? 'rgba(4, 26, 15, 0.5)' : '#ffffff',
                            border: `1px solid ${colors.glass.border}`,
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: colors.text.primary,
                              marginBottom: '4px',
                            }}>
                              {item.title}
                            </h4>
                            <p style={{
                              fontSize: '12px',
                              color: colors.text.tertiary,
                            }}>
                              {item.description}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: colors.primary[400],
                              fontFamily: "'JetBrains Mono', monospace",
                            }}>
                              +{item.amount} {item.amountType === 'points' ? 'pts' : 'USDT'}
                            </p>
                            <p style={{
                              fontSize: '11px',
                              color: colors.text.tertiary,
                            }}>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '60px 40px',
                        textAlign: 'center',
                      }}
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'rgba(0, 255, 170, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '24px',
                        }}
                      >
                        <Clock size={40} color={colors.text.tertiary} />
                      </motion.div>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: colors.text.primary,
                          marginBottom: '8px',
                        }}
                      >
                        No reward history yet
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: colors.text.tertiary,
                          maxWidth: '400px',
                        }}
                      >
                        Complete tasks and claim rewards to see your history here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Glass3DCard>
        </motion.div>
    </ResponsiveLayout>
  );
};

export default RewardsScreen;
