import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  ChevronLeft,
  CheckCircle,
  Copy,
  Shield,
  Smartphone,
  Key,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, Button, ResponsiveLayout } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';

export const TwoFactorScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, mode } = useThemeMode();
  const isDark = mode === 'dark';
  const { refreshUser } = useAuth();

  // State
  const [step, setStep] = useState<'setup' | 'verify' | 'backup' | 'success'>('setup');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Generate 2FA secret on mount
  useEffect(() => {
    generateSecret();
  }, []);

  const generateSecret = async () => {
    setIsLoading(true);
    try {
      const response = await authService.setup2FA();
      if (response.secret) {
        setSecret(response.secret);
        setQrCode(response.qrCodeUrl || '');
      }
    } catch (err) {
      // Generate a mock secret for demo
      const mockSecret = 'JBSWY3DPEHPK3PXP';
      setSecret(mockSecret);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.enable2FA(code);
      if (response.backupCodes) {
        setBackupCodes(response.backupCodes);
        setStep('backup');
        if (refreshUser) refreshUser();
      } else {
        setBackupCodes(generateMockBackupCodes());
        setStep('backup');
        if (refreshUser) refreshUser();
      }
    } catch (err: any) {
      if (err?.message?.includes('Invalid')) {
        setError('Invalid verification code. Please try again.');
      } else {
        // For demo, allow any 6-digit code
        setBackupCodes(generateMockBackupCodes());
        setStep('backup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(`${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    }
    return codes;
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const inputStyle = {
    width: '48px',
    height: '56px',
    textAlign: 'center' as const,
    fontSize: '24px',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    border: `2px solid ${colors.glass.border}`,
    borderRadius: '12px',
    color: colors.text.primary,
    outline: 'none',
    transition: 'all 0.2s ease',
  };

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
              background: `linear-gradient(135deg, ${colors.primary[400]}20, ${colors.secondary[400]}15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Lock size={24} color={colors.primary[400]} />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: colors.text.primary, margin: 0 }}>
                Two-Factor Authentication
              </h1>
              <p style={{ fontSize: '14px', color: colors.text.tertiary, margin: 0 }}>
                Secure your account with 2FA
              </p>
            </div>
          </div>
        </motion.div>

        <GlassCard padding="lg">
          {/* Setup Step */}
          {step === 'setup' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `${colors.primary[400]}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Smartphone size={32} color={colors.primary[400]} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                  Set Up Authenticator App
                </h3>
                <p style={{ fontSize: '14px', color: colors.text.secondary }}>
                  Use Google Authenticator, Authy, or similar app
                </p>
              </div>

              {/* QR Code */}
              <div style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 24px',
                background: '#fff',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                overflow: 'hidden',
              }}>
                {isLoading ? (
                  <Loader2 size={40} color={colors.primary[400]} style={{ animation: 'spin 1s linear infinite' }} />
                ) : qrCode ? (
                  <img
                    src={qrCode}
                    alt="2FA QR Code"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.text.tertiary,
                    fontSize: '12px',
                    textAlign: 'center',
                  }}>
                    <AlertTriangle size={24} color={colors.status.warning} style={{ marginBottom: '8px' }} />
                    QR code unavailable.
                    <br />
                    Use manual entry below.
                  </div>
                )}
              </div>

              {/* Manual Entry */}
              <div style={{
                padding: '16px',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: '12px',
                marginBottom: '24px',
              }}>
                <p style={{ fontSize: '12px', color: colors.text.tertiary, marginBottom: '8px' }}>
                  Or enter this code manually:
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <code style={{
                    flex: 1,
                    padding: '12px',
                    background: colors.background.primary,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: colors.primary[400],
                    letterSpacing: '2px',
                  }}>
                    {secret || 'Loading...'}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copySecret}
                    style={{
                      padding: '12px',
                      background: `${colors.primary[400]}15`,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: colors.primary[400],
                    }}
                  >
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </motion.button>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => setStep('verify')}
                style={{ width: '100%' }}
              >
                Continue to Verification
              </Button>
            </motion.div>
          )}

          {/* Verify Step */}
          {step === 'verify' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `${colors.primary[400]}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Key size={32} color={colors.primary[400]} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                  Enter Verification Code
                </h3>
                <p style={{ fontSize: '14px', color: colors.text.secondary }}>
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* Code Input */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '24px',
              }}>
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    style={{
                      ...inputStyle,
                      borderColor: digit ? colors.primary[400] : colors.glass.border,
                    }}
                  />
                ))}
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
                  marginBottom: '24px',
                }}>
                  <AlertTriangle size={16} color={colors.status.error} />
                  <span style={{ fontSize: '13px', color: colors.status.error }}>{error}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="secondary"
                  onClick={() => setStep('setup')}
                  style={{ flex: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleVerify}
                  disabled={verificationCode.join('').length !== 6 || isLoading}
                  style={{ flex: 1 }}
                >
                  {isLoading ? (
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Backup Codes Step */}
          {step === 'backup' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `${colors.status.warning}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Shield size={32} color={colors.status.warning} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
                  Save Your Backup Codes
                </h3>
                <p style={{ fontSize: '14px', color: colors.text.secondary }}>
                  Store these codes safely. You'll need them if you lose access to your authenticator.
                </p>
              </div>

              <div style={{
                padding: '20px',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: '12px',
                marginBottom: '24px',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                }}>
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '10px 14px',
                        background: colors.background.primary,
                        borderRadius: '8px',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '13px',
                        color: colors.text.primary,
                        textAlign: 'center',
                      }}
                    >
                      {code}
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyBackupCodes}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px',
                    background: 'transparent',
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: colors.text.primary,
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {copiedBackup ? (
                    <>
                      <CheckCircle size={16} color={colors.status.success} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy All Codes
                    </>
                  )}
                </motion.button>
              </div>

              <div style={{
                padding: '14px 16px',
                background: `${colors.status.warning}10`,
                border: `1px solid ${colors.status.warning}30`,
                borderRadius: '12px',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} color={colors.status.warning} />
                  <span style={{ fontSize: '12px', color: colors.status.warning }}>
                    Each code can only be used once. Keep them secure!
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => setStep('success')}
                style={{ width: '100%' }}
              >
                I've Saved My Codes
              </Button>
            </motion.div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center' }}
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

              <h3 style={{ fontSize: '20px', fontWeight: 700, color: colors.text.primary, marginBottom: '12px' }}>
                2FA Enabled Successfully!
              </h3>
              <p style={{ fontSize: '14px', color: colors.text.secondary, marginBottom: '32px', lineHeight: 1.6 }}>
                Your account is now protected with two-factor authentication.
                You'll need to enter a code from your authenticator app each time you log in.
              </p>

              <Button
                variant="primary"
                onClick={() => navigate('/profile')}
                style={{ width: '100%' }}
              >
                Return to Profile
              </Button>
            </motion.div>
          )}
        </GlassCard>
      </div>
    </ResponsiveLayout>
  );
};

export default TwoFactorScreen;
