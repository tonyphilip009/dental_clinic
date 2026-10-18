
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import ToothIllustration from "./ToothIllustration";

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#17283F] text-white">
      {/* Dental background photograph */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/dental-hero.png')" }}
      />

      {/* Dark overlay keeps the headline readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#10243D]/95 via-[#17283F]/75 to-[#17283F]/20"
      />

      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-8 px-5 py-16 sm:min-h-[660px] sm:px-8 lg:min-h-[700px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-12 lg:py-20">
        {/* Welcome text */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-2xl text-center lg:text-left"
        >
          {/* Small animated tooth beside the welcome label */}
          <motion.div
            variants={item}
            className="mb-5 flex items-center justify-center gap-3 lg:justify-start"
          >
            <div className="h-12 w-10 shrink-0 sm:h-14 sm:w-12">
              <ToothIllustration className="h-full w-full" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8D8B5] sm:text-sm">
              Welcome to House of Dental
            </p>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Your Smile,
            <span className="mt-2 block text-[#E8D8B5]">
              Our Priority.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/85 sm:text-lg lg:mx-0"
          >
            Discover thoughtful, modern dental care in a welcoming
            environment. Explore our services and arrange your visit
            at a time that suits you.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-xl bg-[#C5A46D] px-7 py-3.5 font-semibold text-[#17283F] shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#E8D8B5]"
            >
              Book an Appointment
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#E8D8B5] hover:bg-white/15"
            >
              Explore Our Services
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-white/85 lg:justify-start"
          >
            <span>✓ Personalised care</span>
            <span>✓ Clear treatment guidance</span>
            <span>✓ Easy online booking</span>
          </motion.div>
        </motion.div>

        {/* Keep the photograph unobstructed on the right */}
        <div
          aria-hidden="true"
          className="hidden lg:block"
        />
      </div>
    </section>
  );
}
