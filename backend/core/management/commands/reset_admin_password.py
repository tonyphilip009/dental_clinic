
import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create or update the production Django superuser."

    def handle(self, *args, **options):
        username = os.environ.get("ADMIN_USERNAME")
        password = os.environ.get("ADMIN_NEW_PASSWORD")

        if not username or not password:
            raise CommandError(
                "ADMIN_USERNAME and ADMIN_NEW_PASSWORD must be set."
            )

        if len(password) < 12:
            raise CommandError("Password must be at least 12 characters.")

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )

        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.set_password(password)
        user.save()

        action = "created" if created else "updated"
        self.stdout.write(
            self.style.SUCCESS(
                f"Production superuser '{username}' {action} successfully."
            )
        )
