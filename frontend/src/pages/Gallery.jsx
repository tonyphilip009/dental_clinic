import { useEffect, useState } from "react";
import api from "../api";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api
      .get("/gallery/")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results;

        setPhotos(data);
      })
      .catch(() => {
        setError(
          "We couldn't load the gallery right now. Please try again in a moment."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  // Close the enlarged photo with the Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-6xl px-4">

        {/* Page heading */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-brand-dark">
            Our Gallery
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Take a look around our clinic and see the comfortable, modern
            space where we care for your smile.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading gallery...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-600">
            {error}
          </p>
        )}

        {/* Gallery grid */}
        {!loading && !error && (
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

      {/* Enlarged photo viewer */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
        >
          {/* Close button */}
          <button
            className="absolute right-4 top-4 text-3xl text-white"
            onClick={() => setSelected(null)}
            aria-label="Close photo"
          >
            ✕
          </button>

          {/* Large image */}
          <img
            src={selected.image}
            alt={selected.title}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Photo title */}
          <p className="mt-4 text-lg text-white">
            {selected.title}
          </p>
        </div>
      )}
    </section>
  );
}