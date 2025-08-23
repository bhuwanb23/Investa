from django.db import models
from django.contrib.auth.models import User


class TradingPerformance(models.Model):
    """Track user's simulated trading performance"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='trading_performance')
    portfolio_value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    portfolio_growth_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_trades = models.IntegerField(default=0)
    successful_trades = models.IntegerField(default=0)
    total_profit_loss = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    best_trade_profit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    worst_trade_loss = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def success_rate(self):
        if self.total_trades == 0:
            return 0
        return round((self.successful_trades / self.total_trades) * 100, 1)
    
    def __str__(self):
        return f"{self.user.username}'s Trading Performance"
