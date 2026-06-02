from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from ..models import SecuritySettings, UserSession
from .auth import UserSerializer


class SecuritySettingsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SecuritySettings
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_password_change']


class SecuritySettingsUpdateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SecuritySettings
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_password_change']


class UserSessionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserSession
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'last_activity']


class ForgotPasswordRequestSerializer(serializers.Serializer):
    """Step 1 of password reset: user supplies their email."""
    email = serializers.EmailField(required=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    """Step 2 of password reset: user supplies the token and a new password."""
    token = serializers.CharField(required=True, min_length=10, max_length=128)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8, max_length=128)
    confirm_password = serializers.CharField(required=True, write_only=True, min_length=8, max_length=128)

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        attrs.pop('confirm_password', None)
        return attrs
