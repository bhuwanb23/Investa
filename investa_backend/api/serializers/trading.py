from rest_framework import serializers
from ..models import (
    Stock, StockPrice, StockNews, MarketIndex, UserWatchlist, Portfolio, PortfolioHolding,
    Order, Trade, TradingPerformance, TradingSession, MarketData,
    TechnicalIndicator, Achievement, UserAchievement
)
from .auth import UserSerializer


class StockSerializer(serializers.ModelSerializer):
    """Serializer for Stock model"""
    current_price = serializers.SerializerMethodField()
    change_percentage = serializers.SerializerMethodField()
    change_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = Stock
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_current_price(self, obj):
        """Get current price from market data"""
        market_data = obj.market_data.first()
        return float(market_data.current_price) if market_data else 0.0
    
    def get_change_percentage(self, obj):
        """Get change percentage from market data"""
        market_data = obj.market_data.first()
        return float(market_data.change_percentage) if market_data else 0.0
    
    def get_change_amount(self, obj):
        """Get change amount from market data"""
        market_data = obj.market_data.first()
        return float(market_data.change_amount) if market_data else 0.0


class StockDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Stock model"""
    current_price = serializers.SerializerMethodField()
    change_percentage = serializers.SerializerMethodField()
    change_amount = serializers.SerializerMethodField()
    market_data = serializers.SerializerMethodField()
    fundamentals = serializers.SerializerMethodField()
    news = serializers.SerializerMethodField()
    recent_news = serializers.SerializerMethodField()

    class Meta:
        model = Stock
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def get_current_price(self, obj):
        """Get current price from market data"""
        market_data = obj.market_data.first()
        return float(market_data.current_price) if market_data else 0.0

    def get_change_percentage(self, obj):
        """Get change percentage from market data"""
        market_data = obj.market_data.first()
        return float(market_data.change_percentage) if market_data else 0.0

    def get_change_amount(self, obj):
        """Get change amount from market data"""
        market_data = obj.market_data.first()
        return float(market_data.change_amount) if market_data else 0.0

    def get_market_data(self, obj):
        """Get full market data"""
        market_data = obj.market_data.first()
        if market_data:
            return MarketDataSerializer(market_data).data
        return None

    def get_fundamentals(self, obj):
        """Compute fundamentals from StockPrice, MarketData, and Stock fields"""
        from decimal import Decimal
        fundamentals = []
        market_data = obj.market_data.first()
        # 52W High / Low from available StockPrice history (up to 365 days)
        prices = obj.prices.all().order_by('-date')[:365]
        if prices:
            high_52w = max(float(p.high_price) for p in prices)
            low_52w = min(float(p.low_price) for p in prices)
            fundamentals.append({'label': '52W High', 'value': f"₹{high_52w:.2f}"})
            fundamentals.append({'label': '52W Low', 'value': f"₹{low_52w:.2f}"})
        if market_data:
            if market_data.dividend_yield is not None:
                fundamentals.append({'label': 'Dividend Yield', 'value': f"{float(market_data.dividend_yield):.2f}%"})
            if market_data.pe_ratio is not None:
                fundamentals.append({'label': 'P/E Ratio', 'value': f"{float(market_data.pe_ratio):.2f}"})
        if obj.beta is not None:
            fundamentals.append({'label': 'Beta', 'value': f"{float(obj.beta):.2f}"})
        if obj.avg_volume is not None:
            fundamentals.append({'label': 'Avg Volume', 'value': f"{obj.avg_volume / 1_000_000:.1f}M"})
        if market_data and market_data.market_cap is not None:
            fundamentals.append({'label': 'Market Cap', 'value': f"₹{float(market_data.market_cap) / 1e12:.1f}T"})
        return fundamentals

    def get_news(self, obj):
        """Latest 10 news items for the stock"""
        latest = obj.news.all()[:10]
        return StockNewsSerializer(latest, many=True).data

    def get_recent_news(self, obj):
        """Latest 5 news items (compact view)"""
        latest = obj.news.all()[:5]
        return StockNewsSerializer(latest, many=True).data


class StockPriceSerializer(serializers.ModelSerializer):
    """Serializer for StockPrice model"""
    class Meta:
        model = StockPrice
        fields = '__all__'
        read_only_fields = ['created_at']


class UserWatchlistSerializer(serializers.ModelSerializer):
    """Serializer for UserWatchlist model"""
    user = UserSerializer(read_only=True)
    stock = StockSerializer(read_only=True)
    
    class Meta:
        model = UserWatchlist
        fields = '__all__'
        read_only_fields = ['user', 'added_at']


class StockWatchlistSerializer(serializers.ModelSerializer):
    """Serializer for watchlist with stock details"""
    stock = StockSerializer(read_only=True)
    
    class Meta:
        model = UserWatchlist
        fields = '__all__'
        read_only_fields = ['user', 'added_at']


class PortfolioSerializer(serializers.ModelSerializer):
    """Serializer for Portfolio model"""
    user = UserSerializer(read_only=True)
    total_return_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Portfolio
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class PortfolioSummarySerializer(serializers.ModelSerializer):
    """Summary serializer for Portfolio model"""
    user = UserSerializer(read_only=True)
    total_return_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Portfolio
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class PortfolioHoldingSerializer(serializers.ModelSerializer):
    """Serializer for PortfolioHolding model"""
    stock = StockSerializer(read_only=True)
    return_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = PortfolioHolding
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    user = UserSerializer(read_only=True)
    # Accept stock by primary key on create/update
    stock = serializers.PrimaryKeyRelatedField(queryset=Stock.objects.all(), write_only=True)
    # Also include detailed stock info in responses
    stock_detail = StockSerializer(source='stock', read_only=True)
    calculated_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_calculated_total(self, obj):
        """Get calculated total amount"""
        return float(obj.calculated_total_amount)


class OrderHistorySerializer(serializers.ModelSerializer):
    """Serializer for order history"""
    user = UserSerializer(read_only=True)
    stock = StockSerializer(read_only=True)
    calculated_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_calculated_total(self, obj):
        """Get calculated total amount"""
        total = obj.calculated_total_amount
        return float(total) if total else 0.0


class TradeSerializer(serializers.ModelSerializer):
    """Serializer for Trade model"""
    user = UserSerializer(read_only=True)
    stock = StockSerializer(read_only=True)
    
    class Meta:
        model = Trade
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class TradingPerformanceSerializer(serializers.ModelSerializer):
    """Serializer for TradingPerformance model"""
    user = UserSerializer(read_only=True)
    success_rate = serializers.ReadOnlyField()
    average_return_per_trade = serializers.ReadOnlyField()
    
    class Meta:
        model = TradingPerformance
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'success_rate', 'average_return_per_trade']


class TradingSessionSerializer(serializers.ModelSerializer):
    """Serializer for TradingSession model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TradingSession
        fields = '__all__'
        read_only_fields = ['user', 'started_at', 'ended_at']


class MarketDataSerializer(serializers.ModelSerializer):
    """Serializer for MarketData model"""
    stock = StockSerializer(read_only=True)
    
    class Meta:
        model = MarketData
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class TechnicalIndicatorSerializer(serializers.ModelSerializer):
    """Serializer for TechnicalIndicator model"""
    stock = StockSerializer(read_only=True)
    
    class Meta:
        model = TechnicalIndicator
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for Achievement model"""
    class Meta:
        model = Achievement
        fields = '__all__'
        read_only_fields = ['created_at']


class UserAchievementSerializer(serializers.ModelSerializer):
    """Serializer for UserAchievement model"""
    user = UserSerializer(read_only=True)
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = '__all__'
        read_only_fields = ['user', 'achievement', 'earned_at']


class LeaderboardSerializer(serializers.Serializer):
    """Serializer for leaderboard data"""
    user = UserSerializer(read_only=True)
    total_profit_loss = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_trades = serializers.IntegerField()
    success_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    rank = serializers.IntegerField()


class StockNewsSerializer(serializers.ModelSerializer):
    """Serializer for StockNews model"""
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = StockNews
        fields = ['id', 'stock', 'title', 'source', 'summary', 'url', 'published_at', 'time_ago', 'created_at']
        read_only_fields = ['created_at']

    def get_time_ago(self, obj):
        """Human-readable time-ago string"""
        from django.utils import timezone
        from datetime import timedelta
        now = timezone.now()
        diff = now - obj.published_at
        if diff < timedelta(minutes=1):
            return 'just now'
        if diff < timedelta(hours=1):
            return f"{int(diff.total_seconds() // 60)} minutes ago"
        if diff < timedelta(days=1):
            return f"{int(diff.total_seconds() // 3600)} hours ago"
        if diff < timedelta(days=7):
            return f"{diff.days} days ago"
        if diff < timedelta(days=30):
            return f"{diff.days // 7} weeks ago"
        return obj.published_at.strftime('%b %d, %Y')


class MarketIndexSerializer(serializers.ModelSerializer):
    """Serializer for MarketIndex model (NIFTY 50, SENSEX, etc.)"""
    is_positive = serializers.SerializerMethodField()

    class Meta:
        model = MarketIndex
        fields = ['id', 'name', 'value', 'change_amount', 'change_percentage', 'is_positive', 'as_of', 'updated_at']
        read_only_fields = ['updated_at']

    def get_is_positive(self, obj):
        return float(obj.change_amount) >= 0


class RecentTradeSerializer(serializers.ModelSerializer):
    """Compact serializer for the recent_trades action"""
    symbol = serializers.SerializerMethodField()

    class Meta:
        model = Trade
        fields = ['id', 'symbol', 'side', 'quantity', 'price', 'total_amount', 'executed_at']

    def get_symbol(self, obj):
        return obj.stock.symbol
