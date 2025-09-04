from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .. import views
from ..views.trading import (
    StockViewSet, UserWatchlistViewSet, PortfolioViewSet, OrderViewSet,
    TradeViewSet, TradingPerformanceViewSet, MarketDataViewSet, AchievementViewSet
)
from ..views.auth import PingView

router = DefaultRouter()
router.register(r'languages', views.LanguageViewSet)
router.register(r'profiles', views.UserProfileViewSet, basename='profile')
router.register(r'security-settings', views.SecuritySettingsViewSet, basename='security')
router.register(r'privacy-settings', views.PrivacySettingsViewSet, basename='privacy')
router.register(r'learning-progress', views.LearningProgressViewSet, basename='learning')
router.register(r'courses', views.CourseViewSet, basename='course')
router.register(r'lessons', views.LessonViewSet, basename='lesson')
router.register(r'user-lesson-progress', views.UserLessonProgressViewSet, basename='user-lesson-progress')
router.register(r'badges', views.BadgeViewSet, basename='badge')
router.register(r'sessions', views.UserSessionViewSet, basename='session')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# Progress endpoints
router.register(r'progress', views.UserProgressViewSet, basename='progress')

# Quiz endpoints
router.register(r'quiz', views.QuizViewSet, basename='quiz')
router.register(r'questions', views.QuestionViewSet, basename='question')
router.register(r'answers', views.AnswerViewSet, basename='answer')
router.register(r'quiz-attempts', views.UserQuizAttemptViewSet, basename='quiz-attempt')

# Trading endpoints
router.register(r'stocks', StockViewSet, basename='stock')
router.register(r'watchlist', UserWatchlistViewSet, basename='watchlist')
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'trades', TradeViewSet, basename='trade')
router.register(r'trading-performance', TradingPerformanceViewSet, basename='trading')
router.register(r'market-data', MarketDataViewSet, basename='market')
router.register(r'achievements', AchievementViewSet, basename='achievement')

urlpatterns = [
    # API endpoints
    path('', include(router.urls)),
    path('auth/login/', views.CustomAuthToken.as_view(), name='api_token_auth'),
    path('auth/register/', views.UserRegistrationView.as_view({'post': 'create'}), name='user_registration'),
    path('auth/token/', obtain_auth_token, name='api_token'),
    path('auth/me/', views.MeView.as_view(), name='auth_me'),
    path('auth/logout/', views.LogoutView.as_view(), name='auth_logout'),
    path('ping/', PingView.as_view(), name='api_ping'),
]
