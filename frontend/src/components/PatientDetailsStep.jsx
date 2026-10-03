import BookingSummary from "./BookingSummary";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

const MESSAGE_LIMIT = 500;

export default function PatientDetailsStep({
  service,
  dentist,
  date,
  timeSlot,
  patient,
  onChange,
  onBack,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: patient.name.trim(),
      phone: patient.phone.trim(),
      email: patient.email.trim(),
      message: patient.message.trim(),
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* On phones the summary appears first, on desktop it sits on the right */}
      <div className="lg:order-2">
        <div className="lg:sticky lg:top-6">
          <BookingSummary
            service={service}
            dentist={dentist}
            date={date}
            timeSlot={timeSlot}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl bg-white p-6 shadow-md lg:order-1 lg:col-span-2"
      >
        <div>
          <h2 className="text-2xl font-semibold text-brand-dark">
            Your details
          </h2>
          <p className="mt-1 text-gray-600">
            We'll use these details to confirm your appointment.
          </p>
        </div>

        <div>
          <label
            htmlFor="patient-name"
            className="mb-1 block font-medium text-gray-700"
          >
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            id="patient-name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Priya Nair"
            value={patient.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="patient-phone"
              className="mb-1 block font-medium text-gray-700"
            >
              Phone number <span className="text-red-600">*</span>
            </label>
            <input
              id="patient-phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              placeholder="e.g. 98765 43210"
              value={patient.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="patient-email"
              className="mb-1 block font-medium text-gray-700"
            >
              Email address <span className="text-red-600">*</span>
            </label>
            <input
              id="patient-email"
              type="email"
              required
              autoComplete="email"
              placeholder="e.g. priya@example.com"
              value={patient.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="patient-message"
            className="mb-1 block font-medium text-gray-700"
          >
            Message <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            id="patient-message"
            rows={4}
            maxLength={MESSAGE_LIMIT}
            placeholder="Anything the dentist should know before your visit?"
            value={patient.message}
            onChange={(e) => onChange("message", e.target.value)}
            className={inputClass}
          />
          <p className="mt-1 text-right text-xs text-gray-500">
            {patient.message.length}/{MESSAGE_LIMIT}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-brand px-5 py-3 font-semibold text-brand transition hover:bg-brand-light/30"
          >
            ← Change date or time
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}