#!/usr/bin/env python
"""
Sample data for User models (Language, UserProfile)
"""

from datetime import date, timedelta
from django.contrib.auth.models import User

# Language sample data
LANGUAGE_DATA = [
    {
        'code': 'en',
        'name': 'English',
        'native_name': 'English'
    },
    {
        'code': 'hi',
        'name': 'Hindi',
        'native_name': 'हिन्दी'
    },
    {
        'code': 'ta',
        'name': 'Tamil',
        'native_name': 'தமிழ்'
    },
    {
        'code': 'te',
        'name': 'Telugu',
        'native_name': 'తెలుగు'
    },
    {
        'code': 'bn',
        'name': 'Bengali',
        'native_name': 'বাংলা'
    },
    {
        'code': 'mr',
        'name': 'Marathi',
        'native_name': 'मराठी'
    },
    {
        'code': 'gu',
        'name': 'Gujarati',
        'native_name': 'ગુજરાતી'
    },
    {
        'code': 'kn',
        'name': 'Kannada',
        'native_name': 'ಕನ್ನಡ'
    },
    {
        'code': 'ml',
        'name': 'Malayalam',
        'native_name': 'മലയാളം'
    },
    {
        'code': 'pa',
        'name': 'Punjabi',
        'native_name': 'ਪੰਜਾਬੀ'
    }
]

# User sample data
USER_DATA = [
    {
        'username': 'john_doe',
        'email': 'john@example.com',
        'first_name': 'John',
        'last_name': 'Doe',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43210',
            'learning_goal': 'Master stock market fundamentals and build a diversified portfolio',
            'risk_profile': 'moderate',
            'investment_experience': 'beginner',
            'date_of_birth': date(1990, 5, 15),
            'level': 3,
            'experience_points': 450
        }
    },
    {
        'username': 'jane_smith',
        'email': 'jane@example.com',
        'first_name': 'Jane',
        'last_name': 'Smith',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43211',
            'learning_goal': 'Learn advanced trading strategies and risk management',
            'risk_profile': 'aggressive',
            'investment_experience': 'intermediate',
            'date_of_birth': date(1988, 8, 22),
            'level': 7,
            'experience_points': 1200
        }
    },
    {
        'username': 'mike_wilson',
        'email': 'mike@example.com',
        'first_name': 'Mike',
        'last_name': 'Wilson',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43212',
            'learning_goal': 'Understand mutual funds and long-term investment planning',
            'risk_profile': 'conservative',
            'investment_experience': 'beginner',
            'date_of_birth': date(1995, 3, 10),
            'level': 2,
            'experience_points': 280
        }
    },
    {
        'username': 'sarah_jones',
        'email': 'sarah@example.com',
        'first_name': 'Sarah',
        'last_name': 'Jones',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43213',
            'learning_goal': 'Master portfolio diversification and asset allocation',
            'risk_profile': 'moderate',
            'investment_experience': 'advanced',
            'date_of_birth': date(1985, 12, 5),
            'level': 12,
            'experience_points': 2800
        }
    },
    {
        'username': 'david_brown',
        'email': 'david@example.com',
        'first_name': 'David',
        'last_name': 'Brown',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43214',
            'learning_goal': 'Learn day trading and technical analysis',
            'risk_profile': 'aggressive',
            'investment_experience': 'intermediate',
            'date_of_birth': date(1992, 7, 18),
            'level': 8,
            'experience_points': 1600
        }
    },
    {
        'username': 'emma_davis',
        'email': 'emma@example.com',
        'first_name': 'Emma',
        'last_name': 'Davis',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43215',
            'learning_goal': 'Understand sustainable investing and ESG principles',
            'risk_profile': 'moderate',
            'investment_experience': 'beginner',
            'date_of_birth': date(1993, 11, 30),
            'level': 4,
            'experience_points': 650
        }
    },
    {
        'username': 'alex_chen',
        'email': 'alex@example.com',
        'first_name': 'Alex',
        'last_name': 'Chen',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43216',
            'learning_goal': 'Master options trading and derivatives',
            'risk_profile': 'aggressive',
            'investment_experience': 'advanced',
            'date_of_birth': date(1987, 4, 12),
            'level': 15,
            'experience_points': 3500
        }
    },
    {
        'username': 'priya_patel',
        'email': 'priya@example.com',
        'first_name': 'Priya',
        'last_name': 'Patel',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43217',
            'learning_goal': 'Learn about Indian markets and sector analysis',
            'risk_profile': 'moderate',
            'investment_experience': 'intermediate',
            'date_of_birth': date(1991, 9, 25),
            'level': 6,
            'experience_points': 950
        }
    },
    {
        'username': 'raj_kumar',
        'email': 'raj@example.com',
        'first_name': 'Raj',
        'last_name': 'Kumar',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43218',
            'learning_goal': 'Understand retirement planning and tax-efficient investing',
            'risk_profile': 'conservative',
            'investment_experience': 'intermediate',
            'date_of_birth': date(1983, 6, 8),
            'level': 9,
            'experience_points': 1800
        }
    },
    {
        'username': 'anita_sharma',
        'email': 'anita@example.com',
        'first_name': 'Anita',
        'last_name': 'Sharma',
        'password': 'testpass123',
        'profile': {
            'phone_number': '+91-98765-43219',
            'learning_goal': 'Learn about cryptocurrency and blockchain investing',
            'risk_profile': 'aggressive',
            'investment_experience': 'beginner',
            'date_of_birth': date(1996, 2, 14),
            'level': 5,
            'experience_points': 750
        }
    }
]

def create_languages():
    """Create language objects"""
    from api.models import Language
    
    languages = []
    for lang_data in LANGUAGE_DATA:
        lang, created = Language.objects.get_or_create(
            code=lang_data['code'],
            defaults=lang_data
        )
        languages.append(lang)
        if created:
            print(f"✅ Created language: {lang.name}")
    
    return languages

def create_users_and_profiles(languages):
    """Create users and their profiles"""
    from api.models import UserProfile
    
    users = []
    for user_info in USER_DATA:
        # Create user
        user, created = User.objects.get_or_create(
            username=user_info['username'],
            defaults={
                'email': user_info['email'],
                'first_name': user_info['first_name'],
                'last_name': user_info['last_name']
            }
        )
        
        if created:
            user.set_password(user_info['password'])
            user.save()
            print(f"✅ Created user: {user.username}")
        
        # Create user profile
        profile_data = user_info['profile']
        profile_data['preferred_language'] = languages[0]  # Default to English
        
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults=profile_data
        )
        
        if created:
            print(f"✅ Created profile for: {user.username}")
        
        users.append(user)
    
    return users
