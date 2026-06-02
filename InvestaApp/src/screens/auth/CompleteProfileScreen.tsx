import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList, MainStackParamList } from '../../navigation/AppNavigator';
import { useProfile } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supportedLanguages } from '../../language';

type Navigation = StackNavigationProp<AuthStackParamList & MainStackParamList>;

const CompleteProfileScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { completeProfile, fetchLanguages, languages, isUpdating } = useProfile();
  const { user, checkAuthStatus } = useAuth();
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('');
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    if (user?.first_name) setFullName(user.first_name + (user.last_name ? ' ' + user.last_name : ''));
    const bundleProfile: any = user?.profile;
    if (bundleProfile?.phone_number) setPhone(bundleProfile.phone_number);
    if (bundleProfile?.learning_goal) setGoal(bundleProfile.learning_goal);
  }, [user]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const languageIdForCode = (code: string): number | undefined => {
    const match = languages.find((l) => l.code === code);
    return match?.id;
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
  };

  const onSave = async () => {
    if (!fullName.trim() || !phone.trim() || !goal.trim() || !dateOfBirth.trim()) {
      Alert.alert('Missing information', 'Please fill in your name, phone, learning goal, and date of birth.');
      return;
    }

    const languageId = languageIdForCode(selectedLanguage);
    if (!languageId) {
      Alert.alert('Language not loaded', 'Please wait a moment for languages to load, then try again.');
      return;
    }

    const ok = await completeProfile({
      phone_number: phone.trim(),
      preferred_language: languageId,
      learning_goal: goal.trim(),
      risk_profile: riskProfile,
      investment_experience: experience,
      date_of_birth: dateOfBirth.trim(),
    });

    if (ok) {
      await checkAuthStatus();
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] } as never);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Tell us a bit more so we can personalize your experience.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="1990-01-15"
            placeholderTextColor="#9ca3af"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />

          <Text style={styles.label}>Preferred Language</Text>
          <View style={styles.languageRow}>
            {supportedLanguages.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => handleLanguageChange(lang.code)}
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
            value={goal}
            onChangeText={setGoal}
            placeholder="e.g., Advanced Trading Strategies"
            placeholderTextColor="#9ca3af"
            multiline
          />

          <Pressable
            onPress={onSave}
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
              <Text style={styles.saveText}>Save and Continue</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { padding: 16, paddingBottom: 24 },
  title: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 6 },
  subtitle: { color: '#6B7280', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 3 },
  label: { marginTop: 10, marginBottom: 6, color: '#374151', fontWeight: '700', fontSize: 12 },
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
  langChipActive: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
  langChipText: { color: '#374151', fontWeight: '600' },
  langChipTextActive: { color: '#4F46E5' },
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
  optionActive: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
  optionText: { color: '#374151', fontWeight: '600', fontSize: 12 },
  optionTextActive: { color: '#4F46E5' },
  saveBtn: {
    marginTop: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  saveText: { color: '#fff', fontWeight: '800' },
});

export default CompleteProfileScreen;
