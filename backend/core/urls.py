from django.urls import path

from .views import (
    ServiceListView,
    ServiceDetailView,
    DentistListView,
    TestimonialListView,
    GalleryListView,
    AppointmentCreateView,
    AvailabilityView,
    SendOTPView,
    VerifyOTPView,
)


urlpatterns = [
    # Services
    path(
        "services/",
        ServiceListView.as_view(),
        name="services"
    ),

    path(
        "services/<int:pk>/",
        ServiceDetailView.as_view(),
        name="service-detail"
    ),

    # Dentists
    path(
        "dentists/",
        DentistListView.as_view(),
        name="dentist list"
    ),

    # Testimonials
    path(
        "testimonials/",
        TestimonialListView.as_view(),
        name="testimonial list"
    ),

    # Gallery
    path(
        "gallery/",
        GalleryListView.as_view(),
        name="gallery list"
    ),

    # Appointments
    path(
        "appointments/",
        AppointmentCreateView.as_view(),
        name="appointment-create"
    ),

    # Availability
    path(
        "availability/",
        AvailabilityView.as_view(),
        name="availability"
    ),

    # Email OTP
    path(
        "otp/send/",
        SendOTPView.as_view(),
        name="otp-send"
    ),

    path(
        "otp/verify/",
        VerifyOTPView.as_view(),
        name="otp-verify"
    ),
]