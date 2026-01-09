import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Check, Shield, Zap, Globe, ChevronLeft, Gift, Award } from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Button, Input, GlassCard } from '../../components';

// Floating particles for auth pages
const AuthParticles: React.FC<{ secondaryColor: string }> = ({ secondaryColor }) => {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    duration: 4 + Math.random() * 5,
    delay: Math.random() * 3,
  }));

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            y: [0, -80],
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
            background: secondaryColor,
            boxShadow: `0 0 ${p.size * 2}px ${secondaryColor}`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
};

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

  const features = [
    {
      icon: <Shield size={24} />,
      title: 'Bank-Grade Security',
      description: 'Multi-layer encryption and 98% cold storage protection',
    },
    {
      icon: <Zap size={24} />,
      title: 'Lightning Fast',
      description: 'Execute trades in under 10ms with our matching engine',
    },
    {
      icon: <Globe size={24} />,
      title: 'Global Access',
      description: 'Trade 24/7 from 150+ countries worldwide',
    },
  ];

  // Calculate password strength
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
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      position: 'relative',
      overflow: 'auto',
      background: colors.background.primary,
    }}>
      {/* Background Effects - Enhanced for both modes */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {isDark ? (
          <>
            {/* Dark mode gradient mesh */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 70% 50% at 80% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse 60% 60% at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse 50% 40% at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
              `,
            }} />

            {/* Dark mode animated conic gradient */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '400px' : '800px',
                height: isMobile ? '400px' : '800px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, transparent, rgba(16, 185, 129, 0.04), transparent, rgba(16, 185, 129, 0.03), transparent)',
                filter: 'blur(60px)',
              }}
            />

            {/* Dark mode ambient orbs */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: isMobile ? '200px' : '400px',
                height: isMobile ? '200px' : '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
            <AuthParticles secondaryColor={colors.secondary[400]} />
          </>
        ) : (
          <>
            {/* Light mode - Plain white background */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: '#ffffff',
            }} />
          </>
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
            : '#ffffff',
          backdropFilter: isDark ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isDark ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: isDark ? `1px solid ${colors.glass.border}` : '1px solid #e5e7eb',
          boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
            style={{
              padding: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
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

      {/* Left Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 20 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: isMobile ? '100%' : '560px',
          flex: isMobile ? 1 : 'none',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'center',
          padding: isMobile ? '24px 20px' : '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Custom Transparent Glass Card for Register - COMPACT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: isMobile ? '20px' : '24px',
            background: isDark
              ? 'linear-gradient(145deg, rgba(20, 30, 25, 0.85) 0%, rgba(15, 25, 20, 0.9) 100%)'
              : 'linear-gradient(145deg, rgba(0,40,70,0.55) 0%, rgba(0,30,55,0.6) 50%, rgba(0,25,50,0.65) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: isDark
              ? `1px solid ${colors.glass.border}`
              : '2px solid rgba(255,255,255,0.4)',
            boxShadow: isDark
              ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 8px 40px rgba(0,50,100,0.25), 0 4px 20px rgba(0,100,150,0.15), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,50,100,0.1)',
          }}
        >
          {/* Logo - Desktop only */}
          {!isMobile && (
            <motion.div
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '32px',
                cursor: 'pointer',
              }}
            >
              <img
              src="/crymadx-logo.png"
              alt="CrymadX"
              style={{ height: '51px', width: 'auto', objectFit: 'contain' }}
            />
            </motion.div>
          )}

          {/* Progress Steps - Compact */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {[1, 2].map((s) => (
              <motion.div
                key={s}
                initial={false}
                animate={{
                  background: s <= step
                    ? colors.gradients.primary
                    : isDark ? colors.glass.border : 'rgba(255,255,255,0.4)',
                }}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  boxShadow: s <= step ? '0 2px 6px rgba(16, 185, 129, 0.4)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Step indicator - Compact */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px',
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: isDark ? colors.primary[400] : '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textShadow: isDark ? 'none' : '0 2px 6px rgba(0,50,100,0.4)',
            }}>
              Step {step} of 2
            </span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h2 style={{
              fontSize: isMobile ? '22px' : '24px',
              fontWeight: 800,
              color: isDark ? colors.text.primary : '#ffffff',
              marginBottom: '6px',
              textShadow: isDark ? 'none' : '0 2px 10px rgba(0,50,100,0.5), 0 4px 20px rgba(0,30,60,0.3)',
              letterSpacing: '-0.5px',
            }}>
              {step === 1 ? 'Create your account' : 'Secure your account'}
            </h2>
            <p style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? colors.text.tertiary : '#ffffff',
              textShadow: isDark ? 'none' : '0 2px 8px rgba(0,50,100,0.4)',
            }}>
              {step === 1
                ? 'Enter your personal information to get started'
                : 'Create a strong password to protect your assets'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {/* Full Name Input - Compact */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    marginBottom: '5px',
                    textShadow: isDark ? 'none' : '0 2px 8px rgba(0,50,100,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Full Name
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.15)',
                    border: isDark ? `1px solid ${colors.glass.border}` : '2px solid rgba(255,255,255,0.35)',
                    borderRadius: '10px',
                    padding: '0 12px',
                    boxShadow: isDark ? 'none' : 'inset 0 2px 4px rgba(0,50,100,0.1), 0 4px 12px rgba(0,50,100,0.1)',
                  }}>
                    <User size={16} color={isDark ? colors.primary[400] : '#ffffff'} style={{ filter: isDark ? 'none' : 'drop-shadow(0 2px 4px rgba(0,50,100,0.4))' }} />
                    <input
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '10px 10px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isDark ? colors.text.primary : '#ffffff',
                      }}
                    />
                  </div>
                </div>

                {/* Email Input - Compact */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    marginBottom: '5px',
                    textShadow: isDark ? 'none' : '0 2px 8px rgba(0,50,100,0.5)',
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
                    borderRadius: '10px',
                    padding: '0 12px',
                    boxShadow: isDark ? 'none' : 'inset 0 2px 4px rgba(0,50,100,0.1), 0 4px 12px rgba(0,50,100,0.1)',
                  }}>
                    <Mail size={16} color={isDark ? colors.primary[400] : '#ffffff'} style={{ filter: isDark ? 'none' : 'drop-shadow(0 2px 4px rgba(0,50,100,0.4))' }} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '10px 10px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isDark ? colors.text.primary : '#ffffff',
                      }}
                    />
                  </div>
                </div>

                {/* Phone Input - Compact */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    marginBottom: '5px',
                    textShadow: isDark ? 'none' : '0 2px 8px rgba(0,50,100,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Phone Number
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.15)',
                    border: isDark ? `1px solid ${colors.glass.border}` : '2px solid rgba(255,255,255,0.35)',
                    borderRadius: '10px',
                    padding: '0 12px',
                    boxShadow: isDark ? 'none' : 'inset 0 2px 4px rgba(0,50,100,0.1), 0 4px 12px rgba(0,50,100,0.1)',
                  }}>
                    <Phone size={16} color={isDark ? colors.primary[400] : '#ffffff'} style={{ filter: isDark ? 'none' : 'drop-shadow(0 2px 4px rgba(0,50,100,0.4))' }} />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '10px 10px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isDark ? colors.text.primary : '#ffffff',
                      }}
                    />
                  </div>
                </div>

                {/* Referral Code Input - Compact */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    marginBottom: '5px',
                    textShadow: isDark ? 'none' : '0 2px 8px rgba(0,50,100,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Referral Code (Optional)
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.15)',
                    border: isDark ? `1px solid ${colors.glass.border}` : '2px solid rgba(255,255,255,0.35)',
                    borderRadius: '10px',
                    padding: '0 12px',
                    boxShadow: isDark ? 'none' : 'inset 0 2px 4px rgba(0,50,100,0.1), 0 4px 12px rgba(0,50,100,0.1)',
                  }}>
                    <Gift size={16} color={isDark ? colors.primary[400] : '#ffffff'} style={{ filter: isDark ? 'none' : 'drop-shadow(0 2px 4px rgba(0,50,100,0.4))' }} />
                    <input
                      placeholder="Enter referral code"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '10px 10px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isDark ? colors.text.primary : '#ffffff',
                      }}
                    />
                  </div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isDark ? colors.secondary[400] : '#ffffff',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textShadow: isDark ? 'none' : '0 2px 6px rgba(0,50,100,0.4)',
                  }}>
                    <Award size={12} />
                    Get 10% trading fee discount
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {/* Password Input - Compact */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    marginBottom: '5px',
                    textShadow: isDark ? 'none' : '0 2px 8px rgba(0,50,100,0.5)',
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
                    borderRadius: '10px',
                    padding: '0 12px',
                    boxShadow: isDark ? 'none' : 'inset 0 2px 4px rgba(0,50,100,0.1), 0 4px 12px rgba(0,50,100,0.1)',
                  }}>
                    <Lock size={16} color={isDark ? colors.primary[400] : '#ffffff'} style={{ filter: isDark ? 'none' : 'drop-shadow(0 2px 4px rgba(0,50,100,0.4))' }} />
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '10px 10px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isDark ? colors.text.primary : '#ffffff',
                      }}
                    />
                  </div>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div style={{ marginTop: '-8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: getPasswordStrength() >= i ? 1 : 0.3 }}
                          style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: getPasswordStrength() >= i
                              ? strengthColors[getPasswordStrength()]
                              : isDark ? colors.glass.border : 'rgba(255,255,255,0.3)',
                            transformOrigin: 'left',
                          }}
                        />
                      ))}
                    </div>
                    {getPasswordStrength() > 0 && (
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isDark ? strengthColors[getPasswordStrength()] : '#ffffff',
                        marginBottom: '12px',
                        textShadow: isDark ? 'none' : '0 2px 6px rgba(0,50,100,0.4)',
                      }}>
                        {strengthLabels[getPasswordStrength()]} password
                      </p>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { check: formData.password.length >= 8, text: 'At least 8 characters' },
                        { check: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
                        { check: /[0-9]/.test(formData.password), text: 'One number' },
                        { check: /[^A-Za-z0-9]/.test(formData.password), text: 'One special character' },
                      ].map((rule, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: isDark
                              ? (rule.check ? colors.status.success : colors.text.tertiary)
                              : '#ffffff',
                            textShadow: isDark ? 'none' : '0 2px 6px rgba(0,50,100,0.4)',
                          }}
                        >
                          <Check size={16} />
                          {rule.text}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm Password Input - Compact */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    marginBottom: '5px',
                    textShadow: isDark ? 'none' : '0 2px 8px rgba(0,50,100,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Confirm Password
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.15)',
                    border: isDark ? `1px solid ${colors.glass.border}` : '2px solid rgba(255,255,255,0.35)',
                    borderRadius: '10px',
                    padding: '0 12px',
                    boxShadow: isDark ? 'none' : 'inset 0 2px 4px rgba(0,50,100,0.1), 0 4px 12px rgba(0,50,100,0.1)',
                  }}>
                    <Lock size={16} color={isDark ? colors.primary[400] : '#ffffff'} style={{ filter: isDark ? 'none' : 'drop-shadow(0 2px 4px rgba(0,50,100,0.4))' }} />
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '10px 10px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isDark ? colors.text.primary : '#ffffff',
                      }}
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: colors.status.error,
                      marginTop: '4px',
                    }}>
                      Passwords don't match
                    </p>
                  )}
                </div>

                {/* Terms - Compact */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: 'pointer',
                  marginTop: '4px',
                }}>
                  <input
                    type="checkbox"
                    style={{
                      width: '18px',
                      height: '18px',
                      marginTop: '2px',
                      accentColor: colors.primary[400],
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: isDark ? colors.text.secondary : '#ffffff',
                    lineHeight: 1.5,
                    textShadow: isDark ? 'none' : '0 2px 6px rgba(0,50,100,0.4)',
                  }}>
                    I agree to the{' '}
                    <a href="/terms" style={{
                      color: isDark ? colors.primary[400] : '#ffffff',
                      textDecoration: 'underline',
                      fontWeight: 700,
                    }}>
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="/privacy" style={{
                      color: isDark ? colors.primary[400] : '#ffffff',
                      textDecoration: 'underline',
                      fontWeight: 700,
                    }}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </motion.div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                {step === 2 ? 'Create Account' : 'Continue'}
              </Button>
            </div>
          </form>

          {/* Sign In Link - Compact */}
          <p style={{
            textAlign: 'center',
            marginTop: '14px',
            fontSize: '13px',
            fontWeight: 700,
            color: isDark ? colors.text.tertiary : '#ffffff',
            textShadow: isDark ? 'none' : '0 2px 6px rgba(0,50,100,0.4)',
          }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                color: isDark ? colors.primary[400] : '#ffffff',
                fontWeight: 800,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline',
                textShadow: isDark ? 'none' : '0 2px 6px rgba(0,50,100,0.4)',
              }}
            >
              Sign In
            </button>
          </p>
        </motion.div>
      </motion.div>

      {/* Right Panel - Features (Desktop Only) */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '44px',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{
              color: isDark ? colors.text.primary : '#ffffff',
              textShadow: isDark ? 'none' : '0 3px 12px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.5)',
            }}>Join </span>
            <span style={{
              background: isDark ? colors.gradients.primary : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: isDark ? 'none' : 'drop-shadow(0 3px 8px rgba(0,0,0,0.6))',
            }}>
              10 Million+
            </span>
            <br />
            <span style={{
              color: isDark ? colors.text.primary : '#ffffff',
              textShadow: isDark ? 'none' : '0 3px 12px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.5)',
            }}>Traders Worldwide</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '16px',
              color: isDark ? colors.text.secondary : '#ffffff',
              maxWidth: '500px',
              lineHeight: 1.6,
              marginBottom: '36px',
              fontWeight: 600,
              textShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            Start trading in minutes with our secure, fast, and user-friendly platform.
            New users get <span style={{ color: isDark ? colors.trading.buy : '#10b981', fontWeight: 700, textShadow: isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.6)' }}>0% trading fees</span> for the first 30 days.
          </motion.p>

          {/* Feature Cards - Visible with dark backgrounds for light mode */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((feature, index) => {
              const featureColors = ['#10b981', '#f59e0b', '#0ea5e9'];
              const featureColor = featureColors[index];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 6 }}
                  style={{
                    padding: '16px',
                    background: isDark
                      ? 'rgba(16, 185, 129, 0.04)'
                      : 'rgba(0,0,0,0.35)',
                    border: isDark
                      ? `1px solid ${colors.glass.border}`
                      : '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '14px',
                    backdropFilter: 'blur(12px)',
                    boxShadow: isDark
                      ? 'none'
                      : '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: isDark
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(255,255,255,0.15)',
                      border: isDark
                        ? `1px solid ${colors.glass.border}`
                        : '1px solid rgba(255,255,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDark ? colors.primary[400] : featureColor,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                    }}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '4px',
                        textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                      }}>
                        {feature.title}
                      </h3>
                      <p style={{
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.9)',
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Badges - Dark backgrounds for visibility */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: '10px', marginTop: '32px', flexWrap: 'wrap' }}
          >
            {[
              { label: 'SOC2 Certified', color: '#10b981' },
              { label: 'ISO 27001', color: '#0ea5e9' },
              { label: 'GDPR Compliant', color: '#8b5cf6' },
            ].map((badge) => (
              <motion.div
                key={badge.label}
                whileHover={{ scale: 1.03, y: -2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  background: isDark
                    ? 'rgba(16, 185, 129, 0.06)'
                    : 'rgba(0,0,0,0.35)',
                  border: isDark
                    ? `1px solid ${colors.glass.border}`
                    : '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '100px',
                  boxShadow: isDark
                    ? 'none'
                    : '0 4px 15px rgba(0,0,0,0.4)',
                  cursor: 'default',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Shield size={14} color={isDark ? colors.primary[400] : badge.color} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#ffffff',
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                }}>
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RegisterScreen;
