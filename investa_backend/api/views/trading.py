from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import TradingPerformance
from ..serializers import TradingPerformanceSerializer


class TradingPerformanceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for trading performance"""
    serializer_class = TradingPerformanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return TradingPerformance.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_performance(self, request):
        """Get current user's trading performance"""
        try:
            performance = TradingPerformance.objects.get(user=request.user)
            serializer = self.get_serializer(performance)
            return Response(serializer.data)
        except TradingPerformance.DoesNotExist:
            return Response({'detail': 'Trading performance not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def update_performance(self, request):
        """Update trading performance (for internal use)"""
        try:
            performance = TradingPerformance.objects.get(user=request.user)
            # This would typically be called by the trading system
            # For now, just return current performance
            serializer = self.get_serializer(performance)
            return Response(serializer.data)
        except TradingPerformance.DoesNotExist:
            return Response({'detail': 'Trading performance not found'}, status=status.HTTP_404_NOT_FOUND)
