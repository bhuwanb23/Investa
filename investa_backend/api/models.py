from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _


class Language(models.Model):
    """Supported languages for the app"""
    code = models.CharField(max_length=10, unique=True, help_text="Language code (e.g., en, hi, ta)")
    name = models.CharField(max_length=50, help_text="Language name (e.g., English, Hindi, Tamil)")
    native_name = models.CharField(max_length=50, help_text="Native language name")
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.native_name})"


class UserProfile(models.Model):
    """Extended user profile for investor education"""
    RISK_PROFILE_CHOICES = [
        ('conservative', 'Conservative'),
        ('moderate', 'Moderate'),
        ('aggressive', 'Aggressive'),
    ]
    
    EXPERIENCE_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True)
    preferred_language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, blank=True)
    learning_goal = models.TextField(blank=True, help_text="User's learning objective")
    risk_profile = models.CharField(max_length=20, choices=RISK_PROFILE_CHOICES, default='moderate')
    investment_experience = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='beginner')
    date_of_birth = models.DateField(null=True, blank=True)
    level = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(100)])
    experience_points = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"


class SecuritySettings(models.Model):
    """User security preferences and settings"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='security_settings')
    biometric_enabled = models.BooleanField(default=False)
    session_timeout = models.IntegerField(default=30, validators=[MinValueValidator(5), MaxValueValidator(120)])
    login_notifications = models.BooleanField(default=True)
    suspicious_activity_alerts = models.BooleanField(default=True)
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True)
    backup_codes = models.JSONField(default=list, blank=True)
    recovery_email = models.EmailField(blank=True)
    last_password_change = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Security Settings"


class PrivacySettings(models.Model):
    """User privacy preferences"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='privacy_settings')
    profile_visibility = models.BooleanField(default=True)
    activity_visibility = models.BooleanField(default=False)
    data_sharing = models.BooleanField(default=True)
    location_sharing = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Privacy Settings"


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


class UserSession(models.Model):
    """Track user login sessions for security"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    device_info = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    last_activity = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.session_key[:8]}..."


class Notification(models.Model):
    """User notifications"""
    NOTIFICATION_TYPES = [
        ('security', 'Security Alert'),
        ('learning', 'Learning Update'),
        ('trading', 'Trading Update'),
        ('achievement', 'Achievement'),
        ('general', 'General'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


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
