
import { motion, useReducedMotion } from "motion/react";

import { getErrorMessage } from "../api";
import EmptyState from "./EmptyState";
import ErrorMessage from "./ErrorMessage";
import { CardSkeletonGrid } from "./ui/Skeleton";
import ServiceIcon from "./ServiceIcon";

const EASE = [0.22, 1, 0.36, 1];

export default function ServiceStep({
  servicesState,
  selectedId,
  onSelect,
  onContinue,
}) {
  const { data, loading, error, reload } = servicesState;
  const services = data ?? [];
  const selectedService =
    services.find((service) => service.id === selectedId) || null;
  const reduceMotion = useReducedMotion();

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-semibold text-brand-dark">
        What would you like to book?
      </h2>

      {loading && (
        <CardSkeletonGrid
          count={6}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        />
      )}

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
            {services.map((service, index) => {
              const isSelected = service.id === selectedId;

              return (
                <motion.button
                  type="button"
                  key={service.id}
                  onClick={() => onSelect(service.id)}
                  aria-pressed={isSelected}
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 14 }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: isSelected && !reduceMotion ? 1.01 : 1,
                  }}
                  whileHover={
                    reduceMotion ? undefined : { y: -3 }
                  }
                  whileTap={
                    reduceMotion ? undefined : { scale: 0.98 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.3,
                    delay: reduceMotion ? 0 : (index % 3) * 0.05,
                    ease: EASE,
                  }}
                  className={`relative rounded-2xl border bg-white p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    isSelected
                      ? "border-accent ring-2 ring-accent/40 shadow-lg"
                      : "border-accent/15 shadow-sm hover:border-accent/40 hover:shadow-lg"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      initial={reduceMotion ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.2,
                        ease: "backOut",
                      }}
                      className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-sm font-bold text-brand-dark"
                      aria-label="Selected"
                    >
                      ✓
                    </motion.span>
                  )}

                  <ServiceIcon
                    icon={service.icon}
                    name={service.name}
                  />

                  <h3 className="mt-3 pr-7 text-lg font-semibold text-brand-dark">
                    {service.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  {service.price && (
                    <p className="mt-4 text-sm font-semibold text-brand">
                      Starting from ₹
                      {Number(service.price).toLocaleString("en-IN")}
                    </p>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-accent/15 bg-white p-5 shadow-sm sm:flex-row">
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
              onClick={onContinue}
              className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition duration-300 hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Continue →
            </button>
          </div>
        </>
      )}
    </>
  );
}
