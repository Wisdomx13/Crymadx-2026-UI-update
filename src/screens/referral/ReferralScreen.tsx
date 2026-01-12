import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Copy,
  Share2,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Check,
  Twitter,
  Send,
  Link2,
  UserPlus,
  Award,
  Wallet,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Glass3DCard, Glass3DStat } from '../../components/Glass3D';
import { ResponsiveLayout } from '../../components';

interface Referral {
  id: string;
  username: string;
  date: string;
  status: 'active' | 'pending' | 'inactive';
  earnings: string;
}

export const ReferralScreen: React.FC = () => {
  const { colors, isDark } = useThemeMode();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'payouts'>('overview');
  const [_isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Mock referral data
  const referralData = {
    code: 'CRYMADX2024',
    link: 'https://crymadx.io/ref/CRYMADX2024',
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: '$245.50',
    pendingEarnings: '$32.00',
    commissionRate: '20%',
  };

  const referrals: Referral[] = [
    { id: '1', username: 'user***1234', date: '2024-01-15', status: 'active', earnings: '$45.20' },
    { id: '2', username: 'trader***567', date: '2024-01-12', status: 'active', earnings: '$32.80' },
    { id: '3', username: 'crypto***890', date: '2024-01-10', status: 'pending', earnings: '$0.00' },
    { id: '4', username: 'invest***234', date: '2024-01-08', status: 'active', earnings: '$28.50' },
    { id: '5', username: 'whale***678', date: '2024-01-05', status: 'inactive', earnings: '$15.00' },
  ];

  const steps = [
    {
      icon: <Link2 size={24} />,
      title: 'Share Your Link',
      description: 'Copy your unique referral link and share it with friends',
    },
    {
      icon: <UserPlus size={24} />,
      title: 'Friends Sign Up',
      description: 'When friends register using your link, they become your referrals',
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'They Trade',
      description: 'Your referrals start trading on CrymadX platform',
    },
    {
      icon: <Wallet size={24} />,
      title: 'Earn Commission',
      description: 'Earn 20% of their trading fees as commission',
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'referrals', label: 'My Referrals' },
    { id: 'payouts', label: 'Payouts' },
  ];

  return (
    <ResponsiveLayout activeNav="referral" title="Referral">
      {/* Background effects - Dark mode only */}
      {isDark && (
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
      )}
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
              <Users size={32} color={isDark ? colors.primary[400] : '#000000'} />
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#000000',
                }}
              >
                Referral Program
              </h1>
            </div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: isDark ? colors.text.tertiary : '#000000' }}>
              Invite friends and earn {referralData.commissionRate} commission
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: isDark ? colors.shadows.glowLg : 'none' }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: isDark ? colors.gradients.primary : '#000000',
              border: 'none',
              borderRadius: '12px',
              color: isDark ? colors.background.primary : '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: isDark ? colors.shadows.glow : 'none',
            }}
          >
            <Share2 size={18} />
            Share Now
          </motion.button>
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
            label="Total Referrals"
            value={referralData.totalReferrals.toString()}
            icon={<Users size={20} />}
          />
          <Glass3DStat
            label="Active Referrals"
            value={referralData.activeReferrals.toString()}
            icon={<UserPlus size={20} />}
            trend="up"
          />
          <Glass3DStat
            label="Total Earnings"
            value={referralData.totalEarnings}
            icon={<DollarSign size={20} />}
          />
          <Glass3DStat
            label="Pending Earnings"
            value={referralData.pendingEarnings}
            icon={<Award size={20} />}
          />
        </motion.div>

        {/* Referral Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '32px' }}
        >
          <Glass3DCard depth={1}>
            <div style={{ padding: '24px' }}>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '16px',
                }}
              >
                Your Referral Link
              </h3>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    background: isDark ? 'rgba(0, 255, 170, 0.05)' : '#f9fafb',
                    border: `1px solid ${isDark ? colors.glass.border : '#d1d5db'}`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: isDark ? colors.text.secondary : '#000000',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {referralData.link}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy(referralData.link)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: copied ? (isDark ? colors.status.success : '#000000') : (isDark ? 'rgba(0, 255, 170, 0.1)' : '#f3f4f6'),
                      border: `1px solid ${copied ? (isDark ? colors.status.success : '#000000') : (isDark ? colors.glass.border : '#d1d5db')}`,
                      borderRadius: '8px',
                      color: copied ? (isDark ? colors.background.primary : '#ffffff') : (isDark ? colors.primary[400] : '#000000'),
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </motion.button>
                </div>
              </div>

              {/* Referral Code */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#000000' }}>
                  Referral Code:
                </span>
                <div
                  style={{
                    padding: '8px 16px',
                    background: isDark ? 'rgba(0, 255, 170, 0.1)' : '#f3f4f6',
                    border: `1px solid ${isDark ? colors.primary[400] : '#000000'}`,
                    borderRadius: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: isDark ? colors.primary[400] : '#000000',
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '0.1em',
                    }}
                  >
                    {referralData.code}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(referralData.code)}
                  style={{
                    padding: '8px',
                    background: 'transparent',
                    border: `1px solid ${isDark ? colors.glass.border : '#d1d5db'}`,
                    borderRadius: '8px',
                    color: isDark ? colors.text.secondary : '#374151',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <Copy size={16} />
                </motion.button>
              </div>

              {/* Share Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.02, background: '#1DA1F2' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: 'rgba(29, 161, 242, 0.2)',
                    border: '1px solid rgba(29, 161, 242, 0.3)',
                    borderRadius: '10px',
                    color: '#1DA1F2',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Twitter size={16} />
                  Twitter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, background: '#0088cc' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: 'rgba(0, 136, 204, 0.2)',
                    border: '1px solid rgba(0, 136, 204, 0.3)',
                    borderRadius: '10px',
                    color: '#0088cc',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Send size={16} />
                  Telegram
                </motion.button>
              </div>
            </div>
          </Glass3DCard>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: '32px' }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '20px',
            }}
          >
            How It Works
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Glass3DCard depth={1}>
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Step number */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isDark ? 'rgba(0, 255, 170, 0.15)' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: isDark ? colors.primary[400] : '#000000',
                      }}
                    >
                      {index + 1}
                    </div>

                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: isDark ? 'rgba(0, 255, 170, 0.1)' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        color: isDark ? colors.primary[400] : '#000000',
                      }}
                    >
                      {step.icon}
                    </div>
                    <h4
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#000000',
                        marginBottom: '8px',
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: isDark ? colors.text.tertiary : '#374151',
                        lineHeight: 1.5,
                      }}
                    >
                      {step.description}
                    </p>

                    {/* Arrow to next step */}
                    {index < steps.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          right: '-20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: isDark ? colors.text.tertiary : '#9ca3af',
                          zIndex: 10,
                        }}
                      >
                        <ChevronRight size={20} />
                      </div>
                    )}
                  </div>
                </Glass3DCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Referrals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Glass3DCard depth={2}>
            <div style={{ padding: '24px' }}>
              {/* Tabs */}
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
                      padding: '12px 24px',
                      background:
                        activeTab === tab.id
                          ? (isDark ? 'rgba(0, 255, 170, 0.15)' : '#000000')
                          : 'transparent',
                      border: `1px solid ${
                        activeTab === tab.id
                          ? (isDark ? colors.primary[400] : '#000000')
                          : (isDark ? colors.glass.border : '#d1d5db')
                      }`,
                      borderRadius: '10px',
                      color:
                        activeTab === tab.id
                          ? (isDark ? colors.primary[400] : '#ffffff')
                          : (isDark ? colors.text.tertiary : '#000000'),
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Overview Tab Content */}
              {activeTab === 'overview' && (
                <>
                  {/* Table Header */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                      padding: '12px 16px',
                      borderBottom: `2px solid ${isDark ? colors.glass.border : '#000000'}`,
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#000000', textTransform: 'uppercase' }}>
                      User
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#000000', textTransform: 'uppercase' }}>
                      Joined
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#000000', textTransform: 'uppercase' }}>
                      Status
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isDark ? colors.text.tertiary : '#000000', textTransform: 'uppercase', textAlign: 'right' }}>
                      Earnings
                    </span>
                  </div>

                  {/* Table Rows */}
                  {referrals.map((referral, index) => (
                    <motion.div
                      key={referral.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ background: isDark ? 'rgba(0, 255, 170, 0.03)' : '#f9fafb' }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                        padding: '16px',
                        borderRadius: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: isDark ? 'rgba(0, 255, 170, 0.1)' : '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isDark ? colors.primary[400] : '#000000',
                            fontSize: '15px',
                            fontWeight: 700,
                          }}
                        >
                          {referral.username.charAt(0).toUpperCase()}
                        </div>
                        <span
                          style={{
                            fontSize: '15px',
                            fontWeight: 600,
                            color: isDark ? colors.text.primary : '#000000',
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {referral.username}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: isDark ? colors.text.secondary : '#000000',
                        }}
                      >
                        {referral.date}
                      </span>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background:
                            referral.status === 'active'
                              ? 'rgba(0, 255, 170, 0.1)'
                              : referral.status === 'pending'
                              ? 'rgba(255, 193, 7, 0.1)'
                              : 'rgba(255, 51, 102, 0.1)',
                          width: 'fit-content',
                        }}
                      >
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background:
                              referral.status === 'active'
                                ? colors.status.success
                                : referral.status === 'pending'
                                ? colors.status.warning
                                : colors.status.error,
                          }}
                        />
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color:
                              referral.status === 'active'
                                ? colors.status.success
                                : referral.status === 'pending'
                                ? colors.status.warning
                                : colors.status.error,
                            textTransform: 'capitalize',
                          }}
                        >
                          {referral.status}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: isDark ? colors.text.primary : '#000000',
                          fontFamily: "'JetBrains Mono', monospace",
                          textAlign: 'right',
                        }}
                      >
                        {referral.earnings}
                      </span>
                    </motion.div>
                  ))}
                </>
              )}

              {/* My Referrals Tab Content */}
              {activeTab === 'referrals' && (
                <>
                  {/* Summary Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '20px', background: isDark ? 'rgba(0, 255, 170, 0.05)' : '#f9fafb', borderRadius: '12px', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}` }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '8px' }}>Total Referrals</p>
                      <p style={{ fontSize: '28px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000' }}>{referralData.totalReferrals}</p>
                    </div>
                    <div style={{ padding: '20px', background: isDark ? 'rgba(0, 255, 170, 0.05)' : '#f9fafb', borderRadius: '12px', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}` }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '8px' }}>Active</p>
                      <p style={{ fontSize: '28px', fontWeight: 700, color: colors.status.success }}>{referralData.activeReferrals}</p>
                    </div>
                    <div style={{ padding: '20px', background: isDark ? 'rgba(0, 255, 170, 0.05)' : '#f9fafb', borderRadius: '12px', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}` }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '8px' }}>Pending</p>
                      <p style={{ fontSize: '28px', fontWeight: 700, color: colors.status.warning }}>{referralData.totalReferrals - referralData.activeReferrals}</p>
                    </div>
                  </div>

                  {/* Referral List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {referrals.map((referral, index) => (
                      <motion.div
                        key={referral.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          padding: '16px 20px',
                          background: isDark ? 'rgba(0, 255, 170, 0.03)' : '#ffffff',
                          border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: isDark ? 'rgba(0, 255, 170, 0.1)' : '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: 700,
                            color: isDark ? colors.primary[400] : '#000000',
                          }}>
                            {referral.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '4px' }}>{referral.username}</p>
                            <p style={{ fontSize: '13px', fontWeight: 500, color: isDark ? colors.text.tertiary : '#6b7280' }}>Joined {referral.date}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '16px', fontWeight: 700, color: isDark ? colors.primary[400] : '#000000', marginBottom: '4px' }}>{referral.earnings}</p>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: referral.status === 'active' ? 'rgba(0, 255, 170, 0.1)' : referral.status === 'pending' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 51, 102, 0.1)',
                            color: referral.status === 'active' ? colors.status.success : referral.status === 'pending' ? colors.status.warning : colors.status.error,
                            textTransform: 'capitalize',
                          }}>{referral.status}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Payouts Tab Content */}
              {activeTab === 'payouts' && (
                <>
                  {/* Payout Summary */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '24px', background: isDark ? 'rgba(0, 255, 170, 0.05)' : '#f9fafb', borderRadius: '12px', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}` }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '8px' }}>Total Earned</p>
                      <p style={{ fontSize: '32px', fontWeight: 700, color: isDark ? colors.primary[400] : '#000000' }}>{referralData.totalEarnings}</p>
                    </div>
                    <div style={{ padding: '24px', background: isDark ? 'rgba(0, 255, 170, 0.05)' : '#f9fafb', borderRadius: '12px', border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}` }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? colors.text.tertiary : '#6b7280', marginBottom: '8px' }}>Pending Payout</p>
                      <p style={{ fontSize: '32px', fontWeight: 700, color: colors.status.warning }}>{referralData.pendingEarnings}</p>
                    </div>
                  </div>

                  {/* Payout History */}
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '16px' }}>Payout History</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { id: 1, amount: '$120.50', date: '2024-01-10', status: 'completed', method: 'USDT (TRC20)' },
                      { id: 2, amount: '$85.00', date: '2024-01-03', status: 'completed', method: 'USDT (TRC20)' },
                      { id: 3, amount: '$32.00', date: '2024-01-15', status: 'pending', method: 'USDT (TRC20)' },
                    ].map((payout, index) => (
                      <motion.div
                        key={payout.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          padding: '16px 20px',
                          background: isDark ? 'rgba(0, 255, 170, 0.03)' : '#ffffff',
                          border: `1px solid ${isDark ? colors.glass.border : '#e5e7eb'}`,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: 700, color: isDark ? colors.text.primary : '#000000', marginBottom: '4px' }}>{payout.amount}</p>
                          <p style={{ fontSize: '13px', fontWeight: 500, color: isDark ? colors.text.tertiary : '#6b7280' }}>{payout.date} - {payout.method}</p>
                        </div>
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          background: payout.status === 'completed' ? 'rgba(0, 255, 170, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                          color: payout.status === 'completed' ? colors.status.success : colors.status.warning,
                          textTransform: 'capitalize',
                        }}>{payout.status}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Withdraw Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      marginTop: '24px',
                      padding: '16px',
                      background: isDark ? colors.gradients.primary : '#000000',
                      border: 'none',
                      borderRadius: '12px',
                      color: isDark ? colors.background.primary : '#ffffff',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Withdraw Earnings
                  </motion.button>
                </>
              )}

              {/* Empty State if no referrals */}
              {activeTab === 'overview' && referrals.length === 0 && (
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
                    <Users size={40} color={colors.text.tertiary} />
                  </motion.div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: isDark ? colors.text.primary : '#000000',
                      marginBottom: '8px',
                    }}
                  >
                    No referrals yet
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isDark ? colors.text.tertiary : '#6b7280',
                      maxWidth: '400px',
                    }}
                  >
                    Share your referral link with friends to start earning commission.
                  </p>
                </div>
              )}
            </div>
          </Glass3DCard>
        </motion.div>
    </ResponsiveLayout>
  );
};

export default ReferralScreen;
