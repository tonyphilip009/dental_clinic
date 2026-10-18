import { motion, useReducedMotion } from "motion/react";

const FEATURES = [
  {
    number: "01",
    title: "Personalised Dental Care",
    text: "Every smile is unique. Our approach focuses on understanding your needs and helping you choose suitable treatments.",
  },
  {
    number: "02",
    title: "Modern Treatment Options",
    text: "Explore a range of dental services designed to support your oral health and help you maintain a confident smile.",
  },
  {
    number: "03",
    title: "Care for Every Generation",
    text: "From children's dental visits to routine adult check-ups, discover care options for the whole family.",
  },
  {
    number: "04",
    title: "Convenient Online Booking",
    text: "Choose your preferred dentist, select an available time, and arrange your appointment online.",
  },
  {
    number: "05",
    title: "A Comfortable Experience",
    text: "We aim to make every visit welcoming, with clear communication and attention to your comfort.",
  },
  {
    number: "06",
    title: "Clear Treatment Guidance",
    text: "Understand your treatment options and ask questions so you can make informed decisions about your dental care.",
  },
];

export default function WhyChooseUs() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="why-choose-us"
      className="relative overflow-hidden bg-[#FAF8F3] py-20 sm:py-24 lg:py-28"
    >
      {/* Subtle background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#D8BC83]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#15243B]/[0.035] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#9B7A42] sm:tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="h-px w-7 bg-[#C5A46D]"
            />

            The House of Dental Difference

            <span
              aria-hidden="true"
              className="h-px w-7 bg-[#C5A46D]"
            />
          </p>

          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#15243B] sm:text-4xl lg:text-5xl">
            Dental Care,
            <span className="welcome-gold-text mt-2 block font-serif font-medium italic">
              Thoughtfully Delivered.
            </span>
          </h2>

          <div className="mx-auto mt-6 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#9B7A42] to-[#E2C985]" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#656660] sm:text-[17px]">
            A welcoming environment, personalised attention, and
            convenient appointment booking come together to make
            caring for your smile simpler.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.number}
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, y: 22 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: shouldReduceMotion ? 0 : (index % 3) * 0.1,
                ease: "easeOut",
              }}
              whileHover={
                shouldReduceMotion ? undefined : { y: -5 }
              }
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#D8BC83] bg-[#F0E9DC] p-6 shadow-[0_8px_24px_rgba(21,36,59,0.06)] transition-[border-color,box-shadow] duration-300 hover:border-[#9B7A42] hover:shadow-[0_18px_38px_rgba(21,36,59,0.12)] sm:p-8"
            >
              {/* Number and decorative line */}
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-medium text-[#C5A46D] transition-colors duration-300 group-hover:text-[#9B7A42]">
                  {feature.number}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-12 bg-[#D8BC83] transition-all duration-500 group-hover:w-20"
                />
              </div>

              {/* Feature title */}
              <h3 className="mt-7 text-xl font-semibold leading-snug tracking-tight text-[#15243B]">
                {feature.title}
              </h3>

              {/* Feature description */}
              <p className="mt-3 flex-1 text-sm leading-7 text-[#656660] sm:text-[15px]">
                {feature.text}
              </p>

              {/* Gold underline on hover */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#9B7A42] to-[#E2C985] transition-all duration-500 group-hover:w-full"
              />
            </motion.article>
          ))}
        </div>

        {/* Booking call to action */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 text-center lg:mt-14"
        >
          <p className="text-sm text-[#656660] sm:text-base">
            Ready to take the next step towards caring for your smile?
          </p>

          <a
            href="/booking"
            className="mirror-button mirror-button-gold mt-5 inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-[#C5A46D] bg-gradient-to-r from-[#B38A45] via-[#E4C783] to-[#B38A45] px-7 py-3.5 text-sm font-semibold text-[#15243B] shadow-[0_8px_24px_rgba(155,122,66,0.18)] hover:shadow-[0_12px_30px_rgba(155,122,66,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9B7A42]"
          >
            <span className="relative z-10">
              Book Your Appointment
            </span>

            <span className="mirror-shine" aria-hidden="true" />

            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="relative z-10 h-4 w-4"
            >
              <path
                d="M4 10h12m-5-5 5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}