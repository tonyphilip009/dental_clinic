
from pathlib import Path

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from core.models import Dentist, Gallery, Testimonial


TARGETS = [
    (Dentist, "photo"),
    (Testimonial, "photo"),
    (Gallery, "image"),
]


class Command(BaseCommand):
    help = "Optimize existing dentist, testimonial, and gallery images"

    def handle(self, *args, **options):
        converted = 0

        for model, field_name in TARGETS:
            for obj in model.objects.all():
                image_field = getattr(obj, field_name)

                if not image_field:
                    continue

                if image_field.name.lower().endswith(".webp"):
                    continue

                original_name = image_field.name

                try:
                    image_field.open("rb")
                    image_data = image_field.read()
                    image_field.close()
                except (FileNotFoundError, OSError) as exc:
                    self.stderr.write(
                        self.style.WARNING(
                            f"Could not read {model.__name__} "
                            f"{obj.pk}: {original_name} ({exc})"
                        )
                    )
                    continue

                setattr(
                    obj,
                    field_name,
                    ContentFile(
                        image_data,
                        name=Path(original_name).name,
                    ),
                )

                obj.save()
                converted += 1

                self.stdout.write(
                    f"Optimized {model.__name__} {obj.pk}"
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Finished. Optimized {converted} image(s)."
            )
        )
