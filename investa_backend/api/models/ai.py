from django.db import models
from django.contrib.auth.models import User


class AISettings(models.Model):
    PROVIDER_CHOICES = [
        ('ollama', 'Ollama'),
        ('openai', 'OpenAI'),
        ('gemini', 'Gemini'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='ai_settings')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default='ollama')
    ollama_endpoint = models.CharField(max_length=255, default='http://localhost:11434')
    ollama_model = models.CharField(max_length=100, default='llama3')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'AI settings'

    def __str__(self):
        return f"{self.user.username}'s AI Settings"
