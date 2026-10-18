
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";

import { getErrorMessage, getGallery } from "../api";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { PhotoSkeletonGrid } from "../components/ui/Skeleton";
import PageHeader from "../components/ui/PageHeader";
import useFetch from "../hooks/useFetch";

const EASE = [0.22, 1, 0.36, 1];

export default function Gallery() {
  const { data, loading, error, reload } = useFetch(getGallery);
  const photos = Array.isArray(data) ? data : [];
  const [selected, setSelected] = useState(null);
  const reduceMotion = useReducedMotion();

  // Close the lightbox with Escape and navigate with arrow keys.
  useEffect(() => {
    if (!selected) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setSelected(null);

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        setSelected((current) => {
          if (!current || photos.length < 2) return current;

          const index = photos.findIndex(
            (photo) => photo.id === current.id
          );

          if (index < 0) return current;

          const direction = event.key === "ArrowRight" ? 1 : -1;
          const nextIndex =
            (index + direction + photos.length) % photos.length;

          return photos[nextIndex];
        });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, photos]);

  // Prevent background scrolling while the lightbox is open.
  useEffect(() => {
    if (!selected) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  const reveal = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.65,
        ease: EASE,
      },
    },
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F3EA]">
      {/* PREMIUM PAGE HEADER */}
      <div className="relative isolate overflow-hidden bg-[#100F0D]">
        <PageHeader
          eyebrow="A glimpse inside our clinic"
          title="Our Gallery"
          subtitle="Take a look around our clinic and discover the comfortable, modern space where we care for your smile."
        />
      </div>

      {/* GALLERY SECTION */}
      <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-[#D6A83F]/[0.07] blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl">
          {/* Section introduction */}
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12 },
              },
            }}
            className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end"
          >
            <div>
              <motion.p
                variants={reveal}
                className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9B7A42]"
              >
                Inside House of Dental
              </motion.p>

              <motion.h2
                variants={reveal}
                className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#17263D] sm:text-4xl"
              >
                A closer look at our world
              </motion.h2>

              <motion.p
                variants={reveal}
                className="mt-3 max-w-xl text-sm leading-7 text-[#686257] sm:text-base"
              >
                Every detail is designed around comfort, confidence,
                and care.
              </motion.p>
            </div>

            {!loading && !error && photos.length > 0 && (
              <motion.div
                variants={reveal}
                className="flex items-center gap-3 self-start rounded-full border border-[#D6A83F]/30 bg-white/80 px-4 py-2 sm:self-auto"
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[#B58A35]"
                />
                <span className="text-xs font-semibold tracking-wide text-[#514A3F]">
                  {photos.length}{" "}
                  {photos.length === 1 ? "photograph" : "photographs"}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Loading state */}
          {loading && <PhotoSkeletonGrid count={8} />}

          {/* Error state */}
          {error && (
            <div className="rounded-2xl border border-[#D6A83F]/20 bg-white p-6 shadow-sm">
              <ErrorMessage
                message={getErrorMessage(
                  error,
                  "We couldn't load the gallery right now."
                )}
                onRetry={reload}
              />
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && photos.length === 0 && (
            <div className="rounded-3xl border border-[#D8D0C0] bg-white p-8 text-center shadow-sm">
              <EmptyState
                icon="📷"
                title="Photos coming soon"
                message="We're getting our clinic gallery ready. Please check back shortly."
              />
            </div>
          )}

          {/* Animated gallery cards */}
          {!loading && !error && photos.length > 0 && (
            <motion.div
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.09,
                  },
                },
              }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3"
            >
              {photos.map((photo, index) => (
                <motion.button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelected(photo)}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: reduceMotion ? 0 : 28,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: reduceMotion ? 0 : 0.65,
                        ease: EASE,
                      },
                    },
                  }}
                  whileHover={
                    reduceMotion ? undefined : { y: -7 }
                  }
                  whileTap={
                    reduceMotion ? undefined : { scale: 0.99 }
                  }
                  aria-label={`Enlarge photo: ${photo.title}`}
                  className="group relative overflow-hidden rounded-[1.4rem] border border-[#D6A83F]/20 bg-white text-left shadow-[0_10px_30px_rgba(23,38,61,0.07)] transition-[border-color,box-shadow] duration-500 hover:border-[#D6A83F]/70 hover:shadow-[0_24px_50px_rgba(23,38,61,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B58A35] focus-visible:ring-offset-4"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE2D1]">
                    <motion.img
                      src={photo.image}
                      alt={photo.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      whileHover={
                        reduceMotion ? undefined : { scale: 1.07 }
                      }
                      transition={{
                        duration: reduceMotion ? 0 : 0.8,
                        ease: EASE,
                      }}
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090908]/85 via-[#090908]/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Top label */}
                    <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-[#100F0D]/65 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F0D58A] backdrop-blur-md">
                      House of Dental
                    </span>

                    {/* View icon */}
                    <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/25 text-lg text-white backdrop-blur-sm transition-all duration-300 group-hover:rotate-45 group-hover:border-[#D6A83F] group-hover:text-[#F0D58A]">
                      ↗
                    </span>

                    {/* Image caption */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F0D58A]">
                        Gallery · {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="text-lg font-semibold leading-snug text-white sm:text-xl">
                        {photo.title}
                      </h3>

                      <div className="mt-3 h-px w-10 bg-[#D6A83F] transition-all duration-500 group-hover:w-16" />

                      <p className="mt-3 translate-y-1 text-xs font-medium text-white/80 opacity-100 transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        Click to explore photograph →
                      </p>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
                    <p className="text-sm font-medium text-[#17263D] transition-colors duration-300 group-hover:text-[#9B7A42]">
                      {photo.title}
                    </p>

                    <span
                      aria-hidden="true"
                      className="shrink-0 text-sm text-[#B58A35] transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: EASE }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#D6A83F]/30 bg-gradient-to-br from-[#17263D] via-[#17263D] to-[#101722] px-6 py-12 text-center text-white sm:px-12 sm:py-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#D6A83F]/10 blur-[80px]"
          />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#F0D58A]">
              Your smile, our priority
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your visit could be next.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Ready to experience thoughtful dental care? Take the next
              step towards a healthier, more confident smile.
            </p>

            <a
              href="/booking"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-[#F0D58A] bg-gradient-to-r from-[#D6A83F] to-[#F0D58A] px-6 py-3 text-sm font-semibold text-[#171613] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Book an Appointment
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* ENLARGED PHOTO LIGHTBOX */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={selected.title || "Gallery photograph"}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080807]/95 p-4 backdrop-blur-md sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            onClick={() => setSelected(null)}
          >
            {/* Close */}
            <button
              type="button"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:border-[#D6A83F] hover:text-[#F0D58A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A83F]"
              onClick={() => setSelected(null)}
              aria-label="Close photo"
              autoFocus
            >
              ×
            </button>

            {/* Previous */}
            {photos.length > 1 && (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(event) => {
                  event.stopPropagation();
                  const index = photos.findIndex(
                    (photo) => photo.id === selected.id
                  );
                  setSelected(
                    photos[(index - 1 + photos.length) % photos.length]
                  );
                }}
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:border-[#D6A83F] hover:text-[#F0D58A] sm:left-6"
              >
                ‹
              </button>
            )}

            {/* Next */}
            {photos.length > 1 && (
              <button
                type="button"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation();
                  const index = photos.findIndex(
                    (photo) => photo.id === selected.id
                  );
                  setSelected(photos[(index + 1) % photos.length]);
                }}
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:border-[#D6A83F] hover:text-[#F0D58A] sm:right-6"
              >
                ›
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={
                  reduceMotion ? false : { opacity: 0, scale: 0.97, y: 10 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-5xl"
              >
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="mx-auto max-h-[72vh] w-full rounded-2xl border border-[#D6A83F]/25 object-contain shadow-2xl"
                />

                <div className="mt-5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F0D58A]">
                    House of Dental
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    {selected.title}
                  </h3>

                  <p className="mt-2 text-xs text-white/55">
                    {photos.findIndex((photo) => photo.id === selected.id) + 1}
                    {" / "}
                    {photos.length}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
