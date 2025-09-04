#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'investa_backend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from api.models import UserProgress

def check_user_tokens():
    """Check user tokens and progress data"""
    
    print("=== User Authentication Check ===\n")
    
    # Get all users
    users = User.objects.all()
    print(f"Total users: {users.count()}")
    
    for user in users:
        print(f"\n--- User: {user.username} (ID: {user.id}) ---")
        
        # Check if user has a token
        try:
            token = Token.objects.get(user=user)
            print(f"  Token: {token.key}")
        except Token.DoesNotExist:
            print("  No token found - creating one...")
            token = Token.objects.create(user=user)
            print(f"  Created token: {token.key}")
        
        # Check progress data
        try:
            progress = UserProgress.objects.get(user=user)
            print(f"  Progress data exists:")
            print(f"    Level: {progress.current_level}")
            print(f"    Experience: {progress.experience_points} XP")
            print(f"    Course completion: {progress.course_completion_percentage}%")
            print(f"    Portfolio value: ₹{progress.portfolio_value}")
        except UserProgress.DoesNotExist:
            print("  No progress data found")
    
    print(f"\n=== Sample API calls ===")
    print("To test the API with a specific user, use:")
    print("curl -H 'Authorization: Token YOUR_TOKEN_HERE' http://127.0.0.1:8000/api/progress/summary/")

if __name__ == '__main__':
    check_user_tokens()
