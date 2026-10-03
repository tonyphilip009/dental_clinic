import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getErrorMessage, getServices } from "../api";
import BookingSteps from "../components/BookingSteps";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import ServiceIcon from "../components/ServiceIcon";
import useFetch from "../hooks/useFetch";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const { data, loading, error, reload } = useFetch(getServices);
  const services = data ?? [];

  const [step, setStep] = useState(1);
  // A service can be pre-selected from the URL, e.g. /booking?service=3
  const [selectedId, setSelectedId] = useState(
    () => Number(searchParams.get("service")) || null
  );

  const selectedService = services.find((s) => s.id === selectedId) || null;

  const goToStep = (next) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        {/* ---------- Step 1: choose a service ---------- */}
        {step === 1 && (
          <>
            <h2 className="mb-6 text-center text-2xl font-semibold text-brand-dark">
              What would you like to book?
            </h2>

            {loading && <Loading message="Loading services..." />}

            {error && (
              <ErrorMessage
                message={getErrorMessage(
                  error,
                  "We couldn't load our services right now."
                )}
                onRetry={reload}
              />
            )}

            {!loading && !error && services.length === 0 && (
              <EmptyState
                title="Online booking isn't available yet"
                message="Please contact the clinic directly to book your appointment."
              />
            )}

            {!loading && !error && services.length > 0 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => {
                    const isSelected = service.id === selectedId;
                    return (
                      <button
                        type="button"
                        key={service.id}
                        onClick={() => setSelectedId(service.id)}
                        aria-pressed={isSelected}
                        className={`relative rounded-xl bg-white p-5 text-left shadow-md transition ${
                          isSelected
                            ? "ring-2 ring-brand"
                            : "hover:-translate-y-1 hover:shadow-lg"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-sm text-white">
                            ✓
                          </span>
                        )}
                        <ServiceIcon icon={service.icon} name={service.name} />
                        <h3 className="mt-3 text-lg font-semibold text-brand-dark">
                          {service.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {service.description}
                        </p>
                        {service.price && (
                          <p className="mt-3 text-sm font-semibold text-brand">
                            Starting from ₹
                            {Number(service.price).toLocaleString("en-IN")}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-md sm:flex-row">
                  <p className="text-gray-700">
                    {selectedService ? (
                      <>
                        Selected:{" "}
                        <span className="font-semibold text-brand-dark">
                          {selectedService.name}
                        </span>
                      </>
                    ) : (
                      "Please select a service to continue."
                    )}
                  </p>
                  <button
                    type="button"
                    disabled={!selectedService}
                    onClick={() => goToStep(2)}
                    className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ---------- Step 2: placeholder until Day 26 ---------- */}
        {step === 2 && (
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-700">
              Service:{" "}
              <span className="font-semibold text-brand-dark">
                {selectedService?.name}
              </span>
            </p>
            <p className="mt-4 text-gray-500">
              Dentist, date, and time selection comes next.
            </p>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="mt-6 rounded-lg border border-brand px-5 py-2 font-semibold text-brand transition hover:bg-brand-light/30"
            >
              ← Change service
            </button>
          </div>
        )}
      </div>
    </section>
  );
}