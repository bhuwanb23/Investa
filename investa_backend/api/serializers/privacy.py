from rest_framework import serializers
from ..models import PrivacySettings
from .auth import UserSerializer


class PrivacySettingsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PrivacySettings
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class PrivacySettingsUpdateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PrivacySettings
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
