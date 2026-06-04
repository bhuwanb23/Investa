import secrets
import hashlib
from django.contrib.auth import authenticate
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

import pyotp

from ..models import SecuritySettings, UserSession
from ..serializers import (
    SecuritySettingsSerializer, SecuritySettingsUpdateSerializer,
    UserSessionSerializer, ChangePasswordSerializer,
    TwoFactorSetupSerializer, TwoFactorVerifySerializer, TwoFactorDisableSerializer,
)


ISSUER_NAME = 'Investa'


class SecuritySettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for security settings"""
    serializer_class = SecuritySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SecuritySettings.objects.filter(user=self.request.user)

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
    def change_password(self, request):
        """Change password — validates old password, sets new one"""
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'old_password': ['Current password is incorrect.']}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        settings = SecuritySettings.objects.get(user=user)
        settings.last_password_change = __import__('django.utils.timezone', fromlist=['now']).now()
        settings.save()

        return Response({'detail': 'Password changed successfully.'})

    @action(detail=False, methods=['post'])
    def setup_2fa(self, request):
        """Generate TOTP secret, QR URI, and hashed backup codes"""
        settings, _ = SecuritySettings.objects.get_or_create(user=request.user)

        secret = pyotp.random_base32()
        uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=request.user.email or request.user.username,
            issuer_name=ISSUER_NAME
        )

        backup_codes = []
        hashed_codes = []
        for _ in range(10):
            code = secrets.token_hex(4).upper()  # 8-char hex code
            backup_codes.append(code)
            hashed_codes.append(hashlib.sha256(code.encode()).hexdigest())

        settings.two_factor_secret = secret
        settings.backup_codes = hashed_codes
        settings.save()

        serializer = TwoFactorSetupSerializer(data={
            'secret': secret,
            'uri': uri,
            'backup_codes': backup_codes,
        })
        serializer.is_valid()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def verify_2fa(self, request):
        """Verify a TOTP code and enable 2FA"""
        serializer = TwoFactorVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            settings = SecuritySettings.objects.get(user=request.user)
        except SecuritySettings.DoesNotExist:
            return Response({'detail': '2FA not set up. Call setup_2fa first.'}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.two_factor_secret:
            return Response({'detail': '2FA not set up. Call setup_2fa first.'}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(settings.two_factor_secret)
        code = serializer.validated_data['code']

        # Check TOTP code or backup codes
        if totp.verify(code):
            settings.two_factor_enabled = True
            settings.save()
            return Response({'two_factor_enabled': True, 'detail': '2FA enabled successfully.'})

        # Check backup codes
        for i, hashed in enumerate(settings.backup_codes):
            if hashlib.sha256(code.encode()).hexdigest() == hashed:
                codes = list(settings.backup_codes)
                codes.pop(i)
                settings.backup_codes = codes
                settings.two_factor_enabled = True
                settings.save()
                return Response({'two_factor_enabled': True, 'detail': '2FA enabled using backup code.'})

        return Response({'code': ['Invalid verification code.']}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def disable_2fa(self, request):
        """Disable 2FA after password confirmation"""
        serializer = TwoFactorDisableSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if not user.check_password(serializer.validated_data['password']):
            return Response({'password': ['Password is incorrect.']}, status=status.HTTP_400_BAD_REQUEST)

        try:
            settings = SecuritySettings.objects.get(user=user)
        except SecuritySettings.DoesNotExist:
            return Response({'detail': 'Security settings not found.'}, status=status.HTTP_404_NOT_FOUND)

        settings.two_factor_enabled = False
        settings.two_factor_secret = ''
        settings.backup_codes = []
        settings.save()

        return Response({'two_factor_enabled': False, 'detail': '2FA disabled successfully.'})


class UserSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for user sessions — read + delete"""
    serializer_class = UserSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSession.objects.filter(user=self.request.user, is_active=True)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

    @action(detail=False, methods=['post'])
    def logout_all_devices(self, request):
        """Logout from all devices except current"""
        current_session = request.session.session_key
        UserSession.objects.filter(user=request.user).exclude(session_key=current_session).update(is_active=False)
        return Response({'detail': 'Logged out from all other devices'})
