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


class StockPriceSerializer(serializers.ModelSerializer):
    """Serializer for StockPrice model"""
    stock_symbol = serializers.CharField(source='stock.symbol', read_only=True)
    stock_name = serializers.CharField(source='stock.name', read_only=True)
    
    class Meta:
        model = StockPrice
        fields = '__all__'
        read_only_fields = ['created_at']


class StockDetailSerializer(serializers.ModelSerializer):
    """Detailed stock serializer with market data and technical indicators"""
    market_data = serializers.SerializerMethodField()
    technical_indicators = serializers.SerializerMethodField()
    is_in_watchlist = serializers.SerializerMethodField()
    
    class Meta:
        model = Stock
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_market_data(self, obj):
        market_data = obj.market_data.first()
        if market_data:
            return MarketDataSerializer(market_data).data
        return None
    
    def get_technical_indicators(self, obj):
        indicators = obj.technical_indicators.all()
        return TechnicalIndicatorSerializer(indicators, many=True).data
    
    def get_is_in_watchlist(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.watchers.filter(user=request.user).exists()
        return False


class UserWatchlistSerializer(serializers.ModelSerializer):
    """Serializer for UserWatchlist model"""
    stock = StockSerializer(read_only=True)
    stock_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = UserWatchlist
        fields = '__all__'
        read_only_fields = ['user', 'added_at']


class PortfolioSerializer(serializers.ModelSerializer):
    """Serializer for Portfolio model"""
    user = UserSerializer(read_only=True)
    total_return_percentage = serializers.ReadOnlyField()
    holdings_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Portfolio
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'total_return_percentage']
    
    def get_holdings_count(self, obj):
        return obj.holdings.count()


class PortfolioHoldingSerializer(serializers.ModelSerializer):
    """Serializer for PortfolioHolding model"""
    stock = StockSerializer(read_only=True)
    return_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = PortfolioHolding
        fields = '__all__'
        read_only_fields = ['portfolio', 'created_at', 'updated_at', 'return_percentage']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    user = UserSerializer(read_only=True)
    stock = StockSerializer(read_only=True)
    stock_id = serializers.IntegerField(write_only=True)
    is_completed = serializers.ReadOnlyField()
    remaining_quantity = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'filled_at', 'is_completed', 'remaining_quantity']
    
    def validate(self, data):
        """Validate order data"""
        if data.get('order_type') == 'LIMIT' and not data.get('price'):
            raise serializers.ValidationError("Limit orders must have a price")
        
        if data.get('order_type') in ['STOP', 'STOP_LIMIT'] and not data.get('stop_price'):
            raise serializers.ValidationError("Stop orders must have a stop price")
        
        return data


class TradeSerializer(serializers.ModelSerializer):
    """Serializer for Trade model"""
    user = UserSerializer(read_only=True)
    stock = StockSerializer(read_only=True)
    order = OrderSerializer(read_only=True)
    
    class Meta:
        model = Trade
        fields = '__all__'
        read_only_fields = ['executed_at']


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
        read_only_fields = ['user', 'start_time']


class MarketDataSerializer(serializers.ModelSerializer):
    """Serializer for MarketData model"""
    stock_symbol = serializers.CharField(source='stock.symbol', read_only=True)
    stock_name = serializers.CharField(source='stock.name', read_only=True)
    
    class Meta:
        model = MarketData
        fields = '__all__'
        read_only_fields = ['updated_at']


class TechnicalIndicatorSerializer(serializers.ModelSerializer):
    """Serializer for TechnicalIndicator model"""
    stock_symbol = serializers.CharField(source='stock.symbol', read_only=True)
    
    class Meta:
        model = TechnicalIndicator
        fields = '__all__'
        read_only_fields = ['updated_at']


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
        read_only_fields = ['earned_at']


# Specialized serializers for specific use cases
class PortfolioSummarySerializer(serializers.ModelSerializer):
    """Portfolio summary with key metrics"""
    user = UserSerializer(read_only=True)
    total_return_percentage = serializers.ReadOnlyField()
    holdings_count = serializers.SerializerMethodField()
    top_holdings = serializers.SerializerMethodField()
    
    class Meta:
        model = Portfolio
        fields = ['id', 'user', 'total_value', 'total_invested', 'total_profit_loss', 
                 'total_return_percentage', 'cash_balance', 'holdings_count', 'top_holdings']
    
    def get_holdings_count(self, obj):
        return obj.holdings.count()
    
    def get_top_holdings(self, obj):
        top_holdings = obj.holdings.order_by('-market_value')[:5]
        return PortfolioHoldingSerializer(top_holdings, many=True).data


class OrderHistorySerializer(serializers.ModelSerializer):
    """Order history with trade details"""
    user = UserSerializer(read_only=True)
    stock = StockSerializer(read_only=True)
    trades = TradeSerializer(many=True, read_only=True)
    total_filled_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'filled_at']
    
    def get_total_filled_amount(self, obj):
        return sum(trade.total_amount for trade in obj.trades.all())


class StockWatchlistSerializer(serializers.ModelSerializer):
    """Stock with watchlist status and market data"""
    stock = StockDetailSerializer(read_only=True)
    added_at = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = UserWatchlist
        fields = ['id', 'stock', 'added_at']


class LeaderboardSerializer(serializers.ModelSerializer):
    """Trading performance for leaderboards"""
    user = UserSerializer(read_only=True)
    success_rate = serializers.ReadOnlyField()
    rank = serializers.SerializerMethodField()
    
    class Meta:
        model = TradingPerformance
        fields = ['id', 'user', 'portfolio_value', 'portfolio_growth_percentage', 
                 'total_trades', 'successful_trades', 'success_rate', 'rank']
    
    def get_rank(self, obj):
        # This would be calculated in the view
        return getattr(obj, 'rank', None)
