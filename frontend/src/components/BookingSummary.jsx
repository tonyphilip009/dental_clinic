import { formatDisplayDate, formatTime } from "../utils/dates";

export default function BookingSummary({
  service,
  dentist,
  date,
  timeSlot,
  patient,
}) {
  const appointmentRows = [
    ["Service", service?.name],
    ["Dentist", dentist?.name],
    ["Date", date ? formatDisplayDate(date) : ""],
    ["Time", timeSlot ? formatTime(timeSlot) : ""],
  ];

  const patientRows = patient
    ? [
        ["Name", patient.name],
        ["Phone", patient.phone],
        ["Email", patient.email],
        ["Message", patient.message],
      ].filter(([label, value]) => label !== "Message" || value)
    : [];

  const rows = [...appointmentRows, ...patientRows];

  return (
    <aside className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold text-brand-dark">
        Your appointment
      </h3>

      <dl className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              {label}
            </dt>
            <dd className="break-words font-medium text-gray-800">
              {value || "—"}
            </dd>
          </div>
        ))}
      </dl>

      {service?.price && (
        <p className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600">
          Treatment starts from ₹
          {Number(service.price).toLocaleString("en-IN")}. The final fee is
          confirmed at the clinic.
        </p>
      )}
    </aside>
  );
}