from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, F, Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta

from ..models import (
    Stock, StockPrice, UserWatchlist, Portfolio, PortfolioHolding,
    Order, Trade, TradingPerformance, TradingSession, MarketData,
    TechnicalIndicator, Achievement, UserAchievement
)
from ..serializers.trading import (
    StockSerializer, StockDetailSerializer, UserWatchlistSerializer,
    PortfolioSerializer, PortfolioSummarySerializer, PortfolioHoldingSerializer,
    OrderSerializer, OrderHistorySerializer, TradeSerializer,
    TradingPerformanceSerializer, TradingSessionSerializer,
    MarketDataSerializer, TechnicalIndicatorSerializer,
    AchievementSerializer, UserAchievementSerializer, LeaderboardSerializer
)


class StockViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for stock information"""
    serializer_class = StockSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['symbol', 'name', 'sector', 'industry']
    ordering_fields = ['symbol', 'name', 'market_cap', 'created_at']
    
    def get_queryset(self):
        qs = Stock.objects.filter(is_active=True)
        if not qs.exists():
            # Auto-create a few demo stocks so frontend has data during development
            samples = [
                dict(symbol='RELIANCE', name='Reliance Industries Ltd.', exchange='NSE', sector='Energy'),
                dict(symbol='TCS', name='Tata Consultancy Services', exchange='NSE', sector='Technology'),
                dict(symbol='HDFCBANK', name='HDFC Bank Limited', exchange='NSE', sector='Banking'),
                dict(symbol='INFY', name='Infosys Limited', exchange='NSE', sector='Technology'),
                dict(symbol='ITC', name='ITC Limited', exchange='NSE', sector='Consumer Goods'),
                dict(symbol='ICICIBANK', name='ICICI Bank Limited', exchange='NSE', sector='Banking'),
            ]
            for s in samples:
                Stock.objects.get_or_create(symbol=s['symbol'], defaults=s)
            qs = Stock.objects.filter(is_active=True)
        return qs
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StockDetailSerializer
        return StockSerializer
    
    @action(detail=True, methods=['get'])
    def market_data(self, request, pk=None):
        """Get market data for a specific stock"""
        stock = self.get_object()
        market_data = stock.market_data.first()
        
        if market_data:
            serializer = MarketDataSerializer(market_data)
            return Response(serializer.data)
        return Response({'detail': 'Market data not available'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['get'])
    def technical_indicators(self, request, pk=None):
        """Get technical indicators for a specific stock"""
        stock = self.get_object()
        indicators = stock.technical_indicators.all()
        serializer = TechnicalIndicatorSerializer(indicators, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def price_history(self, request, pk=None):
        """Get price history for a specific stock"""
        stock = self.get_object()
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)
        
        prices = stock.prices.filter(date__gte=start_date).order_by('date')
        serializer = StockPriceSerializer(prices, many=True)
        return Response(serializer.data)


class UserWatchlistViewSet(viewsets.ModelViewSet):
    """ViewSet for user watchlist management"""
    serializer_class = UserWatchlistSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            from django.contrib.auth.models import User
            user, _ = User.objects.get_or_create(username='dev_user', defaults={'email': 'dev@example.com'})
            return UserWatchlist.objects.filter(user=user)
        return UserWatchlist.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_watchlist(self, request):
        """Get current user's watchlist with stock details"""
        watchlist = self.get_queryset().select_related('stock')
        serializer = StockWatchlistSerializer(watchlist, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_stock(self, request):
        """Add a stock to watchlist"""
        stock_id = request.data.get('stock_id')
        if not stock_id:
            return Response({'detail': 'stock_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            stock = Stock.objects.get(id=stock_id, is_active=True)
        except Stock.DoesNotExist:
            return Response({'detail': 'Stock not found'}, status=status.HTTP_404_NOT_FOUND)
        
        watchlist_item, created = UserWatchlist.objects.get_or_create(
            user=request.user,
            stock=stock
        )
        
        if created:
            serializer = UserWatchlistSerializer(watchlist_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Stock already in watchlist'}, status=status.HTTP_400_BAD_REQUEST)


class PortfolioViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for portfolio management"""
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            from django.contrib.auth.models import User
            user, _ = User.objects.get_or_create(username='dev_user', defaults={'email': 'dev@example.com'})
            return Portfolio.objects.filter(user=user)
        return Portfolio.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PortfolioSummarySerializer
        return PortfolioSerializer
    
    @action(detail=False, methods=['get'])
    def my_portfolio(self, request):
        """Get current user's portfolio summary"""
        portfolio = self.get_queryset().first()
        if not portfolio:
            # Create portfolio if it doesn't exist
            portfolio = Portfolio.objects.create(user=request.user)
        
        serializer = PortfolioSummarySerializer(portfolio)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def holdings(self, request):
        """Get portfolio holdings"""
        portfolio = self.get_queryset().first()
        if not portfolio:
            return Response({'holdings': []})
        
        holdings = portfolio.holdings.select_related('stock').order_by('-market_value')
        serializer = PortfolioHoldingSerializer(holdings, many=True)
        return Response({'holdings': serializer.data})


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for order management"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'status', 'side']
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            from django.contrib.auth.models import User
            user, _ = User.objects.get_or_create(username='dev_user', defaults={'email': 'dev@example.com'})
            return Order.objects.filter(user=user).select_related('stock')
        return Order.objects.filter(user=self.request.user).select_related('stock')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return OrderHistorySerializer
        return OrderSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            from django.contrib.auth.models import User
            user, _ = User.objects.get_or_create(username='dev_user', defaults={'email': 'dev@example.com'})
        serializer.save(user=user)
    
    @action(detail=False, methods=['get'])
    def order_history(self, request):
        """Get order history with filters"""
        queryset = self.get_queryset().select_related('stock')
        
        # Apply filters
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        side_filter = request.query_params.get('side')
        if side_filter:
            queryset = queryset.filter(side=side_filter)
        
        # Order by most recent first
        queryset = queryset.order_by('-created_at')
        
        serializer = OrderHistorySerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        """Cancel a pending order"""
        order = self.get_object()
        
        if order.status != 'PENDING':
            return Response({'detail': 'Only pending orders can be cancelled'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        order.status = 'CANCELLED'
        order.save()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)


class TradeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for trade history"""
    serializer_class = TradeSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['executed_at', 'price', 'total_amount']
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            from django.contrib.auth.models import User
            user, _ = User.objects.get_or_create(username='dev_user', defaults={'email': 'dev@example.com'})
            return Trade.objects.filter(user=user)
        return Trade.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def trade_summary(self, request):
        """Get trading summary statistics"""
        trades = self.get_queryset()
        
        summary = {
            'total_trades': trades.count(),
            'buy_trades': trades.filter(side='BUY').count(),
            'sell_trades': trades.filter(side='SELL').count(),
            'total_volume': trades.aggregate(total=Sum('quantity'))['total'] or 0,
            'total_amount': trades.aggregate(total=Sum('total_amount'))['total'] or 0,
            'average_trade_size': trades.aggregate(avg=Avg('total_amount'))['avg'] or 0,
        }
        
        return Response(summary)


class TradingPerformanceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for trading performance"""
    serializer_class = TradingPerformanceSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            from django.contrib.auth.models import User
            user, _ = User.objects.get_or_create(username='dev_user', defaults={'email': 'dev@example.com'})
            return TradingPerformance.objects.filter(user=user)
        return TradingPerformance.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_performance(self, request):
        """Get current user's trading performance"""
        try:
            performance = TradingPerformance.objects.get(user=request.user)
            serializer = self.get_serializer(performance)
            return Response(serializer.data)
        except TradingPerformance.DoesNotExist:
            # Create performance record if it doesn't exist
            performance = TradingPerformance.objects.create(user=request.user)
            serializer = self.get_serializer(performance)
            return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        """Get leaderboard data"""
        timeframe = request.query_params.get('timeframe', 'all')
        
        # Get all trading performances
        performances = TradingPerformance.objects.select_related('user').all()
        
        # Apply timeframe filtering if needed
        if timeframe == 'weekly':
            week_ago = timezone.now() - timedelta(days=7)
            # This would need more complex logic for weekly performance
            pass
        elif timeframe == 'monthly':
            month_ago = timezone.now() - timedelta(days=30)
            # This would need more complex logic for monthly performance
            pass
        
        # Calculate ranks
        ranked_performances = []
        for i, performance in enumerate(performances.order_by('-portfolio_growth_percentage'), 1):
            performance.rank = i
            ranked_performances.append(performance)
        
        serializer = LeaderboardSerializer(ranked_performances, many=True)
        return Response(serializer.data)


class MarketDataViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for market data"""
    serializer_class = MarketDataSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return MarketData.objects.all()
    
    @action(detail=False, methods=['get'])
    def top_movers(self, request):
        """Get top gainers and losers"""
        top_gainers = self.get_queryset().order_by('-change_percentage')[:10]
        top_losers = self.get_queryset().order_by('change_percentage')[:10]
        
        return Response({
            'top_gainers': MarketDataSerializer(top_gainers, many=True).data,
            'top_losers': MarketDataSerializer(top_losers, many=True).data
        })
    
    @action(detail=False, methods=['get'])
    def market_summary(self, request):
        """Get overall market summary"""
        market_data = self.get_queryset()
        
        summary = {
            'total_stocks': market_data.count(),
            'advancing': market_data.filter(change_percentage__gt=0).count(),
            'declining': market_data.filter(change_percentage__lt=0).count(),
            'unchanged': market_data.filter(change_percentage=0).count(),
            'total_volume': market_data.aggregate(total=Sum('volume'))['total'] or 0,
        }
        
        return Response(summary)


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for achievements"""
    serializer_class = AchievementSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Achievement.objects.all()
    
    @action(detail=False, methods=['get'])
    def my_achievements(self, request):
        """Get current user's achievements"""
        user_achievements = UserAchievement.objects.filter(user=request.user)
        serializer = UserAchievementSerializer(user_achievements, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available_achievements(self, request):
        """Get all available achievements"""
        achievements = self.get_queryset()
        user_achievements = UserAchievement.objects.filter(user=request.user)
        earned_ids = user_achievements.values_list('achievement_id', flat=True)
        
        # Mark achievements as earned or not
        for achievement in achievements:
            achievement.is_earned = achievement.id in earned_ids
        
        serializer = AchievementSerializer(achievements, many=True)
        return Response(serializer.data)
