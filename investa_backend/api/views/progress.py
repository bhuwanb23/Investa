from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone
from datetime import timedelta

from ..models.progress import UserProgress, WeeklyActivity
from ..models.learning import Course, Lesson, UserLessonProgress, Quiz, UserQuizAttempt
from ..models.trading import Portfolio, Order, UserAchievement, Achievement
from ..serializers.progress import (
    UserProgressSerializer, 
    UserProgressSummarySerializer,
    ProgressStatsSerializer
)


class UserProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for comprehensive user progress"""
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        """Get current user's comprehensive progress"""
        try:
            progress = UserProgress.objects.get(user=request.user)
            serializer = self.get_serializer(progress)
            return Response(serializer.data)
        except UserProgress.DoesNotExist:
            # Create progress record if it doesn't exist
            progress = self._create_user_progress(request.user)
            serializer = self.get_serializer(progress)
            return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get progress summary for display"""
        try:
            progress = UserProgress.objects.get(user=request.user)
            serializer = UserProgressSummarySerializer(progress)
            return Response(serializer.data)
        except UserProgress.DoesNotExist:
            # Create progress record if it doesn't exist
            progress = self._create_user_progress(request.user)
            serializer = UserProgressSummarySerializer(progress)
            return Response(serializer.data)
    
    def _create_user_progress(self, user):
        """Create a new user progress record"""
        progress = UserProgress.objects.create(user=user)
        self._update_progress_data(progress)
        progress.save()
        return progress
    
    def _update_progress_data(self, progress):
        """Update progress data from all related models"""
        user = progress.user
        
        # Learning progress
        total_courses = Course.objects.filter(is_active=True).count()
        completed_courses = self._get_completed_courses_count(user)
        total_lessons = Lesson.objects.filter(is_active=True).count()
        completed_lessons = UserLessonProgress.objects.filter(
            user=user, 
            status='completed'
        ).count()
        
        # Quiz progress
        total_quizzes = Quiz.objects.filter(lesson__is_active=True).count()
        quiz_attempts = UserQuizAttempt.objects.filter(user=user)
        completed_quizzes = quiz_attempts.count()
        average_quiz_score = quiz_attempts.aggregate(
            avg_score=Avg('score')
        )['avg_score'] or 0.00
        
        # Update progress fields
        progress.total_courses = total_courses
        progress.completed_courses = completed_courses
        progress.total_lessons = total_lessons
        progress.completed_lessons = completed_lessons
        progress.total_quizzes = total_quizzes
        progress.completed_quizzes = completed_quizzes
        progress.average_quiz_score = average_quiz_score
        
        # Calculate experience points
        progress.experience_points = (
            completed_lessons * 10 +
            completed_quizzes * 5 +
            completed_courses * 50
        )
        
        # Update activity tracking
        if progress.last_activity_date != timezone.now().date():
            progress.last_activity_date = timezone.now().date()
            progress.total_activity_days += 1
    
    def _get_completed_courses_count(self, user):
        """Get count of completed courses"""
        completed_courses = 0
        courses = Course.objects.filter(is_active=True)
        
        for course in courses:
            total_lessons = course.lessons.filter(is_active=True).count()
            completed_lessons = UserLessonProgress.objects.filter(
                user=user,
                lesson__course=course,
                status='completed'
            ).count()
            
            if total_lessons > 0 and completed_lessons >= total_lessons:
                completed_courses += 1
        
        return completed_courses
    
    @action(detail=False, methods=['get'])
    def weekly_activity(self, request):
        """Get weekly activity data for charts"""
        # Calculate weekly activity for the current user
        from datetime import timedelta
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        
        # Get or create weekly activity
        weekly_activity, created = WeeklyActivity.objects.get_or_create(
            user=request.user,
            week_start=week_start,
            defaults={
                'week_end': week_end,
                'lessons_completed': 0,
                'quizzes_taken': 0,
                'learning_hours': 0,
                'trades_made': 0,
                'portfolio_change': 0.00,
                'activity_score': 0
            }
        )
        
        # Calculate activity data
        lessons_completed = UserLessonProgress.objects.filter(
            user=request.user,
            status='completed',
            completed_at__date__gte=week_start,
            completed_at__date__lte=week_end
        ).count()
        
        quizzes_taken = UserQuizAttempt.objects.filter(
            user=request.user,
            started_at__date__gte=week_start,
            started_at__date__lte=week_end
        ).count()
        
        # Update weekly activity
        weekly_activity.lessons_completed = lessons_completed
        weekly_activity.quizzes_taken = quizzes_taken
        weekly_activity.save()
        
        # Return weekly activity data
        activity_data = {
            'week': week_start.strftime('%Y-%m-%d'),
            'lessons_completed': weekly_activity.lessons_completed,
            'quizzes_taken': weekly_activity.quizzes_taken,
            'activity_score': weekly_activity.activity_score
        }
        
        return Response([activity_data])
