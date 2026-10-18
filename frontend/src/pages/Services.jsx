
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import { getErrorMessage, getServices } from "../api";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import ServiceIcon from "../components/ServiceIcon";
import { CardSkeletonGrid } from "../components/ui/Skeleton";
import PageHeader from "../components/ui/PageHeader";
import useFetch from "../hooks/useFetch";

const EASE = [0.22, 1, 0.36, 1];

export default function Services() {
  const { data, loading, error, reload } = useFetch(getServices);
  const services = data ?? [];
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-brand-light/20">
      <PageHeader
        eyebrow="Expert dental care"
        title="Our Services"
        subtitle="From routine check-ups to complete smile makeovers, we offer gentle, modern dental care for the whole family."
      />

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          {loading && (
            <CardSkeletonGrid
              count={6}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
              title="Our services list is coming soon"
              message="Please contact the clinic to ask about the treatments we offer."
            />
          )}

          {!loading && !error && services.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
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
                >
                  <Link
                    to={`/services/${service.id}`}
                    className="group block h-full rounded-2xl border border-accent/15 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <div className="flex h-full flex-col">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-brand-light/30 transition duration-300 group-hover:scale-105 group-hover:bg-accent/10">
                        <ServiceIcon
                          icon={service.icon}
                          name={service.name}
                        />
                      </div>

                      <h2 className="mt-5 text-xl font-semibold text-brand-dark transition-colors group-hover:text-accent">
                        {service.name}
                      </h2>

                      <p className="mt-3 line-clamp-3 flex-1 leading-7 text-gray-600">
                        {service.description}
                      </p>

                      {service.price && (
                        <p className="mt-5 font-semibold text-brand">
                          Starting from ₹
                          {Number(service.price).toLocaleString("en-IN")}
                        </p>
                      )}

                      <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark">
                        Learn more
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
