
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import {
  clinic,
  emailHref,
  mapsHref,
  phoneHref,
} from "../clinic";

import PageHeader from "../components/ui/PageHeader";

const EASE = [0.22, 1, 0.36, 1];

function InfoCard({ icon, title, children, index = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.4,
        delay: reduceMotion ? 0 : index * 0.06,
        ease: EASE,
      }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="h-full rounded-2xl border border-accent/15 bg-white p-6 shadow-sm transition-shadow duration-300 hover:border-accent/35 hover:shadow-lg"
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-brand-light/40 text-2xl"
      >
        {icon}
      </div>

      <h2 className="mt-4 text-lg font-semibold text-brand-dark">
        {title}
      </h2>

      <div className="mt-3 leading-7 text-gray-600">
        {children}
      </div>
    </motion.article>
  );
}

function Contact() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-brand-light/20">
      <PageHeader
        eyebrow="We're here to help"
        title="Contact Us"
        subtitle="Have a question or need help with a booking? Call, email, or visit us. We would love to hear from you."
      />

      <section className="px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoCard icon="📍" title="Visit us" index={0}>
              <p className="break-words">{clinic.address}</p>

              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-accent/40 px-4 py-2 font-semibold text-brand transition-colors hover:bg-brand-light/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Get directions <span aria-hidden="true">↗</span>
              </a>
            </InfoCard>

            <InfoCard icon="📞" title="Call us" index={1}>
              <p>Speak to our team during opening hours.</p>

              <a
                href={phoneHref}
                className="mt-4 inline-block break-words font-semibold text-brand transition-colors hover:text-accent"
              >
                {clinic.phone}
              </a>
            </InfoCard>

            <InfoCard icon="✉️" title="Email us" index={2}>
              <p>Contact us by email for your questions.</p>

              <a
                href={emailHref}
                className="mt-4 inline-block break-all font-semibold text-brand transition-colors hover:text-accent"
              >
                {clinic.email}
              </a>
            </InfoCard>

            <InfoCard icon="🕘" title="Opening hours" index={3}>
              <dl className="space-y-3">
                {clinic.hours.map((row) => (
                  <div
                    key={row.days}
                    className="flex flex-wrap justify-between gap-x-4 gap-y-1"
                  >
                    <dt>{row.days}</dt>
                    <dd className="font-semibold text-brand-dark">
                      {row.time}
                    </dd>
                  </div>
                ))}
              </dl>
            </InfoCard>
          </div>

          {/* Booking banner */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              ease: EASE,
            }}
            className="relative mt-8 overflow-hidden rounded-2xl border border-accent/25 bg-brand-dark p-7 text-center text-white shadow-xl sm:p-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
            />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold-light">
                Your smile starts here
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#F5F0E6] sm:text-3xl">
                Ready to book?
              </h2>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-white/75">
                Choose your treatment, dentist, and preferred time
                through our online appointment system.
              </p>

              <Link
                to="/booking"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-brand-dark transition duration-300 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light"
              >
                Book an appointment
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
