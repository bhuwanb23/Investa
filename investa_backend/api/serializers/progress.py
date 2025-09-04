from rest_framework import serializers
from ..models.progress import UserProgress
from .auth import UserSerializer


class UserProgressSerializer(serializers.ModelSerializer):
    """Serializer for comprehensive user progress"""
    user = UserSerializer(read_only=True)
    
    # Computed properties
    learning_completion_percentage = serializers.ReadOnlyField()
    course_completion_percentage = serializers.ReadOnlyField()
    quiz_completion_percentage = serializers.ReadOnlyField()
    badge_completion_percentage = serializers.ReadOnlyField()
    achievement_completion_percentage = serializers.ReadOnlyField()
    overall_progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = UserProgress
        fields = '__all__'
        read_only_fields = [
            'user', 'created_at', 'updated_at',
            'learning_completion_percentage', 'course_completion_percentage',
            'quiz_completion_percentage', 'badge_completion_percentage',
            'achievement_completion_percentage', 'overall_progress_percentage'
        ]


class UserProgressSummarySerializer(serializers.ModelSerializer):
    """Simplified serializer for progress summary display"""
    user = UserSerializer(read_only=True)
    
    # Key metrics
    learning_completion_percentage = serializers.ReadOnlyField()
    course_completion_percentage = serializers.ReadOnlyField()
    quiz_completion_percentage = serializers.ReadOnlyField()
    overall_progress_percentage = serializers.ReadOnlyField()
    
    # Level and experience
    current_level = serializers.ReadOnlyField()
    experience_points = serializers.ReadOnlyField()
    experience_to_next_level = serializers.ReadOnlyField()
    
    # Activity tracking
    current_streak_days = serializers.ReadOnlyField()
    longest_streak_days = serializers.ReadOnlyField()
    total_activity_days = serializers.ReadOnlyField()
    
    class Meta:
        model = UserProgress
        fields = [
            'id', 'user', 'current_level', 'experience_points', 'experience_to_next_level',
            'learning_completion_percentage', 'course_completion_percentage',
            'quiz_completion_percentage', 'overall_progress_percentage',
            'current_streak_days', 'longest_streak_days', 'total_activity_days',
            'portfolio_value', 'portfolio_growth_percentage', 'win_rate',
            'total_badges', 'earned_badges', 'total_achievements', 'earned_achievements',
            'updated_at'
        ]
        read_only_fields = fields


class ProgressStatsSerializer(serializers.Serializer):
    """Serializer for aggregated progress statistics"""
    # Learning stats
    total_courses = serializers.IntegerField()
    completed_courses = serializers.IntegerField()
    total_lessons = serializers.IntegerField()
    completed_lessons = serializers.IntegerField()
    total_quizzes = serializers.IntegerField()
    completed_quizzes = serializers.IntegerField()
    average_quiz_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    
    # Trading stats
    portfolio_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    portfolio_growth_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    total_trades = serializers.IntegerField()
    successful_trades = serializers.IntegerField()
    win_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    
    # Achievement stats
    total_badges = serializers.IntegerField()
    earned_badges = serializers.IntegerField()
    total_achievements = serializers.IntegerField()
    earned_achievements = serializers.IntegerField()
    
    # Activity stats
    current_streak_days = serializers.IntegerField()
    longest_streak_days = serializers.IntegerField()
    total_activity_days = serializers.IntegerField()
    
    # Level stats
    current_level = serializers.IntegerField()
    experience_points = serializers.IntegerField()
    experience_to_next_level = serializers.IntegerField()
    
    # Progress percentages
    learning_completion_percentage = serializers.DecimalField(max_digits=5, decimal_places=1)
    course_completion_percentage = serializers.DecimalField(max_digits=5, decimal_places=1)
    quiz_completion_percentage = serializers.DecimalField(max_digits=5, decimal_places=1)
    overall_progress_percentage = serializers.DecimalField(max_digits=5, decimal_places=1)
