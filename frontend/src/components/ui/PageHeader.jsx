
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="surface-brand relative isolate overflow-hidden border-b border-accent/20">
      {/* Decorative champagne-gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-gold-light/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:py-16">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-light">
            {eyebrow}
          </p>
        )}

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-2 text-4xl font-extrabold text-[#F5F0E6] sm:text-5xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: reduceMotion ? 0 : 0.1,
              ease: EASE,
            }}
            className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#F5F0E6]/75 sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}

        <div
          aria-hidden="true"
          className="mx-auto mt-7 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent"
        />
      </div>
    </section>
  );
}
