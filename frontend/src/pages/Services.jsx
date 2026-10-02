import { Link } from "react-router-dom";
import { getErrorMessage, getServices } from "../api";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import ServiceIcon from "../components/ServiceIcon";
import useFetch from "../hooks/useFetch";

export default function Services() {
  const { data, loading, error, reload } = useFetch(getServices);
  const services = data ?? [];

  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-brand-dark">
            Our Services
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            From routine check-ups to complete smile makeovers, we offer gentle,
            modern dental care for the whole family.
          </p>
        </div>

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
            title="Our services list is coming soon"
            message="Please contact the clinic to ask about the treatments we offer."
          />
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="block rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <ServiceIcon
                  icon={service.icon}
                  name={service.name}
                />

                <h2 className="mt-4 text-xl font-semibold text-brand-dark">
                  {service.name}
                </h2>

                <p className="mt-2 line-clamp-3 text-gray-600">
                  {service.description}
                </p>

                {service.price && (
                  <p className="mt-4 font-semibold text-brand">
                    Starting from ₹
                    {Number(service.price).toLocaleString("en-IN")}
                  </p>
                )}

                <p className="mt-3 text-sm font-medium text-brand-dark">
                  Learn more →
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}