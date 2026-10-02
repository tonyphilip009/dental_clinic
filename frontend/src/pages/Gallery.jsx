import { useEffect, useState } from "react";
import { getErrorMessage, getGallery } from "../api";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import useFetch from "../hooks/useFetch";

export default function Gallery() {
  const { data, loading, error, reload } = useFetch(getGallery);
  const photos = data ?? [];
  const [selected, setSelected] = useState(null);

  // Close the enlarged photo with the Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-brand-dark">
            Our Gallery
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Take a look around our clinic and see the comfortable, modern space
            where we care for your smile.
          </p>
        </div>

        {loading && <Loading message="Loading gallery..." />}

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
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelected(photo)}
                className="group overflow-hidden rounded-xl bg-white shadow-md"
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="aspect-square w-full object-cover transition group-hover:scale-105"
                />

                <p className="p-3 text-sm font-medium text-brand-dark">
                  {photo.title}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute right-4 top-4 text-3xl text-white"
            onClick={() => setSelected(null)}
            aria-label="Close photo"
          >
            ✕
          </button>

          <img
            src={selected.image}
            alt={selected.title}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <p className="mt-4 text-lg text-white">
            {selected.title}
          </p>
        </div>
      )}
    </section>
  );
}