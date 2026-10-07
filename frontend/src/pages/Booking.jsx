import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getServices } from "../api";
import BookingSteps from "../components/BookingSteps";
import OtpStep from "../components/OtpStep";
import PatientDetailsStep from "../components/PatientDetailsStep";
import ScheduleStep from "../components/ScheduleStep";
import ServiceStep from "../components/ServiceStep";
import useFetch from "../hooks/useFetch";
import { DEFAULT_COUNTRY } from "../utils/validation";
import { validateBookingChoices } from "../utils/validation";

const EMPTY_PATIENT = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export default function Booking() {
  const [searchParams] = useSearchParams();

  const servicesState = useFetch(getServices);
  const services = servicesState.data ?? [];

  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState("");

  const [selectedId, setSelectedId] = useState(
    () => Number(searchParams.get("service")) || null
  );

  const [dentist, setDentist] = useState(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const [patient, setPatient] = useState(EMPTY_PATIENT);

  // Selected country for the patient's phone number
  const [countryCode, setCountryCode] =
    useState(DEFAULT_COUNTRY);

  // { email, token } after successful OTP verification
  const [verification, setVerification] = useState(null);

  const selectedService =
    services.find((s) => s.id === selectedId) || null;

  const goToStep = (next, message = "") => {
    setNotice(message);
    setStep(next);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDentistChange = (d) => {
    setDentist(d);
    setTimeSlot("");
  };

  const handleDateChange = (value) => {
    setDate(value);
    setTimeSlot("");
  };

  const handlePatientChange = (field, value) => {
    setPatient((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePatientSubmit = (cleaned) => {
    setPatient(cleaned);

    const problem = validateBookingChoices({
      service: selectedService,
      dentist,
      date,
      timeSlot,
    });

    if (problem) {
      goToStep(
        problem.step,
        problem.message
      );
      return;
    }

    // If the patient changed their email,
    // the previous verification is no longer valid.
    if (
      verification &&
      verification.email !== cleaned.email
    ) {
      setVerification(null);
    }

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
            Choose your treatment, pick a time that suits you,
            and we'll take care of the rest.
          </p>
        </div>

        <BookingSteps current={step} />

        {notice && (
          <p
            className="mb-6 rounded-lg bg-red-50 p-3 text-center text-red-700"
            role="alert"
          >
            {notice}
          </p>
        )}

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
            countryCode={countryCode}
            onCountryChange={setCountryCode}
            onChange={handlePatientChange}
            onBack={() => goToStep(2)}
            onSubmit={handlePatientSubmit}
          />
        )}

        {step === 4 && (
          <OtpStep
            service={selectedService}
            dentist={dentist}
            date={date}
            timeSlot={timeSlot}
            patient={patient}
            verification={verification}
            onVerified={setVerification}
            onBack={() => goToStep(3)}
          />
        )}
      </div>
    </section>
  );
}