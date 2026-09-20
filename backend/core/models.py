from django.db import models


class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='services/', blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Dentist(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='dentists/', blank=True, null=True)
    years_experience = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    patient_name = models.CharField(max_length=100)
    message = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)  # 1-5 stars
    photo = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} ({self.rating}★)"


class Gallery(models.Model):
    title = models.CharField(max_length=150, blank=True)
    image = models.ImageField(upload_to='gallery/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Gallery Image {self.id}"


class Appointment(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    preferred_date = models.DateField()
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.preferred_date}"