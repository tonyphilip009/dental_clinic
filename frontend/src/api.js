import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api",
  timeout: 10000,
});

// DRF returns either a plain list or { results: [...] } when paginated
const unwrapList = (data) =>
  Array.isArray(data) ? data : data.results ?? [];

export const getServices = () =>
  api.get("/services/").then((res) => unwrapList(res.data));

export const getService = (id) =>
  api.get(`/services/${id}/`).then((res) => res.data);

export const getDentists = () =>
  api.get("/dentists/").then((res) => unwrapList(res.data));

export const getTestimonials = () =>
  api.get("/testimonials/").then((res) => unwrapList(res.data));

export const getGallery = () =>
  api.get("/gallery/").then((res) => unwrapList(res.data));

// Used by the booking flow (Days 25-30)
export const getAvailability = (dentistId, date) =>
  api
    .get("/availability/", {
      params: {
        dentist: dentistId,
        date,
      },
    })
    .then((res) => res.data.available_slots);

export const createAppointment = (payload) =>
  api.post("/appointments/", payload).then((res) => res.data);

// Day 29 — Email OTP
export const sendOtp = (email) =>
  api.post("/otp/send/", { email }).then((res) => res.data);

export const verifyOtp = (email, code) =>
  api
    .post("/otp/verify/", {
      email,
      code,
    })
    .then((res) => res.data);

// Day 32 — Appointment cancellation
// Fetch appointment details using the private cancellation token.
export const getCancellation = (token) =>
  api
    .get(`/appointments/cancel/${encodeURIComponent(token)}/`)
    .then((res) => res.data);

// Cancel an appointment using the private cancellation token.
export const cancelAppointment = (token) =>
  api
    .post(`/appointments/cancel/${encodeURIComponent(token)}/`)
    .then((res) => res.data);

// Turns any Axios error into a message that is safe to show a patient
export function getErrorMessage(
  err,
  fallback = "Something went wrong. Please try again."
) {
  if (!err || !err.response) {
    return "We can't reach the server right now. Please check your connection and try again.";
  }

  const data = err.response.data;

  if (data && typeof data === "object") {
    // API errors, including cancellation errors
    if (typeof data.error === "string") {
      return data.error;
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }

    const first = Object.values(data)[0];
    const message = Array.isArray(first) ? first[0] : first;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}

export default api;