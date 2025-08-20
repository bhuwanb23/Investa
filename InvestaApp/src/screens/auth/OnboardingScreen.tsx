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

  const onboardingData = [
    {
      id: 1,
      title: 'Welcome to TradeMentor',
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
      navigation.navigate('Login');
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
    const scale = scrollX.interpolate({ inputRange, outputRange: [0.85, 1, 0.85], extrapolate: 'clamp' });
    const translateY = scrollX.interpolate({ inputRange, outputRange: [20, 0, 20], extrapolate: 'clamp' });
    const opacity = scrollX.interpolate({ inputRange, outputRange: [0.6, 1, 0.6], extrapolate: 'clamp' });

    return (
      <View key={item.id} style={styles.slide}>
        <Animated.View style={[styles.accentBlob, { backgroundColor: item.color + '33', transform: [{ translateY }] }]} />
        <Animated.View style={[styles.iconContainer, { transform: [{ scale }], opacity }]}> 
          <Text style={styles.icon}>{item.icon}</Text>
        </Animated.View>
        <Animated.Text style={[styles.title, { opacity, transform: [{ translateY }] }]}>{item.title}</Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity }]}>{item.subtitle}</Animated.Text>
        <Animated.Text style={[styles.description, { opacity }]}>{item.description}</Animated.Text>
      </View>
    );
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((item, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const dotScaleX = scrollX.interpolate({ inputRange, outputRange: [1, 2.6, 1], extrapolate: 'clamp' });
        const isActive = index === currentIndex;
        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isActive ? item.color : '#D1D5DB',
                transform: [{ scaleX: dotScaleX }],
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

  return (
    <SafeAreaView style={styles.container} edges={["top","bottom"]}>
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
        
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons 
            name={currentIndex === onboardingData.length - 1 ? 'checkmark' : 'arrow-forward'} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
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
  },
  accentBlob: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    top: height * 0.12,
    opacity: 0.3,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
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
