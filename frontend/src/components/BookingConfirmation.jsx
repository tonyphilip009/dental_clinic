
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import BookingSummary from "./BookingSummary";
import AnimatedCheck from "./ui/AnimatedCheck";

const STATUS_LABELS = {
  pending: "Awaiting clinic confirmation",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export default function BookingConfirmation({
  appointment,
  service,
  dentist,
  date,
  timeSlot,
  patient,
  onBookAnother,
}) {
  const reduceMotion = useReducedMotion();

  const reference = `HOD-${String(appointment.id).padStart(5, "0")}`;
  const emailSent = appointment.email_sent === true;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
      className="mx-auto max-w-xl space-y-6"
    >
      {/* Booking success */}
      <div className="rounded-2xl border border-accent/20 bg-white p-6 text-center shadow-lg sm:p-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-accent/25 bg-brand-light/40 text-accent">
          <AnimatedCheck className="h-16 w-16" />
        </div>

        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Booking received
        </p>

        <h2 className="mt-2 text-2xl font-bold text-brand-dark sm:text-3xl">
          Your appointment is booked!
        </h2>

        <p className="mt-3 leading-7 text-gray-600">
          Thank you, {patient.name.split(" ")[0]}. We look forward to seeing
          you.
        </p>

        <div className="mt-6 rounded-xl border border-accent/20 bg-brand-light/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
            Booking reference
          </p>

          <p className="mt-2 break-words text-2xl font-bold tracking-wider text-brand-dark">
            {reference}
          </p>

          <p className="mt-3 text-sm text-gray-700">
            Status:{" "}
            <span className="font-semibold text-brand-dark">
              {STATUS_LABELS[appointment.status] ?? appointment.status}
            </span>
          </p>
        </div>
      </div>

      {/* Confirmation email status */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          emailSent
            ? "border-green-200 bg-green-50"
            : "border-yellow-200 bg-yellow-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">
            {emailSent ? "📧" : "⚠️"}
          </span>

          <div className="min-w-0">
            {emailSent ? (
              <>
                <h3 className="font-semibold text-green-800">
                  Confirmation email sent
                </h3>

                <p className="mt-1 break-words text-sm leading-6 text-green-700">
                  A confirmation email with your appointment details has been
                  sent to <strong>{patient.email}</strong>.
                </p>

                <p className="mt-2 text-sm leading-6 text-green-700">
                  The email also contains a private link you can use to view
                  your appointment and cancel it online if needed.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-yellow-800">
                  Appointment booked successfully
                </h3>

                <p className="mt-1 text-sm leading-6 text-yellow-700">
                  We couldn't send the confirmation email right now. Your
                  appointment is still booked. Please save your booking
                  reference: <strong>{reference}</strong>.
                </p>

                <p className="mt-2 text-sm leading-6 text-yellow-700">
                  If you need to cancel, please contact the clinic and provide
                  your booking reference.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <BookingSummary
        service={service}
        dentist={dentist}
        date={date}
        timeSlot={timeSlot}
        patient={patient}
      />

      {/* Next steps */}
      <div className="rounded-2xl border border-accent/15 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brand-dark">
          What happens next
        </h3>

        <ul className="mt-4 space-y-3 text-gray-700">
          {[
            "The clinic will review and confirm your appointment.",
            "Please arrive about 10 minutes early.",
            "Keep your booking reference for future enquiries.",
            "If you receive the confirmation email, use its private cancellation link if you need to cancel online.",
          ].map((item, index) => (
            <li key={item} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-brand-light/40 text-xs font-semibold text-brand-dark">
                {index + 1}
              </span>
              <span className="leading-6">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/"
          className="rounded-lg bg-brand px-6 py-3 text-center font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back to home
        </Link>

        <button
          type="button"
          onClick={onBookAnother}
          className="rounded-lg border border-accent/50 px-6 py-3 font-semibold text-brand-dark transition hover:bg-brand-light/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Book another appointment
        </button>
      </div>
    </motion.div>
  );
}
