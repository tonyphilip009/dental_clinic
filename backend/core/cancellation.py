
import secrets
from datetime import datetime, timedelta

from django.conf import settings
from django.utils import timezone
from django.utils.crypto import salted_hmac

from .models import Appointment


def _hash(token):
    return salted_hmac("core.cancel", token).hexdigest()


def new_cancel_token():
    """Return the raw token and its hash.

    Only the hash is stored in the database.
    The raw token is sent through the patient's email.
    """
    token = secrets.token_urlsafe(32)
    return token, _hash(token)


def cancel_url(token):
    return (
        f"{settings.FRONTEND_URL.rstrip('/')}"
        f"/cancel/{token}"
    )


def find_by_cancel_token(token):
    """Find the appointment associated with a cancellation token."""
    if not token:
        return None

    return (
        Appointment.objects.select_related("service", "dentist")
        .filter(cancel_token_hash=_hash(token))
        .first()
    )


def appointment_start(appointment):
    """Return the appointment's start datetime."""
    naive = datetime.combine(
        appointment.date,
        appointment.time_slot
    )
    return timezone.make_aware(
        naive,
        timezone.get_current_timezone()
    )


def can_cancel(appointment):
    """Return (allowed, reason)."""
    if appointment.status == "cancelled":
        return False, "This appointment has already been cancelled."

    hours = settings.CANCELLATION_MIN_NOTICE_HOURS

    deadline = appointment_start(appointment) - timedelta(
        hours=hours
    )

    if timezone.now() >= deadline:
        if hours:
            return False, (
                f"Appointments can only be cancelled online at least "
                f"{hours} hours before they start. Please contact "
                f"the clinic."
            )

        return False, "This appointment has already taken place."

    return True, ""


def cancellation_summary(appointment):
    """Return appointment details without private contact information."""
    allowed, reason = can_cancel(appointment)

    return {
        "reference": appointment.reference,
        "status": appointment.status,
        "first_name": appointment.name.split()[0],
        "service": appointment.service.name,
        "dentist": appointment.dentist.name,
        "date": appointment.date.isoformat(),
        "time_slot": appointment.time_slot.strftime("%H:%M"),
        "can_cancel": allowed,
        "reason": reason,
    }
