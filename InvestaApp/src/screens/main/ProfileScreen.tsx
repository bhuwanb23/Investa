import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainHeader, LanguageSelector } from '../../components';
import LogoLoader from '../../components/LogoLoader';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../hooks';
import { useTranslation } from '../../language';

const PRIMARY = '#4f46e5';
const PAGE_BG = '#f9fafb';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';

const ProfileScreen = () => {
  const [bootLoader, setBootLoader] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { logout, user } = useAuth();
  const navigation = useNavigation();
  const { t } = useTranslation(selectedLanguage);
  const { 
    profile, 
    isLoading, 
    isUpdating, 
    error, 
    fetchProfile, 
    updateProfile, 
    clearError 
  } = useProfile();

  const handleLogout = async () => {
    try {
      console.log('🔐 ProfileScreen: Logout button pressed (direct)');
      console.log('🔐 ProfileScreen: Current user state before logout:', user);
      await logout();
      console.log('🔐 ProfileScreen: logout() awaited and completed');
    } catch (error) {
      console.error('❌ ProfileScreen: Error during logout:', error);
    }
  };

  const handleSettingPress = (settingType: string) => {
    switch (settingType) {
      case 'notifications':
        (navigation as any).navigate('Notifications', { selectedLanguage });
        break;
      case 'privacy':
        (navigation as any).navigate('PrivacySettings', { selectedLanguage });
        break;
      case 'security':
        (navigation as any).navigate('SecuritySettings', { selectedLanguage });
        break;
      case 'twoFactor':
        (navigation as any).navigate('TwoFactorAuth', { selectedLanguage });
        break;
      default:
        console.log('Unknown setting type:', settingType);
    }
  };

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Here you would typically save the language preference to the backend
    console.log('Language selected:', languageCode);
  };

  // Fetch profile data on component mount only if user is authenticated
  useEffect(() => {
    const t = setTimeout(() => setBootLoader(false), 800);
    if (user) {
      console.log('🔐 ProfileScreen: User is authenticated, fetching profile...');
      fetchProfile();
    } else {
      console.log('🔐 ProfileScreen: User is not authenticated, skipping profile fetch');
    }
    return () => clearTimeout(t);
  }, [fetchProfile, user]);
  
  // Debug logging for development
  useEffect(() => {
    if (__DEV__) {
      console.log('🔐 ProfileScreen: Profile state:', { 
        hasProfile: !!profile, 
        isLoading, 
        error,
        profileKeys: profile ? Object.keys(profile) : 'N/A'
      });
    }
  }, [profile, isLoading, error]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleUpdateProfile = () => {
    Alert.alert(
      'Update Profile',
      'Profile update functionality will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const handleResetPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset functionality will be implemented here',
      [{ text: 'OK' }]
    );
  };

  // Boot splash
  if (bootLoader) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <LogoLoader message="Loading Investa..." fullscreen />
        </View>
      </SafeAreaView>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <MainHeader title={t.profile} iconName="person" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={styles.loadingText}>{t.loadingProfile}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <MainHeader title={t.profile} iconName="person" />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{t.pleaseLogin}</Text>
            <Pressable style={styles.retryButton} onPress={() => navigation.navigate('Login' as never)}>
              <Text style={styles.retryButtonText}>{t.goToLogin}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <MainHeader title={t.profile} iconName="person" />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={fetchProfile}>
              <Text style={styles.retryButtonText}>{t.retry}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={[styles.scrollContent, styles.fullWidth]} showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
          <MainHeader title={t.profile} iconName="person" />
          <View style={styles.pagePadding}>

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{ 
                    uri: profile?.avatar || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg' 
                  }}
                  style={styles.avatarXL}
                />
                <Pressable style={styles.cameraBtn} android_ripple={{ color: '#e5e7eb' }}>
                  <Ionicons name="camera" size={14} color={PRIMARY} />
                </Pressable>
              </View>
              <Text style={styles.profileName}>
                {profile?.user?.first_name && profile?.user?.last_name 
                  ? `${profile.user.first_name} ${profile.user.last_name}`
                  : profile?.user?.username || user?.username || 'User'
                }
              </Text>
              <View style={styles.levelPill}>
                <Ionicons name="star" size={14} color="#facc15" />
                <Text style={styles.levelPillText}>
                  {t.level} {profile?.level || 1} • {profile?.experience_points?.toLocaleString() || 0} {t.xp}
                </Text>
              </View>
            </View>
          </View>

          {/* Personal Details */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>{t.personalDetails}</Text>
              <Pressable android_ripple={{ color: '#e5e7eb' }}>
                <Text style={styles.link}>{t.edit}</Text>
              </Pressable>
            </View>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="mail" size={14} color={PRIMARY} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{t.email}</Text>
                <Text style={styles.detailValue}>{profile?.user?.email || user?.email || t.notSet}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="call" size={14} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{t.phone}</Text>
                <Text style={styles.detailValue}>{profile?.phone_number || t.notSet}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="globe" size={14} color="#a855f7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{t.language}</Text>
                <Text style={styles.detailValue}>
                  {profile?.preferred_language?.name || t.notSet}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="disc-outline" size={14} color="#f97316" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{t.learningGoal}</Text>
                <Text style={styles.detailValue}>{profile?.learning_goal || t.notSet}</Text>
              </View>
            </View>
          </View>

          {/* Learning Progress */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.learningProgress}</Text>
            <View style={{ marginTop: 8 }}>
              <View style={styles.progressHeaderRow}>
                <Text style={styles.progressTitle}>{t.modulesCompleted}</Text>
                <Text style={[styles.progressTitle, { color: PRIMARY }]}>73%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '73%' }]} />
              </View>
              <Text style={styles.smallMuted}>22 of 30 {t.modulesCompletedText}</Text>
            </View>
            <View style={styles.progressStatsRow}>
              <View style={styles.statBox}> 
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>{t.hoursLearned}</Text>
              </View>
              <View style={styles.statBox}> 
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>{t.certificates}</Text>
              </View>
            </View>
          </View>

          {/* Quiz Performance */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.quizPerformance}</Text>
            <View style={styles.quizTopRow}>
              <View>
                <Text style={[styles.quizScore, { color: '#10b981' }]}>87%</Text>
                <Text style={styles.quizScoreLabel}>{t.averageScore}</Text>
              </View>
              <View style={styles.quizIconsRow}>
                <View style={[styles.quizIconBox, { backgroundColor: '#FEF9C3' }]}>
                  <Ionicons name="trophy" size={14} color="#eab308" />
                </View>
                <View style={[styles.quizIconBox, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="medal" size={14} color="#3b82f6" />
                </View>
                <View style={[styles.quizIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="ribbon" size={14} color="#22c55e" />
                </View>
              </View>
            </View>
            <View style={styles.kpiGrid3}>
              <View style={styles.quizStat}> 
                <Text style={styles.quizStatValue}>45</Text>
                <Text style={styles.quizStatLabel}>{t.quizzesTaken}</Text>
              </View>
              <View style={styles.quizStat}> 
                <Text style={styles.quizStatValue}>38</Text>
                <Text style={styles.quizStatLabel}>{t.passed}</Text>
              </View>
              <View style={styles.quizStat}> 
                <Text style={styles.quizStatValue}>7</Text>
                <Text style={styles.quizStatLabel}>{t.badgesEarned}</Text>
              </View>
            </View>
          </View>

          {/* Trading Performance */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.tradingPerformance}</Text>
            <View style={styles.tradingRow}>
              <View>
                <Text style={styles.smallMuted}>{t.portfolioGrowth}</Text>
                <Text style={[styles.tradeGrowth, { color: '#10b981' }]}>+24.7%</Text>
              </View>
              <View style={styles.tradeIconBox}>
                <Ionicons name="trending-up" size={18} color="#10b981" />
              </View>
            </View>
            <View style={styles.progressStatsRow}>
              <View style={styles.statPill}> 
                <Text style={styles.statValue}>127</Text>
                <Text style={styles.statLabel}>{t.tradesExecuted}</Text>
              </View>
              <View style={styles.statPill}> 
                <Text style={styles.statValue}>78%</Text>
                <Text style={styles.statLabel}>{t.successRate}</Text>
              </View>
            </View>
          </View>

          {/* Settings */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t.settings}</Text>
            
            {/* Language Selection */}
            <View style={styles.languageSection}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="language" size={16} color="#f59e0b" />
                </View>
                <Text style={styles.settingLabel}>{t.language}</Text>
              </View>
            </View>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageSelect={handleLanguageSelect}
              currentLanguage={selectedLanguage}
              style={styles.languageSelector}
            />
            
            {[
              { label: t.notifications, iconBg: '#DBEAFE', iconColor: PRIMARY, icon: 'notifications', type: 'notifications' },
              { label: t.privacy, iconBg: '#F5F3FF', iconColor: '#a855f7', icon: 'shield', type: 'privacy' },
              { label: t.security, iconBg: '#FEE2E2', iconColor: '#ef4444', icon: 'lock-closed', type: 'security' },
            ].map((s, idx) => (
              <Pressable 
                key={idx} 
                style={styles.settingRow} 
                android_ripple={{ color: '#f3f4f6' }}
                onPress={() => handleSettingPress(s.type)}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconBox, { backgroundColor: s.iconBg }]}>
                    <Ionicons name={s.icon as any} size={16} color={s.iconColor as any} />
                  </View>
                  <Text style={styles.settingLabel}>{s.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </Pressable>
            ))}
            <Pressable 
              style={styles.settingRow} 
              android_ripple={{ color: '#f3f4f6' }}
              onPress={() => handleSettingPress('twoFactor')}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="key" size={16} color="#10b981" />
                </View>
                <Text style={styles.settingLabel}>{t.twoFactorAuth}</Text>
              </View>
              <View style={styles.toggleTrack}>
                <View style={styles.toggleThumb} />
              </View>
            </Pressable>
          </View>

          {/* Actions */}
          <View style={{ marginTop: 12, marginBottom: 20 }}>
            <Pressable 
              style={[styles.primaryBtn, isUpdating && styles.disabledBtn]} 
              android_ripple={{ color: '#4338ca' }} 
              onPress={handleUpdateProfile}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>{t.updateProfile}</Text>
              )}
            </Pressable>
            <Pressable style={styles.secondaryBtn} android_ripple={{ color: '#e5e7eb' }} onPress={handleResetPassword}>
              <Text style={styles.secondaryBtnText}>{t.resetPassword}</Text>
            </Pressable>
            <Pressable style={styles.logoutBtn} android_ripple={{ color: '#fee2e2' }} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>{t.logout}</Text>
            </Pressable>
          </View>
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
    paddingBottom: 24,
  },
  pagePadding: {
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
  profileHeader: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  avatarWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarXL: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -4,
    right: 112, // Centered avatar, offset bubble from edge visually
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 6,
    elevation: 2,
  },
  profileName: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 6,
  },
  levelPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  levelPillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontWeight: '800',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    color: TEXT_DARK,
    fontWeight: '800',
  },
  link: {
    color: PRIMARY,
    fontWeight: '700',
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  detailValue: {
    color: TEXT_DARK,
    fontWeight: '600',
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressTitle: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
  },
  progressFill: {
    height: 8,
    backgroundColor: PRIMARY,
    borderRadius: 999,
  },
  smallMuted: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 12,
  },
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statBox: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 10,
  },
  statPill: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 10,
  },
  statValue: {
    color: TEXT_DARK,
    fontWeight: '800',
  },
  statLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  quizTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quizScore: {
    fontSize: 20,
    fontWeight: '900',
  },
  quizScoreLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  quizIconsRow: {
    flexDirection: 'row',
  },
  quizIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  kpiGrid3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizStat: {
    width: '32%',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 10,
  },
  quizStatValue: {
    color: TEXT_DARK,
    fontWeight: '800',
  },
  quizStatLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  tradingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 10,
  },
  tradeGrowth: {
    fontWeight: '900',
    fontSize: 18,
  },
  tradeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  settingLabel: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
  toggleTrack: {
    width: 48,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#10b981',
    position: 'relative',
    padding: 2,
  },
  toggleThumb: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  primaryBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 10,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  secondaryBtnText: {
    color: '#374151',
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 10,
  },
  logoutBtnText: {
    color: '#ef4444',
    fontWeight: '800',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 16,
    color: TEXT_MUTED,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  languageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageSelector: {
    marginTop: 0,
  },
});

export default ProfileScreen;
