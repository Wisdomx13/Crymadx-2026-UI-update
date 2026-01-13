import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ChevronLeft, Shield, CheckCircle, Lock } from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Button, Input, GlassCard, GlowingSnowBackground } from '../../components';
import { authService } from '../../services';

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

// Backend uses token-based reset via email link, not 6-digit codes
type Step = 'email' | 'success';

export const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useThemeMode();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      // Call backend API to send reset link via email
      await authService.forgotPassword(email);
      // Always show success to prevent email enumeration
      setStep('success');
    } catch {
      // Don't reveal if email exists - always show success for security
      setStep('success');
    } finally {
      setIsLoading(false);
    }
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
                Enter your email address and we'll send you a password reset link
              </p>
            </div>

            <form onSubmit={handleSendResetLink}>
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
                  Send Reset Link
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
                background: `${colors.primary[400]}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <Mail size={40} color={colors.primary[400]} />
            </motion.div>

            <h2 style={{
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: 700,
              color: colors.text.primary,
              marginBottom: '8px',
            }}>
              Check Your Email
            </h2>
            <p style={{
              fontSize: isMobile ? '13px' : '15px',
              color: colors.text.tertiary,
              marginBottom: '16px',
            }}>
              If an account exists with <span style={{ color: colors.primary[400] }}>{email}</span>, you will receive a password reset link.
            </p>
            <p style={{
              fontSize: isMobile ? '12px' : '13px',
              color: colors.text.tertiary,
              marginBottom: '32px',
            }}>
              Click the link in your email to reset your password. The link will expire in 1 hour.
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

            <button
              onClick={() => setStep('email')}
              style={{
                marginTop: '16px',
                color: colors.text.secondary,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Didn't receive an email? Try again
            </button>
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
                radial-gradient(ellipse 60% 50% at 90% 80%, rgba(0, 212, 170, 0.12) 0%, transparent 50%),
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
                background: 'radial-gradient(circle, rgba(0, 212, 170, 0.15) 0%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
            <AuthParticles primaryColor={colors.primary[400]} />
          </>
        ) : (
          <GlowingSnowBackground
            show={true}
            backgroundImage="/main-bg.jpg"
            intensity="high"
          />
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
            onClick={() => step === 'email' ? navigate('/login') : setStep('email')}
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
