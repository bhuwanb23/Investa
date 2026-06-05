# Import all serializers from the organized structure
from .serializers.auth import UserSerializer, UserRegistrationSerializer
from .serializers.user import (
    LanguageSerializer, UserProfileSerializer, UserProfileDetailSerializer, 
    ProfileUpdateSerializer, CompleteProfileSerializer
)
from .serializers.security import (
    SecuritySettingsSerializer, SecuritySettingsUpdateSerializer, UserSessionSerializer
)
from .serializers.privacy import (
    PrivacySettingsSerializer
)
from .serializers.learning import (
    LearningProgressSerializer, BadgeSerializer, UserBadgeSerializer
)
from .serializers.trading import TradingPerformanceSerializer
from .serializers.notifications import NotificationSerializer

__all__ = [
    # Auth serializers
    'UserSerializer',
    'UserRegistrationSerializer',
    
    # User serializers
    'LanguageSerializer',
    'UserProfileSerializer',
    'UserProfileDetailSerializer',
    'ProfileUpdateSerializer',
    'CompleteProfileSerializer',
    
    # Security serializers
    'SecuritySettingsSerializer',
    'SecuritySettingsUpdateSerializer',
    'UserSessionSerializer',
    
    # Privacy serializers
    'PrivacySettingsSerializer',
    
    # Learning serializers
    'LearningProgressSerializer',
    'BadgeSerializer',
    'UserBadgeSerializer',
    
    # Trading serializers
    'TradingPerformanceSerializer',
    
    # Notification serializers
    'NotificationSerializer',
]
