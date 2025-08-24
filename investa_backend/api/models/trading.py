from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal


class Stock(models.Model):
    """Stock/Company information"""
    symbol = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=200)
    exchange = models.CharField(max_length=10, default='NSE')  # NSE, BSE, etc.
    sector = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.symbol} - {self.name}"


class StockPrice(models.Model):
    """Historical stock prices"""
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='prices')
    date = models.DateField()
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    high_price = models.DecimalField(max_digits=10, decimal_places=2)
    low_price = models.DecimalField(max_digits=10, decimal_places=2)
    close_price = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['stock', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.stock.symbol} - {self.date} - ₹{self.close_price}"


class UserWatchlist(models.Model):
    """User's stock watchlist"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='watchers')
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'stock']
    
    def __str__(self):
        return f"{self.user.username} - {self.stock.symbol}"


class Portfolio(models.Model):
    """User's investment portfolio"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='portfolio')
    total_value = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    total_invested = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    total_profit_loss = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    cash_balance = models.DecimalField(max_digits=15, decimal_places=2, default=10000.00)  # Starting cash
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def total_return_percentage(self):
        if self.total_invested == 0:
            return 0
        return round((self.total_profit_loss / self.total_invested) * 100, 2)
    
    def __str__(self):
        return f"{self.user.username}'s Portfolio"


class PortfolioHolding(models.Model):
    """Individual stock holdings in portfolio"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='holdings')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='portfolio_holdings')
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    average_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_invested = models.DecimalField(max_digits=15, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    market_value = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    unrealized_pnl = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def return_percentage(self):
        if self.total_invested == 0:
            return 0
        return round((self.unrealized_pnl / self.total_invested) * 100, 2)
    
    def __str__(self):
        return f"{self.portfolio.user.username} - {self.stock.symbol} ({self.quantity} shares)"


class Order(models.Model):
    """Trading orders"""
    ORDER_TYPES = [
        ('MARKET', 'Market Order'),
        ('LIMIT', 'Limit Order'),
        ('STOP', 'Stop Order'),
        ('STOP_LIMIT', 'Stop Limit Order'),
    ]
    
    ORDER_STATUS = [
        ('PENDING', 'Pending'),
        ('FILLED', 'Filled'),
        ('PARTIALLY_FILLED', 'Partially Filled'),
        ('CANCELLED', 'Cancelled'),
        ('REJECTED', 'Rejected'),
    ]
    
    ORDER_SIDE = [
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='orders')
    order_type = models.CharField(max_length=20, choices=ORDER_TYPES, default='MARKET')
    side = models.CharField(max_length=4, choices=ORDER_SIDE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Null for market orders
    stop_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    filled_quantity = models.IntegerField(default=0)
    average_fill_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='PENDING')
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    commission = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    filled_at = models.DateTimeField(null=True, blank=True)
    
    @property
    def is_completed(self):
        return self.status in ['FILLED', 'CANCELLED', 'REJECTED']
    
    @property
    def remaining_quantity(self):
        return self.quantity - self.filled_quantity
    
    def __str__(self):
        return f"{self.user.username} - {self.side} {self.quantity} {self.stock.symbol} @ ₹{self.price or 'MARKET'}"


class Trade(models.Model):
    """Executed trades (filled orders)"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='trades')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trades')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='trades')
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    side = models.CharField(max_length=4, choices=Order.ORDER_SIDE)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    commission = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_amount = models.DecimalField(max_digits=15, decimal_places=2)
    executed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.side} {self.quantity} {self.stock.symbol} @ ₹{self.price}"


class TradingPerformance(models.Model):
    """Track user's trading performance"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='trading_performance')
    portfolio_value = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    portfolio_growth_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_trades = models.IntegerField(default=0)
    successful_trades = models.IntegerField(default=0)
    total_profit_loss = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    best_trade_profit = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    worst_trade_loss = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    total_commission_paid = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    average_trade_size = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    largest_position = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def success_rate(self):
        if self.total_trades == 0:
            return 0
        return round((self.successful_trades / self.total_trades) * 100, 1)
    
    @property
    def average_return_per_trade(self):
        if self.total_trades == 0:
            return 0
        return round((self.total_profit_loss / self.total_trades), 2)
    
    def __str__(self):
        return f"{self.user.username}'s Trading Performance"


class TradingSession(models.Model):
    """Track user's trading sessions for performance analysis"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trading_sessions')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    trades_count = models.IntegerField(default=0)
    profit_loss = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - Session {self.start_time.date()}"


class MarketData(models.Model):
    """Real-time or cached market data"""
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='market_data')
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    change_amount = models.DecimalField(max_digits=10, decimal_places=2)
    change_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    volume = models.BigIntegerField()
    high_24h = models.DecimalField(max_digits=10, decimal_places=2)
    low_24h = models.DecimalField(max_digits=10, decimal_places=2)
    open_24h = models.DecimalField(max_digits=10, decimal_places=2)
    previous_close = models.DecimalField(max_digits=10, decimal_places=2)
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    pe_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    dividend_yield = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['stock']
    
    def __str__(self):
        return f"{self.stock.symbol} - ₹{self.current_price} ({self.change_percentage}%)"


class TechnicalIndicator(models.Model):
    """Technical analysis indicators for stocks"""
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='technical_indicators')
    indicator_name = models.CharField(max_length=50)  # RSI, MACD, Moving Average, etc.
    value = models.DecimalField(max_digits=10, decimal_places=4)
    signal = models.CharField(max_length=20, blank=True)  # Bullish, Bearish, Neutral
    period = models.IntegerField(null=True, blank=True)  # For indicators like 14-day RSI
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['stock', 'indicator_name']
    
    def __str__(self):
        return f"{self.stock.symbol} - {self.indicator_name}: {self.value}"


class Achievement(models.Model):
    """Trading achievements and badges"""
    ACHIEVEMENT_TYPES = [
        ('FIRST_TRADE', 'First Trade'),
        ('PROFIT_MILESTONE', 'Profit Milestone'),
        ('TRADE_COUNT', 'Trade Count'),
        ('WINNING_STREAK', 'Winning Streak'),
        ('PORTFOLIO_GROWTH', 'Portfolio Growth'),
        ('DIVERSIFICATION', 'Diversification'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    achievement_type = models.CharField(max_length=30, choices=ACHIEVEMENT_TYPES)
    icon_name = models.CharField(max_length=50, default='trophy')
    color = models.CharField(max_length=7, default='#F59E0B')  # Hex color
    criteria_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    """User's earned achievements"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='users')
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'achievement']
    
    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"
