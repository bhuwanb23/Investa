from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, SecuritySettings, PrivacySettings, LearningProgress, TradingPerformance


class Command(BaseCommand):
    help = "Create a test user with sample data (email: testuser@example.com, password: testpass123)"

    def handle(self, *args, **options):
        username = 'testuser'
        email = 'testuser@example.com'
        password = 'testpass123'

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': 'Test',
                'last_name': 'User',
            }
        )
        if created:
            user.set_password(password)
            user.save()
            # Create all related models
            UserProfile.objects.get_or_create(user=user)
            SecuritySettings.objects.get_or_create(user=user)
            PrivacySettings.objects.get_or_create(user=user)
            LearningProgress.objects.get_or_create(user=user)
            TradingPerformance.objects.get_or_create(user=user)
            self.stdout.write(self.style.SUCCESS(
                f'Test user created: {username} / {password}'
            ))
        else:
            self.stdout.write(self.style.WARNING(
                f'Test user already exists: {username}'
            ))
