import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Shield, Zap, Globe, ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Button, GlowingSnowBackground } from '../../components';
import { useAuth } from '../../context/AuthContext';

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

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, isDark } = useThemeMode();
  const { login, verify2FA, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get redirect path from location state
  const from = (location.state as any)?.from || '/dashboard';

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate(from, { replace: true });
      } else if (result.requires2FA && result.userId) {
        setRequires2FA(true);
        setUserId(result.userId);
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await verify2FA(userId, twoFactorCode);

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Invalid 2FA code. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
                radial-gradient(ellipse 80% 60% at 10% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse 60% 50% at 90% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse 40% 30% at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
              `,
            }} />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '5%',
                left: '5%',
                width: isMobile ? '250px' : '500px',
                height: isMobile ? '250px' : '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: isMobile ? '200px' : '400px',
                height: isMobile ? '200px' : '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
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
          background: isDark
            ? 'rgba(10, 14, 20, 0.9)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
          borderBottom: isDark ? `1px solid ${colors.glass.border}` : '1px solid rgba(16, 185, 129, 0.1)',
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            style={{
              padding: '8px',
              background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
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

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '48px',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{
              color: isDark ? colors.text.primary : '#ffffff',
              textShadow: isDark ? 'none' : '0 3px 12px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.5)',
            }}>Trade the </span>
            <span style={{
              background: isDark ? colors.gradients.primary : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: isDark ? 'none' : 'drop-shadow(0 3px 8px rgba(0,0,0,0.6))',
            }}>
              Future
            </span>
            <br />
            <span style={{
              color: isDark ? colors.text.primary : '#ffffff',
              textShadow: isDark ? 'none' : '0 3px 12px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.5)',
            }}>of Finance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '17px',
              color: isDark ? colors.text.secondary : '#ffffff',
              maxWidth: '480px',
              lineHeight: 1.6,
              marginBottom: '36px',
              fontWeight: 600,
              textShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            Experience next-generation crypto trading with institutional-grade
            security and lightning-fast execution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}
          >
            {[
              { icon: <Shield size={14} />, label: 'Bank-Grade Security', color: '#10b981' },
              { icon: <Zap size={14} />, label: 'Instant Execution', color: '#f59e0b' },
              { icon: <Globe size={14} />, label: 'Global Access', color: '#0ea5e9' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0,0,0,0.35)',
                  border: isDark ? `1px solid ${colors.glass.border}` : '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '100px',
                  boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                <span style={{ color: isDark ? colors.primary[400] : item.color }}>
                  {item.icon}
                </span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#ffffff',
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                }}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ display: 'flex', gap: '40px' }}
          >
            {[
              { value: '24/7', label: 'Trading Access', color: '#10b981' },
              { value: '0%', label: 'Hidden Fees', color: '#0ea5e9' },
              { value: '<10ms', label: 'Execution Speed', color: '#8b5cf6' },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: isDark ? 'transparent' : 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                border: isDark ? 'none' : '1px solid rgba(255,255,255,0.2)',
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: isDark ? colors.text.primary : stat.color,
                  fontFamily: "'JetBrains Mono', monospace",
                  textShadow: isDark ? 'none' : '0 3px 10px rgba(0,0,0,0.7)',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isDark ? colors.text.tertiary : '#ffffff',
                  marginTop: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                  textShadow: isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.6)',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Right Panel - Login Form */}
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: isMobile ? '20px' : '28px',
            background: isDark
              ? 'linear-gradient(145deg, rgba(20, 30, 25, 0.85) 0%, rgba(15, 25, 20, 0.9) 100%)'
              : 'linear-gradient(145deg, rgba(0,40,70,0.55) 0%, rgba(0,30,55,0.6) 50%, rgba(0,25,50,0.65) 100%)',
            borderRadius: '24px',
            border: isDark ? `1px solid ${colors.glass.border}` : '2px solid rgba(255,255,255,0.4)',
            boxShadow: isDark
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 40px rgba(0,50,100,0.25)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
            <h2 style={{
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: 800,
              color: isDark ? colors.text.primary : '#ffffff',
              marginBottom: '8px',
              textShadow: isDark ? 'none' : '0 2px 10px rgba(0,50,100,0.5)',
            }}>
              {requires2FA ? 'Two-Factor Authentication' : 'Welcome back'}
            </h2>
            <p style={{
              fontSize: isMobile ? '14px' : '15px',
              fontWeight: 600,
              color: isDark ? colors.text.tertiary : '#ffffff',
              textShadow: isDark ? 'none' : '0 2px 8px rgba(0,50,100,0.4)',
            }}>
              {requires2FA
                ? 'Enter the code from your authenticator app'
                : 'Enter your credentials to access your account'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                marginBottom: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          {requires2FA ? (
            // 2FA Form
            <form onSubmit={handle2FAVerification}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Authentication Code
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.15)',
                    border: isDark ? `1px solid ${colors.glass.border}` : '2px solid rgba(255,255,255,0.35)',
                    borderRadius: '12px',
                    padding: '0 14px',
                  }}>
                    <Shield size={18} color={isDark ? colors.primary[400] : '#ffffff'} />
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      autoFocus
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: isDark ? colors.text.primary : '#ffffff',
                        textAlign: 'center',
                        letterSpacing: '0.5em',
                      }}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={twoFactorCode.length !== 6}
                  rightIcon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                >
                  Verify Code
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setUserId(null);
                    setTwoFactorCode('');
                    setError(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDark ? colors.primary[400] : '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Back to login
                </button>
              </div>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : '16px' }}>
                {/* Email Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Email Address
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.15)',
                    border: isDark ? `1px solid ${colors.glass.border}` : '2px solid rgba(255,255,255,0.35)',
                    borderRadius: '12px',
                    padding: '0 14px',
                  }}>
                    <Mail size={18} color={isDark ? colors.primary[400] : '#ffffff'} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: isDark ? colors.text.primary : '#ffffff',
                      }}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Password
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.15)',
                    border: isDark ? `1px solid ${colors.glass.border}` : '2px solid rgba(255,255,255,0.35)',
                    borderRadius: '12px',
                    padding: '0 14px',
                  }}>
                    <Lock size={18} color={isDark ? colors.primary[400] : '#ffffff'} />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: isDark ? colors.text.primary : '#ffffff',
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: colors.primary[400],
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: isDark ? colors.text.secondary : '#ffffff',
                    }}>
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    style={{
                      fontSize: '13px',
                      color: isDark ? colors.primary[400] : '#ffffff',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                      textDecoration: 'underline',
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={!email || !password}
                  rightIcon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                >
                  Sign In
                </Button>
              </div>
            </form>
          )}

          {/* Divider */}
          {!requires2FA && (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '18px 0',
              }}>
                <div style={{ flex: 1, height: '1px', background: isDark ? colors.glass.border : 'rgba(255,255,255,0.4)' }} />
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isDark ? colors.text.tertiary : '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  Or continue with
                </span>
                <div style={{ flex: 1, height: '1px', background: isDark ? colors.glass.border : 'rgba(255,255,255,0.4)' }} />
              </div>

              {/* Google Login */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '14px',
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  color: '#3c4043',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>

              {/* Sign Up Link */}
              <p style={{
                textAlign: 'center',
                marginTop: '16px',
                fontSize: '14px',
                fontWeight: 700,
                color: isDark ? colors.text.tertiary : '#ffffff',
              }}>
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    color: isDark ? colors.primary[400] : '#ffffff',
                    fontWeight: 800,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'underline',
                  }}
                >
                  Create Account
                </button>
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
