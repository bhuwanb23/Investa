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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from './MainHeader';
import { useTranslation } from '../language';
import { securityApi, authApi } from '../services';

const SecuritySettings = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [suspiciousActivity, setSuspiciousActivity] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { t } = useTranslation();

  const loadSettings = useCallback(async () => {
    try {
      const response = await securityApi.getSettings();
      if (response.success && response.data) {
        const s = response.data;
        setBiometricEnabled(s.biometric_enabled ?? true);
        setSessionTimeout(String(s.session_timeout ?? 30));
        setLoginNotifications(s.login_notifications ?? true);
        setSuspiciousActivity(s.suspicious_activity_alerts ?? true);
      }
    } catch (err: any) {
      // Could not load security settings
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSetting = useCallback(async (key: string, value: any) => {
    try {
      await securityApi.updateSettings({ [key]: value });
    } catch (err: any) {
      // Failed to save setting
    }
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t.error, t.passwordsDoNotMatch);
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert(t.error, t.passwordTooShort);
      return;
    }
    try {
      await securityApi.changePassword(currentPassword, newPassword);
      Alert.alert(t.success, t.passwordChangedSuccessfully, [
        { text: t.ok, onPress: () => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); } }
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.old_password?.[0] || err?.response?.data?.new_password?.[0] || err?.message || 'An error occurred';
      Alert.alert(t.error, msg);
    }
  };

  const handleSessionTimeoutChange = (value: string) => {
    const numValue = parseInt(value);
    if (numValue >= 5 && numValue <= 120) {
      setSessionTimeout(value);
      saveSetting('session_timeout', numValue);
    }
  };

  const handleLogoutAllDevices = () => {
    Alert.alert(
      t.logoutAllDevicesTitle,
      t.logoutAllDevicesMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.logoutAll,
          style: 'destructive',
          onPress: async () => {
            try {
              await securityApi.logoutAllDevices();
              Alert.alert(t.success, 'Logged out from all other devices');
            } catch (err: any) {
              Alert.alert(t.error, err?.message || 'Failed to logout all devices');
            }
          }
        }
      ]
    );
  };

  const handleViewActiveSessions = () => {
    // TODO: navigate to active sessions screen
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <MainHeader title={t.title} iconName="lock-closed" showBackButton onBackPress={handleBack} />
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MainHeader title={t.title} iconName="lock-closed" showBackButton onBackPress={handleBack} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Authentication */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.authentication}</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="finger-print" size={16} color="#10B981" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t.biometricLogin}</Text>
                  <Text style={styles.settingDescription}>{t.biometricLoginDescription}</Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={(val) => { setBiometricEnabled(val); saveSetting('biometric_enabled', val); }}
                trackColor={{ false: '#E5E7EB', true: '#DCFCE7' }}
                thumbColor={biometricEnabled ? '#10B981' : '#9CA3AF'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="time" size={16} color="#D97706" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t.sessionTimeout}</Text>
                  <Text style={styles.settingDescription}>{t.sessionTimeoutDescription}</Text>
                </View>
              </View>
              <TextInput
                style={styles.timeoutInput}
                value={sessionTimeout}
                onChangeText={handleSessionTimeoutChange}
                keyboardType="numeric"
                maxLength={3}
                placeholder="30"
              />
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.securityNotifications}</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="log-in" size={16} color="#2563EB" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t.loginNotifications}</Text>
                  <Text style={styles.settingDescription}>{t.loginNotificationsDescription}</Text>
                </View>
              </View>
              <Switch
                value={loginNotifications}
                onValueChange={(val) => { setLoginNotifications(val); saveSetting('login_notifications', val); }}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={loginNotifications ? '#2563EB' : '#9CA3AF'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="warning" size={16} color="#EF4444" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t.suspiciousActivity}</Text>
                  <Text style={styles.settingDescription}>{t.suspiciousActivityDescription}</Text>
                </View>
              </View>
              <Switch
                value={suspiciousActivity}
                onValueChange={(val) => { setSuspiciousActivity(val); saveSetting('suspicious_activity_alerts', val); }}
                trackColor={{ false: '#E5E7EB', true: '#FEE2E2' }}
                thumbColor={suspiciousActivity ? '#EF4444' : '#9CA3AF'}
              />
            </View>
          </View>

          {/* Change Password */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.changePassword}</Text>
            <View style={styles.passwordInput}>
              <Text style={styles.inputLabel}>{t.currentPassword}</Text>
              <TextInput
                style={styles.textInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder={t.enterCurrentPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.passwordInput}>
              <Text style={styles.inputLabel}>{t.newPassword}</Text>
              <TextInput
                style={styles.textInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder={t.enterNewPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.passwordInput}>
              <Text style={styles.inputLabel}>{t.confirmNewPassword}</Text>
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t.confirmNewPasswordPlaceholder}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleChangePassword}>
              <Text style={styles.primaryButtonText}>{t.changePasswordButton}</Text>
            </TouchableOpacity>
          </View>

          {/* Device Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.deviceManagement}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleViewActiveSessions}>
              <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="phone-portrait" size={16} color="#9333EA" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>{t.activeSessions}</Text>
                <Text style={styles.actionDescription}>{t.activeSessionsDescription}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleLogoutAllDevices}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="log-out" size={16} color="#EF4444" />
              </View>
              <View style={styles.actionText}>
                <Text style={[styles.actionLabel, styles.dangerText]}>{t.logoutAllDevices}</Text>
                <Text style={[styles.actionDescription, styles.dangerText]}>{t.logoutAllDevicesDescription}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
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
  timeoutInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  passwordInput: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  dangerButton: {
    borderColor: '#FEE2E2',
  },
  dangerText: {
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SecuritySettings;
