import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import MainHeader from './MainHeader';
import { useTranslation } from '../language';
import { securityApi } from '../services';

const TwoFactorAuth = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [setupData, setSetupData] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [setupStep, setSetupStep] = useState<'qr' | 'codes'>('qr');
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const { t } = useTranslation();

  const loadSettings = useCallback(async () => {
    try {
      const response = await securityApi.getSettings();
      if (response.success && response.data) {
        setIsEnabled(response.data.two_factor_enabled ?? false);
        setRecoveryEmail(response.data.recovery_email ?? '');
      }
    } catch (err: any) {
      // Could not load 2FA settings
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggle2FA = () => {
    if (!isEnabled) {
      handleSetup2FA();
    } else {
      setShowDisableModal(true);
    }
  };

  const handleSetup2FA = async () => {
    try {
      setSetupStep('qr');
      setVerificationCode('');
      const response = await securityApi.setup2FA();
      if (response.success && response.data) {
        setSetupData(response.data);
        setShowSetupModal(true);
      }
    } catch (err: any) {
      Alert.alert(t.error, err?.message || 'Failed to start 2FA setup');
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert(t.error, t.invalidCode);
      return;
    }
    try {
      const response = await securityApi.verify2FA(verificationCode);
      if (response.success && response.data?.two_factor_enabled) {
        setIsEnabled(true);
        setSetupStep('codes');
        if (setupData?.backup_codes) {
          setBackupCodes(setupData.backup_codes);
        }
        setShowBackupCodes(true);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.code?.[0] || err?.response?.data?.detail || err?.message || 'Invalid code';
      Alert.alert(t.error, msg);
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) {
      Alert.alert(t.error, 'Password is required');
      return;
    }
    try {
      const response = await securityApi.disable2FA(disablePassword);
      if (response.success) {
        setIsEnabled(false);
        setBackupCodes([]);
        setShowDisableModal(false);
        setDisablePassword('');
        Alert.alert(t.success, '2FA disabled successfully');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.password?.[0] || err?.response?.data?.detail || err?.message || 'Failed to disable 2FA';
      Alert.alert(t.error, msg);
    }
  };

  const handleUpdateRecoveryEmail = () => {
    Alert.prompt
      ? Alert.prompt('Update Recovery Email', 'Enter new recovery email:', [
          { text: t.cancel, style: 'cancel' },
          { text: 'Save', onPress: async (email?: string) => {
            if (email) {
              try {
                await securityApi.updateSettings({ recovery_email: email });
                setRecoveryEmail(email);
                Alert.alert(t.success, 'Recovery email updated');
              } catch (err: any) {
                Alert.alert(t.error, err?.message || 'Failed to update');
              }
            }
          }}
        ])
      : Alert.alert('Update Recovery Email', 'Use the settings screen to update your email.');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <MainHeader title={t.title} iconName="key" showBackButton onBackPress={handleBack} />
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MainHeader title={t.title} iconName="key" showBackButton onBackPress={handleBack} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 2FA Status */}
          <View style={styles.section}>
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View style={[styles.statusIcon, { backgroundColor: isEnabled ? '#DCFCE7' : '#FEE2E2' }]}>
                  <Ionicons
                    name={isEnabled ? 'shield-checkmark' : 'shield-outline'}
                    size={24}
                    color={isEnabled ? '#10B981' : '#EF4444'}
                  />
                </View>
                <View style={styles.statusText}>
                  <Text style={styles.statusTitle}>
                    {isEnabled ? t.enabled : t.disabled}
                  </Text>
                  <Text style={styles.statusDescription}>
                    {isEnabled ? t.enabledDescription : t.disabledDescription}
                  </Text>
                </View>
              </View>
              <Switch
                value={isEnabled}
                onValueChange={handleToggle2FA}
                trackColor={{ false: '#E5E7EB', true: '#DCFCE7' }}
                thumbColor={isEnabled ? '#10B981' : '#9CA3AF'}
              />
            </View>
          </View>

          {/* Setup Instructions */}
          {!isEnabled && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.howItWorks}</Text>
              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={[styles.stepNumberText, { color: '#2563EB' }]}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{t.step1Title}</Text>
                  <Text style={styles.stepDescription}>
                    {t.step1Description}
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.stepNumberText, { color: '#D97706' }]}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{t.step2Title}</Text>
                  <Text style={styles.stepDescription}>
                    {t.step2Description}
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.stepNumberText, { color: '#10B981' }]}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{t.step3Title}</Text>
                  <Text style={styles.stepDescription}>
                    {t.step3Description}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Recovery Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.recoveryOptions}</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="mail" size={16} color="#9333EA" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t.recoveryEmail}</Text>
                  <Text style={styles.settingDescription}>{recoveryEmail || 'Not set'}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleUpdateRecoveryEmail}>
                <Text style={styles.linkText}>{t.update}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Backup Codes */}
          {isEnabled && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.backupCodes}</Text>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="key" size={16} color="#D97706" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>{t.backupCodes}</Text>
                    <Text style={styles.settingDescription}>{t.backupCodesDescription}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setShowBackupCodes(true)}>
                  <Text style={styles.linkText}>{t.view}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Setup Modal */}
      <Modal
        visible={showSetupModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSetupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.setupTitle}</Text>
              <TouchableOpacity onPress={() => setShowSetupModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {setupStep === 'qr' && (
              <>
                <View style={styles.qrSection}>
                  {setupData?.uri ? (
                    <QRCode
                      value={setupData.uri}
                      size={200}
                      backgroundColor="#FFFFFF"
                      color="#111827"
                    />
                  ) : (
                    <View style={styles.qrPlaceholder}>
                      <Ionicons name="qr-code" size={64} color="#9CA3AF" />
                      <Text style={styles.qrText}>Generating QR...</Text>
                    </View>
                  )}
                  <Text style={styles.qrDescription}>
                    {t.qrCodeDescription}
                  </Text>
                  {setupData?.secret && (
                    <Text style={styles.secretText}>
                      Secret: {setupData.secret}
                    </Text>
                  )}
                </View>

                <View style={styles.verificationSection}>
                  <Text style={styles.verificationLabel}>{t.enterVerificationCode}</Text>
                  <TextInput
                    style={styles.verificationInput}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="000000"
                    keyboardType="numeric"
                    maxLength={6}
                    textAlign="center"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, verificationCode.length !== 6 ? styles.disabledButton : null]}
                  onPress={handleVerify2FA}
                  disabled={verificationCode.length !== 6}
                >
                  <Text style={styles.primaryButtonText}>{t.enable2FA}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Disable 2FA Modal */}
      <Modal
        visible={showDisableModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDisableModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.disable2FA}</Text>
              <TouchableOpacity onPress={() => { setShowDisableModal(false); setDisablePassword(''); }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.backupDescription}>
              Enter your password to disable two-factor authentication.
            </Text>

            <TextInput
              style={styles.passwordInput}
              value={disablePassword}
              onChangeText={setDisablePassword}
              placeholder="Enter your password"
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => { setShowDisableModal(false); setDisablePassword(''); }}
              >
                <Text style={styles.secondaryButtonText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dangerButton, !disablePassword ? styles.disabledButton : null]}
                onPress={handleDisable2FA}
                disabled={!disablePassword}
              >
                <Text style={styles.dangerButtonText}>Disable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Backup Codes Modal */}
      <Modal
        visible={showBackupCodes}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBackupCodes(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.backupCodesTitle}</Text>
              <TouchableOpacity onPress={() => setShowBackupCodes(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.backupDescription}>
              {t.backupCodesModalDescription}
            </Text>

            <View style={styles.codesGrid}>
              {backupCodes.map((code, index) => (
                <View key={index} style={styles.codeItem}>
                  <Text style={styles.codeText}>{code}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setShowBackupCodes(false)}>
              <Text style={styles.primaryButtonText}>{t.savedCodes}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  linkText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  dangerButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 4,
  },
  qrDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
  secretText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  verificationSection: {
    marginBottom: 20,
  },
  verificationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  verificationInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#FFFFFF',
    letterSpacing: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  backupDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  codesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  codeItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'monospace',
  },
});

export default TwoFactorAuth;
