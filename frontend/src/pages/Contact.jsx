
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

const CONTACT_ITEMS = [
  {
    id: "location",
    icon: "⌖",
    title: "Visit Our Clinic",
    subtitle: "We look forward to welcoming you",
    index: 0,
  },
  {
    id: "phone",
    icon: "✆",
    title: "Call Our Team",
    subtitle: "Let's talk about your dental care",
    index: 1,
  },
  {
    id: "email",
    icon: "✉",
    title: "Email Us",
    subtitle: "We are happy to answer your questions",
    index: 2,
  },
  {
    id: "hours",
    icon: "◷",
    title: "Opening Hours",
    subtitle: "Find a convenient time to visit",
    index: 3,
  },
];

function ContactCard({ item, reduceMotion, children }) {
  return (
    <motion.article
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 35, scale: 0.96 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : item.index * 0.1,
        ease: EASE,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -8, transition: { duration: 0.3 } }
      }
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#D6A83F]/20 bg-gradient-to-br from-[#24344B] via-[#17263D] to-[#111A29] p-6 shadow-[0_15px_40px_rgba(18,30,47,0.10)] transition-[border-color,box-shadow] duration-500 hover:border-[#E8C979]/70 hover:shadow-[0_28px_55px_rgba(18,30,47,0.22)] sm:p-8"
    >
      {/* Soft ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#D6A83F]/10 blur-[70px] transition-all duration-700 group-hover:bg-[#D6A83F]/20"
      />

      {/* Animated top accent */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-transparent via-[#F0D58A] to-transparent"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: reduceMotion ? 0 : 0.9,
          delay: reduceMotion ? 0 : item.index * 0.1,
          ease: EASE,
        }}
      />

      {/* Icon */}
      <motion.div
        whileHover={
          reduceMotion
            ? undefined
            : { rotate: -8, scale: 1.08 }
        }
        transition={{ duration: 0.3, ease: EASE }}
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8C979]/40 bg-[#E8C979]/10 text-3xl text-[#F0D58A] shadow-[0_0_25px_rgba(214,168,63,0.06)] transition-all duration-300 group-hover:bg-[#D6A83F]/20 group-hover:shadow-[0_0_28px_rgba(214,168,63,0.15)]"
      >
        {item.icon}
      </motion.div>

      {/* Content */}
      <div className="relative mt-6">
        <h2 className="text-xl font-semibold tracking-tight text-[#FFF9EC] sm:text-2xl">
          {item.title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#E8DCC5]/70">
          {item.subtitle}
        </p>

        <div className="mt-5 min-h-20 text-[15px] leading-7 text-[#F5F0E6]/85">
          {children}
        </div>
      </div>

      {/* Bottom gold line */}
      <div
        aria-hidden="true"
        className="relative mt-6 h-px w-full overflow-hidden bg-white/10"
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#F0D58A] to-transparent"
          animate={
            reduceMotion ? undefined : { x: ["-100%", "350%"] }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.article>
  );
}

export default function Contact() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7F3EA]">
      {/* HEADER */}
      <div className="relative isolate overflow-hidden bg-[#100F0D]">
        <PageHeader
          eyebrow="We are here for you"
          title="Let's Connect"
          subtitle="Questions about a treatment or planning your next visit? Our team is ready to help make your dental journey comfortable and convenient."
        />
      </div>

      {/* INTRODUCTION */}
      <section className="relative overflow-hidden px-4 pb-10 pt-16 sm:px-6 sm:pt-20">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#D6A83F]/15 blur-[100px]"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 30, 0],
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
          initial={reduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            ease: EASE,
          }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9B7A42]">
            Thoughtful care begins here
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#17263D] sm:text-4xl lg:text-5xl">
            Here for every smile.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#686257] sm:text-base">
            From your first enquiry to your next appointment,
            we want every interaction with House of Dental to
            feel simple, welcoming, and personal.
          </p>

          <motion.div
            aria-hidden="true"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 0.9,
              ease: EASE,
            }}
            className="mx-auto mt-7 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#9B7A42] via-[#F0D58A] to-[#9B7A42]"
          />
        </motion.div>
      </section>

      {/* CONTACT CARDS */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <ContactCard
              item={CONTACT_ITEMS[0]}
              reduceMotion={reduceMotion}
            >
              <p className="break-words">{clinic.address}</p>

              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E8C979]/40 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-[#F0D58A] transition-all duration-300 hover:border-[#F0D58A] hover:bg-[#D6A83F]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0D58A]"
              >
                Get directions <span aria-hidden="true">↗</span>
              </a>
            </ContactCard>

            <ContactCard
              item={CONTACT_ITEMS[1]}
              reduceMotion={reduceMotion}
            >
              <p>Speak with our team about appointments and treatments.</p>

              <a
                href={phoneHref}
                className="mt-4 inline-block break-words font-semibold text-[#F0D58A] transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0D58A]"
              >
                {clinic.phone}
              </a>
            </ContactCard>

            <ContactCard
              item={CONTACT_ITEMS[2]}
              reduceMotion={reduceMotion}
            >
              <p>Have a question? Send us an email and let us know how we can help.</p>

              <a
                href={emailHref}
                className="mt-4 inline-block break-all font-semibold text-[#F0D58A] transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0D58A]"
              >
                {clinic.email}
              </a>
            </ContactCard>

            <ContactCard
              item={CONTACT_ITEMS[3]}
              reduceMotion={reduceMotion}
            >
              <dl className="space-y-3">
                {clinic.hours.map((row) => (
                  <div
                    key={row.days}
                    className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-white/10 pb-2 last:border-0"
                  >
                    <dt className="text-[#F5F0E6]/75">{row.days}</dt>
                    <dd className="font-semibold text-[#F0D58A]">
                      {row.time}
                    </dd>
                  </div>
                ))}
              </dl>
            </ContactCard>
          </div>
        </div>
      </section>

      {/* PREMIUM BOOKING BANNER */}
      <section className="px-4 pb-16 pt-4 sm:px-6 sm:pb-24 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            ease: EASE,
          }}
          className="group relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#D6A83F]/35 bg-gradient-to-br from-[#293B54] via-[#17263D] to-[#0C1320] px-6 py-14 text-center shadow-[0_25px_80px_rgba(23,38,61,0.20)] sm:px-12 sm:py-20"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D6A83F]/15 blur-[90px]"
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.25, 1], x: [0, -20, 0] }
            }
            transition={{
              duration: 9,
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
                : { scale: [1, 1.15, 1], y: [0, -20, 0] }
            }
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Cinematic reflection */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
            initial={{ x: "-150%" }}
            whileInView={reduceMotion ? {} : { x: "450%" }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 2,
              delay: reduceMotion ? 0 : 0.3,
              ease: EASE,
            }}
          />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F0D58A]">
              Your smile, our priority
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#FFF9EC] sm:text-4xl lg:text-5xl">
              Your next chapter starts with a smile.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-[#F5F0E6]/75 sm:text-base">
              Choose your treatment, dentist, and preferred time
              through our online appointment system.
            </p>

            <Link
              to="/booking"
              className="mirror-button mirror-button-gold relative mt-8 inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-xl border border-[#F0D58A] bg-gradient-to-r from-[#D6A83F] to-[#F0D58A] px-7 py-3 font-semibold text-[#171613] shadow-[0_8px_28px_rgba(214,168,63,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(214,168,63,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span aria-hidden="true" className="mirror-shine" />

              <span className="relative z-10">
                Book an appointment
              </span>

              <motion.span
                aria-hidden="true"
                animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
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
        </motion.div>
      </section>
    </main>
  );
}