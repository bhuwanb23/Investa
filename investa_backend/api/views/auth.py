from rest_framework import viewsets, status, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response

from ..models import UserProfile, SecuritySettings, PrivacySettings, LearningProgress, TradingPerformance
from ..serializers import (
    UserRegistrationSerializer, UserProfileSerializer, SecuritySettingsSerializer, 
    PrivacySettingsSerializer, LearningProgressSerializer, TradingPerformanceSerializer
)


class CustomAuthToken(ObtainAuthToken):
    """Custom authentication token view that accepts email or username"""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    
    def post(self, request, *args, **kwargs):
        # Check if the input looks like an email
        username_or_email = request.data.get('username', '')
        if '@' in username_or_email:
            # Try to find user by email
            try:
                from django.contrib.auth.models import User
                user = User.objects.get(email=username_or_email)
                # Create a modified request with the actual username
                modified_data = request.data.copy()
                modified_data['username'] = user.username
                serializer = self.serializer_class(data=modified_data,
                                                 context={'request': request})
            except User.DoesNotExist:
                # If email not found, proceed with original logic
                serializer = self.serializer_class(data=request.data,
                                                 context={'request': request})
        else:
            # Use original logic for username
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


class PingView(APIView):
    """Simple health check endpoint to verify connectivity from clients"""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({
            'status': 'ok',
            'message': 'Investa API is reachable',
        })