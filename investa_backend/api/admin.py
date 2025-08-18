from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Language, UserProfile, Course, Lesson, Quiz, Question, Answer,
    UserProgress, QuizAttempt, SimulatedTrade, Notification
)


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'native_name']
    search_fields = ['code', 'name', 'native_name']
    ordering = ['name']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'risk_profile', 'investment_experience', 'preferred_language', 'created_at']
    list_filter = ['risk_profile', 'investment_experience', 'preferred_language', 'created_at']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'preferred_language')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'language', 'difficulty_level', 'estimated_duration', 'is_active', 'order']
    list_filter = ['language', 'difficulty_level', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['is_active', 'order']
    readonly_fields = ['created_at', 'updated_at']
    prepopulated_fields = {'title': ('title',)}


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'estimated_duration', 'is_active']
    list_filter = ['course', 'is_active', 'created_at']
    search_fields = ['title', 'content', 'course__title']
    list_editable = ['order', 'is_active']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('course')


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'passing_score', 'time_limit', 'is_active']
    list_filter = ['lesson__course', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'lesson__title']
    list_editable = ['passing_score', 'time_limit', 'is_active']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('lesson', 'lesson__course')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'quiz', 'question_type', 'points', 'order']
    list_filter = ['question_type', 'quiz__lesson__course']
    search_fields = ['question_text', 'quiz__title']
    list_editable = ['points', 'order']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('quiz', 'quiz__lesson', 'quiz__lesson__course')


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['answer_text', 'question', 'is_correct', 'order']
    list_filter = ['is_correct', 'question__quiz__lesson__course']
    search_fields = ['answer_text', 'question__question_text']
    list_editable = ['is_correct', 'order']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('question', 'question__quiz', 'question__quiz__lesson')


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'lesson', 'completed', 'time_spent', 'completed_at']
    list_filter = ['completed', 'course', 'created_at']
    search_fields = ['user__username', 'course__title', 'lesson__title']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'course', 'lesson')


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'passed', 'time_taken', 'started_at']
    list_filter = ['passed', 'quiz__lesson__course', 'started_at']
    search_fields = ['user__username', 'quiz__title']
    readonly_fields = ['started_at', 'completed_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'quiz', 'quiz__lesson', 'quiz__lesson__course')


@admin.register(SimulatedTrade)
class SimulatedTradeAdmin(admin.ModelAdmin):
    list_display = ['user', 'symbol', 'trade_type', 'quantity', 'price', 'total_amount', 'timestamp']
    list_filter = ['trade_type', 'symbol', 'timestamp']
    search_fields = ['user__username', 'symbol', 'notes']
    readonly_fields = ['timestamp']
    
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
