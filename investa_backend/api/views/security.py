from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import SecuritySettings, UserSession
from ..serializers import SecuritySettingsSerializer


class SecuritySettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for security settings"""
    serializer_class = SecuritySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SecuritySettings.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_settings(self, request):
        """Get current user's security settings"""
        try:
            settings = SecuritySettings.objects.get(user=request.user)
            serializer = self.get_serializer(settings)
            return Response(serializer.data)
        except SecuritySettings.DoesNotExist:
            return Response({'detail': 'Security settings not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_settings(self, request):
        """Update current user's security settings"""
        try:
            settings = SecuritySettings.objects.get(user=request.user)
            serializer = SecuritySettingsSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SecuritySettings.DoesNotExist:
            return Response({'detail': 'Security settings not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def toggle_2fa(self, request):
        """Toggle two-factor authentication"""
        try:
            settings = SecuritySettings.objects.get(user=request.user)
            settings.two_factor_enabled = not settings.two_factor_enabled
            settings.save()
            return Response({'two_factor_enabled': settings.two_factor_enabled})
        except SecuritySettings.DoesNotExist:
            return Response({'detail': 'Security settings not found'}, status=status.HTTP_404_NOT_FOUND)


class UserSessionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user sessions"""
    serializer_class = SecuritySettingsSerializer  # Use SecuritySettingsSerializer as fallback
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserSession.objects.filter(user=self.request.user, is_active=True)
    
    @action(detail=False, methods=['post'])
    def logout_all_devices(self, request):
        """Logout from all devices except current"""
        current_session = request.session.session_key
        UserSession.objects.filter(user=request.user).exclude(session_key=current_session).update(is_active=False)
        return Response({'detail': 'Logged out from all other devices'})
