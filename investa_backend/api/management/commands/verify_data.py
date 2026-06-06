from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Verify database connectivity and data integrity"

    def handle(self, *args, **options):
        from test.verify_data_connectivity import main
        main()
        self.stdout.write(self.style.SUCCESS("Data verification completed"))
