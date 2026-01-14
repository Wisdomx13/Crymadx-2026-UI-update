import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useThemeMode } from '../theme/ThemeContext';
import { authService, tokenManager, AUTH_LOGOUT_EVENT, walletService } from '../services';
import type { User } from '../types/api';

// Helper function to initialize wallets in background (non-blocking)
const initializeWalletsInBackground = async () => {
  try {
    console.log('[Auth] Checking wallet status...');
    const result = await walletService.ensureAllWalletsCreated();

    if (result.status.missing.length > 0) {
      console.log(`[Auth] Missing wallets detected: ${result.status.missing.join(', ')}`);
      if (result.initializationResult?.queued?.length) {
        console.log(`[Auth] Queued creation for: ${result.initializationResult.queued.join(', ')}`);
      }
      if (result.initializationResult?.errors?.length) {
        console.warn('[Auth] Wallet initialization errors:', result.initializationResult.errors);
      }
    } else {
      console.log('[Auth] All wallets available');
    }
  } catch (error) {
    // Don't block login if wallet check fails
    console.warn('[Auth] Wallet initialization check failed (non-blocking):', error);
  }
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; userId?: string; error?: string }>;
  verify2FA: (userId: string, code: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string, referralCode?: string) => Promise<{ success: boolean; requiresVerification?: boolean; error?: string }>;
  logout: () => Promise<void>;
  requireAuth: (action?: string, redirectPath?: string) => boolean;
  showLoginPrompt: boolean;
  pendingAction: string | null;
  closeLoginPrompt: () => void;
  updateAvatar: (avatarUrl: string) => void;
  userAvatar: string;
  refreshUser: () => Promise<void>;
}

// Default avatar
const DEFAULT_AVATAR = 'https://api.dicebear.com/9.x/lorelei/svg?seed=Alexander&backgroundColor=b6e3f4';

// LocalStorage keys for avatar only (other storage handled by tokenManager)
const AVATAR_STORAGE_KEY = 'crymadx_avatar';

const getStoredAvatar = (): string => {
  try {
    return localStorage.getItem(AVATAR_STORAGE_KEY) || DEFAULT_AVATAR;
  } catch {
    return DEFAULT_AVATAR;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string>(() => getStoredAvatar());

  // Handle forced logout from API (e.g., token refresh failed)
  const handleForcedLogout = useCallback(() => {
    console.log('Forced logout triggered - session expired');
    setUser(null);
    setIsAuthenticated(false);
    // Don't redirect here - let the component handle it
  }, []);

  // Listen for logout events from API layer
  useEffect(() => {
    const handleLogoutEvent = () => {
      handleForcedLogout();
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogoutEvent);
    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogoutEvent);
    };
  }, [handleForcedLogout]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      // Check if we have a token
      if (tokenManager.isAuthenticated()) {
        try {
          // Verify token by fetching current user
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
            tokenManager.setUser(currentUser);

            // Initialize missing wallets in background (non-blocking)
            initializeWalletsInBackground();
          } else {
            // Token invalid, clear it
            tokenManager.clearTokens();
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          tokenManager.clearTokens();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const updateAvatar = useCallback((avatarUrl: string) => {
    setUserAvatar(avatarUrl);
    try {
      localStorage.setItem(AVATAR_STORAGE_KEY, avatarUrl);
    } catch {}
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        tokenManager.setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; requires2FA?: boolean; userId?: string; error?: string }> => {
    try {
      const response = await authService.login({ email, password });

      // Check if 2FA is required
      if (response.requires2FA && response.userId) {
        return { success: false, requires2FA: true, userId: response.userId };
      }

      // Login successful
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        setShowLoginPrompt(false);

        // Initialize missing wallets in background (non-blocking)
        initializeWalletsInBackground();

        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Invalid email or password' };
    }
  }, []);

  const verify2FA = useCallback(async (userId: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.verify2FA(userId, code);

      if (response.tokens) {
        // Fetch user data after successful 2FA
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          setShowLoginPrompt(false);

          // Initialize missing wallets in background (non-blocking)
          initializeWalletsInBackground();

          return { success: true };
        }
      }

      return { success: false, error: '2FA verification failed' };
    } catch (error: any) {
      console.error('2FA verification error:', error);
      return { success: false, error: error.message || 'Invalid 2FA code' };
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    referralCode?: string
  ): Promise<{ success: boolean; requiresVerification?: boolean; error?: string }> => {
    try {
      const response = await authService.register({
        email,
        password,
        fullName,
        referralCode,
      });

      // Check if verification is required (new flow)
      if (response.requiresVerification) {
        return { success: false, requiresVerification: true };
      }

      // Legacy flow: user registered and logged in immediately
      if (response.user && response.tokens) {
        setUser(response.user);
        setIsAuthenticated(true);
        setShowLoginPrompt(false);
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const requireAuth = useCallback((action?: string, redirectPath?: string): boolean => {
    if (isAuthenticated) {
      return true;
    }

    setPendingAction(action || 'continue');
    setPendingRedirect(redirectPath || null);
    setShowLoginPrompt(true);
    return false;
  }, [isAuthenticated]);

  const closeLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false);
    setPendingAction(null);
    setPendingRedirect(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        verify2FA,
        register,
        logout,
        requireAuth,
        showLoginPrompt,
        pendingAction,
        closeLoginPrompt,
        updateAvatar,
        userAvatar,
        refreshUser,
      }}
    >
      {children}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={closeLoginPrompt}
        action={pendingAction}
        redirectPath={pendingRedirect}
      />
    </AuthContext.Provider>
  );
};

// Login Prompt Modal Component
interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: string | null;
  redirectPath: string | null;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, action, redirectPath }) => {
  const { colors, isDark } = useThemeMode();
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login', { state: { from: redirectPath, action } });
  };

  const handleSignUp = () => {
    onClose();
    navigate('/register', { state: { from: redirectPath, action } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9998,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '420px',
              background: isDark
                ? 'linear-gradient(145deg, rgba(25, 28, 32, 0.98) 0%, rgba(15, 18, 22, 0.98) 100%)'
                : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 247, 250, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: isDark
                ? '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0, 255, 136, 0.1)'
                : '0 25px 80px rgba(0,0,0,0.2), 0 0 60px rgba(0, 255, 136, 0.05)',
              padding: '32px',
              zIndex: 9999,
              overflow: 'hidden',
            }}
          >
            {/* Glow Effect */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.08) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.text.tertiary,
              }}
            >
              <X size={20} />
            </motion.button>

            {/* Content */}
            <div style={{ position: 'relative', textAlign: 'center' }}>
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                style={{
                  width: '72px',
                  height: '72px',
                  margin: '0 auto 24px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.05) 100%)',
                  border: '1px solid rgba(0, 255, 136, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(0, 255, 136, 0.15)',
                }}
              >
                <LogIn size={32} color="#00ff88" />
              </motion.div>

              {/* Title */}
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: colors.text.primary,
                marginBottom: '12px',
              }}>
                Login Required
              </h2>

              {/* Description */}
              <p style={{
                fontSize: '15px',
                color: colors.text.secondary,
                lineHeight: 1.6,
                marginBottom: '28px',
              }}>
                Please log in to {action || 'continue'}.
                <br />
                <span style={{ color: colors.text.tertiary, fontSize: '14px' }}>
                  Don't have an account? Sign up for free!
                </span>
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0, 255, 136, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00e67a 100%)',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0b0e11',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <LogIn size={20} />
                  Log In
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignUp}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: colors.text.primary,
                    cursor: 'pointer',
                  }}
                >
                  Create Free Account
                </motion.button>
              </div>

              {/* Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '20px',
                padding: '12px 16px',
                background: isDark ? 'rgba(255, 215, 0, 0.08)' : 'rgba(255, 180, 0, 0.1)',
                borderRadius: '10px',
                border: `1px solid ${isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 180, 0, 0.2)'}`,
              }}>
                <AlertCircle size={16} color="#ffd700" />
                <span style={{ fontSize: '13px', color: isDark ? '#ffd700' : '#d97706' }}>
                  New users get 0% fees for 30 days
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthProvider;
