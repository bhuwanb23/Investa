import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import { useProfile } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supportedLanguages } from '../../language';

type Navigation = StackNavigationProp<MainStackParamList>;

const PRIMARY = '#4f46e5';
const TEXT_DARK = '#111827';
const TEXT_MUTED = '#6b7280';
const PAGE_BG = '#f9fafb';

const EditProfileScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { user, checkAuthStatus } = useAuth();
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const {
    profile: profileFromHook,
    fetchProfile,
    updateProfile,
    fetchLanguages,
    languages,
    isUpdating,
  } = useProfile();

  const profile = profileFromHook || (user?.profile as any) || null;

  const [phone, setPhone] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  useEffect(() => {
    fetchLanguages();
    if (!profileFromHook) fetchProfile();
  }, [fetchLanguages, fetchProfile, profileFromHook]);

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone_number || '');
      setLearningGoal(profile.learning_goal || '');
      if (profile.risk_profile) setRiskProfile(profile.risk_profile);
      if (profile.investment_experience) setExperience(profile.investment_experience);
    }
  }, [profile]);

  const languageIdForCode = (code: string): number | undefined => {
    const match = languages.find((l) => l.code === code);
    return match?.id;
  };

  const handleSave = async () => {
    const languageId = languageIdForCode(selectedLanguage);
    const ok = await updateProfile({
      phone_number: phone.trim() || undefined,
      preferred_language: languageId,
      learning_goal: learningGoal.trim() || undefined,
      risk_profile: riskProfile,
      investment_experience: experience,
    });
    if (ok) {
      await checkAuthStatus();
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerBack} android_ripple={{ color: '#eee' }}>
            <Text style={styles.headerBackText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Preferred Language</Text>
            <View style={styles.languageRow}>
              {supportedLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <Pressable
                    key={lang.code}
                    onPress={() => setSelectedLanguage(lang.code)}
                    style={[styles.langChip, isSelected && styles.langChipActive]}
                    android_ripple={{ color: '#e5e7eb' }}
                  >
                    <Text style={[styles.langChipText, isSelected && styles.langChipTextActive]}>
                      {lang.nativeName}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Risk Profile</Text>
            <View style={styles.optionRow}>
              {(['conservative', 'moderate', 'aggressive'] as const).map((r) => {
                const isActive = riskProfile === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() => setRiskProfile(r)}
                    style={[styles.option, isActive && styles.optionActive]}
                    android_ripple={{ color: '#e5e7eb' }}
                  >
                    <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Investment Experience</Text>
            <View style={styles.optionRow}>
              {(['beginner', 'intermediate', 'advanced'] as const).map((e) => {
                const isActive = experience === e;
                return (
                  <Pressable
                    key={e}
                    onPress={() => setExperience(e)}
                    style={[styles.option, isActive && styles.optionActive]}
                    android_ripple={{ color: '#e5e7eb' }}
                  >
                    <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                      {e.charAt(0).toUpperCase() + e.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Learning Goal</Text>
            <TextInput
              style={[styles.input, { height: 92, textAlignVertical: 'top' }]}
              value={learningGoal}
              onChangeText={setLearningGoal}
              placeholder="e.g., Advanced Trading Strategies"
              placeholderTextColor="#9ca3af"
              multiline
            />

            <Pressable
              onPress={handleSave}
              disabled={isUpdating}
              style={({ pressed }) => [
                styles.saveBtn,
                pressed && { opacity: 0.9 },
                isUpdating && { opacity: 0.6 },
              ]}
            >
              {isUpdating ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.saveText}>Saving...</Text>
                </View>
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PAGE_BG },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackText: { fontSize: 18, color: '#374151' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: TEXT_DARK },
  scroll: { padding: 16, paddingBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 3 },
  label: { marginTop: 12, marginBottom: 6, color: '#374151', fontWeight: '700', fontSize: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#111827',
  },
  languageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  langChipActive: { backgroundColor: '#EEF2FF', borderColor: PRIMARY },
  langChipText: { color: '#374151', fontWeight: '600' },
  langChipTextActive: { color: PRIMARY },
  optionRow: { flexDirection: 'row', gap: 8 },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  optionActive: { backgroundColor: '#EEF2FF', borderColor: PRIMARY },
  optionText: { color: '#374151', fontWeight: '600', fontSize: 12 },
  optionTextActive: { color: PRIMARY },
  saveBtn: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  saveText: { color: '#fff', fontWeight: '800' },
});

export default EditProfileScreen;
