// Base API
export { default as api, handleApiError } from './api';
export type { ApiResponse, ApiError } from './api';

// Auth API
export { default as authApi } from './authApi';
export type { 
  LoginData, 
  RegisterData, 
  AuthResponse, 
  User 
} from './authApi';

// Profile API
export { default as profileApi } from './profileApi';
export type { 
  UserProfile, 
  ProfileUpdateData, 
  CompleteProfileData, 
  Language 
} from './profileApi';

// Notifications API
export { default as notificationsApi } from './notificationsApi';
export type { 
  Notification, 
  UnreadCountResponse 
} from './notificationsApi';

// Trading API
export { default as tradingApi } from './tradingApi';
export type {
  Stock, StockPrice, MarketData, TechnicalIndicator, StockDetail,
  Portfolio, PortfolioHolding, Order, Trade, TradingPerformance,
  UserWatchlist, Achievement, UserAchievement, LeaderboardEntry,
  MarketSummary, TopMovers, TradeSummary
} from './tradingApi';
