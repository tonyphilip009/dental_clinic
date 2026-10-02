from django.contrib import admin
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
        'name',
        'phone',
        'dentist',
        'service',
        'date',
        'time_slot',
        'status',
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