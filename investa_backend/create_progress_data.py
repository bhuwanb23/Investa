#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investa_backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models.progress import UserProgress
from api.models.trading import Achievement, UserAchievement
from decimal import Decimal
import random

def create_progress_data():
    """Create sample progress data for all users"""
    print("🔄 Creating progress sample data...")
    
    users = User.objects.all()
    if not users.exists():
        print("❌ No users found. Please create users first.")
        return
    
    # Get or create achievements
    achievements = get_or_create_achievements()
    
    for user in users:
        try:
            # Create or get user progress
            progress, created = UserProgress.objects.get_or_create(user=user)
            
            if created:
                print(f"✅ Created progress record for {user.username}")
            else:
                print(f"🔄 Updating progress record for {user.username}")
            
            # Set random progress data
            progress.total_courses = 4
            progress.completed_courses = random.randint(0, 2)
            progress.total_lessons = 72
            progress.completed_lessons = random.randint(0, 30)
            progress.total_quizzes = 144
            progress.completed_quizzes = random.randint(0, 50)
            progress.average_quiz_score = Decimal(random.uniform(60, 95))
            progress.total_learning_hours = random.randint(10, 100)
            
            # Trading progress
            progress.portfolio_value = Decimal(random.uniform(5000, 50000))
            progress.portfolio_growth_percentage = Decimal(random.uniform(-20, 30))
            progress.total_trades = random.randint(0, 50)
            progress.successful_trades = random.randint(0, progress.total_trades)
            progress.total_profit_loss = Decimal(random.uniform(-5000, 10000))
            progress.win_rate = (progress.successful_trades / progress.total_trades * 100) if progress.total_trades > 0 else Decimal('0.00')
            
            # Achievement progress
            progress.total_achievements = achievements.count()
            progress.earned_achievements = random.randint(0, min(3, achievements.count()))
            
            # Activity tracking
            progress.current_streak_days = random.randint(1, 30)
            progress.longest_streak_days = max(progress.current_streak_days, random.randint(20, 60))
            progress.total_activity_days = random.randint(30, 180)
            
            # Calculate experience and level
            progress.experience_points = (
                progress.completed_lessons * 10 +
                progress.completed_quizzes * 5 +
                progress.completed_courses * 50 +
                progress.earned_achievements * 25
            )
            
            # Set last activity date
            from django.utils import timezone
            progress.last_activity_date = timezone.now().date()
            
            progress.save()
            
            print(f"✅ Updated progress for {user.username}: Level {progress.current_level}, XP: {progress.experience_points}")
            
        except Exception as e:
            print(f"❌ Error creating progress for {user.username}: {e}")
    
    print("🎉 Progress sample data creation completed!")


def get_or_create_achievements():
    """Get or create sample achievements"""
    achievements = []
    
    achievement_data = [
        {
            'name': 'First Trade',
            'description': 'Complete your first trade',
            'achievement_type': 'FIRST_TRADE',
            'icon_name': 'trending-up',
            'color': '#10B981'
        },
        {
            'name': 'Quiz Master',
            'description': 'Score 100% on 5 quizzes',
            'achievement_type': 'TRADE_COUNT',
            'icon_name': 'school',
            'color': '#3B82F6'
        },
        {
            'name': 'Course Hero',
            'description': 'Complete 3 courses',
            'achievement_type': 'PORTFOLIO_GROWTH',
            'icon_name': 'trophy',
            'color': '#F59E0B'
        },
        {
            'name': 'Streak Master',
            'description': 'Maintain a 7-day learning streak',
            'achievement_type': 'WINNING_STREAK',
            'icon_name': 'flame',
            'color': '#EF4444'
        },
        {
            'name': 'Portfolio Builder',
            'description': 'Reach ₹10,000 portfolio value',
            'achievement_type': 'PROFIT_MILESTONE',
            'icon_name': 'pie-chart',
            'color': '#8B5CF6'
        }
    ]
    
    for data in achievement_data:
        achievement, created = Achievement.objects.get_or_create(
            name=data['name'],
            defaults=data
        )
        achievements.append(achievement)
        
        if created:
            print(f"✅ Created achievement: {achievement.name}")
    
    return achievements


def assign_random_achievements_to_users():
    """Randomly assign achievements to users"""
    print("🎖️ Assigning random achievements to users...")
    
    users = User.objects.all()
    achievements = Achievement.objects.all()
    
    if not users.exists() or not achievements.exists():
        print("❌ No users or achievements found.")
        return
    
    for user in users:
        # Randomly assign 1-3 achievements
        num_achievements = random.randint(1, 3)
        selected_achievements = random.sample(list(achievements), min(num_achievements, len(achievements)))
        
        for achievement in selected_achievements:
            UserAchievement.objects.get_or_create(
                user=user,
                achievement=achievement
            )
        
        print(f"✅ Assigned {len(selected_achievements)} achievements to {user.username}")


if __name__ == "__main__":
    create_progress_data()
    assign_random_achievements_to_users()
    print("🎉 All progress data created successfully!")
