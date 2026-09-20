from django.contrib import admin
from .models import Service, Dentist, Testimonial, Gallery, Appointment


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)


@admin.register(Dentist)
class DentistAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'years_experience')
    search_fields = ('name', 'specialization')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('patient_name', 'message')


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_at')
    list_filter = ('uploaded_at',)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'service', 'preferred_date', 'created_at')
    list_filter = ('preferred_date', 'service', 'created_at')
    search_fields = ('name', 'phone', 'email')