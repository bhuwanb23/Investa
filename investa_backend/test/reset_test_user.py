#!/usr/bin/env python
"""
Script to reset the test user's password
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

def reset_test_user():
    """Reset the test user's password"""
    try:
        # Find the test user
        user = User.objects.filter(username='test@example.com').first()
        
        if not user:
            print("Test user not found. Creating new test user...")
            user = User.objects.create_user(
                username='test@example.com',
                email='test@example.com',
                password='test123',
                first_name='Test',
                last_name='User'
            )
            print("✅ New test user created!")
        else:
            print("Test user found. Resetting password...")
            user.set_password('test123')
            user.save()
            print("✅ Password reset!")
        
        print("Username: test@example.com")
        print("Password: test123")
        print("You can now test the login functionality")
        
    except Exception as e:
        print(f"Error resetting test user: {e}")

if __name__ == '__main__':
    reset_test_user()
