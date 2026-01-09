import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ChevronLeft, Shield, CheckCircle, Lock, KeyRound } from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Button, Input, GlassCard } from '../../components';

// Floating particles for auth pages
const AuthParticles: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2,
  }));

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            y: [0, -100],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: primaryColor,
            boxShadow: `0 0 ${p.size * 2}px ${primaryColor}`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
};

type Step = 'email' | 'code' | 'newPassword' | 'success';

export const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useThemeMode();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Countdown timer for resend code
  useEffect(() => {
    if (step === 'code' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('code');
    setTimer(60);
    setCanResend(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('newPassword');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword || newPassword.length < 8) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('success');
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setTimer(60);
    setCanResend(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
              <h2 style={{
                fontSize: isMobile ? '24px' : '28px',
                fontWeight: 700,
                color: colors.text.primary,
                marginBottom: '8px',
              }}>
                Forgot Password?
              </h2>
              <p style={{
                fontSize: isMobile ? '13px' : '15px',
                color: colors.text.tertiary,
              }}>
                Enter your email address and we'll send you a verification code
              </p>
            </div>

            <form onSubmit={handleSendCode}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size={isMobile ? 'md' : 'lg'}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  rightIcon={<ArrowRight size={18} />}
                  disabled={!email}
                >
                  Send Verification Code
                </Button>
              </div>
            </form>
          </motion.div>
        );

      case 'code':
        return (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
              <h2 style={{
                fontSize: isMobile ? '24px' : '28px',
                fontWeight: 700,
                color: colors.text.primary,
                marginBottom: '8px',
              }}>
                Enter Verification Code
              </h2>
              <p style={{
                fontSize: isMobile ? '13px' : '15px',
                color: colors.text.tertiary,
              }}>
                We sent a 6-digit code to <span style={{ color: colors.primary[400] }}>{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyCode}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
                <Input
                  label="Verification Code"
                  type="text"
                  placeholder="000000"
                  leftIcon={<Shield size={18} />}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  size={isMobile ? 'md' : 'lg'}
                />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '14px', color: colors.text.tertiary }}>
                    Didn't receive code?
                  </span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResend}
                    style={{
                      fontSize: '14px',
                      color: canResend ? colors.primary[400] : colors.text.tertiary,
                      background: 'none',
                      border: 'none',
                      cursor: canResend ? 'pointer' : 'default',
                      fontWeight: 500,
                    }}
                  >
                    {canResend ? 'Resend Code' : `Resend in ${timer}s`}
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  rightIcon={<ArrowRight size={18} />}
                  disabled={code.length !== 6}
                >
                  Verify Code
                </Button>
              </div>
            </form>
          </motion.div>
        );

      case 'newPassword':
        return (
          <motion.div
            key="newPassword"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
              <h2 style={{
                fontSize: isMobile ? '24px' : '28px',
                fontWeight: 700,
                color: colors.text.primary,
                marginBottom: '8px',
              }}>
                Create New Password
              </h2>
              <p style={{
                fontSize: isMobile ? '13px' : '15px',
                color: colors.text.tertiary,
              }}>
                Your new password must be at least 8 characters
              </p>
            </div>

            <form onSubmit={handleResetPassword}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  leftIcon={<Lock size={18} />}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  size={isMobile ? 'md' : 'lg'}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  leftIcon={<KeyRound size={18} />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size={isMobile ? 'md' : 'lg'}
                />

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p style={{ fontSize: '12px', color: colors.status.error }}>
                    Passwords do not match
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  rightIcon={<ArrowRight size={18} />}
                  disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 8}
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
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

            <h2 style={{
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: 700,
              color: colors.text.primary,
              marginBottom: '8px',
            }}>
              Password Reset Successfully!
            </h2>
            <p style={{
              fontSize: isMobile ? '13px' : '15px',
              color: colors.text.tertiary,
              marginBottom: '32px',
            }}>
              Your password has been updated. You can now log in with your new password.
            </p>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/login')}
              rightIcon={<ArrowRight size={18} />}
            >
              Back to Login
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      position: 'relative',
      overflow: 'auto',
      background: colors.background.primary,
    }}>
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {isDark ? (
          <>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 80% 60% at 10% 20%, rgba(26, 143, 255, 0.18) 0%, transparent 50%),
                radial-gradient(ellipse 60% 50% at 90% 80%, rgba(0, 210, 106, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse 40% 30% at 50% 50%, rgba(26, 143, 255, 0.08) 0%, transparent 50%)
              `,
            }} />

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '5%',
                left: '5%',
                width: isMobile ? '250px' : '500px',
                height: isMobile ? '250px' : '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(26, 143, 255, 0.2) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: isMobile ? '200px' : '400px',
                height: isMobile ? '200px' : '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 210, 106, 0.15) 0%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
            <AuthParticles primaryColor={colors.primary[400]} />
          </>
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#ffffff',
          }} />
        )}
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <div style={{
          position: 'sticky',
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          zIndex: 10,
          background: isDark ? 'rgba(10, 14, 20, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.glass.border}`,
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => step === 'email' ? navigate('/login') : setStep(step === 'code' ? 'email' : step === 'newPassword' ? 'code' : 'email')}
            style={{
              padding: '8px',
              background: 'rgba(26, 143, 255, 0.1)',
              border: `1px solid ${colors.glass.border}`,
              borderRadius: '8px',
              color: colors.text.primary,
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/crymadx-logo.png"
              alt="CrymadX"
              style={{ height: '37px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <div style={{ width: '40px' }} />
        </div>
      )}

      {/* Left Panel - Branding (Desktop only) */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <motion.div
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '60px',
              cursor: 'pointer',
            }}
          >
            <img
              src="/crymadx-logo.png"
              alt="CrymadX"
              style={{ height: '55px', width: 'auto', objectFit: 'contain' }}
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '48px',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ color: colors.text.primary }}>Secure </span>
            <span style={{
              background: colors.gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Account
            </span>
            <br />
            <span style={{ color: colors.text.primary }}>Recovery</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '18px',
              color: colors.text.secondary,
              maxWidth: '480px',
              lineHeight: 1.6,
              marginBottom: '48px',
            }}
          >
            We take security seriously. Reset your password through our secure
            verification process to regain access to your account.
          </motion.p>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '24px' }}
          >
            {[
              { icon: <Shield size={20} />, label: 'Secure Verification' },
              { icon: <Lock size={20} />, label: 'Encrypted Process' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 20px',
                  background: 'rgba(26, 143, 255, 0.08)',
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '12px',
                }}
              >
                <span style={{ color: colors.primary[400] }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text.secondary }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Right Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        style={{
          width: isMobile ? '100%' : '520px',
          flex: isMobile ? 1 : 'none',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'center',
          padding: isMobile ? '24px 20px' : '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <GlassCard
          variant="premium"
          padding={isMobile ? 'lg' : 'xl'}
          glow
          style={{ width: '100%', maxWidth: '440px' }}
        >
          {/* Progress Steps */}
          {step !== 'success' && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
            }}>
              {['email', 'code', 'newPassword'].map((s, i) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    background: ['email', 'code', 'newPassword'].indexOf(step) >= i
                      ? colors.primary[400]
                      : colors.glass.border,
                    transition: 'background 0.3s ease',
                  }}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Back to Login Link */}
          {step !== 'success' && (
            <p style={{
              textAlign: 'center',
              marginTop: '28px',
              fontSize: '14px',
              color: colors.text.tertiary,
            }}>
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                style={{
                  color: colors.primary[400],
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Back to Login
              </button>
            </p>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordScreen;
