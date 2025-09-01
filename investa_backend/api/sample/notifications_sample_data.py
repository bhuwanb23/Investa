#!/usr/bin/env python
"""
Sample data for Notification models
"""

from django.contrib.auth.models import User

# Notification sample data
NOTIFICATION_DATA = [
    {
        'title': 'Welcome to Investa!',
        'message': 'Thank you for joining our platform. Start your investment learning journey today!',
        'notification_type': 'general'
    },
    {
        'title': 'Course Completed',
        'message': 'Congratulations! You have completed "Stock Market Fundamentals" course.',
        'notification_type': 'learning'
    },
    {
        'title': 'New Achievement Unlocked',
        'message': 'You have earned the "First Steps" badge for completing your first lesson.',
        'notification_type': 'achievement'
    },
    {
        'title': 'Security Alert',
        'message': 'New login detected from a new device. If this was you, no action is needed.',
        'notification_type': 'security'
    },
    {
        'title': 'Portfolio Update',
        'message': 'Your portfolio value has increased by 5.2% this week.',
        'notification_type': 'trading'
    },
    {
        'title': 'Quiz Reminder',
        'message': 'Don\'t forget to complete the quiz for "What are Stocks and Shares?" lesson.',
        'notification_type': 'learning'
    },
    {
        'title': 'Market Alert',
        'message': 'RELIANCE stock has reached your watchlist target price.',
        'notification_type': 'trading'
    },
    {
        'title': 'Profile Update',
        'message': 'Your profile has been successfully updated.',
        'notification_type': 'general'
    }
]

def create_notifications(users):
    """Create notification objects for users"""
    from api.models import Notification
    
    notifications = []
    for user in users:
        # Create 3-5 notifications per user
        num_notifications = min(3 + (user.id % 3), len(NOTIFICATION_DATA))
        user_notifications = NOTIFICATION_DATA[:num_notifications]
        
        for i, notif_data in enumerate(user_notifications):
            # Mark some notifications as read
            is_read = i % 2 == 0
            
            notification, created = Notification.objects.get_or_create(
                user=user,
                title=notif_data['title'],
                message=notif_data['message'],
                defaults={
                    'notification_type': notif_data['notification_type'],
                    'read': is_read
                }
            )
            
            if created:
                print(f"✅ Created notification for {user.username}: {notification.title[:30]}...")
                notifications.append(notification)
    
    return notifications
