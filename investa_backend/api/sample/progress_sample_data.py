from django.contrib.auth.models import User
from django.db import transaction
from ..models.progress import UserProgress
from ..models.learning import Course, Lesson, UserLessonProgress, Quiz, UserQuizAttempt
from ..models.trading import Portfolio, Order, UserAchievement, Achievement
from ..models.user import UserProfile
from decimal import Decimal
import random
from django.db.models import Avg


def create_progress_sample_data():
    """Create sample progress data for all users"""
    print("🔄 Creating progress sample data...")
    
    users = User.objects.all()
    if not users.exists():
        print("❌ No users found. Please create users first.")
        return
    
    # Get or create achievements
    achievements = get_or_create_achievements()
    
    # Get existing data
    courses = list(Course.objects.all())
    lessons = list(Lesson.objects.all())
    quizzes = list(Quiz.objects.all())
    
    for user in users:
        try:
            with transaction.atomic():
                # Create or get user progress
                progress, created = UserProgress.objects.get_or_create(user=user)
                
                if created:
                    print(f"✅ Created progress record for {user.username}")
                else:
                    print(f"🔄 Updating progress record for {user.username}")
                
                # Calculate learning progress
                total_courses = len(courses)
                completed_courses = calculate_completed_courses(user, courses)
                total_lessons = len(lessons)
                completed_lessons = UserLessonProgress.objects.filter(
                    user=user, 
                    status='completed'
                ).count()
                
                # Calculate quiz progress
                total_quizzes = len(quizzes)
                quiz_attempts = UserQuizAttempt.objects.filter(user=user)
                completed_quizzes = quiz_attempts.count()
                average_quiz_score = quiz_attempts.aggregate(
                    avg_score=Avg('score')
                )['avg_score'] or Decimal('0.00')
                
                # Calculate trading progress
                try:
                    portfolio = Portfolio.objects.get(user=user)
                    portfolio_value = portfolio.total_value
                    portfolio_growth = Decimal('0.00')  # Default growth percentage
                except Portfolio.DoesNotExist:
                    portfolio_value = Decimal('0.00')
                    portfolio_growth = Decimal('0.00')
                
                orders = Order.objects.filter(user=user)
                total_trades = orders.count()
                successful_trades = random.randint(0, total_trades)
                win_rate = (successful_trades / total_trades * 100) if total_trades > 0 else Decimal('0.00')
                
                # Calculate achievement progress
                total_achievements = achievements.count()
                earned_achievements = UserAchievement.objects.filter(user=user).count()
                
                # Calculate experience and level
                experience_points = (
                    completed_lessons * 10 +
                    completed_quizzes * 5 +
                    completed_courses * 50 +
                    earned_achievements * 25
                )
                
                # Calculate activity tracking
                current_streak = random.randint(1, 30)
                longest_streak = max(current_streak, random.randint(20, 60))
                total_activity_days = random.randint(30, 180)
                
                # Update progress fields
                progress.total_courses = total_courses
                progress.completed_courses = completed_courses
                progress.total_lessons = total_lessons
                progress.completed_lessons = completed_lessons
                progress.total_quizzes = total_quizzes
                progress.completed_quizzes = completed_quizzes
                progress.average_quiz_score = average_quiz_score
                progress.portfolio_value = portfolio_value
                progress.portfolio_growth_percentage = portfolio_growth
                progress.total_trades = total_trades
                progress.successful_trades = successful_trades
                progress.win_rate = win_rate
                progress.total_achievements = total_achievements
                progress.earned_achievements = earned_achievements
                progress.current_streak_days = current_streak
                progress.longest_streak_days = longest_streak
                progress.total_activity_days = total_activity_days
                progress.experience_points = experience_points
                
                # Set last activity date
                from django.utils import timezone
                progress.last_activity_date = timezone.now().date()
                
                progress.save()
                
                print(f"✅ Updated progress for {user.username}: Level {progress.current_level}, XP: {progress.experience_points}")
                
        except Exception as e:
            print(f"❌ Error creating progress for {user.username}: {e}")
    
    print("🎉 Progress sample data creation completed!")


def calculate_completed_courses(user, courses):
    """Calculate how many courses the user has completed"""
    completed_courses = 0
    
    for course in courses:
        total_lessons = course.lessons.filter(is_active=True).count()
        if total_lessons == 0:
            continue
            
        completed_lessons = UserLessonProgress.objects.filter(
            user=user,
            lesson__course=course,
            status='completed'
        ).count()
        
        if completed_lessons >= total_lessons:
            completed_courses += 1
    
    return completed_courses


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


def reset_progress_data():
    """Reset all progress data"""
    print("🗑️ Resetting progress data...")
    
    UserProgress.objects.all().delete()
    UserAchievement.objects.all().delete()
    
    print("✅ Progress data reset completed!")


if __name__ == "__main__":
    # This can be run directly or imported
    create_progress_sample_data()
    assign_random_achievements_to_users()
