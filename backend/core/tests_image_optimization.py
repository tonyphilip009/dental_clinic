
import shutil
import tempfile
from io import BytesIO
from pathlib import Path

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image

from .models import Dentist, Gallery, Testimonial


class ImageOptimizationTests(TestCase):
    def setUp(self):
        self.temp_media = tempfile.mkdtemp()
        self.settings_override = override_settings(
            MEDIA_ROOT=self.temp_media
        )
        self.settings_override.enable()
        self.addCleanup(self.settings_override.disable)
        self.addCleanup(
            lambda: shutil.rmtree(self.temp_media, ignore_errors=True)
        )

    def make_image(self, size=(3000, 2000), name="photo.png"):
        buffer = BytesIO()
        Image.new("RGB", size, (30, 140, 130)).save(
            buffer,
            format="PNG",
        )
        return SimpleUploadedFile(
            name,
            buffer.getvalue(),
            content_type="image/png",
        )

    def assert_webp_and_max_size(self, field_file, max_side):
        self.assertTrue(field_file.name.lower().endswith(".webp"))

        with Image.open(field_file.path) as saved:
            self.assertEqual(saved.format, "WEBP")
            self.assertLessEqual(max(saved.size), max_side)

    def test_gallery_image_is_optimized(self):
        gallery = Gallery.objects.create(
            title="Test Gallery",
            image=self.make_image(),
        )
        self.assert_webp_and_max_size(gallery.image, 1600)

    def test_dentist_photo_is_optimized(self):
        dentist = Dentist.objects.create(
            name="Test Dentist",
            specialization="General Dentistry",
            bio="Test profile",
            years_experience=1,
            photo=self.make_image(),
        )
        self.assert_webp_and_max_size(dentist.photo, 800)

    def test_testimonial_photo_is_optimized(self):
        testimonial = Testimonial.objects.create(
            patient_name="Test Patient",
            message="Test review",
            rating=5,
            photo=self.make_image(),
        )
        self.assert_webp_and_max_size(testimonial.photo, 300)

    def test_small_images_are_not_enlarged(self):
        gallery = Gallery.objects.create(
            title="Small Image",
            image=self.make_image(size=(400, 300)),
        )

        with Image.open(gallery.image.path) as saved:
            self.assertEqual(saved.size, (400, 300))

    def test_saving_record_again_does_not_reprocess_image(self):
        gallery = Gallery.objects.create(
            title="Original",
            image=self.make_image(),
        )
        original_name = gallery.image.name

        gallery.title = "Updated Title"
        gallery.save()

        self.assertEqual(gallery.image.name, original_name)
