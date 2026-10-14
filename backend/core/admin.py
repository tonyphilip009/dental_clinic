
from django.contrib import admin

from .emails import send_appointment_cancellation

from .models import (
    Service,
    Dentist,
    Testimonial,
    Gallery,
    Appointment,
    DentistAvailability,
    DentistTimeOff,
)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)


@admin.register(Dentist)
class DentistAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'years_experience')
    search_fields = ('name', 'specialization')


@admin.register(DentistAvailability)
class DentistAvailabilityAdmin(admin.ModelAdmin):
    list_display = (
        'dentist',
        'day_of_week',
        'start_time',
        'end_time',
        'slot_duration',
    )
    list_filter = ('dentist', 'day_of_week')
    search_fields = ('dentist__name',)


@admin.register(DentistTimeOff)
class DentistTimeOffAdmin(admin.ModelAdmin):
    list_display = (
        'dentist',
        'date',
        'reason',
    )
    list_filter = ('dentist', 'date')
    search_fields = ('dentist__name', 'reason')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'patient_name',
        'rating',
    )
    list_filter = ('rating',)
    search_fields = (
        'patient_name',
        'message',
    )


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_at')
    list_filter = ('uploaded_at',)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        'reference_display',
        'name',
        'phone',
        'dentist',
        'service',
        'date',
        'time_slot',
        'status',
        'cancelled_at',
        'created_at',
    )

    list_filter = (
        'dentist',
        'service',
        'status',
        'date',
    )

    search_fields = (
        'name',
        'phone',
        'email',
    )

    date_hierarchy = 'date'
    ordering = ('-date', 'time_slot')

    readonly_fields = (
        'created_at',
        'cancelled_at',
        'cancel_token_hash',
    )

    actions = [
        'confirm_selected',
        'cancel_selected',
    ]

    @admin.display(description='Reference')
    def reference_display(self, obj):
        return obj.reference

    @admin.action(description='Confirm selected appointments')
    def confirm_selected(self, request, queryset):
        count = 0

        # Never confirm a cancelled appointment.
        for appointment in queryset.exclude(status='cancelled'):
            appointment.status = 'confirmed'
            appointment.save()
            count += 1

        self.message_user(
            request,
            f'{count} appointment(s) confirmed.'
        )

    @admin.action(
        description='Cancel selected appointments (patients are emailed)'
    )
    def cancel_selected(self, request, queryset):
        count = 0

        # Exclude already-cancelled appointments to avoid
        # sending duplicate cancellation emails.
        for appointment in queryset.exclude(status='cancelled'):
            appointment.status = 'cancelled'
            appointment.save()

            send_appointment_cancellation(appointment)
            count += 1

        self.message_user(
            request,
            f'{count} appointment(s) cancelled.'
        )
