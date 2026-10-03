import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

import { BOOKING_WINDOW_DAYS } from "./dates";


export const MESSAGE_LIMIT = 500;


// Default country
export const DEFAULT_COUNTRY = "GB";


// Common country examples.
// The actual validation is handled by libphonenumber-js,
// not by these examples.
export const PHONE_EXAMPLES = {
  GB: "07123 456789",
  IN: "98765 43210",
  US: "(201) 555-0123",
  CA: "(416) 555-0123",
  AU: "0412 345 678",
  AE: "050 123 4567",
  SG: "8123 4567",
  DE: "0151 23456789",
  FR: "06 12 34 56 78",
  IT: "312 345 6789",
  ES: "612 34 56 78",
  NZ: "021 123 4567",
  ZA: "071 123 4567",
};


// Country names for the dropdown.
// More countries can be added easily later.
export const COUNTRIES = [
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NZ", name: "New Zealand" },
  { code: "ZA", name: "South Africa" },
];


function getFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(
      /./g,
      (char) =>
        String.fromCodePoint(
          127397 + char.charCodeAt()
        )
    );
}


export function getCountryInfo(countryCode) {
  const country = COUNTRIES.find(
    (item) => item.code === countryCode
  );

  if (!country) {
    return null;
  }

  return {
    ...country,
    callingCode: getCountryCallingCode(countryCode),
    flag: getFlagEmoji(countryCode),
    example:
      PHONE_EXAMPLES[countryCode] ||
      "Enter your phone number",
  };
}


export function validateName(value) {
  const name = value
    .trim()
    .replace(/\s+/g, " ");

  if (!name) {
    return "Please enter your full name.";
  }

  if (name.length < 2) {
    return "Your name must be at least 2 characters.";
  }

  if (name.length > 100) {
    return "Your name must be 100 characters or fewer.";
  }

  const NAME_PATTERN =
    /^\p{L}+(?:[ .'’-]+\p{L}+)*\.?$/u;

  if (!NAME_PATTERN.test(name)) {
    return (
      "Names can only contain letters, spaces, apostrophes, " +
      "hyphens and full stops."
    );
  }

  return "";
}


export function normalizePhone(
  value,
  countryCode = DEFAULT_COUNTRY
) {
  const phone = parsePhoneNumberFromString(
    value,
    countryCode
  );

  if (!phone || !phone.isValid()) {
    return null;
  }

  return phone.number;
}


export function validatePhone(
  value,
  countryCode = DEFAULT_COUNTRY
) {
  if (!value.trim()) {
    return "Please enter your phone number.";
  }

  const phone = parsePhoneNumberFromString(
    value,
    countryCode
  );

  if (!phone || !phone.isValid()) {
    const country = getCountryInfo(countryCode);

    return (
      `Enter a valid ${country?.name || "country"} ` +
      `phone number, for example ` +
      `${country?.example || "your local number"}.`
    );
  }

  return "";
}


export function validateEmail(value) {
  const email = value.trim();

  if (!email) {
    return "Please enter your email address.";
  }

  const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (
    email.length > 254 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return (
      "Enter a valid email address, " +
      "for example priya@example.com."
    );
  }

  return "";
}


export function validateMessage(value) {
  if (
    value.trim().length >
    MESSAGE_LIMIT
  ) {
    return (
      `Your message must be ${MESSAGE_LIMIT} ` +
      "characters or fewer."
    );
  }

  return "";
}


export function validatePatient(
  patient,
  countryCode = DEFAULT_COUNTRY
) {
  return {
    name: validateName(patient.name),
    phone: validatePhone(
      patient.phone,
      countryCode
    ),
    email: validateEmail(patient.email),
    message: validateMessage(patient.message),
  };
}


export function validateBookingChoices({
  service,
  dentist,
  date,
  timeSlot,
}) {
  if (!service) {
    return {
      step: 1,
      message: "Please choose a service.",
    };
  }

  if (!dentist) {
    return {
      step: 2,
      message: "Please choose a dentist.",
    };
  }

  if (!date) {
    return {
      step: 2,
      message: "Please pick an appointment date.",
    };
  }

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

  const lastDay = new Date(today);

  lastDay.setDate(
    lastDay.getDate() +
      BOOKING_WINDOW_DAYS
  );

  const lastDayString =
    `${lastDay.getFullYear()}-${String(
      lastDay.getMonth() + 1
    ).padStart(2, "0")}-${String(
      lastDay.getDate()
    ).padStart(2, "0")}`;

  if (date < todayString) {
    return {
      step: 2,
      message:
        "That date has already passed. Please pick a new date.",
    };
  }

  if (date > lastDayString) {
    return {
      step: 2,
      message:
        `Appointments can only be booked up to ` +
        `${BOOKING_WINDOW_DAYS} days in advance.`,
    };
  }

  if (!/^\d{2}:\d{2}$/.test(timeSlot)) {
    return {
      step: 2,
      message: "Please choose a time slot.",
    };
  }

  return null;
}