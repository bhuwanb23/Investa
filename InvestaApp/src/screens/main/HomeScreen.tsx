import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import MainHeader from '../../components/MainHeader';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

// Define navigation types
type RootStackParamList = {
  Courses: undefined;
  Quiz: undefined;
  Trading: undefined;
  Progress: undefined;
  Profile: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  // Mock data - replace with actual API data
  const userProgress = {
    completedLessons: 12,
    totalLessons: 25,
    currentStreak: 5,
    totalPoints: 850,
    overallProgress: 0.73,
  };

  const quickAccessItems = [
    {
      id: 1,
      title: 'Learn',
      subtitle: 'Master trading basics',
      icon: 'school',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      badge: '3 new lessons',
      onPress: () => navigation.navigate('Courses'),
    },
    {
      id: 2,
      title: 'Quiz',
      subtitle: 'Test your knowledge',
      icon: 'help-circle',
      color: '#059669',
      bgColor: '#DCFCE7',
      badge: '85% accuracy',
      onPress: () => navigation.navigate('Quiz'),
    },
    {
      id: 3,
      title: 'Trade',
      subtitle: 'Practice trading',
      icon: 'trending-up',
      color: '#06B6D4',
      bgColor: '#CFFAFE',
      badge: '$12,450 profit',
      onPress: () => navigation.navigate('Trading'),
    },
    {
      id: 4,
      title: 'Progress',
      subtitle: 'Track performance',
      icon: 'analytics',
      color: '#7C3AED',
      bgColor: '#F3E8FF',
      badge: 'Level 7',
      onPress: () => navigation.navigate('Progress'),
    },
  ];

  const learningPathItems = [
    {
      id: 1,
      title: 'Trading Fundamentals',
      status: 'completed',
      description: 'Completed',
      icon: 'checkmark',
      color: '#059669',
    },
    {
      id: 2,
      title: 'Technical Analysis',
      status: 'in-progress',
      description: 'In Progress (60%)',
      icon: 'play',
      color: '#0891B2',
    },
    {
      id: 3,
      title: 'Risk Management',
      status: 'locked',
      description: 'Locked',
      icon: 'lock-closed',
      color: '#9CA3AF',
    },
  ];

  const portfolioData = {
    totalValue: '$12,450',
    profit: '+$1,250',
    profitPercentage: '+12.5%',
    totalTrades: 8,
  };

  const achievements = [
    {
      id: 1,
      title: 'First Trade',
      icon: 'trophy',
      bgColor: '#FEF3C7',
      iconColor: '#D97706',
    },
    {
      id: 2,
      title: 'Quiz Master',
      icon: 'medal',
      bgColor: '#DBEAFE',
      iconColor: '#2563EB',
    },
    {
      id: 3,
      title: '7 Day Streak',
      icon: 'star',
      bgColor: '#DCFCE7',
      iconColor: '#16A34A',
    },
    {
      id: 4,
      title: 'Expert Level',
      icon: 'diamond',
      bgColor: '#F3E8FF',
      iconColor: '#7C3AED',
    },
  ];

  const renderWelcomeSection = () => (
    <View style={styles.welcomeSection}>
      <View style={styles.welcomeHeader}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' }}
            style={styles.profileImage}
          />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome back, {user?.username || 'Sarah'}!</Text>
            <Text style={styles.welcomeSubtitle}>Ready to level up your trading skills?</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Learning Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(userProgress.overallProgress * 100)}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${userProgress.overallProgress * 100}%` }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  const renderQuickAccess = () => (
    <View style={styles.quickAccessSection}>
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <FlatList
        data={quickAccessItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <View style={[styles.quickAccessIcon, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={styles.quickAccessTitle}>{item.title}</Text>
            <Text style={styles.quickAccessSubtitle}>{item.subtitle}</Text>
            <Text style={[styles.quickAccessBadge, { color: item.color }]}>{item.badge}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderLearningPath = () => (
    <View style={styles.learningPathSection}>
      <Text style={styles.sectionTitle}>Learning Path</Text>
      <View style={styles.learningPathList}>
        {learningPathItems.map((item) => (
          <View key={item.id} style={styles.learningPathItem}>
            <View style={[styles.learningPathIcon, { backgroundColor: item.color }]}>
              <Ionicons 
                name={item.icon as any} 
                size={16} 
                color="white" 
              />
            </View>
            <View style={styles.learningPathContent}>
              <Text style={[
                styles.learningPathTitle, 
                { color: item.status === 'locked' ? '#9CA3AF' : '#1F2937' }
              ]}>
                {item.title}
              </Text>
              <Text style={[
                styles.learningPathDescription, 
                { color: item.status === 'locked' ? '#9CA3AF' : '#6B7280' }
              ]}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPortfolioSnapshot = () => (
    <View style={styles.portfolioSection}>
      <View style={styles.portfolioHeader}>
        <Text style={styles.sectionTitle}>Simulated Portfolio</Text>
        <Text style={styles.portfolioProfit}>{portfolioData.profitPercentage}</Text>
      </View>
      <View style={styles.portfolioStats}>
        <View style={styles.portfolioStat}>
          <Text style={styles.portfolioValue}>{portfolioData.totalValue}</Text>
          <Text style={styles.portfolioLabel}>Total Value</Text>
        </View>
        <View style={styles.portfolioStat}>
          <Text style={styles.portfolioProfitValue}>{portfolioData.profit}</Text>
          <Text style={styles.portfolioLabel}>Profit</Text>
        </View>
        <View style={styles.portfolioStat}>
          <Text style={styles.portfolioValue}>{portfolioData.totalTrades}</Text>
          <Text style={styles.portfolioLabel}>Trades</Text>
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsSection}>
      <Text style={styles.sectionTitle}>Your Achievements</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementsScrollContainer}
      >
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <View style={[styles.achievementIcon, { backgroundColor: achievement.bgColor }]}>
              <Ionicons name={achievement.icon as any} size={24} color={achievement.iconColor} />
            </View>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <MainHeader title="Home" iconName="home" />
      {renderWelcomeSection()}
      {renderQuickAccess()}
      {renderLearningPath()}
      {renderPortfolioSnapshot()}
      {renderAchievements()}
      <View style={{ height: 84 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  welcomeSection: {
    margin: 16,
    backgroundColor: '#0891B2',
    borderRadius: 16,
    padding: 24,
  },
  welcomeHeader: {
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 12,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: '#CFFAFE',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#CFFAFE',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  quickAccessSection: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: (width - 64) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickAccessSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  quickAccessBadge: {
    fontSize: 12,
    fontWeight: '500',
  },
  learningPathSection: {
    margin: 16,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  learningPathList: {
    gap: 16,
  },
  learningPathItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learningPathIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  learningPathContent: {
    flex: 1,
  },
  learningPathTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  learningPathDescription: {
    fontSize: 14,
  },
  portfolioSection: {
    margin: 16,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  portfolioProfit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portfolioStat: {
    alignItems: 'center',
    flex: 1,
  },
  portfolioValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  portfolioProfitValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  portfolioLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsSection: {
    margin: 16,
    marginTop: 0,
    marginBottom: 100,
  },
  achievementsScrollContainer: {
    paddingRight: 16,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 84,
  },
});

export default HomeScreen;

