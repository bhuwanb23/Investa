import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      // call your API here
      await new Promise(r => setTimeout(r, 800));
      Alert.alert('Check your inbox', 'If an account exists, a reset link was sent.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>Enter your account email and we will send you a reset link.</Text>
        <View style={{ height: 12 }} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <Pressable style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send reset link</Text>}
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryText}>Back to login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
  },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 3 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#6B7280' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#111827', backgroundColor: '#fff' },
  button: { marginTop: 12, backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  secondary: { alignItems: 'center', marginTop: 10 },
  secondaryText: { color: '#6B7280', fontWeight: '600' },
});

export default ForgotPasswordScreen;
