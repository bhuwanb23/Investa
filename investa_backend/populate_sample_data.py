#!/usr/bin/env python
"""
Script to populate the Investa backend with comprehensive sample data
Run this script after setting up the Django environment
"""

import os
import sys
import django
from datetime import date, timedelta

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investa_backend.settings')
django.setup()

from django.contrib.auth.models import User
from django.db import transaction

# Import sample data modules
from api.sample.user_sample_data import create_languages, create_users_and_profiles
from api.sample.security_sample_data import create_security_settings, create_user_sessions
from api.sample.privacy_sample_data import create_privacy_settings
from api.sample.learning_sample_data import (
    create_courses, create_badges, create_learning_progress,
    create_user_lesson_progress, create_user_quiz_attempts
)
from api.sample.trading_sample_data import (
    create_stocks, create_portfolios, create_achievements,
    create_stock_prices, create_user_watchlists, create_portfolio_holdings,
    create_orders_and_trades, create_trading_performance, create_trading_sessions,
    create_market_data, create_technical_indicators
)
from api.sample.notifications_sample_data import create_notifications

def reset_data():
    """Wipe existing app data in a safe order"""
    print("\n🧹 Resetting existing data...")
    
    with transaction.atomic():
        # Delete dependent data first
        from api.models import (
            Answer, Question, Quiz, UserLessonProgress, Lesson, Course,
            UserBadge, Badge, UserAchievement, Achievement, Notification,
            PortfolioHolding, Portfolio, StockPrice, Stock, UserSession,
            SecuritySettings, PrivacySettings, LearningProgress, UserProfile,
            Language, UserQuizAttempt, UserQuizAnswer, UserWatchlist,
            Order, Trade, TradingPerformance, TradingSession, MarketData,
            TechnicalIndicator
        )
        
        # Quiz related
        UserQuizAnswer.objects.all().delete()
        UserQuizAttempt.objects.all().delete()
        Answer.objects.all().delete()
        Question.objects.all().delete()
        Quiz.objects.all().delete()
        
        # Learning progress
        UserLessonProgress.objects.all().delete()
        Lesson.objects.all().delete()
        Course.objects.all().delete()
        
        # Badges and achievements
        UserBadge.objects.all().delete()
        Badge.objects.all().delete()
        UserAchievement.objects.all().delete()
        Achievement.objects.all().delete()
        
        # Notifications
        Notification.objects.all().delete()
        
        # Trading related
        Trade.objects.all().delete()
        Order.objects.all().delete()
        PortfolioHolding.objects.all().delete()
        Portfolio.objects.all().delete()
        TechnicalIndicator.objects.all().delete()
        MarketData.objects.all().delete()
        TradingSession.objects.all().delete()
        TradingPerformance.objects.all().delete()
        UserWatchlist.objects.all().delete()
        StockPrice.objects.all().delete()
        Stock.objects.all().delete()
        
        # User sessions and settings
        UserSession.objects.all().delete()
        SecuritySettings.objects.all().delete()
        PrivacySettings.objects.all().delete()
        LearningProgress.objects.all().delete()
        UserProfile.objects.all().delete()
        
        # Keep languages to avoid breaking auth
        print("✅ Data reset completed.")

def create_sample_data():
    """Create comprehensive sample data for the Investa platform"""
    print("🚀 Creating comprehensive sample data for Investa...")
    
    # 1. Create languages
    print("\n📚 Creating languages...")
    languages = create_languages()
    
    # 2. Create users and profiles
    print("\n👥 Creating users and profiles...")
    users = create_users_and_profiles(languages)
    
    # 3. Create security settings
    print("\n🔒 Creating security settings...")
    security_settings = create_security_settings(users)
    
    # 4. Create user sessions
    print("\n💻 Creating user sessions...")
    user_sessions = create_user_sessions(users)
    
    # 5. Create privacy settings
    print("\n🔐 Creating privacy settings...")
    privacy_settings = create_privacy_settings(users)
    
    # 6. Create courses
    print("\n📖 Creating courses...")
    courses = create_courses(languages)
    
    # 7. Create badges
    print("\n🏆 Creating badges...")
    badges = create_badges()
    
    # 8. Create learning progress
    print("\n📈 Creating learning progress...")
    learning_progress = create_learning_progress(users)
    
    # 9. Create stocks
    print("\n📊 Creating stocks...")
    stocks = create_stocks()
    
    # 10. Create portfolios
    print("\n💼 Creating portfolios...")
    portfolios = create_portfolios(users)
    
    # 11. Create achievements
    print("\n🎯 Creating achievements...")
    achievements = create_achievements()
    
    # 12. Create notifications
    print("\n🔔 Creating notifications...")
    notifications = create_notifications(users)
    
    # 13. Create lessons and quizzes (using existing logic)
    print("\n📝 Creating lessons and quizzes...")
    lessons, quizzes = create_lessons_and_quizzes(courses)
    
    # 14. Create user lesson progress
    print("\n📚 Creating user lesson progress...")
    user_lesson_progress = create_user_lesson_progress(users, lessons)
    
    # 15. Create user quiz attempts
    print("\n🧪 Creating user quiz attempts...")
    quiz_attempts = create_user_quiz_attempts(users, quizzes)
    
    # 16. Create stock prices
    print("\n📈 Creating stock prices...")
    stock_prices = create_stock_prices(stocks)
    
    # 17. Create user watchlists
    print("\n👀 Creating user watchlists...")
    watchlist_items = create_user_watchlists(users, stocks)
    
    # 18. Create portfolio holdings
    print("\n💼 Creating portfolio holdings...")
    portfolio_holdings = create_portfolio_holdings(portfolios, stocks)
    
    # 19. Create orders and trades
    print("\n📋 Creating orders and trades...")
    orders, trades = create_orders_and_trades(users, stocks)
    
    # 20. Create trading performance
    print("\n📊 Creating trading performance...")
    trading_performance = create_trading_performance(users)
    
    # 21. Create trading sessions
    print("\n⏰ Creating trading sessions...")
    trading_sessions = create_trading_sessions(users)
    
    # 22. Create market data
    print("\n📊 Creating market data...")
    market_data = create_market_data(stocks)
    
    # 23. Create technical indicators
    print("\n📈 Creating technical indicators...")
    technical_indicators = create_technical_indicators(stocks)
    
    # 24. Create user badge assignments
    print("\n🏅 Assigning badges to users...")
    create_user_badge_assignments(users, badges)
    
    # 25. Create user achievement assignments
    print("\n🏆 Assigning achievements to users...")
    create_user_achievement_assignments(users, achievements)
    
    # 26. Update portfolio values based on holdings and market data
    print("\n💰 Updating portfolio values...")
    update_portfolio_values(portfolios, portfolio_holdings, market_data)
    
    # 27. Update trading performance based on actual trades
    print("\n📊 Updating trading performance...")
    update_trading_performance(trading_performance, trades, portfolios)
    
    # 28. Update learning progress based on lesson progress
    print("\n📈 Updating learning progress...")
    update_learning_progress(learning_progress, user_lesson_progress, quiz_attempts)
    
    print("\n🎉 Comprehensive sample data creation completed!")
    print(f"📊 Summary:")
    print(f"   • {len(languages)} languages")
    print(f"   • {len(users)} users with profiles")
    print(f"   • {len(security_settings)} security settings")
    print(f"   • {len(user_sessions)} user sessions")
    print(f"   • {len(privacy_settings)} privacy settings")
    print(f"   • {len(courses)} courses")
    print(f"   • {len(badges)} badges")
    print(f"   • {len(learning_progress)} learning progress records")
    print(f"   • {len(lessons)} lessons")
    print(f"   • {len(quizzes)} quizzes")
    print(f"   • {len(user_lesson_progress)} lesson progress records")
    print(f"   • {len(quiz_attempts)} quiz attempts")
    print(f"   • {len(stocks)} stocks")
    print(f"   • {len(stock_prices)} stock price records")
    print(f"   • {len(watchlist_items)} watchlist items")
    print(f"   • {len(portfolios)} portfolios")
    print(f"   • {len(portfolio_holdings)} portfolio holdings")
    print(f"   • {len(orders)} orders")
    print(f"   • {len(trades)} trades")
    print(f"   • {len(trading_performance)} trading performance records")
    print(f"   • {len(trading_sessions)} trading sessions")
    print(f"   • {len(market_data)} market data records")
    print(f"   • {len(technical_indicators)} technical indicators")
    print(f"   • {len(achievements)} achievements")
    print(f"   • {len(notifications)} notifications")
    
    print(f"\n🔗 You can now:")
    print(f"   1. Visit http://localhost:8000/api/database/ to see all data")
    print(f"   2. Test the login with: john@example.com / testpass123")
    print(f"   3. Explore the database structure and sample records")
    print(f"   4. Test all functionality with comprehensive sample data")

def create_lessons_and_quizzes(courses):
    """Create lessons and quizzes for courses"""
    from api.models import Lesson, Quiz, Question, Answer
    
    lessons_created = 0
    quizzes_created = 0
    lessons = []
    quizzes = []
    
    # Create lessons for each course
    for i, course in enumerate(courses):
        num_lessons = 5 + (i * 2)  # 5, 7, 9, 11 lessons per course
        
        for j in range(num_lessons):
            lesson_title = f"Lesson {j+1}: {course.title.split()[0]} Fundamentals"
            lesson_content = f"This is lesson {j+1} of the {course.title} course. It covers fundamental concepts and provides practical examples."
            
            lesson, created = Lesson.objects.get_or_create(
                course=course,
                title=lesson_title,
                defaults={
                    'content': lesson_content,
                    'video_url': f'https://example.com/videos/{course.title.lower().replace(" ", "-")}-lesson-{j+1}.mp4',
                    'order': j + 1,
                    'estimated_duration': 20 + (j * 5),
                    'is_active': True
                }
            )
            
            if created:
                lessons_created += 1
                print(f"   ✅ Created lesson: {lesson.title}")
            
            lessons.append(lesson)
            
            # Create 2 quizzes per lesson
            for quiz_num in range(1, 3):
                quiz_title = f'Quiz {quiz_num}: {lesson.title}'
                quiz_description = f'Assessment for {lesson.title}'
                
                quiz, created = Quiz.objects.get_or_create(
                    lesson=lesson,
                    title=quiz_title,
                    defaults={
                        'description': quiz_description,
                        'time_limit': 15,
                        'passing_score': 70,
                        'is_active': True
                    }
                )
                
                if created:
                    quizzes_created += 1
                    print(f"      ✅ Created quiz: {quiz.title}")
                
                quizzes.append(quiz)
                
                # Create questions for this quiz
                questions_data = [
                    {
                        'question_text': f'What is the main topic of {lesson.title}?',
                        'question_type': 'multiple_choice',
                        'points': 2,
                        'order': 1,
                        'explanation': 'This question tests your understanding of the lesson content.',
                        'answers': [
                            {'answer_text': 'The correct answer', 'is_correct': True, 'order': 1},
                            {'answer_text': 'An incorrect option', 'is_correct': False, 'order': 2},
                            {'answer_text': 'Another wrong choice', 'is_correct': False, 'order': 3},
                            {'answer_text': 'Not the right answer', 'is_correct': False, 'order': 4},
                        ]
                    },
                    {
                        'question_text': f'True or False: {lesson.title} is important for learning.',
                        'question_type': 'true_false',
                        'points': 1,
                        'order': 2,
                        'explanation': 'This lesson provides fundamental knowledge.',
                        'answers': [
                            {'answer_text': 'True', 'is_correct': True, 'order': 1},
                            {'answer_text': 'False', 'is_correct': False, 'order': 2},
                        ]
                    }
                ]
                
                for q_data in questions_data:
                    answers_data = q_data.pop('answers')
                    question, q_created = Question.objects.get_or_create(
                        quiz=quiz,
                        question_text=q_data['question_text'],
                        defaults=q_data
                    )
                    
                    if q_created:
                        # Create answers for this question
                        for a_data in answers_data:
                            Answer.objects.get_or_create(
                                question=question,
                                answer_text=a_data['answer_text'],
                                defaults=a_data
                            )
    
    print(f"   📊 Created {lessons_created} lessons and {quizzes_created} quizzes")
    return lessons, quizzes

def create_user_badge_assignments(users, badges):
    """Create user badge assignments"""
    from api.models import UserBadge
    
    user_badges_created = 0
    for i, user in enumerate(users):
        # Give each user 2-4 badges
        num_badges = min(2 + (i % 3), len(badges))
        user_badges_list = badges[:num_badges]
        
        for badge in user_badges_list:
            user_badge, created = UserBadge.objects.get_or_create(
                user=user,
                badge=badge
            )
            
            if created:
                user_badges_created += 1
                print(f"   ✅ Awarded badge {badge.name} to {user.username}")
    
    print(f"   🏅 Awarded {user_badges_created} badges to users")

def create_user_achievement_assignments(users, achievements):
    """Create user achievement assignments"""
    from api.models import UserAchievement
    
    user_achievements_created = 0
    for i, user in enumerate(users):
        # Give each user 1-3 achievements
        num_achievements = min(1 + (i % 3), len(achievements))
        user_achievements_list = achievements[:num_achievements]
        
        for achievement in user_achievements_list:
            user_achievement, created = UserAchievement.objects.get_or_create(
                user=user,
                achievement=achievement
            )
            
            if created:
                user_achievements_created += 1
                print(f"   ✅ Awarded achievement {achievement.name} to {user.username}")
    
    print(f"   🏆 Awarded {user_achievements_created} achievements to users")

def update_portfolio_values(portfolios, portfolio_holdings, market_data):
    """Update portfolio values based on holdings and current market data"""
    from decimal import Decimal
    
    for portfolio in portfolios:
        total_value = Decimal('0.00')
        total_invested = Decimal('0.00')
        total_profit_loss = Decimal('0.00')
        
        # Get holdings for this portfolio
        holdings = portfolio.holdings.all()
        
        for holding in holdings:
            # Get current market price from market data
            current_price = holding.current_price  # Default to existing price
            for market_data_obj in market_data:
                if market_data_obj.stock == holding.stock:
                    current_price = market_data_obj.current_price
                    break
            
            # Update holding with current price
            holding.current_price = current_price
            holding.market_value = current_price * holding.quantity
            holding.unrealized_pnl = holding.market_value - holding.total_invested
            holding.save()
            
            # Accumulate portfolio totals
            total_value += holding.market_value
            total_invested += holding.total_invested
            total_profit_loss += holding.unrealized_pnl
        
        # Update portfolio with cash balance
        total_value += portfolio.cash_balance
        
        # Update portfolio
        portfolio.total_value = total_value
        portfolio.total_invested = total_invested
        portfolio.total_profit_loss = total_profit_loss
        portfolio.save()
        
        print(f"   💰 Updated portfolio for {portfolio.user.username}: ₹{total_value}")

def update_trading_performance(trading_performance, trades, portfolios):
    """Update trading performance based on actual trades"""
    from decimal import Decimal
    
    for performance in trading_performance:
        user = performance.user
        
        # Get user's trades
        user_trades = [t for t in trades if t.user == user]
        
        if user_trades:
            total_trades = len(user_trades)
            successful_trades = len([t for t in user_trades if t.side == 'BUY' or t.side == 'SELL'])
            total_profit_loss = sum(t.net_amount for t in user_trades)
            total_commission = sum(t.commission for t in user_trades)
            
            # Calculate best and worst trades
            trade_amounts = [t.net_amount for t in user_trades]
            best_trade = max(trade_amounts) if trade_amounts else Decimal('0.00')
            worst_trade = min(trade_amounts) if trade_amounts else Decimal('0.00')
            
            # Get portfolio value
            portfolio_value = Decimal('15000.00')  # Default
            for portfolio in portfolios:
                if portfolio.user == user:
                    portfolio_value = portfolio.total_value
                    break
            
            # Update performance
            performance.total_trades = total_trades
            performance.successful_trades = successful_trades
            performance.total_profit_loss = total_profit_loss
            performance.total_commission_paid = total_commission
            performance.best_trade_profit = best_trade
            performance.worst_trade_loss = worst_trade
            performance.portfolio_value = portfolio_value
            performance.average_trade_size = total_profit_loss / total_trades if total_trades > 0 else Decimal('0.00')
            performance.save()
            
            print(f"   📊 Updated trading performance for {user.username}")

def update_learning_progress(learning_progress, user_lesson_progress, quiz_attempts):
    """Update learning progress based on lesson progress and quiz attempts"""
    from decimal import Decimal
    
    for progress in learning_progress:
        user = progress.user
        
        # Count completed lessons
        completed_lessons = len([lp for lp in user_lesson_progress if lp.user == user and lp.status == 'completed'])
        
        # Count quiz attempts and scores
        user_quiz_attempts = [qa for qa in quiz_attempts if qa.user == user]
        quizzes_taken = len(user_quiz_attempts)
        quizzes_passed = len([qa for qa in user_quiz_attempts if qa.passed])
        
        # Calculate average quiz score
        if user_quiz_attempts:
            average_score = sum(qa.score for qa in user_quiz_attempts) / len(user_quiz_attempts)
        else:
            average_score = Decimal('0.00')
        
        # Update progress
        progress.completed_modules = completed_lessons
        progress.quizzes_taken = quizzes_taken
        progress.quizzes_passed = quizzes_passed
        progress.average_quiz_score = average_score
        progress.total_hours_learned = completed_lessons * 2  # Estimate 2 hours per lesson
        progress.save()
        
        print(f"   📚 Updated learning progress for {user.username}")

if __name__ == '__main__':
    reset_data()
    create_sample_data()
