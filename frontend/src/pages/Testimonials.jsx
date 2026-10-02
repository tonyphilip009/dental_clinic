import { getErrorMessage, getTestimonials } from "../api";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import useFetch from "../hooks/useFetch";

function Stars({ rating }) {
  const safe = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <p
      className="text-xl text-yellow-400"
      aria-label={`${safe} out of 5 stars`}
    >
      {"★".repeat(safe)}
      <span className="text-gray-300">
        {"★".repeat(5 - safe)}
      </span>
    </p>
  );
}

function PatientPhoto({ photo, name }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="h-12 w-12 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light font-bold text-brand-dark">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function Testimonials() {
  const { data, loading, error, reload } = useFetch(getTestimonials);
  const testimonials = data ?? [];

  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-brand-dark">
            What Our Patients Say
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Our patients' comfort and confidence mean everything to us. Here is
            what a few of them had to say.
          </p>
        </div>

        {loading && <Loading message="Loading reviews..." />}

        {error && (
          <ErrorMessage
            message={getErrorMessage(
              error,
              "We couldn't load patient reviews right now."
            )}
            onRetry={reload}
          />
        )}

        {!loading && !error && testimonials.length === 0 && (
          <EmptyState
            icon="⭐"
            title="No reviews yet"
            message="We'd love to hear about your visit. Reviews from our patients will appear here soon."
          />
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-xl bg-white p-6 shadow-md"
              >
                <Stars rating={t.rating} />

                <p className="mt-3 text-gray-700">
                  “{t.message}”
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <PatientPhoto
                    photo={t.photo}
                    name={t.patient_name}
                  />

                  <p className="font-semibold text-brand-dark">
                    {t.patient_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}