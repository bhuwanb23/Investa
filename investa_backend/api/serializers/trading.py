from rest_framework import serializers
from ..models import (
    Stock, StockPrice, UserWatchlist, Portfolio, PortfolioHolding,
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
    total_profit = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_trades = serializers.IntegerField()
    success_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    rank = serializers.IntegerField()
