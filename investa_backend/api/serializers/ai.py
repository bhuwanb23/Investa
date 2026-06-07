from rest_framework import serializers
from ..models import AISettings


class TutorRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True, min_length=1)
    lesson_context = serializers.CharField(required=False, allow_blank=True, default='')
    model = serializers.CharField(required=False, default='llama3')


class AISettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISettings
        fields = [
            'provider', 'ollama_endpoint', 'ollama_model',
            'openai_api_key', 'openai_model', 'gemini_api_key', 'gemini_model',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'openai_api_key': {'write_only': True},
            'gemini_api_key': {'write_only': True},
        }


class TestConnectionSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=['ollama', 'openai', 'gemini'])
    ollama_endpoint = serializers.CharField(required=False, default='http://localhost:11434')
    ollama_model = serializers.CharField(required=False, default='llama3')
    openai_api_key = serializers.CharField(required=False, allow_blank=True, default='')
    openai_model = serializers.CharField(required=False, default='gpt-4')
    gemini_api_key = serializers.CharField(required=False, allow_blank=True, default='')
    gemini_model = serializers.CharField(required=False, default='gemini-pro')
