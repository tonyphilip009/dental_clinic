import re
import secrets
from datetime import time, timedelta

from django.core import mail
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import (
    Appointment,
    Dentist,
    DentistAvailability,
    DentistTimeOff,
    Service,
    EmailOTP,
)

from .otp import _hash


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

    # ---------- Day 30: verified token helper ----------

    def verified_token(
        self,
        email="test@example.com",
        verified_ago=timedelta(0),
    ):
        """Create a verified OTP row directly and return its raw token."""
        token = secrets.token_urlsafe(32)

        EmailOTP.objects.create(
            email=email,
            code_hash="0" * 64,
            expires_at=timezone.now() + timedelta(minutes=5),
            verified_at=timezone.now() - verified_ago,
            token_hash=_hash(token, "token"),
        )

        return token

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

        # Unless a test supplies its own token,
        # give it a valid verified token.
        if "verification_token" not in payload:
            payload["verification_token"] = self.verified_token(
                str(payload["email"]).strip().lower()
            )

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
            "time_slot",
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

    # ---------- Day 30: appointments require a verified email ----------

    def test_booking_without_token_rejected(self):
        payload = self.booking_payload()

        payload.pop("verification_token")

        r = self.client.post(
            APPOINTMENT_URL,
            payload,
            format="json",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "verification_token",
            r.json(),
        )

        self.assertEqual(
            Appointment.objects.count(),
            0,
        )

    def test_booking_with_made_up_token_rejected(self):
        r = self.post_booking(
            verification_token="not-a-real-token"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "verification_token",
            r.json(),
        )

        self.assertEqual(
            Appointment.objects.count(),
            0,
        )

    def test_token_for_another_email_rejected(self):
        token = self.verified_token(
            "someone.else@example.com"
        )

        r = self.post_booking(
            verification_token=token
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "verification_token",
            r.json(),
        )

    def test_expired_verification_rejected(self):
        token = self.verified_token(
            verified_ago=timedelta(minutes=20)
        )

        r = self.post_booking(
            verification_token=token
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "verification_token",
            r.json(),
        )

    def test_successful_booking_uses_up_the_token(self):
        token = self.verified_token()

        r = self.post_booking(
            verification_token=token
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

        otp = EmailOTP.objects.get(
            token_hash=_hash(token, "token")
        )

        self.assertIsNotNone(
            otp.consumed_at
        )

    def test_token_cannot_be_used_twice(self):
        token = self.verified_token()

        first = self.post_booking(
            verification_token=token
        )

        self.assertEqual(
            first.status_code,
            201,
            first.content,
        )

        second = self.post_booking(
            verification_token=token,
            time_slot="10:00",
        )

        self.assertEqual(
            second.status_code,
            400,
        )

        self.assertIn(
            "verification_token",
            second.json(),
        )

        self.assertEqual(
            Appointment.objects.count(),
            1,
        )

    def test_invalid_slot_does_not_use_up_the_token(self):
        token = self.verified_token()

        bad = self.post_booking(
            verification_token=token,
            time_slot="03:00",
        )

        self.assertEqual(
            bad.status_code,
            400,
        )

        good = self.post_booking(
            verification_token=token
        )

        self.assertEqual(
            good.status_code,
            201,
            good.content,
        )

    def test_duplicate_booking_does_not_use_up_the_token(self):
        self.assertEqual(
            self.post_booking().status_code,
            201,
        )

        token = self.verified_token()

        r = self.post_booking(
            verification_token=token
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "time_slot",
            r.json(),
        )

        otp = EmailOTP.objects.get(
            token_hash=_hash(token, "token")
        )

        self.assertIsNone(
            otp.consumed_at
        )

    def test_full_flow_wrong_otp_then_correct(self):
        cache.clear()

        email = "flow@example.com"

        self.client.post(
            "/api/otp/send/",
            {
                "email": email
            },
            format="json",
        )

        code = re.search(
            r"\b(\d{6})\b",
            mail.outbox[-1].body,
        ).group(1)

        wrong = (
            "000000"
            if code != "000000"
            else "111111"
        )

        r = self.client.post(
            "/api/otp/verify/",
            {
                "email": email,
                "code": wrong,
            },
            format="json",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        # No valid token yet, so booking is refused
        r = self.post_booking(
            email=email,
            verification_token="guess",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertEqual(
            Appointment.objects.count(),
            0,
        )

        r = self.client.post(
            "/api/otp/verify/",
            {
                "email": email,
                "code": code,
            },
            format="json",
        )

        self.assertEqual(
            r.status_code,
            200,
        )

        r = self.post_booking(
            email=email,
            verification_token=r.json()["token"],
        )

        self.assertEqual(
            r.status_code,
            201,
            r.content,
        )

        self.assertEqual(
            Appointment.objects.count(),
            1,
        )

    def test_full_flow_expired_otp_cannot_book(self):
        cache.clear()

        email = "late@example.com"

        self.client.post(
            "/api/otp/send/",
            {
                "email": email
            },
            format="json",
        )

        code = re.search(
            r"\b(\d{6})\b",
            mail.outbox[-1].body,
        ).group(1)

        EmailOTP.objects.update(
            expires_at=timezone.now()
            - timedelta(seconds=1)
        )

        r = self.client.post(
            "/api/otp/verify/",
            {
                "email": email,
                "code": code,
            },
            format="json",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertEqual(
            r.json()["code"],
            "expired",
        )

        r = self.post_booking(
            email=email,
            verification_token="guess",
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertEqual(
            Appointment.objects.count(),
            0,
        )


# ============================================================
# Day 29: Email OTP Tests
# ============================================================

class OTPTests(TestCase):

    def setUp(self):
        # Reset the rate limiter between tests
        cache.clear()

        self.client = APIClient()
        self.email = "patient@example.com"

    def send(self, email=None):
        return self.client.post(
            "/api/otp/send/",
            {
                "email": email or self.email
            },
            format="json",
        )

    def verify(self, code, email=None):
        return self.client.post(
            "/api/otp/verify/",
            {
                "email": email or self.email,
                "code": code,
            },
            format="json",
        )

    def last_code(self):
        return re.search(
            r"\b(\d{6})\b",
            mail.outbox[-1].body,
        ).group(1)

    def wrong_code(self):
        return (
            "000000"
            if self.last_code() != "000000"
            else "111111"
        )

    def age_codes(self, seconds=120):
        EmailOTP.objects.update(
            created_at=timezone.now()
            - timedelta(seconds=seconds)
        )

    def test_send_emails_a_six_digit_code(self):
        r = self.send()

        self.assertEqual(
            r.status_code,
            200,
        )

        self.assertEqual(
            len(mail.outbox),
            1,
        )

        self.assertEqual(
            mail.outbox[0].to,
            [self.email],
        )

        self.assertEqual(
            len(self.last_code()),
            6,
        )

    def test_send_rejects_invalid_email(self):
        r = self.send(
            "not-an-email"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertEqual(
            len(mail.outbox),
            0,
        )

    def test_code_is_stored_hashed(self):
        self.send()

        otp = EmailOTP.objects.get()

        self.assertEqual(
            len(otp.code_hash),
            64,
        )

        self.assertNotEqual(
            otp.code_hash,
            self.last_code(),
        )

    def test_resend_cooldown(self):
        self.assertEqual(
            self.send().status_code,
            200,
        )

        r = self.send()

        self.assertEqual(
            r.status_code,
            429,
        )

        self.assertEqual(
            r.json()["code"],
            "cooldown",
        )

        self.assertEqual(
            len(mail.outbox),
            1,
        )

        self.age_codes()

        self.assertEqual(
            self.send().status_code,
            200,
        )

        self.assertEqual(
            len(mail.outbox),
            2,
        )

    def test_hourly_send_limit(self):
        for _ in range(5):

            self.assertEqual(
                self.send().status_code,
                200,
            )

            self.age_codes()

        r = self.send()

        self.assertEqual(
            r.status_code,
            429,
        )

        self.assertEqual(
            r.json()["code"],
            "limit",
        )

    def test_correct_code_verifies_and_returns_token(self):
        self.send()

        r = self.verify(
            self.last_code()
        )

        self.assertEqual(
            r.status_code,
            200,
        )

        self.assertTrue(
            r.json()["verified"]
        )

        token = r.json()["token"]

        self.assertTrue(token)

        otp = EmailOTP.objects.get()

        self.assertIsNotNone(
            otp.verified_at
        )

        self.assertNotEqual(
            otp.token_hash,
            token,
        )

    def test_wrong_code_reports_attempts_left(self):
        self.send()

        r = self.verify(
            self.wrong_code()
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertEqual(
            r.json()["code"],
            "incorrect",
        )

        self.assertEqual(
            r.json()["attempts_left"],
            4,
        )

    def test_five_wrong_codes_lock_the_otp(self):
        self.send()

        good = self.last_code()
        wrong = self.wrong_code()

        for _ in range(5):

            r = self.verify(
                wrong
            )

            self.assertEqual(
                r.status_code,
                400,
            )

        self.assertEqual(
            r.json()["code"],
            "locked",
        )

        # Even the correct code no longer works
        r = self.verify(good)

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertEqual(
            r.json()["code"],
            "locked",
        )

    def test_expired_code_rejected(self):
        self.send()

        EmailOTP.objects.update(
            expires_at=timezone.now()
            - timedelta(seconds=1)
        )

        r = self.verify(
            self.last_code()
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertEqual(
            r.json()["code"],
            "expired",
        )

    def test_new_code_replaces_old_one(self):
        self.send()

        first = self.last_code()

        self.age_codes()

        self.send()

        second = self.last_code()

        if first == second:
            self.skipTest(
                "The two random codes happened to match"
            )

        self.assertEqual(
            self.verify(first).status_code,
            400,
        )

        self.assertEqual(
            self.verify(second).status_code,
            200,
        )

    def test_code_can_only_be_used_once(self):
        self.send()

        code = self.last_code()

        self.assertEqual(
            self.verify(code).status_code,
            200,
        )

        r = self.verify(code)

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertEqual(
            r.json()["code"],
            "none",
        )

    def test_verify_without_sending_first(self):
        r = self.verify(
            "123456"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertEqual(
            r.json()["code"],
            "none",
        )

    def test_malformed_code_rejected(self):
        self.send()

        r = self.verify(
            "abc"
        )

        self.assertEqual(
            r.status_code,
            400,
        )

        self.assertIn(
            "code",
            r.json(),
        )

    def test_email_is_case_insensitive(self):
        self.send(
            "Patient@Example.COM"
        )

        r = self.verify(
            self.last_code(),
            email="patient@example.com",
        )

        self.assertEqual(
            r.status_code,
            200,
        )
