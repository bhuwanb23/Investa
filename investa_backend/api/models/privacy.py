from django.db import models
from django.contrib.auth.models import User


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
