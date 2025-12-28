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
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Glass3DCard, Glass3DStat } from '../../components/Glass3D';
import { ResponsiveLayout } from '../../components';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  total: number;
  completed: boolean;
  icon: React.ReactNode;
}

interface Tier {
  name: string;
  icon: React.ReactNode;
  minVolume: string;
  benefits: string[];
  color: string;
  current?: boolean;
}

export const RewardsScreen: React.FC = () => {
  const { colors, isDark } = useThemeMode();
  const [activeTab, setActiveTab] = useState<'tasks' | 'tiers' | 'history'>('tasks');
  const [_isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Mock user rewards data
  const userRewards = {
    totalPoints: 2450,
    pendingRewards: '$12.50',
    completedTasks: 8,
    currentTier: 'Bronze',
    nextTier: 'Silver',
    tierProgress: 35,
  };

  const dailyTasks: Task[] = [
    {
      id: '1',
      title: 'Daily Login',
      description: 'Log in to your account',
      reward: '10 Points',
      progress: 1,
      total: 1,
      completed: true,
      icon: <CheckCircle size={20} />,
    },
    {
      id: '2',
      title: 'Complete a Trade',
      description: 'Execute any spot trade',
      reward: '25 Points',
      progress: 0,
      total: 1,
      completed: false,
      icon: <Zap size={20} />,
    },
    {
      id: '3',
      title: 'Deposit Funds',
      description: 'Make any deposit',
      reward: '50 Points',
      progress: 0,
      total: 1,
      completed: false,
      icon: <Target size={20} />,
    },
  ];

  const weeklyTasks: Task[] = [
    {
      id: '4',
      title: 'Trading Volume',
      description: 'Trade $1,000 in volume',
      reward: '200 Points',
      progress: 450,
      total: 1000,
      completed: false,
      icon: <TrendingUp size={20} />,
    },
    {
      id: '5',
      title: 'Refer a Friend',
      description: 'Get a friend to sign up',
      reward: '500 Points',
      progress: 0,
      total: 1,
      completed: false,
      icon: <Users size={20} />,
    },
  ];

  const tiers: Tier[] = [
    {
      name: 'Bronze',
      icon: <Star size={24} />,
      minVolume: '$0',
      benefits: ['0.1% Trading Fee', 'Basic Support', 'Daily Tasks'],
      color: '#CD7F32',
      current: true,
    },
    {
      name: 'Silver',
      icon: <Trophy size={24} />,
      minVolume: '$10,000',
      benefits: ['0.08% Trading Fee', 'Priority Support', 'Bonus Rewards'],
      color: '#C0C0C0',
    },
    {
      name: 'Gold',
      icon: <Crown size={24} />,
      minVolume: '$50,000',
      benefits: ['0.05% Trading Fee', 'VIP Support', 'Exclusive Events'],
      color: '#FFD700',
    },
    {
      name: 'Platinum',
      icon: <Flame size={24} />,
      minVolume: '$250,000',
      benefits: ['0.02% Trading Fee', 'Dedicated Manager', 'Custom Benefits'],
      color: '#E5E4E2',
    },
  ];

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: <Target size={16} /> },
    { id: 'tiers', label: 'VIP Tiers', icon: <Crown size={16} /> },
    { id: 'history', label: 'History', icon: <Clock size={16} /> },
  ];

  const renderTaskCard = (task: Task, index: number) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        padding: '20px',
        background: task.completed
          ? isDark ? 'rgba(0, 255, 170, 0.05)' : 'rgba(16, 185, 129, 0.08)'
          : isDark ? 'rgba(4, 26, 15, 0.5)' : '#ffffff',
        border: `1px solid ${task.completed ? colors.primary[400] : colors.glass.border}`,
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
          background: task.completed
            ? colors.gradients.primary
            : isDark ? 'rgba(0, 255, 170, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: task.completed ? colors.background.primary : colors.primary[400],
          flexShrink: 0,
        }}
      >
        {task.icon}
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
            {task.reward}
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
            animate={{ width: `${(task.progress / task.total) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              height: '100%',
              background: task.completed
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
            {task.progress}/{task.total}
          </span>
        </div>
      </div>

      {task.completed ? (
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={task.progress < task.total}
          style={{
            padding: '8px 16px',
            background:
              task.progress >= task.total
                ? colors.gradients.primary
                : isDark ? 'rgba(0, 255, 170, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            border: 'none',
            borderRadius: '8px',
            color:
              task.progress >= task.total
                ? colors.background.primary
                : colors.text.tertiary,
            fontSize: '12px',
            fontWeight: 600,
            cursor: task.progress >= task.total ? 'pointer' : 'not-allowed',
            opacity: task.progress >= task.total ? 1 : 0.5,
          }}
        >
          Claim
        </motion.button>
      )}
    </motion.div>
  );

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
            value={userRewards.totalPoints.toLocaleString()}
            icon={<Sparkles size={20} />}
            trend="up"
          />
          <Glass3DStat
            label="Pending Rewards"
            value={userRewards.pendingRewards}
            icon={<Gift size={20} />}
          />
          <Glass3DStat
            label="Tasks Completed"
            value={userRewards.completedTasks.toString()}
            icon={<CheckCircle size={20} />}
          />
          <Glass3DStat
            label="Current Tier"
            value={userRewards.currentTier}
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
                    {userRewards.tierProgress}% to {userRewards.nextTier}
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
                      color: '#CD7F32',
                    }}
                  >
                    {userRewards.currentTier}
                  </span>
                  <ChevronRight size={16} color={colors.text.tertiary} />
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#C0C0C0',
                    }}
                  >
                    {userRewards.nextTier}
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
                  animate={{ width: `${userRewards.tierProgress}%` }}
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
                      {dailyTasks.map((task, index) => renderTaskCard(task, index))}
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
                      {weeklyTasks.map((task, index) =>
                        renderTaskCard(task, index + dailyTasks.length)
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
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                  }}
                >
                  {tiers.map((tier, index) => (
                    <motion.div
                      key={tier.name}
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
                          background: `linear-gradient(135deg, ${tier.color}, ${tier.color}88)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                          color: colors.background.primary,
                        }}
                      >
                        {tier.icon}
                      </div>

                      <h4
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: tier.color,
                          marginBottom: '4px',
                        }}
                      >
                        {tier.name}
                      </h4>
                      <p
                        style={{
                          fontSize: '12px',
                          color: colors.text.tertiary,
                          marginBottom: '16px',
                        }}
                      >
                        Min. Volume: {tier.minVolume}
                      </p>

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
          </Glass3DCard>
        </motion.div>
    </ResponsiveLayout>
  );
};

export default RewardsScreen;
