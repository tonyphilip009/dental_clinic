
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import DentistsSection from "../components/DentistsSection";

const EASE = [0.22, 1, 0.36, 1];

const values = [
  {
    id: 1,
    icon: "♡",
    title: "Compassionate Care",
    text: "We listen first, explain clearly, and make sure you feel comfortable at every visit.",
  },
  {
    id: 2,
    icon: "✧",
    title: "Modern Technology",
    text: "Modern treatment options help us deliver precise, thoughtful dental care.",
  },
  {
    id: 3,
    icon: "◇",
    title: "Trust and Honesty",
    text: "Clear advice and transparent treatment plans help you make confident decisions.",
  },
];

function Reveal({ children, delay = 0, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionEyebrow({ children }) {
  return (
    <p className="flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#B78328] sm:text-sm">
      <span className="h-px w-8 bg-[#D6A83F]" />
      {children}
      <span className="h-px w-8 bg-[#D6A83F]" />
    </p>
  );
}

function About() {
  const reduceMotion = useReducedMotion();

  const entrance = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.75,
      delay: reduceMotion ? 0 : delay,
      ease: EASE,
    },
  });

  return (
    <main className="overflow-x-clip bg-[#FAF8F3] text-[#15243B]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#0D0D0B] px-5 py-20 text-center text-[#FAF3E4] sm:py-28 lg:py-32">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-0 -z-10 h-80 w-80 rounded-full bg-[#D6A83F]/10 blur-[100px]"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 30, 0],
                  y: [0, 18, 0],
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
          className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-[#D6A83F]/[0.07] blur-[100px]"
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -20, 0], x: [0, -15, 0] }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div {...entrance(0.05)}>
          <SectionEyebrow>About House of Dental</SectionEyebrow>
        </motion.div>

        <motion.h1
          {...entrance(0.18)}
          className="mx-auto mt-8 max-w-5xl text-4xl font-semibold leading-[1.15] tracking-[-0.045em] sm:text-6xl lg:text-7xl"
        >
          Care that begins with you.
          <span className="welcome-gold-text mt-3 block font-serif font-medium italic">
            Smiles that last.
          </span>
        </motion.h1>

        <motion.p
          {...entrance(0.32)}
          className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#E3DCCF]/85 sm:text-lg"
        >
          Get to know the people, values, and commitment behind
          House of Dental. We believe every smile deserves thoughtful
          care and every patient deserves to feel heard.
        </motion.p>

        <motion.div {...entrance(0.46)} className="mt-9">
          <Link
            to="/booking"
            className="mirror-button mirror-button-gold group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-xl border border-[#F0D58A]/60 bg-gradient-to-r from-[#C99B32] to-[#F0D58A] px-7 py-4 font-semibold text-[#101010] shadow-[0_10px_35px_rgba(214,168,63,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(214,168,63,0.25)]"
          >
            <span className="mirror-shine" aria-hidden="true" />
            <span className="relative z-10">Book an Appointment</span>
            <motion.span
              aria-hidden="true"
              className="relative z-10 text-xl"
              animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          {...entrance(0.6)}
          className="mx-auto mt-16 flex max-w-3xl items-center gap-4 sm:mt-20"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D6A83F]/50" />
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#D6A83F] sm:text-xs sm:tracking-[0.3em]">
            Thoughtful care · Confident smiles
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D6A83F]/50" />
        </motion.div>
      </section>

      {/* OUR STORY */}
      <section className="relative overflow-hidden bg-[#FAF8F3] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[32px] border border-[#D6A83F]/35"
              />

              <motion.div
                className="relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-[#D6A83F]/35 bg-gradient-to-br from-[#F1E8D6] via-[#F8F4EA] to-[#EAE0CD] px-7 py-12 text-center shadow-[0_22px_65px_rgba(21,36,59,0.08)] sm:min-h-[420px]"
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {/* Floating tooth — extra top-right circle removed */}
                <motion.div
                  className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#D6A83F]/50 bg-[#15243B] shadow-[0_12px_30px_rgba(21,36,59,0.15)] sm:h-32 sm:w-32"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, -9, 0],
                          rotate: [0, -3, 3, 0],
                        }
                  }
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    viewBox="0 0 64 64"
                    fill="none"
                    className="h-14 w-14 text-[#F0D58A] sm:h-16 sm:w-16"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 9c-7 0-12 6-12 14 0 7 4 12 7 17 3 5 4 15 8 15 5 0 4-18 9-18s4 18 9 18c4 0 5-10 8-15 3-5 7-10 7-17 0-8-5-14-12-14-5 0-8 4-12 4s-7-4-12-4Z"
                      fill="#FAF3E4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

                <h3 className="mt-8 font-serif text-3xl italic text-[#15243B] sm:text-4xl">
                  Every smile matters.
                </h3>

                <p className="mt-4 max-w-xs text-sm leading-7 text-[#64645F] sm:text-base">
                  A welcoming environment for your dental care journey.
                </p>

                <motion.div
                  aria-hidden="true"
                  className="mt-7 h-[2px] w-14 rounded-full bg-gradient-to-r from-[#B78328] to-[#F0D58A]"
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.25 }}
                />
              </motion.div>
            </div>
          </Reveal>

          <div className="min-w-0">
            <Reveal delay={0.08}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B78328]">
                Our Story
              </p>

              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#15243B] sm:text-4xl lg:text-5xl">
                A more thoughtful approach to dental care.
              </h2>

              <div className="mt-6 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#B78328] to-[#F0D58A]" />
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mt-7 text-base leading-8 text-[#60656D]">
                House of Dental was founded with a simple goal:
                to make quality dental care welcoming and accessible
                for everyone in our community.
              </p>

              <p className="mt-5 text-base leading-8 text-[#60656D]">
                Today, our clinic offers a range of dental treatments,
                from routine check-ups and cleanings to orthodontics
                and cosmetic dentistry. We aim to make every visit
                calm, clear, and comfortable.
              </p>
            </Reveal>

            <Reveal delay={0.28}>
              <motion.div
                whileHover={reduceMotion ? undefined : { x: 5 }}
                transition={{ duration: 0.3 }}
                className="mt-8 flex gap-4 rounded-2xl border border-[#D6A83F]/25 bg-white p-5 shadow-[0_8px_25px_rgba(21,36,59,0.04)] sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D6A83F]/35 bg-[#F8EED9] text-xl text-[#9B7A42]">
                  ✧
                </div>

                <div>
                  <h3 className="font-semibold text-[#15243B]">
                    Care with confidence
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#60656D]">
                    Clear communication, considered treatment options,
                    and a patient-first approach at every step.
                  </p>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="relative overflow-hidden bg-[#F2EDE2] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#15243B] sm:text-4xl lg:text-5xl">
              The values behind every smile
            </h2>

            <p className="mt-4 leading-7 text-[#60656D] sm:text-lg">
              The principles that shape how we care for our patients.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((item, index) => (
              <motion.article
                key={item.id}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 30 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.65,
                  delay: reduceMotion ? 0 : index * 0.13,
                  ease: EASE,
                }}
                whileHover={
                  reduceMotion ? undefined : { y: -7, scale: 1.01 }
                }
                className="group relative overflow-hidden rounded-[24px] border border-[#D6A83F]/30 bg-white p-7 shadow-[0_10px_35px_rgba(21,36,59,0.045)] transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(21,36,59,0.10)] sm:p-8"
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#F0D58A]/15 blur-2xl"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.13 }}
                />

                <div className="relative flex items-center justify-between">
                  <motion.div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D6A83F]/40 bg-[#FBF3E2] font-serif text-3xl text-[#9B7A42]"
                    whileHover={
                      reduceMotion ? undefined : { rotate: -8, scale: 1.08 }
                    }
                    transition={{ duration: 0.25 }}
                  >
                    {item.icon}
                  </motion.div>

                  <span className="font-serif text-sm tracking-widest text-[#B78328]">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="relative mt-7 text-xl font-semibold text-[#15243B] sm:text-2xl">
                  {item.title}
                </h3>

                <p className="relative mt-3 leading-7 text-[#60656D]">
                  {item.text}
                </p>

                <div className="relative mt-6 h-[2px] w-12 overflow-hidden rounded-full bg-[#E9DAB9]">
                  <motion.div
                    className="h-full w-full origin-left bg-gradient-to-r from-[#B78328] to-[#F0D58A]"
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: reduceMotion ? 0 : 0.25 + index * 0.13,
                    }}
                  />
                </div>

                <motion.div
                  aria-hidden="true"
                  className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-[#D6A83F]/[0.07] to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={reduceMotion ? undefined : { x: "450%" }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* DENTISTS: existing backend API integration */}
      <DentistsSection />

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#FAF8F3] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <Reveal>
          <motion.div
            className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[#D6A83F]/40 bg-gradient-to-br from-[#192A43] via-[#15243B] to-[#0D1728] px-6 py-14 text-center text-[#FAF3E4] shadow-[0_25px_70px_rgba(21,36,59,0.15)] sm:px-12 sm:py-20 lg:px-16"
            whileHover={reduceMotion ? undefined : { y: -3 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#D6A83F]/15 blur-[80px]"
              animate={
                reduceMotion
                  ? undefined
                  : { x: [0, -15, 0], y: [0, 12, 0] }
              }
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-white/[0.04] blur-[70px]"
              animate={
                reduceMotion
                  ? undefined
                  : { x: [0, 20, 0], y: [0, -12, 0] }
              }
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F0D58A]">
                Your Smile, Our Priority
              </p>

              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                Ready to take the next step?
              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-8 text-white/75 sm:text-lg">
                Book an appointment and let our team help you
                explore your dental care options.
              </p>

              <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/booking"
                  className="mirror-button mirror-button-gold group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-xl border border-[#F0D58A]/70 bg-gradient-to-r from-[#C99B32] to-[#F0D58A] px-7 py-4 font-semibold text-[#101010] transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="mirror-shine" aria-hidden="true" />
                  <span className="relative z-10">
                    Book an Appointment
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex min-h-14 items-center justify-center rounded-xl border border-[#D6A83F]/45 bg-white/[0.04] px-7 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#F0D58A] hover:bg-white/[0.08]"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </section>
    </main>
  );
}

export default About;
