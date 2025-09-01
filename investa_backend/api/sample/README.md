# Sample Data System for Investa Backend

This directory contains comprehensive sample data files for **ALL** models in the Investa platform. Each file is organized by model category and contains realistic, interconnected data.

## ✅ **COMPLETE MODEL COVERAGE**

**All 29 models now have sample data:**

### User Models (2 models)
- ✅ `Language` - 10 Indian languages
- ✅ `UserProfile` - 10 users with diverse profiles

### Security Models (2 models)  
- ✅ `SecuritySettings` - Security preferences for all users
- ✅ `UserSession` - Active/inactive user sessions

### Privacy Models (1 model)
- ✅ `PrivacySettings` - Privacy preferences for all users

### Learning Models (11 models)
- ✅ `LearningProgress` - Progress tracking for all users
- ✅ `Course` - 4 comprehensive courses
- ✅ `Lesson` - Multiple lessons per course
- ✅ `UserLessonProgress` - Individual lesson progress tracking
- ✅ `Quiz` - Multiple quizzes per lesson
- ✅ `Question` - Questions for each quiz
- ✅ `Answer` - Answer options for questions
- ✅ `UserQuizAttempt` - User quiz attempts and scores
- ✅ `UserQuizAnswer` - Individual user answers
- ✅ `Badge` - 4 learning badges
- ✅ `UserBadge` - Badge assignments to users

### Trading Models (12 models)
- ✅ `Stock` - 5 major Indian stocks
- ✅ `StockPrice` - 30 days historical price data
- ✅ `UserWatchlist` - User stock watchlists
- ✅ `Portfolio` - Investment portfolios for all users
- ✅ `PortfolioHolding` - Individual stock holdings
- ✅ `Order` - Trading orders (buy/sell)
- ✅ `Trade` - Executed trades
- ✅ `TradingPerformance` - User trading performance metrics
- ✅ `TradingSession` - User trading sessions
- ✅ `MarketData` - Real-time market data
- ✅ `TechnicalIndicator` - Technical analysis indicators
- ✅ `Achievement` - 3 trading achievements
- ✅ `UserAchievement` - Achievement assignments to users

### Notification Models (1 model)
- ✅ `Notification` - Various notification types for all users

## File Structure

```
sample/
├── __init__.py
├── README.md
├── user_sample_data.py          # Language, UserProfile
├── security_sample_data.py      # SecuritySettings, UserSession
├── privacy_sample_data.py       # PrivacySettings
├── learning_sample_data.py      # Course, Lesson, Quiz, Badge, LearningProgress + UserLessonProgress, UserQuizAttempt, UserQuizAnswer
├── trading_sample_data.py       # Stock, Portfolio, Achievement + StockPrice, UserWatchlist, PortfolioHolding, Order, Trade, TradingPerformance, TradingSession, MarketData, TechnicalIndicator
└── notifications_sample_data.py # Notification
```

## Model Categories

### 1. User Models (`user_sample_data.py`)
- **Language**: 10 Indian languages (English, Hindi, Tamil, etc.)
- **UserProfile**: 10 sample users with diverse profiles
  - Different risk profiles (conservative, moderate, aggressive)
  - Various experience levels (beginner, intermediate, advanced)
  - Realistic learning goals and experience points

### 2. Security Models (`security_sample_data.py`)
- **SecuritySettings**: Security preferences for users
  - Two-factor authentication settings
  - Biometric settings
  - Session timeout configurations
- **UserSession**: Active and inactive user sessions
  - Different devices and browsers
  - Various IP addresses and user agents

### 3. Privacy Models (`privacy_sample_data.py`)
- **PrivacySettings**: Privacy preferences for users
  - Profile visibility settings
  - Activity visibility settings
  - Data sharing preferences

### 4. Learning Models (`learning_sample_data.py`)
- **Course**: 4 comprehensive courses
  - Stock Market Fundamentals (beginner)
  - Portfolio Diversification Mastery (intermediate)
  - Advanced Risk Management (advanced)
  - Mutual Funds & ETFs Deep Dive (intermediate)
- **Lesson**: Multiple lessons per course with realistic content
- **UserLessonProgress**: Individual progress tracking for each user-lesson combination
- **Quiz**: Multiple quizzes per lesson with time limits and passing scores
- **Question**: Various question types (multiple choice, true/false)
- **Answer**: Answer options with correct/incorrect flags
- **UserQuizAttempt**: User quiz attempts with scores and timing
- **UserQuizAnswer**: Individual user answers to quiz questions
- **Badge**: 4 learning badges (First Steps, Course Champion, Quiz Master, Knowledge Seeker)
- **LearningProgress**: Overall learning progress tracking for all users

### 5. Trading Models (`trading_sample_data.py`)
- **Stock**: 5 major Indian stocks (RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK)
  - Real market capitalization data
  - Sector and industry information
- **StockPrice**: 30 days of historical price data for each stock
  - OHLCV data (Open, High, Low, Close, Volume)
- **UserWatchlist**: Stock watchlists for each user
- **Portfolio**: Investment portfolios for all users
  - Realistic portfolio values and cash balances
- **PortfolioHolding**: Individual stock holdings in portfolios
  - Quantity, average price, market value, unrealized P&L
- **Order**: Trading orders (Market, Limit, Buy, Sell)
  - Various order types and statuses
- **Trade**: Executed trades with commission and net amounts
- **TradingPerformance**: User trading performance metrics
  - Success rates, profit/loss, best/worst trades
- **TradingSession**: User trading sessions for analysis
- **MarketData**: Real-time market data for each stock
  - Current prices, changes, volume, PE ratios
- **TechnicalIndicator**: Technical analysis indicators
  - RSI, MACD, Moving Averages, Bollinger Bands, Stochastic
- **Achievement**: 3 trading achievements (First Trade, Profit Milestone, 10 Trades)

### 6. Notification Models (`notifications_sample_data.py`)
- **Notification**: Various notification types
  - Welcome messages, course completions, security alerts
  - Portfolio updates, quiz reminders, market alerts

## Usage

### Running the Complete Sample Data Population

```bash
cd investa_backend
python populate_sample_data.py
```

This will:
1. Reset existing data (safely)
2. Create all sample data in the correct order
3. Establish relationships between models
4. Provide a comprehensive testing environment

### Individual Model Population

You can also import and use individual functions:

```python
from api.sample.user_sample_data import create_languages, create_users_and_profiles
from api.sample.learning_sample_data import create_courses, create_badges, create_user_lesson_progress
from api.sample.trading_sample_data import create_stocks, create_stock_prices, create_portfolio_holdings

# Create languages first
languages = create_languages()

# Create users with profiles
users = create_users_and_profiles(languages)

# Create courses
courses = create_courses(languages)

# Create stocks and historical data
stocks = create_stocks()
stock_prices = create_stock_prices(stocks)

# Create portfolio holdings
portfolios = create_portfolios(users)
holdings = create_portfolio_holdings(portfolios, stocks)
```

## Sample Data Features

### Realistic Data
- All data is realistic and follows real-world patterns
- Indian market context (NSE stocks, Indian languages)
- Proper relationships between models
- Varied user profiles and preferences

### Comprehensive Coverage
- **ALL 29 models** have sample data
- Multiple records per model
- Interconnected relationships
- Different difficulty levels and categories

### Testing Ready
- Users have test passwords (`testpass123`)
- All data is properly linked
- Ready for API testing and frontend development
- Includes edge cases and variations

## Data Relationships

The sample data maintains proper relationships:

1. **Users** → **Profiles** → **Security/Privacy Settings**
2. **Users** → **Learning Progress** → **Courses** → **Lessons** → **UserLessonProgress**
3. **Users** → **Quizzes** → **UserQuizAttempt** → **UserQuizAnswer**
4. **Users** → **Portfolios** → **PortfolioHolding** → **Stocks**
5. **Users** → **Orders** → **Trades** → **Stocks**
6. **Users** → **Watchlists** → **Stocks**
7. **Stocks** → **StockPrice** (historical data)
8. **Stocks** → **MarketData** (real-time data)
9. **Stocks** → **TechnicalIndicator** (analysis data)
10. **Users** → **Badges/Achievements** (many-to-many)
11. **Users** → **Notifications** (one-to-many)
12. **Users** → **TradingPerformance** (one-to-one)
13. **Users** → **TradingSession** (one-to-many)

## Customization

Each sample data file can be easily customized:

1. **Add more records**: Extend the data arrays
2. **Modify existing data**: Update the data structures
3. **Add new fields**: Update both data and creation functions
4. **Change relationships**: Modify the creation logic

## Testing Credentials

After running the sample data population, you can test with:

- **Email**: `john@example.com`
- **Password**: `testpass123`

Or any of the other 9 sample users with the same password.

## Database Reset

The main script includes a safe reset function that:
- Deletes data in the correct order (respecting foreign keys)
- Preserves Django's built-in user authentication
- Provides clear feedback on what's being deleted
- Uses database transactions for safety

## Next Steps

1. Run the sample data population script
2. Test the API endpoints with the sample data
3. Verify all relationships are working correctly
4. Use the data for frontend development and testing
5. Customize the data as needed for your specific use cases

## 📊 **COMPLETE DATA SUMMARY**

The system creates:
- **10 languages** and **10 users** with profiles
- **4 courses** with **multiple lessons** and **quizzes**
- **5 stocks** with **30 days historical data** and **real-time market data**
- **Portfolios** with **holdings** for all users
- **Trading orders** and **executed trades**
- **Technical indicators** for all stocks
- **Learning progress** and **quiz attempts** for all users
- **Badges** and **achievements** with user assignments
- **Security settings**, **privacy settings**, and **user sessions**
- **Multiple notifications** per user
- **Trading performance** tracking and **trading sessions**

**Total: 29 models with comprehensive, interconnected sample data!**

## 🔗 **DATA CONNECTIVITY & RELATIONSHIPS**

### **Ensured Data Connections:**

1. **User Ecosystem**
   - Every user has a complete profile, security settings, privacy settings
   - Each user has learning progress, portfolio, and trading performance
   - User sessions are properly linked to users

2. **Learning Ecosystem**
   - Courses → Lessons → Quizzes → Questions → Answers (complete chain)
   - UserLessonProgress tracks individual user progress through lessons
   - UserQuizAttempt and UserQuizAnswer track quiz performance
   - LearningProgress aggregates overall user learning metrics

3. **Trading Ecosystem**
   - Stocks have historical prices, market data, and technical indicators
   - Portfolios contain holdings with current market values
   - Orders generate trades with proper relationships
   - TradingPerformance reflects actual trading activity
   - UserWatchlist connects users to stocks they're monitoring

4. **Achievement System**
   - Users earn badges based on learning progress
   - Users earn achievements based on trading activity
   - All assignments are properly linked

5. **Data Consistency**
   - Portfolio values are calculated from holdings and market data
   - Trading performance reflects actual trades and portfolio values
   - Learning progress reflects actual lesson completion and quiz scores

### **Verification Script**

Run the verification script to ensure all data is properly connected:

```bash
cd investa_backend
python verify_data_connectivity.py
```

This script will:
- ✅ Verify all user relationships exist
- ✅ Check learning ecosystem connections
- ✅ Validate trading data relationships
- ✅ Confirm badge/achievement assignments
- ✅ Test data consistency across models
- ✅ Report any missing or broken relationships

### **Key Data Relationships Maintained:**

- **One-to-One**: User ↔ Profile, User ↔ Portfolio, User ↔ TradingPerformance
- **One-to-Many**: Course → Lessons, Lesson → Quizzes, User → Orders
- **Many-to-Many**: User ↔ Badges (via UserBadge), User ↔ Stocks (via UserWatchlist)
- **Complex Relationships**: Orders → Trades, Portfolio → Holdings → Stocks

### **Data Flow:**

1. **User Creation** → Profile, Security, Privacy, Learning Progress, Portfolio, Trading Performance
2. **Course Creation** → Lessons → Quizzes → Questions → Answers
3. **Stock Creation** → Historical Prices → Market Data → Technical Indicators
4. **Portfolio Creation** → Holdings → Market Value Updates
5. **Order Creation** → Trade Execution → Performance Updates
6. **Progress Tracking** → Badge/Achievement Assignment

All data is interconnected and maintains referential integrity throughout the system!
