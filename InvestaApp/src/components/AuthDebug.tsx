import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import CONFIG from '../config/config';

const AuthDebug = () => {
  const { user, token, isLoading } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Auth Debug Info</Text>
      <Text style={styles.text}>Loading: {isLoading ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>User: {user ? user.username : 'None'}</Text>
      <Text style={styles.text}>Token: {token ? `${token.substring(0, 10)}...` : 'None'}</Text>
      <Text style={styles.text}>User ID: {user?.id || 'None'}</Text>
      <Text style={styles.text}>Email: {user?.email || 'None'}</Text>
      <Text style={styles.text}>API Base: {CONFIG.API.BASE_URL}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
});

export default AuthDebug;
