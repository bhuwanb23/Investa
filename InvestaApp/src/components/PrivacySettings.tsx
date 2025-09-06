import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from './MainHeader';
import { useTranslation } from '../language';

const PrivacySettings = ({ navigation, route }: any) => {
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityVisibility, setActivityVisibility] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  
  // Get language from navigation params, fallback to 'en'
  const selectedLanguage = route?.params?.selectedLanguage || 'en';
  const { t } = useTranslation(selectedLanguage);
  
  // Debug log to verify language is being passed correctly
  console.log('PrivacySettings - Selected Language:', selectedLanguage);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDataExport = () => {
    Alert.alert(
      t.exportData,
      t.exportDataMessage,
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.export, onPress: () => console.log('Exporting data...') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t.deleteAccountTitle,
      t.deleteAccountMessage,
      [
        { text: t.cancel, style: 'cancel' },
        { 
          text: t.delete, 
          style: 'destructive',
          onPress: () => console.log('Deleting account...') 
        }
      ]
    );
  };

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
                onValueChange={setProfileVisibility}
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
                onValueChange={setActivityVisibility}
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
                onValueChange={setDataSharing}
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
                onValueChange={setLocationSharing}
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

export default PrivacySettings;
