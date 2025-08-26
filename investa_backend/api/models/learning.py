from django.db import models
from django.contrib.auth.models import User
from .user import Language


class LearningProgress(models.Model):
    """Track user's learning progress and achievements"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='learning_progress')
    total_modules = models.IntegerField(default=0)
    completed_modules = models.IntegerField(default=0)
    total_hours_learned = models.IntegerField(default=0)
    certificates_earned = models.IntegerField(default=0)
    average_quiz_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    quizzes_taken = models.IntegerField(default=0)
    quizzes_passed = models.IntegerField(default=0)
    badges_earned = models.IntegerField(default=0)
    last_activity = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def completion_percentage(self):
        if self.total_modules == 0:
            return 0
        return round((self.completed_modules / self.total_modules) * 100, 1)
    
    def __str__(self):
        return f"{self.user.username}'s Learning Progress"


DIFFICULTY_LEVELS = [
    ('beginner', 'Beginner'),
    ('intermediate', 'Intermediate'),
    ('advanced', 'Advanced'),
]


class Course(models.Model):
    """Course metadata and structure"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    language = models.ForeignKey(Language, on_delete=models.PROTECT, related_name='courses')
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='beginner')
    estimated_duration = models.IntegerField(default=0, help_text="Estimated total minutes")
    thumbnail = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title


class Lesson(models.Model):
    """Lessons within a course"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    video_url = models.URLField(null=True, blank=True)
    order = models.IntegerField(default=0)
    estimated_duration = models.IntegerField(default=0, help_text="Estimated minutes")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['course_id', 'order', 'id']

    def __str__(self) -> str:
        return f"{self.course.title} - {self.title}"


class UserLessonProgress(models.Model):
    """Per-user progress tracking for lessons"""
    STATUS_CHOICES = [
        ('locked', 'Locked'),
        ('available', 'Available'),
        ('progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress_records')
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='available')
    progress = models.PositiveIntegerField(default=0, help_text="0-100 percentage")
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [('user', 'lesson')]

    def __str__(self) -> str:
        return f"{self.user.username} - {self.lesson.title} ({self.status})"


class Badge(models.Model):
    """Achievement badges for users"""
    BADGE_TYPES = [
        ('learning', 'Learning'),
        ('trading', 'Trading'),
        ('security', 'Security'),
        ('social', 'Social'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    badge_type = models.CharField(max_length=20, choices=BADGE_TYPES)
    icon_name = models.CharField(max_length=50, help_text="Icon identifier")
    color = models.CharField(max_length=7, default="#4f46e5", help_text="Hex color code")
    criteria = models.JSONField(default=dict, help_text="Criteria to earn this badge")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class UserBadge(models.Model):
    """User earned badges"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='earned_badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'badge']
    
    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"
