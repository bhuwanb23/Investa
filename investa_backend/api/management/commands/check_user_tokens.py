from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Verify user authentication tokens and their expiry status"

    def handle(self, *args, **options):
        from check_user_tokens import check_user_tokens
        check_user_tokens()
        self.stdout.write(self.style.SUCCESS("Token check completed"))
