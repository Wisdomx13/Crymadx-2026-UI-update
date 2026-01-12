import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Check, Shield, ChevronLeft, Gift, Award } from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Button } from '../../components';

export const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useThemeMode();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigate('/dashboard');
  };

  const getPasswordStrength = () => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  const strengthColors = ['', colors.status.error, colors.status.warning, colors.secondary[400], colors.status.success];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

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
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
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

      {/* Left Panel - Form */}
      <div style={{
        width: isMobile ? '100%' : '440px',
        flex: isMobile ? 1 : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '10px 16px' : '16px',
        background: isDark ? 'transparent' : '#ffffff',
      }}>
        {/* Form Card */}
        <div style={{
          width: '100%',
          maxWidth: '360px',
          padding: isMobile ? '14px' : '16px',
          background: isDark
            ? 'linear-gradient(145deg, rgba(20, 30, 25, 0.85) 0%, rgba(15, 25, 20, 0.9) 100%)'
            : '#ffffff',
          backdropFilter: isDark ? 'blur(20px)' : 'none',
          borderRadius: '16px',
          border: isDark ? `1px solid ${colors.glass.border}` : '1.5px solid #000000',
        }}>
          {/* Logo - Desktop only */}
          {!isMobile && (
            <div
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '14px',
                cursor: 'pointer',
              }}
            >
              <img
                src="/crymadx-logo.png"
                alt="CrymadX"
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
          )}

          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            {[1, 2].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: s <= step
                    ? '#00D26A'
                    : isDark ? colors.glass.border : '#d1d5db',
                }}
              />
            ))}
          </div>

          {/* Step indicator */}
          <div style={{ marginBottom: '2px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: isDark ? colors.primary[400] : '#00D26A',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Step {step} of 2
            </span>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: isDark ? colors.text.primary : '#000000',
              marginBottom: '2px',
            }}>
              {step === 1 ? 'Create your account' : 'Secure your account'}
            </h2>
            <p style={{
              fontSize: '12px',
              fontWeight: 500,
              color: isDark ? colors.text.tertiary : '#374151',
            }}>
              {step === 1
                ? 'Enter your personal information to get started'
                : 'Create a strong password to protect your assets'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Full Name Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#000000',
                    marginBottom: '3px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Full Name
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#ffffff',
                    border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #000000',
                    borderRadius: '6px',
                    padding: '0 8px',
                  }}>
                    <User size={13} color={isDark ? colors.primary[400] : '#000000'} />
                    <input
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '7px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: isDark ? colors.text.primary : '#000000',
                      }}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#000000',
                    marginBottom: '3px',
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
                    borderRadius: '6px',
                    padding: '0 8px',
                  }}>
                    <Mail size={13} color={isDark ? colors.primary[400] : '#000000'} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '7px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: isDark ? colors.text.primary : '#000000',
                      }}
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#000000',
                    marginBottom: '3px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Phone Number
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#ffffff',
                    border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #000000',
                    borderRadius: '6px',
                    padding: '0 8px',
                  }}>
                    <Phone size={13} color={isDark ? colors.primary[400] : '#000000'} />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '7px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: isDark ? colors.text.primary : '#000000',
                      }}
                    />
                  </div>
                </div>

                {/* Referral Code Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#000000',
                    marginBottom: '3px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Referral Code (Optional)
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#ffffff',
                    border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #000000',
                    borderRadius: '6px',
                    padding: '0 8px',
                  }}>
                    <Gift size={13} color={isDark ? colors.primary[400] : '#000000'} />
                    <input
                      placeholder="Enter referral code"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '7px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: isDark ? colors.text.primary : '#000000',
                      }}
                    />
                  </div>
                  <p style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: isDark ? colors.secondary[400] : '#00D26A',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}>
                    <Award size={9} />
                    Get 10% trading fee discount
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Password Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#000000',
                    marginBottom: '4px',
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
                    borderRadius: '8px',
                    padding: '0 10px',
                  }}>
                    <Lock size={14} color={isDark ? colors.primary[400] : '#000000'} />
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: isDark ? colors.text.primary : '#000000',
                      }}
                    />
                  </div>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div>
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: getPasswordStrength() >= i
                              ? strengthColors[getPasswordStrength()]
                              : isDark ? colors.glass.border : '#d1d5db',
                          }}
                        />
                      ))}
                    </div>
                    {getPasswordStrength() > 0 && (
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: isDark ? strengthColors[getPasswordStrength()] : '#000000',
                        marginBottom: '8px',
                      }}>
                        {strengthLabels[getPasswordStrength()]} password
                      </p>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[
                        { check: formData.password.length >= 8, text: 'At least 8 characters' },
                        { check: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
                        { check: /[0-9]/.test(formData.password), text: 'One number' },
                        { check: /[^A-Za-z0-9]/.test(formData.password), text: 'One special character' },
                      ].map((rule, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: isDark
                              ? (rule.check ? colors.status.success : colors.text.tertiary)
                              : (rule.check ? '#00D26A' : '#6b7280'),
                          }}
                        >
                          <Check size={12} />
                          {rule.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm Password Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#000000',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Confirm Password
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : '#ffffff',
                    border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #000000',
                    borderRadius: '8px',
                    padding: '0 10px',
                  }}>
                    <Lock size={14} color={isDark ? colors.primary[400] : '#000000'} />
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: isDark ? colors.text.primary : '#000000',
                      }}
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: colors.status.error,
                      marginTop: '3px',
                    }}>
                      Passwords don't match
                    </p>
                  )}
                </div>

                {/* Terms */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}>
                  <input
                    type="checkbox"
                    style={{
                      width: '14px',
                      height: '14px',
                      marginTop: '2px',
                      accentColor: colors.primary[400],
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: isDark ? colors.text.secondary : '#374151',
                    lineHeight: 1.4,
                  }}>
                    I agree to the{' '}
                    <a href="/terms" style={{
                      color: isDark ? colors.primary[400] : '#000000',
                      textDecoration: 'underline',
                      fontWeight: 600,
                    }}>
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="/privacy" style={{
                      color: isDark ? colors.primary[400] : '#000000',
                      textDecoration: 'underline',
                      fontWeight: 600,
                    }}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={isLoading}
                rightIcon={<ArrowRight size={14} />}
              >
                {step === 2 ? 'Create Account' : 'Continue'}
              </Button>
            </div>
          </form>

          {/* Sign In Link */}
          <p style={{
            textAlign: 'center',
            marginTop: '10px',
            fontSize: '11px',
            fontWeight: 600,
            color: isDark ? colors.text.tertiary : '#374151',
          }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                color: isDark ? colors.primary[400] : '#000000',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                textDecoration: 'underline',
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      {/* Right Panel - Features (Desktop Only) */}
      {!isMobile && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px',
          background: isDark ? 'transparent' : '#ffffff',
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '16px',
            color: isDark ? colors.text.primary : '#000000',
          }}>
            Join{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00D26A 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              10 Million+
            </span>
            <br />
            Traders Worldwide
          </h1>

          <p style={{
            fontSize: '14px',
            color: isDark ? colors.text.secondary : '#374151',
            maxWidth: '400px',
            lineHeight: 1.6,
            marginBottom: '24px',
            fontWeight: 500,
          }}>
            Start trading in minutes with our secure, fast, and user-friendly platform.
            New users get <span style={{ color: '#00D26A', fontWeight: 700 }}>0% trading fees</span> for the first 30 days.
          </p>

          {/* Feature Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '🔒', title: 'Bank-Grade Security', desc: 'Multi-layer encryption and 98% cold storage' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Execute trades in under 10ms' },
              { icon: '🌍', title: 'Global Access', desc: 'Trade 24/7 from 150+ countries' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 14px',
                  background: isDark ? 'rgba(16, 185, 129, 0.04)' : '#f9fafb',
                  border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #e5e7eb',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#f3f4f6',
                  border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isDark ? '#ffffff' : '#000000',
                    marginBottom: '2px',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '11px',
                    color: isDark ? colors.text.tertiary : '#6b7280',
                    fontWeight: 500,
                  }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'SOC2 Certified' },
              { label: 'ISO 27001' },
              { label: 'GDPR Compliant' },
            ].map((badge) => (
              <div
                key={badge.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  background: isDark ? 'rgba(16, 185, 129, 0.06)' : '#f3f4f6',
                  border: isDark ? `1px solid ${colors.glass.border}` : '1px solid #d1d5db',
                  borderRadius: '100px',
                }}
              >
                <Shield size={12} color={isDark ? colors.primary[400] : '#00D26A'} />
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isDark ? '#ffffff' : '#000000',
                }}>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterScreen;
