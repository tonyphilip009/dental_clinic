import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import ServiceIcon from "../components/ServiceIcon";

export default function ServiceDetail() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get(`/services/${id}/`)
      .then((res) => {
        setService(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setError("Sorry, we couldn't find that service.");
        } else {
          setError(
            "We couldn't load this service right now. Please try again in a moment."
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-3xl px-4">

        <Link
          to="/services"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to all services
        </Link>

        {loading && (
          <p className="mt-8 text-gray-500">
            Loading service...
          </p>
        )}

        {error && (
          <p className="mt-8 text-red-600">
            {error}
          </p>
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