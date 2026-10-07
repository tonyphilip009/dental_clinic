import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  createAppointment,
  getErrorMessage,
  getServices,
} from "../api";
import BookingConfirmation from "../components/BookingConfirmation";
import BookingSteps from "../components/BookingSteps";
import OtpStep from "../components/OtpStep";
import PatientDetailsStep from "../components/PatientDetailsStep";
import ScheduleStep from "../components/ScheduleStep";
import ServiceStep from "../components/ServiceStep";
import useFetch from "../hooks/useFetch";
import {
  DEFAULT_COUNTRY,
  validateBookingChoices,
} from "../utils/validation";

const EMPTY_PATIENT = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

// Which step to send the patient to when the server rejects a field
const FIELD_STEP = {
  service: 1,
  dentist: 2,
  date: 2,
  time_slot: 2,
  name: 3,
  phone: 3,
  email: 3,
  message: 3,
};

export default function Booking() {
  const [searchParams] = useSearchParams();

  const servicesState = useFetch(getServices);
  const services = servicesState.data ?? [];

  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState("");

  // Selected service
  const [selectedId, setSelectedId] = useState(
    () => Number(searchParams.get("service")) || null
  );

  // Appointment choices
  const [dentist, setDentist] = useState(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  // Patient details
  const [patient, setPatient] = useState(EMPTY_PATIENT);

  // Selected country for the patient's phone number
  const [countryCode, setCountryCode] =
    useState(DEFAULT_COUNTRY);

  // { email, token } after successful OTP verification
  const [verification, setVerification] = useState(null);

  // Changing this forces a fresh OTP component
  const [otpSession, setOtpSession] = useState(0);

  // Appointment submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Created appointment returned by Django
  const [appointment, setAppointment] = useState(null);

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

  // Changing dentist resets the selected time
  const handleDentistChange = (d) => {
    setDentist(d);
    setTimeSlot("");
  };

  // Changing date resets the selected time
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

  // Handle errors returned when creating the appointment
  const handleBookingError = (err) => {
    const data = err.response?.data;

    if (
      err.response?.status === 400 &&
      data &&
      typeof data === "object"
    ) {
      // Verification expired or was already consumed
      if (data.verification_token) {
        setVerification(null);
        setOtpSession((current) => current + 1);

        goToStep(
          4,
          "Your email verification has expired. Please verify your email again."
        );

        return;
      }

      // Find the field that caused the problem
      const field = Object.keys(data).find(
        (key) => FIELD_STEP[key]
      );

      if (field) {
        const raw = data[field];
        const first = Array.isArray(raw) ? raw[0] : raw;

        // Slot was taken by someone else
        if (field === "time_slot") {
          setTimeSlot("");

          goToStep(
            2,
            "Sorry, that time is no longer available. Please choose another slot."
          );
        } else {
          goToStep(
            FIELD_STEP[field],
            typeof first === "string"
              ? first
              : "Please check your details and try again."
          );
        }

        return;
      }
    }

    // Network/server error
    setSubmitError(
      getErrorMessage(
        err,
        "We couldn't complete your booking. Please try again."
      )
    );
  };

  // Send the appointment to Django after email verification
  const submitBooking = async (verified, patientData) => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await createAppointment({
        name: patientData.name,
        phone: patientData.phone,
        email: patientData.email,
        message: patientData.message,
        service: selectedService.id,
        dentist: dentist.id,
        date,
        time_slot: timeSlot,
        verification_token: verified.token,
      });

      // Save the newly created appointment
      setAppointment(result);

      // The verification token has now been consumed
      setVerification(null);

      // Show confirmation screen
      goToStep(5);
    } catch (err) {
      handleBookingError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Called by OtpStep after successful OTP verification
  const handleVerified = (verified) => {
    setVerification(verified);

    submitBooking(verified, patient);
  };

  // Retry appointment creation after OTP was already verified
  const handleRetrySubmit = () => {
    if (verification) {
      submitBooking(verification, patient);
    }
  };

  // Patient details form submitted
  const handlePatientSubmit = (cleaned) => {
    setPatient(cleaned);

    // Final check of service, dentist, date and time
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

    // If this email was already verified,
    // keep the verification token
    if (
      verification &&
      verification.email === cleaned.email
    ) {
      goToStep(4);

      submitBooking(
        verification,
        cleaned
      );

      return;
    }

    // Email changed or has not been verified yet
    setVerification(null);

    goToStep(4);
  };

  // Start a completely new booking
  const resetBooking = () => {
    setSelectedId(null);
    setDentist(null);
    setDate("");
    setTimeSlot("");
    setPatient(EMPTY_PATIENT);

    setCountryCode(DEFAULT_COUNTRY);

    setVerification(null);
    setAppointment(null);

    setSubmitError("");
    setNotice("");

    setOtpSession((current) => current + 1);

    goToStep(1);
  };

  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-5xl px-4">

        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-brand-dark">
            Book an Appointment
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Choose your treatment, pick a time that suits you,
            and we'll take care of the rest.
          </p>
        </div>

        {/* Progress steps */}
        <BookingSteps current={step} />

        {/* General notice */}
        {notice && (
          <p
            className="mb-6 rounded-lg bg-red-50 p-3 text-center text-red-700"
            role="alert"
          >
            {notice}
          </p>
        )}

        {/* STEP 1 — SERVICE */}
        {step === 1 && (
          <ServiceStep
            servicesState={servicesState}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onContinue={() => goToStep(2)}
          />
        )}

        {/* STEP 2 — DENTIST / DATE / TIME */}
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

        {/* STEP 3 — PATIENT DETAILS */}
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

        {/* STEP 4 — EMAIL OTP */}
        {step === 4 && (
          <OtpStep
            key={otpSession}
            service={selectedService}
            dentist={dentist}
            date={date}
            timeSlot={timeSlot}
            patient={patient}
            verification={verification}
            submitting={submitting}
            submitError={submitError}
            onVerified={handleVerified}
            onRetrySubmit={handleRetrySubmit}
            onBack={() => goToStep(3)}
          />
        )}

        {/* STEP 5 — BOOKING CONFIRMATION */}
        {step === 5 && appointment && (
          <BookingConfirmation
            appointment={appointment}
            service={selectedService}
            dentist={dentist}
            date={date}
            timeSlot={timeSlot}
            patient={patient}
            onBookAnother={resetBooking}
          />
        )}

      </div>
    </section>
  );
}