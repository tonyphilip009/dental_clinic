import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCancellation,
  cancelAppointment,
  getErrorMessage,
} from "../api";

export default function CancelAppointment() {
  const { token } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadAppointment() {
      try {
        setLoading(true);
        setError("");

        const data = await getCancellation(token);

        if (active) {
          setAppointment(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.status === 404
              ? "This cancellation link is invalid or has expired."
              : getErrorMessage(
                  err,
                  "Unable to load appointment details."
                )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAppointment();

    return () => {
      active = false;
    };
  }, [token]);

  async function handleCancel() {
    try {
      setCancelling(true);
      setError("");
      setSuccess("");

      const data = await cancelAppointment(token);

      setAppointment(data);
      setShowConfirmation(false);

      setSuccess(
        data.already_cancelled
          ? "This appointment was already cancelled."
          : "Your appointment has been cancelled successfully."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to cancel this appointment. Please contact the clinic."
        )
      );

      // Refresh details in case the appointment status changed.
      try {
        const data = await getCancellation(token);
        setAppointment(data);
      } catch {
        // Keep the original error visible.
      }
    } finally {
      setCancelling(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "—";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function formatTime(timeString) {
    if (!timeString) return "—";

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-gray-600">
          Loading appointment details...
        </p>
      </main>
    );
  }

  if (!appointment) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Cancellation Link Unavailable
          </h1>

          <p className="text-gray-600">
            {error ||
              "We could not find this appointment. Please check your link or contact the clinic."}
          </p>
        </div>
      </main>
    );
  }

  const isCancelled = appointment.status === "cancelled";

  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
            House of Dental
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Cancel Appointment
          </h1>

          <p className="mt-3 text-gray-600">
            Review your appointment details below.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {success}
          </div>
        )}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">
                Appointment reference
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {appointment.reference}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                isCancelled
                  ? "bg-red-100 text-red-700"
                  : appointment.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {appointment.status?.charAt(0).toUpperCase() +
                appointment.status?.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Patient</p>
              <p className="mt-1 font-medium text-gray-900">
                {appointment.first_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="mt-1 font-medium text-gray-900">
                {appointment.service}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Dentist</p>
              <p className="mt-1 font-medium text-gray-900">
                {appointment.dentist}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatDate(appointment.date)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatTime(appointment.time_slot)}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            {isCancelled ? (
              <p className="rounded-lg bg-gray-100 p-4 text-center text-gray-700">
                This appointment has already been cancelled.
              </p>
            ) : appointment.can_cancel ? (
              <>
                {!showConfirmation ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(true)}
                    className="w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Cancel This Appointment
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-center font-medium text-gray-800">
                      Are you sure you want to cancel this appointment?
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="flex-1 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {cancelling
                          ? "Cancelling..."
                          : "Yes, Cancel Appointment"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowConfirmation(false)}
                        disabled={cancelling}
                        className="flex-1 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                      >
                        Keep Appointment
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="rounded-lg bg-yellow-50 p-4 text-center text-yellow-800">
                {appointment.reason ||
                  "This appointment cannot be cancelled online. Please contact the clinic."}
              </p>
            )}
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-gray-500">
          Need help? Please contact House of Dental.
        </p>
      </div>
    </main>
  );
}