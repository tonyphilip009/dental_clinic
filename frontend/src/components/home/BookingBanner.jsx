import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

export default function BookingBanner() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="booking-banner"
      className="relative overflow-hidden bg-[#FAF8F3] px-5 py-12 sm:py-16 lg:px-8 lg:py-20"
    >
      {/* Soft background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 top-10 h-72 w-72 rounded-full bg-[#D8BC83]/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#15243B]/[0.06] blur-3xl"
      />

      {/* Compact CTA panel */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-6xl"
      >
        <div className="group relative overflow-hidden rounded-3xl border border-[#D8BC83]/40 bg-[#15243B] px-6 py-10 shadow-[0_20px_50px_rgba(21,36,59,0.14)] sm:px-10 sm:py-12 lg:px-16 lg:py-14">

          {/* Champagne glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#D8BC83]/15 blur-3xl"
          />

          {/* Slate-blue glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-[#7188A6]/15 blur-3xl"
          />

          {/* Subtle central lighting */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(216,188,131,0.09),transparent_65%)]"
          />

          {/* Inner border */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 rounded-[1.3rem] border border-white/[0.07] sm:inset-4"
          />

          {/* Animated gold reflection */}
          {!shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-16 left-[-45%] w-1/3 rotate-[18deg] bg-gradient-to-r from-transparent via-[#F0D58A]/[0.07] to-transparent"
              animate={{ left: ["-45%", "120%"] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Content */}
          <motion.div
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.1,
                },
              },
            }}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative z-10 mx-auto max-w-3xl text-center"
          >
            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              className="flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E4C783] sm:text-xs sm:tracking-[0.32em]"
            >
              <span className="h-px w-7 bg-[#D8BC83]/80" />

              Your Smile Deserves It

              <span className="h-px w-7 bg-[#D8BC83]/80" />
            </motion.p>

            {/* Heading */}
            <motion.h2
              variants={fadeUp}
              className="mt-5 text-3xl font-semibold leading-[1.15] tracking-[-0.04em] text-[#FAF5EB] sm:text-4xl lg:text-5xl"
            >
              A Smile You'll Love.
              <span className="welcome-gold-text mt-2 block font-serif font-medium italic">
                Care You Can Trust.
              </span>
            </motion.h2>

            {/* Gold accent */}
            <motion.div
              variants={fadeUp}
              className="mx-auto mt-5 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#9B7A42] via-[#F0D58A] to-[#9B7A42]"
            />

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#D5DCE6] sm:text-base sm:leading-8"
            >
              Your journey to a healthier smile starts with a
              conversation. Let us help you explore your options
              and take the next step with confidence.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <Link
                to="/booking"
                className="mirror-button mirror-button-gold group/booking inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-xl border border-[#F0D58A]/70 bg-gradient-to-r from-[#C5A46D] via-[#F0DDAF] to-[#C5A46D] px-7 py-3.5 text-sm font-semibold text-[#15243B] shadow-[0_8px_24px_rgba(197,164,109,0.18)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(197,164,109,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F0D58A]"
              >
                <span className="relative z-10">
                  Book Your Appointment
                </span>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/booking:translate-x-1"
                >
                  <path
                    d="M4 10h12m-5-5 5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="mirror-shine" aria-hidden="true" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/[0.035] px-7 py-3.5 text-sm font-semibold text-[#FAF5EB] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D8BC83]/80 hover:bg-white/[0.07] hover:text-[#E4C783] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F0D58A]"
              >
                Contact Us
              </Link>
            </motion.div>

            {/* Closing signature */}
            <motion.div
              variants={fadeUp}
              className="mx-auto mt-7 flex max-w-sm items-center justify-center gap-3"
            >
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D8BC83]/50" />

              <span className="whitespace-nowrap font-serif text-xs italic tracking-wide text-[#D8BC83] sm:text-sm">
                Thoughtful care. Confident smiles.
              </span>

              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D8BC83]/50" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}