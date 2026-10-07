import { useEffect, useRef, useState } from "react";

import {
  getErrorMessage,
  sendOtp,
  verifyOtp,
} from "../api";

import BookingSummary from "./BookingSummary";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

const CODE_LENGTH = 6;

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function OtpStep({
  service,
  dentist,
  date,
  timeSlot,
  patient,
  verification,
  onVerified,
  onBack,
}) {
  const email = patient.email;

  const alreadyVerified = Boolean(
    verification &&
      verification.email === email
  );

  // sending | ready | failed | done
  const [phase, setPhase] = useState(
    alreadyVerified ? "done" : "sending"
  );

  const [sendError, setSendError] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [locked, setLocked] = useState(false);

  const [expiresAt, setExpiresAt] = useState(null);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  const startedRef = useRef(false);

  // Tick once a second for the two countdowns
  useEffect(() => {
    const id = setInterval(
      () => setNow(Date.now()),
      1000
    );

    return () => clearInterval(id);
  }, []);

  const requestCode = async (isResend = false) => {
    setError("");
    setNotice("");

    if (isResend) {
      setResending(true);
    } else {
      setPhase("sending");
    }

    try {
      const result = await sendOtp(email);

      const sentAt = Date.now();

      setExpiresAt(
        sentAt + result.expires_in * 1000
      );

      setResendAt(
        sentAt + result.resend_in * 1000
      );

      setCode("");
      setLocked(false);
      setPhase("ready");

      if (isResend) {
        setNotice(
          "We've sent you a new code."
        );
      }
    } catch (err) {
      const data = err.response?.data;

      if (
        err.response?.status === 429 &&
        data?.code === "cooldown"
      ) {
        setResendAt(
          Date.now() +
            data.retry_after * 1000
        );

        setPhase("ready");

        setNotice(
          "We sent a code to your email a moment ago. Please use that one."
        );
      } else if (isResend) {
        setError(
          getErrorMessage(
            err,
            "We couldn't send a new code."
          )
        );
      } else {
        setSendError(
          getErrorMessage(
            err,
            "We couldn't send your verification code."
          )
        );

        setPhase("failed");
      }
    } finally {
      setResending(false);
    }
  };

  // Send the first code when this step opens
  const startVerification = () => {
    if (
      startedRef.current ||
      alreadyVerified
    ) {
      return;
    }

    startedRef.current = true;
    requestCode(false);
  };

  useEffect(() => {
    startVerification();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (code.length !== CODE_LENGTH) {
      return;
    }

    setVerifying(true);
    setError("");
    setNotice("");

    try {
      const result = await verifyOtp(
        email,
        code
      );

      onVerified({
        email,
        token: result.token,
      });

      setPhase("done");
    } catch (err) {
      const data = err.response?.data;

      setError(
        getErrorMessage(
          err,
          "We couldn't verify your code. Please try again."
        )
      );

      setCode("");

      if (
        data?.code === "locked" ||
        data?.code === "none"
      ) {
        setLocked(true);
      }

      if (data?.code === "expired") {
        setExpiresAt(Date.now());
      }
    } finally {
      setVerifying(false);
    }
  };

  const resendLeft = Math.max(
    0,
    Math.ceil(
      (resendAt - now) / 1000
    )
  );

  const expiresLeft =
    expiresAt === null
      ? null
      : Math.max(
          0,
          Math.ceil(
            (expiresAt - now) / 1000
          )
        );

  const expired =
    expiresAt !== null &&
    expiresLeft === 0;

  const mustResend =
    expired || locked;

  const summary = (
    <BookingSummary
      service={service}
      dentist={dentist}
      date={date}
      timeSlot={timeSlot}
      patient={patient}
    />
  );

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {summary}

      {phase === "sending" && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <Loading message="Sending your verification code..." />
        </div>
      )}

      {phase === "failed" && (
        <>
          <ErrorMessage
            message={sendError}
            onRetry={() =>
              requestCode(false)
            }
          />

          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-brand px-5 py-2 font-semibold text-brand transition hover:bg-brand-light/30"
            >
              ← Edit my details
            </button>
          </div>
        </>
      )}

      {phase === "ready" && (
        <form
          onSubmit={handleVerify}
          className="rounded-xl bg-white p-6 shadow-md"
        >
          <h2 className="text-2xl font-semibold text-brand-dark">
            Verify your email
          </h2>

          <p className="mt-2 text-gray-600">
            We've sent a 6-digit code to{" "}
            <span className="break-all font-semibold text-brand-dark">
              {email}
            </span>
            .
          </p>

          {expiresLeft !== null &&
            !expired && (
              <p className="mt-1 text-sm text-gray-500">
                The code expires in{" "}
                {formatCountdown(
                  expiresLeft
                )}
                .
              </p>
            )}

          {expired && (
            <p className="mt-1 text-sm font-medium text-red-600">
              Your code has expired. Please
              request a new one.
            </p>
          )}

          {import.meta.env.DEV && (
            <p className="mt-3 rounded-lg bg-yellow-50 p-2 text-xs text-yellow-800">
              Development mode: the code is
              printed in the terminal where
              Django is running.
            </p>
          )}

          <label
            htmlFor="otp-code"
            className="sr-only"
          >
            Verification code
          </label>

          <input
            id="otp-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={CODE_LENGTH}
            placeholder="123456"
            value={code}
            disabled={
              mustResend || verifying
            }
            onChange={(e) =>
              setCode(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, CODE_LENGTH)
              )
            }
            className="mt-5 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-gray-100"
          />

          {error && (
            <p
              className="mt-3 text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}

          {notice && (
            <p
              className="mt-3 text-sm text-green-700"
              role="status"
            >
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={
              code.length !== CODE_LENGTH ||
              mustResend ||
              verifying
            }
            className="mt-5 w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifying
              ? "Verifying..."
              : "Verify code"}
          </button>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-medium text-brand hover:underline"
            >
              ← Edit my details
            </button>

            <button
              type="button"
              onClick={() =>
                requestCode(true)
              }
              disabled={
                resendLeft > 0 ||
                resending
              }
              className="text-sm font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
            >
              {resending
                ? "Sending..."
                : resendLeft > 0
                ? `Resend code in ${resendLeft}s`
                : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {phase === "done" && (
        <div className="rounded-xl bg-white p-6 text-center shadow-md">
          <p className="text-5xl">✅</p>

          <h2 className="mt-3 text-2xl font-semibold text-brand-dark">
            Email verified
          </h2>

          <p className="mt-2 text-gray-600">
            Thank you. Your email address has
            been confirmed.
          </p>

          <p className="mt-2 text-gray-500">
            The next step creates your
            appointment.
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-5 rounded-lg border border-brand px-5 py-2 font-semibold text-brand transition hover:bg-brand-light/30"
          >
            ← Edit my details
          </button>
        </div>
      )}
    </div>
  );
}