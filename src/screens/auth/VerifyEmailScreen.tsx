import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, ChevronLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { Button, GlowingSnowBackground } from '../../components';
import { authService } from '../../services';

export const VerifyEmailScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, isDark } = useThemeMode();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email from location state
  const email = (location.state as any)?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.verifyEmail(email, verificationCode);

      if (result.tokens) {
        setSuccess('Email verified successfully!');
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      await authService.resendVerificationCode(email);
      setSuccess('A new verification code has been sent to your email');
      setCountdown(60); // 60 second cooldown
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: colors.background.primary,
      padding: isMobile ? '20px' : '40px',
    }}>
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {isDark ? (
          <>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 70% 50% at 80% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse 60% 60% at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)
              `,
            }} />
          </>
        ) : (
          <GlowingSnowBackground show={true} backgroundImage="/main-bg.jpg" intensity="high" />
        )}
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/register')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px',
          background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.2)',
          border: `1px solid ${isDark ? colors.glass.border : 'rgba(255,255,255,0.3)'}`,
          borderRadius: '10px',
          color: isDark ? colors.text.primary : '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          fontWeight: 600,
          zIndex: 10,
        }}
      >
        <ChevronLeft size={18} />
        Back
      </motion.button>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: isMobile ? '28px' : '40px',
          background: isDark
            ? 'linear-gradient(145deg, rgba(20, 30, 25, 0.9) 0%, rgba(15, 25, 20, 0.95) 100%)'
            : 'linear-gradient(145deg, rgba(0,40,70,0.6) 0%, rgba(0,30,55,0.65) 50%, rgba(0,25,50,0.7) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '28px',
          border: isDark
            ? `1px solid ${colors.glass.border}`
            : '2px solid rgba(255,255,255,0.4)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 40px rgba(0,50,100,0.25), inset 0 2px 0 rgba(255,255,255,0.5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)',
          }}
        >
          <Mail size={36} color="#10b981" />
        </motion.div>

        {/* Title */}
        <h1 style={{
          fontSize: '26px',
          fontWeight: 800,
          color: isDark ? colors.text.primary : '#ffffff',
          textAlign: 'center',
          marginBottom: '8px',
          textShadow: isDark ? 'none' : '0 2px 10px rgba(0,50,100,0.5)',
        }}>
          Verify Your Email
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '15px',
          fontWeight: 500,
          color: isDark ? colors.text.secondary : 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          marginBottom: '28px',
          lineHeight: 1.6,
          textShadow: isDark ? 'none' : '0 2px 6px rgba(0,50,100,0.4)',
        }}>
          We've sent a 6-digit verification code to<br />
          <span style={{ color: '#10b981', fontWeight: 700 }}>{email}</span>
        </p>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={18} color="#ef4444" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444' }}>
              {error}
            </span>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              marginBottom: '20px',
            }}
          >
            <CheckCircle size={18} color="#10b981" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>
              {success}
            </span>
          </motion.div>
        )}

        {/* OTP Input */}
        <form onSubmit={handleVerify}>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '24px',
          }}>
            {code.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                style={{
                  width: '50px',
                  height: '58px',
                  background: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.15)',
                  border: digit
                    ? '2px solid #10b981'
                    : isDark
                      ? `1px solid ${colors.glass.border}`
                      : '2px solid rgba(255,255,255,0.35)',
                  borderRadius: '12px',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: isDark ? colors.text.primary : '#ffffff',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: digit ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none',
                }}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={code.join('').length !== 6}
            rightIcon={<ArrowRight size={18} />}
          >
            Verify Email
          </Button>
        </form>

        {/* Resend Code */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '24px',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 500,
            color: isDark ? colors.text.tertiary : 'rgba(255,255,255,0.8)',
            textShadow: isDark ? 'none' : '0 1px 4px rgba(0,50,100,0.4)',
          }}>
            Didn't receive the code?
          </span>
          <motion.button
            whileHover={{ scale: countdown > 0 ? 1 : 1.02 }}
            whileTap={{ scale: countdown > 0 ? 1 : 0.98 }}
            onClick={handleResendCode}
            disabled={countdown > 0 || isResending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: countdown > 0 ? 'transparent' : 'rgba(16, 185, 129, 0.1)',
              border: `1px solid ${countdown > 0 ? 'transparent' : 'rgba(16, 185, 129, 0.2)'}`,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              color: countdown > 0 ? (isDark ? colors.text.tertiary : 'rgba(255,255,255,0.6)') : '#10b981',
              cursor: countdown > 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw size={14} style={{ animation: isResending ? 'spin 1s linear infinite' : 'none' }} />
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
          </motion.button>
        </div>

        {/* Spam note */}
        <p style={{
          fontSize: '12px',
          fontWeight: 500,
          color: isDark ? colors.text.tertiary : 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          marginTop: '16px',
          textShadow: isDark ? 'none' : '0 1px 4px rgba(0,50,100,0.4)',
        }}>
          Check your spam folder if you don't see the email
        </p>
      </motion.div>

      {/* Keyframe animation for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmailScreen;
