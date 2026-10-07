import re
from datetime import timedelta

import phonenumbers

from django.utils import timezone
from rest_framework import serializers

from .availability import (
    BOOKING_WINDOW_DAYS,
    get_available_slots,
)
from .models import (
    Service,
    Dentist,
    Testimonial,
    Gallery,
    Appointment,
)


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


NAME_PATTERN = re.compile(
    r"^[^\W\d_]+(?:[ .'’\-]+[^\W\d_]+)*\.?$"
)


MESSAGE_LIMIT = 500


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

        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]

        extra_kwargs = {
            "message": {
                "required": False,
                "allow_blank": True,
            },
        }

    def validate_name(self, value):
        value = " ".join(value.split())

        if len(value) < 2:
            raise serializers.ValidationError(
                "Please enter your full name."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Your name must be 100 characters or fewer."
            )

        if not NAME_PATTERN.match(value):
            raise serializers.ValidationError(
                "Names can only contain letters, spaces, "
                "apostrophes, hyphens and full stops."
            )

        return value

    def validate_phone(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Please enter your phone number."
            )

        try:
            phone = phonenumbers.parse(
                value,
                None,
            )

        except phonenumbers.NumberParseException:
            raise serializers.ValidationError(
                "Enter a valid international phone number "
                "including the country code."
            )

        if not phonenumbers.is_valid_number(phone):
            raise serializers.ValidationError(
                "Enter a valid phone number for the selected country."
            )

        region = phonenumbers.region_code_for_number(phone)

        # India:
        # Only accept valid Indian mobile numbers.
        if region == "IN":
            number_type = phonenumbers.number_type(phone)

            if number_type != phonenumbers.PhoneNumberType.MOBILE:
                raise serializers.ValidationError(
                    "Please enter a valid Indian mobile number."
                )

        return phonenumbers.format_number(
            phone,
            phonenumbers.PhoneNumberFormat.E164,
        )

    def validate_email(self, value):
        return value.strip().lower()

    def validate_message(self, value):
        value = value.strip()

        if len(value) > MESSAGE_LIMIT:
            raise serializers.ValidationError(
                f"Your message must be {MESSAGE_LIMIT} "
                "characters or fewer."
            )

        return value

    def validate_date(self, value):
        if value is None:
            return value

        today = timezone.localdate()

        if value < today:
            raise serializers.ValidationError(
                "Appointment date cannot be in the past."
            )

        if value > today + timedelta(
            days=BOOKING_WINDOW_DAYS
        ):
            raise serializers.ValidationError(
                f"Appointments can only be booked up to "
                f"{BOOKING_WINDOW_DAYS} days in advance."
            )

        return value

    def validate(self, attrs):
        dentist = attrs.get("dentist")
        date = attrs.get("date")
        time_slot = attrs.get("time_slot")

        if not dentist or not date or not time_slot:
            return attrs

        available = get_available_slots(
            dentist,
            date,
        )

        if time_slot not in available:
            raise serializers.ValidationError(
                {
                    "time_slot": (
                        "This time slot is not available. "
                        "Please choose another slot."
                    )
                }
            )

        return attrs


# ============================================================
# Day 29 - Email OTP Serializers
# ============================================================

class OTPSendSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)

    def validate_email(self, value):
        return value.strip().lower()


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    code = serializers.RegexField(
        r"^\d{6}$",
        error_messages={
            "invalid": "Enter the 6-digit code from your email."
        },
    )

    def validate_email(self, value):
        return value.strip().lower()