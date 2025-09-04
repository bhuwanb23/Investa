import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Text } from 'react-native';

type LogoLoaderProps = {
  message?: string;
  size?: number;
  fullscreen?: boolean;
};

const LogoLoader: React.FC<LogoLoaderProps> = ({ message = 'Loading...', size = 96, fullscreen = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 1.08, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
          Animated.timing(opacityAnim, { toValue: 0.8, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacityAnim, scaleAnim]);

  return (
    <View style={[styles.container, fullscreen ? styles.fullscreen : null]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
        <Image
          source={require('../../assets/investa_logo.png')}
          style={{ width: size, height: size, borderRadius: 16 }}
          resizeMode="contain"
        />
      </Animated.View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  fullscreen: {
    flex: 1,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default LogoLoader;


