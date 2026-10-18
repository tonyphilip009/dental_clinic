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
  "w-full rounded-xl border border-accent/20 bg-black/20 px-4 py-3 text-brand-light outline-none transition duration-300 placeholder:text-brand-light/30 focus:border-accent focus:ring-2 focus:ring-accent/20";

const errorInputClass =
  "border-red-400/70 focus:border-red-400 focus:ring-red-400/20";

const labelClass =
  "mb-2 block text-sm font-medium text-brand-light/85";

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
          className="mt-2 overflow-hidden text-sm text-red-300"
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
      <aside className="lg:order-2">
        <div className="lg:sticky lg:top-28">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Your appointment
            </p>
            <h2 className="mt-2 text-xl font-semibold text-brand-light">
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

          <div className="mt-4 rounded-xl border border-accent/20 bg-brand-dark p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg text-accent" aria-hidden="true">
                ✦
              </span>
              <div>
                <p className="text-sm font-medium text-brand-light">
                  Your information is important
                </p>
                <p className="mt-1 text-xs leading-5 text-brand-light/55">
                  Please enter accurate contact details so the clinic can reach you about your appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <motion.form
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-accent/20 bg-brand-dark shadow-2xl lg:order-1 lg:col-span-2"
      >
        <div className="border-b border-accent/15 bg-gradient-to-br from-accent/10 to-transparent p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Step 3 of your booking
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand-light">
            Your details
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-brand-light/65">
            Tell us a little about yourself so we can prepare for your visit.
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <FormField>
            <label htmlFor="patient-name" className={labelClass}>
              Full name <span className="text-accent">*</span>
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
            <label htmlFor="patient-country" className={labelClass}>
              Country / region <span className="text-accent">*</span>
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
                    className="bg-brand-dark text-brand-light"
                  >
                    {info.flag} {item.name} (+{info.callingCode})
                  </option>
                );
              })}
            </select>
          </FormField>

          <FormField>
            <label htmlFor="patient-phone" className={labelClass}>
              Phone number <span className="text-accent">*</span>
            </label>

            <div className="flex gap-2">
              <div className="flex min-w-[90px] items-center justify-center gap-1 rounded-xl border border-accent/20 bg-black/20 px-3 text-sm text-brand-light">
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

            <p className="mt-2 text-xs leading-5 text-brand-light/45">
              Example: {country?.example}
            </p>

            <FieldError
              id="phone-error"
              message={touched.phone ? errors.phone : ""}
            />
          </FormField>

          <FormField>
            <label htmlFor="patient-email" className={labelClass}>
              Email address <span className="text-accent">*</span>
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

            <p className="mt-2 text-xs leading-5 text-brand-light/45">
              We'll send your appointment verification code to this address.
            </p>

            <FieldError
              id="email-error"
              message={touched.email ? errors.email : ""}
            />
          </FormField>

          <FormField>
            <label htmlFor="patient-message" className={labelClass}>
              Message{" "}
              <span className="font-normal text-brand-light/45">
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

            <div className="mt-2 flex justify-between gap-3 text-xs text-brand-light/45">
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

          <div className="flex flex-col-reverse gap-3 border-t border-accent/15 pt-6 sm:flex-row sm:justify-between">
            <motion.button
              type="button"
              onClick={onBack}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl border border-accent/30 px-5 py-3 font-medium text-brand-light/80 transition hover:border-accent/60 hover:bg-accent/5"
            >
              ← Back
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-accent px-6 py-3 font-semibold text-brand-dark shadow-lg shadow-accent/10 transition hover:bg-gold-light"
            >
              Continue to verification →
            </motion.button>
          </div>

          <p className="text-center text-xs leading-5 text-brand-light/40">
            Fields marked with * are required.
          </p>
        </div>
      </motion.form>
    </motion.div>
  );
}
