from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


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
