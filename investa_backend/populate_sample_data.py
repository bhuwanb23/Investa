#!/usr/bin/env python
"""
Script to populate the Investa backend with sample data
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
from api.models import (
    Language, UserProfile, Course, Lesson, UserLessonProgress, 
    LearningProgress, Badge, UserBadge
)

def create_sample_data():
    """Create sample data for the Investa platform"""
    print("🚀 Creating sample data for Investa...")
    
    # Create languages
    languages = []
    language_data = [
        {'code': 'en', 'name': 'English', 'native_name': 'English'},
        {'code': 'hi', 'name': 'Hindi', 'native_name': 'हिन्दी'},
        {'code': 'ta', 'name': 'Tamil', 'native_name': 'தமிழ்'},
        {'code': 'te', 'name': 'Telugu', 'native_name': 'తెలుగు'},
        {'code': 'bn', 'name': 'Bengali', 'native_name': 'বাংলা'},
    ]
    
    for lang_data in language_data:
        lang, created = Language.objects.get_or_create(
            code=lang_data['code'],
            defaults=lang_data
        )
        languages.append(lang)
        if created:
            print(f"✅ Created language: {lang.name}")
    
    # Create sample users
    users = []
    user_data = [
        {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
        {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
        {'username': 'mike_wilson', 'email': 'mike@example.com', 'first_name': 'Mike', 'last_name': 'Wilson'},
    ]
    
    for user_info in user_data:
        user, created = User.objects.get_or_create(
            username=user_info['username'],
            defaults={
                'email': user_info['email'],
                'first_name': user_info['first_name'],
                'last_name': user_info['last_name'],
                'password': 'testpass123'
            }
        )
        if created:
            user.set_password('testpass123')
            user.save()
            print(f"✅ Created user: {user.username}")
        
        # Create user profile
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'preferred_language': languages[0],  # English
                'risk_profile': 'moderate',
                'investment_experience': 'beginner',
                'phone_number': '+1234567890',
                'date_of_birth': date(1990, 1, 1)
            }
        )
        users.append(user)
    
    # Create sample courses
    courses = []
    course_data = [
        {
            'title': 'Stock Market Basics',
            'description': 'Learn the fundamentals of stock market investing, including how stocks work, market analysis, and basic trading strategies.',
            'language': languages[0],  # English
            'difficulty_level': 'beginner',
            'estimated_duration': 120
        },
        {
            'title': 'Portfolio Diversification',
            'description': 'Master the art of building a balanced portfolio that spreads risk across different asset classes and sectors.',
            'language': languages[0],  # English
            'difficulty_level': 'intermediate',
            'estimated_duration': 180
        },
        {
            'title': 'Risk Management',
            'description': 'Understand how to identify, assess, and manage investment risks to protect your capital.',
            'language': languages[0],  # English
            'difficulty_level': 'advanced',
            'estimated_duration': 240
        },
        {
            'title': 'Mutual Funds 101',
            'description': 'Learn about mutual funds, their types, benefits, and how to choose the right ones for your investment goals.',
            'language': languages[1],  # Hindi
            'difficulty_level': 'beginner',
            'estimated_duration': 90
        }
    ]
    
    for course_info in course_data:
        course, created = Course.objects.get_or_create(
            title=course_info['title'],
            defaults=course_info
        )
        courses.append(course)
        if created:
            print(f"✅ Created course: {course.title}")
    
    # Create sample lessons
    lessons = []
    lesson_data = [
        {
            'course': courses[0],  # Stock Market Basics
            'title': 'What are Stocks?',
            'content': 'Stocks represent ownership in a company. When you buy a stock, you become a shareholder and own a piece of that company.',
            'order': 1,
            'estimated_duration': 15
        },
        {
            'course': courses[0],
            'title': 'How Stock Markets Work',
            'content': 'Stock markets are places where buyers and sellers meet to trade stocks. They provide liquidity and price discovery.',
            'order': 2,
            'estimated_duration': 20
        },
        {
            'course': courses[1],  # Portfolio Diversification
            'title': 'Asset Allocation',
            'content': 'Asset allocation is the process of dividing your investments among different asset classes like stocks, bonds, and cash.',
            'order': 1,
            'estimated_duration': 25
        }
    ]
    
    for lesson_info in lesson_data:
        lesson, created = Lesson.objects.get_or_create(
            course=lesson_info['course'],
            title=lesson_info['title'],
            defaults=lesson_info
        )
        lessons.append(lesson)
        if created:
            print(f"✅ Created lesson: {lesson.title}")
    
    # Create sample quizzes
    quizzes = []
    quiz_data = [
        {
            'lesson': lessons[0],  # What are Stocks?
            'title': 'Stock Basics Quiz',
            'description': 'Test your understanding of stock fundamentals',
            'passing_score': 70,
            'time_limit': 10
        }
    ]
    
    for quiz_info in quiz_data:
        quiz, created = Quiz.objects.get_or_create(
            lesson=quiz_info['lesson'],
            title=quiz_info['title'],
            defaults=quiz_info
        )
        quizzes.append(quiz)
        if created:
            print(f"✅ Created quiz: {quiz.title}")
    
    # Create sample questions and answers
    if quizzes:
        quiz = quizzes[0]
        question_data = [
            {
                'question_text': 'What does owning a stock mean?',
                'question_type': 'multiple_choice',
                'points': 1,
                'order': 1,
                'answers': [
                    {'text': 'You own a piece of the company', 'is_correct': True},
                    {'text': 'You are an employee of the company', 'is_correct': False},
                    {'text': 'You have a loan from the company', 'is_correct': False},
                ]
            },
            {
                'question_text': 'Which of the following is NOT a benefit of stock ownership?',
                'question_type': 'multiple_choice',
                'points': 1,
                'order': 2,
                'answers': [
                    {'text': 'Potential for capital gains', 'is_correct': False},
                    {'text': 'Dividend income', 'is_correct': False},
                    {'text': 'Guaranteed returns', 'is_correct': True},
                ]
            }
        ]
        
        for q_data in question_data:
            answers = q_data.pop('answers')
            question, created = Question.objects.get_or_create(
                quiz=quiz,
                question_text=q_data['question_text'],
                defaults=q_data
            )
            if created:
                print(f"✅ Created question: {question.question_text[:50]}...")
                
                # Create answers
                for a_data in answers:
                    Answer.objects.get_or_create(
                        question=question,
                        answer_text=a_data['text'],
                        defaults={'is_correct': a_data['is_correct'], 'order': len(answers)}
                    )
    
    # Create sample user progress
    for user in users[:2]:  # First 2 users
        for course in courses[:2]:  # First 2 courses
            for lesson in course.lessons.all():
                progress, created = UserProgress.objects.get_or_create(
                    user=user,
                    course=course,
                    lesson=lesson,
                    defaults={
                        'completed': lesson.order == 1,  # First lesson completed
                        'time_spent': 300 if lesson.order == 1 else 0
                    }
                )
    
    # Create sample simulated trades
    trade_data = [
        {'symbol': 'AAPL', 'trade_type': 'buy', 'quantity': 10, 'price': 150.00, 'total_amount': 1500.00},
        {'symbol': 'GOOGL', 'trade_type': 'buy', 'quantity': 5, 'price': 2800.00, 'total_amount': 14000.00},
        {'symbol': 'AAPL', 'trade_type': 'sell', 'quantity': 5, 'price': 155.00, 'total_amount': 775.00},
    ]
    
    for trade_info in trade_data:
        for user in users[:2]:  # First 2 users
            SimulatedTrade.objects.get_or_create(
                user=user,
                symbol=trade_info['symbol'],
                trade_type=trade_info['trade_type'],
                quantity=trade_info['quantity'],
                price=trade_info['price'],
                total_amount=trade_info['total_amount'],
                defaults={'notes': f'Sample {trade_info["trade_type"]} trade'}
            )
    
    # Create sample notifications
    notification_data = [
        {'title': 'Welcome to Investa!', 'message': 'Start your investment learning journey today.', 'notification_type': 'general'},
        {'title': 'Course Available', 'message': 'New course "Stock Market Basics" is now available.', 'notification_type': 'course_update'},
        {'title': 'Quiz Reminder', 'message': 'Don\'t forget to complete the quiz for "What are Stocks?"', 'notification_type': 'quiz_reminder'},
    ]
    
    for notif_data in notification_data:
        for user in users:
            Notification.objects.get_or_create(
                user=user,
                title=notif_data['title'],
                message=notif_data['message'],
                notification_type=notif_data['notification_type']
            )
    
    print(f"\n🎉 Sample data creation completed!")
    print(f"📊 Created:")
    print(f"   - {len(languages)} languages")
    print(f"   - {len(users)} users with profiles")
    print(f"   - {len(courses)} courses")
    print(f"   - {len(lessons)} lessons")
    print(f"   - {len(quizzes)} quizzes")
    print(f"   - Sample progress, trades, and notifications")
    print(f"\n🔗 You can now:")
    print(f"   1. Visit http://localhost:8000/api/database/ to see all data")
    print(f"   2. Test the login with: john@example.com / testpass123")
    print(f"   3. Explore the database structure and sample records")

if __name__ == '__main__':
    create_sample_data()
