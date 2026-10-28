
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
from .otp import has_valid_verification


# =========================================================
# Image URL helper
# =========================================================

def get_image_url(image_field, known_images=None):
    """
    Return an existing mapped Cloudinary URL for legacy images.
    For new uploads, return the URL provided by Django storage.
    """
    if not image_field:
        return None

    filename = image_field.name.replace("\\", "/").rsplit("/", 1)[-1]

    if known_images and filename in known_images:
        return known_images[filename]

    try:
        return image_field.url
    except (ValueError, AttributeError):
        return None


# =========================================================
# Services
# =========================================================

class ServiceSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = "__all__"

    def get_image(self, obj):
        cloudinary_images = {
            "complete-dental-checkup.png": (
                "https://res.cloudinary.com/zzwvvvp2/image/upload/"
                "v1793119641/complete-dental-checkup.png"
            ),
            "teeth-cleaning.png": (
                "https://res.cloudinary.com/zzwvvvp2/image/upload/"
                "v1793119646/teeth-cleaning.png"
            ),
        }

        return get_image_url(obj.image, cloudinary_images)


# =========================================================
# Dentists
# =========================================================

class DentistSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Dentist
        fields = "__all__"

    def get_photo(self, obj):
        cloudinary_images = {
            "WhatsApp_Image_2026-07-09_at_11.28.18_AM.webp": (
                "https://res.cloudinary.com/zzwvvvp2/image/upload/"
                "v1793119366/WhatsApp_Image_2026-07-09_at_11.28.18_AM.webp"
            ),
            "WhatsApp_Image_2026-09-23_at_11.05.12_PM.webp": (
                "https://res.cloudinary.com/zzwvvvp2/image/upload/"
                "v1793119587/WhatsApp_Image_2026-09-23_at_11.05.12_PM.webp"
            ),
        }

        return get_image_url(obj.photo, cloudinary_images)


# =========================================================
# Testimonials
# =========================================================

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = "__all__"


# =========================================================
# Gallery
# =========================================================

class GallerySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Gallery
        fields = "__all__"

    def get_image(self, obj):
        cloudinary_images = {
            "Modern_Dental_Care_in_Action.webp": (
                "https://res.cloudinary.com/zzwvvvp2/image/upload/"
                "v1793119608/Modern_Dental_Care_in_Action.webp"
            ),
            "Modern_Dental_Suite_with_Panoramic_X-ray.webp": (
                "https://res.cloudinary.com/zzwvvvp2/image/upload/"
                "v1793119625/Modern_Dental_Suite_with_Panoramic_X-ray.webp"
            ),
            "Luxurious_House_of_Dental_Reception.webp": (
                "https://res.cloudinary.com/zzwvvvp2/image/upload/"
                "v1793119601/Luxurious_House_of_Dental_Reception.webp"
            ),
        }

        return get_image_url(obj.image, cloudinary_images)


# =========================================================
# Appointment validation
# =========================================================

NAME_PATTERN = re.compile(
    r"^[^\W\d_]+(?:[ .'’\-]+[^\W\d_]+)*\.?$"
)

MESSAGE_LIMIT = 500


class AppointmentSerializer(serializers.ModelSerializer):
    verification_token = serializers.CharField(
        write_only=True,
        error_messages={
            "required": "Please verify your email before booking.",
            "blank": "Please verify your email before booking.",
            "null": "Please verify your email before booking.",
        },
    )

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
            "verification_token",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]
        validators = []
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
            phone = phonenumbers.parse(value, None)
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

        if value > today + timedelta(days=BOOKING_WINDOW_DAYS):
            raise serializers.ValidationError(
                f"Appointments can only be booked up to "
                f"{BOOKING_WINDOW_DAYS} days in advance."
            )

        return value

    def validate(self, attrs):
        if not has_valid_verification(
            attrs["email"],
            attrs["verification_token"],
        ):
            raise serializers.ValidationError(
                {
                    "verification_token": (
                        "Your email verification is missing or "
                        "has expired. Please verify your email again."
                    )
                }
            )

        dentist = attrs.get("dentist")
        date = attrs.get("date")
        time_slot = attrs.get("time_slot")

        if not dentist or not date or not time_slot:
            return attrs

        available = get_available_slots(dentist, date)

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

    def create(self, validated_data):
        validated_data.pop("verification_token", None)
        return super().create(validated_data)


# =========================================================
# OTP serializers
# =========================================================

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
