from django.conf import settings
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import AISettings
from ..serializers import (
    TutorRequestSerializer,
    AISettingsSerializer,
)


class TutorView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TutorRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data['message']
        lesson_context = serializer.validated_data.get('lesson_context', '')
        model = serializer.validated_data.get('model', settings.OLLAMA_MODEL)

        # Try to get user's preferred model from AISettings
        try:
            ai_settings = request.user.ai_settings
            ollama_endpoint = ai_settings.ollama_endpoint
            if not model or model == settings.OLLAMA_MODEL:
                model = ai_settings.ollama_model
        except AISettings.DoesNotExist:
            ollama_endpoint = settings.OLLAMA_BASE_URL

        system_prompt = (
            "You are an AI tutor helping users learn about stock market investing. "
            "Provide clear, accurate, and educational responses. "
            "Keep answers concise and focused on financial education."
        )
        if lesson_context:
            system_prompt += f"\n\nThe user is currently studying: {lesson_context}"

        try:
            import requests as http_requests
            ollama_url = f"{ollama_endpoint}/api/chat"
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message},
                ],
                "stream": False,
            }
            response = http_requests.post(ollama_url, json=payload, timeout=60)
            response.raise_for_status()
            result = response.json()
            return Response({'response': result['message']['content']})
        except Exception as e:
            error_msg = str(e)
            if 'ConnectionError' in type(e).__name__ or 'Connection refused' in error_msg:
                detail = 'Could not connect to Ollama. Make sure it is running (ollama serve).'
            else:
                detail = f'AI tutor error: {error_msg}'
            return Response(
                {'detail': detail, 'response': None},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


class AISettingsViewSet(viewsets.ModelViewSet):
    serializer_class = AISettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AISettings.objects.filter(user=self.request.user)

    def get_object(self):
        obj, _ = AISettings.objects.get_or_create(user=self.request.user)
        return obj

    def list(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request):
        return self.update(request)

    def update(self, request, *args, **kwargs):
        instance, _ = AISettings.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        return self.list(request)
