from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import (
    Language, UserProfile, Course, Lesson, Quiz, Question, Answer,
    UserProgress, QuizAttempt, SimulatedTrade, Notification
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    preferred_language = LanguageSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    language = LanguageSerializer(read_only=True)
    
    class Meta:
        model = Course
        fields = '__all__'


class UserProgressSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    lesson = LessonSerializer(read_only=True)
    
    class Meta:
        model = UserProgress
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = '__all__'
        read_only_fields = ['started_at', 'completed_at']


class SimulatedTradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulatedTrade
        fields = '__all__'
        read_only_fields = ['timestamp']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['created_at']


# Detailed serializers for specific use cases
class CourseDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    language = LanguageSerializer(read_only=True)
    user_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = '__all__'
    
    def get_user_progress(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            progress = UserProgress.objects.filter(user=user, course=obj)
            return UserProgressSerializer(progress, many=True).data
        return []


class LessonDetailSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    quizzes = QuizSerializer(many=True, read_only=True)
    user_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = '__all__'
    
    def get_user_progress(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            try:
                progress = UserProgress.objects.get(user=user, course=obj.course, lesson=obj)
                return UserProgressSerializer(progress).data
            except UserProgress.DoesNotExist:
                return None
        return None


class QuizDetailSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    user_attempts = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = '__all__'
    
    def get_user_attempts(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            attempts = QuizAttempt.objects.filter(user=user, quiz=obj).order_by('-started_at')
            return QuizAttemptSerializer(attempts, many=True).data
        return []


# Serializers for user registration and profile creation
class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Username already taken.")
        ]
    )
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Email already registered.")
        ]
    )
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'first_name', 'last_name']
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
