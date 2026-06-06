from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create comprehensive learning progress data for all users"

    def handle(self, *args, **options):
        from create_progress_data import create_progress_data, assign_random_achievements_to_users
        create_progress_data()
        assign_random_achievements_to_users()
        self.stdout.write(self.style.SUCCESS("Progress data created successfully"))
