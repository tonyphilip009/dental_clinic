import { Link, useParams } from "react-router-dom";
import { getErrorMessage, getService } from "../api";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import ServiceIcon from "../components/ServiceIcon";
import useFetch from "../hooks/useFetch";

export default function ServiceDetail() {
  const { id } = useParams();

  const { data: service, loading, error, reload } = useFetch(
    () => getService(id),
    [id]
  );

  const notFound = error?.response?.status === 404;

  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          to="/services"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to all services
        </Link>

        {loading && <Loading message="Loading service..." />}

        {error && notFound && (
          <div className="mt-8">
            <ErrorMessage message="Sorry, we couldn't find that service." />
          </div>
        )}

        {error && !notFound && (
          <div className="mt-8">
            <ErrorMessage
              message={getErrorMessage(
                error,
                "We couldn't load this service right now."
              )}
              onRetry={reload}
            />
          </div>
        )}

        {!loading && !error && service && (
          <div className="mt-6 rounded-xl bg-white p-8 shadow-md">
            <ServiceIcon
              icon={service.icon}
              name={service.name}
              size="text-6xl"
            />

            <h1 className="mt-4 text-3xl font-bold text-brand-dark">
              {service.name}
            </h1>

            {service.price && (
              <p className="mt-2 text-lg font-semibold text-brand">
                Starting from ₹
                {Number(service.price).toLocaleString("en-IN")}
              </p>
            )}

            <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-700">
              {service.description}
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
            >
              Book an Appointment
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}