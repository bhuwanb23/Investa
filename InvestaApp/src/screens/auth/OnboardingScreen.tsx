import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const buttonPulse = useRef(new Animated.Value(0)).current;
  const bgBlobScale = useRef(new Animated.Value(1)).current;
  const [showBurst, setShowBurst] = useState(false);

  const onboardingData = [
    {
      id: 1,
      title: 'Welcome to Investa',
      subtitle: 'Your journey to becoming a smart investor starts here',
      description: 'Learn the fundamentals of stock market investing with SEBI-aligned content and hands-on practice.',
      icon: '📚',
      color: '#0891B2',
    },
    {
      id: 2,
      title: 'Learn at Your Pace',
      subtitle: 'Structured learning modules',
      description: 'From basic concepts to advanced strategies, master trading fundamentals through interactive lessons.',
      icon: '🎯',
      color: '#059669',
    },
    {
      id: 3,
      title: 'Practice with Paper Trading',
      subtitle: 'Risk-free simulation',
      description: 'Apply your knowledge with simulated trading using real market data. No real money involved.',
      icon: '📊',
      color: '#7C3AED',
    },
    {
      id: 4,
      title: 'Track Your Progress',
      subtitle: 'Monitor your growth',
      description: 'Take quizzes, earn badges, and track your learning journey with detailed progress analytics.',
      icon: '🏆',
      color: '#DC2626',
    },
  ];

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      setShowBurst(true);
      // small confetti-like burst then navigate
      setTimeout(() => {
        setShowBurst(false);
        navigation.navigate('Login');
      }, 800);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const renderSlide = (item: any, index: number) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = scrollX.interpolate({ inputRange, outputRange: [0.86, 1, 0.86], extrapolate: 'clamp' });
    const translateY = scrollX.interpolate({ inputRange, outputRange: [24, 0, 24], extrapolate: 'clamp' });
    const opacity = scrollX.interpolate({ inputRange, outputRange: [0.55, 1, 0.55], extrapolate: 'clamp' });
    const rotate = scrollX.interpolate({ inputRange, outputRange: ['-8deg', '0deg', '8deg'], extrapolate: 'clamp' });

    return (
      <View key={item.id} style={styles.slide}>
        <Animated.View style={[styles.accentBlob, { backgroundColor: item.color + '33', transform: [{ translateY }, { scale: bgBlobScale }] }]} />
        <Animated.View style={[styles.iconDeck, { transform: [{ rotate }, { scale }] }]}> 
          <View style={[styles.iconCard, { backgroundColor: '#F3F4F6' }]} />
          <View style={[styles.iconCard, { backgroundColor: '#E5E7EB', transform: [{ translateY: -10 }, { translateX: -10 }] }]} />
          <View style={[styles.iconContainer, { borderColor: item.color + '55' }]}> 
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
        </Animated.View>
        <Animated.Text style={[styles.title, { color: '#111827', opacity, transform: [{ translateY }] }]}>{item.title}</Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity }]}>{item.subtitle}</Animated.Text>
        <Animated.Text style={[styles.description, { opacity }]}>{item.description}</Animated.Text>
      </View>
    );
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((item, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const dotScaleX = scrollX.interpolate({ inputRange, outputRange: [1, 2.8, 1], extrapolate: 'clamp' });
        const dotOpacity = scrollX.interpolate({ inputRange, outputRange: [0.5, 1, 0.5], extrapolate: 'clamp' });
        const isActive = index === currentIndex;
        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isActive ? item.color : '#D1D5DB',
                transform: [{ scaleX: dotScaleX }],
                opacity: dotOpacity,
              },
            ]}
          />
        );
      })}
    </View>
  );

  // Floating decorative icons
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatA, { toValue: 1, duration: 3500, useNativeDriver: true }),
        Animated.timing(floatA, { toValue: 0, duration: 3500, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatB, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(floatB, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    ).start();

    // Button pulse + background blob breathing
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(buttonPulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    const blob = Animated.loop(
      Animated.sequence([
        Animated.timing(bgBlobScale, { toValue: 1.06, duration: 1600, useNativeDriver: true }),
        Animated.timing(bgBlobScale, { toValue: 1.0, duration: 1600, useNativeDriver: true }),
      ])
    );
    pulse.start();
    blob.start();
    return () => { pulse.stop(); blob.stop(); };
  }, [floatA, floatB]);

  const floatStyleA = {
    transform: [
      { translateY: floatA.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
      { translateX: floatA.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }) },
    ],
    opacity: floatA.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
  } as any;
  const floatStyleB = {
    transform: [
      { translateY: floatB.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }) },
      { translateX: floatB.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
    ],
    opacity: floatB.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
  } as any;

  const dynamicColor = onboardingData[currentIndex]?.color || '#0EA5E9';

  return (
    <SafeAreaView style={styles.container} edges={["top","bottom"]}>
      {/* Slide colored background blobs (cross-fade per slide) */}
      {onboardingData.map((s, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });
        return (
          <Animated.View key={`bg-${idx}`} style={[styles.bgBlobWrap, { opacity }]}> 
            <View style={[styles.bgBlob, { backgroundColor: s.color + '26', top: height * 0.05, left: -40 }]} />
            <View style={[styles.bgBlob, { backgroundColor: s.color + '1F', top: height * 0.28, right: -60, width: width * 0.7, height: width * 0.7 }]} />
          </Animated.View>
        );
      })}

      {/* Ambient particle field (kept behind content) */}
      <ParticleField color={dynamicColor} />

      <Animated.View style={[styles.floatingIcon, { top: 90, left: 24 }, floatStyleA]}>
        <Ionicons name="sparkles" size={20} color="#60A5FA" />
      </Animated.View>
      <Animated.View style={[styles.floatingIcon, { top: height * 0.35, right: 24 }, floatStyleB]}>
        <Ionicons name="star" size={18} color="#F59E0B" />
      </Animated.View>

      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { listener: handleScroll, useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => renderSlide(item, index))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        {renderDots()}
        
        <Animated.View
          style={{
            transform: [
              {
                scale: buttonPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }),
              },
            ],
          }}
        >
          <TouchableOpacity onPress={handleNext} activeOpacity={0.9} style={[styles.nextButton, { backgroundColor: dynamicColor }]}> 
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons 
              name={currentIndex === onboardingData.length - 1 ? 'checkmark' : 'arrow-forward'} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Swipe indicator */}
        {currentIndex < onboardingData.length - 1 && (
          <Animated.Text
            style={{
              marginTop: 14,
              color: '#6B7280',
              fontSize: 12,
              transform: [{
                translateX: buttonPulse.interpolate({ inputRange: [0, 1], outputRange: [0, 6] })
              }]
            }}
          >
            Swipe to explore →
          </Animated.Text>
        )}
      </View>

      {/* Confetti-like burst */}
      {showBurst && <Burst color={dynamicColor} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 24,
    paddingRight: 20,
    paddingBottom: 20,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: height * 0.62,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 120, // ensure texts don't collide with footer
  },
  accentBlob: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    top: height * 0.12,
    opacity: 0.3,
  },
  bgBlobWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  bgBlob: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    filter: undefined,
  } as any,
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    alignItems: 'center',
    zIndex: 2,
  },
  iconDeck: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconCard: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 18,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0891B2',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 140,
    justifyContent: 'center',
  },
  floatingIcon: {
    position: 'absolute',
    zIndex: 0,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default OnboardingScreen;

// Lightweight ambient particle layer
const ParticleField: React.FC<{ color: string }> = ({ color }) => {
  const particles = Array.from({ length: 18 }).map((_, i) => ({
    key: `p-${i}`,
    left: Math.random() * width,
    top: Math.random() * (height * 0.6) + 40,
    size: 3 + Math.random() * 4,
    delay: Math.random() * 2000,
    duration: 2800 + Math.random() * 2000,
  }));
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height }}>
      {particles.map(p => {
        const float = new Animated.Value(0);
        useEffect(() => {
          const loop = Animated.loop(
            Animated.sequence([
              Animated.timing(float, { toValue: 1, duration: p.duration, delay: p.delay, useNativeDriver: true }),
              Animated.timing(float, { toValue: 0, duration: p.duration, useNativeDriver: true }),
            ])
          );
          loop.start();
          return () => loop.stop();
        }, []);
        return (
          <Animated.View
            key={p.key}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: color + '55',
              transform: [
                { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
                { translateX: float.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }) },
              ],
              opacity: float.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] }),
            }}
          />
        );
      })}
    </View>
  );
};

// Simple confetti-like burst
const Burst: React.FC<{ color: string }> = ({ color }) => {
  const burst = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(burst, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, [burst]);
  const pieces = Array.from({ length: 16 });
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: height * 0.18, alignItems: 'center' }}>
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        const distance = 80 + (i % 4) * 12;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance * 0.6;
        return (
          <Animated.View
            key={`b-${i}`}
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              backgroundColor: color,
              transform: [
                { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, tx] }) },
                { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, ty] }) },
                { scale: burst.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] }) },
              ],
              opacity: burst.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            }}
          />
        );
      })}
    </View>
  );
};
