from datetime import time, timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import (
    Appointment,
    Dentist,
    DentistAvailability,
    DentistTimeOff,
    Service,
)


# Change this if your appointment endpoint path is different
APPOINTMENT_URL = "/api/appointments/"


def next_weekday(weekday, min_days_ahead=7):
    """Return a future date that falls on the given weekday (0 = Monday)."""
    d = timezone.localdate() + timedelta(days=min_days_ahead)

    while d.weekday() != weekday:
        d += timedelta(days=1)

    return d


def items(response):
    """Works whether or not DRF pagination wraps the list in 'results'."""
    data = response.json()
    return data["results"] if isinstance(data, dict) else data


class BackendAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.service = Service.objects.create(
            name="Teeth Cleaning",
            description="Routine cleaning",
            price=500,
        )

        self.dentist = Dentist.objects.create(
            name="Dr. Test",
            specialization="General",
            bio="Bio",
            years_experience=5,
        )

        self.monday = next_weekday(0)
        self.sunday = next_weekday(6)

        DentistAvailability.objects.create(
            dentist=self.dentist,
            day_of_week=0,
            start_time=time(9, 0),
            end_time=time(12, 0),
            slot_duration=30,
        )

    def booking_payload(self, **overrides):
        payload = {
            "name": "Test Patient",

            # International E.164 format
            "phone": "+919876543210",

            "email": "test@example.com",
            "service": self.service.id,
            "dentist": self.dentist.id,
            "date": str(self.monday),
            "time_slot": "09:30",
            "message": "First visit",
        }

        payload.update(overrides)

        return payload

    def slots(self, date=None):
        date = date or self.monday

        r = self.client.get(
            f"/api/availability/?dentist={self.dentist.id}&date={date}"
        )

        return r.json().get("available_slots", [])

    # ---------- List endpoints ----------

    def test_services_list(self):
        r = self.client.get("/api/services/")

        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(items(r)), 1)

    def test_service_detail(self):
        r = self.client.get(
            f"/api/services/{self.service.id}/"
        )

        self.assertEqual(r.status_code, 200)

        self.assertEqual(
            r.json()["name"],
            "Teeth Cleaning",
        )

    def test_service_detail_not_found(self):
        r = self.client.get("/api/services/99999/")

        self.assertEqual(r.status_code, 404)

    def test_dentists_list(self):
        r = self.client.get("/api/dentists/")

        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(items(r)), 1)

    def test_testimonials_list(self):
        r = self.client.get("/api/testimonials/")

        self.assertEqual(r.status_code, 200)

    def test_gallery_list(self):
        r = self.client.get("/api/gallery/")

        self.assertEqual(r.status_code, 200)

    # ---------- Availability ----------

    def test_availability_returns_all_slots(self):
        self.assertEqual(
            self.slots(),
            [
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
            ],
        )

    def test_availability_empty_on_day_without_schedule(self):
        self.assertEqual(
            self.slots(self.sunday),
            [],
        )

    def test_availability_empty_on_time_off(self):
        DentistTimeOff.objects.create(
            dentist=self.dentist,
            date=self.monday,
        )

        self.assertEqual(
            self.slots(),
            [],
        )

    def test_availability_missing_params(self):
        r = self.client.get("/api/availability/")

        self.assertEqual(
            r.status_code,
            400,
        )

    def test_availability_bad_date_format(self):
        r = self.client.get(
            f"/api/availability/?dentist={self.dentist.id}&date=abc"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

    def test_availability_past_date(self):
        yesterday = (
            timezone.localdate()
            - timedelta(days=1)
        )

        r = self.client.get(
            f"/api/availability/?dentist={self.dentist.id}&date={yesterday}"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

    def test_availability_unknown_dentist(self):
        r = self.client.get(
            f"/api/availability/?dentist=99999&date={self.monday}"
        )

        self.assertEqual(
            r.status_code,
            404,
        )

    # ---------- Booking ----------

    def test_valid_booking(self):
        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(),
            format="json",
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

        self.assertEqual(
            r.json()["status"],
            "pending",
        )

        self.assertEqual(
            r.json()["phone"],
            "+919876543210",
        )

    def test_booked_slot_disappears_from_availability(self):
        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(),
            format="json",
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

        self.assertNotIn(
            "09:30",
            self.slots(),
        )

    def test_double_booking_rejected(self):
        first = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(),
            format="json",
        )

        self.assertEqual(
            first.status_code,
            201,
            first.content,
        )

        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(),
            format="json",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "non_field_errors",
            r.json(),
        )

    def test_cancelled_slot_can_be_rebooked(self):
        first = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(),
            format="json",
        )

        self.assertEqual(
            first.status_code,
            201,
            first.content,
        )

        Appointment.objects.update(
            status="cancelled"
        )

        self.assertIn(
            "09:30",
            self.slots(),
        )

        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(),
            format="json",
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

    def test_past_date_rejected(self):
        yesterday = str(
            timezone.localdate()
            - timedelta(days=1)
        )

        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(
                date=yesterday
            ),
            format="json",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

    def test_slot_outside_working_hours_rejected(self):
        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(
                time_slot="03:00"
            ),
            format="json",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

    def test_day_without_schedule_rejected(self):
        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(
                date=str(self.sunday)
            ),
            format="json",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

    def test_status_cannot_be_forced(self):
        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(
                status="confirmed"
            ),
            format="json",
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

        self.assertEqual(
            r.json()["status"],
            "pending",
        )

    def test_missing_required_fields_rejected(self):
        r = self.client.post(
            APPOINTMENT_URL,
            {"name": "Only Name"},
            format="json",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

    # ---------- Day 28: field validation ----------

    def post_booking(self, **overrides):
        return self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(**overrides),
            format="json",
        )

    def test_name_with_digits_rejected(self):
        r = self.post_booking(
            name="Tony123"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "name",
            r.json(),
        )

    def test_name_too_short_rejected(self):
        r = self.post_booking(
            name="A"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "name",
            r.json(),
        )

    def test_script_in_name_rejected(self):
        r = self.post_booking(
            name="<script>alert(1)</script>"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "name",
            r.json(),
        )

    def test_name_extra_spaces_cleaned(self):
        r = self.post_booking(
            name="  Priya    Nair "
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

        self.assertEqual(
            r.json()["name"],
            "Priya Nair",
        )

    def test_invalid_phone_rejected(self):
        # Generic malformed numbers only.
        # Country-specific invalid numbers are tested separately.
        bad_numbers = [
            "12345",
            "98765abcde",
            "98765432101234",
        ]

        for bad in bad_numbers:

            with self.subTest(phone=bad):

                r = self.post_booking(
                    phone=bad
                )

                self.assertEqual(
                    r.status_code,
                    400,
                    r.content,
                )

                self.assertIn(
                    "phone",
                    r.json(),
                )

    def test_indian_phone_is_normalised(self):
        cases = [
            (
                "+91 98765 43210",
                "09:00",
                "+919876543210",
            ),
            (
                "+91-98765-43211",
                "09:30",
                "+919876543211",
            ),
            (
                "+919876543212",
                "10:00",
                "+919876543212",
            ),
        ]

        for phone, slot, expected in cases:

            with self.subTest(phone=phone):

                r = self.post_booking(
                    phone=phone,
                    time_slot=slot,
                )

                self.assertEqual(
                    r.status_code,
                    201,
                    r.content,
                )

                self.assertEqual(
                    r.json()["phone"],
                    expected,
                )

    def test_uk_phone_is_normalised(self):
        r = self.post_booking(
            phone="+44 7123 456789",
            time_slot="10:30",
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

        self.assertEqual(
            r.json()["phone"],
            "+447123456789",
        )

    def test_invalid_indian_phone_rejected(self):
        bad_numbers = [
            # Indian landline-style number.
            "+91 12345 67890",

            # Another non-mobile Indian number.
            "+91 51234 56789",

            # Too short for an Indian mobile number.
            "+91 98765 4321",
        ]

        for phone in bad_numbers:

            with self.subTest(phone=phone):

                r = self.post_booking(
                    phone=phone,
                )

                self.assertEqual(
                    r.status_code,
                    400,
                    r.content,
                )

                self.assertIn(
                    "phone",
                    r.json(),
                )

    def test_invalid_uk_phone_rejected(self):
        bad_numbers = [
            # Too short.
            "+44 123",

            # Invalid length.
            "+44 712345678",

            # Excessively long.
            "+44 999999999999",
        ]

        for phone in bad_numbers:

            with self.subTest(phone=phone):

                r = self.post_booking(
                    phone=phone,
                )

                self.assertEqual(
                    r.status_code,
                    400,
                    r.content,
                )

                self.assertIn(
                    "phone",
                    r.json(),
                )

    def test_invalid_email_rejected(self):
        r = self.post_booking(
            email="not-an-email"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "email",
            r.json(),
        )

    def test_email_saved_lowercase(self):
        r = self.post_booking(
            email="Test@Example.COM"
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

        self.assertEqual(
            r.json()["email"],
            "test@example.com",
        )

    def test_message_too_long_rejected(self):
        r = self.post_booking(
            message="x" * 501
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "message",
            r.json(),
        )

    def test_blank_message_allowed(self):
        r = self.post_booking(
            message=""
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

    def test_date_too_far_ahead_rejected(self):
        far = str(
            timezone.localdate()
            + timedelta(days=61)
        )

        r = self.post_booking(
            date=far
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "date",
            r.json(),
        )

    def test_availability_date_too_far_ahead_rejected(self):
        far = (
            timezone.localdate()
            + timedelta(days=61)
        )

        r = self.client.get(
            f"/api/availability/?dentist={self.dentist.id}&date={far}"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

    def test_unknown_service_rejected(self):
        r = self.post_booking(
            service=99999
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "service",
            r.json(),
        )

    def test_unknown_dentist_rejected(self):
        r = self.post_booking(
            dentist=99999
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "dentist",
            r.json(),
        )