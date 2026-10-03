import { getErrorMessage } from "../api";
import EmptyState from "./EmptyState";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import ServiceIcon from "./ServiceIcon";

export default function ServiceStep({
  servicesState,
  selectedId,
  onSelect,
  onContinue,
}) {
  const { data, loading, error, reload } = servicesState;
  const services = data ?? [];
  const selectedService = services.find((s) => s.id === selectedId) || null;

  return (
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
                  onClick={() => onSelect(service.id)}
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
              onClick={onContinue}
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </>
      )}
    </>
  );
}