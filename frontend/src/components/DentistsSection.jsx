import { getDentists, getErrorMessage } from "../api";
import useFetch from "../hooks/useFetch";
import EmptyState from "./EmptyState";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

function DentistPhoto({ photo, name }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="mx-auto h-40 w-40 rounded-full object-cover shadow"
      />
    );
  }

  const initials = name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-brand-light text-4xl font-bold text-brand-dark">
      {initials}
    </div>
  );
}

export default function DentistsSection() {
  const { data, loading, error, reload } = useFetch(getDentists);
  const dentists = data ?? [];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-brand-dark">
            Meet Our Dentists
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Our experienced team is dedicated to making every visit comfortable
            and every smile healthy.
          </p>
        </div>

        {loading && <Loading message="Loading our team..." />}

        {error && (
          <ErrorMessage
            message={getErrorMessage(
              error,
              "We couldn't load our dentists right now."
            )}
            onRetry={reload}
          />
        )}

        {!loading && !error && dentists.length === 0 && (
          <EmptyState
            title="Meet our team soon"
            message="Our dentist profiles will be available here shortly."
          />
        )}

        {!loading && !error && dentists.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {dentists.map((dentist) => (
              <div
                key={dentist.id}
                className="rounded-xl bg-white p-6 text-center shadow-md"
              >
                <DentistPhoto
                  photo={dentist.photo}
                  name={dentist.name}
                />

                <h3 className="mt-4 text-xl font-semibold text-brand-dark">
                  {dentist.name}
                </h3>

                <p className="font-medium text-brand">
                  {dentist.specialization}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {dentist.years_experience} years of experience
                </p>

                <p className="mt-3 text-gray-600">
                  {dentist.bio}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}