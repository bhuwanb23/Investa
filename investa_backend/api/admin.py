from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Language, UserProfile, SecuritySettings, PrivacySettings, 
    LearningProgress, Course, Lesson, UserLessonProgress,
    TradingPerformance, UserSession, Notification,
    Badge, UserBadge,
    Quiz, Question, Answer, UserQuizAttempt, UserQuizAnswer
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


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'language', 'difficulty_level', 'estimated_duration', 'is_active', 'created_at']
    list_filter = ['difficulty_level', 'is_active', 'language']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'estimated_duration', 'is_active']
    list_filter = ['course', 'is_active']
    search_fields = ['title', 'course__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'status', 'progress', 'started_at', 'completed_at']
    list_filter = ['status', 'started_at', 'completed_at']
    search_fields = ['user__username', 'lesson__title', 'lesson__course__title']


@admin.register(TradingPerformance)
class TradingPerformanceAdmin(admin.ModelAdmin):
    list_display = ['user', 'portfolio_value', 'portfolio_growth_percentage', 'total_trades', 'successful_trades', 'success_rate']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'success_rate']


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


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'question_count', 'passing_score', 'is_active']
    list_filter = ['is_active', 'passing_score']
    search_fields = ['title', 'lesson__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'quiz', 'question_type', 'points', 'order', 'is_active']
    list_filter = ['question_type', 'is_active', 'quiz']
    search_fields = ['question_text', 'quiz__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['answer_text', 'question', 'is_correct', 'order']
    list_filter = ['is_correct', 'question__quiz']
    search_fields = ['answer_text', 'question__question_text']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserQuizAttempt)
class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'passed', 'started_at', 'completed_at']
    list_filter = ['passed', 'started_at', 'completed_at']
    search_fields = ['user__username', 'quiz__title']
    readonly_fields = ['started_at', 'completed_at', 'passed']


@admin.register(UserQuizAnswer)
class UserQuizAnswerAdmin(admin.ModelAdmin):
    list_display = ['user_attempt', 'question', 'is_correct', 'points_earned', 'answered_at']
    list_filter = ['is_correct', 'answered_at']
    search_fields = ['user_attempt__user__username', 'question__question_text']
    readonly_fields = ['answered_at']
