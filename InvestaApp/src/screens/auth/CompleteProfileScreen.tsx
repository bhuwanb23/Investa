import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList, MainStackParamList } from '../../navigation/AppNavigator';

type Navigation = StackNavigationProp<AuthStackParamList & MainStackParamList>;

const CompleteProfileScreen: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('English (US)');
  const [goal, setGoal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSave = async () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigation.navigate('Home');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safe}> 
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Tell us a bit more so we can personalize your experience.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Your full name" placeholderTextColor="#9ca3af" />

          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+1 (555) 000-0000" placeholderTextColor="#9ca3af" keyboardType="phone-pad" />

          <Text style={styles.label}>Preferred Language</Text>
          <TextInput style={styles.input} value={language} onChangeText={setLanguage} placeholder="Language" placeholderTextColor="#9ca3af" />

          <Text style={styles.label}>Learning Goal</Text>
          <TextInput style={[styles.input, { height: 92, textAlignVertical: 'top' }]} value={goal} onChangeText={setGoal} placeholder="e.g., Advanced Trading Strategies" placeholderTextColor="#9ca3af" multiline />

          <Pressable onPress={onSave} disabled={submitting} style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.9 }, submitting && { opacity: 0.6 }]}>
            {submitting ? (
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
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: '#111827' },
  saveBtn: { marginTop: 16, backgroundColor: '#4F46E5', borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  saveText: { color: '#fff', fontWeight: '800' },
});

export default CompleteProfileScreen;


