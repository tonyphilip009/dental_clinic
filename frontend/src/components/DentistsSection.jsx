
import { motion, useReducedMotion } from "motion/react";

import { getDentists, getErrorMessage } from "../api";
import useFetch from "../hooks/useFetch";
import EmptyState from "./EmptyState";
import ErrorMessage from "./ErrorMessage";
import { CardSkeletonGrid } from "./ui/Skeleton";

const EASE = [0.22, 1, 0.36, 1];

function DentistPhoto({ photo, name }) {
  const initials = (name || "Dentist")
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className="mx-auto h-40 w-40 rounded-full border-2 border-accent/30 object-cover shadow-md transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div
      aria-label={`${name} profile`}
      className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-2 border-accent/30 bg-brand-light text-4xl font-bold text-brand-dark shadow-md"
    >
      {initials}
    </div>
  );
}

export default function DentistsSection() {
  const { data, loading, error, reload } = useFetch(getDentists);
  const dentists = data ?? [];
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-brand-light/20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
            Experienced professionals
          </p>

          <h2 className="mt-2 text-3xl font-bold text-brand-dark sm:text-4xl">
            Meet Our Dentists
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Our experienced team is dedicated to making every visit comfortable
            and every smile healthy.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </div>

        {loading && (
          <CardSkeletonGrid
            count={3}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          />
        )}

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
            {dentists.map((dentist, index) => (
              <motion.article
                key={dentist.id}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : (index % 3) * 0.08,
                  ease: EASE,
                }}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                className="group rounded-2xl border border-accent/15 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-black/10 sm:p-8"
              >
                <DentistPhoto
                  photo={dentist.photo}
                  name={dentist.name}
                />

                <h3 className="mt-5 text-xl font-semibold text-brand-dark">
                  {dentist.name}
                </h3>

                <p className="mt-2 font-medium text-brand">
                  {dentist.specialization}
                </p>

                <p className="mt-2 inline-flex rounded-full border border-accent/20 bg-brand-light/40 px-3 py-1 text-xs font-medium text-brand-dark">
                  {dentist.years_experience} years of experience
                </p>

                {dentist.bio && (
                  <p className="mt-4 leading-7 text-gray-600">
                    {dentist.bio}
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
