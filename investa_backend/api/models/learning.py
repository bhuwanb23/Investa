from django.db import models
from django.contrib.auth.models import User


class LearningProgress(models.Model):
    """Track user's learning progress and achievements"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='learning_progress')
    total_modules = models.IntegerField(default=0)
    completed_modules = models.IntegerField(default=0)
    total_hours_learned = models.IntegerField(default=0)
    certificates_earned = models.IntegerField(default=0)
    average_quiz_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    quizzes_taken = models.IntegerField(default=0)
    quizzes_passed = models.IntegerField(default=0)
    badges_earned = models.IntegerField(default=0)
    last_activity = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def completion_percentage(self):
        if self.total_modules == 0:
            return 0
        return round((self.completed_modules / self.total_modules) * 100, 1)
    
    def __str__(self):
        return f"{self.user.username}'s Learning Progress"


class Badge(models.Model):
    """Achievement badges for users"""
    BADGE_TYPES = [
        ('learning', 'Learning'),
        ('trading', 'Trading'),
        ('security', 'Security'),
        ('social', 'Social'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    badge_type = models.CharField(max_length=20, choices=BADGE_TYPES)
    icon_name = models.CharField(max_length=50, help_text="Icon identifier")
    color = models.CharField(max_length=7, default="#4f46e5", help_text="Hex color code")
    criteria = models.JSONField(default=dict, help_text="Criteria to earn this badge")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class UserBadge(models.Model):
    """User earned badges"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='earned_badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'badge']
    
    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"
