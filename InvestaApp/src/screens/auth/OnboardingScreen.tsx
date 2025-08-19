import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const renderSlide = (item: any, index: number) => (
    <View key={item.id} style={styles.slide}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index === currentIndex ? '#0891B2' : '#D1D5DB' },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => renderSlide(item, index))}
      </ScrollView>

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
    </View>
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
    paddingTop: 60,
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
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
    paddingBottom: 40,
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
    backgroundColor: '#0891B2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 140,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default OnboardingScreen;
