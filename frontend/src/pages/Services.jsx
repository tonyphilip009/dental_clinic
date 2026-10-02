import { useEffect, useState } from "react";
import api from "../api";

function ServiceIcon({ icon, name }) {
  if (!icon) return <span className="text-4xl">🦷</span>;
  if (icon.startsWith("http") || icon.startsWith("/")) {
    return <img src={icon} alt={name} className="h-12 w-12 object-contain" />;
  }
  return <span className="text-4xl">{icon}</span>;
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/services/")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setServices(data);
      })
      .catch(() => {
        setError(
          "We couldn't load our services right now. Please try again in a moment."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-brand-dark">Our Services</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            From routine check-ups to complete smile makeovers, we offer gentle,
            modern dental care for the whole family.
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading services...</p>
        )}

        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <ServiceIcon icon={service.icon} name={service.name} />
                <h2 className="mt-4 text-xl font-semibold text-brand-dark">
                  {service.name}
                </h2>
                <p className="mt-2 text-gray-600">{service.description}</p>
                {service.price && (
                  <p className="mt-4 font-semibold text-brand">
                    Starting from ₹{Number(service.price).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}