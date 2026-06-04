import json
from django.http import JsonResponse
from django.db import transaction
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import PrivacySettings
from ..serializers import PrivacySettingsSerializer, UserProfileSerializer, DeleteAccountSerializer


class PrivacySettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for privacy settings"""
    serializer_class = PrivacySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PrivacySettings.objects.filter(user=self.request.user)

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
            serializer = PrivacySettingsSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PrivacySettings.DoesNotExist:
            return Response({'detail': 'Privacy settings not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def export_data(self, request):
        """Export all user data as JSON"""
        user = request.user
        data = {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined.isoformat(),
            },
        }

        try:
            profile = user.profile
            data['profile'] = UserProfileSerializer(profile).data
        except Exception:
            data['profile'] = None

        try:
            settings = PrivacySettings.objects.get(user=user)
            data['privacy_settings'] = PrivacySettingsSerializer(settings).data
        except PrivacySettings.DoesNotExist:
            data['privacy_settings'] = None

        data['trading'] = list(user.trades.values('id', 'symbol', 'type', 'amount', 'price', 'created_at'))
        data['watchlist'] = list(user.watchlist.values('id', 'symbol', 'name'))
        data['courses'] = list(user.enrolled_courses.values('id', 'course__title', 'progress', 'completed'))

        return JsonResponse(data, safe=False)

    @action(detail=False, methods=['delete'])
    def delete_account(self, request):
        """Permanently delete user account after password confirmation"""
        serializer = DeleteAccountSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if not user.check_password(serializer.validated_data['password']):
            return Response({'password': ['Password is incorrect.']}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response({'detail': 'Account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
