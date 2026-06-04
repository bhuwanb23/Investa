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
import MainHeader from './MainHeader';
import { useTranslation } from '../language';
import { privacyApi } from '../services';

const PrivacySettings = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityVisibility, setActivityVisibility] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const { t } = useTranslation();

  const loadSettings = useCallback(async () => {
    try {
      const response = await privacyApi.getSettings();
      if (response.success && response.data) {
        const s = response.data;
        setProfileVisibility(s.profile_visibility ?? true);
        setActivityVisibility(s.activity_visibility ?? false);
        setDataSharing(s.data_sharing ?? true);
        setLocationSharing(s.location_sharing ?? false);
      }
    } catch (err: any) {
      console.log('Could not load privacy settings:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSetting = useCallback(async (key: string, value: any) => {
    try {
      await privacyApi.updateSettings({ [key]: value });
    } catch (err: any) {
      console.log('Failed to save privacy setting:', err?.message);
    }
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDataExport = async () => {
    try {
      const response = await privacyApi.exportData();
      if (response.success && response.data) {
        const json = JSON.stringify(response.data, null, 2);
        console.log('Exported data:', json.substring(0, 200) + '...');
        Alert.alert(
          'Data Export',
          'Your data has been exported. Check the console for the full payload.',
          [{ text: 'OK' }]
        );
      }
    } catch (err: any) {
      Alert.alert(t.error, err?.message || 'Failed to export data');
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword) {
      Alert.alert(t.error, 'Password is required');
      return;
    }
    try {
      await privacyApi.deleteAccount(deletePassword);
      setShowDeleteModal(false);
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted.',
        [{ text: 'OK', onPress: () => navigation.navigate('Auth') }]
      );
    } catch (err: any) {
      const msg = err?.response?.data?.password?.[0] || err?.response?.data?.detail || err?.message || 'Failed to delete account';
      Alert.alert(t.error, msg);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <MainHeader title={t.title} iconName="shield" showBackButton onBackPress={handleBack} />
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MainHeader title={t.title} iconName="shield" showBackButton onBackPress={handleBack} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Profile Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profilePrivacy}</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="person" size={16} color="#2563EB" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t.profileVisibility}</Text>
                  <Text style={styles.settingDescription}>{t.profileVisibilityDescription}</Text>
                </View>
              </View>
              <Switch
                value={profileVisibility}
                onValueChange={(val) => { setProfileVisibility(val); saveSetting('profile_visibility', val); }}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={profileVisibility ? '#2563EB' : '#9CA3AF'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="trending-up" size={16} color="#D97706" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t.activityVisibility}</Text>
                  <Text style={styles.settingDescription}>{t.activityVisibilityDescription}</Text>
                </View>
              </View>
              <Switch
                value={activityVisibility}
                onValueChange={(val) => { setActivityVisibility(val); saveSetting('activity_visibility', val); }}
                trackColor={{ false: '#E5E7EB', true: '#FEF3C7' }}
                thumbColor={activityVisibility ? '#D97706' : '#9CA3AF'}
              />
            </View>
          </View>

          {/* Data Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.dataPrivacy}</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="analytics" size={16} color="#10B981" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t.dataSharing}</Text>
                  <Text style={styles.settingDescription}>{t.dataSharingDescription}</Text>
                </View>
              </View>
              <Switch
                value={dataSharing}
                onValueChange={(val) => { setDataSharing(val); saveSetting('data_sharing', val); }}
                trackColor={{ false: '#E5E7EB', true: '#DCFCE7' }}
                thumbColor={dataSharing ? '#10B981' : '#9CA3AF'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="location" size={16} color="#EF4444" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{t.locationSharing}</Text>
                  <Text style={styles.settingDescription}>{t.locationSharingDescription}</Text>
                </View>
              </View>
              <Switch
                value={locationSharing}
                onValueChange={(val) => { setLocationSharing(val); saveSetting('location_sharing', val); }}
                trackColor={{ false: '#E5E7EB', true: '#FEE2E2' }}
                thumbColor={locationSharing ? '#EF4444' : '#9CA3AF'}
              />
            </View>
          </View>

          {/* Data Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.dataManagement}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleDataExport}>
              <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="download" size={16} color="#9333EA" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>{t.exportMyData}</Text>
                <Text style={styles.actionDescription}>{t.exportMyDataDescription}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.accountActions}</Text>
            <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleDeleteAccount}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="trash" size={16} color="#EF4444" />
              </View>
              <View style={styles.actionText}>
                <Text style={[styles.actionLabel, styles.dangerText]}>{t.deleteAccount}</Text>
                <Text style={[styles.actionDescription, styles.dangerText]}>{t.deleteAccountDescription}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { setShowDeleteModal(false); setDeletePassword(''); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.deleteAccount}</Text>
              <TouchableOpacity onPress={() => { setShowDeleteModal(false); setDeletePassword(''); }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.deleteWarning}>
              This action is permanent and cannot be undone. All your data will be deleted.
            </Text>

            <Text style={styles.inputLabel}>Enter your password to confirm</Text>
            <TextInput
              style={styles.passwordInput}
              value={deletePassword}
              onChangeText={setDeletePassword}
              placeholder="Enter your password"
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => { setShowDeleteModal(false); setDeletePassword(''); }}
              >
                <Text style={styles.secondaryButtonText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dangerModalButton, !deletePassword ? styles.disabledButton : null]}
                onPress={confirmDeleteAccount}
                disabled={!deletePassword}
              >
                <Text style={styles.dangerButtonText}>Delete Forever</Text>
              </TouchableOpacity>
            </View>
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
  dangerText: {
    color: '#EF4444',
  },
  dangerButton: {
    borderColor: '#FEE2E2',
  },
  dangerModalButton: {
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
  deleteWarning: {
    fontSize: 14,
    color: '#EF4444',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
  modalActions: {
    flexDirection: 'row',
    gap: 12,
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
});

export default PrivacySettings;
