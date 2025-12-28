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
              <Users size={32} color={colors.primary[400]} />
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: colors.text.primary,
                }}
              >
                Referral Program
              </h1>
            </div>
            <p style={{ fontSize: '15px', color: colors.text.tertiary }}>
              Invite friends and earn {referralData.commissionRate} commission
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: colors.shadows.glowLg }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: colors.gradients.primary,
              border: 'none',
              borderRadius: '12px',
              color: colors.background.primary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: colors.shadows.glow,
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
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.text.primary,
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
                    background: 'rgba(0, 255, 170, 0.05)',
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: colors.text.secondary,
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
                      background: copied ? colors.status.success : 'rgba(0, 255, 170, 0.1)',
                      border: `1px solid ${copied ? colors.status.success : colors.glass.border}`,
                      borderRadius: '8px',
                      color: copied ? colors.background.primary : colors.primary[400],
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
                <span style={{ fontSize: '14px', color: colors.text.tertiary }}>
                  Referral Code:
                </span>
                <div
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(0, 255, 170, 0.1)',
                    border: `1px solid ${colors.primary[400]}`,
                    borderRadius: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: colors.primary[400],
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
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '8px',
                    color: colors.text.secondary,
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
              fontSize: '18px',
              fontWeight: 600,
              color: colors.text.primary,
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
                        background: 'rgba(0, 255, 170, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: colors.primary[400],
                      }}
                    >
                      {index + 1}
                    </div>

                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'rgba(0, 255, 170, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        color: colors.primary[400],
                      }}
                    >
                      {step.icon}
                    </div>
                    <h4
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: colors.text.primary,
                        marginBottom: '8px',
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '13px',
                        color: colors.text.tertiary,
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
                          color: colors.text.tertiary,
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
                      padding: '10px 20px',
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
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                  padding: '12px 16px',
                  borderBottom: `1px solid ${colors.glass.border}`,
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text.tertiary, textTransform: 'uppercase' }}>
                  User
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text.tertiary, textTransform: 'uppercase' }}>
                  Joined
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text.tertiary, textTransform: 'uppercase' }}>
                  Status
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text.tertiary, textTransform: 'uppercase', textAlign: 'right' }}>
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
                  whileHover={{ background: 'rgba(0, 255, 170, 0.03)' }}
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
                        background: 'rgba(0, 255, 170, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.primary[400],
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      {referral.username.charAt(0).toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: colors.text.primary,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {referral.username}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '13px',
                      color: colors.text.secondary,
                    }}
                  >
                    {referral.date}
                  </span>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
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
                        fontSize: '12px',
                        fontWeight: 500,
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
                      fontSize: '14px',
                      fontWeight: 600,
                      color: colors.primary[400],
                      fontFamily: "'JetBrains Mono', monospace",
                      textAlign: 'right',
                    }}
                  >
                    {referral.earnings}
                  </span>
                </motion.div>
              ))}

              {/* Empty State if no referrals */}
              {referrals.length === 0 && (
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
                      fontWeight: 600,
                      color: colors.text.primary,
                      marginBottom: '8px',
                    }}
                  >
                    No referrals yet
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: colors.text.tertiary,
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
