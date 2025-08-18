import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Profile</Text>
            <Text style={styles.subtitle}>Manage your account and preferences</Text>
          </View>

          <View style={styles.profileCard}>
            <Image
              source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Emma Wilson</Text>
              <Text style={styles.email}>emma.wilson@example.com</Text>
            </View>
            <Pressable style={styles.editBtn} android_ripple={{ color: '#e5e7eb' }}>
              <Ionicons name="pencil" size={16} color={PRIMARY} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {[
              { icon: 'notifications-outline', label: 'Notifications' },
              { icon: 'lock-closed-outline', label: 'Privacy & Security' },
              { icon: 'color-palette-outline', label: 'Appearance' },
            ].map((s, idx) => (
              <Pressable key={idx} style={styles.settingRow} android_ripple={{ color: '#f3f4f6' }}>
                <View style={styles.settingLeft}>
                  <Ionicons name={s.icon as any} size={18} color={PRIMARY} />
                  <Text style={styles.settingLabel}>{s.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </Pressable>
            ))}
          </View>

          <View style={styles.section}> 
            <Pressable style={styles.logoutBtn} android_ripple={{ color: '#fee2e2' }}>
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  subtitle: {
    marginTop: 4,
    color: TEXT_MUTED,
    fontSize: 13,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    color: TEXT_DARK,
    fontWeight: '800',
  },
  email: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  editBtn: {
    height: 36,
    width: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontWeight: '800',
    marginBottom: 8,
  },
  settingRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    color: TEXT_DARK,
    fontWeight: '700',
    marginLeft: 10,
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '800',
    marginLeft: 8,
  },
});

export default ProfileScreen;
