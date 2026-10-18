
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import { getDentists, getErrorMessage } from "../api";
import useFetch from "../hooks/useFetch";
import EmptyState from "./EmptyState";
import ErrorMessage from "./ErrorMessage";
import { CardSkeletonGrid } from "./ui/Skeleton";

const EASE = [0.22, 1, 0.36, 1];

function DentistPhoto({ photo, name }) {
  const [imageFailed, setImageFailed] = useState(false);

  const initials = (name || "Dentist")
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const imageUrl = typeof photo === "string" ? photo.trim() : "";

  if (imageUrl && !imageFailed) {
    return (
      <img
        src={imageUrl}
        alt={`Portrait of ${name || "dentist"}`}
        loading="lazy"
        onError={() => setImageFailed(true)}
        className="relative z-20 h-40 w-40 rounded-full border-[5px] border-white bg-[#F6F0E3] object-cover object-center shadow-[0_8px_22px_rgba(21,36,59,0.18)] ring-2 ring-[#D6A83F]/70 transition-transform duration-500 group-hover:scale-[1.04] sm:h-44 sm:w-44 lg:h-48 lg:w-48"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`Profile placeholder for ${name || "dentist"}`}
      className="relative z-20 flex h-40 w-40 items-center justify-center rounded-full border-[5px] border-white bg-gradient-to-br from-[#F8E8C7] to-[#E8D6B3] font-serif text-4xl text-[#15243B] shadow-[0_8px_22px_rgba(21,36,59,0.18)] ring-2 ring-[#D6A83F]/70 sm:h-44 sm:w-44 lg:h-48 lg:w-48"
    >
      {initials || "DR"}
    </div>
  );
}

function DentistCard({ dentist, index, reduceMotion }) {
  const name = dentist.name || "Dental Professional";
  const specialization = dentist.specialization || "Dental Care";
  const experience = dentist.years_experience;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        delay: reduceMotion ? 0 : (index % 3) * 0.12,
        ease: EASE,
      }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      className="group relative flex min-w-0 flex-col items-center rounded-[26px] border border-[#D6A83F]/80 bg-white px-5 pb-7 pt-0 text-center shadow-[0_14px_40px_rgba(21,36,59,0.06)] transition-[border-color,box-shadow] duration-300 hover:border-[#B38A45] hover:shadow-[0_22px_50px_rgba(21,36,59,0.12)] sm:px-7 sm:pb-8"
    >
      {/* Decorative background glow behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-32 w-48 -translate-x-1/2 rounded-full bg-[#F0D58A]/20 blur-3xl"
      />

      {/* Portrait floats above the card */}
      <div className="relative z-10 -mt-16 mb-5 flex items-center justify-center sm:-mt-[76px]">
        <div
          aria-hidden="true"
          className="absolute -inset-2 rounded-full border border-[#D6A83F]/35 transition-transform duration-500 group-hover:scale-105"
        />

        <DentistPhoto photo={dentist.photo} name={name} />
      </div>

      {/* Name */}
      <h3 className="relative mt-1 break-words font-serif text-2xl font-semibold tracking-tight text-[#15243B] sm:text-[27px]">
        {name}
      </h3>

      {/* Specialization */}
      <p className="mt-2 text-base font-medium text-[#B78328] sm:text-lg">
        {specialization}
      </p>

      {/* Experience badge */}
      {experience !== null &&
        experience !== undefined &&
        experience !== "" && (
          <div className="mt-4 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-[#EED9AB] bg-[#FBF1DD] px-4 py-2 text-sm text-[#15243B] sm:px-5">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5 shrink-0 text-[#9B7A42]"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18M8 14h2M8 17h2" />
            </svg>

            <span>
              {experience}{" "}
              {Number(experience) === 1 ? "year" : "years"} of experience
            </span>
          </div>
        )}

      {/* Gold separator */}
      <div
        aria-hidden="true"
        className="my-5 h-[2px] w-12 bg-gradient-to-r from-transparent via-[#D6A83F] to-transparent"
      />

      {/* Biography */}
      <p className="mb-6 w-full flex-1 text-sm leading-7 text-[#60656D] sm:text-base">
        {dentist.bio ||
          `${name} is dedicated to providing thoughtful dental care and helping patients maintain healthy, confident smiles.`}
      </p>

      {/* Profile action: links to the existing booking flow */}
      <Link
        to="/booking"
        className="group/button inline-flex min-h-[54px] w-full max-w-[260px] items-center justify-center gap-3 rounded-full border border-[#D6A83F] bg-gradient-to-r from-[#15243B] to-[#0B172B] px-5 py-3 font-semibold text-[#F8E5B1] shadow-[0_8px_18px_rgba(21,36,59,0.14)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(21,36,59,0.22)]"
      >
        <span>Book an Appointment</span>

        <span
          aria-hidden="true"
          className="text-xl transition-transform duration-300 group-hover/button:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.article>
  );
}

export default function DentistsSection() {
  const { data, loading, error, reload } = useFetch(getDentists);
  const dentists = Array.isArray(data) ? data : [];
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="dentists"
      className="relative overflow-hidden bg-[#FAF8F3] py-20 text-[#15243B] sm:py-24 lg:py-28"
    >
      {/* Soft ivory and gold decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-36 h-72 w-72 rounded-full bg-[#D6A83F]/[0.09] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#E8D6B3]/35 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#15243B]/[0.035] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            ease: EASE,
          }}
          className="mx-auto mb-28 max-w-3xl text-center sm:mb-32"
        >
          <p className="flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#B78328] sm:gap-5 sm:text-sm sm:tracking-[0.25em]">
            <span className="h-px w-8 bg-[#D6A83F] sm:w-12" />
            Experienced Professionals
            <span className="h-px w-8 bg-[#D6A83F] sm:w-12" />
          </p>

          <h2 className="mt-5 font-serif text-4xl font-semibold tracking-[-0.035em] text-[#10213D] sm:text-5xl lg:text-6xl">
            Meet Our Dentists
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#626670] sm:text-lg sm:leading-8">
            Our experienced team is dedicated to making every visit
            comfortable and every smile healthy.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-6 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#C99B32] via-[#F0D58A] to-[#C99B32]"
          />
        </motion.div>

        {/* Loading state */}
        {loading && (
          <CardSkeletonGrid
            count={3}
            className="grid gap-x-6 gap-y-24 sm:grid-cols-2 lg:grid-cols-3"
          />
        )}

        {/* Error state */}
        {error && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-[#D6A83F]/30 bg-white p-6 shadow-sm">
            <ErrorMessage
              message={getErrorMessage(
                error,
                "We couldn't load our dentists right now."
              )}
              onRetry={reload}
            />
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && dentists.length === 0 && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-[#D6A83F]/30 bg-white p-8 text-center shadow-sm">
            <EmptyState
              title="Meet our team soon"
              message="Our dentist profiles will be available here shortly."
            />
          </div>
        )}

        {/* Dentist cards from Django API */}
        {!loading && !error && dentists.length > 0 && (
          <div className="grid grid-cols-1 items-stretch gap-x-6 gap-y-24 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7">
            {dentists.map((dentist, index) => (
              <DentistCard
                key={dentist.id}
                dentist={dentist}
                index={index}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
