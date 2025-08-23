from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .. import views

router = DefaultRouter()
router.register(r'languages', views.LanguageViewSet)
router.register(r'profiles', views.UserProfileViewSet, basename='profile')
router.register(r'security-settings', views.SecuritySettingsViewSet, basename='security')
router.register(r'privacy-settings', views.PrivacySettingsViewSet, basename='privacy')
router.register(r'learning-progress', views.LearningProgressViewSet, basename='learning')
router.register(r'trading-performance', views.TradingPerformanceViewSet, basename='trading')
router.register(r'sessions', views.UserSessionViewSet, basename='session')
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'badges', views.BadgeViewSet, basename='badge')

urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    path('auth/login/', views.CustomAuthToken.as_view(), name='api_token_auth'),
    path('auth/register/', views.UserRegistrationView.as_view({'post': 'create'}), name='user_registration'),
    path('auth/token/', obtain_auth_token, name='api_token'),
    path('auth/me/', views.MeView.as_view(), name='auth_me'),
    path('auth/logout/', views.LogoutView.as_view(), name='auth_logout'),
]
