import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


STATUS_LABELS = {
    "pending": "Awaiting clinic confirmation",
    "confirmed": "Confirmed",
    "cancelled": "Cancelled",
}


def appointment_reference(appointment):
    return f"HOD-{appointment.id:05d}"


def format_date(value):
    # "Monday, 12 October 2026"
    # Avoids %-d, which fails on Windows
    return f"{value:%A}, {value.day} {value:%B %Y}"


def format_time(value):
    # "9:30 AM"
    hour12 = value.hour % 12 or 12
    suffix = "AM" if value.hour < 12 else "PM"
    return f"{hour12}:{value.minute:02d} {suffix}"


def build_context(appointment):
    return {
        "first_name": appointment.name.split()[0],
        "reference": appointment_reference(appointment),
        "service": appointment.service.name,
        "dentist": appointment.dentist.name,
        "date": format_date(appointment.date),
        "time": format_time(appointment.time_slot),
        "status": STATUS_LABELS.get(
            appointment.status,
            appointment.status
        ),
        "message": appointment.message,
        "clinic": {
            "name": settings.CLINIC_NAME,
            "address": settings.CLINIC_ADDRESS,
            "phone": settings.CLINIC_PHONE,
            "email": settings.CLINIC_EMAIL,
            "hours": settings.CLINIC_HOURS,
        },
    }


def build_text(ctx):
    clinic = ctx["clinic"]

    lines = [
        f"Hello {ctx['first_name']},",
        "",
        f"Thank you for booking with {clinic['name']}. "
        "Here are your appointment details:",
        "",
        f"Reference: {ctx['reference']}",
        f"Service:   {ctx['service']}",
        f"Dentist:   {ctx['dentist']}",
        f"Date:      {ctx['date']}",
        f"Time:      {ctx['time']}",
        f"Status:    {ctx['status']}",
    ]

    if ctx["message"]:
        lines.append(f"Your message: {ctx['message']}")

    lines += [
        "",
        "Please arrive about 10 minutes early.",
        "To change or cancel, contact the clinic and quote your reference number.",
        "",
        clinic["name"],
        clinic["address"],
        f"Phone: {clinic['phone']}",
        f"Email: {clinic['email']}",
        "Opening hours:",
        clinic["hours"],
        "",
        "If you didn't make this booking, please contact us.",
    ]

    return "\n".join(lines)


def send_appointment_confirmation(appointment):
    """
    Email the patient their booking details.

    Never raises: it returns True when the email was sent and False otherwise,
    so a mail problem can never undo a booking that is already saved.
    """
    try:
        ctx = build_context(appointment)

        message = EmailMultiAlternatives(
            subject=f"Your appointment at {ctx['clinic']['name']} ({ctx['reference']})",
            body=build_text(ctx),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[appointment.email],
        )

        message.attach_alternative(
            render_to_string(
                "emails/appointment_confirmation.html",
                ctx
            ),
            "text/html",
        )

        message.send(fail_silently=False)

        return True

    except Exception:
        logger.exception(
            "Could not send confirmation email for appointment %s",
            appointment.pk,
        )
        return False