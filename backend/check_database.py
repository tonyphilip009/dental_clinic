
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "clinic.settings")
django.setup()

from django.db import connection

try:
    connection.ensure_connection()
    print("Database engine:", connection.vendor)
    print("Database connection: SUCCESS")
except Exception as error:
    print("Database connection: FAILED")
    print("Error type:", type(error).__name__)
    raise
