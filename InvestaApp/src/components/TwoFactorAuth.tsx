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

const TwoFactorAuth = ({ navigation }: any) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('alex.johnson@email.com');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggle2FA = () => {
    if (!isEnabled) {
      setShowSetupModal(true);
    } else {
      Alert.alert(
        'Disable 2FA',
        'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
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
      Alert.alert('Error', 'Please enter a valid 6-digit verification code');
    }
  };

  const handleResendCode = () => {
    Alert.alert('Code Sent', 'A new verification code has been sent to your email');
  };

  const handleUpdateRecoveryEmail = () => {
    Alert.alert(
      'Update Recovery Email',
      'Enter your new recovery email address',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: () => console.log('Updating recovery email...')
        }
      ]
    );
  };

  const handleDownloadBackupCodes = () => {
    Alert.alert(
      'Download Backup Codes',
      'Backup codes will be downloaded as a text file. Keep them in a safe place.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => console.log('Downloading backup codes...') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader title="Two-Factor Authentication" iconName="key" showBackButton onBackPress={handleBack} />
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
                    {isEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled'}
                  </Text>
                  <Text style={styles.statusDescription}>
                    {isEnabled 
                      ? 'Your account is protected with an additional layer of security'
                      : 'Enable 2FA to add an extra layer of security to your account'
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
              <Text style={styles.sectionTitle}>How It Works</Text>
              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={[styles.stepNumberText, { color: '#2563EB' }]}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Download an Authenticator App</Text>
                  <Text style={styles.stepDescription}>
                    Use apps like Google Authenticator, Authy, or Microsoft Authenticator
                  </Text>
                </View>
              </View>
              
              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.stepNumberText, { color: '#D97706' }]}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Scan QR Code</Text>
                  <Text style={styles.stepDescription}>
                    Scan the QR code with your authenticator app to link it
                  </Text>
                </View>
              </View>
              
              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.stepNumberText, { color: '#10B981' }]}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Enter Verification Code</Text>
                  <Text style={styles.stepDescription}>
                    Enter the 6-digit code from your authenticator app
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Recovery Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recovery Options</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="mail" size={16} color="#9333EA" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Recovery Email</Text>
                  <Text style={styles.settingDescription}>{recoveryEmail}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleUpdateRecoveryEmail}>
                <Text style={styles.linkText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Backup Codes */}
          {isEnabled && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Backup Codes</Text>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="key" size={16} color="#D97706" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Backup Codes</Text>
                    <Text style={styles.settingDescription}>Use these codes if you lose access to your authenticator</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setShowBackupCodes(true)}>
                  <Text style={styles.linkText}>View</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadBackupCodes}>
                <Ionicons name="download" size={16} color="#6B7280" />
                <Text style={styles.secondaryButtonText}>Download Backup Codes</Text>
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
              <Text style={styles.modalTitle}>Setup Two-Factor Authentication</Text>
              <TouchableOpacity onPress={() => setShowSetupModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.qrSection}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={64} color="#9CA3AF" />
                <Text style={styles.qrText}>QR Code Placeholder</Text>
                <Text style={styles.qrDescription}>Scan this with your authenticator app</Text>
              </View>
            </View>
            
            <View style={styles.verificationSection}>
              <Text style={styles.verificationLabel}>Enter 6-digit verification code</Text>
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
                <Text style={styles.secondaryButtonText}>Resend Code</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.primaryButton, !verificationCode || verificationCode.length !== 6 ? styles.disabledButton : null]} 
                onPress={handleSetup2FA}
                disabled={!verificationCode || verificationCode.length !== 6}
              >
                <Text style={styles.primaryButtonText}>Enable 2FA</Text>
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
              <Text style={styles.modalTitle}>Backup Codes</Text>
              <TouchableOpacity onPress={() => setShowBackupCodes(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.backupDescription}>
              Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
            </Text>
            
            <View style={styles.codesGrid}>
              {backupCodes.map((code, index) => (
                <View key={index} style={styles.codeItem}>
                  <Text style={styles.codeText}>{code}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={styles.primaryButton} onPress={() => setShowBackupCodes(false)}>
              <Text style={styles.primaryButtonText}>I've Saved These Codes</Text>
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
