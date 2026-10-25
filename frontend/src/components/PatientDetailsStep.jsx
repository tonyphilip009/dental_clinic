
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import BookingSummary from "./BookingSummary";

import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCountryInfo,
  validateEmail,
  validateMessage,
  validateName,
  validatePatient,
  validatePhone,
  normalizePhone,
} from "../utils/validation";

const inputClass =
  "w-full rounded-xl border border-[#D8C9A9] bg-white px-4 py-3 text-[#29251D] outline-none transition duration-300 placeholder:text-[#938A7C] focus:border-[#D5A637] focus:ring-2 focus:ring-[#D5A637]/20";

const errorInputClass =
  "border-red-400 focus:border-red-500 focus:ring-red-400/20";

const labelClass =
  "mb-2 block text-sm font-medium text-[#393329]";

const VALIDATORS = {
  name: validateName,
  email: validateEmail,
  message: validateMessage,
};

const FIELD_ORDER = [
  "name",
  "phone",
  "email",
  "message",
];

function FieldError({ message, id }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          className="mt-2 overflow-hidden text-sm text-red-600"
          role="alert"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function FormField({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function PatientDetailsStep({
  service,
  dentist,
  date,
  timeSlot,
  patient,
  countryCode = DEFAULT_COUNTRY,
  onCountryChange,
  onChange,
  onBack,
  onSubmit,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const country = getCountryInfo(countryCode);

  const handleCountryChange = (value) => {
    onCountryChange(value);

    setErrors((current) => ({
      ...current,
      phone: "",
    }));

    setTouched((current) => ({
      ...current,
      phone: false,
    }));
  };

  const handleChange = (field, value) => {
    onChange(field, value);

    if (touched[field]) {
      if (field === "phone") {
        setErrors((current) => ({
          ...current,
          phone: validatePhone(value, countryCode),
        }));

        return;
      }

      const validator = VALIDATORS[field];

      if (validator) {
        const error = validator(value);

        setErrors((current) => ({
          ...current,
          [field]: error,
        }));
      }
    }
  };

  const handleBlur = (field) => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));

    if (field === "phone") {
      setErrors((current) => ({
        ...current,
        phone: validatePhone(patient.phone, countryCode),
      }));

      return;
    }

    const validator = VALIDATORS[field];

    if (validator) {
      setErrors((current) => ({
        ...current,
        [field]: validator(patient[field]),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validatePatient(
      patient,
      countryCode
    );

    setTouched({
      name: true,
      phone: true,
      email: true,
      message: true,
    });

    setErrors(validationErrors);

    const hasErrors = FIELD_ORDER.some(
      (field) => validationErrors[field]
    );

    if (hasErrors) {
      return;
    }

    const normalizedPhone = normalizePhone(
      patient.phone,
      countryCode
    );

    if (!normalizedPhone) {
      setErrors((current) => ({
        ...current,
        phone: validatePhone(patient.phone, countryCode),
      }));

      return;
    }

    onSubmit({
      name: patient.name.trim().replace(/\s+/g, " "),
      phone: normalizedPhone,
      email: patient.email.trim().toLowerCase(),
      message: patient.message.trim(),
      countryCode,
    });
  };

  const fieldProps = (field) => {
    const hasError = touched[field] && errors[field];

    return {
      "aria-invalid": Boolean(hasError),
      "aria-describedby": hasError
        ? `${field}-error`
        : undefined,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="grid items-start gap-8 lg:grid-cols-3"
    >
      {/* Booking summary */}
      <aside className="lg:order-2">
        <div className="lg:sticky lg:top-28">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A97813]">
              Your appointment
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#29251D]">
              Booking summary
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <BookingSummary
              service={service}
              dentist={dentist}
              date={date}
              timeSlot={timeSlot}
            />
          </motion.div>

          <div className="mt-4 rounded-xl border border-[#E7DCC7] bg-[#F7F3EA] p-4">
            <div className="flex items-start gap-3">
              <span
                className="text-lg text-[#B78B2D]"
                aria-hidden="true"
              >
                ✦
              </span>

              <div>
                <p className="text-sm font-medium text-[#29251D]">
                  Your information is important
                </p>

                <p className="mt-1 text-xs leading-5 text-[#756B5D]">
                  Please enter accurate contact details so the
                  clinic can reach you about your appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Patient details form */}
      <motion.form
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-[#E7DCC7] bg-white shadow-[0_12px_40px_rgba(70,53,25,0.07)] lg:order-1 lg:col-span-2"
      >
        {/* Form heading */}
        <div className="border-b border-[#E7DCC7] bg-[#F7F3EA] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A97813]">
            Step 3 of your booking
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#29251D]">
            Your details
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-[#756B5D]">
            Tell us a little about yourself so we can prepare
            for your visit.
          </p>
        </div>

        {/* Form fields */}
        <div className="space-y-6 bg-white p-6 sm:p-8">
          <FormField>
            <label
              htmlFor="patient-name"
              className={labelClass}
            >
              Full name <span className="text-[#B78B2D]">*</span>
            </label>

            <input
              id="patient-name"
              type="text"
              autoComplete="name"
              value={patient.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
              onBlur={() => handleBlur("name")}
              className={`${inputClass} ${
                touched.name && errors.name
                  ? errorInputClass
                  : ""
              }`}
              placeholder="Enter your full name"
              {...fieldProps("name")}
            />

            <FieldError
              id="name-error"
              message={touched.name ? errors.name : ""}
            />
          </FormField>

          <FormField>
            <label
              htmlFor="patient-country"
              className={labelClass}
            >
              Country / region{" "}
              <span className="text-[#B78B2D]">*</span>
            </label>

            <select
              id="patient-country"
              value={countryCode}
              onChange={(e) =>
                handleCountryChange(e.target.value)
              }
              className={inputClass}
            >
              {COUNTRIES.map((item) => {
                const info = getCountryInfo(item.code);

                return (
                  <option
                    key={item.code}
                    value={item.code}
                    className="bg-white text-[#29251D]"
                  >
                    {info.flag} {item.name} (+{info.callingCode})
                  </option>
                );
              })}
            </select>
          </FormField>

          <FormField>
            <label
              htmlFor="patient-phone"
              className={labelClass}
            >
              Phone number{" "}
              <span className="text-[#B78B2D]">*</span>
            </label>

            <div className="flex gap-2">
              <div className="flex min-w-[90px] items-center justify-center gap-1 rounded-xl border border-[#D8C9A9] bg-[#F7F3EA] px-3 text-sm text-[#29251D]">
                <span>{country?.flag}</span>
                <span>+{country?.callingCode}</span>
              </div>

              <input
                id="patient-phone"
                type="tel"
                autoComplete="tel-national"
                value={patient.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
                onBlur={() => handleBlur("phone")}
                className={`min-w-0 flex-1 ${inputClass} ${
                  touched.phone && errors.phone
                    ? errorInputClass
                    : ""
                }`}
                placeholder={
                  country?.example || "Enter your phone number"
                }
                {...fieldProps("phone")}
              />
            </div>

            <p className="mt-2 text-xs leading-5 text-[#938A7C]">
              Example: {country?.example}
            </p>

            <FieldError
              id="phone-error"
              message={touched.phone ? errors.phone : ""}
            />
          </FormField>

          <FormField>
            <label
              htmlFor="patient-email"
              className={labelClass}
            >
              Email address{" "}
              <span className="text-[#B78B2D]">*</span>
            </label>

            <input
              id="patient-email"
              type="email"
              autoComplete="email"
              value={patient.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
              onBlur={() => handleBlur("email")}
              className={`${inputClass} ${
                touched.email && errors.email
                  ? errorInputClass
                  : ""
              }`}
              placeholder="you@example.com"
              {...fieldProps("email")}
            />

            <p className="mt-2 text-xs leading-5 text-[#938A7C]">
              We'll send your appointment verification code
              to this address.
            </p>

            <FieldError
              id="email-error"
              message={touched.email ? errors.email : ""}
            />
          </FormField>

          <FormField>
            <label
              htmlFor="patient-message"
              className={labelClass}
            >
              Message{" "}
              <span className="font-normal text-[#938A7C]">
                (optional)
              </span>
            </label>

            <textarea
              id="patient-message"
              rows={4}
              maxLength={500}
              value={patient.message}
              onChange={(e) =>
                handleChange("message", e.target.value)
              }
              onBlur={() => handleBlur("message")}
              className={`resize-y ${inputClass} ${
                touched.message && errors.message
                  ? errorInputClass
                  : ""
              }`}
              placeholder="Anything you'd like us to know?"
              {...fieldProps("message")}
            />

            <div className="mt-2 flex justify-between gap-3 text-xs text-[#938A7C]">
              <span>Maximum 500 characters</span>

              <span className="tabular-nums">
                {patient.message.length}/500
              </span>
            </div>

            <FieldError
              id="message-error"
              message={touched.message ? errors.message : ""}
            />
          </FormField>

          {/* Navigation buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#E7DCC7] pt-6 sm:flex-row sm:justify-between">
            <motion.button
              type="button"
              onClick={onBack}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl border border-[#D8C9A9] bg-white px-5 py-3 font-medium text-[#393329] transition hover:border-[#D5A637] hover:bg-[#F7F3EA]"
            >
              ← Back
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-[#D5A637] px-6 py-3 font-semibold text-[#29251D] shadow-lg shadow-[#D5A637]/15 transition hover:bg-[#E4BC58]"
            >
              Continue to verification →
            </motion.button>
          </div>

          <p className="text-center text-xs leading-5 text-[#938A7C]">
            Fields marked with * are required.
          </p>
        </div>
      </motion.form>
    </motion.div>
  );
}
