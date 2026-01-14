import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  Star,
  Landmark,
  Wallet,
  Smartphone,
  CheckCircle,
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Save,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, ResponsiveLayout } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { LiquidGlassBackground } from '../../components/Glass3D';
import { p2pService, UserPaymentMethod, CreatePaymentMethodParams } from '../../services/p2pService';
import { tokenManager } from '../../services';

// Payment method type configurations
const paymentTypes = [
  { type: 'bank_transfer', label: 'Bank Transfer', icon: <Landmark size={20} />, color: '#3b82f6' },
  { type: 'paypal', label: 'PayPal', icon: <Wallet size={20} />, color: '#0070ba' },
  { type: 'wise', label: 'Wise', icon: <Smartphone size={20} />, color: '#9fe870' },
  { type: 'zelle', label: 'Zelle', icon: <CreditCard size={20} />, color: '#6d1ed4' },
  { type: 'venmo', label: 'Venmo', icon: <Smartphone size={20} />, color: '#008cff' },
  { type: 'cashapp', label: 'Cash App', icon: <Smartphone size={20} />, color: '#00d632' },
  { type: 'revolut', label: 'Revolut', icon: <CreditCard size={20} />, color: '#0075eb' },
  { type: 'other', label: 'Other', icon: <CreditCard size={20} />, color: '#888888' },
] as const;

type PaymentType = typeof paymentTypes[number]['type'];

export const PaymentMethodsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, isDark } = useThemeMode();

  const [paymentMethods, setPaymentMethods] = useState<UserPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<UserPaymentMethod | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [formType, setFormType] = useState<PaymentType>('bank_transfer');
  const [formLabel, setFormLabel] = useState('');
  const [formDetails, setFormDetails] = useState<UserPaymentMethod['details']>({});
  const [formIsDefault, setFormIsDefault] = useState(false);

  // Fetch payment methods
  useEffect(() => {
    if (!tokenManager.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchPaymentMethods = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await p2pService.getPaymentMethods();
        setPaymentMethods(response?.paymentMethods || []);
      } catch (err: any) {
        // Silently handle 404 and HTML parse errors (backend endpoint doesn't exist yet)
        const errorMessage = err?.message || '';
        const is404OrNotFound =
          err?.status === 404 ||
          errorMessage.includes('404') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('Unexpected token') ||
          errorMessage.includes('DOCTYPE');

        if (is404OrNotFound) {
          // Endpoint doesn't exist yet - show empty list
          setPaymentMethods([]);
        } else {
          console.error('Failed to fetch payment methods:', err);
          setError(err?.message || 'Failed to load payment methods');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [navigate]);

  // Reset form
  const resetForm = () => {
    setFormType('bank_transfer');
    setFormLabel('');
    setFormDetails({});
    setFormIsDefault(false);
    setEditingMethod(null);
  };

  // Open add modal
  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Open edit modal
  const handleEdit = (method: UserPaymentMethod) => {
    setEditingMethod(method);
    setFormType(method.type);
    setFormLabel(method.label);
    setFormDetails(method.details);
    setFormIsDefault(method.isDefault);
    setShowAddModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  // Save payment method
  const handleSave = async () => {
    if (!formLabel.trim()) {
      setError('Please enter a label for this payment method');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const params: CreatePaymentMethodParams = {
        type: formType,
        label: formLabel,
        details: formDetails,
        isDefault: formIsDefault,
      };

      if (editingMethod) {
        await p2pService.updatePaymentMethod(editingMethod.id, params);
      } else {
        await p2pService.addPaymentMethod(params);
      }

      // Refresh list
      const response = await p2pService.getPaymentMethods();
      setPaymentMethods(response?.paymentMethods || []);
      handleCloseModal();
    } catch (err: any) {
      setError(err?.message || 'Failed to save payment method');
    } finally {
      setSaving(false);
    }
  };

  // Delete payment method
  const handleDelete = async (methodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    setDeleting(methodId);
    setError(null);
    try {
      await p2pService.deletePaymentMethod(methodId);
      setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete payment method');
    } finally {
      setDeleting(null);
    }
  };

  // Set default
  const handleSetDefault = async (methodId: string) => {
    setError(null);
    try {
      await p2pService.setDefaultPaymentMethod(methodId);
      // Update local state
      setPaymentMethods(prev => prev.map(m => ({
        ...m,
        isDefault: m.id === methodId,
      })));
    } catch (err: any) {
      setError(err?.message || 'Failed to set default');
    }
  };

  // Get type config
  const getTypeConfig = (type: PaymentType) => {
    return paymentTypes.find(t => t.type === type) || paymentTypes[paymentTypes.length - 1];
  };

  // Render form fields based on payment type
  const renderFormFields = () => {
    switch (formType) {
      case 'bank_transfer':
        return (
          <>
            <FormField
              label="Bank Name"
              value={formDetails.bankName || ''}
              onChange={(v) => setFormDetails({ ...formDetails, bankName: v })}
              placeholder="e.g. Chase Bank, Bank of America"
            />
            <FormField
              label="Account Holder Name"
              value={formDetails.accountHolderName || ''}
              onChange={(v) => setFormDetails({ ...formDetails, accountHolderName: v })}
              placeholder="Name on the account"
            />
            <FormField
              label="Account Number"
              value={formDetails.accountNumber || ''}
              onChange={(v) => setFormDetails({ ...formDetails, accountNumber: v })}
              placeholder="Your account number"
              type="password"
            />
            <FormField
              label="Routing Number (Optional)"
              value={formDetails.routingNumber || ''}
              onChange={(v) => setFormDetails({ ...formDetails, routingNumber: v })}
              placeholder="Bank routing number"
            />
            <FormField
              label="IBAN (For international)"
              value={formDetails.iban || ''}
              onChange={(v) => setFormDetails({ ...formDetails, iban: v })}
              placeholder="International Bank Account Number"
            />
            <FormField
              label="SWIFT/BIC Code (Optional)"
              value={formDetails.swiftCode || ''}
              onChange={(v) => setFormDetails({ ...formDetails, swiftCode: v })}
              placeholder="SWIFT code for international transfers"
            />
          </>
        );

      case 'paypal':
      case 'wise':
        return (
          <FormField
            label="Email Address"
            value={formDetails.email || ''}
            onChange={(v) => setFormDetails({ ...formDetails, email: v })}
            placeholder={`Your ${formType === 'paypal' ? 'PayPal' : 'Wise'} email`}
            type="email"
          />
        );

      case 'zelle':
        return (
          <>
            <FormField
              label="Email or Phone Number"
              value={formDetails.email || formDetails.phoneNumber || ''}
              onChange={(v) => {
                // Detect if it's email or phone
                if (v.includes('@')) {
                  setFormDetails({ ...formDetails, email: v, phoneNumber: undefined });
                } else {
                  setFormDetails({ ...formDetails, phoneNumber: v, email: undefined });
                }
              }}
              placeholder="Your Zelle email or phone"
            />
            <FormField
              label="Account Holder Name"
              value={formDetails.accountHolderName || ''}
              onChange={(v) => setFormDetails({ ...formDetails, accountHolderName: v })}
              placeholder="Name registered with Zelle"
            />
          </>
        );

      case 'venmo':
      case 'cashapp':
        return (
          <>
            <FormField
              label="Username"
              value={formDetails.username || ''}
              onChange={(v) => setFormDetails({ ...formDetails, username: v })}
              placeholder={`Your ${formType === 'venmo' ? 'Venmo' : 'Cash App'} username`}
            />
            <FormField
              label="Phone Number (Optional)"
              value={formDetails.phoneNumber || ''}
              onChange={(v) => setFormDetails({ ...formDetails, phoneNumber: v })}
              placeholder="Associated phone number"
            />
          </>
        );

      case 'revolut':
        return (
          <>
            <FormField
              label="Username or Phone"
              value={formDetails.username || formDetails.phoneNumber || ''}
              onChange={(v) => setFormDetails({ ...formDetails, username: v })}
              placeholder="Your Revolut username or phone"
            />
            <FormField
              label="Account Holder Name"
              value={formDetails.accountHolderName || ''}
              onChange={(v) => setFormDetails({ ...formDetails, accountHolderName: v })}
              placeholder="Name on the account"
            />
          </>
        );

      default:
        return (
          <>
            <FormField
              label="Payment Details"
              value={formDetails.email || formDetails.username || ''}
              onChange={(v) => setFormDetails({ ...formDetails, email: v })}
              placeholder="Enter your payment details"
            />
            <FormField
              label="Additional Info (Optional)"
              value={formDetails.accountHolderName || ''}
              onChange={(v) => setFormDetails({ ...formDetails, accountHolderName: v })}
              placeholder="Any additional information"
            />
          </>
        );
    }
  };

  // Form field component
  const FormField = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
  }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: 500,
        color: colors.text.secondary,
        marginBottom: '6px',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: '10px',
          fontSize: '14px',
          color: colors.text.primary,
          outline: 'none',
        }}
      />
    </div>
  );

  return (
    <ResponsiveLayout activeNav="p2p" title="Payment Methods">
      <LiquidGlassBackground intensity="low" showOrbs={true} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/p2p')}
            style={{
              padding: '10px',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: 'none',
              borderRadius: '10px',
              color: colors.text.secondary,
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <div>
            <h1 style={{
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: 700,
              color: colors.text.primary,
            }}>
              Payment Methods
            </h1>
            <p style={{ fontSize: '14px', color: colors.text.tertiary }}>
              Manage your P2P payment methods
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[500]})`,
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: `0 4px 12px ${colors.primary[400]}40`,
          }}
        >
          <Plus size={18} />
          Add Payment Method
        </motion.button>
      </motion.div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={18} color={colors.status.error} />
            <span style={{ flex: 1, fontSize: '13px', color: colors.status.error }}>
              {error}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: colors.status.error,
              }}
            >
              <X size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          padding: '16px',
          background: `${colors.primary[400]}10`,
          borderRadius: '12px',
          border: `1px solid ${colors.primary[400]}30`,
          marginBottom: '24px',
        }}
      >
        <p style={{ fontSize: '13px', color: colors.text.secondary, lineHeight: 1.5 }}>
          <strong style={{ color: colors.primary[400] }}>Tip:</strong> Add your payment methods here to use them when creating P2P ads.
          Your payment details will be shown to buyers/sellers during trades.
        </p>
      </motion.div>

      {/* Payment Methods List */}
      <GlassCard padding={isMobile ? 'sm' : 'md'}>
        {loading && (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Loader2 size={32} color={colors.primary[400]} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <AlertCircle size={48} color={colors.status.error} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
              Unable to load payment methods
            </h3>
            <p style={{ fontSize: '13px', color: colors.text.tertiary }}>{error}</p>
          </div>
        )}

        {!loading && !error && paymentMethods.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <CreditCard size={48} color={colors.text.tertiary} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '8px' }}>
              No payment methods yet
            </h3>
            <p style={{ fontSize: '13px', color: colors.text.tertiary, marginBottom: '20px' }}>
              Add your first payment method to start P2P trading
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenAdd}
              style={{
                padding: '12px 24px',
                background: colors.primary[400],
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Add Payment Method
            </motion.button>
          </div>
        )}

        {!loading && !error && paymentMethods.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paymentMethods.map((method) => {
              const typeConfig = getTypeConfig(method.type);
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '16px',
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    border: `1px solid ${method.isDefault ? colors.primary[400] + '50' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: `${typeConfig.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: typeConfig.color,
                      }}>
                        {typeConfig.icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>
                            {method.label}
                          </span>
                          {method.isDefault && (
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              background: `${colors.primary[400]}20`,
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 600,
                              color: colors.primary[400],
                            }}>
                              <Star size={10} fill={colors.primary[400]} />
                              Default
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: colors.text.tertiary, marginBottom: '4px' }}>
                          {typeConfig.label}
                        </p>
                        {/* Show masked details */}
                        <p style={{ fontSize: '12px', color: colors.text.secondary }}>
                          {method.type === 'bank_transfer' && method.details.bankName && (
                            <>{method.details.bankName} {method.details.accountNumber ? `••••${method.details.accountNumber.slice(-4)}` : ''}</>
                          )}
                          {(method.type === 'paypal' || method.type === 'wise') && method.details.email && (
                            <>{method.details.email}</>
                          )}
                          {method.type === 'zelle' && (method.details.email || method.details.phoneNumber) && (
                            <>{method.details.email || method.details.phoneNumber}</>
                          )}
                          {(method.type === 'venmo' || method.type === 'cashapp') && method.details.username && (
                            <>@{method.details.username}</>
                          )}
                          {method.type === 'revolut' && (method.details.username || method.details.phoneNumber) && (
                            <>{method.details.username || method.details.phoneNumber}</>
                          )}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!method.isDefault && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSetDefault(method.id)}
                          title="Set as default"
                          style={{
                            padding: '8px',
                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                            border: 'none',
                            borderRadius: '8px',
                            color: colors.text.tertiary,
                            cursor: 'pointer',
                          }}
                        >
                          <Star size={16} />
                        </motion.button>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(method)}
                        style={{
                          padding: '8px',
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          border: 'none',
                          borderRadius: '8px',
                          color: colors.text.secondary,
                          cursor: 'pointer',
                        }}
                      >
                        <Edit3 size={16} />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(method.id)}
                        disabled={deleting === method.id}
                        style={{
                          padding: '8px',
                          background: `${colors.status.error}10`,
                          border: 'none',
                          borderRadius: '8px',
                          color: colors.status.error,
                          cursor: 'pointer',
                          opacity: deleting === method.id ? 0.5 : 1,
                        }}
                      >
                        {deleting === method.id ? (
                          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(12px)',
                zIndex: 9998,
              }}
            />

            <div style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
              pointerEvents: 'none',
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  maxHeight: 'calc(100vh - 40px)',
                  overflowY: 'auto',
                  background: isDark
                    ? 'linear-gradient(145deg, rgba(25, 28, 32, 0.98) 0%, rgba(15, 18, 22, 0.98) 100%)'
                    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 252, 252, 0.98) 100%)',
                  borderRadius: '24px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,100,100,0.15)'}`,
                  padding: '28px',
                  pointerEvents: 'auto',
                }}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.text.primary }}>
                    {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseModal}
                    style={{
                      padding: '8px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: colors.text.tertiary,
                      cursor: 'pointer',
                    }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Payment Type Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: colors.text.secondary,
                    marginBottom: '10px',
                  }}>
                    Payment Type
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                  }}>
                    {paymentTypes.map((pt) => (
                      <motion.button
                        key={pt.type}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setFormType(pt.type);
                          setFormDetails({});
                        }}
                        style={{
                          padding: '12px 8px',
                          background: formType === pt.type ? `${pt.color}20` : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          border: `1px solid ${formType === pt.type ? pt.color : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ color: formType === pt.type ? pt.color : colors.text.secondary }}>
                          {pt.icon}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          color: formType === pt.type ? pt.color : colors.text.tertiary,
                        }}>
                          {pt.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Label Field */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: colors.text.secondary,
                    marginBottom: '6px',
                  }}>
                    Label (Display Name)
                  </label>
                  <input
                    type="text"
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder={`e.g. My ${getTypeConfig(formType).label} Account`}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: colors.text.primary,
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Type-specific Fields */}
                {renderFormFields()}

                {/* Default Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  borderRadius: '10px',
                  marginBottom: '24px',
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: colors.text.primary }}>
                      Set as default
                    </p>
                    <p style={{ fontSize: '12px', color: colors.text.tertiary }}>
                      Use this method by default for new P2P ads
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormIsDefault(!formIsDefault)}
                    style={{
                      width: '48px',
                      height: '28px',
                      borderRadius: '14px',
                      background: formIsDefault ? colors.primary[400] : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s',
                    }}
                  >
                    <motion.div
                      animate={{ x: formIsDefault ? 22 : 2 }}
                      style={{
                        width: '24px',
                        height: '24px',
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
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: saving ? isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' : colors.primary[400],
                    border: 'none',
                    borderRadius: '12px',
                    color: saving ? colors.text.tertiary : '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingMethod ? 'Update Payment Method' : 'Save Payment Method'}
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

export default PaymentMethodsScreen;
