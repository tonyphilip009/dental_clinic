
from io import BytesIO
from pathlib import Path

from django.core.files.base import ContentFile
from PIL import Image, ImageOps


def optimize_upload(field_file, max_side, quality=80):
    """
    Resize a newly uploaded image and convert it to WebP.
    Already-saved files are not processed again.
    Small images are never enlarged.
    """
    if not field_file or getattr(field_file, "_committed", True):
        return

    field_file.seek(0)

    with Image.open(field_file) as original:
        image = ImageOps.exif_transpose(original)

        has_alpha = (
            image.mode in ("RGBA", "LA", "PA")
            or (
                image.mode == "P"
                and "transparency" in image.info
            )
        )

        image = image.convert("RGBA" if has_alpha else "RGB")

        image.thumbnail(
            (max_side, max_side),
            Image.Resampling.LANCZOS,
        )

        buffer = BytesIO()
        image.save(
            buffer,
            format="WEBP",
            quality=quality,
            method=6,
        )

    new_name = f"{Path(field_file.name).stem}.webp"

    field_file.save(
        new_name,
        ContentFile(buffer.getvalue()),
        save=False,
    )
