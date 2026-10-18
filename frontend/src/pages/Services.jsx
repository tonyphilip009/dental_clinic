
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import { getErrorMessage, getServices } from "../api";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { CardSkeletonGrid } from "../components/ui/Skeleton";
import PageHeader from "../components/ui/PageHeader";
import useFetch from "../hooks/useFetch";

const EASE = [0.22, 1, 0.36, 1];

const SERVICE_IMAGES = {
  "complete dental check-up":
    "/image/services/complete-dental-checkup.png",
  "complete dental check up":
    "/image/services/complete-dental-checkup.png",
  "teeth cleaning":
    "/image/services/teeth-cleaning.png",
  "teeth whitening":
    "/image/services/teeth-whitening.png",
  "root canal treatment":
    "/image/services/root-canal-treatment.png",
};

const DJANGO_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

function getServiceImage(service) {
  const uploadedImage = service.image;

  if (uploadedImage) {
    if (/^https?:\/\//i.test(uploadedImage)) {
      return uploadedImage;
    }

    return `${DJANGO_BASE_URL}/${uploadedImage.replace(/^\/+/, "")}`;
  }

  return SERVICE_IMAGES[service.name?.trim().toLowerCase()] || null;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.97,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      delay: (index % 3) * 0.12,
      ease: EASE,
    },
  }),
};

export default function Services() {
  const { data, loading, error, reload } = useFetch(getServices);
  const services = data ?? [];
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-[#FAF8F3] text-[#17243A]">
      <PageHeader
        eyebrow="Expert dental care"
        title="Our Services"
        subtitle="From routine check-ups to complete smile makeovers, we offer gentle, modern dental care for the whole family."
      />

      <section className="relative overflow-hidden bg-[#FAF8F3] py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#D6A83F]/[0.07] blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#17243A]/[0.04] blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease: EASE,
            }}
            className="mb-12 text-center sm:mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A67C2E]">
              Thoughtful care, exceptional results
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#17243A] sm:text-4xl">
              Treatments for every smile
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#596273] sm:text-base">
              Discover personalised dental treatments designed around your
              comfort, confidence, and long-term oral health.
            </p>

            <motion.div
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: reduceMotion ? 0 : 0.8,
                delay: 0.2,
                ease: EASE,
              }}
              className="mx-auto mt-6 h-px w-20 origin-center bg-gradient-to-r from-transparent via-[#C69B45] to-transparent"
            />
          </motion.div>

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
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {services.map((service, index) => {
                const image = getServiceImage(service);

                return (
                  <motion.div
                    key={service.id}
                    custom={index}
                    variants={
                      reduceMotion
                        ? {
                            hidden: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            },
                            visible: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            },
                          }
                        : cardVariants
                    }
                    className="h-full"
                  >
                    <Link
                      to={`/services/${service.id}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#D6A83F]/25 bg-white shadow-[0_5px_24px_rgba(23,36,58,0.045)] transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-[#C69B45]/70 hover:shadow-[0_22px_48px_rgba(23,36,58,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C69B45]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-[#C69B45] via-[#E8D3A1] to-[#C69B45] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                      />

                      {image ? (
                        <div className="relative h-52 overflow-hidden bg-[#F5F0E6] sm:h-56">
                          <motion.img
                            src={image}
                            alt={service.name}
                            loading="lazy"
                            initial={false}
                            whileHover={
                              reduceMotion ? undefined : { scale: 1.05 }
                            }
                            transition={{
                              duration: 0.9,
                              ease: EASE,
                            }}
                            onError={(event) => {
                              const fallback =
                                SERVICE_IMAGES[
                                  service.name?.trim().toLowerCase()
                                ];

                              if (
                                fallback &&
                                event.currentTarget.dataset.fallback !==
                                  "used"
                              ) {
                                event.currentTarget.dataset.fallback = "used";
                                event.currentTarget.src = fallback;
                              } else {
                                event.currentTarget.style.display = "none";
                              }
                            }}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#17243A]/25 via-transparent to-transparent opacity-60 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-30" />

                          <span className="absolute bottom-3 left-4 rounded-full border border-white/40 bg-[#17243A]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                            House of Dental
                          </span>
                        </div>
                      ) : (
                        <div className="flex h-52 items-center justify-center bg-[#F5F0E6] sm:h-56">
                          <span className="text-sm text-[#8B8170]">
                            Image coming soon
                          </span>
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-xl font-semibold leading-snug text-[#17243A] transition-colors duration-500 group-hover:text-[#9C7626]">
                          {service.name}
                        </h3>

                        <p className="mt-3 flex-1 leading-7 text-[#626B78]">
                          {service.description}
                        </p>

                        {service.price !== null &&
                          service.price !== undefined &&
                          service.price !== "" && (
                            <div className="mt-6 border-t border-[#17243A]/[0.08] pt-4">
                              <p className="text-xs uppercase tracking-[0.15em] text-[#85817A]">
                                Starting from
                              </p>

                              <p className="mt-1 text-lg font-semibold text-[#A67C2E]">
                                ₹
                                {Number(service.price).toLocaleString("en-IN")}
                              </p>
                            </div>
                          )}

                        <div className="mt-5 flex items-center justify-between text-sm font-semibold text-[#17243A]">
                          <span className="transition-colors duration-500 group-hover:text-[#9C7626]">
                            Explore treatment
                          </span>

                          <motion.span
                            aria-hidden="true"
                            animate={
                              reduceMotion ? undefined : { x: 0 }
                            }
                            whileHover={
                              reduceMotion ? undefined : { x: 4 }
                            }
                            transition={{
                              duration: 0.4,
                              ease: EASE,
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D6A83F]/30 text-[#A67C2E] transition-[border-color,background-color] duration-500 group-hover:border-[#C69B45] group-hover:bg-[#F7F1E5]"
                          >
                            →
                          </motion.span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
