import { motion, useReducedMotion } from "motion/react";

import { getErrorMessage } from "../api";
import EmptyState from "./EmptyState";
import ErrorMessage from "./ErrorMessage";
import { CardSkeletonGrid } from "./ui/Skeleton";

const EASE = [0.22, 1, 0.36, 1];

// Same image references as Services.jsx
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

// Same Django base URL configuration as Services.jsx
const DJANGO_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

// Resolve the image using the same logic as the Services page
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

export default function ServiceStep({
  servicesState,
  selectedId,
  onSelect,
  onContinue,
}) {
  const { data, loading, error, reload } = servicesState;
  const services = data ?? [];

  const selectedService =
    services.find((service) => service.id === selectedId) || null;

  const reduceMotion = useReducedMotion();

  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-semibold text-[#17243A]">
        What would you like to book?
      </h2>

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
          title="Online booking isn't available yet"
          message="Please contact the clinic directly to book your appointment."
        />
      )}

      {!loading && !error && services.length > 0 && (
        <>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const isSelected = service.id === selectedId;
              const image = getServiceImage(service);

              return (
                <motion.button
                  type="button"
                  key={service.id}
                  onClick={() => onSelect(service.id)}
                  aria-pressed={isSelected}
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 24 }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale:
                      isSelected && !reduceMotion ? 1.01 : 1,
                  }}
                  whileHover={
                    reduceMotion ? undefined : { y: -4 }
                  }
                  whileTap={
                    reduceMotion ? undefined : { scale: 0.985 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    delay: reduceMotion ? 0 : (index % 3) * 0.08,
                    ease: EASE,
                  }}
                  className={[
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white text-left",
                    "transition-[border-color,box-shadow] duration-500",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C69B45]",
                    isSelected
                      ? "border-[#C69B45] shadow-[0_16px_40px_rgba(198,155,69,0.18)] ring-2 ring-[#C69B45]/30"
                      : "border-[#D6A83F]/25 shadow-[0_5px_24px_rgba(23,36,58,0.045)] hover:border-[#C69B45]/70 hover:shadow-[0_18px_40px_rgba(23,36,58,0.12)]",
                  ].join(" ")}
                >
                  {/* Service image */}
                  <div className="relative h-52 overflow-hidden bg-[#F5F0E6] sm:h-56">
                    {image ? (
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
                          // Match the Services.jsx fallback behavior.
                          const fallback =
                            SERVICE_IMAGES[
                              service.name?.trim().toLowerCase()
                            ];

                          if (
                            fallback &&
                            event.currentTarget.dataset.fallback !== "used"
                          ) {
                            event.currentTarget.dataset.fallback = "used";
                            event.currentTarget.src = fallback;
                          } else {
                            event.currentTarget.style.display = "none";
                          }
                        }}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-[#8B8170]">
                          Image coming soon
                        </span>
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#17243A]/35 via-transparent to-transparent" />

                    <span className="absolute bottom-3 left-4 rounded-full border border-white/40 bg-[#17243A]/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                      House of Dental
                    </span>

                    {isSelected && (
                      <motion.span
                        initial={reduceMotion ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.25,
                          ease: "backOut",
                        }}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#D6A83F] text-base font-bold text-[#17243A] shadow-lg"
                        aria-label="Selected"
                      >
                        ✓
                      </motion.span>
                    )}
                  </div>

                  {/* Service information */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-lg font-semibold leading-snug text-[#17243A] transition-colors duration-500 group-hover:text-[#9C7626] sm:text-xl">
                      {service.name}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-7 text-[#626B78]">
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

                    <div className="mt-5 flex items-center justify-between gap-3 text-sm font-semibold text-[#17243A]">
                      <span className="transition-colors duration-300 group-hover:text-[#9C7626]">
                        {isSelected
                          ? "Treatment selected"
                          : "Select treatment"}
                      </span>

                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                          isSelected
                            ? "border-[#C69B45] bg-[#D6A83F] text-[#17243A]"
                            : "border-[#D6A83F]/30 text-[#A67C2E] group-hover:border-[#C69B45] group-hover:bg-[#F7F1E5]",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected service and Continue button */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#D6A83F]/25 bg-[#FCFAF6] p-5 shadow-sm sm:flex-row sm:p-6">
            <div className="text-center sm:text-left">
              {selectedService ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A67C2E]">
                    Your selection
                  </p>

                  <p className="mt-1 font-semibold text-[#17243A]">
                    {selectedService.name}
                  </p>

                  <p className="mt-1 text-sm text-[#626B78]">
                    Continue to choose your dentist and appointment time.
                  </p>
                </>
              ) : (
                <p className="text-sm text-[#525A60]">
                  Please select a service to continue.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!selectedService}
              onClick={onContinue}
              className="w-full rounded-xl bg-[#D6A83F] px-7 py-3.5 font-semibold text-[#171A20] shadow-sm transition duration-300 hover:bg-[#E5C36D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67C2E] disabled:cursor-not-allowed disabled:bg-[#D6D4CF] disabled:text-[#77756F] disabled:shadow-none sm:w-auto"
            >
              Continue <span aria-hidden="true">→</span>
            </button>
          </div>
        </>
      )}
    </>
  );
}