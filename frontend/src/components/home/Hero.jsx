
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const benefits = [
  "Personalised dental care",
  "Modern treatment options",
  "Clear treatment guidance",
];

function AnimatedTooth() {
  return (
    <span
      className="tooth-float relative inline-flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Tooth icon */}
      <svg
        viewBox="0 0 64 72"
        className="h-10 w-10 tooth-glow"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 12C8 17 8 28 11 38L17 57C19 64 24 65 27 57L31 44C32 40 35 40 37 44L41 57C44 65 49 64 51 57L57 38C60 28 60 17 54 12C48 7 41 10 36 13C33 15 31 15 28 13C23 10 19 9 14 12Z"
          fill="#FFF8E7"
          stroke="#D6A83F"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M20 18C17 23 18 29 20 34"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      {/* Upper sparkle */}
      <span className="tooth-sparkle absolute -right-1 top-0 text-sm text-[#D6A83F]">
        ✦
      </span>

      {/* Lower sparkle */}
      <span className="tooth-sparkle-delayed absolute -bottom-1 -left-1 text-xs text-[#F0D58A]">
        ✧
      </span>

      <style>{`
        .tooth-float {
          animation: dental-tooth-float 1.8s ease-in-out infinite !important;
          will-change: transform;
        }

        .tooth-glow {
          animation: dental-tooth-glow 2s ease-in-out infinite;
        }

        .tooth-sparkle {
          animation: dental-sparkle 1.6s ease-in-out infinite;
        }

        .tooth-sparkle-delayed {
          animation: dental-sparkle 1.5s ease-in-out 0.3s infinite;
        }

        @keyframes dental-tooth-float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }

        @keyframes dental-tooth-glow {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(214,168,63,0.3));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(214,168,63,0.85));
          }
        }

        @keyframes dental-sparkle {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.75);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tooth-float,
          .tooth-glow,
          .tooth-sparkle,
          .tooth-sparkle-delayed {
            animation: none !important;
          }
        }
      `}</style>
    </span>
  );
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[780px] overflow-hidden bg-[#090908] text-[#F5F0E6] sm:min-h-[820px] lg:min-h-[850px]">
      {/* Background smile image */}
      <div
        className="absolute inset-0 -z-30 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/dental-smile-hero.png')",
          backgroundPosition: "center right",
        }}
        aria-hidden="true"
      />

      {/* Background overlay */}
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-r from-[#090908] from-[0%] via-[#090908]/90 via-[30%] via-[#090908]/35 via-[55%] to-transparent"
        aria-hidden="true"
      />

      {/* Top and bottom shading */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#090908]/65 via-transparent via-[25%] to-[#090908]/10"
        aria-hidden="true"
      />

      {/* Main hero content */}
      <div className="mx-auto flex min-h-[780px] max-w-7xl flex-col justify-between px-5 pb-7 pt-32 sm:min-h-[820px] sm:px-8 sm:pb-8 sm:pt-36 lg:min-h-[850px] lg:px-12 lg:pt-40">
        <div className="max-w-2xl">
          {/* Welcome label */}
          <motion.div
            className="mb-7 flex items-center gap-4"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <AnimatedTooth />

            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D6A83F] sm:text-sm">
              Welcome to House of Dental
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="max-w-[620px] text-5xl font-medium leading-[1.02] tracking-[-0.045em] text-[#F5F0E6] sm:text-6xl lg:text-[76px]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            The smile
            <br />
            you deserve
            <br />
            <span className="inline-block font-serif italic tracking-[-0.045em] text-[#D6A83F]">
              starts here.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-7 max-w-[440px] text-sm leading-7 text-[#E4DED2] sm:text-base"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Thoughtful dental care in a welcoming environment.
            Discover your treatment options and take the next step
            towards a healthier, more confident smile.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="mt-7 flex flex-wrap items-center gap-4"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <Link
              to="/booking"
              className="mirror-button mirror-button-gold group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-xl border border-[#E6BD58] bg-gradient-to-r from-[#C99B32] via-[#F0D58A] to-[#D6A83F] px-6 py-3 text-sm font-semibold text-[#090908] shadow-[0_4px_18px_rgba(214,168,63,0.2)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(214,168,63,0.32)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0D58A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090908]"
            >
              <span className="mirror-shine" aria-hidden="true" />
              <span className="relative z-10">Book an Appointment</span>
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to="/services"
              className="mirror-button mirror-button-outline group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-xl border border-[#D6A83F]/60 bg-[#11100D]/70 px-6 py-3 text-sm font-semibold text-[#F5F0E6] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#F0D58A] hover:text-[#F0D58A] hover:shadow-[0_8px_26px_rgba(214,168,63,0.16)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0D58A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090908]"
            >
              <span className="mirror-shine" aria-hidden="true" />
              <span className="relative z-10">Explore Our Services</span>
              <span className="relative z-10 inline-block text-[#D6A83F] transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Benefits strip */}
        <motion.div
          className="benefits-strip relative mt-12 grid grid-cols-1 overflow-hidden rounded-xl border border-[#D6A83F]/20 bg-[#0E0D0B]/85 shadow-[0_8px_35px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:grid-cols-3"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <span
            aria-hidden="true"
            className="benefits-shine pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#D6A83F]/60 to-transparent"
          />

          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              className={`benefit-item group relative flex min-h-[76px] items-center gap-4 px-5 py-4 transition-colors duration-300 hover:bg-[#D6A83F]/[0.06] sm:px-6 ${
                index !== 2
                  ? "border-b border-white/[0.07] sm:border-b-0 sm:border-r sm:border-white/[0.08]"
                  : ""
              }`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: shouldReduceMotion ? 0 : 0.55 + index * 0.15,
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -2, transition: { duration: 0.2 } }
              }
            >
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D6A83F]/25 bg-[#D6A83F]/[0.06] transition-all duration-300 group-hover:border-[#D6A83F]/70 group-hover:bg-[#D6A83F]/[0.13] group-hover:shadow-[0_0_18px_rgba(214,168,63,0.12)]">
                <span className="font-serif text-sm text-[#D6A83F] transition-colors duration-300 group-hover:text-[#F0D58A]">
                  0{index + 1}
                </span>
              </span>

              <span className="relative z-10 flex-1 text-sm font-medium tracking-[0.01em] text-[#D6D0C6] transition-colors duration-300 group-hover:text-[#FFF8E7]">
                {benefit}
              </span>

              <span
                aria-hidden="true"
                className="relative z-10 translate-x-[-4px] text-sm text-[#D6A83F] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              >
                ↗
              </span>

              <span
                aria-hidden="true"
                className="absolute inset-x-5 bottom-0 z-10 h-px origin-left scale-x-0 bg-gradient-to-r from-[#D6A83F]/70 to-transparent transition-transform duration-300 group-hover:scale-x-100 sm:inset-x-6"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
