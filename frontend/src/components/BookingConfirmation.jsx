import { Link } from "react-router-dom";
import BookingSummary from "./BookingSummary";

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
  const reference = `HOD-${String(appointment.id).padStart(5, "0")}`;

  const emailSent = appointment.email_sent;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-xl bg-white p-8 text-center shadow-md">
        <p className="text-6xl">🎉</p>

        <h2 className="mt-4 text-3xl font-bold text-brand-dark">
          Your appointment is booked!
        </h2>

        <p className="mt-2 text-gray-600">
          Thank you, {patient.name.split(" ")[0]}. We look forward to seeing
          you.
        </p>

        <div className="mt-6 rounded-lg bg-brand-light/30 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-600">
            Booking reference
          </p>

          <p className="mt-1 text-2xl font-bold tracking-wider text-brand-dark">
            {reference}
          </p>

          <p className="mt-2 text-sm text-gray-700">
            Status:{" "}
            <span className="font-semibold">
              {STATUS_LABELS[appointment.status] ?? appointment.status}
            </span>
          </p>
        </div>
      </div>

      {/* Email status */}
      <div
        className={`rounded-xl p-5 shadow-md ${
          emailSent
            ? "bg-green-50 border border-green-200"
            : "bg-yellow-50 border border-yellow-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">
            {emailSent ? "📧" : "⚠️"}
          </span>

          <div>
            {emailSent ? (
              <>
                <h3 className="font-semibold text-green-800">
                  Confirmation email sent
                </h3>

                <p className="mt-1 text-sm text-green-700">
                  A confirmation email with your appointment details has been
                  sent to <strong>{patient.email}</strong>.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-yellow-800">
                  Appointment booked successfully
                </h3>

                <p className="mt-1 text-sm text-yellow-700">
                  We couldn't send the confirmation email right now. Your
                  appointment is still booked. Please save your booking
                  reference: <strong>{reference}</strong>.
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

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="text-lg font-semibold text-brand-dark">
          What happens next
        </h3>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
          <li>
            The clinic will review and confirm your appointment.
          </li>

          <li>
            Please arrive about 10 minutes early.
          </li>

          <li>
            To change or cancel, contact the clinic and quote your reference
            number.
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/"
          className="rounded-lg bg-brand px-6 py-3 text-center font-semibold text-white transition hover:bg-brand-dark"
        >
          Back to home
        </Link>

        <button
          type="button"
          onClick={onBookAnother}
          className="rounded-lg border border-brand px-6 py-3 font-semibold text-brand transition hover:bg-brand-light/30"
        >
          Book another appointment
        </button>
      </div>
    </div>
  );
}