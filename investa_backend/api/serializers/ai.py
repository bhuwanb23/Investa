from rest_framework import serializers
from ..models import AISettings


class TutorRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True, min_length=1)
    lesson_context = serializers.CharField(required=False, allow_blank=True, default='')
    model = serializers.CharField(required=False, default='llama3')


class AISettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISettings
        fields = ['provider', 'ollama_endpoint', 'ollama_model', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
