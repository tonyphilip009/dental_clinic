import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getServices } from "../api";
import BookingSteps from "../components/BookingSteps";
import BookingSummary from "../components/BookingSummary";
import PatientDetailsStep from "../components/PatientDetailsStep";
import ScheduleStep from "../components/ScheduleStep";
import ServiceStep from "../components/ServiceStep";
import useFetch from "../hooks/useFetch";

const EMPTY_PATIENT = { name: "", phone: "", email: "", message: "" };

export default function Booking() {
  const [searchParams] = useSearchParams();
  const servicesState = useFetch(getServices);
  const services = servicesState.data ?? [];

  const [step, setStep] = useState(1);

  // Everything the patient has chosen so far
  const [selectedId, setSelectedId] = useState(
    () => Number(searchParams.get("service")) || null
  );
  const [dentist, setDentist] = useState(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [patient, setPatient] = useState(EMPTY_PATIENT);

  const selectedService = services.find((s) => s.id === selectedId) || null;

  const goToStep = (next) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // A time slot only makes sense for one dentist and one date
  const handleDentistChange = (d) => {
    setDentist(d);
    setTimeSlot("");
  };

  const handleDateChange = (value) => {
    setDate(value);
    setTimeSlot("");
  };

  const handlePatientChange = (field, value) => {
    setPatient((current) => ({ ...current, [field]: value }));
  };

  const handlePatientSubmit = (cleaned) => {
    setPatient(cleaned);
    goToStep(4);
  };

  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-brand-dark">
            Book an Appointment
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Choose your treatment, pick a time that suits you, and we'll take
            care of the rest.
          </p>
        </div>

        <BookingSteps current={step} />

        {step === 1 && (
          <ServiceStep
            servicesState={servicesState}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onContinue={() => goToStep(2)}
          />
        )}

        {step === 2 && (
          <ScheduleStep
            service={selectedService}
            dentist={dentist}
            date={date}
            timeSlot={timeSlot}
            onDentistChange={handleDentistChange}
            onDateChange={handleDateChange}
            onTimeChange={setTimeSlot}
            onBack={() => goToStep(1)}
            onContinue={() => goToStep(3)}
          />
        )}

        {step === 3 && (
          <PatientDetailsStep
            service={selectedService}
            dentist={dentist}
            date={date}
            timeSlot={timeSlot}
            patient={patient}
            onChange={handlePatientChange}
            onBack={() => goToStep(2)}
            onSubmit={handlePatientSubmit}
          />
        )}

        {/* ---------- Step 4: placeholder until Day 29 ---------- */}
        {step === 4 && (
          <div className="mx-auto max-w-xl space-y-6">
            <BookingSummary
              service={selectedService}
              dentist={dentist}
              date={date}
              timeSlot={timeSlot}
              patient={patient}
            />
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <p className="text-gray-500">
                Identity verification comes next.
              </p>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="mt-4 rounded-lg border border-brand px-5 py-2 font-semibold text-brand transition hover:bg-brand-light/30"
              >
                ← Edit my details
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}