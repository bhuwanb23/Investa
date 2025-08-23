from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


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
