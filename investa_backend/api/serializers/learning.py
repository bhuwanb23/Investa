from rest_framework import serializers
from ..models import LearningProgress, Badge, UserBadge, Course, Lesson, UserLessonProgress, Quiz, Question, Answer, UserQuizAttempt, UserQuizAnswer
from .auth import UserSerializer
from .user import LanguageSerializer


class LearningProgressSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    completion_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = LearningProgress
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'last_activity']


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'
        read_only_fields = ['created_at']


class UserBadgeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = '__all__'
        read_only_fields = ['user', 'badge', 'earned_at']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CourseSerializer(serializers.ModelSerializer):
    language = LanguageSerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class UserLessonProgressSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    lesson = LessonSerializer(read_only=True)

    class Meta:
        model = UserLessonProgress
        fields = '__all__'
        read_only_fields = ['user', 'lesson', 'started_at', 'completed_at']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Quiz
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class UserQuizAnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    selected_answer = AnswerSerializer(read_only=True)
    
    class Meta:
        model = UserQuizAnswer
        fields = '__all__'
        read_only_fields = ['user_attempt', 'question', 'selected_answer', 'is_correct', 'points_earned', 'answered_at']


class UserQuizAttemptSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    quiz = QuizSerializer(read_only=True)
    answers = UserQuizAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserQuizAttempt
        fields = '__all__'
        read_only_fields = ['user', 'quiz', 'started_at', 'completed_at', 'passed']
