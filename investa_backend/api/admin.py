from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Language, UserProfile, SecuritySettings, PrivacySettings, 
    LearningProgress, TradingPerformance, UserSession, Notification,
    Badge, UserBadge
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
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name', 'phone_number']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'preferred_language')


@admin.register(SecuritySettings)
class SecuritySettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'biometric_enabled', 'two_factor_enabled', 'session_timeout', 'login_notifications']
    list_filter = ['biometric_enabled', 'two_factor_enabled', 'login_notifications', 'suspicious_activity_alerts']
    search_fields = ['user__username', 'user__email', 'recovery_email']
    readonly_fields = ['created_at', 'updated_at', 'last_password_change']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(PrivacySettings)
class PrivacySettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'profile_visibility', 'activity_visibility', 'data_sharing', 'location_sharing']
    list_filter = ['profile_visibility', 'activity_visibility', 'data_sharing', 'location_sharing']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(LearningProgress)
class LearningProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'completion_percentage', 'total_hours_learned', 'certificates_earned', 'average_quiz_score']
    list_filter = ['created_at', 'last_activity']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'last_activity', 'completion_percentage']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(TradingPerformance)
class TradingPerformanceAdmin(admin.ModelAdmin):
    list_display = ['user', 'portfolio_value', 'portfolio_growth_percentage', 'success_rate', 'total_trades']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'success_rate']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_key', 'ip_address', 'is_active', 'last_activity', 'created_at']
    list_filter = ['is_active', 'created_at', 'last_activity']
    search_fields = ['user__username', 'session_key', 'ip_address', 'device_info']
    readonly_fields = ['created_at', 'last_activity']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'notification_type', 'read', 'created_at']
    list_filter = ['notification_type', 'read', 'created_at']
    search_fields = ['user__username', 'title', 'message']
    readonly_fields = ['created_at']
    list_editable = ['read']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'badge_type', 'icon_name', 'color', 'created_at']
    list_filter = ['badge_type', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ['user', 'badge', 'earned_at']
    list_filter = ['badge__badge_type', 'earned_at']
    search_fields = ['user__username', 'badge__name']
    readonly_fields = ['earned_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'badge')
