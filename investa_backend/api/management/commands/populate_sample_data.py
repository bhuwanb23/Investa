from django.core.management.base import BaseCommand, CommandError
from django.db import transaction


class Command(BaseCommand):
    help = "Populate the database with comprehensive sample data for development"

    def handle(self, *args, **options):
        from populate_sample_data import reset_data, create_sample_data
        reset_data()
        create_sample_data()
        self.stdout.write(self.style.SUCCESS("Sample data populated successfully"))
