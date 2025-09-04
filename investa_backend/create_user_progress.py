#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investa_backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProgress, Course, Lesson, UserQuizAttempt, Portfolio, Order

def create_user_progress():
    """Create progress data for existing users"""
    
    # Get all users
    users = User.objects.all()
    print(f"Found {users.count()} users")
    
    for user in users:
        print(f"\nProcessing user: {user.username} (ID: {user.id})")
        
        # Check if user already has progress data
        try:
            existing_progress = UserProgress.objects.get(user=user)
            print(f"  User {user.username} already has progress data")
            continue
        except UserProgress.DoesNotExist:
            pass
        
        # Get user's existing data
        courses = list(Course.objects.all())
        lessons = list(Lesson.objects.all())
        quizzes = list(UserQuizAttempt.objects.filter(user=user))
        
        # Get or create portfolio
        portfolio, created = Portfolio.objects.get_or_create(
            user=user,
            defaults={
                'total_value': Decimal('5000.00'),
                'cash_balance': Decimal('2000.00'),
                'total_invested': Decimal('3000.00'),
                'total_profit_loss': Decimal('500.00'),
                'last_updated': datetime.now()
            }
        )
        
        # Calculate progress metrics
        total_courses = len(courses)
        completed_courses = min(2, total_courses)  # Assume 2 courses completed
        
        total_lessons = len(lessons)
        completed_lessons = min(5, total_lessons)  # Assume 5 lessons completed
        
        total_quizzes = len(quizzes)
        completed_quizzes = min(3, total_quizzes)  # Assume 3 quizzes completed
        
        # Calculate percentages
        course_completion = (completed_courses / total_courses * 100) if total_courses > 0 else 0
        lesson_completion = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        quiz_completion = (completed_quizzes / total_quizzes * 100) if total_quizzes > 0 else 0
        
        # Calculate average quiz score
        if quizzes:
            avg_quiz_score = sum(q.score for q in quizzes) / len(quizzes)
        else:
            avg_quiz_score = 75.0  # Default score
        
        # Calculate experience points and level
        experience_points = (completed_courses * 100) + (completed_lessons * 20) + (completed_quizzes * 30)
        current_level = (experience_points // 200) + 1
        experience_to_next_level = 200 - (experience_points % 200)
        
        # Create progress data
        progress = UserProgress.objects.create(
            user=user,
            # Learning Progress
            total_courses=total_courses,
            completed_courses=completed_courses,
            total_lessons=total_lessons,
            completed_lessons=completed_lessons,
            total_quizzes=total_quizzes,
            completed_quizzes=completed_quizzes,
            average_quiz_score=avg_quiz_score,
            
            # Progress Percentages
            learning_completion_percentage=lesson_completion,
            course_completion_percentage=course_completion,
            quiz_completion_percentage=quiz_completion,
            overall_progress_percentage=(course_completion + lesson_completion + quiz_completion) / 3,
            
            # Experience and Level
            experience_points=experience_points,
            current_level=current_level,
            experience_to_next_level=experience_to_next_level,
            
            # Activity Tracking
            current_streak_days=7,
            longest_streak_days=15,
            total_activity_days=30,
            last_activity_date=datetime.now().date(),
            
            # Trading Performance
            portfolio_value=portfolio.total_value,
            portfolio_growth_percentage=12.5,
            total_trades=25,
            winning_trades=18,
            win_rate=72.0,
            total_profit_loss=portfolio.total_profit_loss,
            
            # Achievements
            total_badges=10,
            earned_badges=6,
            total_achievements=15,
            earned_achievements=8,
            
            # Timestamps
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        print(f"  Created progress data for {user.username}")
        print(f"    Level: {current_level}")
        print(f"    Experience: {experience_points} XP")
        print(f"    Course completion: {course_completion:.1f}%")
        print(f"    Portfolio value: ₹{portfolio.total_value}")
    
    print(f"\nProgress data creation completed!")

if __name__ == '__main__':
    create_user_progress()
