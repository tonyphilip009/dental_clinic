import { useState } from "react";

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
  "w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

const errorInputClass =
  "border-red-500 focus:border-red-500 focus:ring-red-200";

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
  if (!message) return null;

  return (
    <p
      id={id}
      className="mt-1 text-sm text-red-600"
      role="alert"
    >
      {message}
    </p>
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
  const [errors, setErrors] =
    useState({});

  const [touched, setTouched] =
    useState({});

  const country =
    getCountryInfo(countryCode);

  const handleCountryChange = (
    value
  ) => {
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

  const handleChange = (
    field,
    value
  ) => {
    onChange(field, value);

    if (touched[field]) {
      if (field === "phone") {
        setErrors((current) => ({
          ...current,
          phone: validatePhone(
            value,
            countryCode
          ),
        }));

        return;
      }

      const validator =
        VALIDATORS[field];

      if (validator) {
        const error =
          validator(value);

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
        phone: validatePhone(
          patient.phone,
          countryCode
        ),
      }));

      return;
    }

    const validator =
      VALIDATORS[field];

    if (validator) {
      setErrors((current) => ({
        ...current,
        [field]: validator(
          patient[field]
        ),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors =
      validatePatient(
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

    const hasErrors =
      FIELD_ORDER.some(
        (field) =>
          validationErrors[field]
      );

    if (hasErrors) {
      return;
    }

    const normalizedPhone =
      normalizePhone(
        patient.phone,
        countryCode
      );

    if (!normalizedPhone) {
      setErrors((current) => ({
        ...current,
        phone: validatePhone(
          patient.phone,
          countryCode
        ),
      }));

      return;
    }

    onSubmit({
      name: patient.name
        .trim()
        .replace(/\s+/g, " "),

      phone: normalizedPhone,

      email: patient.email
        .trim()
        .toLowerCase(),

      message:
        patient.message.trim(),

      countryCode,
    });
  };

  const fieldProps = (field) => {
    const hasError =
      touched[field] &&
      errors[field];

    return {
      "aria-invalid":
        Boolean(hasError),

      "aria-describedby":
        hasError
          ? `${field}-error`
          : undefined,
    };
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
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
        noValidate
        className="space-y-5 rounded-xl bg-white p-6 shadow-md lg:order-1 lg:col-span-2"
      >
        <div>
          <label
            htmlFor="patient-name"
            className="mb-1 block font-medium text-gray-700"
          >
            Full Name
          </label>

          <input
            id="patient-name"
            type="text"
            value={patient.name}
            onChange={(e) =>
              handleChange(
                "name",
                e.target.value
              )
            }
            onBlur={() =>
              handleBlur("name")
            }
            className={`${inputClass} ${
              touched.name &&
              errors.name
                ? errorInputClass
                : ""
            }`}
            placeholder="Enter your full name"
            {...fieldProps("name")}
          />

          <FieldError
            id="name-error"
            message={errors.name}
          />
        </div>

        <div>
          <label
            htmlFor="patient-country"
            className="mb-1 block font-medium text-gray-700"
          >
            Country
          </label>

          <select
            id="patient-country"
            value={countryCode}
            onChange={(e) =>
              handleCountryChange(
                e.target.value
              )
            }
            className={inputClass}
          >
            {COUNTRIES.map(
              (item) => {
                const info =
                  getCountryInfo(
                    item.code
                  );

                return (
                  <option
                    key={item.code}
                    value={item.code}
                  >
                    {info.flag}{" "}
                    {item.name}{" "}
                    (+{info.callingCode})
                  </option>
                );
              }
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="patient-phone"
            className="mb-1 block font-medium text-gray-700"
          >
            Phone Number
          </label>

          <div className="flex gap-2">
            <div className="flex min-w-[90px] items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-3 text-gray-700">
              <span className="mr-1">
                {country?.flag}
              </span>

              <span>
                +{country?.callingCode}
              </span>
            </div>

            <input
              id="patient-phone"
              type="tel"
              value={patient.phone}
              onChange={(e) =>
                handleChange(
                  "phone",
                  e.target.value
                )
              }
              onBlur={() =>
                handleBlur("phone")
              }
              className={`flex-1 ${inputClass} ${
                touched.phone &&
                errors.phone
                  ? errorInputClass
                  : ""
              }`}
              placeholder={
                country?.example ||
                "Enter your phone number"
              }
              {...fieldProps("phone")}
            />
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Example:{" "}
            {country?.example}
          </p>

          <FieldError
            id="phone-error"
            message={errors.phone}
          />
        </div>

        <div>
          <label
            htmlFor="patient-email"
            className="mb-1 block font-medium text-gray-700"
          >
            Email Address
          </label>

          <input
            id="patient-email"
            type="email"
            value={patient.email}
            onChange={(e) =>
              handleChange(
                "email",
                e.target.value
              )
            }
            onBlur={() =>
              handleBlur("email")
            }
            className={`${inputClass} ${
              touched.email &&
              errors.email
                ? errorInputClass
                : ""
            }`}
            placeholder="you@example.com"
            {...fieldProps("email")}
          />

          <FieldError
            id="email-error"
            message={errors.email}
          />
        </div>

        <div>
          <label
            htmlFor="patient-message"
            className="mb-1 block font-medium text-gray-700"
          >
            Message

            <span className="ml-1 text-sm font-normal text-gray-500">
              (optional)
            </span>
          </label>

          <textarea
            id="patient-message"
            rows="4"
            value={patient.message}
            onChange={(e) =>
              handleChange(
                "message",
                e.target.value
              )
            }
            onBlur={() =>
              handleBlur("message")
            }
            className={`${inputClass} ${
              touched.message &&
              errors.message
                ? errorInputClass
                : ""
            }`}
            placeholder="Anything you'd like us to know?"
            {...fieldProps("message")}
          />

          <div className="mt-1 flex justify-between text-sm text-gray-500">
            <span>
              Maximum 500 characters
            </span>

            <span>
              {patient.message.length}/500
            </span>
          </div>

          <FieldError
            id="message-error"
            message={errors.message}
          />
        </div>

        <div className="flex justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            ← Back
          </button>

          <button
            type="submit"
            className="rounded-lg bg-brand px-6 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}