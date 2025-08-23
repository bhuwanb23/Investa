from rest_framework import viewsets, status, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import render
from django.db import connection
from django.apps import apps

# Import all views from the organized structure
from .views.auth import CustomAuthToken, UserRegistrationView, MeView, LogoutView
from .views.user import LanguageViewSet, UserProfileViewSet
from .views.security import SecuritySettingsViewSet, UserSessionViewSet
from .views.privacy import PrivacySettingsViewSet
from .views.learning import LearningProgressViewSet, BadgeViewSet
from .views.trading import TradingPerformanceViewSet
from .views.notifications import NotificationViewSet
from .views.console import index, dashboard, database_view, _build_model_entries

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
