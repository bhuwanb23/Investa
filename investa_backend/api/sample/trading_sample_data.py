#!/usr/bin/env python
"""
Sample data for Trading models
"""

from decimal import Decimal
from datetime import datetime, timedelta, date
from django.contrib.auth.models import User

# Stock sample data
STOCK_DATA = [
    {
        'symbol': 'RELIANCE',
        'name': 'Reliance Industries Limited',
        'exchange': 'NSE',
        'sector': 'Oil & Gas',
        'industry': 'Refineries',
        'market_cap': Decimal('15000000000000')
    },
    {
        'symbol': 'TCS',
        'name': 'Tata Consultancy Services Limited',
        'exchange': 'NSE',
        'sector': 'Technology',
        'industry': 'IT Services',
        'market_cap': Decimal('12000000000000')
    },
    {
        'symbol': 'HDFCBANK',
        'name': 'HDFC Bank Limited',
        'exchange': 'NSE',
        'sector': 'Banking',
        'industry': 'Private Banks',
        'market_cap': Decimal('10000000000000')
    },
    {
        'symbol': 'INFY',
        'name': 'Infosys Limited',
        'exchange': 'NSE',
        'sector': 'Technology',
        'industry': 'IT Services',
        'market_cap': Decimal('8000000000000')
    },
    {
        'symbol': 'ICICIBANK',
        'name': 'ICICI Bank Limited',
        'exchange': 'NSE',
        'sector': 'Banking',
        'industry': 'Private Banks',
        'market_cap': Decimal('7000000000000')
    }
]

# Achievement sample data
ACHIEVEMENT_DATA = [
    {
        'name': 'First Trade',
        'description': 'Complete your first stock trade',
        'achievement_type': 'FIRST_TRADE',
        'icon_name': 'first-trade',
        'color': '#10B981',
        'criteria_value': Decimal('0')
    },
    {
        'name': 'Profit Milestone ₹1000',
        'description': 'Achieve ₹1000 in total profits',
        'achievement_type': 'PROFIT_MILESTONE',
        'icon_name': 'profit-1000',
        'color': '#3B82F6',
        'criteria_value': Decimal('1000')
    },
    {
        'name': '10 Trades',
        'description': 'Complete 10 trades',
        'achievement_type': 'TRADE_COUNT',
        'icon_name': 'trade-10',
        'color': '#F59E0B',
        'criteria_value': Decimal('10')
    }
]

def create_stocks():
    """Create stock objects"""
    from api.models import Stock
    
    stocks = []
    for stock_data in STOCK_DATA:
        stock, created = Stock.objects.get_or_create(
            symbol=stock_data['symbol'],
            defaults=stock_data
        )
        stocks.append(stock)
        if created:
            print(f"✅ Created stock: {stock.symbol} - {stock.name}")
    
    return stocks

def create_portfolios(users):
    """Create portfolio objects for users"""
    from api.models import Portfolio
    
    portfolios = []
    for user in users:
        portfolio, created = Portfolio.objects.get_or_create(
            user=user,
            defaults={
                'total_value': Decimal('15000.00'),
                'total_invested': Decimal('10000.00'),
                'total_profit_loss': Decimal('5000.00'),
                'cash_balance': Decimal('5000.00')
            }
        )
        
        if created:
            print(f"✅ Created portfolio for: {user.username}")
        
        portfolios.append(portfolio)
    
    return portfolios

def create_achievements():
    """Create achievement objects"""
    from api.models import Achievement
    
    achievements = []
    for achievement_data in ACHIEVEMENT_DATA:
        achievement, created = Achievement.objects.get_or_create(
            name=achievement_data['name'],
            defaults=achievement_data
        )
        achievements.append(achievement)
        if created:
            print(f"✅ Created achievement: {achievement.name}")
    
    return achievements

def create_stock_prices(stocks):
    """Create historical stock prices"""
    from api.models import StockPrice
    
    prices_created = 0
    created_prices = []
    for stock in stocks:
        # Create 30 days of historical data
        for i in range(30):
            price_date = date.today() - timedelta(days=i)
            base_price = Decimal('1000.00') + (Decimal(str(i * 10)))
            
            # Add some price variation
            open_price = base_price + Decimal(str((i % 5) * 5))
            high_price = open_price + Decimal('25.00')
            low_price = open_price - Decimal('15.00')
            close_price = open_price + Decimal(str((i % 3 - 1) * 10))
            volume = 1000000 + (i * 50000)
            
            price, created = StockPrice.objects.get_or_create(
                stock=stock,
                date=price_date,
                defaults={
                    'open_price': open_price,
                    'high_price': high_price,
                    'low_price': low_price,
                    'close_price': close_price,
                    'volume': volume
                }
            )
            
            if created:
                prices_created += 1
                created_prices.append(price)
    
    print(f"   📊 Created {prices_created} stock price records")
    return created_prices

def create_user_watchlists(users, stocks):
    """Create user watchlists"""
    from api.models import UserWatchlist
    
    watchlist_items = 0
    created_watchlists = []
    for i, user in enumerate(users):
        # Add 1-3 stocks to each user's watchlist
        num_stocks = min(1 + (i % 3), len(stocks))
        user_stocks = stocks[:num_stocks]
        
        for stock in user_stocks:
            watchlist_item, created = UserWatchlist.objects.get_or_create(
                user=user,
                stock=stock
            )
            
            if created:
                watchlist_items += 1
                created_watchlists.append(watchlist_item)
                print(f"   ✅ Added {stock.symbol} to {user.username}'s watchlist")
    
    print(f"   📊 Created {watchlist_items} watchlist items")
    return created_watchlists

def create_portfolio_holdings(portfolios, stocks):
    """Create portfolio holdings"""
    from api.models import PortfolioHolding
    
    holdings_created = 0
    created_holdings = []
    for i, portfolio in enumerate(portfolios):
        # Give each portfolio 1-3 stock holdings
        num_holdings = min(1 + (i % 3), len(stocks))
        portfolio_stocks = stocks[:num_holdings]
        
        for j, stock in enumerate(portfolio_stocks):
            quantity = 10 + (i * 5) + (j * 10)
            average_price = Decimal('1000.00') + (Decimal(str(i * 50)))
            total_invested = average_price * quantity
            current_price = average_price + (Decimal(str((i + j) % 100 - 50)))
            market_value = current_price * quantity
            unrealized_pnl = market_value - total_invested
            
            holding, created = PortfolioHolding.objects.get_or_create(
                portfolio=portfolio,
                stock=stock,
                defaults={
                    'quantity': quantity,
                    'average_price': average_price,
                    'total_invested': total_invested,
                    'current_price': current_price,
                    'market_value': market_value,
                    'unrealized_pnl': unrealized_pnl
                }
            )
            
            if created:
                holdings_created += 1
                created_holdings.append(holding)
                print(f"   ✅ Created holding for {portfolio.user.username}: {stock.symbol} ({quantity} shares)")
    
    print(f"   📊 Created {holdings_created} portfolio holdings")
    return created_holdings

def create_orders_and_trades(users, stocks):
    """Create orders and trades"""
    from api.models import Order, Trade
    
    orders_created = 0
    trades_created = 0
    created_orders = []
    created_trades = []
    
    for i, user in enumerate(users):
        # Create 2-5 orders per user
        num_orders = 2 + (i % 4)
        user_stocks = stocks[:min(3, len(stocks))]
        
        for j in range(num_orders):
            stock = user_stocks[j % len(user_stocks)]
            order_type = 'MARKET' if j % 2 == 0 else 'LIMIT'
            side = 'BUY' if j % 2 == 0 else 'SELL'
            quantity = 10 + (j * 5)
            price = Decimal('1000.00') + (Decimal(str((i + j) * 10)))
            
            order, order_created = Order.objects.get_or_create(
                user=user,
                stock=stock,
                order_type=order_type,
                side=side,
                quantity=quantity,
                defaults={
                    'price': price if order_type == 'LIMIT' else None,
                    'filled_quantity': quantity,
                    'average_fill_price': price,
                    'status': 'FILLED',
                    'total_amount': price * quantity,
                    'commission': Decimal('20.00'),
                    'filled_at': datetime.now() - timedelta(days=j+1)
                }
            )
            
            if order_created:
                orders_created += 1
                created_orders.append(order)
                print(f"   ✅ Created order for {user.username}: {side} {quantity} {stock.symbol}")
                
                # Create corresponding trade
                trade, trade_created = Trade.objects.get_or_create(
                    order=order,
                    user=user,
                    stock=stock,
                    quantity=quantity,
                    price=price,
                    side=side,
                    defaults={
                        'total_amount': price * quantity,
                        'commission': Decimal('20.00'),
                        'net_amount': (price * quantity) - Decimal('20.00')
                    }
                )
                
                if trade_created:
                    trades_created += 1
                    created_trades.append(trade)
    
    print(f"   📊 Created {orders_created} orders and {trades_created} trades")
    return created_orders, created_trades

def create_trading_performance(users):
    """Create trading performance records"""
    from api.models import TradingPerformance
    
    performance_records = []
    for i, user in enumerate(users):
        portfolio_value = Decimal('15000.00') + (Decimal(str(i * 1000)))
        portfolio_growth = Decimal('5.00') + (Decimal(str(i * 2)))
        total_trades = 5 + (i * 3)
        successful_trades = 3 + (i * 2)
        total_profit_loss = Decimal('500.00') + (Decimal(str(i * 100)))
        
        performance, created = TradingPerformance.objects.get_or_create(
            user=user,
            defaults={
                'portfolio_value': portfolio_value,
                'portfolio_growth_percentage': portfolio_growth,
                'total_trades': total_trades,
                'successful_trades': successful_trades,
                'total_profit_loss': total_profit_loss,
                'best_trade_profit': Decimal('200.00'),
                'worst_trade_loss': Decimal('-50.00'),
                'total_commission_paid': Decimal('100.00'),
                'average_trade_size': Decimal('1000.00'),
                'largest_position': Decimal('5000.00')
            }
        )
        
        if created:
            print(f"   ✅ Created trading performance for: {user.username}")
        
        performance_records.append(performance)
    
    print(f"   📊 Created {len(performance_records)} trading performance records")
    return performance_records

def create_trading_sessions(users):
    """Create trading sessions"""
    from api.models import TradingSession
    
    sessions_created = 0
    created_sessions = []
    for i, user in enumerate(users):
        # Create 2-4 trading sessions per user
        num_sessions = 2 + (i % 3)
        
        for j in range(num_sessions):
            start_time = datetime.now() - timedelta(days=j+1, hours=j*2)
            end_time = start_time + timedelta(hours=2)
            trades_count = 3 + (j * 2)
            profit_loss = Decimal('100.00') + (Decimal(str((i + j) * 50)))
            
            session, created = TradingSession.objects.get_or_create(
                user=user,
                start_time=start_time,
                defaults={
                    'end_time': end_time,
                    'trades_count': trades_count,
                    'profit_loss': profit_loss,
                    'is_active': False
                }
            )
            
            if created:
                sessions_created += 1
                created_sessions.append(session)
                print(f"   ✅ Created trading session for {user.username}: {start_time.date()}")
    
    print(f"   📊 Created {sessions_created} trading sessions")
    return created_sessions

def create_market_data(stocks):
    """Create market data records"""
    from api.models import MarketData
    
    market_data_created = 0
    created_market_data = []
    for i, stock in enumerate(stocks):
        current_price = Decimal('1000.00') + (Decimal(str(i * 100)))
        change_amount = Decimal('10.00') + (Decimal(str(i * 5)))
        change_percentage = Decimal('1.5') + (Decimal(str(i * 0.5)))
        
        market_data, created = MarketData.objects.get_or_create(
            stock=stock,
            defaults={
                'current_price': current_price,
                'change_amount': change_amount,
                'change_percentage': change_percentage,
                'volume': 1000000 + (i * 500000),
                'high_24h': current_price + Decimal('50.00'),
                'low_24h': current_price - Decimal('30.00'),
                'open_24h': current_price - Decimal('10.00'),
                'previous_close': current_price - change_amount,
                'market_cap': stock.market_cap,
                'pe_ratio': Decimal('15.00') + (Decimal(str(i * 2))),
                'dividend_yield': Decimal('2.5') + (Decimal(str(i * 0.5)))
            }
        )
        
        if created:
            market_data_created += 1
            created_market_data.append(market_data)
            print(f"   ✅ Created market data for: {stock.symbol}")
    
    print(f"   📊 Created {market_data_created} market data records")
    return created_market_data

def create_technical_indicators(stocks):
    """Create technical indicators"""
    from api.models import TechnicalIndicator
    
    indicators_created = 0
    created_indicators = []
    indicator_names = ['RSI', 'MACD', 'Moving Average', 'Bollinger Bands', 'Stochastic']
    
    for stock in stocks:
        for indicator_name in indicator_names:
            value = Decimal('50.00') + (Decimal(str(hash(stock.symbol) % 50)))
            signal = 'Bullish' if value > 50 else 'Bearish' if value < 30 else 'Neutral'
            period = 14 if indicator_name == 'RSI' else 20 if indicator_name == 'Moving Average' else None
            
            indicator, created = TechnicalIndicator.objects.get_or_create(
                stock=stock,
                indicator_name=indicator_name,
                defaults={
                    'value': value,
                    'signal': signal,
                    'period': period
                }
            )
            
            if created:
                indicators_created += 1
                created_indicators.append(indicator)
                print(f"   ✅ Created {indicator_name} indicator for: {stock.symbol}")
    
    print(f"   📊 Created {indicators_created} technical indicators")
    return created_indicators
