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

from .models import (
    Language, UserProfile, SecuritySettings, PrivacySettings,
    LearningProgress, TradingPerformance, UserSession, Notification,
    Badge, UserBadge
)
from .serializers import (
    LanguageSerializer, UserProfileSerializer, SecuritySettingsSerializer, PrivacySettingsSerializer,
    LearningProgressSerializer, TradingPerformanceSerializer, UserSessionSerializer, NotificationSerializer,
    BadgeSerializer, UserBadgeSerializer, UserProfileDetailSerializer, ProfileUpdateSerializer,
    SecuritySettingsUpdateSerializer, PrivacySettingsUpdateSerializer, CompleteProfileSerializer,
    UserRegistrationSerializer
)


def _build_model_entries():
    """Collect metadata and up to 50 rows for all models to display in the DB explorer."""
    model_entries = []
    try:
        from django.apps import apps
        from django.db import connection

        # Existing tables in DB
        try:
            existing_tables = set(connection.introspection.table_names())
        except Exception as e:
            print(f"Error getting table names: {e}")
            existing_tables = set()

        # All models across installed apps
        all_models = []
        for app_config in apps.get_app_configs():
            try:
                app_models = app_config.get_models()
                all_models.extend(app_models)
            except Exception as e:
                print(f"Error getting models from {app_config.name}: {e}")
                continue

        # Ensure our local models are present
        from .models import Language, UserProfile, SecuritySettings, PrivacySettings, LearningProgress, TradingPerformance, UserSession, Notification, Badge, UserBadge
        custom_models = [Language, UserProfile, SecuritySettings, PrivacySettings, LearningProgress, TradingPerformance, UserSession, Notification, Badge, UserBadge]
        all_models.extend(custom_models)

        # Dedupe while keeping order
        seen = set()
        unique_models = []
        for model in all_models:
            if model not in seen:
                seen.add(model)
                unique_models.append(model)

        for model in unique_models:
            try:
                if not getattr(model._meta, 'managed', True):
                    continue

                app_label = model._meta.app_label
                model_name = model.__name__
                table_name = model._meta.db_table

                fields = [field.name for field in model._meta.fields]
                has_table = table_name in existing_tables

                try:
                    if has_table:
                        queryset = model.objects.all()
                        raw_rows = list(queryset.values(*fields)[:50])
                        rows = [[row.get(field) for field in fields] for row in raw_rows]
                        total_count = queryset.count()
                    else:
                        rows = []
                        total_count = 0

                    model_entries.append({
                        'app_label': app_label,
                        'model_name': model_name,
                        'table_name': table_name,
                        'fields': fields,
                        'rows': rows,
                        'total_count': total_count,
                        'has_table': has_table,
                    })

                except Exception as e:
                    print(f"Error querying model {model_name}: {e}")
                    model_entries.append({
                        'app_label': app_label,
                        'model_name': model_name,
                        'table_name': table_name,
                        'fields': fields,
                        'rows': [],
                        'total_count': 0,
                        'has_table': has_table,
                    })

            except Exception as e:
                print(f"Error processing model {model}: {e}")
                continue

        model_entries.sort(key=lambda m: (m['app_label'], m['model_name']))
        print(f"Found {len(model_entries)} models for DB explorer")
    except Exception as e:
        print(f"Error building model entries: {e}")
        model_entries = []

    return model_entries


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for languages - read-only"""
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profiles"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserProfileDetailSerializer
        elif self.action in ['update', 'partial_update']:
            return ProfileUpdateSerializer
        return UserProfileSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current user's complete profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileDetailSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update current user's profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def complete_profile(self, request):
        """Complete user profile setup"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = CompleteProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


class SecuritySettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for security settings"""
    serializer_class = SecuritySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SecuritySettings.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return SecuritySettingsUpdateSerializer
        return SecuritySettingsSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_settings(self, request):
        """Get current user's security settings"""
        try:
            settings = SecuritySettings.objects.get(user=request.user)
            serializer = self.get_serializer(settings)
            return Response(serializer.data)
        except SecuritySettings.DoesNotExist:
            return Response({'detail': 'Security settings not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_settings(self, request):
        """Update current user's security settings"""
        try:
            settings = SecuritySettings.objects.get(user=request.user)
            serializer = SecuritySettingsUpdateSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SecuritySettings.DoesNotExist:
            return Response({'detail': 'Security settings not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def toggle_2fa(self, request):
        """Toggle two-factor authentication"""
        try:
            settings = SecuritySettings.objects.get(user=request.user)
            settings.two_factor_enabled = not settings.two_factor_enabled
            settings.save()
            return Response({'two_factor_enabled': settings.two_factor_enabled})
        except SecuritySettings.DoesNotExist:
            return Response({'detail': 'Security settings not found'}, status=status.HTTP_404_NOT_FOUND)


class PrivacySettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for privacy settings"""
    serializer_class = PrivacySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PrivacySettings.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return PrivacySettingsUpdateSerializer
        return PrivacySettingsSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_settings(self, request):
        """Get current user's privacy settings"""
        try:
            settings = PrivacySettings.objects.get(user=request.user)
            serializer = self.get_serializer(settings)
            return Response(serializer.data)
        except PrivacySettings.DoesNotExist:
            return Response({'detail': 'Privacy settings not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_settings(self, request):
        """Update current user's privacy settings"""
        try:
            settings = PrivacySettings.objects.get(user=request.user)
            serializer = PrivacySettingsUpdateSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PrivacySettings.DoesNotExist:
            return Response({'detail': 'Privacy settings not found'}, status=status.HTTP_404_NOT_FOUND)


class LearningProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for learning progress"""
    serializer_class = LearningProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return LearningProgress.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        """Get current user's learning progress"""
        try:
            progress = LearningProgress.objects.get(user=request.user)
            serializer = self.get_serializer(progress)
            return Response(serializer.data)
        except LearningProgress.DoesNotExist:
            return Response({'detail': 'Learning progress not found'}, status=status.HTTP_404_NOT_FOUND)


class TradingPerformanceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for trading performance"""
    serializer_class = TradingPerformanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return TradingPerformance.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_performance(self, request):
        """Get current user's trading performance"""
        try:
            performance = TradingPerformance.objects.get(user=request.user)
            serializer = self.get_serializer(performance)
            return Response(serializer.data)
        except TradingPerformance.DoesNotExist:
            return Response({'detail': 'Trading performance not found'}, status=status.HTTP_404_NOT_FOUND)


class UserSessionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user sessions"""
    serializer_class = UserSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserSession.objects.filter(user=self.request.user, is_active=True)
    
    @action(detail=False, methods=['post'])
    def logout_all_devices(self, request):
        """Logout from all devices except current"""
        current_session = request.session.session_key
        UserSession.objects.filter(user=request.user).exclude(session_key=current_session).update(is_active=False)
        return Response({'detail': 'Logged out from all other devices'})


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Return count of unread notifications"""
        count = self.get_queryset().filter(read=False).count()
        return Response({'unread_count': count})

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Filter notifications by type"""
        notification_type = request.query_params.get('type')
        queryset = self.get_queryset()
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({'detail': 'Notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(read=True)
        return Response({'detail': 'All notifications marked as read'})


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for badges"""
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_badges(self, request):
        """Get current user's earned badges"""
        badges = UserBadge.objects.filter(user=request.user)
        serializer = UserBadgeSerializer(badges, many=True)
        return Response(serializer.data)


# Custom authentication views
class CustomAuthToken(ObtainAuthToken):
    """Custom authentication token view"""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                         context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Get or create user profile and related models
        profile, created = UserProfile.objects.get_or_create(user=user)
        security_settings, created = SecuritySettings.objects.get_or_create(user=user)
        privacy_settings, created = PrivacySettings.objects.get_or_create(user=user)
        learning_progress, created = LearningProgress.objects.get_or_create(user=user)
        trading_performance, created = TradingPerformance.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email,
            'profile': UserProfileSerializer(profile).data,
            'security_settings': SecuritySettingsSerializer(security_settings).data,
            'privacy_settings': PrivacySettingsSerializer(privacy_settings).data,
            'learning_progress': LearningProgressSerializer(learning_progress).data,
            'trading_performance': TradingPerformanceSerializer(trading_performance).data,
        })


class UserRegistrationView(viewsets.GenericViewSet):
    """User registration view"""
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer
    authentication_classes = []
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create all related models for the new user
            UserProfile.objects.create(user=user)
            SecuritySettings.objects.create(user=user)
            PrivacySettings.objects.create(user=user)
            LearningProgress.objects.create(user=user)
            TradingPerformance.objects.create(user=user)
            
            # Create auth token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email,
                'detail': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """Return current authenticated user and complete profile data"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)
        security_settings, _ = SecuritySettings.objects.get_or_create(user=user)
        privacy_settings, _ = PrivacySettings.objects.get_or_create(user=user)
        learning_progress, _ = LearningProgress.objects.get_or_create(user=user)
        trading_performance, _ = TradingPerformance.objects.get_or_create(user=user)
        
        return Response({
            'user_id': user.pk,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile': UserProfileSerializer(profile).data,
            'security_settings': SecuritySettingsSerializer(security_settings).data,
            'privacy_settings': PrivacySettingsSerializer(privacy_settings).data,
            'learning_progress': LearningProgressSerializer(learning_progress).data,
            'trading_performance': TradingPerformanceSerializer(trading_performance).data,
        })


class LogoutView(APIView):
    """Invalidate user's auth token"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            Token.objects.filter(user=request.user).delete()
        except Exception:
            pass
        return Response({'detail': 'Logged out'})


# Simple HTML views for development
def index(request):
    """Landing page for the console"""
    return render(request, 'index.html')

def dashboard(request):
    """Development dashboard to try API calls quickly"""
    return render(request, 'dashboard.html', {'models': _build_model_entries()})

def database_view(request):
    """Render a page that shows all tables and sample contents"""
    model_entries = _build_model_entries()
    return render(request, 'database.html', {'models': model_entries})
