from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create detailed user progress records including lesson progress and quiz attempts"

    def handle(self, *args, **options):
        from create_user_progress import create_user_progress
        create_user_progress()
        self.stdout.write(self.style.SUCCESS("User progress created successfully"))
