from django.urls import path
from .views import (
    ServiceListView,
    DentistListView,
    TestimonialListView,
    GalleryListView,
)

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='service-list'),
    path('dentists/', DentistListView.as_view(), name='dentist-list'),
    path('testimonials/', TestimonialListView.as_view(), name='testimonial-list'),
    path('gallery/', GalleryListView.as_view(), name='gallery-list'),
]