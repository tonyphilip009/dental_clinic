from datetime import datetime

from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics, serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Service, Dentist, Testimonial, Gallery, Appointment

from .serializers import (
    ServiceSerializer,
    DentistSerializer,
    TestimonialSerializer,
    GallerySerializer,
    AppointmentSerializer,
)

from .availability import get_available_slots


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
                    "time_slot": "Someone just booked this slot. "
                    "Please choose another."
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
                    "error": "Both 'dentist' and 'date' query parameters are required."
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