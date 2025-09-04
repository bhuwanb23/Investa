from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone
from datetime import timedelta


class UserProgress(models.Model):
    """Comprehensive user progress tracking that aggregates data from all models"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='comprehensive_progress')
    
    # Learning Progress
    total_courses = models.IntegerField(default=0)
    completed_courses = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    completed_lessons = models.IntegerField(default=0)
    total_quizzes = models.IntegerField(default=0)
    completed_quizzes = models.IntegerField(default=0)
    average_quiz_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_learning_hours = models.IntegerField(default=0)
    
    # Trading Progress
    portfolio_value = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    portfolio_growth_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_trades = models.IntegerField(default=0)
    successful_trades = models.IntegerField(default=0)
    total_profit_loss = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    win_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    # Achievement Progress
    total_badges = models.IntegerField(default=0)
    earned_badges = models.IntegerField(default=0)
    total_achievements = models.IntegerField(default=0)
    earned_achievements = models.IntegerField(default=0)
    
    # Activity Tracking
    current_streak_days = models.IntegerField(default=0)
    longest_streak_days = models.IntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    total_activity_days = models.IntegerField(default=0)
    
    # Experience & Leveling
    experience_points = models.IntegerField(default=0)
    current_level = models.IntegerField(default=1)
    experience_to_next_level = models.IntegerField(default=100)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "User Progress"
    
    def __str__(self):
        return f"{self.user.username}'s Comprehensive Progress"
    
    @property
    def learning_completion_percentage(self):
        if self.total_lessons == 0:
            return 0
        return round((self.completed_lessons / self.total_lessons) * 100, 1)
    
    @property
    def course_completion_percentage(self):
        if self.total_courses == 0:
            return 0
        return round((self.completed_courses / self.total_courses) * 100, 1)
    
    @property
    def quiz_completion_percentage(self):
        if self.total_quizzes == 0:
            return 0
        return round((self.completed_quizzes / self.total_quizzes) * 100, 1)
    
    @property
    def badge_completion_percentage(self):
        if self.total_badges == 0:
            return 0
        return round((self.earned_badges / self.total_badges) * 100, 1)
    
    @property
    def achievement_completion_percentage(self):
        if self.total_achievements == 0:
            return 0
        return round((self.earned_achievements / self.total_achievements) * 100, 1)
    
    @property
    def overall_progress_percentage(self):
        """Calculate overall progress across all areas"""
        areas = [
            self.learning_completion_percentage,
            self.quiz_completion_percentage,
            self.badge_completion_percentage,
            self.achievement_completion_percentage,
        ]
        return round(sum(areas) / len(areas), 1)
    
    def calculate_level(self):
        """Calculate current level based on experience points"""
        if self.experience_points < 100:
            self.current_level = 1
            self.experience_to_next_level = 100 - self.experience_points
        elif self.experience_points < 300:
            self.current_level = 2
            self.experience_to_next_level = 300 - self.experience_points
        elif self.experience_points < 600:
            self.current_level = 3
            self.experience_to_next_level = 600 - self.experience_points
        elif self.experience_points < 1000:
            self.current_level = 4
            self.experience_to_next_level = 1000 - self.experience_points
        elif self.experience_points < 1500:
            self.current_level = 5
            self.experience_to_next_level = 1500 - self.experience_points
        elif self.experience_points < 2100:
            self.current_level = 6
            self.experience_to_next_level = 2100 - self.experience_points
        elif self.experience_points < 2800:
            self.current_level = 7
            self.experience_to_next_level = 2800 - self.experience_points
        elif self.experience_points < 3600:
            self.current_level = 8
            self.experience_to_next_level = 3600 - self.experience_points
        elif self.experience_points < 4500:
            self.current_level = 9
            self.experience_to_next_level = 4500 - self.experience_points
        else:
            self.current_level = 10
            self.experience_to_next_level = 0
    
    def save(self, *args, **kwargs):
        """Override save to calculate level"""
        self.calculate_level()
        super().save(*args, **kwargs)


class WeeklyActivity(models.Model):
    """Track weekly learning and trading activity"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weekly_activities')
    week_start = models.DateField()
    week_end = models.DateField()
    
    # Learning activity
    lessons_completed = models.IntegerField(default=0)
    quizzes_taken = models.IntegerField(default=0)
    learning_hours = models.IntegerField(default=0)
    
    # Trading activity
    trades_made = models.IntegerField(default=0)
    portfolio_change = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    
    # Activity score (0-100)
    activity_score = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'week_start']
        ordering = ['-week_start']
    
    def __str__(self):
        return f"{self.user.username} - Week of {self.week_start}"
    
    def calculate_activity_score(self):
        """Calculate activity score based on various metrics"""
        score = 0
        
        # Learning metrics (60% weight)
        if self.lessons_completed > 0:
            score += min(self.lessons_completed * 10, 30)  # Max 30 points
        if self.quizzes_taken > 0:
            score += min(self.quizzes_taken * 5, 20)      # Max 20 points
        if self.learning_hours > 0:
            score += min(self.learning_hours * 2, 10)     # Max 10 points
        
        # Trading metrics (40% weight)
        if self.trades_made > 0:
            score += min(self.trades_made * 3, 15)        # Max 15 points
        if self.portfolio_change > 0:
            score += min(25, 25)                          # Max 25 points for positive change
        
        self.activity_score = min(score, 100)
    
    def save(self, *args, **kwargs):
        """Override save to calculate activity score"""
        self.calculate_activity_score()
        super().save(*args, **kwargs)


class MonthlyProgress(models.Model):
    """Track monthly progress summaries"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='monthly_progress')
    month = models.DateField()  # First day of month
    
    # Monthly summaries
    total_lessons_completed = models.IntegerField(default=0)
    total_quizzes_taken = models.IntegerField(default=0)
    average_quiz_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_trades = models.IntegerField(default=0)
    portfolio_growth = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    new_achievements = models.IntegerField(default=0)
    new_badges = models.IntegerField(default=0)
    
    # Monthly goals and achievements
    goals_met = models.IntegerField(default=0)
    total_goals = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'month']
        ordering = ['-month']
    
    def __str__(self):
        return f"{self.user.username} - {self.month.strftime('%B %Y')}"
    
    @property
    def goal_completion_percentage(self):
        if self.total_goals == 0:
            return 0
        return round((self.goals_met / self.total_goals) * 100, 1)
