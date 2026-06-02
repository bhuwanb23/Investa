import secrets
from datetime import timedelta

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


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


class PasswordResetToken(models.Model):
    """One-time token used to reset a user's password via the forgot-password flow."""
    RESET_TOKEN_LIFETIME = timedelta(hours=1)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"PasswordResetToken(user={self.user.username}, used={'yes' if self.used_at else 'no'})"

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    @property
    def is_used(self):
        return self.used_at is not None

    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired

    @classmethod
    def create_for_user(cls, user):
        """Generate a fresh reset token for a user. Old tokens remain (one-time use is enforced at consume)."""
        return cls.objects.create(
            user=user,
            token=secrets.token_urlsafe(32),
            expires_at=timezone.now() + cls.RESET_TOKEN_LIFETIME,
        )

    def mark_used(self):
        self.used_at = timezone.now()
        self.save(update_fields=['used_at'])
