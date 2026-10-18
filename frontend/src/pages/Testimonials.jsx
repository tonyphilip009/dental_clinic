
import { motion, useReducedMotion } from "motion/react";

import { getErrorMessage, getTestimonials } from "../api";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { CardSkeletonGrid } from "../components/ui/Skeleton";
import PageHeader from "../components/ui/PageHeader";
import useFetch from "../hooks/useFetch";

const EASE = [0.22, 1, 0.36, 1];

function Stars({ rating }) {
  const safe = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <p
      className="text-xl text-[#D6A83F]"
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
        alt={`${name}`}
        loading="lazy"
        className="h-12 w-12 rounded-full border border-accent/20 object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-brand-light font-bold text-brand-dark"
    >
      {name?.charAt(0).toUpperCase() || "P"}
    </div>
  );
}

export default function Testimonials() {
  const { data, loading, error, reload } = useFetch(getTestimonials);
  const testimonials = data ?? [];
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-brand-light/20">
      <PageHeader
        eyebrow="Patient experiences"
        title="What Our Patients Say"
        subtitle="Our patients' comfort and confidence mean everything to us. Here is what a few of them had to say."
      />

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          {loading && (
            <CardSkeletonGrid
              count={6}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            />
          )}

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
              {testimonials.map((testimonial, index) => (
                <motion.article
                  key={testimonial.id}
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
                  whileHover={
                    reduceMotion ? undefined : { y: -4 }
                  }
                  className="flex h-full flex-col rounded-2xl border border-accent/15 bg-white p-6 shadow-sm transition-shadow duration-300 hover:border-accent/35 hover:shadow-xl hover:shadow-black/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Stars rating={testimonial.rating} />

                    <span
                      aria-hidden="true"
                      className="font-serif text-5xl leading-none text-accent/40"
                    >
                      “
                    </span>
                  </div>

                  <p className="mt-3 flex-1 leading-7 text-gray-700">
                    “{testimonial.message}”
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-accent/15 pt-5">
                    <PatientPhoto
                      photo={testimonial.photo}
                      name={testimonial.patient_name}
                    />

                    <p className="font-semibold text-brand-dark">
                      {testimonial.patient_name}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
