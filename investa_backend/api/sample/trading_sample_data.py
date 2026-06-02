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
        'market_cap': Decimal('15000000000000'),  # 15 trillion market cap
        'description': "Reliance Industries Limited is India's largest private sector company, with businesses spanning oil & gas exploration, petroleum refining, petrochemicals, retail, digital services, and green energy. The conglomerate serves over 250 million customers across its retail and digital platforms.",
        'founded': '1966',
        'employees': '347,000',
        'headquarters': 'Mumbai, Maharashtra',
        'beta': Decimal('0.85'),
        'avg_volume': 7500000,
    },
    {
        'symbol': 'TCS',
        'name': 'Tata Consultancy Services Limited',
        'exchange': 'NSE',
        'sector': 'Technology',
        'industry': 'IT Services',
        'market_cap': Decimal('12000000000000'),  # 12 trillion market cap
        'description': "Tata Consultancy Services is a global leader in IT services, consulting, and business solutions. With operations in 55+ countries, TCS partners with leading enterprises to deliver digital transformation, cloud, AI, and cognitive computing services across industries.",
        'founded': '1968',
        'employees': '615,000',
        'headquarters': 'Mumbai, Maharashtra',
        'beta': Decimal('0.72'),
        'avg_volume': 1800000,
    },
    {
        'symbol': 'HDFCBANK',
        'name': 'HDFC Bank Limited',
        'exchange': 'NSE',
        'sector': 'Banking',
        'industry': 'Private Banks',
        'market_cap': Decimal('10000000000000'),  # 10 trillion market cap
        'description': "HDFC Bank is India's largest private sector bank by assets, offering a wide range of banking and financial services to retail and wholesale customers. The bank has a network of over 8,000 branches across India and a digital-first approach to banking.",
        'founded': '1994',
        'employees': '177,000',
        'headquarters': 'Mumbai, Maharashtra',
        'beta': Decimal('0.91'),
        'avg_volume': 8500000,
    },
    {
        'symbol': 'INFY',
        'name': 'Infosys Limited',
        'exchange': 'NSE',
        'sector': 'Technology',
        'industry': 'IT Services',
        'market_cap': Decimal('8000000000000'),   # 8 trillion market cap
        'description': "Infosys is a global digital services and consulting company that enables clients across 50+ countries to navigate their digital transformation. The firm specializes in cloud, data, AI, and enterprise modernization services for Fortune 500 clients.",
        'founded': '1981',
        'employees': '343,000',
        'headquarters': 'Bengaluru, Karnataka',
        'beta': Decimal('0.88'),
        'avg_volume': 6200000,
    },
    {
        'symbol': 'ICICIBANK',
        'name': 'ICICI Bank Limited',
        'exchange': 'NSE',
        'sector': 'Banking',
        'industry': 'Private Banks',
        'market_cap': Decimal('7000000000000'),   # 7 trillion market cap
        'description': "ICICI Bank is one of India's leading private sector banks, offering diversified financial services including retail banking, corporate banking, treasury, and digital banking. The bank serves over 70 million customers through its digital and physical channels.",
        'founded': '1994',
        'employees': '130,000',
        'headquarters': 'Mumbai, Maharashtra',
        'beta': Decimal('0.95'),
        'avg_volume': 9100000,
    }
]

# Realistic stock prices for each stock (per share)
STOCK_PRICES = {
    'RELIANCE': Decimal('2500.00'),    # ₹2,500 per share
    'TCS': Decimal('3800.00'),         # ₹3,800 per share
    'HDFCBANK': Decimal('1650.00'),    # ₹1,650 per share
    'INFY': Decimal('1450.00'),        # ₹1,450 per share
    'ICICIBANK': Decimal('950.00'),    # ₹950 per share
}

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
    """Create stock objects, updating existing with new fields"""
    from api.models import Stock

    stocks = []
    # Fields that should be refreshed on existing stocks (PR 2 fundamentals)
    update_fields = ['description', 'founded', 'employees', 'headquarters', 'beta', 'avg_volume']
    for stock_data in STOCK_DATA:
        stock, created = Stock.objects.get_or_create(
            symbol=stock_data['symbol'],
            defaults=stock_data
        )
        if not created:
            # Update existing stock with new PR 2 fields
            for f in update_fields:
                if f in stock_data and stock_data[f] is not None:
                    setattr(stock, f, stock_data[f])
            stock.save()
        stocks.append(stock)
        if created:
            print(f"✅ Created stock: {stock.symbol} - {stock.name}")
        else:
            print(f"🔄 Updated stock: {stock.symbol} with new fundamentals")

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
    """Create historical stock prices with 90 days of data and realistic fluctuations"""
    from api.models import StockPrice
    import random
    
    prices_created = 0
    created_prices = []
    for stock in stocks:
        # Get base price for this stock
        base_price = float(STOCK_PRICES.get(stock.symbol, Decimal('1000.00')))
        current_price = base_price
        
        # Create 90 days of historical data
        for i in range(90, 0, -1):
            price_date = date.today() - timedelta(days=i)
            
            # Apply small daily random fluctuations (-2% to +2%)
            change_percent = random.uniform(-0.02, 0.02)
            close_price = round(current_price * (1 + change_percent), 2)
            
            # Calculate OHLC prices
            # Open is previous close (current_price)
            open_price = current_price
            high_price = max(open_price, close_price) + round(random.uniform(0, current_price * 0.01), 2)
            low_price = min(open_price, close_price) - round(random.uniform(0, current_price * 0.01), 2)
            volume = random.randint(1000000, 5000000)
            
            price_obj, created = StockPrice.objects.get_or_create(
                stock=stock,
                date=price_date,
                defaults={
                    'open_price': Decimal(str(open_price)),
                    'high_price': Decimal(str(high_price)),
                    'low_price': Decimal(str(low_price)),
                    'close_price': Decimal(str(close_price)),
                    'volume': volume
                }
            )
            
            if created:
                prices_created += 1
                created_prices.append(price_obj)
            
            # Update current_price for next day
            current_price = close_price
    
    print(f"   📊 Created {prices_created} stock price records (90 days per stock)")
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
            
            # Use realistic stock price
            base_price = STOCK_PRICES.get(stock.symbol, Decimal('1000.00'))
            average_price = base_price + (Decimal(str((i + j) % 100 - 50)))
            total_invested = average_price * quantity
            
            # Current price with some variation
            current_price = base_price + (Decimal(str((i + j) % 50 - 25)))
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
                print(f"   ✅ Created holding for {portfolio.user.username}: {stock.symbol} ({quantity} shares @ ₹{current_price})")
    
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
            
            # Use realistic stock price
            base_price = STOCK_PRICES.get(stock.symbol, Decimal('1000.00'))
            price = base_price + (Decimal(str((i + j) * 10)))
            total_amount = price * quantity
            commission = Decimal('20.00')
            net_amount = total_amount - commission
            
            # Ensure we have valid values
            if total_amount <= 0:
                total_amount = price * quantity
            
            order, order_created = Order.objects.get_or_create(
                user=user,
                stock=stock,
                order_type=order_type,
                side=side,
                quantity=quantity,
                defaults={
                    'price': price,  # Always set price for all order types
                    'filled_quantity': quantity,
                    'average_fill_price': price,
                    'status': 'FILLED',
                    'total_amount': total_amount,
                    'commission': commission,
                    'filled_at': datetime.now() - timedelta(days=j+1)
                }
            )
            
            # Ensure total_amount is set correctly
            if order_created and not order.total_amount:
                order.total_amount = total_amount
                order.save()
            
            if order_created:
                orders_created += 1
                created_orders.append(order)
                print(f"   ✅ Created order for {user.username}: {side} {quantity} {stock.symbol} @ ₹{price} (Total: ₹{total_amount})")
                
                # Create corresponding trade
                trade, trade_created = Trade.objects.get_or_create(
                    order=order,
                    user=user,
                    stock=stock,
                    quantity=quantity,
                    price=price,
                    side=side,
                    defaults={
                        'total_amount': total_amount,
                        'commission': commission,
                        'net_amount': net_amount
                    }
                )
                
                if trade_created:
                    trades_created += 1
                    created_trades.append(trade)
                    print(f"      ✅ Created trade: {side} {quantity} {stock.symbol} @ ₹{price} (Net: ₹{net_amount})")
    
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
        # Use realistic stock price
        base_price = STOCK_PRICES.get(stock.symbol, Decimal('1000.00'))
        current_price = base_price + (Decimal(str(i * 10)))
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
            print(f"   ✅ Created market data for: {stock.symbol} @ ₹{current_price}")
    
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


# Stock news sample data (per symbol, 3-4 items each)
STOCK_NEWS_DATA = {
    'RELIANCE': [
        {
            'title': 'Reliance Jio announces 5G rollout in 50 more cities, takes total coverage to 85% of India',
            'source': 'Economic Times',
            'summary': 'Reliance Jio has expanded its 5G network to 50 additional cities, bringing standalone 5G coverage to 85% of the country. The telecom arm plans to complete pan-India coverage by end of FY25.',
            'url': 'https://economictimes.indiatimes.com/industry/telecom',
            'days_ago': 1,
        },
        {
            'title': 'Reliance Retail Q3 net profit jumps 18% YoY to ₹2,700 crore on festive demand',
            'source': 'Moneycontrol',
            'summary': 'Reliance Retail Ventures reported strong Q3 earnings, with net profit rising 18% year-on-year driven by festive season demand and store network expansion to 18,800 outlets.',
            'url': 'https://www.moneycontrol.com/news/business/earnings/',
            'days_ago': 3,
        },
        {
            'title': 'RIL AGM 2025: Mukesh Ambani to announce new energy giga-factories, Jio financial services roadmap',
            'source': 'Business Standard',
            'summary': 'Reliance Industries is expected to outline its new energy giga-factory timeline, Jio Financial Services roadmap, and retail IPO plans at the upcoming Annual General Meeting.',
            'url': 'https://www.business-standard.com/companies/news',
            'days_ago': 5,
        },
        {
            'title': 'Reliance-BP sanction second deepwater gas project in KG-D6 block at $1.6B',
            'source': 'Reuters',
            'summary': 'Reliance Industries and BP have approved a second deepwater gas project in the KG-D6 block, with an investment of $1.6 billion. First gas is expected in 2026.',
            'url': 'https://www.reuters.com/business/energy',
            'days_ago': 7,
        },
    ],
    'TCS': [
        {
            'title': 'TCS bags $1B multi-year deal from UK-based insurance major Aviva',
            'source': 'Mint',
            'summary': 'Tata Consultancy Services has won a $1 billion, 10-year contract from British insurer Aviva to manage its cloud transformation and digital infrastructure.',
            'url': 'https://www.livemint.com/companies/tcs',
            'days_ago': 1,
        },
        {
            'title': 'TCS Q3 net profit rises 8% YoY to ₹11,735 crore; declares Rs 18 interim dividend',
            'source': 'Moneycontrol',
            'summary': 'TCS reported a net profit of ₹11,735 crore for Q3 FY25, up 8% year-on-year. The IT major declared an interim dividend of ₹18 per share. Revenue grew 5.6% YoY in constant currency terms.',
            'url': 'https://www.moneycontrol.com/news/business/earnings/',
            'days_ago': 4,
        },
        {
            'title': 'TCS launches AI WisdomNext platform for enterprise GenAI adoption',
            'source': 'Economic Times',
            'summary': 'TCS has launched TCS AI WisdomNext, a platform that brings together multiple GenAI models, tools, and frameworks to help enterprises accelerate AI adoption at scale.',
            'url': 'https://economictimes.indiatimes.com/tech/software',
            'days_ago': 9,
        },
    ],
    'HDFCBANK': [
        {
            'title': 'HDFC Bank Q3 net profit jumps 33% YoY to ₹16,372 crore on strong loan growth',
            'source': 'Business Standard',
            'summary': "HDFC Bank's net profit for Q3 FY25 rose 33% year-on-year to ₹16,372 crore, beating analyst estimates. Net interest income grew 7% as the bank's loan book expanded after the HDFC Ltd merger.",
            'url': 'https://www.business-standard.com/companies/banking',
            'days_ago': 2,
        },
        {
            'title': 'HDFC Bank raises FD interest rates by up to 20 bps across tenors effective today',
            'source': 'Economic Times',
            'summary': 'HDFC Bank has increased fixed deposit interest rates by up to 20 basis points across various tenors with effect from today. Senior citizens will earn 50 bps extra.',
            'url': 'https://economictimes.indiatimes.com/industry/banking/finance/banking',
            'days_ago': 6,
        },
        {
            'title': 'HDFC Bank gets RBI nod to raise ₹50,000 crore via infra bond issuance in FY26',
            'source': 'Mint',
            'summary': 'The Reserve Bank of India has approved HDFC Bank\'s plan to raise up to ₹50,000 crore through infrastructure bonds in FY26, supporting its long-term loan book growth.',
            'url': 'https://www.livemint.com/industry/banking',
            'days_ago': 10,
        },
    ],
    'INFY': [
        {
            'title': 'Infosys partners with Nvidia to accelerate enterprise GenAI adoption globally',
            'source': 'Reuters',
            'summary': "Infosys has expanded its partnership with Nvidia to build generative AI solutions for enterprises. The collaboration will leverage Nvidia's AI Enterprise software stack with Infosys Topaz platform.",
            'url': 'https://www.reuters.com/technology',
            'days_ago': 2,
        },
        {
            'title': 'Infosys Q3 net profit rises 11% YoY to ₹6,806 crore, raises FY25 revenue guidance',
            'source': 'Moneycontrol',
            'summary': "Infosys posted Q3 net profit of ₹6,806 crore, up 11% year-on-year. The IT major raised its FY25 revenue growth guidance to 3.75-4.5% in constant currency, citing strong deal momentum.",
            'url': 'https://www.moneycontrol.com/news/business/earnings/',
            'days_ago': 5,
        },
        {
            'title': 'Infosys wins multi-year deal with US financial services firm Liberty Mutual',
            'source': 'Economic Times',
            'summary': 'Infosys has secured a multi-year digital transformation deal with US-based Liberty Mutual Insurance worth over $400 million, focusing on cloud migration and AI-led customer experience.',
            'url': 'https://economictimes.indiatimes.com/tech/it',
            'days_ago': 8,
        },
    ],
    'ICICIBANK': [
        {
            'title': 'ICICI Bank Q3 net profit up 23% YoY to ₹11,792 crore on robust NII growth',
            'source': 'Business Standard',
            'summary': "ICICI Bank reported a 23% year-on-year jump in Q3 net profit to ₹11,792 crore, driven by strong net interest income growth and stable asset quality. GNPA fell to 2.16%.",
            'url': 'https://www.business-standard.com/companies/banking',
            'days_ago': 3,
        },
        {
            'title': 'ICICI Bank raises ₹3,500 crore via infrastructure bonds at 7.67% coupon',
            'source': 'Mint',
            'summary': 'ICICI Bank has raised ₹3,500 crore through infrastructure bonds at a coupon rate of 7.67%. The bond issue received strong response from insurance companies and pension funds.',
            'url': 'https://www.livemint.com/industry/banking',
            'days_ago': 7,
        },
        {
            'title': "ICICI Bank to deploy 50,000-strong salesforce for cross-selling wealth, insurance products",
            'source': 'Economic Times',
            'summary': "ICICI Bank plans to deploy a 50,000-strong sales team across branches to cross-sell wealth management and insurance products as it targets a 25% growth in non-interest income.",
            'url': 'https://economictimes.indiatimes.com/industry/banking/finance/banking',
            'days_ago': 11,
        },
    ],
}


# Indian market index sample data
MARKET_INDEX_DATA = [
    {
        'name': 'NIFTY 50',
        'value': Decimal('19674.25'),
        'change_amount': Decimal('124.75'),
        'change_percentage': Decimal('0.64'),
    },
    {
        'name': 'SENSEX',
        'value': Decimal('65982.48'),
        'change_amount': Decimal('456.32'),
        'change_percentage': Decimal('0.70'),
    },
    {
        'name': 'BANK NIFTY',
        'value': Decimal('44123.67'),
        'change_amount': Decimal('-89.45'),
        'change_percentage': Decimal('-0.20'),
    },
    {
        'name': 'NIFTY IT',
        'value': Decimal('33456.80'),
        'change_amount': Decimal('178.45'),
        'change_percentage': Decimal('0.54'),
    },
    {
        'name': 'NIFTY AUTO',
        'value': Decimal('18924.15'),
        'change_amount': Decimal('-23.40'),
        'change_percentage': Decimal('-0.12'),
    },
]


def create_stock_news(stocks):
    """Create stock-specific news items"""
    from api.models import StockNews
    from django.utils import timezone

    news_created = 0
    created_news = []
    now = timezone.now()

    for stock in stocks:
        news_items = STOCK_NEWS_DATA.get(stock.symbol, [])
        for item in news_items:
            published_at = now - timedelta(days=item.get('days_ago', 1))
            news_obj, created = StockNews.objects.get_or_create(
                stock=stock,
                title=item['title'],
                defaults={
                    'source': item['source'],
                    'summary': item.get('summary', ''),
                    'url': item.get('url', ''),
                    'published_at': published_at,
                }
            )
            if created:
                news_created += 1
                created_news.append(news_obj)
                print(f"   📰 News for {stock.symbol}: {item['title'][:60]}...")

    print(f"   📊 Created {news_created} stock news items")
    return created_news


def create_market_indices():
    """Create Indian market index records"""
    from api.models import MarketIndex
    from django.utils import timezone

    indices_created = 0
    created_indices = []
    now = timezone.now()

    for index_data in MARKET_INDEX_DATA:
        index, created = MarketIndex.objects.get_or_create(
            name=index_data['name'],
            defaults={
                'value': index_data['value'],
                'change_amount': index_data['change_amount'],
                'change_percentage': index_data['change_percentage'],
                'as_of': now,
            }
        )
        if created:
            indices_created += 1
            created_indices.append(index)
            print(f"   📈 Created index: {index.name} = {index.value}")

    print(f"   📊 Created {indices_created} market indices")
    return created_indices
