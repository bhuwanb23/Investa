import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import CONFIG from '../../config/config';

type NavigationLike = {
  navigate: (routeName: string) => void;
  goBack?: () => void;
};

type RegisterScreenProps = {
  navigation?: NavigationLike;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState<string>('');
  const [nameErrorVisible, setNameErrorVisible] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState<boolean>(false);
  const isEmailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);

  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const passwordStrengthScore = useMemo(() => calculatePasswordStrength(password), [password]);

  const meetsLength = password.length >= 8;
  const meetsUppercase = /[A-Z]/.test(password);
  const meetsNumber = /[0-9]/.test(password);

  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successVisible, setSuccessVisible] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const API_BASE_URL = CONFIG.API.BASE_URL.replace(/\/$/, '');

  function handleBack() {
    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    }
  }

  function onEmailBlur() {
    setEmailTouched(true);
  }

  async function handleSubmit() {
    const hasName = fullName.trim().length > 0;
    setNameErrorVisible(!hasName);

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const passwordOk = passwordStrengthScore >= 2; // require at least "Fair"
    const termsOk = termsAccepted;

    if (!hasName || !emailOk || !passwordOk || !termsOk) {
      setEmailTouched(true);
      return;
    }

    setSubmitting(true);
    setApiError(null);

    // Split full name into first and last name parts
    const trimmedName = fullName.trim();
    const [firstName, ...restName] = trimmedName.split(/\s+/);
    const lastName = restName.join(' ');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email.trim(),
          email: email.trim(),
          password: password,
          confirm_password: password,
          first_name: firstName ?? '',
          last_name: lastName ?? '',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSuccessVisible(true);
      } else {
        // Extract error message(s)
        let message = 'Registration failed. Please try again.';
        if (data && typeof data === 'object') {
          const parts: string[] = [];
          Object.keys(data).forEach((key) => {
            const val = (data as any)[key];
            if (Array.isArray(val)) {
              parts.push(`${key}: ${val.join(', ')}`);
            } else if (typeof val === 'string') {
              parts.push(`${key}: ${val}`);
            }
          });
          if (parts.length > 0) message = parts.join('\n');
        }
        setApiError(message);
      }
    } catch (err) {
      setApiError('Network error. Ensure the backend is running and reachable.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleContinue() {
    setSuccessVisible(false);
    if (navigation) {
      navigation.navigate('Login');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}> 
      <View style={styles.rootBackground}>
        <View style={styles.header}> 
          <Pressable style={styles.iconButton} onPress={handleBack} android_ripple={{ color: '#eee' }}>
            <Text style={styles.iconButtonText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.stepText}>Step 1 of 2</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}> 
            <View style={styles.rocketBadge}>
              <Text style={styles.rocketEmoji}>{'🚀'}</Text>
            </View>
            <Text style={styles.titleText}>Create Your Account</Text>
            <Text style={styles.subtitleText}>
              Join thousands of users and start your journey with us today
            </Text>
          </View>

          <View style={styles.card}> 
            <View style={styles.fieldGroup}> 
              <Text style={styles.labelText}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  style={[styles.textInput, nameErrorVisible && styles.inputErrorBorder]}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
              {nameErrorVisible && (
                <Text style={styles.errorText}>Please enter your full name</Text>
              )}
            </View>

            <View style={styles.fieldGroup}> 
              <Text style={styles.labelText}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onBlur={onEmailBlur}
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
              {emailTouched && isEmailValid && (
                <Text style={styles.successText}>Email looks good!</Text>
              )}
            </View>

            <View style={styles.fieldGroup}> 
              <Text style={styles.labelText}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a strong password"
                  placeholderTextColor="#9ca3af"
                  style={[styles.textInput, styles.passwordInput]}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                <Pressable
                  onPress={() => setPasswordVisible(v => !v)}
                  style={styles.togglePasswordButton}
                  android_ripple={{ color: '#eee' }}
                >
                  <Text style={styles.togglePasswordText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>

              <View style={styles.strengthBarsRow}>
                {Array.from({ length: 4 }).map((_, index) => {
                  const active = index < passwordStrengthScore;
                  const barColor = strengthColor(passwordStrengthScore);
                  return (
                    <View
                      key={`bar-${index}`}
                      style={[styles.strengthBar, active ? { backgroundColor: barColor } : styles.strengthBarInactive]}
                    />
                  );
                })}
              </View>
              <Text style={styles.strengthText}>Password strength: {strengthLabel(passwordStrengthScore)}</Text>

              <View style={styles.requirementsList}>
                <RequirementRow met={meetsLength} text="At least 8 characters" />
                <RequirementRow met={meetsUppercase} text="One uppercase letter" />
                <RequirementRow met={meetsNumber} text="One number" />
              </View>
            </View>

            <View style={styles.checkboxGroup}> 
              <CheckboxRow
                checked={termsAccepted}
                onToggle={() => setTermsAccepted(v => !v)}
                label={(
                  <Text style={styles.checkboxText}>
                    I agree to the <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
                )}
              />

              <CheckboxRow
                checked={newsletterOptIn}
                onToggle={() => setNewsletterOptIn(v => !v)}
                label={(<Text style={styles.checkboxText}>Send me product updates and helpful tips via email</Text>)}
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                submitting && styles.submitButtonDisabled,
              ]}
            >
              {submitting ? (
                <View style={styles.submitContentRow}>
                  <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>Creating Account...</Text>
                </View>
              ) : (
                <View style={styles.submitContentRow}>
                  <Text style={styles.submitButtonText}>Create Account</Text>
                  <Text style={styles.arrowIcon}>{'→'}</Text>
                </View>
              )}
            </Pressable>
            {apiError ? (
              <Text style={styles.errorText}>{apiError}</Text>
            ) : null}
          </View>

          <View style={styles.footerLinkRow}> 
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation?.navigate('Login')} android_ripple={{ color: '#eee' }}>
              <Text style={styles.linkTextBold}>Sign in here</Text>
            </Pressable>
          </View>
        </ScrollView>

        <Modal visible={successVisible} transparent animationType="fade" onRequestClose={() => setSuccessVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.successBadge}>
                <Text style={styles.successCheck}>✓</Text>
              </View>
              <Text style={styles.modalTitle}>Welcome aboard!</Text>
              <Text style={styles.modalSubtitle}>
                Your account has been created successfully. Let's get you started!
              </Text>
              <Pressable style={styles.continueButton} onPress={handleContinue} android_ripple={{ color: '#3f51b5' }}>
                <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

function calculatePasswordStrength(value: string): number {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

function strengthLabel(score: number): string {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[score] ?? 'Very Weak';
}

function strengthColor(score: number): string {
  if (score <= 1) return '#f87171'; // red-400
  if (score === 2) return '#facc15'; // yellow-400
  if (score === 3) return '#60a5fa'; // blue-400
  return '#22c55e'; // green-500
}

type RequirementRowProps = { met: boolean; text: string };
const RequirementRow: React.FC<RequirementRowProps> = ({ met, text }) => {
  return (
    <View style={styles.requirementRow}>
      <Text style={[styles.requirementIcon, met ? styles.requirementIconMet : styles.requirementIconDefault]}>
        {met ? '✓' : '•'}
      </Text>
      <Text style={[styles.requirementText, met ? styles.requirementTextMet : styles.requirementTextDefault]}>
        {text}
      </Text>
    </View>
  );
};

type CheckboxRowProps = {
  checked: boolean;
  onToggle: () => void;
  label: React.ReactNode;
};

const CheckboxRow: React.FC<CheckboxRowProps> = ({ checked, onToggle, label }) => {
  return (
    <Pressable onPress={onToggle} style={styles.checkboxRow} android_ripple={{ color: '#eee' }}>
      <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
        {checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
      </View>
      <View style={{ flex: 1 }}>
        {label}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  rootBackground: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  iconButtonText: {
    fontSize: 18,
    color: '#4b5563',
  },
  stepText: {
    fontSize: 12,
    color: '#6b7280',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  rocketBadge: {
    height: 80,
    width: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    marginBottom: 16,
  },
  rocketEmoji: {
    fontSize: 28,
    color: '#ffffff',
  },
  titleText: {
    fontSize: 20,
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
  successText: {
    marginTop: 6,
    fontSize: 12,
    color: '#16a34a',
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
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  strengthBar: {
    flex: 1,
    height: 8,
    borderRadius: 999,
  },
  strengthBarInactive: {
    backgroundColor: '#e5e7eb',
  },
  strengthText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
  },
  requirementsList: {
    marginTop: 6,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  requirementIcon: {
    width: 16,
    textAlign: 'center',
    marginRight: 8,
  },
  requirementIconDefault: {
    color: '#9ca3af',
  },
  requirementIconMet: {
    color: '#16a34a',
  },
  requirementText: {
    fontSize: 12,
  },
  requirementTextDefault: {
    color: '#9ca3af',
  },
  requirementTextMet: {
    color: '#16a34a',
  },
  checkboxGroup: {
    marginTop: 8,
    gap: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkboxBox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxBoxChecked: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  checkboxTick: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 16,
  },
  checkboxText: {
    color: '#4b5563',
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  linkTextBold: {
    color: '#4f46e5',
    fontWeight: '700',
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
    opacity: 0.9,
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
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    padding: 20,
    alignItems: 'center',
  },
  successBadge: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successCheck: {
    color: '#16a34a',
    fontSize: 28,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default RegisterScreen;
