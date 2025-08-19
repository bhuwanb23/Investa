#!/usr/bin/env python
"""
Script to create a test user for the Investa backend
Run this script after setting up the Django environment
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
from api.models import Language, UserProfile

def create_test_user():
    """Create a test user if it doesn't exist"""
    try:
        # Check if test user already exists
        if User.objects.filter(username='test@example.com').exists():
            print("Test user already exists: test@example.com")
            return
        
        # Create test user
        user = User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        # Create user profile
        default_language = Language.objects.first()
        if not default_language:
            # Create default language if none exists
            default_language = Language.objects.create(
                name='English',
                code='en',
                native_name='English'
            )
        
        UserProfile.objects.create(
            user=user,
            preferred_language=default_language,
            phone_number='+1234567890',
            date_of_birth='1990-01-01',
            investment_experience='beginner'
        )
        
        print("Test user created successfully!")
        print("Username: test@example.com")
        print("Password: testpass123")
        print("You can now test the login functionality")
        
    except Exception as e:
        print(f"Error creating test user: {e}")

if __name__ == '__main__':
    create_test_user()
