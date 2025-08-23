from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import PrivacySettings
from ..serializers import PrivacySettingsSerializer, PrivacySettingsUpdateSerializer


class PrivacySettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for privacy settings"""
    serializer_class = PrivacySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PrivacySettings.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return PrivacySettingsUpdateSerializer
        return PrivacySettingsSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_settings(self, request):
        """Get current user's privacy settings"""
        try:
            settings = PrivacySettings.objects.get(user=request.user)
            serializer = self.get_serializer(settings)
            return Response(serializer.data)
        except PrivacySettings.DoesNotExist:
            return Response({'detail': 'Privacy settings not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_settings(self, request):
        """Update current user's privacy settings"""
        try:
            settings = PrivacySettings.objects.get(user=request.user)
            serializer = PrivacySettingsUpdateSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PrivacySettings.DoesNotExist:
            return Response({'detail': 'Privacy settings not found'}, status=status.HTTP_404_NOT_FOUND)
