from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from django.utils import timezone
from ..models import LearningProgress, Badge, UserBadge, Course, Lesson, UserLessonProgress, Quiz, Question, Answer, UserQuizAttempt, UserQuizAnswer
from ..serializers import (
    LearningProgressSerializer, BadgeSerializer, UserBadgeSerializer,
    CourseSerializer, LessonSerializer, UserLessonProgressSerializer,
    QuizSerializer, QuestionSerializer, AnswerSerializer, UserQuizAttemptSerializer, UserQuizAnswerSerializer
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
    """ViewSet for courses"""
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def with_progress(self, request, pk=None):
        """Get course details with user progress"""
        course = self.get_object()
        
        # Get user progress for this course - ONLY for lessons that actually have progress
        lesson_progress = UserLessonProgress.objects.filter(
            user=request.user,
            lesson__course=course
        ).select_related('lesson')
        
        # Create a progress map - ONLY for lessons that have actual progress records
        progress_map = {lp.lesson_id: lp for lp in lesson_progress}
        
        # Serialize course with progress info
        course_data = CourseSerializer(course).data
        
        # Add progress info to lessons - CRITICAL: Only add progress for lessons that actually have it
        for lesson in course_data['lessons']:
            lesson_id = lesson['id']
            
            if lesson_id in progress_map:
                progress = progress_map[lesson_id]
                # Only set completed if it's actually completed in the database
                if progress.status == 'completed':
                    lesson['user_progress'] = {
                        'status': 'completed',
                        'progress': 100,
                        'completed_at': progress.completed_at.isoformat() if progress.completed_at else None
                    }
                else:
                    lesson['user_progress'] = {
                        'status': progress.status,
                        'progress': progress.progress,
                        'completed_at': None
                    }
            else:
                # No progress record exists - this lesson is available
                lesson['user_progress'] = {
                    'status': 'available',
                    'progress': 0,
                    'completed_at': None
                }
        
        return Response(course_data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def certificate(self, request, pk=None):
        """Generate a certificate if course is completed"""
        course = self.get_object()
        user = request.user
        
        # Count active lessons in course
        total_lessons = course.lessons.filter(is_active=True).count()
        
        # Count completed lessons for user
        completed_lessons = UserLessonProgress.objects.filter(
            user=user,
            lesson__course=course,
            status='completed'
        ).count()
        
        if completed_lessons < total_lessons:
            return Response({
                'eligible': False,
                'completed': completed_lessons,
                'total': total_lessons,
                'detail': 'Course not fully completed yet'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Get completion date (latest lesson completion)
        latest_progress = UserLessonProgress.objects.filter(
            user=user,
            lesson__course=course,
            status='completed'
        ).order_by('-completed_at').first()
        
        completion_date = latest_progress.completed_at if latest_progress else timezone.now()
        
        # Generate dummy certificate ID
        certificate_id = f"INVESTA-{user.id}-{course.id}-{completion_date.strftime('%Y%m%d')}"
        
        return Response({
            'eligible': True,
            'course_title': course.title,
            'user_name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'completed_at': completion_date.isoformat(),
            'certificate_id': certificate_id
        })


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for lessons"""
    queryset = Lesson.objects.filter(is_active=True)
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def mark_completed(self, request, pk=None):
        """Mark a lesson as completed for the user"""
        lesson = self.get_object()
        user = request.user
        
        progress, created = UserLessonProgress.objects.get_or_create(
            user=user,
            lesson=lesson,
            defaults={'status': 'completed', 'progress': 100, 'completed_at': timezone.now()}
        )
        
        if not created:
            # Update existing progress
            progress.status = 'completed'
            progress.progress = 100
            progress.completed_at = timezone.now()
        
        progress.save()
        
        # Create learning notification
        from .trading import _create_notification
        _create_notification(
            request.user, 
            'Lesson Completed', 
            f'You have finished {lesson.title}', 
            'learning'
        )
        
        return Response({'status': 'completed'})


class UserLessonProgressViewSet(viewsets.ModelViewSet):
    """ViewSet for lesson progress"""
    serializer_class = UserLessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserLessonProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for quizzes"""
    queryset = Quiz.objects.filter(is_active=True)
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def for_lesson(self, request, pk=None):
        """Get the first active quiz for a specific lesson"""
        try:
            lesson = Lesson.objects.get(id=pk)
        except Lesson.DoesNotExist:
            return Response({'detail': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

        quiz = (
            Quiz.objects.filter(lesson=lesson, is_active=True)
            .order_by('id')
            .prefetch_related('questions__answers')
            .first()
        )
        if not quiz:
            # Auto-create a basic quiz for this lesson to avoid 404s
            quiz = Quiz.objects.create(
                lesson=lesson,
                title=f"Auto Quiz: {lesson.title}",
                description=f"Auto-generated quiz for {lesson.title}",
                time_limit=10,
                passing_score=70,
                is_active=True,
            )
            # Create a small default question set
            default_questions = [
                {
                    'question_text': f"What is the key idea of '{lesson.title}'?",
                    'question_type': 'multiple_choice',
                    'points': 2,
                    'order': 1,
                    'explanation': 'Tests your understanding of the core idea',
                    'answers': [
                        {'answer_text': 'Correct concept', 'is_correct': True, 'order': 1},
                        {'answer_text': 'Incorrect concept', 'is_correct': False, 'order': 2},
                        {'answer_text': 'Not related', 'is_correct': False, 'order': 3},
                        {'answer_text': 'Out of scope', 'is_correct': False, 'order': 4},
                    ],
                },
                {
                    'question_text': f"True or False: {lesson.title} is important to learn.",
                    'question_type': 'true_false',
                    'points': 1,
                    'order': 2,
                    'explanation': 'Reinforces importance',
                    'answers': [
                        {'answer_text': 'True', 'is_correct': True, 'order': 1},
                        {'answer_text': 'False', 'is_correct': False, 'order': 2},
                    ],
                },
            ]
            for qd in default_questions:
                answers = qd.pop('answers')
                q = Question.objects.create(quiz=quiz, **qd)
                for ad in answers:
                    Answer.objects.create(question=q, **ad)
        serializer = self.get_serializer(quiz)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def list_for_lesson(self, request, pk=None):
        """List all active quizzes for a specific lesson"""
        try:
            lesson = Lesson.objects.get(id=pk)
        except Lesson.DoesNotExist:
            return Response({'detail': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

        quizzes = (
            Quiz.objects.filter(lesson=lesson, is_active=True)
            .order_by('id')
            .prefetch_related('questions__answers')
        )
        serializer = self.get_serializer(quizzes, many=True)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for quiz questions"""
    queryset = Question.objects.prefetch_related('answers').all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


class AnswerViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for quiz answers"""
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserQuizAttemptViewSet(viewsets.ModelViewSet):
    """ViewSet for quiz attempts"""
    serializer_class = UserQuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserQuizAttempt.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def start_quiz(self, request):
        """Start a new quiz attempt"""
        quiz_id = request.data.get('quiz_id')
        if not quiz_id:
            return Response({'detail': 'quiz_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quiz = Quiz.objects.get(id=quiz_id, is_active=True)
        except Quiz.DoesNotExist:
            return Response({'detail': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create new quiz attempt
        attempt = UserQuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            total_questions=quiz.question_count
        )
        
        serializer = self.get_serializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def submit_answer(self, request, pk=None):
        """Submit an answer for a quiz question"""
        attempt = self.get_object()
        question_id = request.data.get('question_id')
        answer_id = request.data.get('answer_id')
        text_answer = request.data.get('text_answer', '')
        
        if not question_id:
            return Response({'detail': 'question_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            question = Question.objects.get(id=question_id, quiz=attempt.quiz)
        except Question.DoesNotExist:
            return Response({'detail': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if answer already exists
        user_answer, created = UserQuizAnswer.objects.get_or_create(
            user_attempt=attempt,
            question=question,
            defaults={
                'selected_answer_id': answer_id if answer_id else None,
                'text_answer': text_answer,
                'is_correct': False,
                'points_earned': 0
            }
        )
        
        if not created:
            # Update existing answer
            user_answer.selected_answer_id = answer_id if answer_id else None
            user_answer.text_answer = text_answer
        
        # Check if answer is correct
        if answer_id:
            try:
                selected_answer = Answer.objects.get(id=answer_id, question=question)
                user_answer.is_correct = selected_answer.is_correct
                user_answer.points_earned = question.points if selected_answer.is_correct else 0
            except Answer.DoesNotExist:
                user_answer.is_correct = False
                user_answer.points_earned = 0
        
        user_answer.save()
        
        # Update attempt statistics
        attempt.correct_answers = attempt.answers.filter(is_correct=True).count()
        if attempt.total_questions > 0:
            attempt.score = int((attempt.correct_answers / attempt.total_questions) * 100)
        attempt.save()
        
        return Response({
            'is_correct': user_answer.is_correct,
            'explanation': question.explanation,
            'current_score': attempt.score
        })
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def complete_quiz(self, request, pk=None):
        """Complete a quiz attempt"""
        attempt = self.get_object()
        time_taken = request.data.get('time_taken', 0)
        
        attempt.time_taken = time_taken
        attempt.completed_at = timezone.now()
        attempt.save()
        
        # Update learning progress
        try:
            progress = LearningProgress.objects.get(user=attempt.user)
            progress.quizzes_taken += 1
            if attempt.passed:
                progress.quizzes_passed += 1
            
            # Update average score
            total_score = progress.average_quiz_score * (progress.quizzes_taken - 1) + attempt.score
            progress.average_quiz_score = total_score / progress.quizzes_taken
            progress.save()
        except LearningProgress.DoesNotExist:
            pass
        
        # Update UserProgress XP and Level
        try:
            from ..models.progress import UserProgress
            progress_obj, _ = UserProgress.objects.get_or_create(user=attempt.user)
            # Add XP: score // 10 per quiz (10 points scored = 1 XP)
            progress_obj.experience_points += attempt.score // 10
            progress_obj.completed_quizzes += 1
            progress_obj.save() # Automatically triggers calculate_level()
            
            # Create achievement notification
            if attempt.passed:
                from .trading import _create_notification
                _create_notification(
                    attempt.user, 
                    'Quiz Passed!', 
                    f'You scored {attempt.score}% on {attempt.quiz.title}', 
                    'achievement'
                )
        except Exception as e:
            # Log error in production
            pass
        
        serializer = self.get_serializer(attempt)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_attempts(self, request):
        """Get current user's quiz attempts"""
        attempts = self.get_queryset().order_by('-started_at')
        serializer = self.get_serializer(attempts, many=True)
        return Response(serializer.data)
