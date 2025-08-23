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

const PrivacySettings = ({ navigation }: any) => {
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityVisibility, setActivityVisibility] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported and sent to your email address. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting data...') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => console.log('Deleting account...') 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MainHeader title="Privacy Settings" iconName="shield" showBackButton onBackPress={handleBack} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Profile Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Privacy</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="person" size={16} color="#2563EB" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Profile Visibility</Text>
                  <Text style={styles.settingDescription}>Allow others to see your profile</Text>
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
                  <Text style={styles.settingLabel}>Activity Visibility</Text>
                  <Text style={styles.settingDescription}>Show your learning progress to others</Text>
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
            <Text style={styles.sectionTitle}>Data Privacy</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="analytics" size={16} color="#10B981" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Data Sharing</Text>
                  <Text style={styles.settingDescription}>Share anonymous data for app improvement</Text>
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
                  <Text style={styles.settingLabel}>Location Sharing</Text>
                  <Text style={styles.settingDescription}>Allow location-based features</Text>
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
            <Text style={styles.sectionTitle}>Data Management</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleDataExport}>
              <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="download" size={16} color="#9333EA" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>Export My Data</Text>
                <Text style={styles.actionDescription}>Download all your data in JSON format</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleDeleteAccount}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="trash" size={16} color="#EF4444" />
              </View>
              <View style={styles.actionText}>
                <Text style={[styles.actionLabel, styles.dangerText]}>Delete Account</Text>
                <Text style={[styles.actionDescription, styles.dangerText]}>Permanently remove your account and data</Text>
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
