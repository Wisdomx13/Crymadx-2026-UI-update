import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Shield, UserCheck, ChevronRight, X } from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface VerificationBannerProps {
  onDismiss?: () => void;
  compact?: boolean;
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ onDismiss, compact = false }) => {
  const navigate = useNavigate();
  const { colors, isDark } = useThemeMode();
  const { user } = useAuth();

  // Check verification status
  const is2FAEnabled = user?.is2FAEnabled || false;
  const kycLevel = user?.kycLevel || 0;
  const isKycVerified = kycLevel > 0;

  // If both are verified, don't show the banner
  if (is2FAEnabled && isKycVerified) {
    return null;
  }

  // Determine what's missing
  const missing2FA = !is2FAEnabled;
  const missingKYC = !isKycVerified;
  const missingBoth = missing2FA && missingKYC;

  // Banner styling
  const bannerBg = isDark
    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.1))'
    : 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.08))';

  const borderColor = isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.4)';

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: bannerBg,
          borderRadius: '12px',
          border: `1px solid ${borderColor}`,
          marginBottom: '16px',
        }}
      >
        <AlertTriangle size={20} color={colors.status.warning} />
        <span style={{
          flex: 1,
          fontSize: '13px',
          color: isDark ? 'rgba(255,255,255,0.9)' : '#374151',
          fontWeight: 500,
        }}>
          {missingBoth
            ? 'Complete KYC verification and enable 2FA to unlock all features'
            : missing2FA
            ? 'Enable 2FA to secure your account'
            : 'Complete KYC verification to unlock withdrawals'}
        </span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/profile')}
          style={{
            padding: '8px 16px',
            background: colors.gradients.primarySolid,
            border: 'none',
            borderRadius: '8px',
            color: isDark ? colors.background.primary : '#fff',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Verify Now
          <ChevronRight size={14} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: bannerBg,
        borderRadius: '16px',
        border: `1px solid ${borderColor}`,
        padding: '20px 24px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated warning pulse */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dismiss button */}
      {onDismiss && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
          }}
        >
          <X size={14} />
        </motion.button>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Warning Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <AlertTriangle size={24} color={colors.status.warning} />
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: isDark ? '#ffffff' : '#111827',
            marginBottom: '6px',
          }}>
            Account Verification Required
          </h3>
          <p style={{
            fontSize: '14px',
            color: isDark ? 'rgba(255,255,255,0.7)' : '#6b7280',
            lineHeight: 1.5,
            marginBottom: '16px',
          }}>
            {missingBoth
              ? 'To unlock full trading features, withdrawals, and enhanced security, please complete KYC verification and enable Two-Factor Authentication.'
              : missing2FA
              ? 'Protect your account with Two-Factor Authentication. This adds an extra layer of security to prevent unauthorized access.'
              : 'Complete your identity verification (KYC) to unlock withdrawal features and higher trading limits.'}
          </p>

          {/* Action Items */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {missingKYC && (
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <UserCheck size={18} />
                Complete KYC
                <ChevronRight size={16} />
              </motion.button>
            )}

            {missing2FA && (
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: missingKYC
                    ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')
                    : colors.gradients.primarySolid,
                  border: missingKYC ? `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}` : 'none',
                  borderRadius: '10px',
                  color: missingKYC
                    ? (isDark ? 'rgba(255,255,255,0.9)' : '#374151')
                    : (isDark ? colors.background.primary : '#ffffff'),
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Shield size={18} />
                Enable 2FA
                <ChevronRight size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: isDark ? 'rgba(255,255,255,0.6)' : '#6b7280',
          }}>
            Verification Progress
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: colors.primary[400],
          }}>
            {is2FAEnabled && isKycVerified ? '100%' : is2FAEnabled || isKycVerified ? '50%' : '0%'}
          </span>
        </div>
        <div style={{
          height: '6px',
          borderRadius: '3px',
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: is2FAEnabled && isKycVerified ? '100%' : is2FAEnabled || isKycVerified ? '50%' : '0%'
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: colors.gradients.primarySolid,
              borderRadius: '3px',
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: isKycVerified ? colors.status.success : 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {isKycVerified && <UserCheck size={10} color="#fff" />}
            </div>
            <span style={{
              fontSize: '11px',
              color: isKycVerified ? colors.status.success : (isDark ? 'rgba(255,255,255,0.5)' : '#9ca3af'),
              fontWeight: 500,
            }}>
              KYC Verified
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: is2FAEnabled ? colors.status.success : 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {is2FAEnabled && <Shield size={10} color="#fff" />}
            </div>
            <span style={{
              fontSize: '11px',
              color: is2FAEnabled ? colors.status.success : (isDark ? 'rgba(255,255,255,0.5)' : '#9ca3af'),
              fontWeight: 500,
            }}>
              2FA Enabled
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VerificationBanner;
