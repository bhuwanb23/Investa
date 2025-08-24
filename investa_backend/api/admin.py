from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Language, UserProfile, SecuritySettings, PrivacySettings, 
    LearningProgress, TradingPerformance, UserSession, Notification,
    Badge, UserBadge, Stock, StockPrice, UserWatchlist, Portfolio,
    PortfolioHolding, Order, Trade, TradingSession, MarketData,
    TechnicalIndicator, Achievement, UserAchievement
)


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'native_name']
    search_fields = ['code', 'name', 'native_name']
    ordering = ['name']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'level', 'experience_points', 'risk_profile', 'investment_experience', 'phone_number']
    list_filter = ['risk_profile', 'investment_experience', 'level', 'created_at']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SecuritySettings)
class SecuritySettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'two_factor_enabled', 'biometric_enabled', 'session_timeout', 'login_notifications']
    list_filter = ['two_factor_enabled', 'biometric_enabled', 'login_notifications', 'suspicious_activity_alerts']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'last_password_change']


@admin.register(PrivacySettings)
class PrivacySettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'profile_visibility', 'activity_visibility', 'data_sharing', 'location_sharing']
    list_filter = ['profile_visibility', 'activity_visibility', 'data_sharing', 'location_sharing']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(LearningProgress)
class LearningProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'completed_modules', 'total_modules', 'completion_percentage', 'total_hours_learned', 'certificates_earned']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'last_activity', 'completion_percentage']


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ['symbol', 'name', 'exchange', 'sector', 'is_active', 'created_at']
    list_filter = ['exchange', 'sector', 'is_active', 'created_at']
    search_fields = ['symbol', 'name', 'sector']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(StockPrice)
class StockPriceAdmin(admin.ModelAdmin):
    list_display = ['stock', 'date', 'close_price', 'volume', 'change_percentage']
    list_filter = ['date', 'stock__exchange']
    search_fields = ['stock__symbol', 'stock__name']
    readonly_fields = ['created_at']
    
    def change_percentage(self, obj):
        if obj.stock.prices.count() > 1:
            prev_price = obj.stock.prices.filter(date__lt=obj.date).first()
            if prev_price:
                change = ((obj.close_price - prev_price.close_price) / prev_price.close_price) * 100
                return f"{change:.2f}%"
        return "N/A"
    change_percentage.short_description = "Change %"


@admin.register(UserWatchlist)
class UserWatchlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'stock', 'added_at']
    list_filter = ['added_at', 'stock__exchange']
    search_fields = ['user__username', 'stock__symbol']
    readonly_fields = ['added_at']


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_value', 'total_invested', 'total_profit_loss', 'total_return_percentage', 'cash_balance']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'total_return_percentage']


@admin.register(PortfolioHolding)
class PortfolioHoldingAdmin(admin.ModelAdmin):
    list_display = ['portfolio', 'stock', 'quantity', 'average_price', 'market_value', 'return_percentage']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['portfolio__user__username', 'stock__symbol']
    readonly_fields = ['created_at', 'updated_at', 'return_percentage']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['user', 'stock', 'side', 'order_type', 'quantity', 'price', 'status', 'created_at']
    list_filter = ['order_type', 'side', 'status', 'created_at', 'stock__exchange']
    search_fields = ['user__username', 'stock__symbol', 'stock__name']
    readonly_fields = ['created_at', 'updated_at', 'filled_at', 'is_completed', 'remaining_quantity']


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ['user', 'stock', 'side', 'quantity', 'price', 'total_amount', 'executed_at']
    list_filter = ['side', 'executed_at', 'stock__exchange']
    search_fields = ['user__username', 'stock__symbol']
    readonly_fields = ['executed_at']


@admin.register(TradingPerformance)
class TradingPerformanceAdmin(admin.ModelAdmin):
    list_display = ['user', 'portfolio_value', 'portfolio_growth_percentage', 'total_trades', 'successful_trades', 'success_rate']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'success_rate']


@admin.register(TradingSession)
class TradingSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'start_time', 'end_time', 'trades_count', 'profit_loss', 'is_active']
    list_filter = ['is_active', 'start_time']
    search_fields = ['user__username']
    readonly_fields = ['start_time']


@admin.register(MarketData)
class MarketDataAdmin(admin.ModelAdmin):
    list_display = ['stock', 'current_price', 'change_percentage', 'volume', 'updated_at']
    list_filter = ['updated_at', 'stock__exchange']
    search_fields = ['stock__symbol', 'stock__name']
    readonly_fields = ['updated_at']


@admin.register(TechnicalIndicator)
class TechnicalIndicatorAdmin(admin.ModelAdmin):
    list_display = ['stock', 'indicator_name', 'value', 'signal', 'period', 'updated_at']
    list_filter = ['indicator_name', 'signal', 'updated_at']
    search_fields = ['stock__symbol', 'indicator_name']
    readonly_fields = ['updated_at']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['name', 'achievement_type', 'icon_name', 'color', 'criteria_value', 'created_at']
    list_filter = ['achievement_type', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'achievement', 'earned_at']
    list_filter = ['earned_at', 'achievement__achievement_type']
    search_fields = ['user__username', 'achievement__name']
    readonly_fields = ['earned_at']


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_key_short', 'ip_address', 'is_active', 'last_activity', 'created_at']
    list_filter = ['is_active', 'created_at', 'last_activity']
    search_fields = ['user__username', 'session_key', 'ip_address']
    readonly_fields = ['created_at', 'last_activity']
    
    def session_key_short(self, obj):
        return f"{obj.session_key[:8]}..." if obj.session_key else "N/A"
    session_key_short.short_description = 'Session Key'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'notification_type', 'read', 'created_at']
    list_filter = ['notification_type', 'read', 'created_at']
    search_fields = ['user__username', 'title', 'message']
    readonly_fields = ['created_at']


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'badge_type', 'icon_name', 'color', 'created_at']
    list_filter = ['badge_type', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ['user', 'badge', 'earned_at']
    list_filter = ['earned_at', 'badge__badge_type']
    search_fields = ['user__username', 'badge__name']
    readonly_fields = ['earned_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'badge')
