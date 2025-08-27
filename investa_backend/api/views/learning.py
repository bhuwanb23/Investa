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
        
        print(f"🔍 Fetching course {course.id} ({course.title}) with progress for user {request.user.username}")
        
        # Get user progress for this course - ONLY for lessons that actually have progress
        lesson_progress = UserLessonProgress.objects.filter(
            user=request.user,
            lesson__course=course
        ).select_related('lesson')
        
        print(f"📊 Found {lesson_progress.count()} progress records for this course")
        for lp in lesson_progress:
            print(f"   - Lesson {lp.lesson.id}: Status={lp.status}, Progress={lp.progress}, Completed={lp.completed_at}")
        
        # Create a progress map - ONLY for lessons that have actual progress records
        progress_map = {lp.lesson_id: lp for lp in lesson_progress}
        
        # Serialize course with progress info
        course_data = CourseSerializer(course).data
        
        # Add progress info to lessons - CRITICAL: Only add progress for lessons that actually have it
        for lesson in course_data['lessons']:
            lesson_id = lesson['id']
            print(f"🔍 Processing lesson {lesson_id} ({lesson.get('title', 'Unknown')})")
            
            if lesson_id in progress_map:
                progress = progress_map[lesson_id]
                # Only set completed if it's actually completed in the database
                if progress.status == 'completed':
                    lesson['user_progress'] = {
                        'status': 'completed',
                        'progress': 100,
                        'completed_at': progress.completed_at.isoformat() if progress.completed_at else None
                    }
                    print(f"✅ Lesson {lesson_id}: Marked as COMPLETED - Status={progress.status}, Progress={progress.progress}")
                else:
                    lesson['user_progress'] = {
                        'status': progress.status,
                        'progress': progress.progress,
                        'completed_at': None
                    }
                    print(f"🔄 Lesson {lesson_id}: Has progress but not completed - Status={progress.status}, Progress={progress.progress}")
            else:
                # No progress record exists - this lesson is available
                lesson['user_progress'] = {
                    'status': 'available',
                    'progress': 0,
                    'completed_at': None
                }
                print(f"❌ Lesson {lesson_id}: No progress found, defaulting to available")
        
        print(f"🔍 Final course data lessons:")
        for lesson in course_data['lessons']:
            print(f"   - Lesson {lesson['id']}: {lesson.get('title', 'Unknown')} -> Status: {lesson['user_progress']['status']}")
        
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
        
        print(f"🔍 Marking lesson {lesson.id} ({lesson.title}) as completed for user {request.user.username}")
        
        # CRITICAL: Check existing progress records for this user and lesson
        existing_progress = UserLessonProgress.objects.filter(user=request.user, lesson=lesson)
        print(f"🔍 Found {existing_progress.count()} existing progress records for lesson {lesson.id}")
        for ep in existing_progress:
            print(f"   - Progress ID {ep.id}: Status={ep.status}, Progress={ep.progress}")
        
        # CRITICAL: Check if there are any other progress records that might be interfering
        all_user_progress = UserLessonProgress.objects.filter(user=request.user)
        print(f"🔍 Total progress records for user {request.user.username} BEFORE marking: {all_user_progress.count()}")
        for ap in all_user_progress:
            print(f"   - Lesson {ap.lesson.id} ({ap.lesson.title}): Status={ap.status}, Progress={ap.progress}")
        
        # CRITICAL: Use get_or_create to ensure only ONE record per lesson per user
        progress, created = UserLessonProgress.objects.get_or_create(
            user=request.user, 
            lesson=lesson,
            defaults={
                'status': 'completed',
                'progress': 100,
                'completed_at': timezone.now()
            }
        )
        
        if not created:
            # Update existing progress
            progress.status = 'completed'
            progress.progress = 100
            progress.completed_at = timezone.now()
        
        progress.save()
        
        print(f"✅ Lesson {lesson.id} marked as completed for user {request.user.username}")
        print(f"📊 Progress record: ID={progress.id}, Status={progress.status}, Progress={progress.progress}, Completed={progress.completed_at}")
        
        # Verify the data was saved
        saved_progress = UserLessonProgress.objects.get(id=progress.id)
        print(f"🔍 Verification: Saved progress - Status={saved_progress.status}, Progress={saved_progress.progress}, Completed={saved_progress.completed_at}")
        
        # CRITICAL: Check all progress records for this user after saving
        all_progress_after = UserLessonProgress.objects.filter(user=request.user)
        print(f"🔍 Total progress records for user {request.user.username} AFTER marking: {all_progress_after.count()}")
        for ap in all_progress_after:
            print(f"   - Lesson {ap.lesson.id} ({ap.lesson.title}): Status={ap.status}, Progress={ap.progress}")
        
        # CRITICAL: Verify that ONLY the intended lesson was marked as completed
        completed_lessons = UserLessonProgress.objects.filter(user=request.user, status='completed')
        print(f"🔍 Lessons marked as completed: {completed_lessons.count()}")
        for cl in completed_lessons:
            print(f"   - Lesson {cl.lesson.id} ({cl.lesson.title}): Completed at {cl.completed_at}")
        
        return Response({'detail': 'Lesson marked as completed'})


class UserLessonProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """Current user's lesson progress"""
    serializer_class = UserLessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserLessonProgress.objects.filter(user=self.request.user).select_related('lesson__course', 'user')
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def debug_progress(self, request):
        """Debug endpoint to check all user progress (for development)"""
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
        
        # Get all progress for this user
        progress_records = UserLessonProgress.objects.filter(
            user=request.user
        ).select_related('lesson__course')
        
        debug_data = {
            'user': request.user.username,
            'total_progress_records': progress_records.count(),
            'progress_details': []
        }
        
        for progress in progress_records:
            debug_data['progress_details'].append({
                'lesson_id': progress.lesson.id,
                'lesson_title': progress.lesson.title,
                'course_title': progress.lesson.course.title,
                'status': progress.status,
                'progress': progress.progress,
                'completed_at': progress.completed_at.isoformat() if progress.completed_at else None,
                'started_at': progress.started_at.isoformat()
            })
        
        print(f"🔍 Debug progress for user {request.user.username}: {debug_data}")
        return Response(debug_data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def cleanup_progress(self, request):
        """Clean up progress records (for development)"""
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
        
        # Delete all progress records for this user
        deleted_count = UserLessonProgress.objects.filter(user=request.user).delete()[0]
        
        print(f"🧹 Cleaned up {deleted_count} progress records for user {request.user.username}")
        
        return Response({
            'detail': f'Cleaned up {deleted_count} progress records',
            'deleted_count': deleted_count
        })

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def check_database_state(self, request):
        """Check the current database state (for development)"""
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
        
        # Get all progress records for this user
        progress_records = UserLessonProgress.objects.filter(
            user=request.user
        ).select_related('lesson__course')
        
        # Get all lessons for all courses
        all_lessons = Lesson.objects.select_related('course').all()
        
        # Check which lessons have progress records
        lessons_with_progress = []
        lessons_without_progress = []
        
        for lesson in all_lessons:
            has_progress = progress_records.filter(lesson=lesson).exists()
            if has_progress:
                progress = progress_records.get(lesson=lesson)
                lessons_with_progress.append({
                    'lesson_id': lesson.id,
                    'lesson_title': lesson.title,
                    'course_title': lesson.course.title,
                    'progress_id': progress.id,
                    'status': progress.status,
                    'progress': progress.progress,
                    'completed_at': progress.completed_at.isoformat() if progress.completed_at else None
                })
            else:
                lessons_without_progress.append({
                    'lesson_id': lesson.id,
                    'lesson_title': lesson.title,
                    'course_title': lesson.course.title
                })
        
        debug_data = {
            'user': request.user.username,
            'total_progress_records': progress_records.count(),
            'total_lessons': all_lessons.count(),
            'lessons_with_progress': lessons_with_progress,
            'lessons_without_progress': lessons_without_progress,
            'completed_lessons_count': progress_records.filter(status='completed').count()
        }
        
        print(f"🔍 Database state for user {request.user.username}:")
        print(f"   - Total progress records: {debug_data['total_progress_records']}")
        print(f"   - Total lessons: {debug_data['total_lessons']}")
        print(f"   - Completed lessons: {debug_data['completed_lessons_count']}")
        print(f"   - Lessons with progress: {len(debug_data['lessons_with_progress'])}")
        print(f"   - Lessons without progress: {len(debug_data['lessons_without_progress'])}")
        
        return Response(debug_data)
