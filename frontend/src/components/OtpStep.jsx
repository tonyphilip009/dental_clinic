
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  getErrorMessage,
  sendOtp,
  verifyOtp,
} from "../api";

import BookingSummary from "./BookingSummary";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import AnimatedCheck from "./ui/AnimatedCheck";

const CODE_LENGTH = 6;

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getApiMessage(data, fallback) {
  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;

  return fallback;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const cardClass =
  "w-full overflow-hidden rounded-2xl border border-[#E7DCC7] bg-white shadow-[0_10px_30px_rgba(70,53,25,0.07)]";

const headingClass = "text-[#29251D]";

const mutedTextClass = "text-[#756B5D]";

const goldTextClass = "text-[#A97813]";

const secondaryButtonClass =
  "rounded-xl border border-[#D8C9A9] bg-white px-5 py-3 text-sm font-medium text-[#393329] transition hover:border-[#D5A637] hover:bg-[#F7F3EA]";

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
    verification && verification.email === email
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
  const requestInProgressRef = useRef(false);
  const verifyInProgressRef = useRef(false);

  // Update countdowns once per second.
  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  const requestCode = async (isResend = false) => {
    // Prevent duplicate requests from repeated clicks or effects.
    if (requestInProgressRef.current) return;

    if (isResend && Date.now() < resendAt) return;

    requestInProgressRef.current = true;

    setError("");
    setNotice("");

    if (isResend) {
      setResending(true);
    } else {
      setPhase("sending");
      setSendError("");
    }

    try {
      const result = await sendOtp(email);
      const sentAt = Date.now();

      const expiresIn = Number(result?.expires_in);
      const resendIn = Number(result?.resend_in);

      setExpiresAt(
        Number.isFinite(expiresIn) && expiresIn > 0
          ? sentAt + expiresIn * 1000
          : null
      );

      setResendAt(
        Number.isFinite(resendIn) && resendIn > 0
          ? sentAt + resendIn * 1000
          : 0
      );

      setCode("");
      setLocked(false);
      setPhase("ready");

      if (isResend) {
        setNotice("We've sent you a new code.");
      }
    } catch (err) {
      const data = err.response?.data;
      const status = err.response?.status;

      if (status === 429) {
        const retryAfter = Number(data?.retry_after);

        if (Number.isFinite(retryAfter) && retryAfter > 0) {
          setResendAt(Date.now() + retryAfter * 1000);
        }

        const message = getApiMessage(
          data,
          "Too many verification requests. Please wait before requesting another code."
        );

        if (isResend) {
          setError(message);
        } else if (data?.code === "cooldown") {
          // A code may already have been sent successfully.
          setPhase("ready");
          setNotice(message);
        } else {
          setSendError(message);
          setPhase("failed");
        }
      } else if (isResend) {
        setError(
          getErrorMessage(err, "We couldn't send a new code.")
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
      requestInProgressRef.current = false;
      setResending(false);
    }
  };

  // Send the first code when this step opens.
  useEffect(() => {
    if (startedRef.current || alreadyVerified) return;

    startedRef.current = true;
    void requestCode(false);

    // Run once when this step mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (event) => {
    event.preventDefault();

    if (
      code.length !== CODE_LENGTH ||
      verifying ||
      verifyInProgressRef.current ||
      mustResend
    ) {
      return;
    }

    verifyInProgressRef.current = true;
    setVerifying(true);
    setError("");
    setNotice("");

    try {
      const result = await verifyOtp(email, code);

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

      if (data?.code === "locked" || data?.code === "none") {
        setLocked(true);
      }

      if (data?.code === "expired") {
        setExpiresAt(Date.now());
      }
    } finally {
      verifyInProgressRef.current = false;
      setVerifying(false);
    }
  };

  const resendLeft = Math.max(
    0,
    Math.ceil((resendAt - now) / 1000)
  );

  const expiresLeft =
    expiresAt === null
      ? null
      : Math.max(0, Math.ceil((expiresAt - now) / 1000));

  const expired = expiresAt !== null && expiresLeft === 0;
  const mustResend = expired || locked;

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
    <motion.div
      className="mx-auto w-full max-w-4xl space-y-6"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      {/* Appointment summary */}
      <div className="w-full">{summary}</div>

      <AnimatePresence mode="wait">
        {/* Sending state */}
        {phase === "sending" && (
          <motion.div
            key="sending"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className={`${cardClass} p-6 sm:p-8`}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#E7DCC7] bg-[#F7F3EA]">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
                className="text-2xl text-[#A97813]"
                aria-hidden="true"
              >
                ✉
              </motion.span>
            </div>

            <h2 className={`text-2xl font-semibold ${headingClass}`}>
              Preparing your verification
            </h2>

            <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
              We're sending a secure verification code to your email.
            </p>

            <div className="mt-6">
              <Loading message="Sending your verification code..." />
            </div>
          </motion.div>
        )}

        {/* Failed state */}
        {phase === "failed" && (
          <motion.div
            key="failed"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className={`${cardClass} space-y-5 p-6 sm:p-8`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 text-2xl text-red-600">
              !
            </div>

            <h2 className={`text-2xl font-semibold ${headingClass}`}>
              Verification code not sent
            </h2>

            <p className={`text-sm leading-6 ${mutedTextClass}`}>
              We couldn't send your code. Please review the message below.
            </p>

            <ErrorMessage
              message={sendError}
              onRetry={() => requestCode(false)}
            />

            <button
              type="button"
              onClick={onBack}
              className={secondaryButtonClass}
            >
              ← Edit my details
            </button>
          </motion.div>
        )}

        {/* Verification form */}
        {phase === "ready" && (
          <motion.form
            key="ready"
            onSubmit={handleVerify}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className={cardClass}
          >
            {/* Verification header */}
            <div className="border-b border-[#E7DCC7] bg-[#F7F3EA] p-6 sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D8C9A9] bg-white text-2xl text-[#A97813]">
                <span aria-hidden="true">✉</span>
              </div>

              <p
                className={`mt-5 text-xs font-semibold uppercase tracking-[0.25em] ${goldTextClass}`}
              >
                Email verification
              </p>

              <h2
                className={`mt-2 text-3xl font-semibold tracking-tight ${headingClass}`}
              >
                One last security check
              </h2>

              <p className={`mt-3 text-sm leading-6 ${mutedTextClass}`}>
                Enter the six-digit code we sent to your email address.
              </p>

              <p className="mt-3 break-all rounded-xl border border-[#E7DCC7] bg-white px-4 py-3 text-sm font-medium text-[#393329]">
                {email}
              </p>
            </div>

            {/* Verification fields */}
            <div className="space-y-5 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="otp-code"
                  className="text-sm font-medium text-[#393329]"
                >
                  Verification code
                </label>

                {expiresLeft !== null && !expired && (
                  <span className="rounded-full border border-[#E7DCC7] bg-[#F7F3EA] px-3 py-1 text-xs font-medium tabular-nums text-[#A97813]">
                    Expires in {formatCountdown(expiresLeft)}
                  </span>
                )}
              </div>

              <motion.div
                animate={error ? { x: [0, -5, 5, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.35 }}
              >
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={CODE_LENGTH}
                  placeholder="••••••"
                  value={code}
                  disabled={mustResend || verifying}
                  onChange={(event) =>
                    setCode(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, CODE_LENGTH)
                    )
                  }
                  aria-describedby={error ? "otp-error" : undefined}
                  className="w-full rounded-xl border border-[#D8C9A9] bg-white px-3 py-4 text-center text-2xl font-semibold tracking-[0.45em] text-[#29251D] outline-none transition placeholder:text-[#C2B8A6] focus:border-[#D5A637] focus:ring-2 focus:ring-[#D5A637]/20 disabled:cursor-not-allowed disabled:bg-[#F7F3EA] disabled:opacity-60 sm:text-3xl sm:tracking-[0.7em]"
                />
              </motion.div>

              <div className="flex items-center justify-between text-xs text-[#938A7C]">
                <span>6 digits required</span>
                <span className="tabular-nums">
                  {code.length}/{CODE_LENGTH}
                </span>
              </div>

              {expired && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  role="alert"
                >
                  Your code has expired. Please request a new one.
                </motion.p>
              )}

              {locked && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  role="alert"
                >
                  Verification is locked or the code is no longer available.
                  Request a new code to continue.
                </motion.p>
              )}

              {import.meta.env.DEV && (
                <p className="rounded-xl border border-[#E7DCC7] bg-[#F7F3EA] p-3 text-xs leading-5 text-[#756B5D]">
                  Development mode: the code is printed in the terminal where
                  Django is running.
                </p>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    id="otp-error"
                    role="alert"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    {error}
                  </motion.p>
                )}

                {notice && (
                  <motion.p
                    role="status"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
                  >
                    {notice}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={
                  code.length !== CODE_LENGTH ||
                  mustResend ||
                  verifying
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D5A637] px-6 py-3.5 font-semibold text-[#29251D] shadow-lg shadow-[#D5A637]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#E4BC58] hover:shadow-[#D5A637]/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {verifying ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      aria-hidden="true"
                    >
                      ◌
                    </motion.span>
                    Verifying code...
                  </>
                ) : (
                  <>
                    Verify and continue
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E7DCC7] pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm font-medium text-[#756B5D] transition hover:text-[#A97813]"
                >
                  ← Edit my details
                </button>

                <button
                  type="button"
                  onClick={() => requestCode(true)}
                  disabled={resendLeft > 0 || resending}
                  className="text-sm font-medium text-[#A97813] transition hover:text-[#805A0D] disabled:cursor-not-allowed disabled:text-[#BDB4A6]"
                >
                  {resending
                    ? "Sending new code..."
                    : resendLeft > 0
                      ? `Resend code in ${resendLeft}s`
                      : "Resend verification code"}
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* Verification successful */}
        {phase === "done" && (
          <motion.div
            key="done"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className={`${cardClass} text-center`}
          >
            <div className="bg-gradient-to-b from-[#F7F3EA] to-white px-6 pb-8 pt-8 sm:px-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#E7DCC7] bg-[#F7F3EA]">
                <AnimatedCheck />
              </div>

              <p
                className={`mt-6 text-xs font-semibold uppercase tracking-[0.25em] ${goldTextClass}`}
              >
                Verification complete
              </p>

              <h2 className={`mt-3 text-3xl font-semibold ${headingClass}`}>
                Email verified
              </h2>

              <p
                className={`mx-auto mt-3 max-w-sm text-sm leading-6 ${mutedTextClass}`}
              >
                Thank you. Your email address has been confirmed successfully.
              </p>

              <div className="mx-auto mt-5 max-w-sm break-all rounded-xl border border-[#E7DCC7] bg-white px-4 py-3 text-sm text-[#393329]">
                {email}
              </div>

              <p className={`mt-5 text-sm ${mutedTextClass}`}>
                You're ready for the next step: creating your appointment.
              </p>

              <button
                type="button"
                onClick={onBack}
                className={`mt-6 ${secondaryButtonClass}`}
              >
                ← Edit my details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
