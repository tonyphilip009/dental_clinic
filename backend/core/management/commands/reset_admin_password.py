
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "List production staff usernames without changing accounts."

    def handle(self, *args, **options):
        User = get_user_model()

        staff_users = User.objects.filter(is_staff=True).order_by("username")

        if not staff_users.exists():
            self.stdout.write("No staff accounts found in this database.")
            return

        self.stdout.write("Production staff accounts:")

        for user in staff_users:
            self.stdout.write(
                f"Username: {user.username} | "
                f"Staff: {user.is_staff} | "
                f"Superuser: {user.is_superuser}"
            )
