import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main App Screens
import HomeScreen from '../screens/main/HomeScreen';
import CoursesScreen from '../screens/main/CoursesScreen';
import LessonsScreen from '../screens/main/LessonsScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import TradingScreen from '../screens/main/TradingScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ProgressScreen from '../screens/main/ProgressScreen';

// Course Screens
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import LessonDetailScreen from '../screens/courses/LessonDetailScreen';
import LearningHomeScreen from '../screens/courses/LearningHomeScreen';
import ModuleDetailScreen from '../screens/courses/ModuleDetailScreen';
import ModuleProgressScreen from '../screens/courses/ModuleProgressScreen';

// Quiz Screens
import QuizStartScreen from '../screens/quiz/QuizStartScreen';
import QuizQuestionScreen from '../screens/quiz/QuizQuestionScreen';
import QuizResultScreen from '../screens/quiz/QuizResultScreen';

// Trading Screens
import MarketWatchlistScreen from '../screens/trading/MarketWatchlistScreen';
import StockDetailScreen from '../screens/trading/StockDetailScreen';
import PlaceOrderScreen from '../screens/trading/PlaceOrderScreen';
import PortfolioScreen from '../screens/trading/PortfolioScreen';
import OrderHistoryScreen from '../screens/trading/OrderHistoryScreen';
import LeaderboardScreen from '../screens/trading/LeaderboardScreen';

// Bookmark Screen
import BookmarksScreen from '../screens/main/BookmarksScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  CourseDetail: { courseId: string };
  LessonDetail: { lessonId: string };
  Quiz: undefined;
  LearningHome: undefined;
  ModuleDetail: { moduleId: number };
  ModuleProgress: { moduleId: number };
  QuizStart: undefined;
  QuizQuestion: { 
    quizId: string; 
    quizTitle: string; 
    timeLimit: number; 
  };
  QuizResult: { 
    score: number; 
    totalQuestions: number; 
    correctAnswers: number; 
    timeTaken: number; 
    quizId: string; 
  };
  Bookmarks: undefined;
  // Trading Navigation
  MarketWatchlist: undefined;
  StockDetail: { stockSymbol: string; stockName: string };
  PlaceOrder: { stockSymbol: string; stockName: string; currentPrice: number };
  Portfolio: undefined;
  OrderHistory: undefined;
  Leaderboard: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Theme
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4f46e5',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB',
    notification: '#F59E0B',
  },
};

const DarkThemeCustom = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#8B5CF6',
    background: '#0B1220',
    card: '#111827',
    text: '#F3F4F6',
    border: '#1F2937',
    notification: '#F59E0B',
  },
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Courses') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Trading') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return (
            <View style={{
              padding: 8,
              borderRadius: 12,
              backgroundColor: focused ? 'rgba(79,70,229,0.12)' : 'transparent',
            }}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 6 },
        tabBarStyle: {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          height: 60,
          borderRadius: 16,
          backgroundColor: colors.card,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Trading" component={TradingScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainStackNavigator = () => {
  const { colors } = useTheme();
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '800',
        },
      }}
    >
      <MainStack.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
        options={{ headerShown: false }}
      />
      <MainStack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen}
        options={{ title: 'Course Details' }}
      />
      <MainStack.Screen 
        name="LessonDetail" 
        component={LessonDetailScreen}
        options={{ title: 'Lesson' }}
      />
      <MainStack.Screen 
        name="Quiz" 
        component={QuizScreen}
        options={{ title: 'Quiz' }}
      />
      <MainStack.Screen 
        name="LearningHome" 
        component={LearningHomeScreen}
        options={{ title: 'Learning Modules', headerShown: false }}
      />
      <MainStack.Screen 
        name="ModuleDetail" 
        component={ModuleDetailScreen}
        options={{ title: 'Module Details', headerShown: false }}
      />
      <MainStack.Screen 
        name="ModuleProgress" 
        component={ModuleProgressScreen}
        options={{ title: 'Module Progress', headerShown: false }}
      />
      <MainStack.Screen 
        name="QuizStart" 
        component={QuizStartScreen}
        options={{ title: 'Quiz Topics', headerShown: false }}
      />
      <MainStack.Screen 
        name="QuizQuestion" 
        component={QuizQuestionScreen}
        options={{ title: 'Quiz', headerShown: false }}
      />
      <MainStack.Screen 
        name="QuizResult" 
        component={QuizResultScreen}
        options={{ title: 'Quiz Results', headerShown: false }}
      />
      <MainStack.Screen 
        name="Bookmarks" 
        component={BookmarksScreen}
        options={{ title: 'Bookmarks', headerShown: false }}
      />
      {/* Trading Screens */}
      <MainStack.Screen 
        name="MarketWatchlist" 
        component={MarketWatchlistScreen}
        options={{ title: 'Market Watchlist', headerShown: false }}
      />
      <MainStack.Screen 
        name="StockDetail" 
        component={StockDetailScreen}
        options={{ title: 'Stock Details', headerShown: false }}
      />
      <MainStack.Screen 
        name="PlaceOrder" 
        component={PlaceOrderScreen}
        options={{ title: 'Place Order', headerShown: false }}
      />
      <MainStack.Screen 
        name="Portfolio" 
        component={PortfolioScreen}
        options={{ title: 'Portfolio', headerShown: false }}
      />
      <MainStack.Screen 
        name="OrderHistory" 
        component={OrderHistoryScreen}
        options={{ title: 'Order History', headerShown: false }}
      />
      <MainStack.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{ title: 'Leaderboard', headerShown: false }}
      />
    </MainStack.Navigator>
  );
};

// Auth Stack Navigator
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </AuthStack.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const colorScheme = useColorScheme();

  console.log('🧭 AppNavigator - Auth state:', { user: !!user, isLoading });

  if (isLoading) {
    console.log('⏳ AppNavigator - Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  console.log('🎯 AppNavigator - Rendering navigator, user:', user ? 'logged in' : 'not logged in');
  
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkThemeCustom : LightTheme}>
      {user ? <MainStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
