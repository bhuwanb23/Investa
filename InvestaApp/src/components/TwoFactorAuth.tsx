import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from './MainHeader';
import { useTranslation } from '../language';

const TwoFactorAuth = ({ navigation, route }: any) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('alex.johnson@email.com');
  
  // Get language from navigation params, fallback to 'en'
  const selectedLanguage = route?.params?.selectedLanguage || 'en';
  const { t } = useTranslation(selectedLanguage);
  
  // Debug log to verify language is being passed correctly
  console.log('TwoFactorAuth - Selected Language:', selectedLanguage);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggle2FA = () => {
    if (!isEnabled) {
      setShowSetupModal(true);
    } else {
      Alert.alert(
        t.disable2FA,
        t.disable2FAMessage,
        [
          { text: t.cancel, style: 'cancel' },
          { 
            text: t.disable, 
            style: 'destructive',
            onPress: () => {
              setIsEnabled(false);
              setBackupCodes([]);
            }
          }
        ]
      );
    }
  };

  const handleSetup2FA = () => {
    if (verificationCode.length === 6) {
      // Generate backup codes
      const codes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
      setIsEnabled(true);
      setShowSetupModal(false);
      setVerificationCode('');
      setShowBackupCodes(true);
    } else {
      Alert.alert(t.error, t.invalidCode);
    }
  };

  const handleResendCode = () => {
    Alert.alert(t.codeSent, t.codeSentMessage);
  };

  const handleUpdateRecoveryEmail = () => {
    Alert.alert(
      t.updateRecoveryEmail,
      t.updateRecoveryEmailMessage,
      [
        { text: t.cancel, style: 'cancel' },
        { 
          text: t.updateButton, 
          onPress: () => console.log('Updating recovery email...')
        }
      ]
    );
  };

  const handleDownloadBackupCodes = () => {
    Alert.alert(
      t.downloadBackupCodesTitle,
      t.downloadBackupCodesMessage,
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.download, onPress: () => console.log('Downloading backup codes...') }
      ]
    );
  };

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
                    {isEnabled 
                      ? t.enabledDescription
                      : t.disabledDescription
                    }
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
                  <Text style={styles.settingDescription}>{recoveryEmail}</Text>
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
              
              <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadBackupCodes}>
                <Ionicons name="download" size={16} color="#6B7280" />
                <Text style={styles.secondaryButtonText}>{t.downloadBackupCodes}</Text>
              </TouchableOpacity>
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
            
            <View style={styles.qrSection}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={64} color="#9CA3AF" />
                <Text style={styles.qrText}>{t.qrCodePlaceholder}</Text>
                <Text style={styles.qrDescription}>{t.qrCodeDescription}</Text>
              </View>
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
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleResendCode}>
                <Text style={styles.secondaryButtonText}>{t.resendCode}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.primaryButton, !verificationCode || verificationCode.length !== 6 ? styles.disabledButton : null]} 
                onPress={handleSetup2FA}
                disabled={!verificationCode || verificationCode.length !== 6}
              >
                <Text style={styles.primaryButtonText}>{t.enable2FA}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    gap: 8,
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
