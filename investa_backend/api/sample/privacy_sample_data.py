#!/usr/bin/env python
"""
Sample data for Privacy models (PrivacySettings)
"""

from django.contrib.auth.models import User

# Privacy Settings sample data
PRIVACY_SETTINGS_DATA = [
    {
        'profile_visibility': True,
        'activity_visibility': False,
        'data_sharing': True,
        'location_sharing': False
    },
    {
        'profile_visibility': False,
        'activity_visibility': True,
        'data_sharing': False,
        'location_sharing': True
    },
    {
        'profile_visibility': True,
        'activity_visibility': True,
        'data_sharing': True,
        'location_sharing': True
    },
    {
        'profile_visibility': False,
        'activity_visibility': False,
        'data_sharing': False,
        'location_sharing': False
    },
    {
        'profile_visibility': True,
        'activity_visibility': False,
        'data_sharing': True,
        'location_sharing': False
    },
    {
        'profile_visibility': False,
        'activity_visibility': True,
        'data_sharing': False,
        'location_sharing': False
    },
    {
        'profile_visibility': True,
        'activity_visibility': True,
        'data_sharing': False,
        'location_sharing': True
    },
    {
        'profile_visibility': False,
        'activity_visibility': False,
        'data_sharing': True,
        'location_sharing': False
    },
    {
        'profile_visibility': True,
        'activity_visibility': False,
        'data_sharing': True,
        'location_sharing': True
    },
    {
        'profile_visibility': False,
        'activity_visibility': True,
        'data_sharing': True,
        'location_sharing': False
    }
]

def create_privacy_settings(users):
    """Create privacy settings for users"""
    from api.models import PrivacySettings
    
    privacy_settings = []
    for i, user in enumerate(users[:len(PRIVACY_SETTINGS_DATA)]):
        settings_data = PRIVACY_SETTINGS_DATA[i].copy()
        settings_data['user'] = user
        
        settings, created = PrivacySettings.objects.get_or_create(
            user=user,
            defaults=settings_data
        )
        
        if created:
            print(f"✅ Created privacy settings for: {user.username}")
        
        privacy_settings.append(settings)
    
    return privacy_settings
