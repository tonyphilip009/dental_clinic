
from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.html import format_html

from .models import (
    Appointment,
    Dentist,
    DentistAvailability,
    DentistTimeOff,
    EmailOTP,
    Gallery,
    Service,
    Testimonial,
)


MAX_TREATMENT_STEPS = 5


class ServiceAdminForm(forms.ModelForm):
    benefits = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 4, "cols": 70}),
        help_text="Enter one benefit per line.",
    )

    aftercare = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 4, "cols": 70}),
        help_text="Enter one aftercare instruction per line.",
    )

    class Meta:
        model = Service
        exclude = ("treatment_steps",)

    # Create separate title and description inputs for each step.
    for step_number in range(1, MAX_TREATMENT_STEPS + 1):
        locals()[f"step_{step_number}_title"] = forms.CharField(
            required=False,
            label=f"Step {step_number} title",
            widget=forms.TextInput(attrs={"size": 70}),
        )

        locals()[f"step_{step_number}_description"] = forms.CharField(
            required=False,
            label=f"Step {step_number} description",
            widget=forms.Textarea(attrs={"rows": 2, "cols": 70}),
        )

    del step_number

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if not self.instance or not self.instance.pk:
            return

        self.initial["benefits"] = "\n".join(
            self.instance.benefits or []
        )

        self.initial["aftercare"] = "\n".join(
            self.instance.aftercare or []
        )

        # Load previously saved treatment steps into their separate fields.
        saved_steps = self.instance.treatment_steps or []

        for index, step in enumerate(
            saved_steps[:MAX_TREATMENT_STEPS],
            start=1,
        ):
            self.initial[f"step_{index}_title"] = step.get("title", "")
            self.initial[f"step_{index}_description"] = step.get(
                "description", ""
            )

    def clean_benefits(self):
        value = self.cleaned_data.get("benefits", "")
        return [
            line.strip()
            for line in value.splitlines()
            if line.strip()
        ]

    def clean_aftercare(self):
        value = self.cleaned_data.get("aftercare", "")
        return [
            line.strip()
            for line in value.splitlines()
            if line.strip()
        ]

    def clean(self):
        cleaned_data = super().clean()
        steps = []

        for number in range(1, MAX_TREATMENT_STEPS + 1):
            title = (
                cleaned_data.get(f"step_{number}_title") or ""
            ).strip()

            description = (
                cleaned_data.get(f"step_{number}_description") or ""
            ).strip()

            # An entirely empty step is allowed.
            if not title and not description:
                continue

            # If a step is started, both fields are required.
            if not title:
                self.add_error(
                    f"step_{number}_title",
                    "Enter a title for this step.",
                )

            if not description:
                self.add_error(
                    f"step_{number}_description",
                    "Enter a description for this step.",
                )

            if title and description:
                steps.append({
                    "title": title,
                    "description": description,
                })

        cleaned_data["prepared_treatment_steps"] = steps

        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)

        instance.benefits = self.cleaned_data.get("benefits", [])
        instance.aftercare = self.cleaned_data.get("aftercare", [])
        instance.treatment_steps = self.cleaned_data.get(
            "prepared_treatment_steps", []
        )

        if commit:
            instance.save()
            self.save_m2m()

        return instance


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    form = ServiceAdminForm

    list_display = (
        "name",
        "price",
        "image_preview",
        "created_at",
    )

    search_fields = ("name", "description")

    readonly_fields = ("image_preview", "created_at")

    fieldsets = (
        (
            "Basic service information",
            {
                "fields": (
                    "name",
                    "description",
                    "price",
                    "icon",
                    "image",
                    "image_preview",
                    "created_at",
                )
            },
        ),
        (
            "Treatment benefits",
            {
                "fields": ("benefits",),
            },
        ),
        (
            "Treatment steps",
            {
                "description": (
                    "Fill in the title and description for each step. "
                    "Leave unused steps empty. You can enter up to five steps."
                ),
                "fields": tuple(
                    field
                    for number in range(1, MAX_TREATMENT_STEPS + 1)
                    for field in (
                        f"step_{number}_title",
                        f"step_{number}_description",
                    )
                ),
            },
        ),
        (
            "Aftercare instructions",
            {
                "fields": ("aftercare",),
            },
        ),
    )

    @admin.display(description="Service image")
    def image_preview(self, obj):
        if obj and obj.image:
            return format_html(
                '<img src="{}" width="120" height="80" '
                'style="object-fit:cover;border-radius:8px;" />',
                obj.image.url,
            )

        return "No service image uploaded"


@admin.register(Dentist)
class DentistAdmin(admin.ModelAdmin):
    list_display = ("name", "specialization", "years_experience")
    search_fields = ("name", "specialization")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("patient_name", "rating")
    list_filter = ("rating",)
    search_fields = ("patient_name", "message")


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ("title", "uploaded_at")
    search_fields = ("title",)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "reference",
        "name",
        "service",
        "dentist",
        "date",
        "time_slot",
        "status",
        "created_at",
    )

    list_filter = ("status", "date", "service", "dentist")
    search_fields = ("name", "phone", "email")
    readonly_fields = ("cancelled_at", "cancel_token_hash")


@admin.register(DentistAvailability)
class DentistAvailabilityAdmin(admin.ModelAdmin):
    list_display = (
        "dentist",
        "day_of_week",
        "start_time",
        "end_time",
        "slot_duration",
    )

    list_filter = ("day_of_week", "dentist")


@admin.register(DentistTimeOff)
class DentistTimeOffAdmin(admin.ModelAdmin):
    list_display = ("dentist", "date", "reason")
    list_filter = ("date", "dentist")


@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "created_at",
        "expires_at",
        "attempts",
        "verified_at",
        "consumed_at",
    )

    search_fields = ("email",)

    readonly_fields = (
        "email",
        "code_hash",
        "created_at",
        "expires_at",
        "attempts",
        "verified_at",
        "token_hash",
        "consumed_at",
    )
