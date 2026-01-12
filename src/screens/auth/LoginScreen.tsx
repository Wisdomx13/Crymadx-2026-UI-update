import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Button } from '../../components';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useThemeMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      position: 'relative',
      overflow: 'hidden',
      background: isDark ? colors.background.primary : '#ffffff',
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: isDark ? 'rgba(10, 14, 20, 0.9)' : '#ffffff',
          borderBottom: isDark ? `1px solid ${colors.glass.border}` : '1px solid #000000',
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            style={{
              padding: '6px',
              background: 'transparent',
              border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #000000',
              borderRadius: '6px',
              color: isDark ? colors.text.primary : '#000000',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <ChevronLeft size={18} />
          </motion.button>
          <img
            src="/crymadx-logo.png"
            alt="CrymadX"
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
          />
          <div style={{ width: '30px' }} />
        </div>
      )}

      {/* Left Panel - Branding (Desktop only) */}
      {!isMobile && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px',
          background: isDark ? 'transparent' : '#ffffff',
        }}>
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              cursor: 'pointer',
            }}
          >
            <img
              src="/crymadx-logo.png"
              alt="CrymadX"
              style={{ height: '45px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '40px',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '16px',
            color: isDark ? colors.text.primary : '#000000',
          }}>
            Trade the{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00D26A 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Future
            </span>
            <br />
            of Finance
          </h1>

          <p style={{
            fontSize: '15px',
            color: isDark ? colors.text.secondary : '#374151',
            maxWidth: '400px',
            lineHeight: 1.6,
            marginBottom: '28px',
            fontWeight: 500,
          }}>
            Experience next-generation crypto trading with institutional-grade security and lightning-fast execution.
          </p>

          {/* Feature Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { icon: '🔒', label: 'Bank-Grade Security' },
              { icon: '⚡', label: 'Instant Execution' },
              { icon: '🌍', label: '150+ Countries' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#f3f4f6',
                  border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #d1d5db',
                  borderRadius: '100px',
                }}
              >
                <span>{item.icon}</span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isDark ? '#ffffff' : '#000000',
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { value: '$50B+', label: 'Trading Volume' },
              { value: '10M+', label: 'Active Users' },
              { value: '500+', label: 'Trading Pairs' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: isDark ? colors.text.primary : '#000000',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: isDark ? colors.text.tertiary : '#6b7280',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right Panel - Login Form */}
      <div style={{
        width: isMobile ? '100%' : '440px',
        flex: isMobile ? 1 : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '16px' : '32px',
        background: isDark ? 'transparent' : '#ffffff',
      }}>
        {/* Form Card */}
        <div style={{
          width: '100%',
          maxWidth: '360px',
          padding: isMobile ? '20px' : '24px',
          background: isDark
            ? 'linear-gradient(145deg, rgba(20, 30, 25, 0.85) 0%, rgba(15, 25, 20, 0.9) 100%)'
            : '#ffffff',
          backdropFilter: isDark ? 'blur(20px)' : 'none',
          borderRadius: '16px',
          border: isDark ? `1px solid ${colors.glass.border}` : '1.5px solid #000000',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: isDark ? colors.text.primary : '#000000',
              marginBottom: '6px',
            }}>
              Welcome back
            </h2>
            <p style={{
              fontSize: '14px',
              fontWeight: 500,
              color: isDark ? colors.text.tertiary : '#374151',
            }}>
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Email Input */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isDark ? colors.text.secondary : '#000000',
                  marginBottom: '5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Email Address
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#ffffff',
                  border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #000000',
                  borderRadius: '10px',
                  padding: '0 12px',
                }}>
                  <Mail size={16} color={isDark ? colors.primary[400] : '#000000'} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isDark ? colors.text.primary : '#000000',
                    }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isDark ? colors.text.secondary : '#000000',
                  marginBottom: '5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Password
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#ffffff',
                  border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #000000',
                  borderRadius: '10px',
                  padding: '0 12px',
                }}>
                  <Lock size={16} color={isDark ? colors.primary[400] : '#000000'} />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isDark ? colors.text.primary : '#000000',
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    style={{
                      width: '14px',
                      height: '14px',
                      accentColor: colors.primary[400],
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isDark ? colors.text.secondary : '#000000',
                  }}>
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  style={{
                    fontSize: '12px',
                    color: isDark ? colors.primary[400] : '#000000',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
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
                rightIcon={<ArrowRight size={16} />}
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '16px 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: isDark ? colors.glass.border : '#d1d5db' }} />
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: isDark ? colors.text.tertiary : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Or continue with
            </span>
            <div style={{ flex: 1, height: '1px', background: isDark ? colors.glass.border : '#d1d5db' }} />
          </div>

          {/* Continue with Google */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '10px',
              background: isDark ? '#ffffff' : '#ffffff',
              border: isDark ? '1px solid #e0e0e0' : '1px solid #000000',
              borderRadius: '10px',
              color: '#000000',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
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
            marginTop: '14px',
            fontSize: '13px',
            fontWeight: 600,
            color: isDark ? colors.text.tertiary : '#374151',
          }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{
                color: isDark ? colors.primary[400] : '#000000',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline',
              }}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
