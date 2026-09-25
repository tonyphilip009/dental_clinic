from rest_framework import generics

from .models import Service, Dentist, Testimonial, Gallery, Appointment

from .serializers import (
    ServiceSerializer,
    DentistSerializer,
    TestimonialSerializer,
    GallerySerializer,
    AppointmentSerializer,
)


class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all().order_by('-created_at')
    serializer_class = ServiceSerializer


class DentistListView(generics.ListAPIView):
    queryset = Dentist.objects.all()
    serializer_class = DentistSerializer


class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.all().order_by('-created_at')
    serializer_class = TestimonialSerializer


class GalleryListView(generics.ListAPIView):
    queryset = Gallery.objects.all().order_by('-uploaded_at')
    serializer_class = GallerySerializer

class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer