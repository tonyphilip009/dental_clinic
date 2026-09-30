from datetime import datetime, timedelta

from django.utils import timezone

from .models import Appointment, DentistAvailability, DentistTimeOff


def get_available_slots(dentist, date):

    # 1. Check if dentist has time off on this date
    if DentistTimeOff.objects.filter(
        dentist=dentist,
        date=date
    ).exists():
        return []

    # 2. Get dentist's schedule for this weekday
    schedules = DentistAvailability.objects.filter(
        dentist=dentist,
        day_of_week=date.weekday()
    )

    if not schedules.exists():
        return []

    # 3. Get already booked slots
    booked = set(
        Appointment.objects.filter(
            dentist=dentist,
            date=date
        )
        .exclude(status="cancelled")
        .values_list("time_slot", flat=True)
    )

    # 4. Generate slots
    slots = []

    for block in schedules:

        current = datetime.combine(
            date,
            block.start_time
        )

        end = datetime.combine(
            date,
            block.end_time
        )

        step = timedelta(
            minutes=block.slot_duration
        )

        while current + step <= end:

            if current.time() not in booked:
                slots.append(current.time())

            current += step

    # 5. If today, remove slots that have already passed
    now = timezone.localtime()

    if date == now.date():
        slots = [
            time for time in slots
            if time > now.time()
        ]

    return sorted(slots)