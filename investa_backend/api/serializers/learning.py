from rest_framework import serializers
from ..models import LearningProgress, Badge, UserBadge
from .auth import UserSerializer


class LearningProgressSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    completion_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = LearningProgress
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_activity']


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
