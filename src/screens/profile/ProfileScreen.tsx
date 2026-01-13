import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Shield,
  FileCheck,
  Lock,
  AlertTriangle,
  Edit3,
  CheckCircle,
  XCircle,
  Globe,
  ChevronRight,
  Key,
  Bell,
  CreditCard,
  History,
  Settings,
  LogOut,
  Copy,
  Check,
  Camera,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  ChevronDown,
  Save,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, Button, ResponsiveLayout } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { useAuth } from '../../context/AuthContext';
import { userService, authService } from '../../services';

// Avatar options - Modern realistic cartoon human characters
const avatarOptions = [
  // Lorelei - Beautiful illustrated human faces
  { id: 'lorelei1', url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Alexander&backgroundColor=b6e3f4', name: 'Alexander' },
  { id: 'lorelei2', url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Sophia&backgroundColor=ffd5dc', name: 'Sophia' },
  { id: 'lorelei3', url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Marcus&backgroundColor=c0aede', name: 'Marcus' },
  { id: 'lorelei4', url: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Isabella&backgroundColor=d1f4d1', name: 'Isabella' },
  // Personas - Modern stylized characters
  { id: 'persona1', url: 'https://api.dicebear.com/9.x/personas/svg?seed=James&backgroundColor=b6e3f4', name: 'James' },
  { id: 'persona2', url: 'https://api.dicebear.com/9.x/personas/svg?seed=Emma&backgroundColor=ffd5dc', name: 'Emma' },
  { id: 'persona3', url: 'https://api.dicebear.com/9.x/personas/svg?seed=Daniel&backgroundColor=c0aede', name: 'Daniel' },
  { id: 'persona4', url: 'https://api.dicebear.com/9.x/personas/svg?seed=Olivia&backgroundColor=d1f4d1', name: 'Olivia' },
  // Big Ears - Cute modern cartoon style
  { id: 'bigears1', url: 'https://api.dicebear.com/9.x/big-ears/svg?seed=Michael&backgroundColor=b6e3f4', name: 'Michael' },
  { id: 'bigears2', url: 'https://api.dicebear.com/9.x/big-ears/svg?seed=Sarah&backgroundColor=ffd5dc', name: 'Sarah' },
  { id: 'bigears3', url: 'https://api.dicebear.com/9.x/big-ears/svg?seed=David&backgroundColor=c0aede', name: 'David' },
  { id: 'bigears4', url: 'https://api.dicebear.com/9.x/big-ears/svg?seed=Jennifer&backgroundColor=d1f4d1', name: 'Jennifer' },
  // Notionists - Clean modern illustrated style
  { id: 'notion1', url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Chris&backgroundColor=b6e3f4', name: 'Chris' },
  { id: 'notion2', url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Ashley&backgroundColor=ffd5dc', name: 'Ashley' },
  { id: 'notion3', url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Ryan&backgroundColor=c0aede', name: 'Ryan' },
  { id: 'notion4', url: 'https://api.dicebear.com/9.x/notionists/svg?seed=Nicole&backgroundColor=d1f4d1', name: 'Nicole' },
];

// Countries list
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Japan', 'South Korea', 'Singapore', 'Switzerland', 'Netherlands', 'Sweden',
  'Norway', 'Denmark', 'Finland', 'Ireland', 'New Zealand', 'Austria', 'Belgium',
  'Italy', 'Spain', 'Portugal', 'Poland', 'Czech Republic', 'Hungary', 'Brazil',
  'Mexico', 'Argentina', 'Chile', 'Colombia', 'India', 'Thailand', 'Malaysia',
  'Indonesia', 'Philippines', 'Vietnam', 'Turkey', 'United Arab Emirates', 'Saudi Arabia',
  'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Israel', 'Russia', 'Ukraine',
];

// Types for settings
interface LoginHistoryItem {
  id: string | number;
  device: string;
  ip: string;
  location: string;
  time: string;
  current: boolean;
}

interface ApiKey {
  id: string | number;
  name: string;
  key: string;
  permissions: string[];
  created: string;
  lastUsed?: string;
}

interface PaymentMethod {
  id: string | number;
  type: string;
  name: string;
  icon: string;
  default: boolean;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

// Default notification settings
const defaultNotificationSettings: NotificationSetting[] = [
  { id: 'price_alerts', label: 'Price Alerts', description: 'Get notified when assets reach your target price', enabled: true },
  { id: 'trade_confirm', label: 'Trade Confirmations', description: 'Receive notifications for completed trades', enabled: true },
  { id: 'security', label: 'Security Alerts', description: 'Important security notifications', enabled: true },
  { id: 'news', label: 'Market News', description: 'Daily market updates and news', enabled: false },
  { id: 'promo', label: 'Promotions', description: 'Special offers and promotions', enabled: false },
];

// Local storage keys
const NOTIFICATIONS_STORAGE_KEY = 'crymadx_notification_settings';
const PREFERENCES_STORAGE_KEY = 'crymadx_user_preferences';
const API_KEYS_STORAGE_KEY = 'crymadx_api_keys';

// Helper functions for local storage
const getStoredNotifications = (): NotificationSetting[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultNotificationSettings;
  } catch {
    return defaultNotificationSettings;
  }
};

const storeNotifications = (settings: NotificationSetting[]): void => {
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(settings));
};

interface StoredPreferences {
  language: string;
  currency: string;
  timezone: string;
}

const getStoredPreferences = (): StoredPreferences => {
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { language: 'English', currency: 'USD', timezone: 'UTC-5 (Eastern Time)' };
  } catch {
    return { language: 'English', currency: 'USD', timezone: 'UTC-5 (Eastern Time)' };
  }
};

const storePreferences = (prefs: StoredPreferences): void => {
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
};

const getStoredApiKeys = (): ApiKey[] => {
  try {
    const stored = localStorage.getItem(API_KEYS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const storeApiKeys = (keys: ApiKey[]): void => {
  localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
};

const generateApiKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'crm_api_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

const maskApiKey = (key: string): string => {
  if (key.length <= 12) return key;
  return key.substring(0, 8) + '****' + key.substring(key.length - 4);
};

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, mode } = useThemeMode();
  const isDark = mode === 'dark';
  const { updateAvatar, userAvatar, user: authUser, logout, refreshUser } = useAuth();

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User data states (editable)
  const [userName, setUserName] = useState(authUser?.fullName || '');
  const [userEmail, setUserEmail] = useState(authUser?.email || '');
  const [userPhone, setUserPhone] = useState('');
  const [userCountry, setUserCountry] = useState('');
  // Find the currently selected avatar from the options, or use the first one
  const initialAvatar = avatarOptions.find(a => a.url === userAvatar) || avatarOptions[0];
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const profileData = await userService.getProfile();
        if (profileData.profile) {
          setUserName(profileData.profile.fullName || '');
          setUserEmail(profileData.profile.email || '');
          setUserCountry(profileData.profile.timezone || 'United States');
        }
      } catch (err: any) {
        console.log('Using auth context user data');
        // Fallback to auth context data
        if (authUser) {
          setUserName(authUser.fullName || '');
          setUserEmail(authUser.email || '');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Verification modal states
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showAntiPhishingModal, setShowAntiPhishingModal] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone);
  const [editCountry, setEditCountry] = useState(userCountry);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // API Key states
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showNewApiForm, setShowNewApiForm] = useState(false);
  const [newApiName, setNewApiName] = useState('');
  const [newApiPermissions, setNewApiPermissions] = useState<string[]>(['Read']);
  const [creatingApiKey, setCreatingApiKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  // Login history state
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [loadingLoginHistory, setLoadingLoginHistory] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState<NotificationSetting[]>(getStoredNotifications);

  // Payment states
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Preferences states - initialize from storage
  const storedPrefs = getStoredPreferences();
  const [language, setLanguage] = useState(storedPrefs.language);
  const [currency, setCurrency] = useState(storedPrefs.currency);
  const [timezone, setTimezone] = useState(storedPrefs.timezone);
  const [darkMode, setDarkMode] = useState(true);

  // Load API keys from storage on mount
  useEffect(() => {
    setApiKeys(getStoredApiKeys());
  }, []);

  // Fetch login history when modal opens
  useEffect(() => {
    if (showLoginHistory && loginHistory.length === 0) {
      fetchLoginHistory();
    }
  }, [showLoginHistory]);

  const fetchLoginHistory = async () => {
    setLoadingLoginHistory(true);
    try {
      const response = await userService.getLoginHistory({ limit: 20 });
      if (response.history) {
        const mappedHistory: LoginHistoryItem[] = response.history.map((h: any, index: number) => ({
          id: h.id || index,
          device: h.userAgent || 'Unknown Device',
          ip: h.ipAddress ? h.ipAddress.replace(/\d+$/, '***') : '***.***.***',
          location: 'Unknown',
          time: h.timestamp ? new Date(h.timestamp).toLocaleString() : '',
          current: index === 0,
        }));
        setLoginHistory(mappedHistory);
      }
    } catch (err) {
      console.log('Using default login history');
      // Fallback mock data if backend doesn't have history
      setLoginHistory([
        { id: 1, device: 'Current Session', ip: '***.***.***', location: 'Unknown', time: new Date().toLocaleString(), current: true },
      ]);
    } finally {
      setLoadingLoginHistory(false);
    }
  };

  // Handle API key creation
  const handleCreateApiKey = async () => {
    if (!newApiName.trim()) return;

    setCreatingApiKey(true);
    try {
      // Generate key locally since backend doesn't have this endpoint
      const newKey = generateApiKey();
      const newApiKey: ApiKey = {
        id: Date.now().toString(),
        name: newApiName.trim(),
        key: newKey,
        permissions: newApiPermissions,
        created: new Date().toISOString().split('T')[0],
      };

      const updatedKeys = [...apiKeys, newApiKey];
      setApiKeys(updatedKeys);
      storeApiKeys(updatedKeys);

      // Show the full key once (for copying)
      setNewlyCreatedKey(newKey);

      // Reset form
      setNewApiName('');
      setNewApiPermissions(['Read']);
      setShowNewApiForm(false);
    } catch (err) {
      console.error('Failed to create API key:', err);
    } finally {
      setCreatingApiKey(false);
    }
  };

  // Handle API key deletion
  const handleDeleteApiKey = (keyId: string | number) => {
    const updatedKeys = apiKeys.filter(k => k.id !== keyId);
    setApiKeys(updatedKeys);
    storeApiKeys(updatedKeys);
  };

  // Handle notification toggle
  const handleToggleNotification = (id: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, enabled: !n.enabled } : n
    );
    setNotifications(updatedNotifications);
    storeNotifications(updatedNotifications);
  };

  // Handle preferences save
  const handleSavePreferences = () => {
    storePreferences({ language, currency, timezone });
    setShowPreferences(false);
  };

  const user = {
    uid: authUser?.id ? `CRM-${authUser.id.slice(0, 7).toUpperCase()}` : 'CRM-0000000',
    accountType: 'Standard Account',
    vipLevel: 0,
    status: authUser?.kycLevel && authUser.kycLevel > 0 ? 'Verified' : 'Pending Verification',
    kycVerified: authUser?.kycLevel ? authUser.kycLevel > 0 : false,
    twoFactorEnabled: authUser?.is2FAEnabled || false,
    antiPhishingSet: authUser?.antiPhishingSet || false,
    verificationProgress: authUser?.is2FAEnabled ? 66 : (authUser?.kycLevel ? 33 : 0),
    joinDate: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Dec 2024',
  };

  const verificationItems = [
    {
      id: 'kyc',
      icon: <FileCheck size={20} />,
      title: 'Identity Verification',
      subtitle: 'Verify your identity to unlock higher limits',
      status: user.kycVerified ? 'Verified' : 'Not Verified',
      verified: user.kycVerified,
      action: 'Start Verification',
    },
    {
      id: '2fa',
      icon: <Lock size={20} />,
      title: 'Two-Factor Authentication',
      subtitle: 'Add an extra layer of security',
      status: user.twoFactorEnabled ? 'Enabled' : 'Not Enabled',
      verified: user.twoFactorEnabled,
      action: 'Enable 2FA',
    },
    {
      id: 'anti-phishing',
      icon: <AlertTriangle size={20} />,
      title: 'Anti-Phishing Code',
      subtitle: 'Protect yourself from phishing attacks',
      status: user.antiPhishingSet ? 'Set' : 'Not Set',
      verified: user.antiPhishingSet,
      action: 'Set Code',
    },
  ];

  const menuItems = [
    { icon: <Key size={18} />, label: 'API Management', badge: apiKeys.length.toString(), onClick: () => setShowApiModal(true) },
    { icon: <Bell size={18} />, label: 'Notifications', badge: '3', onClick: () => setShowNotificationsModal(true) },
    { icon: <CreditCard size={18} />, label: 'Payment Methods', badge: null, onClick: () => setShowPaymentModal(true) },
    { icon: <History size={18} />, label: 'Login History', badge: null, onClick: () => setShowLoginHistory(true) },
    { icon: <Settings size={18} />, label: 'Preferences', badge: null, onClick: () => setShowPreferences(true) },
  ];

  const handleCopyUID = () => {
    navigator.clipboard.writeText(user.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle verification button clicks
  const handleVerificationAction = (id: string) => {
    switch (id) {
      case 'kyc':
        setShowKYCModal(true);
        break;
      case '2fa':
        setShow2FAModal(true);
        break;
      case 'anti-phishing':
        setShowAntiPhishingModal(true);
        break;
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await userService.updateProfile({
        fullName: editName,
        // phone: editPhone, // Add when backend supports it
        timezone: editCountry,
      });

      setUserName(editName);
      setUserPhone(editPhone);
      setUserCountry(editCountry);
      setShowEditProfile(false);

      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };


  // Modal Component
  const Modal: React.FC<{ show: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string }> =
    ({ show, onClose, title, children, maxWidth = '500px' }) => (
    <AnimatePresence>
      {show && (
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth,
              maxHeight: '85vh',
              overflowY: 'auto',
              background: isDark
                ? 'linear-gradient(145deg, rgba(10, 25, 15, 0.98), rgba(5, 15, 10, 0.98))'
                : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98))',
              backdropFilter: 'blur(40px)',
              borderRadius: '24px',
              border: `1px solid ${colors.glass.border}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${colors.glass.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              background: 'inherit',
              zIndex: 10,
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, margin: 0 }}>
                {title}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, background: `${colors.status.error}20` }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: colors.text.tertiary,
                }}
              >
                <X size={18} />
              </motion.button>
            </div>
            {/* Content */}
            <div style={{ padding: '24px' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <ResponsiveLayout activeNav="profile" title="Profile">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? '16px' : '0',
          marginBottom: isMobile ? '20px' : '32px',
        }}
      >
        <div>
          <h1 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 700,
            color: colors.text.primary,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${colors.primary[400]}20, ${colors.secondary[400]}15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={isMobile ? 18 : 22} color={colors.primary[400]} />
            </motion.div>
            Profile
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '15px', color: colors.text.tertiary }}>
            Manage your account information and security settings
          </p>
        </div>

        <Button
          variant="secondary"
          size={isMobile ? 'sm' : 'md'}
          leftIcon={<Edit3 size={16} />}
          onClick={() => {
            setEditName(userName);
            setEditPhone(userPhone);
            setEditCountry(userCountry);
            setShowEditProfile(true);
          }}
        >
          Edit Profile
        </Button>
      </motion.div>

      {/* Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '360px 1fr',
        gap: isMobile ? '16px' : '24px',
      }}>
        {/* Profile Overview Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="prominent" padding="lg" glow>
            {/* Avatar Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingBottom: '24px',
              borderBottom: `1px solid ${colors.glass.border}`,
              marginBottom: '24px',
            }}>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 40px ${colors.primary[400]}40`,
                    border: `3px solid ${colors.primary[400]}40`,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={selectedAvatar.url}
                    alt={selectedAvatar.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAvatarPicker(true)}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
                    border: `2px solid ${colors.background.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: `0 2px 8px ${colors.primary[400]}40`,
                  }}
                >
                  <Camera size={14} color="#0a0e14" />
                </motion.button>
              </div>

              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: colors.text.primary,
                marginBottom: '4px',
                textAlign: 'center',
              }}>
                {userName}
              </h2>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: colors.text.tertiary,
                fontSize: '13px',
                marginBottom: '12px',
              }}>
                <Mail size={14} />
                {userEmail}
              </div>

              {/* UID */}
              <motion.button
                whileHover={{ background: `${colors.primary[400]}15` }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyUID}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  background: `${colors.primary[400]}08`,
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: colors.text.secondary,
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                UID: {user.uid}
                {copied ? <Check size={14} color={colors.status.success} /> : <Copy size={14} />}
              </motion.button>
            </div>

            {/* Account Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Account Type */}
              <div style={{
                padding: '14px 16px',
                background: `linear-gradient(135deg, ${colors.primary[400]}08, ${colors.secondary[400]}05)`,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={16} color={colors.primary[400]} />
                  <span style={{ fontSize: '13px', color: colors.text.tertiary }}>Account Type</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>
                  {user.accountType}
                </span>
              </div>

              {/* VIP Level */}
              <div style={{
                padding: '14px 16px',
                background: `linear-gradient(135deg, ${colors.primary[400]}08, ${colors.secondary[400]}05)`,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={16} color={colors.primary[400]} />
                  <span style={{ fontSize: '13px', color: colors.text.tertiary }}>VIP Level</span>
                </div>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  background: `linear-gradient(135deg, ${colors.primary[400]}20, ${colors.secondary[400]}15)`,
                  borderRadius: '6px',
                  color: colors.primary[400],
                }}>
                  VIP {user.vipLevel}
                </span>
              </div>

              {/* Country */}
              <div style={{
                padding: '14px 16px',
                background: `${colors.primary[400]}05`,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Globe size={16} color={colors.text.tertiary} />
                  <span style={{ fontSize: '13px', color: colors.text.tertiary }}>Country</span>
                </div>
                <span style={{ fontSize: '14px', color: colors.text.primary }}>
                  {userCountry}
                </span>
              </div>

              {/* Phone */}
              <div style={{
                padding: '14px 16px',
                background: `${colors.primary[400]}05`,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} color={colors.text.tertiary} />
                  <span style={{ fontSize: '13px', color: colors.text.tertiary }}>Phone</span>
                </div>
                <span style={{ fontSize: '14px', color: colors.text.primary }}>
                  {userPhone}
                </span>
              </div>

              {/* Member Since */}
              <div style={{
                padding: '14px 16px',
                background: `${colors.primary[400]}05`,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <History size={16} color={colors.text.tertiary} />
                  <span style={{ fontSize: '13px', color: colors.text.tertiary }}>Member Since</span>
                </div>
                <span style={{ fontSize: '14px', color: colors.text.primary }}>
                  {user.joinDate}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: `${colors.status.warning}10`,
              border: `1px solid ${colors.status.warning}30`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: colors.status.warning,
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.status.warning }}>
                {user.status}
              </span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
          {/* Security Center Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard padding="lg">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${colors.primary[400]}20, ${colors.secondary[400]}15)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Shield size={18} color={colors.primary[400]} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
                      Security Center
                    </h3>
                    <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                      Complete verification to unlock all features
                    </p>
                  </div>
                </div>

                {/* Progress Circle */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: `conic-gradient(${colors.primary[400]} ${user.verificationProgress * 3.6}deg, ${colors.glass.border} 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: colors.background.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: colors.primary[400],
                  }}>
                    {user.verificationProgress}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                height: '6px',
                background: colors.glass.border,
                borderRadius: '3px',
                marginBottom: '24px',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user.verificationProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
                    borderRadius: '3px',
                    boxShadow: `0 0 10px ${colors.primary[400]}40`,
                  }}
                />
              </div>

              {/* Verification Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {verificationItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 4, background: `${colors.primary[400]}08` }}
                    style={{
                      padding: '16px 20px',
                      background: `${colors.primary[400]}03`,
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: item.verified
                          ? `${colors.status.success}15`
                          : `${colors.primary[400]}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.verified ? colors.status.success : colors.primary[400],
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: colors.text.primary,
                          marginBottom: '4px',
                        }}>
                          {item.title}
                        </h4>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}>
                          {item.verified ? (
                            <CheckCircle size={14} color={colors.status.success} />
                          ) : (
                            <XCircle size={14} color={colors.status.error} />
                          )}
                          <span style={{
                            fontSize: '12px',
                            color: item.verified ? colors.status.success : colors.status.error,
                          }}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!item.verified && (
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: `0 2px 12px ${colors.primary[400]}30` }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVerificationAction(item.id)}
                        style={{
                          padding: '8px 16px',
                          background: `linear-gradient(135deg, ${colors.primary[400]}20, ${colors.secondary[400]}15)`,
                          border: `1px solid ${colors.primary[400]}40`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: colors.primary[400],
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {item.action}
                      </motion.button>
                    )}
                    {item.verified && <ChevronRight size={18} color={colors.text.tertiary} />}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard padding="lg">
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: colors.text.primary,
                marginBottom: '16px',
              }}>
                Quick Links
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {menuItems.map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ background: `${colors.primary[400]}08`, x: 4 }}
                    onClick={item.onClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: colors.text.tertiary }}>{item.icon}</span>
                      <span style={{ fontSize: '14px', color: colors.text.primary }}>
                        {item.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.badge && (
                        <span style={{
                          padding: '2px 8px',
                          background: `linear-gradient(135deg, ${colors.primary[400]}25, ${colors.secondary[400]}20)`,
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: colors.primary[400],
                        }}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={16} color={colors.text.tertiary} />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ background: `${colors.status.error}15` }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '14px',
                  marginTop: '16px',
                  background: `${colors.status.error}08`,
                  border: `1px solid ${colors.status.error}30`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: colors.status.error,
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                <LogOut size={18} />
                Sign Out
              </motion.button>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal show={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>
              Full Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                color: colors.text.primary,
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                color: colors.text.primary,
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Country */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>
              Country
            </label>
            <motion.button
              whileHover={{ borderColor: colors.primary[400] }}
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                color: colors.text.primary,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              {editCountry}
              <ChevronDown size={16} style={{ transform: showCountryDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </motion.button>

            <AnimatePresence>
              {showCountryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: isDark ? 'rgba(10, 25, 15, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                    border: `1px solid ${colors.glass.border}`,
                    borderRadius: '10px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 100,
                  }}
                >
                  {countries.map((country) => (
                    <motion.div
                      key={country}
                      whileHover={{ background: `${colors.primary[400]}15` }}
                      onClick={() => {
                        setEditCountry(country);
                        setShowCountryDropdown(false);
                      }}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        color: editCountry === country ? colors.primary[400] : colors.text.primary,
                        fontSize: '14px',
                      }}
                    >
                      {country}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveProfile}
            style={{
              width: '100%',
              padding: '14px',
              background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
              border: 'none',
              borderRadius: '12px',
              color: '#0a0e14',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Save size={18} />
            Save Changes
          </motion.button>
        </div>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal show={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} title="Choose Avatar" maxWidth="600px">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          {avatarOptions.map((avatar) => (
            <motion.button
              key={avatar.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedAvatar(avatar);
                updateAvatar(avatar.url);
                setShowAvatarPicker(false);
              }}
              style={{
                padding: '12px',
                background: selectedAvatar.id === avatar.id
                  ? `${colors.primary[400]}20`
                  : colors.background.card,
                border: selectedAvatar.id === avatar.id
                  ? `2px solid ${colors.primary[400]}`
                  : `1px solid ${colors.glass.border}`,
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${colors.primary[400]}30, ${colors.secondary[400]}20)`,
              }}>
                <img
                  src={avatar.url}
                  alt={avatar.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span style={{
                fontSize: '11px',
                color: selectedAvatar.id === avatar.id ? colors.primary[400] : colors.text.tertiary,
                fontWeight: selectedAvatar.id === avatar.id ? 600 : 400,
              }}>
                {avatar.name}
              </span>
            </motion.button>
          ))}
        </div>
      </Modal>

      {/* API Management Modal */}
      <Modal show={showApiModal} onClose={() => { setShowApiModal(false); setNewlyCreatedKey(null); }} title="API Management" maxWidth="600px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Newly created key alert */}
          {newlyCreatedKey && (
            <div style={{
              padding: '16px',
              background: `${colors.status.warning}15`,
              border: `1px solid ${colors.status.warning}40`,
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertTriangle size={16} color={colors.status.warning} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.status.warning }}>
                  Save your API key now - it won't be shown again!
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <code style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: colors.background.primary,
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: colors.text.primary,
                  wordBreak: 'break-all',
                }}>
                  {newlyCreatedKey}
                </code>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(newlyCreatedKey);
                  }}
                  style={{
                    padding: '8px',
                    background: colors.primary[400],
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#0a0e14',
                  }}
                >
                  <Copy size={16} />
                </motion.button>
              </div>
            </div>
          )}

          {/* Existing API Keys */}
          {apiKeys.length === 0 && !showNewApiForm && (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: colors.text.tertiary,
            }}>
              <Key size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
              <p style={{ fontSize: '14px' }}>No API keys yet</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Create an API key to access the trading API</p>
            </div>
          )}

          {apiKeys.map((key) => (
            <div
              key={key.id}
              style={{
                padding: '16px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>{key.name}</h4>
                  <span style={{ fontSize: '12px', color: colors.text.tertiary, fontFamily: 'monospace' }}>{maskApiKey(key.key)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, color: colors.status.error }}
                  onClick={() => handleDeleteApiKey(key.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text.tertiary }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {key.permissions.map((perm) => (
                  <span
                    key={perm}
                    style={{
                      padding: '4px 8px',
                      background: `${colors.primary[400]}15`,
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: colors.primary[400],
                    }}
                  >
                    {perm}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: colors.text.tertiary }}>
                Created: {key.created}{key.lastUsed ? ` • Last used: ${key.lastUsed}` : ''}
              </div>
            </div>
          ))}

          {/* Create New API Key */}
          {showNewApiForm ? (
            <div style={{
              padding: '16px',
              background: `${colors.primary[400]}08`,
              border: `1px solid ${colors.primary[400]}30`,
              borderRadius: '12px',
            }}>
              <input
                type="text"
                placeholder="API Key Name"
                value={newApiName}
                onChange={(e) => setNewApiName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: colors.background.card,
                  border: `1px solid ${colors.glass.border}`,
                  borderRadius: '8px',
                  color: colors.text.primary,
                  fontSize: '14px',
                  marginBottom: '12px',
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {['Read', 'Trade', 'Withdraw'].map((perm) => (
                  <motion.button
                    key={perm}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      if (newApiPermissions.includes(perm)) {
                        setNewApiPermissions(newApiPermissions.filter(p => p !== perm));
                      } else {
                        setNewApiPermissions([...newApiPermissions, perm]);
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      background: newApiPermissions.includes(perm) ? colors.primary[400] : colors.background.card,
                      border: `1px solid ${colors.glass.border}`,
                      borderRadius: '6px',
                      color: newApiPermissions.includes(perm) ? '#0a0e14' : colors.text.secondary,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {perm}
                  </motion.button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="primary" size="sm" onClick={handleCreateApiKey} disabled={creatingApiKey || !newApiName.trim()}>
                  {creatingApiKey ? 'Creating...' : 'Create Key'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowNewApiForm(false)} disabled={creatingApiKey}>Cancel</Button>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowNewApiForm(true)}
              style={{
                padding: '14px',
                background: 'transparent',
                border: `2px dashed ${colors.glass.border}`,
                borderRadius: '12px',
                color: colors.primary[400],
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Plus size={18} />
              Create New API Key
            </motion.button>
          )}
        </div>
      </Modal>

      {/* Notifications Modal */}
      <Modal show={showNotificationsModal} onClose={() => setShowNotificationsModal(false)} title="Notification Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              whileHover={{ background: `${colors.primary[400]}08` }}
              style={{
                padding: '16px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary, marginBottom: '4px' }}>
                  {notif.label}
                </h4>
                <p style={{ fontSize: '12px', color: colors.text.tertiary }}>{notif.description}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggleNotification(notif.id)}
                style={{
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  background: notif.enabled
                    ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`
                    : colors.glass.border,
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: 0,
                }}
              >
                <motion.div
                  animate={{ x: notif.enabled ? 22 : 2 }}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: '2px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Payment Methods">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {paymentMethods.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: colors.text.tertiary }}>
              <CreditCard size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
              <p style={{ fontSize: '14px' }}>No payment methods added</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Add a payment method for faster withdrawals</p>
            </div>
          )}
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              style={{
                padding: '16px',
                background: colors.background.card,
                border: `1px solid ${method.default ? colors.primary[400] : colors.glass.border}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{method.icon}</span>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>{method.name}</h4>
                  {method.default && (
                    <span style={{ fontSize: '11px', color: colors.primary[400] }}>Default</span>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, color: colors.status.error }}
                onClick={() => setPaymentMethods(paymentMethods.filter(p => p.id !== method.id))}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.text.tertiary }}
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.02 }}
            style={{
              padding: '14px',
              background: 'transparent',
              border: `2px dashed ${colors.glass.border}`,
              borderRadius: '12px',
              color: colors.primary[400],
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Plus size={18} />
            Add Payment Method
          </motion.button>
        </div>
      </Modal>

      {/* Login History Modal */}
      <Modal show={showLoginHistory} onClose={() => setShowLoginHistory(false)} title="Login History" maxWidth="600px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loadingLoginHistory && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '8px' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: colors.primary[400] }} />
              <span style={{ color: colors.text.tertiary }}>Loading login history...</span>
            </div>
          )}
          {!loadingLoginHistory && loginHistory.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: colors.text.tertiary }}>
              <History size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
              <p style={{ fontSize: '14px' }}>No login history available</p>
            </div>
          )}
          {!loadingLoginHistory && loginHistory.map((session) => (
            <div
              key={session.id}
              style={{
                padding: '16px',
                background: session.current ? `${colors.primary[400]}10` : colors.background.card,
                border: `1px solid ${session.current ? colors.primary[400] : colors.glass.border}`,
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {session.device.includes('Windows') || session.device.includes('MacOS') ? (
                    <Monitor size={18} color={colors.primary[400]} />
                  ) : (
                    <Smartphone size={18} color={colors.primary[400]} />
                  )}
                  <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary }}>{session.device}</span>
                </div>
                {session.current && (
                  <span style={{
                    padding: '4px 8px',
                    background: colors.status.success,
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#0a0e14',
                  }}>
                    Current Session
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: colors.text.tertiary }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={12} /> {session.ip}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {session.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {session.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Preferences Modal */}
      <Modal show={showPreferences} onClose={() => setShowPreferences(false)} title="Preferences">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Language */}
          <div>
            <label style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                color: colors.text.primary,
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>
              Display Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                color: colors.text.primary,
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CNY">CNY - Chinese Yuan</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '8px', display: 'block' }}>
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: colors.background.card,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: '10px',
                color: colors.text.primary,
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
              <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
              <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
              <option value="UTC+1 (CET)">UTC+1 (CET)</option>
              <option value="UTC+8 (CST)">UTC+8 (CST)</option>
              <option value="UTC+9 (JST)">UTC+9 (JST)</option>
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <div style={{
            padding: '16px',
            background: colors.background.card,
            border: `1px solid ${colors.glass.border}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary, marginBottom: '4px' }}>
                Dark Mode
              </h4>
              <p style={{ fontSize: '12px', color: colors.text.tertiary }}>Use dark theme</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              style={{
                width: '48px',
                height: '26px',
                borderRadius: '13px',
                background: darkMode
                  ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`
                  : colors.glass.border,
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: 0,
              }}
            >
              <motion.div
                animate={{ x: darkMode ? 22 : 2 }}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '2px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </motion.button>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSavePreferences}
            style={{
              width: '100%',
              padding: '14px',
              background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
              border: 'none',
              borderRadius: '12px',
              color: '#0a0e14',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Save size={18} />
            Save Preferences
          </motion.button>
        </div>
      </Modal>

      {/* KYC Verification Modal */}
      <Modal show={showKYCModal} onClose={() => setShowKYCModal(false)} title="Identity Verification" maxWidth="500px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px' }}>
          <div style={{
            padding: '20px',
            background: `linear-gradient(135deg, ${colors.primary[400]}10, ${colors.secondary[400]}08)`,
            borderRadius: '16px',
            border: `1px solid ${colors.primary[400]}20`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${colors.primary[400]}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FileCheck size={24} color={colors.primary[400]} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, margin: 0 }}>
                  Complete KYC Verification
                </h4>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, margin: 0 }}>
                  Unlock higher trading limits
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary, margin: 0 }}>
              Requirements:
            </h5>
            {[
              'Valid government-issued ID (Passport, Driver\'s License, or National ID)',
              'Proof of address (Utility bill or bank statement, less than 3 months old)',
              'Clear selfie photo for identity verification'
            ].map((req, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle size={16} color={colors.primary[400]} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>{req}</span>
              </div>
            ))}
          </div>

          <div style={{
            padding: '14px 16px',
            background: `${colors.status.warning}10`,
            border: `1px solid ${colors.status.warning}30`,
            borderRadius: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color={colors.status.warning} />
              <span style={{ fontSize: '12px', color: colors.status.warning }}>
                Verification typically takes 1-3 business days
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowKYCModal(false);
              navigate('/kyc');
            }}
            style={{
              width: '100%',
              padding: '14px',
              background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
              border: 'none',
              borderRadius: '12px',
              color: '#0a0e14',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <FileCheck size={18} />
            Start Verification Process
          </motion.button>
        </div>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal show={show2FAModal} onClose={() => setShow2FAModal(false)} title="Two-Factor Authentication" maxWidth="500px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px' }}>
          <div style={{
            padding: '20px',
            background: `linear-gradient(135deg, ${colors.primary[400]}10, ${colors.secondary[400]}08)`,
            borderRadius: '16px',
            border: `1px solid ${colors.primary[400]}20`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${colors.primary[400]}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Lock size={24} color={colors.primary[400]} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, margin: 0 }}>
                  Enable 2FA Security
                </h4>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, margin: 0 }}>
                  Add an extra layer of protection
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary, margin: 0 }}>
              How it works:
            </h5>
            {[
              'Download an authenticator app (Google Authenticator, Authy)',
              'Scan the QR code with your authenticator app',
              'Enter the 6-digit code to verify setup',
              'Save your backup codes in a safe place'
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: `${colors.primary[400]}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: colors.primary[400],
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '13px', color: colors.text.secondary }}>{step}</span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShow2FAModal(false);
              navigate('/security/2fa');
            }}
            style={{
              width: '100%',
              padding: '14px',
              background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
              border: 'none',
              borderRadius: '12px',
              color: '#0a0e14',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Lock size={18} />
            Set Up 2FA Now
          </motion.button>
        </div>
      </Modal>

      {/* Anti-Phishing Code Modal */}
      <Modal show={showAntiPhishingModal} onClose={() => setShowAntiPhishingModal(false)} title="Anti-Phishing Code" maxWidth="500px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px' }}>
          <div style={{
            padding: '20px',
            background: `linear-gradient(135deg, ${colors.primary[400]}10, ${colors.secondary[400]}08)`,
            borderRadius: '16px',
            border: `1px solid ${colors.primary[400]}20`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${colors.status.warning}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <AlertTriangle size={24} color={colors.status.warning} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, margin: 0 }}>
                  Set Anti-Phishing Code
                </h4>
                <p style={{ fontSize: '13px', color: colors.text.tertiary, margin: 0 }}>
                  Verify authentic CrymadX emails
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary, margin: 0 }}>
              What is an Anti-Phishing Code?
            </h5>
            <p style={{ fontSize: '13px', color: colors.text.secondary, lineHeight: 1.6 }}>
              Your anti-phishing code is a unique word or phrase that will appear in all official
              CrymadX emails. If an email doesn't contain your code, it may be a phishing attempt.
            </p>
          </div>

          <div style={{
            padding: '14px 16px',
            background: `${colors.status.success}10`,
            border: `1px solid ${colors.status.success}30`,
            borderRadius: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color={colors.status.success} />
              <span style={{ fontSize: '12px', color: colors.status.success }}>
                Choose a memorable code only you would know
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowAntiPhishingModal(false);
              navigate('/security/anti-phishing');
            }}
            style={{
              width: '100%',
              padding: '14px',
              background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
              border: 'none',
              borderRadius: '12px',
              color: '#0a0e14',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={18} />
            Create Anti-Phishing Code
          </motion.button>
        </div>
      </Modal>
    </ResponsiveLayout>
  );
};

export default ProfileScreen;
