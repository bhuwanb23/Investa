from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create a test user with sample data (email: testuser@example.com, password: testpass123)"

    def handle(self, *args, **options):
        from test.create_test_user import create_test_user
        create_test_user()
        self.stdout.write(self.style.SUCCESS("Test user created successfully"))
