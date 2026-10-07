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
    RATING_CHOICES = [
        (1, "1 Star"),
        (2, "2 Stars"),
        (3, "3 Stars"),
        (4, "4 Stars"),
        (5, "5 Stars"),
    ]

    patient_name = models.CharField(max_length=100)

    rating = models.IntegerField(
        choices=RATING_CHOICES,
        default=5
    )

    message = models.TextField()

    photo = models.ImageField(
        upload_to="testimonials/",
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.patient_name} - {self.rating} Stars"


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

    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    dentist = models.ForeignKey(
        Dentist,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="appointments"
    )

    preferred_date = models.DateField(
        null=True,
        blank=True
    )

    date = models.DateField(
        null=True,
        blank=True
    )

    time_slot = models.TimeField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("confirmed", "Confirmed"),
            ("cancelled", "Cancelled"),
        ],
        default="pending"
    )

    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["dentist", "date", "time_slot"],
                condition=models.Q(
                    status__in=["pending", "confirmed"]
                ),
                name="unique_active_dentist_slot"
            )
        ]

    def __str__(self):
        return f"{self.name} - {self.date or self.preferred_date}"

class DentistAvailability(models.Model):
    DAYS_OF_WEEK = [
        (0, "Monday"),
        (1, "Tuesday"),
        (2, "Wednesday"),
        (3, "Thursday"),
        (4, "Friday"),
        (5, "Saturday"),
        (6, "Sunday"),
    ]

    dentist = models.ForeignKey(
        Dentist,
        on_delete=models.CASCADE,
        related_name="availability"
    )
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_duration = models.PositiveIntegerField(default=30)

    def __str__(self):
        return f"{self.dentist.name} - {self.get_day_of_week_display()}"

class DentistTimeOff(models.Model):
    dentist = models.ForeignKey(
        Dentist,
        on_delete=models.CASCADE,
        related_name="time_off"
    )
    date = models.DateField()
    reason = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ("dentist", "date")

    def __str__(self):
        return f"{self.dentist.name} - {self.date}"

class EmailOTP(models.Model):
    email = models.EmailField(db_index=True)
    code_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    verified_at = models.DateTimeField(null=True, blank=True)
    token_hash = models.CharField(max_length=64, blank=True)
    consumed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"OTP for {self.email} at {self.created_at:%Y-%m-%d %H:%M}"