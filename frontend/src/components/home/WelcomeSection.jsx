import { motion, useReducedMotion } from "motion/react";

export default function WelcomeSection() {
  const shouldReduceMotion = useReducedMotion();

  const textVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardAnimation = shouldReduceMotion
    ? {}
    : {
        opacity: 0,
        x: 24,
        scale: 0.98,
      };

  return (
    <section
      id="welcome"
      className="relative overflow-hidden bg-[#FAF8F3] px-5 py-20 text-[#15243B] sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#D8BC83]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#15243B]/[0.04] blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Welcome text */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
        >
          <motion.p
            variants={textVariants}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#9B7A42]"
          >
            <span
              aria-hidden="true"
              className="h-px w-8 bg-[#C5A46D]"
            />
            Welcome to House of Dental
          </motion.p>

          <motion.h2
            variants={textVariants}
            className="mt-6 text-3xl font-semibold leading-[1.15] tracking-[-0.035em] text-[#15243B] sm:text-4xl lg:text-5xl"
          >
            Your Dental Care,
            <span className="welcome-gold-text mt-2 block font-serif font-medium italic">
              Our Commitment.
            </span>
          </motion.h2>

          <motion.div
            variants={textVariants}
            className="mt-6 h-[3px] w-20 overflow-hidden rounded-full bg-[#E8DFCC]"
          >
            <motion.div
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#9B7A42] to-[#E2C985]"
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.25 }}
            />
          </motion.div>

          <motion.p
            variants={textVariants}
            className="mt-7 max-w-xl text-base leading-8 text-[#5F625F] sm:text-[17px]"
          >
            Every smile deserves thoughtful care. At House of Dental,
            we aim to create a welcoming environment where you can
            discuss your dental concerns, understand your treatment
            options, and make confident decisions about your oral health.
          </motion.p>

          <motion.p
            variants={textVariants}
            className="mt-4 max-w-xl text-base leading-8 text-[#5F625F] sm:text-[17px]"
          >
            Whether you are visiting for a routine check-up or exploring
            a treatment, our goal is to make your experience comfortable,
            clear, and convenient.
          </motion.p>

          {/* Closing statement */}
          <motion.div
            variants={textVariants}
            className="mt-8 flex items-center gap-4"
          >
            <span
              aria-hidden="true"
              className="h-12 w-[3px] rounded-full bg-gradient-to-b from-[#D8BC83] to-[#9B7A42]"
            />

            <p className="font-serif text-lg italic text-[#15243B] sm:text-xl">
              A warm welcome to every smile.
            </p>
          </motion.div>
        </motion.div>

        {/* Promise card */}
        <motion.div
          initial={cardAnimation}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          {/* Decorative frame */}
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-3 -right-3 -z-10 h-20 w-20 rounded-3xl border border-[#D8BC83]/50"
            animate={
              shouldReduceMotion ? undefined : { y: [0, -4, 0] }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="welcome-promise-card group relative overflow-hidden rounded-3xl border border-[#D8BC83]/40 bg-[#15243B] px-7 py-10 shadow-[0_22px_60px_rgba(21,36,59,0.16)] sm:px-10 sm:py-12 lg:px-11 lg:py-14"
            whileHover={
              shouldReduceMotion ? undefined : { y: -4 }
            }
            transition={{ duration: 0.3 }}
          >
            {/* Subtle gold glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#C5A46D]/15 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-white/[0.05] blur-3xl"
            />

            {/* Decorative circle */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-7 top-7 h-10 w-10 rounded-full border border-[#D8BC83]/20 sm:right-9 sm:top-9"
            />

            {/* Card content */}
            <div className="relative z-10">
              <motion.p
                className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D8BC83] sm:text-xs sm:tracking-[0.28em]"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                The House of Dental Promise
              </motion.p>

              {/* Corrected heading order and spacing */}
              <motion.h3
                className="mt-7 font-serif text-[clamp(1.8rem,3.1vw,2.65rem)] font-normal leading-[1.3] tracking-[-0.025em] text-[#F7F0E4]"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                <span className="block">Care that listens.</span>

                <span className="mt-2 block italic text-[#E4C783]">
                  Guidance that helps.
                </span>

                <span className="mt-2 block">
                  Smiles that matter.
                </span>
              </motion.h3>

              {/* Gold divider */}
              <div className="my-7 h-px w-full overflow-hidden bg-white/10 sm:my-8">
                <motion.div
                  className="h-full w-full origin-left bg-gradient-to-r from-[#D8BC83] via-[#D8BC83]/40 to-transparent"
                  initial={shouldReduceMotion ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>

              <motion.p
                className="max-w-md text-sm leading-7 text-white/75 sm:text-base"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.45 }}
              >
                Your dental journey starts with a conversation.
                Let us help you explore the next step in caring
                for your smile.
              </motion.p>

              {/* Signature */}
              <div className="mt-7 flex items-center gap-3 sm:mt-8">
                <span className="h-px w-8 bg-[#D8BC83]/70" />

                <span className="font-serif text-sm italic tracking-wide text-[#D8BC83]">
                  Care with confidence
                </span>
              </div>
            </div>

            {/* Gentle reflection */}
            <span
              aria-hidden="true"
              className="welcome-card-shine pointer-events-none absolute inset-y-0 left-0 w-1/3"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}