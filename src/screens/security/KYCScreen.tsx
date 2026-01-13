import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Upload,
  Camera,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  MapPin,
  Shield,
  Loader2,
} from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeContext';
import { GlassCard, Button, ResponsiveLayout } from '../../components';
import { usePresentationMode } from '../../components/PresentationMode';
import { useAuth } from '../../context/AuthContext';

// Document types for KYC
const documentTypes = [
  { id: 'passport', name: 'Passport', icon: FileText },
  { id: 'drivers_license', name: "Driver's License", icon: FileText },
  { id: 'national_id', name: 'National ID Card', icon: FileText },
];

// Verification steps
const steps = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Document Upload', icon: FileCheck },
  { id: 3, title: 'Address Verification', icon: MapPin },
  { id: 4, title: 'Selfie Verification', icon: Camera },
];

export const KYCScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = usePresentationMode();
  const { colors, mode } = useThemeMode();
  const isDark = mode === 'dark';
  const { user } = useAuth();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('');
  const [idFrontImage, setIdFrontImage] = useState<string | null>(null);
  const [idBackImage, setIdBackImage] = useState<string | null>(null);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [proofOfAddress, setProofOfAddress] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);

  // File input refs
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const addressProofRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return firstName && lastName && dateOfBirth && nationality;
      case 2:
        return selectedDocType && idFrontImage && idBackImage;
      case 3:
        return addressLine1 && city && postalCode && country && proofOfAddress;
      case 4:
        return selfieImage;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    border: `1px solid ${colors.glass.border}`,
    borderRadius: '12px',
    color: colors.text.primary,
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: colors.text.secondary,
    marginBottom: '8px',
  };

  // Render success screen
  if (submitted) {
    return (
      <ResponsiveLayout>
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', maxWidth: '400px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
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

            <h2 style={{ fontSize: '24px', fontWeight: 700, color: colors.text.primary, marginBottom: '12px' }}>
              Verification Submitted!
            </h2>
            <p style={{ fontSize: '14px', color: colors.text.secondary, marginBottom: '32px', lineHeight: 1.6 }}>
              Your KYC documents have been submitted for review. We'll notify you once verification is complete.
              This typically takes 1-3 business days.
            </p>

            <div style={{
              padding: '16px 20px',
              background: `${colors.status.warning}10`,
              border: `1px solid ${colors.status.warning}30`,
              borderRadius: '12px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={18} color={colors.status.warning} />
                <span style={{ fontSize: '13px', color: colors.status.warning }}>
                  Status: Under Review
                </span>
              </div>
            </div>

            <Button variant="primary" onClick={() => navigate('/profile')}>
              Return to Profile
            </Button>
          </motion.div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div style={{ padding: isMobile ? '16px' : '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: colors.text.tertiary,
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${colors.primary[400]}20, ${colors.secondary[400]}15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={24} color={colors.primary[400]} />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: colors.text.primary, margin: 0 }}>
                Identity Verification
              </h1>
              <p style={{ fontSize: '14px', color: colors.text.tertiary, margin: 0 }}>
                Complete KYC to unlock all features
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <GlassCard padding="md" style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
          }}>
            {/* Progress Line */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '10%',
              right: '10%',
              height: '2px',
              background: colors.glass.border,
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${colors.primary[400]}, ${colors.secondary[400]})`,
                }}
              />
            </div>

            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isCompleted
                      ? `linear-gradient(135deg, ${colors.primary[400]}, ${colors.secondary[400]})`
                      : isActive
                        ? `${colors.primary[400]}20`
                        : colors.background.secondary,
                    border: `2px solid ${isCompleted || isActive ? colors.primary[400] : colors.glass.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                  }}>
                    {isCompleted ? (
                      <CheckCircle size={20} color="#0a0e14" />
                    ) : (
                      <StepIcon size={18} color={isActive ? colors.primary[400] : colors.text.tertiary} />
                    )}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? colors.text.primary : colors.text.tertiary,
                    textAlign: 'center',
                  }}>
                    {step.title}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Step Content */}
        <GlassCard padding="lg">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, marginBottom: '24px' }}>
                  Personal Information
                </h3>

                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Nationality</label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="Enter your nationality"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Document Upload */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, marginBottom: '24px' }}>
                  Document Upload
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Select Document Type</label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {documentTypes.map((doc) => (
                      <motion.button
                        key={doc.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDocType(doc.id)}
                        style={{
                          padding: '12px 20px',
                          borderRadius: '12px',
                          border: `1px solid ${selectedDocType === doc.id ? colors.primary[400] : colors.glass.border}`,
                          background: selectedDocType === doc.id
                            ? `${colors.primary[400]}15`
                            : 'transparent',
                          color: selectedDocType === doc.id ? colors.primary[400] : colors.text.secondary,
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <doc.icon size={16} />
                        {doc.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                  {/* Front of ID */}
                  <div>
                    <label style={labelStyle}>Front of Document</label>
                    <input
                      ref={idFrontRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setIdFrontImage)}
                      style={{ display: 'none' }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => idFrontRef.current?.click()}
                      style={{
                        height: '160px',
                        border: `2px dashed ${idFrontImage ? colors.status.success : colors.glass.border}`,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: idFrontImage
                          ? `url(${idFrontImage}) center/cover`
                          : `${colors.primary[400]}05`,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {!idFrontImage && (
                        <>
                          <Upload size={24} color={colors.text.tertiary} />
                          <span style={{ fontSize: '13px', color: colors.text.tertiary, marginTop: '8px' }}>
                            Click to upload
                          </span>
                        </>
                      )}
                      {idFrontImage && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: colors.status.success,
                          borderRadius: '50%',
                          padding: '4px',
                        }}>
                          <CheckCircle size={16} color="#fff" />
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Back of ID */}
                  <div>
                    <label style={labelStyle}>Back of Document</label>
                    <input
                      ref={idBackRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setIdBackImage)}
                      style={{ display: 'none' }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => idBackRef.current?.click()}
                      style={{
                        height: '160px',
                        border: `2px dashed ${idBackImage ? colors.status.success : colors.glass.border}`,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: idBackImage
                          ? `url(${idBackImage}) center/cover`
                          : `${colors.primary[400]}05`,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {!idBackImage && (
                        <>
                          <Upload size={24} color={colors.text.tertiary} />
                          <span style={{ fontSize: '13px', color: colors.text.tertiary, marginTop: '8px' }}>
                            Click to upload
                          </span>
                        </>
                      )}
                      {idBackImage && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: colors.status.success,
                          borderRadius: '50%',
                          padding: '4px',
                        }}>
                          <CheckCircle size={16} color="#fff" />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Address Verification */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, marginBottom: '24px' }}>
                  Address Verification
                </h3>

                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Address Line 1</label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Street address"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment, suite, etc."
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                    <div>
                      <label style={labelStyle}>City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal code"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Proof of Address (Utility bill, bank statement)</label>
                    <input
                      ref={addressProofRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e, setProofOfAddress)}
                      style={{ display: 'none' }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => addressProofRef.current?.click()}
                      style={{
                        padding: '24px',
                        border: `2px dashed ${proofOfAddress ? colors.status.success : colors.glass.border}`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        background: `${colors.primary[400]}05`,
                      }}
                    >
                      {proofOfAddress ? (
                        <>
                          <CheckCircle size={20} color={colors.status.success} />
                          <span style={{ fontSize: '14px', color: colors.status.success }}>
                            Document uploaded
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={20} color={colors.text.tertiary} />
                          <span style={{ fontSize: '14px', color: colors.text.tertiary }}>
                            Click to upload proof of address
                          </span>
                        </>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Selfie Verification */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, marginBottom: '24px' }}>
                  Selfie Verification
                </h3>

                <div style={{
                  padding: '16px',
                  background: `${colors.status.info || colors.primary[400]}10`,
                  border: `1px solid ${colors.status.info || colors.primary[400]}30`,
                  borderRadius: '12px',
                  marginBottom: '24px',
                }}>
                  <p style={{ fontSize: '13px', color: colors.text.secondary, margin: 0, lineHeight: 1.6 }}>
                    Please take a clear selfie photo. Make sure your face is clearly visible and matches
                    the photo on your ID document.
                  </p>
                </div>

                <input
                  ref={selfieRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e) => handleFileUpload(e, setSelfieImage)}
                  style={{ display: 'none' }}
                />

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => selfieRef.current?.click()}
                  style={{
                    height: '300px',
                    border: `2px dashed ${selfieImage ? colors.status.success : colors.glass.border}`,
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: selfieImage
                      ? `url(${selfieImage}) center/cover`
                      : `${colors.primary[400]}05`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {!selfieImage && (
                    <>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `${colors.primary[400]}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                      }}>
                        <Camera size={36} color={colors.primary[400]} />
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 500, color: colors.text.primary }}>
                        Take a Selfie
                      </span>
                      <span style={{ fontSize: '13px', color: colors.text.tertiary, marginTop: '4px' }}>
                        Click to open camera or upload photo
                      </span>
                    </>
                  )}
                  {selfieImage && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: colors.status.success,
                      borderRadius: '50%',
                      padding: '6px',
                    }}>
                      <CheckCircle size={20} color="#fff" />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px',
            gap: '16px',
          }}>
            {currentStep > 1 && (
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
                style={{ flex: isMobile ? 1 : 'none' }}
              >
                <ChevronLeft size={18} />
                Previous
              </Button>
            )}

            <div style={{ flex: 1 }} />

            {currentStep < 4 ? (
              <Button
                variant="primary"
                disabled={!canProceed()}
                onClick={() => setCurrentStep(currentStep + 1)}
                style={{ flex: isMobile ? 1 : 'none' }}
              >
                Continue
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={!canProceed() || isSubmitting}
                onClick={handleSubmit}
                style={{ flex: isMobile ? 1 : 'none' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Submit Verification
                  </>
                )}
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </ResponsiveLayout>
  );
};

export default KYCScreen;
