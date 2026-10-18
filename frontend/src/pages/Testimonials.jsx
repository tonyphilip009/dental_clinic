
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

import { getErrorMessage, getTestimonials } from "../api";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import { CardSkeletonGrid } from "../components/ui/Skeleton";
import PageHeader from "../components/ui/PageHeader";
import useFetch from "../hooks/useFetch";

const EASE = [0.22, 1, 0.36, 1];

function Stars({ rating }) {
  const safe = Math.max(
    0,
    Math.min(5, Math.floor(Number(rating) || 0))
  );

  return (
    <div
      className="flex gap-1"
      role="img"
      aria-label={`${safe} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          initial={false}
          animate={
            index < safe
              ? { opacity: 1, scale: 1, color: "#D6A83F" }
              : { opacity: 0.55, scale: 1, color: "#C8C1B4" }
          }
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="text-xl leading-none"
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}

function PatientPhoto({ photo, name }) {
  const initials = (name || "Patient")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <motion.img
        src={photo}
        alt={name || "Patient"}
        loading="lazy"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.35 }}
        className="h-12 w-12 shrink-0 rounded-full border-2 border-[#D6A83F] object-cover shadow-[0_0_18px_rgba(214,168,63,0.2)]"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#D6A83F]/60 bg-[#263650] font-semibold text-[#F0D58A]"
    >
      {initials || "P"}
    </div>
  );
}

function ReviewCard({ testimonial, index, reduceMotion }) {
  return (
    <motion.article
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 35, scale: 0.96 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : (index % 3) * 0.12,
        ease: EASE,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -8, rotateX: 1.5, rotateY: -1 }
      }
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#D6A83F]/20 bg-gradient-to-br from-[#23334B] via-[#17263D] to-[#101722] p-6 shadow-[0_12px_35px_rgba(16,23,34,0.12)] transition-[border-color,box-shadow] duration-500 hover:border-[#D6A83F]/70 hover:shadow-[0_24px_55px_rgba(23,38,61,0.24)] sm:p-7"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Animated gold line */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-transparent via-[#F0D58A] to-transparent"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: reduceMotion ? 0 : 0.9,
          delay: reduceMotion ? 0 : (index % 3) * 0.12 + 0.2,
          ease: EASE,
        }}
      />

      {/* Soft moving background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#D6A83F]/10 blur-[65px] transition-colors duration-500 group-hover:bg-[#D6A83F]/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-[#9AAAC3]/[0.06] blur-[60px]"
      />

      {/* Review header */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <Stars rating={testimonial.rating} />

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E3C47B]">
            Patient experience
          </p>
        </div>

        <motion.span
          aria-hidden="true"
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -5, 0], rotate: [0, 3, 0] }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (index % 3) * 0.4,
          }}
          className="font-serif text-7xl leading-[0.7] text-[#D6A83F]/35 transition-colors duration-300 group-hover:text-[#F0D58A]/70"
        >
          “
        </motion.span>
      </div>

      {/* Review content */}
      <blockquote className="relative mt-7 flex-1">
        <p className="text-[15px] leading-8 text-[#F5F0E6]/90 sm:text-base">
          {testimonial.message}
        </p>
      </blockquote>

      {/* Decorative divider */}
      <div className="relative my-6 h-px overflow-hidden bg-white/10">
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#D6A83F] to-transparent"
          animate={
            reduceMotion ? undefined : { x: ["-100%", "200%"] }
          }
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Patient details */}
      <div className="relative flex items-center gap-3">
        <PatientPhoto
          photo={testimonial.photo}
          name={testimonial.patient_name}
        />

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#FFF9EC]">
            {testimonial.patient_name || "Our patient"}
          </h3>

          <p className="mt-1 text-xs text-[#D5C8AA]">
            Shared experience
          </p>
        </div>

        <motion.div
          aria-hidden="true"
          whileHover={reduceMotion ? undefined : { rotate: 90, scale: 1.1 }}
          className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D6A83F]/30 bg-[#D6A83F]/10 text-[#F0D58A]"
        >
          ✦
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function Testimonials() {
  const { data, loading, error, reload } = useFetch(getTestimonials);
  const testimonials = Array.isArray(data) ? data : [];
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F3EA]">
      {/* PAGE HEADER */}
      <div className="relative isolate overflow-hidden bg-[#100F0D]">
        <PageHeader
          eyebrow="Patient experiences"
          title="What Our Patients Say"
          subtitle="Discover the experiences shared by our patients and the thoughtful care behind every smile."
        />
      </div>

      {/* INTRODUCTION */}
      <section className="relative overflow-hidden px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-20">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#D6A83F]/15 blur-[100px]"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 35, 0],
                  y: [0, 20, 0],
                  scale: [1, 1.12, 1],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#17263D]/[0.08] blur-[90px]"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -25, 0], y: [0, -15, 0] }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            ease: EASE,
          }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9B7A42]">
            Real experiences, thoughtful care
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#17263D] sm:text-4xl lg:text-5xl">
            Every smile has a story.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#686257] sm:text-base">
            We believe great dental care begins with listening,
            understanding, and making every patient feel comfortable.
          </p>

          <motion.div
            aria-hidden="true"
            className="mx-auto mt-7 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#9B7A42] via-[#F0D58A] to-[#9B7A42]"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 0.8,
              delay: reduceMotion ? 0 : 0.2,
              ease: EASE,
            }}
          />
        </motion.div>
      </section>

      {/* TESTIMONIAL CARDS */}
      <section className="relative px-4 pb-20 pt-4 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading && (
            <CardSkeletonGrid
              count={6}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            />
          )}

          {error && (
            <div className="rounded-2xl border border-[#D6A83F]/20 bg-white p-6 shadow-sm">
              <ErrorMessage
                message={getErrorMessage(
                  error,
                  "We couldn't load patient reviews right now."
                )}
                onRetry={reload}
              />
            </div>
          )}

          {!loading && !error && testimonials.length === 0 && (
            <div className="rounded-3xl border border-[#D8D0C0] bg-white p-8 text-center shadow-sm">
              <EmptyState
                icon="⭐"
                title="No reviews yet"
                message="Patient reviews will appear here when they become available."
              />
            </div>
          )}

          {!loading && !error && testimonials.length > 0 && (
            <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <ReviewCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PREMIUM CALL TO ACTION */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
            ease: EASE,
          }}
          className="group relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#D6A83F]/35 bg-gradient-to-br from-[#263750] via-[#17263D] to-[#0E1420] px-6 py-14 text-center shadow-[0_24px_70px_rgba(23,38,61,0.18)] sm:px-12 sm:py-20"
        >
          {/* Animated background lighting */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#D6A83F]/15 blur-[90px]"
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.25, 1], x: [0, -20, 0] }
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#A8B7CC]/10 blur-[90px]"
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.15, 1], y: [0, -15, 0] }
            }
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Moving gold reflection */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
            initial={{ x: "-150%" }}
            whileInView={reduceMotion ? {} : { x: "450%" }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 1.8,
              delay: reduceMotion ? 0 : 0.4,
              ease: EASE,
            }}
          />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F0D58A]">
              Your smile, our priority
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#FFF9EC] sm:text-4xl lg:text-5xl">
              Ready for a more confident smile?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-[#F5F0E6]/75 sm:text-base">
              Experience thoughtful dental care in a welcoming
              environment. Our team is ready to help you take the
              next step.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/booking"
                className="mirror-button mirror-button-gold group/btn relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-xl border border-[#F0D58A] bg-gradient-to-r from-[#D6A83F] to-[#F0D58A] px-7 py-3 font-semibold text-[#171613] shadow-[0_8px_28px_rgba(214,168,63,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(214,168,63,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span
                  aria-hidden="true"
                  className="mirror-shine"
                />
                <span className="relative z-10">
                  Book an Appointment
                </span>
                <motion.span
                  aria-hidden="true"
                  animate={
                    reduceMotion ? undefined : { x: [0, 4, 0] }
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  →
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
