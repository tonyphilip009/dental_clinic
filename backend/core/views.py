from datetime import datetime, timedelta

from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics, serializers
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
    send_otp,
    verify_otp,
)


class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class ServiceDetailView(generics.RetrieveAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class DentistListView(generics.ListAPIView):
    queryset = Dentist.objects.all()
    serializer_class = DentistSerializer


class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class GalleryListView(generics.ListAPIView):
    queryset = Gallery.objects.all().order_by('-uploaded_at')
    serializer_class = GallerySerializer


class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                serializer.save()

        except IntegrityError:
            raise serializers.ValidationError(
                {
                    "time_slot": (
                        "Someone just booked this slot. "
                        "Please choose another."
                    )
                }
            )


class AvailabilityView(APIView):

    def get(self, request):

        dentist_id = request.query_params.get("dentist")
        date_str = request.query_params.get("date")

        # Check if both parameters are provided
        if not dentist_id or not date_str:
            return Response(
                {
                    "error": (
                        "Both 'dentist' and 'date' query parameters "
                        "are required."
                    )
                },
                status=400
            )

        # Convert dentist ID to integer
        try:
            dentist_id = int(dentist_id)

        except ValueError:
            return Response(
                {
                    "error": "Dentist id must be a number."
                },
                status=400
            )

        # Convert string date to Python date object
        try:
            date = datetime.strptime(
                date_str,
                "%Y-%m-%d"
            ).date()

        except ValueError:
            return Response(
                {
                    "error": "Date must be in YYYY-MM-DD format."
                },
                status=400
            )

        # Don't allow past dates
        if date < timezone.localdate():
            return Response(
                {
                    "error": "Date cannot be in the past."
                },
                status=400
            )

        # Don't allow dates more than booking window ahead
        if date > timezone.localdate() + timedelta(
            days=BOOKING_WINDOW_DAYS
        ):
            return Response(
                {
                    "error": (
                        f"Date cannot be more than "
                        f"{BOOKING_WINDOW_DAYS} days ahead."
                    )
                },
                status=400
            )

        # Find the dentist
        dentist = get_object_or_404(
            Dentist,
            pk=dentist_id
        )

        # Get available slots
        slots = get_available_slots(
            dentist,
            date
        )

        # Return the available slots
        return Response(
            {
                "dentist": dentist.id,
                "date": date_str,
                "available_slots": [
                    time.strftime("%H:%M")
                    for time in slots
                ],
            }
        )


# ============================================================
# Day 29 - Email OTP
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