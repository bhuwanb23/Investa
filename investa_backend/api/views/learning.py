from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from django.utils import timezone
from ..models import LearningProgress, Badge, UserBadge, Course, Lesson, UserLessonProgress
from ..serializers import (
    LearningProgressSerializer, BadgeSerializer, UserBadgeSerializer,
    CourseSerializer, LessonSerializer, UserLessonProgressSerializer
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


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """List courses and retrieve details with lessons"""
    queryset = Course.objects.prefetch_related('lessons').all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def with_progress(self, request, pk=None):
        """Get course details with user progress (for development, uses default user)"""
        course = self.get_object()
        
        # For development, create a default user if none exists
        if not request.user.is_authenticated:
            from django.contrib.auth.models import User
            user, created = User.objects.get_or_create(
                username='dev_user',
                defaults={'email': 'dev@example.com'}
            )
            if created:
                user.set_password('devpass123')
                user.save()
            request.user = user
        
        # Get user progress for this course
        lesson_progress = UserLessonProgress.objects.filter(
            user=request.user,
            lesson__course=course
        ).select_related('lesson')
        
        # Create a progress map
        progress_map = {lp.lesson_id: lp for lp in lesson_progress}
        
        # Serialize course with progress info
        course_data = CourseSerializer(course).data
        
        # Add progress info to lessons
        for lesson in course_data['lessons']:
            lesson_id = lesson['id']
            if lesson_id in progress_map:
                progress = progress_map[lesson_id]
                lesson['user_progress'] = {
                    'status': progress.status,
                    'progress': progress.progress,
                    'completed_at': progress.completed_at.isoformat() if progress.completed_at else None
                }
            else:
                lesson['user_progress'] = {
                    'status': 'available',
                    'progress': 0,
                    'completed_at': None
                }
        
        return Response(course_data)


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """Retrieve lesson details"""
    queryset = Lesson.objects.select_related('course').all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def mark_completed(self, request, pk=None):
        lesson = self.get_object()
        
        # For development, create a default user if none exists
        if not request.user.is_authenticated:
            from django.contrib.auth.models import User
            user, created = User.objects.get_or_create(
                username='dev_user',
                defaults={'email': 'dev@example.com'}
            )
            if created:
                user.set_password('devpass123')
                user.save()
            request.user = user
        
        progress, _ = UserLessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        progress.status = 'completed'
        progress.progress = 100
        progress.completed_at = timezone.now()
        progress.save(update_fields=['status', 'progress', 'completed_at'])
        
        print(f"✅ Lesson {lesson.id} marked as completed for user {request.user.username}")
        return Response({'detail': 'Lesson marked as completed'})


class UserLessonProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """Current user's lesson progress"""
    serializer_class = UserLessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserLessonProgress.objects.filter(user=self.request.user).select_related('lesson__course', 'user')
