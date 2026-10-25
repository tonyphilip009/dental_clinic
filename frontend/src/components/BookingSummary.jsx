
import { motion } from "motion/react";
import { formatDisplayDate, formatTime } from "../utils/dates";

const appointmentRows = (service, dentist, date, timeSlot) => [
  {
    label: "Treatment",
    value: service?.name,
    icon: "✦",
  },
  {
    label: "Dentist",
    value: dentist?.name,
    icon: "♙",
  },
  {
    label: "Appointment date",
    value: date ? formatDisplayDate(date) : "",
    icon: "▦",
  },
  {
    label: "Appointment time",
    value: timeSlot ? formatTime(timeSlot) : "",
    icon: "◷",
  },
];

export default function BookingSummary({
  service,
  dentist,
  date,
  timeSlot,
  patient,
}) {
  const appointmentDetails = appointmentRows(
    service,
    dentist,
    date,
    timeSlot
  );

  const patientDetails = patient
    ? [
        ["Name", patient.name],
        ["Phone", patient.phone],
        ["Email", patient.email],
        ["Message", patient.message],
      ].filter(([label, value]) => label !== "Message" || value)
    : [];

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-[#E7DCC7] bg-white shadow-[0_10px_30px_rgba(70,53,25,0.07)]"
    >
      {/* Summary header */}
      <div className="border-b border-[#E7DCC7] bg-[#F7F3EA] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A97813]">
          House of Dental
        </p>

        <h3 className="mt-2 text-xl font-semibold text-[#29251D]">
          Your appointment
        </h3>

        <p className="mt-1 text-sm text-[#756B5D]">
          Review your booking details
        </p>
      </div>

      <div className="space-y-5 p-5">
        {/* Appointment details */}
        <dl className="space-y-4">
          {appointmentDetails.map(({ label, value, icon }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.06,
              }}
              className="flex items-start gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7DCC7] bg-[#F7F3EA] text-[#A97813]">
                <span aria-hidden="true">{icon}</span>
              </div>

              <div className="min-w-0 flex-1">
                <dt className="text-xs uppercase tracking-wider text-[#938A7C]">
                  {label}
                </dt>

                <dd className="mt-1 break-words text-sm font-medium text-[#29251D]">
                  {value || "—"}
                </dd>
              </div>
            </motion.div>
          ))}
        </dl>

        {/* Patient information */}
        {patientDetails.length > 0 && (
          <div className="border-t border-[#E7DCC7] pt-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#A97813]">
              Patient information
            </p>

            <dl className="space-y-3">
              {patientDetails.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-[#938A7C]">
                    {label}
                  </dt>

                  <dd className="mt-1 break-words text-sm text-[#393329]">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Treatment price */}
        {service?.price != null && service.price !== "" && (
          <div className="border-t border-[#E7DCC7] pt-5">
            <p className="text-xs uppercase tracking-wider text-[#938A7C]">
              Treatment price
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#A97813]">
              ₹{Number(service.price).toLocaleString("en-IN")}
            </p>

            <p className="mt-2 text-xs leading-5 text-[#756B5D]">
              Starting price only. The final fee will be confirmed
              at the clinic.
            </p>
          </div>
        )}

        {/* Reminder */}
        <div className="flex items-start gap-2 border-t border-[#E7DCC7] pt-4">
          <span
            className="mt-0.5 text-[#A97813]"
            aria-hidden="true"
          >
            ✓
          </span>

          <p className="text-xs leading-5 text-[#756B5D]">
            Please review your details before continuing with your
            appointment.
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
