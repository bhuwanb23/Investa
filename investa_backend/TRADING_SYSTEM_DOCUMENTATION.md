# Trading System Documentation

## Overview

The Investa trading system is a comprehensive platform that allows users to:
- Track stocks and market data
- Manage portfolios and holdings
- Place and manage trading orders
- View trading performance and leaderboards
- Earn achievements based on trading activity

## System Architecture

### Backend Models

#### 1. Stock Management
- **Stock**: Core stock information (symbol, name, exchange, sector, industry)
- **StockPrice**: Historical price data (OHLCV)
- **MarketData**: Real-time market data (current price, change, volume, etc.)
- **TechnicalIndicator**: Technical analysis indicators (RSI, MACD, etc.)

#### 2. Portfolio Management
- **Portfolio**: User's overall portfolio (total value, invested amount, P&L)
- **PortfolioHolding**: Individual stock positions (quantity, average price, current value)

#### 3. Trading Operations
- **Order**: Trading orders (buy/sell, market/limit, status tracking)
- **Trade**: Executed trades (fill details, commissions, timestamps)
- **TradingSession**: User trading sessions for analytics

#### 4. Performance & Analytics
- **TradingPerformance**: User performance metrics (success rate, P&L, etc.)
- **Achievement**: Available achievements and criteria
- **UserAchievement**: User's earned achievements

#### 5. User Features
- **UserWatchlist**: User's stock watchlist

### Frontend Integration

The frontend trading screens are fully integrated with the backend:

#### MarketWatchlistScreen
- Displays user's watchlist stocks
- Shows market data and price changes
- Allows adding/removing stocks from watchlist

#### PortfolioScreen
- Shows portfolio summary and holdings
- Displays P&L, returns, and performance metrics
- Lists individual stock positions

#### OrderHistoryScreen
- Lists all trading orders with status
- Shows order details and execution history
- Allows order cancellation

#### PlaceOrderScreen
- Order placement interface
- Supports market and limit orders
- Order validation and confirmation

#### LeaderboardScreen
- User rankings based on performance
- Multiple timeframe views
- Performance metrics comparison

#### StockDetailScreen
- Comprehensive stock information
- Market data and technical indicators
- Trading actions (buy/sell, add to watchlist)

## API Endpoints

### Stock Management
```
GET /api/stocks/ - List all stocks
GET /api/stocks/{id}/ - Get stock details
GET /api/stocks/{id}/market_data/ - Get market data
GET /api/stocks/{id}/technical_indicators/ - Get technical indicators
GET /api/stocks/{id}/price_history/ - Get price history
```

### Watchlist Management
```
GET /api/watchlist/my_watchlist/ - Get user's watchlist
POST /api/watchlist/add_stock/ - Add stock to watchlist
DELETE /api/watchlist/{id}/ - Remove from watchlist
```

### Portfolio Management
```
GET /api/portfolio/my_portfolio/ - Get portfolio summary
GET /api/portfolio/holdings/ - Get portfolio holdings
```

### Order Management
```
GET /api/orders/ - List user's orders
POST /api/orders/ - Create new order
GET /api/orders/order_history/ - Get order history
POST /api/orders/{id}/cancel_order/ - Cancel order
```

### Trading Performance
```
GET /api/trading-performance/my_performance/ - Get user performance
GET /api/trading-performance/leaderboard/ - Get leaderboard
```

### Market Data
```
GET /api/market-data/top_movers/ - Get top gainers/losers
GET /api/market-data/market_summary/ - Get market summary
```

### Achievements
```
GET /api/achievements/my_achievements/ - Get user achievements
GET /api/achievements/available_achievements/ - Get all achievements
```

## Data Flow

### 1. Stock Data Flow
1. External market data feeds update `StockPrice` and `MarketData`
2. Technical indicators are calculated and stored in `TechnicalIndicator`
3. Frontend fetches data through API endpoints
4. Real-time updates via WebSocket (future enhancement)

### 2. Order Execution Flow
1. User places order through frontend
2. Order is created with 'PENDING' status
3. Order matching engine processes orders (simulated)
4. Orders are filled and `Trade` records are created
5. Portfolio and performance metrics are updated
6. User receives notifications about order status

### 3. Portfolio Update Flow
1. Stock prices change in `MarketData`
2. Portfolio calculations are triggered
3. `PortfolioHolding` values are recalculated
4. `Portfolio` totals are updated
5. Performance metrics are recalculated
6. Frontend displays updated values

## Key Features

### 1. Real-time Market Data
- Current prices and 24h changes
- Volume and market cap information
- Technical indicators (RSI, MACD, moving averages)

### 2. Portfolio Tracking
- Real-time portfolio value calculation
- Unrealized P&L tracking
- Performance metrics and returns
- Position sizing and risk management

### 3. Order Management
- Multiple order types (Market, Limit, Stop, Stop-Limit)
- Order status tracking
- Partial fills support
- Commission tracking

### 4. Performance Analytics
- Success rate calculation
- Average return per trade
- Best/worst trade tracking
- Portfolio growth metrics

### 5. Achievement System
- Trading milestones (first trade, 100 trades, etc.)
- Performance achievements (10% return, etc.)
- Volume achievements (high volume trader)
- Social achievements (top performer)

## Security & Validation

### Order Validation
- Quantity must be positive
- Price validation for limit orders
- Stop price validation for stop orders
- User balance verification
- Stock availability checking

### Data Integrity
- Foreign key constraints
- Unique constraints on symbols
- Transaction-based updates
- Audit trails for all changes

### User Permissions
- Users can only access their own data
- Portfolio isolation between users
- Order ownership verification
- Watchlist privacy

## Future Enhancements

### 1. Real-time Trading
- WebSocket connections for live data
- Real-time order execution
- Live portfolio updates
- Market alerts and notifications

### 2. Advanced Analytics
- Risk metrics (Sharpe ratio, VaR)
- Portfolio optimization suggestions
- Technical analysis tools
- Backtesting capabilities

### 3. Social Features
- Copy trading
- Social sentiment analysis
- Community discussions
- Trading challenges

### 4. Mobile Optimization
- Push notifications
- Offline data caching
- Touch-optimized interfaces
- Biometric authentication

## Development Notes

### Database Migrations
Run migrations after model changes:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Testing
Test the trading system:
```bash
python manage.py test api.tests.test_trading
```

### Sample Data
Populate with sample data:
```bash
python manage.py shell
from api.models.trading import *
# Create sample stocks, orders, etc.
```

### API Testing
Use the Django admin interface or tools like Postman to test endpoints.

## Troubleshooting

### Common Issues

1. **Orders not executing**: Check order status and validation
2. **Portfolio not updating**: Verify market data is current
3. **API errors**: Check authentication and permissions
4. **Performance issues**: Monitor database queries and indexing

### Debug Mode
Enable debug logging in Django settings for detailed API information.

### Monitoring
Monitor key metrics:
- Order execution times
- API response times
- Database query performance
- Error rates and types

## Conclusion

The Investa trading system provides a robust foundation for stock trading and portfolio management. The modular architecture allows for easy expansion and the comprehensive API supports all frontend requirements. The system is designed to be scalable, secure, and user-friendly while maintaining data integrity and performance.
