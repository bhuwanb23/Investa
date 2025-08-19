import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  const { user, isLoading } = useAuth();
  
  const logoScale = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    // Animate logo entrance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    const timer = setTimeout(() => {
      if (isLoading) return;
      
      if (user) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, isLoading, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>📈</Text>
          </View>
        </Animated.View>
        
        <Animated.Text
          style={[
            styles.appName,
            { opacity: textOpacity },
          ]}
        >
          TradeMentor
        </Animated.Text>
        
        <Animated.Text
          style={[
            styles.tagline,
            { opacity: textOpacity },
          ]}
        >
          Learn. Trade. Succeed.
        </Animated.Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          SEBI Aligned • Paper Trading • Educational
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0891B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SplashScreen;
