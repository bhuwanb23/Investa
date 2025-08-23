from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import (
    Language, UserProfile, SecuritySettings, PrivacySettings,
    LearningProgress, TradingPerformance, UserSession, Notification,
    Badge, UserBadge
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    preferred_language = LanguageSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class SecuritySettingsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SecuritySettings
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_password_change']


class PrivacySettingsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PrivacySettings
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class LearningProgressSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    completion_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = LearningProgress
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_activity']


class TradingPerformanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    success_rate = serializers.ReadOnlyField()
    
    class Meta:
        model = TradingPerformance
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class UserSessionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserSession
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'last_activity']


class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'
        read_only_fields = ['created_at']


class UserBadgeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = '__all__'
        read_only_fields = ['user', 'badge', 'earned_at']


# Detailed serializers for specific use cases
class UserProfileDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    preferred_language = LanguageSerializer(read_only=True)
    security_settings = SecuritySettingsSerializer(read_only=True)
    privacy_settings = PrivacySettingsSerializer(read_only=True)
    learning_progress = LearningProgressSerializer(read_only=True)
    trading_performance = TradingPerformanceSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ProfileUpdateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class SecuritySettingsUpdateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SecuritySettings
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_password_change']


class PrivacySettingsUpdateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PrivacySettings
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


# Serializers for user registration and profile creation
class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Username already taken.")
        ]
    )
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Email already registered.")
        ]
    )
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'first_name', 'last_name']
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class CompleteProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'phone_number', 'preferred_language', 'learning_goal', 
            'risk_profile', 'investment_experience', 'date_of_birth'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
