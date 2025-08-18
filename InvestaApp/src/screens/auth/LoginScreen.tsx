import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/AppNavigator';

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      setEmailTouched(true);
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual login logic with API
      console.log('Login attempt:', { email, password });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show success and navigate
      Alert.alert('Success', 'Login successful!');
      // TODO: Navigate to main app
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandEmoji}>{'📈'}</Text>
            </View>
            <Text style={styles.titleText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>Sign in to continue your investment journey</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.labelText}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  style={[
                    styles.textInput,
                    emailTouched && !isEmailValid && styles.inputErrorBorder,
                    emailTouched && isEmailValid && styles.inputSuccessBorder,
                  ]}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
              </View>
              {emailTouched && !isEmailValid && (
                <Text style={styles.errorText}>Please enter a valid email address</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.labelText}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  style={[styles.textInput, styles.passwordInput]}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                <Pressable onPress={() => setShowPassword(v => !v)} style={styles.togglePasswordButton} android_ripple={{ color: '#eee' }}>
                  <Text style={styles.togglePasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
              <Pressable onPress={handleForgotPassword} style={styles.forgotPasswordPressable} android_ripple={{ color: '#eee' }}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                loading && styles.submitButtonDisabled,
              ]}
            >
              {loading ? (
                <View style={styles.submitContentRow}>
                  <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>Signing In...</Text>
                </View>
              ) : (
                <View style={styles.submitContentRow}>
                  <Text style={styles.submitButtonText}>Sign In</Text>
                  <Text style={styles.arrowIcon}>{'→'}</Text>
                </View>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable onPress={() => Alert.alert('Info', 'Google sign-in coming soon')} style={styles.googleButton} android_ripple={{ color: '#e5e7eb' }}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleText}>Continue with Google</Text>
            </Pressable>

            <View style={styles.registerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Pressable onPress={handleRegister} android_ripple={{ color: '#eee' }}>
                <Text style={styles.linkTextBold}>Sign Up</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.termsRow}>
            <Text style={styles.termsText}>By continuing, you agree to our Terms of Service and Privacy Policy</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 16,
  },
  brandBadge: {
    height: 80,
    width: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    marginBottom: 16,
  },
  brandEmoji: {
    fontSize: 28,
    color: '#ffffff',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 6,
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputErrorBorder: {
    borderColor: '#fca5a5',
  },
  inputSuccessBorder: {
    borderColor: '#86efac',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: '#ef4444',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 72,
  },
  togglePasswordButton: {
    position: 'absolute',
    right: 8,
    height: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  togglePasswordText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
  forgotPasswordPressable: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonPressed: {
    opacity: 0.92,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#6b7280',
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 12,
  },
  googleIcon: {
    color: '#ea4335',
    fontWeight: '900',
    fontSize: 16,
    marginRight: 8,
  },
  googleText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  linkTextBold: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 12,
  },
  termsRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  termsText: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;
