#!/usr/bin/env python
"""
Sample data for Learning models (Course, Lesson, Quiz, Question, Answer, Badge, etc.)
"""

from datetime import date, timedelta
from django.contrib.auth.models import User
from api.models import Language

# Course sample data
COURSE_DATA = [
    {
        'title': 'Stock Market Fundamentals',
        'description': 'Master the basics of stock market investing, including how stocks work, market analysis, and fundamental trading strategies.',
        'difficulty_level': 'beginner',
        'estimated_duration': 180,
        'thumbnail': 'https://example.com/thumbnails/stock-market-fundamentals.jpg',
        'is_active': True
    },
    {
        'title': 'Portfolio Diversification Mastery',
        'description': 'Learn advanced portfolio management techniques, asset allocation strategies, and how to build a balanced investment portfolio.',
        'difficulty_level': 'intermediate',
        'estimated_duration': 240,
        'thumbnail': 'https://example.com/thumbnails/portfolio-diversification.jpg',
        'is_active': True
    },
    {
        'title': 'Advanced Risk Management',
        'description': 'Master sophisticated risk management techniques, including hedging strategies, position sizing, and advanced portfolio protection.',
        'difficulty_level': 'advanced',
        'estimated_duration': 300,
        'thumbnail': 'https://example.com/thumbnails/risk-management.jpg',
        'is_active': True
    },
    {
        'title': 'Mutual Funds & ETFs Deep Dive',
        'description': 'Comprehensive guide to mutual funds, ETFs, and index investing. Learn how to select the right funds and build a passive strategy.',
        'difficulty_level': 'intermediate',
        'estimated_duration': 200,
        'thumbnail': 'https://example.com/thumbnails/mutual-funds-etfs.jpg',
        'is_active': True
    }
]

# Badge sample data
BADGE_DATA = [
    {
        'name': 'First Steps',
        'description': 'Complete your first lesson',
        'badge_type': 'learning',
        'icon_name': 'first-steps',
        'color': '#10B981',
        'criteria': {'lessons_completed': 1}
    },
    {
        'name': 'Course Champion',
        'description': 'Complete an entire course',
        'badge_type': 'learning',
        'icon_name': 'course-champion',
        'color': '#3B82F6',
        'criteria': {'courses_completed': 1}
    },
    {
        'name': 'Quiz Master',
        'description': 'Score 100% on any quiz',
        'badge_type': 'learning',
        'icon_name': 'quiz-master',
        'color': '#F59E0B',
        'criteria': {'perfect_quiz_score': 1}
    },
    {
        'name': 'Knowledge Seeker',
        'description': 'Complete 50 lessons',
        'badge_type': 'learning',
        'icon_name': 'knowledge-seeker',
        'color': '#8B5CF6',
        'criteria': {'lessons_completed': 50}
    }
]

def create_courses(languages):
    """Create course objects"""
    from api.models import Course
    
    courses = []
    for course_info in COURSE_DATA:
        course_info['language'] = languages[0]  # Default to English
        
        course, created = Course.objects.get_or_create(
            title=course_info['title'],
            defaults=course_info
        )
        courses.append(course)
        if created:
            print(f"✅ Created course: {course.title}")
    
    return courses

def create_badges():
    """Create badge objects"""
    from api.models import Badge
    
    badges = []
    for badge_data in BADGE_DATA:
        badge, created = Badge.objects.get_or_create(
            name=badge_data['name'],
            defaults=badge_data
        )
        badges.append(badge)
        if created:
            print(f"✅ Created badge: {badge.name}")
    
    return badges

def create_learning_progress(users):
    """Create learning progress for users"""
    from api.models import LearningProgress
    
    progress_records = []
    for user in users:
        progress, created = LearningProgress.objects.get_or_create(
            user=user,
            defaults={
                'total_modules': 8,
                'completed_modules': 2,
                'total_hours_learned': 6,
                'certificates_earned': 1,
                'average_quiz_score': 85.50,
                'quizzes_taken': 8,
                'quizzes_passed': 7,
                'badges_earned': 3
            }
        )
        
        if created:
            print(f"✅ Created learning progress for: {user.username}")
        
        progress_records.append(progress)
    
    return progress_records

def create_user_lesson_progress(users, lessons):
    """Create user lesson progress records"""
    from api.models import UserLessonProgress
    from datetime import datetime, timedelta
    
    progress_records = []
    for i, user in enumerate(users):
        # Give each user progress on 2-4 lessons
        num_lessons = min(2 + (i % 3), len(lessons))
        user_lessons = lessons[:num_lessons]
        
        for j, lesson in enumerate(user_lessons):
            # Vary the progress status
            if j == 0:
                status = 'completed'
                progress = 100
                completed_at = datetime.now() - timedelta(days=j+1)
            elif j == 1:
                status = 'progress'
                progress = 60 + (i * 10) % 40
                completed_at = None
            else:
                status = 'available'
                progress = 0
                completed_at = None
            
            progress_record, created = UserLessonProgress.objects.get_or_create(
                user=user,
                lesson=lesson,
                defaults={
                    'status': status,
                    'progress': progress,
                    'started_at': datetime.now() - timedelta(days=j+2),
                    'completed_at': completed_at
                }
            )
            
            if created:
                print(f"   ✅ Created lesson progress for {user.username}: {lesson.title} ({status})")
            
            progress_records.append(progress_record)
    
    print(f"   📊 Created {len(progress_records)} lesson progress records")
    return progress_records

def create_user_quiz_attempts(users, quizzes):
    """Create user quiz attempts"""
    from api.models import UserQuizAttempt, UserQuizAnswer, Question, Answer
    from datetime import datetime, timedelta
    
    attempts_created = 0
    answers_created = 0
    created_attempts = []
    
    for i, user in enumerate(users):
        # Give each user 1-3 quiz attempts
        num_quizzes = min(1 + (i % 3), len(quizzes))
        user_quizzes = quizzes[:num_quizzes]
        
        for j, quiz in enumerate(user_quizzes):
            # Calculate score based on user index
            score = 70 + (i * 5) % 30  # Score between 70-100
            passed = score >= quiz.passing_score
            time_taken = 300 + (i * 30) % 600  # 5-15 minutes
            
            attempt, created = UserQuizAttempt.objects.get_or_create(
                user=user,
                quiz=quiz,
                defaults={
                    'score': score,
                    'total_questions': quiz.question_count,
                    'correct_answers': int((score / 100) * quiz.question_count),
                    'time_taken': time_taken,
                    'passed': passed,
                    'started_at': datetime.now() - timedelta(days=j+1),
                    'completed_at': datetime.now() - timedelta(days=j+1, minutes=time_taken//60)
                }
            )
            
            if created:
                attempts_created += 1
                created_attempts.append(attempt)
                print(f"   ✅ Created quiz attempt for {user.username}: {quiz.title} ({score}%)")
                
                # Create answers for this attempt
                questions = quiz.questions.all()
                for question in questions:
                    # Get correct answer for this question
                    correct_answer = question.answers.filter(is_correct=True).first()
                    if correct_answer:
                        # 80% chance of correct answer
                        is_correct = (i + j) % 5 != 0  # 80% correct
                        selected_answer = correct_answer if is_correct else question.answers.filter(is_correct=False).first()
                        
                        user_answer, answer_created = UserQuizAnswer.objects.get_or_create(
                            user_attempt=attempt,
                            question=question,
                            defaults={
                                'selected_answer': selected_answer,
                                'is_correct': is_correct,
                                'points_earned': question.points if is_correct else 0
                            }
                        )
                        
                        if answer_created:
                            answers_created += 1
    
    print(f"   📊 Created {attempts_created} quiz attempts and {answers_created} answers")
    return created_attempts
