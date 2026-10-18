
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { getErrorMessage, getGallery } from "../api";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { PhotoSkeletonGrid } from "../components/ui/Skeleton";
import PageHeader from "../components/ui/PageHeader";
import useFetch from "../hooks/useFetch";

const EASE = [0.22, 1, 0.36, 1];

export default function Gallery() {
  const { data, loading, error, reload } = useFetch(getGallery);
  const photos = data ?? [];
  const [selected, setSelected] = useState(null);
  const reduceMotion = useReducedMotion();

  // Close the enlarged photo with the Escape key.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Prevent background scrolling while the lightbox is open.
  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  return (
    <main className="min-h-screen bg-brand-light/20">
      <PageHeader
        eyebrow="A glimpse inside our clinic"
        title="Our Gallery"
        subtitle="Take a look around our clinic and discover the comfortable, modern space where we care for your smile."
      />

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          {loading && <PhotoSkeletonGrid count={8} />}

          {error && (
            <ErrorMessage
              message={getErrorMessage(
                error,
                "We couldn't load the gallery right now."
              )}
              onRetry={reload}
            />
          )}

          {!loading && !error && photos.length === 0 && (
            <EmptyState
              icon="📷"
              title="Photos coming soon"
              message="We're getting our clinic gallery ready. Please check back shortly."
            />
          )}

          {!loading && !error && photos.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo, index) => (
                <motion.button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelected(photo)}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 18 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    delay: reduceMotion ? 0 : (index % 4) * 0.06,
                    ease: EASE,
                  }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  aria-label={`Enlarge photo: ${photo.title}`}
                  className="group overflow-hidden rounded-2xl border border-accent/15 bg-white text-left shadow-sm transition-shadow duration-300 hover:border-accent/40 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  <div className="overflow-hidden">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <p className="p-3 text-sm font-medium text-brand-dark transition-colors group-hover:text-accent sm:p-4">
                    {photo.title}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enlarged photo lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              onClick={() => setSelected(null)}
              aria-label="Close photo"
              autoFocus
            >
              ×
            </button>

            <motion.img
              src={selected.image}
              alt={selected.title}
              className="max-h-[80vh] max-w-full rounded-xl border border-accent/20 object-contain shadow-2xl"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, scale: 0.96, y: 10 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: EASE }}
              onClick={(event) => event.stopPropagation()}
            />

            <p className="mt-4 text-center text-lg font-medium text-[#F5F0E6]">
              {selected.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
