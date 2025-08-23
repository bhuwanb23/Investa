import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services';

const AuthDebug = () => {
  const { user, token, login, logout } = useAuth();
  const [isTesting, setIsTesting] = useState(false);

  const testAuth = async () => {
    setIsTesting(true);
    try {
      const result = await authApi.testAuth();
      Alert.alert('Auth Test Success', JSON.stringify(result.data, null, 2));
    } catch (error: any) {
      Alert.alert('Auth Test Failed', error.message || 'Unknown error');
    } finally {
      setIsTesting(false);
    }
  };

  const testLogin = async () => {
    setIsTesting(true);
    try {
      const result = await login('test@example.com', 'test123');
      Alert.alert('Login Result', result.message);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Unknown error');
    } finally {
      setIsTesting(false);
    }
  };

  const clearStorage = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Storage cleared');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unknown error');
    }
  };

  const clearFakeTokens = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      Alert.alert('Success', 'Fake tokens cleared. Please restart the app.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unknown error');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Authentication Debug</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current State:</Text>
        <Text style={styles.text}>User: {user ? user.username : 'Not logged in'}</Text>
        <Text style={styles.text}>Token: {token ? token.substring(0, 20) + '...' : 'No token'}</Text>
        <Text style={styles.text}>Email: {user ? user.email : 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions:</Text>
        
        <Pressable style={styles.button} onPress={testLogin} disabled={isTesting}>
          <Text style={styles.buttonText}>
            {isTesting ? 'Testing...' : 'Test Login'}
          </Text>
        </Pressable>

        <Pressable style={styles.button} onPress={testAuth} disabled={isTesting}>
          <Text style={styles.buttonText}>
            {isTesting ? 'Testing...' : 'Test Auth API'}
          </Text>
        </Pressable>

                      <Pressable style={styles.button} onPress={clearStorage} disabled={isTesting}>
                <Text style={styles.buttonText}>Clear Storage</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={clearFakeTokens} disabled={isTesting}>
                <Text style={styles.buttonText}>Clear Fake Tokens</Text>
              </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions:</Text>
        <Text style={styles.text}>1. Clear any fake tokens first (if needed)</Text>
        <Text style={styles.text}>2. Test login with test@example.com / test123</Text>
        <Text style={styles.text}>3. Test auth API to verify real token works</Text>
        <Text style={styles.text}>4. Check console for detailed logs</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AuthDebug;
