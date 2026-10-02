from datetime import time, timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Appointment, Dentist, DentistAvailability, DentistTimeOff, Service

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
            name="Teeth Cleaning", description="Routine cleaning", price=500
        )
        self.dentist = Dentist.objects.create(
            name="Dr. Test", specialization="General", bio="Bio", years_experience=5
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
            "phone": "9876543210",
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
        r = self.client.get(f"/api/services/{self.service.id}/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["name"], "Teeth Cleaning")

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
            ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
        )

    def test_availability_empty_on_day_without_schedule(self):
        self.assertEqual(self.slots(self.sunday), [])

    def test_availability_empty_on_time_off(self):
        DentistTimeOff.objects.create(
            dentist=self.dentist,
            date=self.monday
        )
        self.assertEqual(self.slots(), [])

    def test_availability_missing_params(self):
        r = self.client.get("/api/availability/")
        self.assertEqual(r.status_code, 400)

    def test_availability_bad_date_format(self):
        r = self.client.get(f"/api/availability/?dentist={self.dentist.id}&date=abc")
        self.assertEqual(r.status_code, 400)

    def test_availability_past_date(self):
        yesterday = timezone.localdate() - timedelta(days=1)
        r = self.client.get(
            f"/api/availability/?dentist={self.dentist.id}&date={yesterday}"
        )
        self.assertEqual(r.status_code, 400)

    def test_availability_unknown_dentist(self):
        r = self.client.get(f"/api/availability/?dentist=99999&date={self.monday}")
        self.assertEqual(r.status_code, 404)

    # ---------- Booking ----------
    def test_valid_booking(self):
        r = self.client.post(APPOINTMENT_URL, self.booking_payload(), format="json")
        self.assertEqual(r.status_code, 201, r.content)
        self.assertEqual(r.json()["status"], "pending")

    def test_booked_slot_disappears_from_availability(self):
        self.client.post(APPOINTMENT_URL, self.booking_payload(), format="json")
        self.assertNotIn("09:30", self.slots())

    def test_double_booking_rejected(self):
        self.client.post(APPOINTMENT_URL, self.booking_payload(), format="json")
        r = self.client.post(APPOINTMENT_URL, self.booking_payload(), format="json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("non_field_errors", r.json())

    def test_cancelled_slot_can_be_rebooked(self):
        self.client.post(APPOINTMENT_URL, self.booking_payload(), format="json")
        Appointment.objects.update(status="cancelled")
        self.assertIn("09:30", self.slots())
        r = self.client.post(APPOINTMENT_URL, self.booking_payload(), format="json")
        self.assertEqual(r.status_code, 201, r.content)

    def test_past_date_rejected(self):
        yesterday = str(timezone.localdate() - timedelta(days=1))
        r = self.client.post(
            APPOINTMENT_URL, self.booking_payload(date=yesterday), format="json"
        )
        self.assertEqual(r.status_code, 400)

    def test_slot_outside_working_hours_rejected(self):
        r = self.client.post(
            APPOINTMENT_URL, self.booking_payload(time_slot="03:00"), format="json"
        )
        self.assertEqual(r.status_code, 400)

    def test_day_without_schedule_rejected(self):
        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(date=str(self.sunday)),
            format="json",
        )
        self.assertEqual(r.status_code, 400)

    def test_status_cannot_be_forced(self):
        r = self.client.post(
            APPOINTMENT_URL,
            self.booking_payload(status="confirmed"),
            format="json",
        )
        self.assertEqual(r.status_code, 201, r.content)
        self.assertEqual(r.json()["status"], "pending")

    def test_missing_required_fields_rejected(self):
        r = self.client.post(APPOINTMENT_URL, {"name": "Only Name"}, format="json")
        self.assertEqual(r.status_code, 400)