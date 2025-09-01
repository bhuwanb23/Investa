#!/usr/bin/env python
"""
Sample data for Security models (SecuritySettings, UserSession)
"""

from datetime import datetime, timedelta
from django.contrib.auth.models import User

# Security Settings sample data
SECURITY_SETTINGS_DATA = [
    {
        'biometric_enabled': True,
        'session_timeout': 30,
        'login_notifications': True,
        'suspicious_activity_alerts': True,
        'two_factor_enabled': True,
        'two_factor_secret': 'JBSWY3DPEHPK3PXP',
        'backup_codes': ['123456', '234567', '345678', '456789', '567890'],
        'recovery_email': 'recovery@example.com'
    },
    {
        'biometric_enabled': False,
        'session_timeout': 60,
        'login_notifications': True,
        'suspicious_activity_alerts': False,
        'two_factor_enabled': False,
        'two_factor_secret': '',
        'backup_codes': [],
        'recovery_email': 'jane.recovery@example.com'
    },
    {
        'biometric_enabled': True,
        'session_timeout': 45,
        'login_notifications': True,
        'suspicious_activity_alerts': True,
        'two_factor_enabled': True,
        'two_factor_secret': 'KBSWY3DPEHPK3PXP',
        'backup_codes': ['111111', '222222', '333333', '444444', '555555'],
        'recovery_email': 'mike.recovery@example.com'
    },
    {
        'biometric_enabled': False,
        'session_timeout': 20,
        'login_notifications': False,
        'suspicious_activity_alerts': True,
        'two_factor_enabled': True,
        'two_factor_secret': 'LBSWY3DPEHPK3PXP',
        'backup_codes': ['666666', '777777', '888888', '999999', '000000'],
        'recovery_email': 'sarah.recovery@example.com'
    },
    {
        'biometric_enabled': True,
        'session_timeout': 90,
        'login_notifications': True,
        'suspicious_activity_alerts': True,
        'two_factor_enabled': False,
        'two_factor_secret': '',
        'backup_codes': [],
        'recovery_email': 'david.recovery@example.com'
    }
]

# User Session sample data
USER_SESSION_DATA = [
    {
        'session_key': 'session_key_1_abcdef123456',
        'device_info': 'Chrome 120.0.0.0 on Windows 11',
        'ip_address': '192.168.1.100',
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'is_active': True
    },
    {
        'session_key': 'session_key_2_ghijkl789012',
        'device_info': 'Safari 17.1 on iPhone 15 Pro',
        'ip_address': '192.168.1.101',
        'user_agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X)',
        'is_active': True
    },
    {
        'session_key': 'session_key_3_mnopqr345678',
        'device_info': 'Firefox 120.0 on Ubuntu 22.04',
        'ip_address': '192.168.1.102',
        'user_agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101',
        'is_active': False
    },
    {
        'session_key': 'session_key_4_stuvwx901234',
        'device_info': 'Edge 120.0.0.0 on Windows 10',
        'ip_address': '192.168.1.103',
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'is_active': True
    },
    {
        'session_key': 'session_key_5_yzabcd567890',
        'device_info': 'Chrome 120.0.0.0 on macOS 14.0',
        'ip_address': '192.168.1.104',
        'user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'is_active': True
    }
]

def create_security_settings(users):
    """Create security settings for users"""
    from api.models import SecuritySettings
    
    security_settings = []
    for i, user in enumerate(users[:len(SECURITY_SETTINGS_DATA)]):
        settings_data = SECURITY_SETTINGS_DATA[i].copy()
        settings_data['user'] = user
        
        settings, created = SecuritySettings.objects.get_or_create(
            user=user,
            defaults=settings_data
        )
        
        if created:
            print(f"✅ Created security settings for: {user.username}")
        
        security_settings.append(settings)
    
    return security_settings

def create_user_sessions(users):
    """Create user sessions for users"""
    from api.models import UserSession
    
    user_sessions = []
    for i, user in enumerate(users[:len(USER_SESSION_DATA)]):
        session_data = USER_SESSION_DATA[i].copy()
        session_data['user'] = user
        
        # Add some variation to session times
        if i % 2 == 0:
            session_data['last_activity'] = datetime.now() - timedelta(hours=i)
        else:
            session_data['last_activity'] = datetime.now() - timedelta(days=i)
        
        session, created = UserSession.objects.get_or_create(
            user=user,
            session_key=session_data['session_key'],
            defaults=session_data
        )
        
        if created:
            print(f"✅ Created user session for: {user.username}")
        
        user_sessions.append(session)
    
    return user_sessions
