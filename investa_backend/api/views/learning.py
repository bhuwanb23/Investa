from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import LearningProgress, Badge, UserBadge
from ..serializers import (
    LearningProgressSerializer, BadgeSerializer, UserBadgeSerializer
)


class LearningProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for learning progress"""
    serializer_class = LearningProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return LearningProgress.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        """Get current user's learning progress"""
        try:
            progress = LearningProgress.objects.get(user=request.user)
            serializer = self.get_serializer(progress)
            return Response(serializer.data)
        except LearningProgress.DoesNotExist:
            return Response({'detail': 'Learning progress not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def update_progress(self, request):
        """Update learning progress (for internal use)"""
        try:
            progress = LearningProgress.objects.get(user=request.user)
            # This would typically be called by the learning system
            # For now, just return current progress
            serializer = self.get_serializer(progress)
            return Response(serializer.data)
        except LearningProgress.DoesNotExist:
            return Response({'detail': 'Learning progress not found'}, status=status.HTTP_404_NOT_FOUND)


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for badges"""
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_badges(self, request):
        """Get current user's earned badges"""
        user_badges = UserBadge.objects.filter(user=request.user)
        serializer = UserBadgeSerializer(user_badges, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available_badges(self, request):
        """Get all available badges"""
        badges = Badge.objects.all()
        serializer = self.get_serializer(badges, many=True)
        return Response(serializer.data)
