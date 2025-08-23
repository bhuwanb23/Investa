from rest_framework import serializers
from ..models import TradingPerformance
from .auth import UserSerializer


class TradingPerformanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    success_rate = serializers.ReadOnlyField()
    
    class Meta:
        model = TradingPerformance
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
