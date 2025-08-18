from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta

from .models import (
    Language, UserProfile, Course, Lesson, Quiz, Question, Answer,
    UserProgress, QuizAttempt, SimulatedTrade, Notification
)
from .serializers import (
    LanguageSerializer, UserProfileSerializer, CourseSerializer, LessonSerializer,
    QuizSerializer, QuestionSerializer, AnswerSerializer, UserProgressSerializer,
    QuizAttemptSerializer, SimulatedTradeSerializer, NotificationSerializer,
    CourseDetailSerializer, LessonDetailSerializer, QuizDetailSerializer,
    UserRegistrationSerializer, ProfileUpdateSerializer
)


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for languages - read-only"""
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profiles"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current user's profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user's profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for courses"""
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer
    
    @action(detail=False, methods=['get'])
    def by_language(self, request):
        """Get courses by language"""
        language_code = request.query_params.get('language', 'en')
        try:
            language = Language.objects.get(code=language_code)
            courses = self.queryset.filter(language=language)
            serializer = self.get_serializer(courses, many=True)
            return Response(serializer.data)
        except Language.DoesNotExist:
            return Response({'detail': 'Language not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def by_difficulty(self, request):
        """Get courses by difficulty level"""
        difficulty = request.query_params.get('difficulty', 'beginner')
        courses = self.queryset.filter(difficulty_level=difficulty)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """Enroll user in a course"""
        course = self.get_object()
        user = request.user
        
        # Create progress entries for all lessons in the course
        lessons = course.lessons.all()
        for lesson in lessons:
            UserProgress.objects.get_or_create(
                user=user,
                course=course,
                lesson=lesson,
                defaults={'completed': False}
            )
        
        return Response({'detail': 'Successfully enrolled in course'}, status=status.HTTP_201_CREATED)


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for lessons"""
    queryset = Lesson.objects.filter(is_active=True)
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LessonDetailSerializer
        return LessonSerializer
    
    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        """Mark a lesson as completed"""
        lesson = self.get_object()
        user = request.user
        
        try:
            progress = UserProgress.objects.get(
                user=user,
                course=lesson.course,
                lesson=lesson
            )
            progress.completed = True
            progress.completed_at = timezone.now()
            progress.save()
            
            return Response({'detail': 'Lesson marked as completed'})
        except UserProgress.DoesNotExist:
            return Response({'detail': 'User not enrolled in this course'}, status=status.HTTP_400_BAD_REQUEST)


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for quizzes"""
    queryset = Quiz.objects.filter(is_active=True)
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return QuizSerializer
    
    @action(detail=True, methods=['post'])
    def submit_attempt(self, request, pk=None):
        """Submit a quiz attempt"""
        quiz = self.get_object()
        user = request.user
        
        # Get answers from request
        answers = request.data.get('answers', [])
        
        # Calculate score
        total_questions = quiz.questions.count()
        correct_answers = 0
        
        for answer_data in answers:
            question_id = answer_data.get('question_id')
            selected_answer_id = answer_data.get('answer_id')
            
            try:
                question = Question.objects.get(id=question_id, quiz=quiz)
                correct_answer = Answer.objects.filter(question=question, is_correct=True).first()
                
                if correct_answer and str(correct_answer.id) == str(selected_answer_id):
                    correct_answers += 1
            except Question.DoesNotExist:
                continue
        
        score = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0
        passed = score >= quiz.passing_score
        
        # Create quiz attempt
        attempt = QuizAttempt.objects.create(
            user=user,
            quiz=quiz,
            score=score,
            passed=passed,
            time_taken=request.data.get('time_taken', 0)
        )
        
        return Response({
            'score': score,
            'passed': passed,
            'correct_answers': correct_answers,
            'total_questions': total_questions,
            'attempt_id': attempt.id
        })


class UserProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user progress"""
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def course_progress(self, request):
        """Get progress for a specific course"""
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({'detail': 'course_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        progress = self.get_queryset().filter(course_id=course_id)
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overall_progress(self, request):
        """Get overall learning progress"""
        user = request.user
        total_courses = Course.objects.filter(is_active=True).count()
        completed_lessons = UserProgress.objects.filter(user=user, completed=True).count()
        total_lessons = Lesson.objects.filter(is_active=True).count()
        
        progress_percentage = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        
        return Response({
            'total_courses': total_courses,
            'completed_lessons': completed_lessons,
            'total_lessons': total_lessons,
            'progress_percentage': round(progress_percentage, 2)
        })


class SimulatedTradeViewSet(viewsets.ModelViewSet):
    """ViewSet for simulated trading"""
    serializer_class = SimulatedTradeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SimulatedTrade.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def portfolio_summary(self, request):
        """Get portfolio summary for simulated trading"""
        user = request.user
        trades = self.get_queryset()
        
        # Calculate portfolio value
        portfolio_value = 0
        holdings = {}
        
        for trade in trades:
            symbol = trade.symbol
            if symbol not in holdings:
                holdings[symbol] = {'quantity': 0, 'avg_price': 0, 'total_cost': 0}
            
            if trade.trade_type == 'buy':
                current_quantity = holdings[symbol]['quantity']
                current_total = holdings[symbol]['total_cost']
                
                new_quantity = current_quantity + trade.quantity
                new_total = current_total + trade.total_amount
                
                holdings[symbol]['quantity'] = new_quantity
                holdings[symbol]['total_cost'] = new_total
                holdings[symbol]['avg_price'] = new_total / new_quantity if new_quantity > 0 else 0
            else:  # sell
                holdings[symbol]['quantity'] -= trade.quantity
                if holdings[symbol]['quantity'] <= 0:
                    del holdings[symbol]
        
        return Response({
            'holdings': holdings,
            'total_trades': trades.count(),
            'buy_trades': trades.filter(trade_type='buy').count(),
            'sell_trades': trades.filter(trade_type='sell').count()
        })


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({'detail': 'Notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(read=True)
        return Response({'detail': 'All notifications marked as read'})


# Custom authentication views
class CustomAuthToken(ObtainAuthToken):
    """Custom authentication token view"""
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                         context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email,
            'profile': UserProfileSerializer(profile).data
        })


class UserRegistrationView(viewsets.GenericViewSet):
    """User registration view"""
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create user profile
            UserProfile.objects.create(user=user)
            
            # Create auth token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email,
                'detail': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
