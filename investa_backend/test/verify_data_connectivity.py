#!/usr/bin/env python
"""
Script to verify data connectivity and relationships in the Investa backend
Run this after populate_sample_data.py to ensure all data is properly connected
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investa_backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import *

def verify_user_relationships():
    """Verify user-related model connections"""
    print("\n🔍 Verifying User Relationships...")
    
    users = User.objects.all()
    print(f"   Found {users.count()} users")
    
    for user in users:
        # Check UserProfile
        try:
            profile = user.profile
            print(f"   ✅ {user.username} has profile (risk: {profile.risk_profile})")
        except UserProfile.DoesNotExist:
            print(f"   ❌ {user.username} missing profile")
        
        # Check SecuritySettings
        try:
            security = user.security_settings
            print(f"   ✅ {user.username} has security settings (2FA: {security.two_factor_enabled})")
        except SecuritySettings.DoesNotExist:
            print(f"   ❌ {user.username} missing security settings")
        
        # Check PrivacySettings
        try:
            privacy = user.privacy_settings
            print(f"   ✅ {user.username} has privacy settings")
        except PrivacySettings.DoesNotExist:
            print(f"   ❌ {user.username} missing privacy settings")
        
        # Check LearningProgress
        try:
            learning = user.learning_progress
            print(f"   ✅ {user.username} has learning progress ({learning.completed_modules} modules)")
        except LearningProgress.DoesNotExist:
            print(f"   ❌ {user.username} missing learning progress")
        
        # Check Portfolio
        try:
            portfolio = user.portfolio
            print(f"   ✅ {user.username} has portfolio (₹{portfolio.total_value})")
        except Portfolio.DoesNotExist:
            print(f"   ❌ {user.username} missing portfolio")
        
        # Check TradingPerformance
        try:
            trading = user.trading_performance
            print(f"   ✅ {user.username} has trading performance ({trading.total_trades} trades)")
        except TradingPerformance.DoesNotExist:
            print(f"   ❌ {user.username} missing trading performance")

def verify_learning_relationships():
    """Verify learning-related model connections"""
    print("\n📚 Verifying Learning Relationships...")
    
    courses = Course.objects.all()
    print(f"   Found {courses.count()} courses")
    
    for course in courses:
        lessons = course.lessons.all()
        print(f"   📖 {course.title} has {lessons.count()} lessons")
        
        for lesson in lessons:
            quizzes = lesson.quizzes.all()
            print(f"      📝 {lesson.title} has {quizzes.count()} quizzes")
            
            for quiz in quizzes:
                questions = quiz.questions.all()
                print(f"         ❓ {quiz.title} has {questions.count()} questions")
                
                for question in questions:
                    answers = question.answers.all()
                    correct_answers = answers.filter(is_correct=True).count()
                    print(f"            ✅ {question.question_text[:30]}... has {answers.count()} answers ({correct_answers} correct)")
    
    # Check user progress
    user_progress = UserLessonProgress.objects.all()
    print(f"   📊 Found {user_progress.count()} user lesson progress records")
    
    quiz_attempts = UserQuizAttempt.objects.all()
    print(f"   🧪 Found {quiz_attempts.count()} quiz attempts")
    
    user_answers = UserQuizAnswer.objects.all()
    print(f"   ✏️ Found {user_answers.count()} user quiz answers")

def verify_trading_relationships():
    """Verify trading-related model connections"""
    print("\n📊 Verifying Trading Relationships...")
    
    stocks = Stock.objects.all()
    print(f"   Found {stocks.count()} stocks")
    
    for stock in stocks:
        # Check stock prices
        prices = stock.prices.all()
        print(f"   📈 {stock.symbol} has {prices.count()} price records")
        
        # Check market data
        try:
            market_data = stock.market_data
            print(f"   💹 {stock.symbol} has market data (₹{market_data.current_price})")
        except MarketData.DoesNotExist:
            print(f"   ❌ {stock.symbol} missing market data")
        
        # Check technical indicators
        indicators = stock.technical_indicators.all()
        print(f"   📊 {stock.symbol} has {indicators.count()} technical indicators")
    
    # Check portfolios and holdings
    portfolios = Portfolio.objects.all()
    print(f"   💼 Found {portfolios.count()} portfolios")
    
    for portfolio in portfolios:
        holdings = portfolio.holdings.all()
        print(f"   📦 {portfolio.user.username}'s portfolio has {holdings.count()} holdings")
        
        for holding in holdings:
            print(f"      💰 {holding.stock.symbol}: {holding.quantity} shares @ ₹{holding.average_price}")
    
    # Check orders and trades
    orders = Order.objects.all()
    print(f"   📋 Found {orders.count()} orders")
    
    trades = Trade.objects.all()
    print(f"   💱 Found {trades.count()} trades")
    
    for order in orders:
        order_trades = order.trades.all()
        print(f"   📊 Order {order.id} has {order_trades.count()} trades")

def verify_watchlist_relationships():
    """Verify watchlist relationships"""
    print("\n👀 Verifying Watchlist Relationships...")
    
    watchlists = UserWatchlist.objects.all()
    print(f"   Found {watchlists.count()} watchlist items")
    
    for watchlist in watchlists:
        print(f"   👁️ {watchlist.user.username} watching {watchlist.stock.symbol}")

def verify_badge_achievement_relationships():
    """Verify badge and achievement relationships"""
    print("\n🏆 Verifying Badge & Achievement Relationships...")
    
    user_badges = UserBadge.objects.all()
    print(f"   Found {user_badges.count()} user badge assignments")
    
    for user_badge in user_badges:
        print(f"   🏅 {user_badge.user.username} earned {user_badge.badge.name}")
    
    user_achievements = UserAchievement.objects.all()
    print(f"   Found {user_achievements.count()} user achievement assignments")
    
    for user_achievement in user_achievements:
        print(f"   🏆 {user_achievement.user.username} earned {user_achievement.achievement.name}")

def verify_notification_relationships():
    """Verify notification relationships"""
    print("\n🔔 Verifying Notification Relationships...")
    
    notifications = Notification.objects.all()
    print(f"   Found {notifications.count()} notifications")
    
    for notification in notifications:
        print(f"   📢 {notification.user.username}: {notification.title} ({notification.notification_type})")

def verify_data_consistency():
    """Verify data consistency across related models"""
    print("\n🔍 Verifying Data Consistency...")
    
    # Check portfolio values match holdings
    portfolios = Portfolio.objects.all()
    for portfolio in portfolios:
        holdings = portfolio.holdings.all()
        calculated_value = sum(holding.market_value for holding in holdings) + portfolio.cash_balance
        calculated_invested = sum(holding.total_invested for holding in holdings)
        calculated_pnl = sum(holding.unrealized_pnl for holding in holdings)
        
        if abs(portfolio.total_value - calculated_value) > 0.01:
            print(f"   ⚠️ Portfolio {portfolio.user.username} value mismatch: stored={portfolio.total_value}, calculated={calculated_value}")
        else:
            print(f"   ✅ Portfolio {portfolio.user.username} values consistent")
    
    # Check learning progress matches lesson progress
    learning_progress = LearningProgress.objects.all()
    for progress in learning_progress:
        completed_lessons = UserLessonProgress.objects.filter(user=progress.user, status='completed').count()
        if progress.completed_modules != completed_lessons:
            print(f"   ⚠️ Learning progress mismatch for {progress.user.username}: stored={progress.completed_modules}, actual={completed_lessons}")
        else:
            print(f"   ✅ Learning progress consistent for {progress.user.username}")

def main():
    """Run all verification checks"""
    print("🔍 Starting Data Connectivity Verification...")
    
    verify_user_relationships()
    verify_learning_relationships()
    verify_trading_relationships()
    verify_watchlist_relationships()
    verify_badge_achievement_relationships()
    verify_notification_relationships()
    verify_data_consistency()
    
    print("\n✅ Data Connectivity Verification Complete!")
    print("📊 All relationships should be properly established.")
    print("🔗 You can now test the API endpoints with confidence.")

if __name__ == '__main__':
    main()
