from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from ..models import SecuritySettings, UserSession
from .auth import UserSerializer


class SecuritySettingsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SecuritySettings
        fields = [
            'id', 'user', 'biometric_enabled', 'session_timeout',
            'login_notifications', 'suspicious_activity_alerts',
            'two_factor_enabled', 'recovery_email',
            'last_password_change', 'created_at', 'updated_at',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_password_change']


class SecuritySettingsUpdateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SecuritySettings
        fields = [
            'id', 'user', 'biometric_enabled', 'session_timeout',
            'login_notifications', 'suspicious_activity_alerts',
            'recovery_email',
        ]
        read_only_fields = ['user']


class UserSessionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserSession
        fields = '__all__'
        read_only_fields = ['user', 'session_key', 'created_at', 'last_activity']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8, max_length=128)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class TwoFactorSetupSerializer(serializers.Serializer):
    secret = serializers.CharField(read_only=True)
    uri = serializers.CharField(read_only=True)
    backup_codes = serializers.ListField(child=serializers.CharField(), read_only=True)


class TwoFactorVerifySerializer(serializers.Serializer):
    code = serializers.CharField(required=True, min_length=6, max_length=8)


class TwoFactorDisableSerializer(serializers.Serializer):
    password = serializers.CharField(required=True, write_only=True)


class DeleteAccountSerializer(serializers.Serializer):
    password = serializers.CharField(required=True, write_only=True)


class ForgotPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PasswordResetRequestSerializer(serializers.Serializer):
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
