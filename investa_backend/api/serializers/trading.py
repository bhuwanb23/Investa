from rest_framework import serializers
from ..models import (
    Stock, StockPrice, UserWatchlist, Portfolio, PortfolioHolding,
    Order, Trade, TradingPerformance, TradingSession, MarketData,
    TechnicalIndicator, Achievement, UserAchievement
)
from .auth import UserSerializer


class StockSerializer(serializers.ModelSerializer):
    """Serializer for Stock model"""
    class Meta:
        model = Stock
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class StockDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Stock model"""
    class Meta:
        model = Stock
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


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
    stock = StockSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class OrderHistorySerializer(serializers.ModelSerializer):
    """Serializer for order history"""
    user = UserSerializer(read_only=True)
    stock = StockSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


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
