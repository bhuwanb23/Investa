from django.contrib.auth.models import User
from rest_framework import viewsets, status, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response

from ..throttles import AuthAnonRateThrottle, PingAnonRateThrottle
from ..models import (
    UserProfile,
    SecuritySettings,
    PrivacySettings,
    LearningProgress,
    TradingPerformance,
    PasswordResetToken,
)
from ..serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    SecuritySettingsSerializer,
    PrivacySettingsSerializer,
    LearningProgressSerializer,
    TradingPerformanceSerializer,
    ForgotPasswordRequestSerializer,
    PasswordResetRequestSerializer,
)


class CustomAuthToken(ObtainAuthToken):
    """Custom authentication token view that accepts email or username"""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [AuthAnonRateThrottle]
    
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
    throttle_classes = [AuthAnonRateThrottle]
    
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
        Token.objects.filter(user=request.user).delete()
        return Response({'detail': 'Logged out'})


class PingView(APIView):
    """Simple health check endpoint to verify connectivity from clients"""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [PingAnonRateThrottle]

    def get(self, request):
        return Response({
            'status': 'ok',
            'message': 'Investa API is reachable',
        })


class ForgotPasswordView(APIView):
    """Step 1 of password reset.

    Accepts an email, creates a PasswordResetToken (1h lifetime) if the
    account exists, and returns a generic success response. The reset token
    is returned in the response so the dev client can complete step 2; in
    production an email would be sent instead.
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [AuthAnonRateThrottle]

    def post(self, request):
        serializer = ForgotPasswordRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower().strip()

        # Always return a generic success message to avoid leaking which
        # emails are registered. Only attach the reset_token to the response
        # when the user actually exists.
        generic_message = (
            'If an account with that email exists, a password reset link '
            'has been sent.'
        )
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({'detail': generic_message}, status=status.HTTP_200_OK)

        reset_token = PasswordResetToken.create_for_user(user)
        return Response(
            {
                'detail': generic_message,
                'reset_token': reset_token.token,
                'expires_at': reset_token.expires_at.isoformat(),
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    """Step 2 of password reset.

    Accepts the reset token and a new password. Validates the token is
    unused and unexpired, sets the new password, and marks the token used.
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [AuthAnonRateThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_value = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            reset_token = PasswordResetToken.objects.select_related('user').get(token=token_value)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {'detail': 'Invalid or expired reset token.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if reset_token.is_used:
            return Response(
                {'detail': 'This reset token has already been used.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if reset_token.is_expired:
            return Response(
                {'detail': 'This reset token has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = reset_token.user
        user.set_password(new_password)
        user.save(update_fields=['password'])
        reset_token.mark_used()

        # Invalidate any existing auth tokens so stolen tokens can't be
        # reused after a password reset.
        Token.objects.filter(user=user).delete()

        return Response(
            {
                'detail': 'Password has been reset successfully. Please log in with your new password.',
            },
            status=status.HTTP_200_OK,
        )