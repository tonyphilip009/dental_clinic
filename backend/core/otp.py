import hashlib
import hmac
import math
import secrets
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.crypto import constant_time_compare

from .models import EmailOTP


OTP_LENGTH = 6
OTP_LIFETIME = timedelta(minutes=5)
RESEND_COOLDOWN = timedelta(seconds=60)
MAX_ATTEMPTS = 5
MAX_SENDS_PER_HOUR = 5


class OTPError(Exception):
    """An expected failure whose message is safe to show the patient."""

    def __init__(self, message, status=400, **extra):
        super().__init__(message)
        self.status = status
        self.payload = {"error": message, **extra}


def _hash(value, purpose):
    return hmac.new(
        settings.SECRET_KEY.encode(),
        f"core.otp.{purpose}:{value}".encode(),
        hashlib.sha256,
    ).hexdigest()


def send_otp(email):
    now = timezone.now()

    # 1. Resend cooldown
    latest = EmailOTP.objects.filter(email=email).first()

    if latest:
        wait = (latest.created_at + RESEND_COOLDOWN - now).total_seconds()

        if wait > 0:
            seconds = math.ceil(wait)

            raise OTPError(
                f"Please wait {seconds} seconds before requesting another code.",
                status=429,
                code="cooldown",
                retry_after=seconds,
            )

    # 2. Hourly limit per email address
    sent_last_hour = EmailOTP.objects.filter(
        email=email,
        created_at__gte=now - timedelta(hours=1)
    ).count()

    if sent_last_hour >= MAX_SENDS_PER_HOUR:
        raise OTPError(
            "Too many codes have been requested for this email. "
            "Please try again in an hour.",
            status=429,
            code="limit",
            retry_after=3600,
        )

    # 3. Create the code and store only its hash
    code = "".join(
        secrets.choice("0123456789")
        for _ in range(OTP_LENGTH)
    )

    otp = EmailOTP.objects.create(
        email=email,
        code_hash=_hash(f"{email}:{code}", "code"),
        expires_at=now + OTP_LIFETIME,
    )

    # 4. Email it
    minutes = int(OTP_LIFETIME.total_seconds() // 60)

    try:
        send_mail(
            subject="Your House of Dental verification code",
            message=(
                "Hello,\n\n"
                f"Your House of Dental verification code is {code}.\n\n"
                f"It expires in {minutes} minutes. If you didn't request this "
                "code, you can safely ignore this email.\n\n"
                "House of Dental"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

    except Exception:
        otp.delete()

        raise OTPError(
            "We couldn't send your code right now. Please try again in a moment.",
            status=503,
            code="send_failed",
        )

    return {
        "expires_in": int(OTP_LIFETIME.total_seconds()),
        "resend_in": int(RESEND_COOLDOWN.total_seconds()),
    }


def verify_otp(email, code):
    now = timezone.now()

    # Newest code only
    otp = EmailOTP.objects.filter(email=email).first()

    if otp is None or otp.verified_at is not None:
        raise OTPError(
            "There is no active code for this email. Please request a new one.",
            code="none",
        )

    if now >= otp.expires_at:
        raise OTPError(
            "This code has expired. Please request a new one.",
            code="expired",
        )

    if otp.attempts >= MAX_ATTEMPTS:
        raise OTPError(
            "Too many incorrect attempts. Please request a new code.",
            code="locked",
        )

    expected = _hash(f"{email}:{code}", "code")

    if not constant_time_compare(otp.code_hash, expected):
        otp.attempts += 1
        otp.save(update_fields=["attempts"])

        left = MAX_ATTEMPTS - otp.attempts

        if left <= 0:
            raise OTPError(
                "Too many incorrect attempts. Please request a new code.",
                code="locked",
            )

        plural = "" if left == 1 else "s"

        raise OTPError(
            f"Incorrect code. {left} attempt{plural} left.",
            code="incorrect",
            attempts_left=left,
        )

    # Correct: mark verified and hand back a one-time token for Day 30
    token = secrets.token_urlsafe(32)

    otp.verified_at = now
    otp.token_hash = _hash(token, "token")

    otp.save(
        update_fields=["verified_at", "token_hash"]
    )

    return token