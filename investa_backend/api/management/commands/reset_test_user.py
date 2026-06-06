from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Reset test user data (deletes and recreates testuser@example.com)"

    def handle(self, *args, **options):
        from test.reset_test_user import reset_test_user
        reset_test_user()
        self.stdout.write(self.style.SUCCESS("Test user reset successfully"))
