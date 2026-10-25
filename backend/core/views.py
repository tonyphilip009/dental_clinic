
from datetime import datetime, timedelta

from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics, serializers
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle

from .models import (
    Service,
    Dentist,
    Testimonial,
    Gallery,
    Appointment,
)

from .serializers import (
    ServiceSerializer,
    DentistSerializer,
    TestimonialSerializer,
    GallerySerializer,
    AppointmentSerializer,
    OTPSendSerializer,
    OTPVerifySerializer,
)

from .availability import (
    BOOKING_WINDOW_DAYS,
    get_available_slots,
)

from .otp import (
    OTPError,
    consume_verification,
    send_otp,
    verify_otp,
)

from .cancellation import (
    can_cancel,
    cancellation_summary,
    find_by_cancel_token,
    new_cancel_token,
)

from .emails import (
    send_appointment_cancellation,
    send_appointment_confirmation,
)


# ============================================================
# Services
# ============================================================

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class ServiceDetailView(generics.RetrieveAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


# ============================================================
# Dentists
# ============================================================

class DentistListView(generics.ListAPIView):
    queryset = Dentist.objects.all()
    serializer_class = DentistSerializer


# ============================================================
# Testimonials
# ============================================================

class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


# ============================================================
# Gallery
# ============================================================

class GalleryListView(generics.ListAPIView):
    queryset = Gallery.objects.all().order_by("-uploaded_at")
    serializer_class = GallerySerializer


# ============================================================
# Appointment Booking
# ============================================================

class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        data = serializer.validated_data

        # Generate a private cancellation token.
        # Only its hash is stored in the database.
        cancel_token, cancel_hash = new_cancel_token()

        try:
            # Consume email verification and create the
            # appointment inside one database transaction.
            with transaction.atomic():
                consume_verification(
                    data["email"],
                    data["verification_token"],
                )

                appointment = serializer.save(
                    cancel_token_hash=cancel_hash
                )

        except OTPError as error:
            raise serializers.ValidationError(
                {
                    "verification_token": error.payload["error"]
                }
            )

        except IntegrityError:
            raise serializers.ValidationError(
                {
                    "time_slot": (
                        "Someone just booked this slot. "
                        "Please choose another."
                    )
                }
            )

        # Email failure must not undo the saved appointment.
        self.email_sent = send_appointment_confirmation(
            appointment,
            cancel_token,
        )

    def create(self, request, *args, **kwargs):
        response = super().create(
            request,
            *args,
            **kwargs,
        )

        response.data["email_sent"] = getattr(
            self,
            "email_sent",
            False,
        )

        return response


# ============================================================
# Appointment Availability
# ============================================================

class AvailabilityView(APIView):
    """
    Return available time slots for a dentist on a selected date.
    """

    def get(self, request):
        dentist_id = request.query_params.get("dentist")
        date_str = request.query_params.get("date")

        if not dentist_id or not date_str:
            return Response(
                {
                    "error": (
                        "Both 'dentist' and 'date' query parameters "
                        "are required."
                    )
                },
                status=400,
            )

        try:
            dentist_id = int(dentist_id)
        except (TypeError, ValueError):
            return Response(
                {"error": "Dentist id must be a number."},
                status=400,
            )

        try:
            appointment_date = datetime.strptime(
                date_str,
                "%Y-%m-%d",
            ).date()
        except ValueError:
            return Response(
                {"error": "Date must be in YYYY-MM-DD format."},
                status=400,
            )

        today = timezone.localdate()

        if appointment_date < today:
            return Response(
                {"error": "Date cannot be in the past."},
                status=400,
            )

        if appointment_date > today + timedelta(
            days=BOOKING_WINDOW_DAYS
        ):
            return Response(
                {
                    "error": (
                        f"Date cannot be more than "
                        f"{BOOKING_WINDOW_DAYS} days ahead."
                    )
                },
                status=400,
            )

        dentist = get_object_or_404(
            Dentist,
            pk=dentist_id,
        )

        slots = get_available_slots(
            dentist,
            appointment_date,
        )

        return Response(
            {
                "dentist": dentist.id,
                "date": appointment_date.isoformat(),
                "available_slots": [
                    slot.strftime("%H:%M")
                    for slot in slots
                ],
            }
        )


# ============================================================
# Available Dates for the Booking Calendar
# ============================================================

class AvailableDatesView(APIView):
    """
    Return dates that have at least one available time slot
    for the selected dentist within the booking window.
    """

    def get(self, request):
        dentist_id = request.query_params.get("dentist")

        if not dentist_id:
            return Response(
                {
                    "error": (
                        "The 'dentist' query parameter is required."
                    )
                },
                status=400,
            )

        try:
            dentist_id = int(dentist_id)
        except (TypeError, ValueError):
            return Response(
                {"error": "Dentist id must be a number."},
                status=400,
            )

        dentist = get_object_or_404(
            Dentist,
            pk=dentist_id,
        )

        today = timezone.localdate()
        available_dates = []

        # Check today and every date in the booking window.
        for offset in range(BOOKING_WINDOW_DAYS + 1):
            appointment_date = today + timedelta(days=offset)

            slots = get_available_slots(
                dentist,
                appointment_date,
            )

            # Include only dates with at least one available slot.
            if slots:
                available_dates.append(
                    appointment_date.isoformat()
                )

        return Response(
            {
                "dentist": dentist.id,
                "available_dates": available_dates,
            }
        )


# ============================================================
# Email OTP
# ============================================================

class SendOTPView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "otp_send"

    def post(self, request):
        serializer = OTPSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = send_otp(
                serializer.validated_data["email"]
            )
        except OTPError as error:
            return Response(
                error.payload,
                status=error.status,
            )

        return Response(result)


class VerifyOTPView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "otp_verify"

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            token = verify_otp(
                serializer.validated_data["email"],
                serializer.validated_data["code"],
            )
        except OTPError as error:
            return Response(
                error.payload,
                status=error.status,
            )

        return Response(
            {
                "verified": True,
                "token": token,
            }
        )


# ============================================================
# Appointment Cancellation
# ============================================================

class AppointmentCancelView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "cancel"

    def get_appointment(self, token):
        appointment = find_by_cancel_token(token)

        if appointment is None:
            raise NotFound(
                "This cancellation link isn't valid."
            )

        return appointment

    def get(self, request, token):
        appointment = self.get_appointment(token)

        return Response(
            cancellation_summary(appointment)
        )

    def post(self, request, token):
        appointment = self.get_appointment(token)

        # Repeated cancellation is harmless.
        # Do not send another cancellation email.
        if appointment.status == "cancelled":
            return Response(
                {
                    **cancellation_summary(appointment),
                    "already_cancelled": True,
                }
            )

        allowed, reason = can_cancel(appointment)

        if not allowed:
            return Response(
                {
                    "error": reason,
                    "code": "too_late",
                },
                status=400,
            )

        appointment.status = "cancelled"
        appointment.save()

        send_appointment_cancellation(appointment)

        return Response(
            {
                **cancellation_summary(appointment),
                "already_cancelled": False,
            }
        )
