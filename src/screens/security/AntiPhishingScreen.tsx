import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronLeft,
  CheckCircle,
  Shield,
  Mail,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, Button, ResponsiveLayout } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

export const AntiPhishingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, mode } = useThemeMode();
  const isDark = mode === 'dark';
  const { user, refreshUser } = useAuth();

  // State
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingCode, setExistingCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing anti-phishing status
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const status = await userService.getAntiPhishingStatus();
        if (status.isSet && status.maskedCode) {
          setExistingCode(status.maskedCode);
        }
      } catch (err) {
        console.error('Failed to load anti-phishing status:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStatus();
  }, []);

  const validateCode = () => {
    if (!code) {
      setError('Please enter an anti-phishing code');
      return false;
    }
    if (code.length < 4) {
      setError('Code must be at least 4 characters');
      return false;
    }
    if (code.length > 20) {
      setError('Code must be 20 characters or less');
      return false;
    }
    if (code !== confirmCode) {
      setError('Codes do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateCode()) return;

    setIsSubmitting(true);

    try {
      await userService.setAntiPhishingCode(code);
      setSuccess(true);
      if (refreshUser) refreshUser();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to set anti-phishing code. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    paddingRight: '48px',
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    border: `1px solid ${colors.glass.border}`,
    borderRadius: '12px',
    color: colors.text.primary,
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  if (isLoading) {
    return (
      <ResponsiveLayout>
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <Loader2 size={32} color={colors.primary[400]} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      </ResponsiveLayout>
    );
  }

  if (success) {
    return (
      <ResponsiveLayout>
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', maxWidth: '400px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `${colors.status.success}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <CheckCircle size={40} color={colors.status.success} />
            </motion.div>

            <h2 style={{ fontSize: '24px', fontWeight: 700, color: colors.text.primary, marginBottom: '12px' }}>
              Anti-Phishing Code Set!
            </h2>
            <p style={{ fontSize: '14px', color: colors.text.secondary, marginBottom: '32px', lineHeight: 1.6 }}>
              Your anti-phishing code has been saved. All official CrymadX emails will now include
              your personal code so you can verify they're authentic.
            </p>

            <div style={{
              padding: '20px',
              background: `${colors.primary[400]}10`,
              border: `1px solid ${colors.primary[400]}30`,
              borderRadius: '16px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Mail size={20} color={colors.primary[400]} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text.primary }}>
                  Example Email Header
                </span>
              </div>
              <div style={{
                padding: '12px 16px',
                background: colors.background.primary,
                borderRadius: '8px',
                fontSize: '13px',
                color: colors.text.secondary,
              }}>
                <span>Your anti-phishing code: </span>
                <span style={{ fontWeight: 600, color: colors.primary[400] }}>{code}</span>
              </div>
            </div>

            <Button variant="primary" onClick={() => navigate('/profile')}>
              Return to Profile
            </Button>
          </motion.div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div style={{ padding: isMobile ? '16px' : '24px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: colors.text.tertiary,
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${colors.status.warning}20, ${colors.status.warning}10)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertTriangle size={24} color={colors.status.warning} />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: colors.text.primary, margin: 0 }}>
                Anti-Phishing Code
              </h1>
              <p style={{ fontSize: '14px', color: colors.text.tertiary, margin: 0 }}>
                Protect yourself from phishing attacks
              </p>
            </div>
          </div>
        </motion.div>

        <GlassCard padding="lg">
          {/* Info Section */}
          <div style={{
            padding: '20px',
            background: `linear-gradient(135deg, ${colors.primary[400]}10, ${colors.secondary[400]}08)`,
            borderRadius: '16px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${colors.primary[400]}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Shield size={20} color={colors.primary[400]} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                  What is an Anti-Phishing Code?
                </h4>
                <p style={{ fontSize: '13px', color: colors.text.secondary, lineHeight: 1.6, margin: 0 }}>
                  Your anti-phishing code is a secret word or phrase that will appear in all official
                  emails from CrymadX. If you receive an email claiming to be from us but doesn't
                  contain your code, it's likely a phishing attempt.
                </p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          {existingCode && (
            <div style={{
              padding: '16px 20px',
              background: `${colors.status.success}10`,
              border: `1px solid ${colors.status.success}30`,
              borderRadius: '12px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle size={20} color={colors.status.success} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text.primary }}>
                    Anti-phishing code is set
                  </span>
                  <p style={{ fontSize: '12px', color: colors.text.secondary, margin: '4px 0 0' }}>
                    Current code: <span style={{ fontWeight: 600, color: colors.primary[400] }}>{existingCode}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary, marginBottom: '12px' }}>
              {existingCode ? 'Update your code:' : 'Tips for choosing a good code:'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Use something memorable but not easily guessable',
                'Avoid personal information like names or birthdates',
                'Consider using a random phrase or inside joke',
                'Keep it between 4-20 characters',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle size={16} color={colors.status.success} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: colors.text.secondary }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: colors.text.secondary,
                marginBottom: '8px',
              }}>
                Enter your anti-phishing code
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCode ? 'text' : 'password'}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter a memorable code"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.text.tertiary,
                    padding: '4px',
                  }}
                >
                  {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: colors.text.secondary,
                marginBottom: '8px',
              }}>
                Confirm your code
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCode ? 'text' : 'password'}
                  value={confirmCode}
                  onChange={(e) => {
                    setConfirmCode(e.target.value);
                    setError(null);
                  }}
                  placeholder="Confirm your code"
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: `${colors.status.error}10`,
                border: `1px solid ${colors.status.error}30`,
                borderRadius: '10px',
              }}>
                <AlertTriangle size={16} color={colors.status.error} />
                <span style={{ fontSize: '13px', color: colors.status.error }}>{error}</span>
              </div>
            )}

            <div style={{
              padding: '14px 16px',
              background: `${colors.status.warning}10`,
              border: `1px solid ${colors.status.warning}30`,
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} color={colors.status.warning} />
                <span style={{ fontSize: '12px', color: colors.status.warning }}>
                  Never share your anti-phishing code with anyone!
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!code || !confirmCode || isSubmitting}
              style={{ width: '100%' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  {existingCode ? 'Updating Code...' : 'Setting Code...'}
                </>
              ) : (
                <>
                  <Shield size={18} />
                  {existingCode ? 'Update Anti-Phishing Code' : 'Set Anti-Phishing Code'}
                </>
              )}
            </Button>
          </div>
        </GlassCard>
      </div>
    </ResponsiveLayout>
  );
};

export default AntiPhishingScreen;
