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
