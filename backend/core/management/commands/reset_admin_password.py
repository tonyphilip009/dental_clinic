import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Reset an existing staff user's password."

    def handle(self, *args, **options):
        username = os.environ.get("ADMIN_USERNAME")
        new_password = os.environ.get("ADMIN_NEW_PASSWORD")

        if not username or not new_password:
            raise CommandError(
                "Set ADMIN_USERNAME and ADMIN_NEW_PASSWORD "
                "in the environment."
            )

        if len(new_password) < 12:
            raise CommandError(
                "The new password must be at least 12 characters."
            )

        User = get_user_model()

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise CommandError(
                f"User '{username}' was not found in this database."
            )

        if not user.is_staff:
            raise CommandError(
                "The selected user is not a staff account."
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        self.stdout.write(
            self.style.SUCCESS(
                f"Password reset successfully for '{username}'."
            )
        )