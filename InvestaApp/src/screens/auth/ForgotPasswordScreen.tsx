import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const ForgotPasswordScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Forgot Password Screen - Coming Soon!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default ForgotPasswordScreen;
