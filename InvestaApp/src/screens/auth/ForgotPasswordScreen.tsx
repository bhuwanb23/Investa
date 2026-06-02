import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import authApi from '../../services/authApi';

type Step = 'email' | 'reset';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.requestPasswordReset(email.trim());
      setSubmittedEmail(email.trim());
      if (response.data?.reset_token) {
        setResetToken(response.data.reset_token);
      }
      setStep('reset');
    } catch (err: any) {
      const message = err?.message || 'Something went wrong. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async () => {
    if (!resetToken.trim()) {
      Alert.alert('Error', 'Please paste the reset token you received');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.confirmPasswordReset({
        token: resetToken.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      Alert.alert(
        'Password reset',
        'Your password has been reset. Please log in with your new password.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login' as never) }]
      );
    } catch (err: any) {
      const message = err?.message || 'Could not reset password. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>
              {step === 'email' ? 'Reset your password' : 'Set a new password'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'email'
                ? 'Enter your account email. We will generate a reset token for you.'
                : `Use the token we generated for ${submittedEmail} and choose a new password.`}
            </Text>
            <View style={{ height: 16 }} />

            {step === 'email' ? (
              <>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
                <Pressable
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={handleEmailSubmit}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send reset link</Text>}
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.label}>Reset token</Text>
                <TextInput
                  value={resetToken}
                  onChangeText={setResetToken}
                  placeholder="Paste reset token"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <Text style={styles.label}>New password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="At least 8 characters"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={[styles.input, { flex: 1, paddingRight: 72 }]}
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    style={styles.toggleButton}
                    android_ripple={{ color: '#eee' }}
                  >
                    <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </Pressable>
                </View>
                <Text style={styles.label}>Confirm new password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter new password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.input}
                />
                <Pressable
                  style={[styles.button, loading && { opacity: 0.7 }]}
                  onPress={handleResetSubmit}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset password</Text>}
                </Pressable>
              </>
            )}

            <Pressable style={styles.secondary} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryText}>Back to login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 3 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#6B7280' },
  label: { marginTop: 12, marginBottom: 6, fontSize: 12, color: '#374151', fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#111827',
    backgroundColor: '#fff',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  toggleButton: {
    position: 'absolute',
    right: 8,
    height: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  toggleText: { color: '#6b7280', fontSize: 12, fontWeight: '600' },
  button: { marginTop: 16, backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  secondary: { alignItems: 'center', marginTop: 14 },
  secondaryText: { color: '#6B7280', fontWeight: '600' },
});

export default ForgotPasswordScreen;
