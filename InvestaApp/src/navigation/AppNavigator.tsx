import React from 'react';
// import { useTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LanguageSelectionScreen from '../screens/auth/LanguageSelectionScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';
import SplashScreen from '../screens/auth/SplashScreen';

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
import LessonListScreen from '../screens/courses/LessonListScreen';
import ModuleScreen from '../screens/courses/ModuleScreen';
import CourseBookmarksScreen from '../screens/courses/CourseBookmarksScreen';
import CertificateScreen from '../screens/courses/CertificateScreen';
import ModuleProgressScreen from '../screens/courses/ModuleProgressScreen';
import DownloadsScreen from '../screens/courses/DownloadsScreen';
import FeedbackScreen from '../screens/courses/FeedbackScreen';
import LessonQuizScreen from '../screens/courses/LessonQuizScreen';

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
import NotificationsScreen from '../screens/main/NotificationsScreen';

// Bookmark Screen
import BookmarksScreen from '../screens/main/BookmarksScreen';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  LanguageSelection: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  CompleteProfile: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Courses: undefined;
  Trading: undefined;
  Progress: undefined;
  Profile: undefined;
  CourseDetail: { courseId: string; course?: any; sample?: boolean };
  LessonDetail: { lessonId: string };
  LessonList: { courseId?: string; course?: any; completedLessonId?: number };
  ModuleScreen: { courseId: string; course?: any };
  Downloads: undefined;
  CourseFeedback: undefined;
  LessonQuiz: undefined;
  Quiz: undefined;
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
  CourseBookmarks: undefined;
  Certificate: undefined;
  ModuleProgress: undefined;
  // Trading Navigation
  MarketWatchlist: undefined;
  StockDetail: { stockSymbol: string; stockName: string };
  PlaceOrder: { stockSymbol: string; stockName: string; currentPrice: number };
  Portfolio: undefined;
  OrderHistory: undefined;
  Leaderboard: undefined;
  Notifications: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
// Bottom tabs removed. Stack-only navigation.

// Main Stack Navigator
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#111827',
        headerTitleStyle: {
          fontWeight: '800',
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <MainStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Courses" component={CoursesScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Trading" component={TradingScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Progress" component={ProgressScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <MainStack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen}
        options={{ title: 'Course Details', headerShown: false }}
      />
      <MainStack.Screen 
        name="LessonDetail" 
        component={LessonDetailScreen}
        options={{ title: 'Lesson', headerShown: false }}
      />
      <MainStack.Screen 
        name="LessonList" 
        component={LessonListScreen}
        options={{ title: 'Lessons', headerShown: false }}
      />
      <MainStack.Screen 
        name="ModuleScreen" 
        component={ModuleScreen}
        options={{ title: 'Module', headerShown: false }}
      />
      <MainStack.Screen 
        name="Downloads" 
        component={DownloadsScreen}
        options={{ title: 'Downloads', headerShown: false }}
      />
      <MainStack.Screen 
        name="CourseFeedback" 
        component={FeedbackScreen}
        options={{ title: 'Course Feedback', headerShown: false }}
      />
      <MainStack.Screen 
        name="LessonQuiz" 
        component={LessonQuizScreen}
        options={{ title: 'Lesson Quiz', headerShown: false }}
      />
      <MainStack.Screen 
        name="Quiz" 
        component={QuizScreen}
        options={{ title: 'Quiz' }}
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
      <MainStack.Screen 
        name="CourseBookmarks" 
        component={CourseBookmarksScreen}
        options={{ title: 'Bookmarks', headerShown: false }}
      />
      <MainStack.Screen 
        name="Certificate" 
        component={CertificateScreen}
        options={{ title: 'Certificate', headerShown: false }}
      />
      <MainStack.Screen 
        name="ModuleProgress" 
        component={ModuleProgressScreen}
        options={{ title: 'Module Progress', headerShown: false }}
      />
      <MainStack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: 'Notifications', headerShown: false }}
      />
      {/* Trading Screens */}
      <MainStack.Screen 
        name="MarketWatchlist" 
        component={MarketWatchlistScreen}
        options={{ 
          title: 'Market Watchlist', 
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <MainStack.Screen 
        name="StockDetail" 
        component={StockDetailScreen}
        options={{ 
          title: 'Stock Details', 
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <MainStack.Screen 
        name="PlaceOrder" 
        component={PlaceOrderScreen}
        options={{ 
          title: 'Place Order', 
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <MainStack.Screen 
        name="Portfolio" 
        component={PortfolioScreen}
        options={{ 
          title: 'Portfolio', 
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <MainStack.Screen 
        name="OrderHistory" 
        component={OrderHistoryScreen}
        options={{ 
          title: 'Order History', 
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <MainStack.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{ 
          title: 'Leaderboard', 
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </MainStack.Navigator>
  );
};

// Auth Stack Navigator
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Onboarding"
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
        name="Splash" 
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="LanguageSelection" 
        component={LanguageSelectionScreen}
        options={{ headerShown: false }}
      />
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
        name="CompleteProfile" 
        component={CompleteProfileScreen}
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

  // Monitor user state changes
  React.useEffect(() => {
    console.log('🧭 AppNavigator: User state changed:', { 
      user: user ? `ID: ${user.id}, Email: ${user.email}` : 'null', 
      isLoading,
      userType: typeof user,
      userKeys: user ? Object.keys(user) : 'N/A',
      timestamp: new Date().toISOString()
    });
  }, [user, isLoading]);

  console.log('🧭 AppNavigator - Auth state:', { 
    user: user ? `ID: ${user.id}, Email: ${user.email}` : 'null', 
    isLoading,
    userType: typeof user,
    userKeys: user ? Object.keys(user) : 'N/A'
  });

  if (isLoading) {
    console.log('⏳ AppNavigator - Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  console.log('🎯 AppNavigator - Rendering navigator, user:', user ? 'logged in' : 'not logged in');
  
  return user ? <MainStackNavigator /> : <AuthStackNavigator />;
};

export default AppNavigator;
