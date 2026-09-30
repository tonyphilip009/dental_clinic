from django.utils import timezone
from rest_framework import serializers

from .availability import get_available_slots
from .models import Service, Dentist, Testimonial, Gallery, Appointment


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class DentistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dentist
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            "id",
            "name",
            "phone",
            "email",
            "service",
            "dentist",
            "date",
            "time_slot",
            "message",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError(
                "Appointment date cannot be in the past."
            )
        return value

    def validate(self, attrs):
        dentist = attrs["dentist"]
        date = attrs["date"]
        time_slot = attrs["time_slot"]

        available = get_available_slots(dentist, date)

        if time_slot not in available:
            raise serializers.ValidationError(
                {
                    "time_slot": "This time slot is not available. "
                    "Please choose another slot."
                }
            )

        return attrs