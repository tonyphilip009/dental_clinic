
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
VERIFICATION_LIFETIME = timedelta(minutes=15)
RESEND_COOLDOWN = timedelta(seconds=60)
MAX_ATTEMPTS = 5

# Maximum OTP requests per email within a rolling one-hour window.
# Can be overridden through OTP_MAX_SENDS_PER_HOUR in settings.py.
MAX_SENDS_PER_HOUR = getattr(
    settings,
    "OTP_MAX_SENDS_PER_HOUR",
    10,
)


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

    # 1. Enforce resend cooldown.
    latest = EmailOTP.objects.filter(email__iexact=email).first()

    if latest:
        wait = (
            latest.created_at + RESEND_COOLDOWN - now
        ).total_seconds()

        if wait > 0:
            seconds = math.ceil(wait)

            raise OTPError(
                f"Please wait {seconds} seconds before requesting another code.",
                status=429,
                code="cooldown",
                retry_after=seconds,
            )

    # 2. Enforce the hourly limit per email.
    sent_last_hour = EmailOTP.objects.filter(
        email__iexact=email,
        created_at__gte=now - timedelta(hours=1),
    ).count()

    if sent_last_hour >= MAX_SENDS_PER_HOUR:
        raise OTPError(
            "Too many codes have been requested for this email. "
            "Please try again later.",
            status=429,
            code="limit",
            retry_after=3600,
        )

    # 3. Generate a secure six-digit code.
    code = "".join(
        secrets.choice("0123456789")
        for _ in range(OTP_LENGTH)
    )

    # Store only the hash of the OTP.
    otp = EmailOTP.objects.create(
        email=email,
        code_hash=_hash(f"{email}:{code}", "code"),
        expires_at=now + OTP_LIFETIME,
    )

    # 4. Send the code by email.
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
        # Remove the record if the email could not be sent.
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

    # Only the newest OTP is valid.
    otp = EmailOTP.objects.filter(email__iexact=email).first()

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

    # Correct code: create a one-time verification token.
    token = secrets.token_urlsafe(32)

    otp.verified_at = now
    otp.token_hash = _hash(token, "token")

    otp.save(
        update_fields=["verified_at", "token_hash"]
    )

    return token


def _verification_queryset(email, token):
    return EmailOTP.objects.filter(
        email__iexact=email,
        token_hash=_hash(token, "token"),
        verified_at__isnull=False,
        consumed_at__isnull=True,
        verified_at__gte=timezone.now() - VERIFICATION_LIFETIME,
    )


def has_valid_verification(email, token):
    """True if this token proves a recent, unused verification."""
    return (
        bool(token)
        and _verification_queryset(email, token).exists()
    )


def consume_verification(email, token):
    """Mark a verification as used inside transaction.atomic()."""
    otp = (
        _verification_queryset(email, token)
        .select_for_update()
        .first()
    )

    if otp is None:
        raise OTPError(
            "Your email verification has expired or was already used. "
            "Please verify your email again.",
            code="verification_invalid",
        )

    otp.consumed_at = timezone.now()
    otp.save(update_fields=["consumed_at"])
