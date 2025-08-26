# Views package - Import all views for easy access

from .user import LanguageViewSet, UserProfileViewSet
from .security import SecuritySettingsViewSet, UserSessionViewSet
from .privacy import PrivacySettingsViewSet
from .learning import (
    LearningProgressViewSet, BadgeViewSet,
    CourseViewSet, LessonViewSet, UserLessonProgressViewSet
)
from .trading import TradingPerformanceViewSet
from .notifications import NotificationViewSet
from .auth import CustomAuthToken, UserRegistrationView, MeView, LogoutView
from .console import index, dashboard, database_view, _build_model_entries

__all__ = [
    # Auth views
    'CustomAuthToken',
    'UserRegistrationView',
    'MeView',
    'LogoutView',
    
    # User views
    'LanguageViewSet',
    'UserProfileViewSet',
    
    # Security views
    'SecuritySettingsViewSet',
    'UserSessionViewSet',
    
    # Privacy views
    'PrivacySettingsViewSet',
    
    # Learning views
    'LearningProgressViewSet',
    'BadgeViewSet',
    'CourseViewSet',
    'LessonViewSet',
    'UserLessonProgressViewSet',
    
    # Trading views
    'TradingPerformanceViewSet',
    
    # Notification views
    'NotificationViewSet',
    
    # Console views
    'index',
    'dashboard',
    'database_view',
    '_build_model_entries',
]
