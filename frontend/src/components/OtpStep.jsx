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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

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

  // Update the countdown once per second.
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const requestCode = async (isResend = false) => {
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
        setNotice("We've sent you a new code.");
      }
    } catch (err) {
      const data = err.response?.data;

      if (
        err.response?.status === 429 &&
        data?.code === "cooldown"
      ) {
        setResendAt(
          Date.now() + data.retry_after * 1000
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

  // Send the first code when this step opens.
  const startVerification = () => {
    if (startedRef.current || alreadyVerified) {
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
    Math.ceil((resendAt - now) / 1000)
  );

  const expiresLeft =
    expiresAt === null
      ? null
      : Math.max(
          0,
          Math.ceil((expiresAt - now) / 1000)
        );

  const expired =
    expiresAt !== null && expiresLeft === 0;

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
      className="mx-auto max-w-xl space-y-6"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      {summary}

      <AnimatePresence mode="wait">
        {phase === "sending" && (
          <motion.div
            key="sending"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-accent/20 bg-brand-dark p-6 shadow-xl sm:p-8"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
                className="text-2xl text-accent"
              >
                ✉
              </motion.span>
            </div>

            <h2 className="text-2xl font-semibold text-brand-light">
              Preparing your verification
            </h2>

            <p className="mt-2 text-sm leading-6 text-brand-light/65">
              We're sending a secure verification code to your email.
            </p>

            <div className="mt-6">
              <Loading message="Sending your verification code..." />
            </div>
          </motion.div>
        )}

        {phase === "failed" && (
          <motion.div
            key="failed"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-5 rounded-2xl border border-red-400/20 bg-brand-dark p-6 shadow-xl sm:p-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 text-2xl text-red-300">
              !
            </div>

            <h2 className="text-2xl font-semibold text-brand-light">
              Verification code not sent
            </h2>

            <p className="text-sm leading-6 text-brand-light/65">
              We couldn't send your code. Please try again.
            </p>

            <ErrorMessage
              message={sendError}
              onRetry={() => requestCode(false)}
            />

            <button
              type="button"
              onClick={onBack}
              className="w-full rounded-xl border border-accent/40 px-5 py-3 font-medium text-brand-light transition hover:bg-accent/10"
            >
              ← Edit my details
            </button>
          </motion.div>
        )}

        {phase === "ready" && (
          <motion.form
            key="ready"
            onSubmit={handleVerify}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className="overflow-hidden rounded-2xl border border-accent/25 bg-brand-dark shadow-2xl"
          >
            <div className="border-b border-accent/15 bg-gradient-to-br from-accent/10 to-transparent p-6 sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-2xl">
                <span aria-hidden="true">✉</span>
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Email verification
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-brand-light">
                One last security check
              </h2>

              <p className="mt-3 text-sm leading-6 text-brand-light/70">
                Enter the six-digit code we sent to your email address.
              </p>

              <p className="mt-3 break-all rounded-xl border border-accent/20 bg-black/20 px-4 py-3 text-sm font-medium text-brand-light">
                {email}
              </p>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="otp-code"
                  className="text-sm font-medium text-brand-light/85"
                >
                  Verification code
                </label>

                {expiresLeft !== null && !expired && (
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium tabular-nums text-accent">
                    Expires in {formatCountdown(expiresLeft)}
                  </span>
                )}
              </div>

              <motion.div
                animate={
                  error
                    ? { x: [0, -5, 5, -4, 4, 0] }
                    : { x: 0 }
                }
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
                  onChange={(e) =>
                    setCode(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, CODE_LENGTH)
                    )
                  }
                  aria-describedby={
                    error ? "otp-error" : undefined
                  }
                  className="w-full rounded-xl border border-accent/30 bg-black/25 px-3 py-4 text-center text-2xl font-semibold tracking-[0.45em] text-brand-light outline-none transition placeholder:text-brand-light/25 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-3xl sm:tracking-[0.7em]"
                />
              </motion.div>

              <div className="flex items-center justify-between text-xs text-brand-light/45">
                <span>6 digits required</span>
                <span className="tabular-nums">
                  {code.length}/{CODE_LENGTH}
                </span>
              </div>

              {expired && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300"
                  role="alert"
                >
                  Your code has expired. Please request a new one.
                </motion.p>
              )}

              {locked && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300"
                  role="alert"
                >
                  Verification is locked or the code is no longer available. Request a new code to continue.
                </motion.p>
              )}

              {import.meta.env.DEV && (
                <p className="rounded-xl border border-accent/15 bg-accent/5 p-3 text-xs leading-5 text-brand-light/55">
                  Development mode: the code is printed in the terminal where Django is running.
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
                    className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300"
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
                    className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-brand-dark shadow-lg shadow-accent/10 transition duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-accent/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
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

              <div className="flex flex-col items-center justify-between gap-4 border-t border-accent/15 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm font-medium text-brand-light/65 transition hover:text-accent"
                >
                  ← Edit my details
                </button>

                <button
                  type="button"
                  onClick={() => requestCode(true)}
                  disabled={resendLeft > 0 || resending}
                  className="text-sm font-medium text-accent transition hover:text-gold-light disabled:cursor-not-allowed disabled:text-brand-light/35"
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

        {phase === "done" && (
          <motion.div
            key="done"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-2xl border border-accent/25 bg-brand-dark text-center shadow-2xl"
          >
            <div className="bg-gradient-to-b from-accent/10 to-transparent px-6 pb-8 pt-8 sm:px-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                <AnimatedCheck />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Verification complete
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-brand-light">
                Email verified
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-brand-light/65">
                Thank you. Your email address has been confirmed successfully.
              </p>

              <div className="mx-auto mt-5 max-w-sm break-all rounded-xl border border-accent/20 bg-black/20 px-4 py-3 text-sm text-brand-light/85">
                {email}
              </div>

              <p className="mt-5 text-sm text-brand-light/55">
                You're ready for the next step: creating your appointment.
              </p>

              <button
                type="button"
                onClick={onBack}
                className="mt-6 rounded-xl border border-accent/35 px-5 py-3 text-sm font-medium text-brand-light transition hover:bg-accent/10 hover:text-accent"
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
