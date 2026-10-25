import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  createAppointment,
  getErrorMessage,
  getServices,
} from "../api";
import BookingConfirmation from "../components/BookingConfirmation";
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

const STEPS = [
  { number: 1, label: "Service", description: "Choose treatment" },
  { number: 2, label: "Dentist & Time", description: "Pick a schedule" },
  { number: 3, label: "Your Details", description: "Patient information" },
  { number: 4, label: "Verify", description: "Confirm your email" },
];

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
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY);

  const [verification, setVerification] = useState(null);
  const [otpSession, setOtpSession] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [appointment, setAppointment] = useState(null);

  const selectedService =
    services.find((service) => service.id === selectedId) || null;

  const goToStep = (next, message = "") => {
    setNotice(message);
    setStep(next);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDentistChange = (selectedDentist) => {
    setDentist(selectedDentist);
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

  const handleBookingError = (err) => {
    const data = err.response?.data;

    if (
      err.response?.status === 400 &&
      data &&
      typeof data === "object"
    ) {
      if (data.verification_token) {
        setVerification(null);
        setOtpSession((current) => current + 1);

        goToStep(
          4,
          "Your email verification has expired. Please verify your email again."
        );

        return;
      }

      const field = Object.keys(data).find(
        (key) => FIELD_STEP[key]
      );

      if (field) {
        const raw = data[field];
        const first = Array.isArray(raw) ? raw[0] : raw;

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

    setSubmitError(
      getErrorMessage(
        err,
        "We couldn't complete your booking. Please try again."
      )
    );
  };

  const submitBooking = async (verified, patientData) => {
    if (submitting) return;

    if (!selectedService || !dentist) {
      goToStep(
        1,
        "Please select a service and dentist before continuing."
      );
      return;
    }

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

      setAppointment(result);
      setVerification(null);

      goToStep(5);
    } catch (err) {
      handleBookingError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerified = (verified) => {
    setVerification(verified);
    submitBooking(verified, patient);
  };

  const handleRetrySubmit = () => {
    if (verification) {
      submitBooking(verification, patient);
    }
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
      goToStep(problem.step, problem.message);
      return;
    }

    if (
      verification &&
      verification.email === cleaned.email
    ) {
      goToStep(4);
      submitBooking(verification, cleaned);
      return;
    }

    setVerification(null);
    goToStep(4);
  };

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

  const confirmationVisible = step === 5 && appointment;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F7F4ED] text-[#17263D]">
      {/* DARK UPPER SECTION */}
      {!confirmationVisible && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B0B09] via-[#171612] to-[#302419] px-4 pb-12 pt-10 text-[#FAF8F2] sm:px-6 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#D9AD43]/10 blur-[110px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-[#A66D35]/10 blur-[120px]"
          />

          <div className="relative mx-auto max-w-6xl">
            {/* PAGE HEADING */}
            <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#D9AD43]/30 bg-white/[0.04] px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D9AD43]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E6C36F] sm:text-xs">
                  Welcome to House of Dental
                </span>
              </div>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#FAF8F2] sm:text-4xl md:text-5xl">
                Your smile,
                <span className="block font-serif italic font-normal text-[#D9AD43]">
                  our commitment.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#D0C9BC] sm:text-base">
                Thoughtful dental care in a welcoming environment.
                Choose your treatment, find a convenient appointment,
                and let our team take care of the rest.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.14em] text-[#D0C9BC] sm:text-xs">
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-[#D9AD43]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Secure booking
                </span>

                <span className="hidden h-4 w-px bg-white/20 sm:block" />

                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-[#D9AD43]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  Convenient appointments
                </span>
              </div>
            </header>

            {/* BOOKING PROGRESS — FIXED LINE ALIGNMENT */}
            <div className="mx-auto max-w-4xl">
              <div className="relative grid grid-cols-4 gap-1 sm:gap-4">
                {/* Base line behind the circles */}
                <div
                  aria-hidden="true"
                  className="absolute left-[12.5%] right-[12.5%] top-5 h-px bg-white/20 sm:top-6"
                />

                {/* Gold completed line */}
                <div
                  aria-hidden="true"
                  className="absolute left-[12.5%] top-5 h-px bg-[#D9AD43] transition-all duration-500 sm:top-6"
                  style={{
                    width: `${Math.max(0, Math.min(step - 1, 3)) * 25}%`,
                  }}
                />

                {STEPS.map((item) => {
                  const active = step === item.number;
                  const complete = step > item.number;

                  return (
                    <div
                      key={item.number}
                      className="relative z-10 flex min-w-0 flex-col items-center text-center"
                    >
                      {/* Opaque circle hides the line behind it */}
                      <div
                        className={[
                          "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 sm:h-12 sm:w-12",
                          active
                            ? "border-[#E6C36F] bg-[#D9AD43] text-[#17263D] shadow-[0_0_20px_rgba(217,173,67,0.20)]"
                            : complete
                              ? "border-[#D9AD43] bg-[#302419] text-[#E6C36F]"
                              : "border-white/30 bg-[#211F1A] text-[#D0C9BC]",
                        ].join(" ")}
                      >
                        {complete ? (
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-label="Completed"
                          >
                            <path d="m5 12 4 4L19 6" />
                          </svg>
                        ) : (
                          item.number
                        )}
                      </div>

                      <span
                        className={[
                          "mt-3 text-[10px] font-semibold sm:text-sm",
                          active || complete
                            ? "text-[#E6C36F]"
                            : "text-[#D0C9BC]",
                        ].join(" ")}
                      >
                        {item.label}
                      </span>

                      <span className="mt-1 hidden text-xs text-[#B0A99D] sm:block">
                        {item.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHT LOWER SECTION */}
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#D9AD43]/[0.07] blur-[110px]"
        />

        <div className="relative mx-auto max-w-5xl">
          {/* NOTICES */}
          {notice && (
            <div
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-800"
              role="alert"
            >
              <svg
                className="mt-0.5 h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4m0 4h.01" />
              </svg>

              <p>{notice}</p>
            </div>
          )}

          {/* STEP 1 — SERVICE */}
          {step === 1 && (
            <div className="overflow-hidden rounded-2xl border border-[#E4D7B9] bg-white shadow-[0_18px_60px_rgba(23,38,61,0.07)] sm:rounded-3xl">
              <div className="border-b border-[#EAE4D8] bg-[#FCFAF6] px-5 py-6 sm:px-8 sm:py-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A47A26] sm:text-xs">
                  Step 01 · Your treatment
                </p>

                <h2 className="text-xl font-semibold tracking-tight text-[#17263D] sm:text-2xl">
                  What would you like to book?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#686860]">
                  Explore our treatments and select the care you need.
                </p>
              </div>

              <div className="p-4 sm:p-7">
                <ServiceStep
                  servicesState={servicesState}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onContinue={() => goToStep(2)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[#EAE4D8] bg-[#FCFAF6] px-5 py-4 text-center text-[10px] text-[#686860] sm:gap-3 sm:text-xs">
                <span>Personalised dental care</span>
                <span className="text-[#B68A32]">✦</span>
                <span>Modern treatment options</span>
                <span className="text-[#B68A32]">✦</span>
                <span>Clear treatment guidance</span>
              </div>
            </div>
          )}

          {/* STEP 2 — SCHEDULE */}
          {step === 2 && (
            <div className="overflow-hidden rounded-2xl border border-[#E4D7B9] bg-white shadow-[0_18px_60px_rgba(23,38,61,0.07)] sm:rounded-3xl">
              <div className="border-b border-[#EAE4D8] bg-[#FCFAF6] px-5 py-6 sm:px-8 sm:py-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A47A26] sm:text-xs">
                  Step 02 · Appointment schedule
                </p>

                <h2 className="text-xl font-semibold text-[#17263D] sm:text-2xl">
                  Find a time that suits you.
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#686860]">
                  Choose your dentist, preferred date, and available time.
                </p>
              </div>

              <div className="p-4 sm:p-7">
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
              </div>
            </div>
          )}

          {/* STEP 3 — PATIENT DETAILS */}
          {step === 3 && (
            <div className="overflow-hidden rounded-2xl border border-[#E4D7B9] bg-white shadow-[0_18px_60px_rgba(23,38,61,0.07)] sm:rounded-3xl">
              <div className="border-b border-[#EAE4D8] bg-[#FCFAF6] px-5 py-6 sm:px-8 sm:py-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A47A26] sm:text-xs">
                  Step 03 · Patient information
                </p>

                <h2 className="text-xl font-semibold text-[#17263D] sm:text-2xl">
                  Tell us a little about yourself.
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#686860]">
                  Enter your details so we can prepare for your visit.
                </p>
              </div>

              <div className="p-4 sm:p-7">
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
              </div>
            </div>
          )}

          {/* STEP 4 — EMAIL VERIFICATION */}
          {step === 4 && (
            <div className="overflow-hidden rounded-2xl border border-[#E4D7B9] bg-white shadow-[0_18px_60px_rgba(23,38,61,0.07)] sm:rounded-3xl">
              <div className="border-b border-[#EAE4D8] bg-[#FCFAF6] px-5 py-6 sm:px-8 sm:py-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A47A26] sm:text-xs">
                  Step 04 · Email verification
                </p>

                <h2 className="text-xl font-semibold text-[#17263D] sm:text-2xl">
                  Verify your email.
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#686860]">
                  Complete email verification to finalise your appointment.
                </p>
              </div>

              <div className="p-4 sm:p-7">
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
              </div>
            </div>
          )}

          {/* STEP 5 — CONFIRMATION */}
          {confirmationVisible && (
            <div className="overflow-hidden rounded-2xl border border-[#E4D7B9] bg-white shadow-[0_18px_60px_rgba(23,38,61,0.08)] sm:rounded-3xl">
              <div className="bg-[#17263D] px-5 pb-8 pt-9 text-center text-[#FAF8F2] sm:px-8 sm:pt-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#D9AD43]/50 bg-[#D9AD43]/15">
                  <svg
                    className="h-8 w-8 text-[#E6C36F]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </div>

                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E6C36F] sm:text-xs">
                  House of Dental
                </p>

                <h1 className="text-2xl font-semibold sm:text-3xl">
                  Your smile journey starts here.
                </h1>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#D7DCE3]">
                  Your appointment has been created. Review your booking details below.
                </p>
              </div>

              <div className="p-4 sm:p-7">
                <BookingConfirmation
                  appointment={appointment}
                  service={selectedService}
                  dentist={dentist}
                  date={date}
                  timeSlot={timeSlot}
                  patient={patient}
                  onBookAnother={resetBooking}
                />
              </div>
            </div>
          )}

          {/* FOOTER */}
          {!confirmationVisible && (
            <footer className="mt-7 flex flex-col items-center justify-center gap-2 text-center sm:mt-9">
              <div className="flex items-center gap-2 text-xs font-medium text-[#525A60]">
                <svg
                  className="h-4 w-4 text-[#B68A32]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

                Your information is handled securely.
              </div>

              <p className="text-[10px] tracking-[0.15em] text-[#858174] sm:text-xs">
                HOUSE OF DENTAL · CARE FOR EVERY SMILE
              </p>
            </footer>
          )}
        </div>
      </div>
    </section>
  );
}