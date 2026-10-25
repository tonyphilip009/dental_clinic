
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
      transition={{
        duration: reduceMotion ? 0 : 0.4,
        ease: "easeOut",
      }}
      className="mx-auto w-full max-w-4xl space-y-6 px-4 pb-10 pt-8 sm:px-6 sm:pt-10"
    >
      {/* Booking success */}
      <section className="overflow-hidden rounded-2xl border border-[#E7DCC7] bg-white shadow-[0_12px_35px_rgba(70,53,25,0.07)]">
        <div className="border-b border-[#E7DCC7] bg-[#F7F3EA] px-6 py-8 text-center sm:px-10 sm:py-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D8C9A9] bg-white">
            <AnimatedCheck className="h-16 w-16" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#A97813]">
            House of Dental
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#29251D] sm:text-3xl">
            Your smile journey starts here.
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#756B5D] sm:text-base">
            Your appointment has been created. Review your booking details
            below.
          </p>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-[#E7DCC7] bg-white p-5 text-center sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#D5A637] bg-[#F7F3EA] text-4xl text-[#A97813]">
              <span aria-hidden="true">✓</span>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#A97813]">
              Booking received
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-[#29251D] sm:text-3xl">
              Your appointment is booked!
            </h2>

            <p className="mt-3 leading-7 text-[#756B5D]">
              Thank you, {patient.name.split(" ")[0]}. We look forward to
              seeing you.
            </p>

            <div className="mt-6 rounded-xl border border-[#E7DCC7] bg-[#F7F3EA] p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-[#756B5D]">
                Booking reference
              </p>

              <p className="mt-2 break-words text-2xl font-bold tracking-wider text-[#29251D] sm:text-3xl">
                {reference}
              </p>

              <p className="mt-3 text-sm text-[#756B5D]">
                Status:{" "}
                <span className="font-semibold text-[#29251D]">
                  {STATUS_LABELS[appointment.status] ??
                    appointment.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation email status */}
      <section
        className={`rounded-2xl border p-5 sm:p-6 ${
          emailSent
            ? "border-green-200 bg-green-50"
            : "border-[#E7DCC7] bg-[#F7F3EA]"
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
                  A confirmation email with your appointment details has
                  been sent to <strong>{patient.email}</strong>.
                </p>

                <p className="mt-2 text-sm leading-6 text-green-700">
                  The email also contains a private link you can use to view
                  your appointment and cancel it online if needed.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-[#805A0D]">
                  Appointment booked successfully
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#756B5D]">
                  We couldn't send the confirmation email right now. Your
                  appointment is still booked. Please save your booking
                  reference: <strong>{reference}</strong>.
                </p>

                <p className="mt-2 text-sm leading-6 text-[#756B5D]">
                  If you need to cancel, please contact the clinic and
                  provide your booking reference.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Appointment summary */}
      <section>
        <BookingSummary
          service={service}
          dentist={dentist}
          date={date}
          timeSlot={timeSlot}
          patient={patient}
        />
      </section>

      {/* Next steps */}
      <section className="rounded-2xl border border-[#E7DCC7] bg-white p-6 shadow-[0_8px_25px_rgba(70,53,25,0.04)] sm:p-8">
        <h3 className="text-lg font-semibold text-[#29251D]">
          What happens next
        </h3>

        <ul className="mt-4 space-y-3 text-[#756B5D]">
          {[
            "The clinic will review and confirm your appointment.",
            "Please arrive about 10 minutes early.",
            "Keep your booking reference for future enquiries.",
            "If you receive the confirmation email, use its private cancellation link if you need to cancel online.",
          ].map((item, index) => (
            <li key={item} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E7DCC7] bg-[#F7F3EA] text-xs font-semibold text-[#A97813]">
                {index + 1}
              </span>

              <span className="leading-6">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/"
          className="rounded-xl bg-[#D5A637] px-6 py-3 text-center font-semibold text-[#29251D] transition hover:bg-[#E4BC58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A97813]"
        >
          Back to home
        </Link>

        <button
          type="button"
          onClick={onBookAnother}
          className="rounded-xl border border-[#D8C9A9] bg-white px-6 py-3 font-semibold text-[#393329] transition hover:border-[#D5A637] hover:bg-[#F7F3EA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A97813]"
        >
          Book another appointment
        </button>
      </div>
    </motion.div>
  );
}
