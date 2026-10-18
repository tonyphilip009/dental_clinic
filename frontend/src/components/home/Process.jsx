import { motion, useReducedMotion } from "motion/react";

const STEPS = [
  {
    number: "01",
    title: "Choose a Treatment",
    text: "Explore our dental services and select the treatment you need.",
    icon: "tooth",
  },
  {
    number: "02",
    title: "Select Dentist & Time",
    text: "Choose your preferred dentist and an available appointment slot.",
    icon: "calendar",
  },
  {
    number: "03",
    title: "Verify Your Booking",
    text: "Complete the booking process and verify your details using the required code.",
    icon: "shield",
  },
  {
    number: "04",
    title: "You're All Set",
    text: "Review your appointment details and look forward to your visit.",
    icon: "check",
  },
];

const ICONS = {
  tooth: (
    <path
      d="M8 3.5C5.4 2.4 3 4.1 3 7c0 2.4 1.2 4.2 2 6.3.5 1.5.6 4.2 2 4.2 1.1 0 1.2-3.7 3-3.7s1.9 3.7 3 3.7c1.4 0 1.5-2.7 2-4.2.8-2.1 2-3.9 2-6.3 0-2.9-2.4-4.6-5-3.5-1 .4-2 .4-3 0Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  calendar: (
    <>
      <rect
        x="3"
        y="5"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M6 3v4M14 3v4M3 9h14M6.5 12h2M6.5 14.5h2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </>
  ),
  shield: (
    <>
      <path
        d="M10 2.5 16 5v4.8c0 3.5-2.5 5.8-6 7.7-3.5-1.9-6-4.2-6-7.7V5l6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m7 9.5 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  check: (
    <>
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="m6.5 10 2.3 2.3 4.7-4.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

export default function Process() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="booking-process"
      className="relative overflow-hidden bg-[#F0E9DC] py-20 sm:py-24 lg:py-28"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#D8BC83]/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 right-0 h-[30rem] w-[30rem] rounded-full bg-[#15243B]/[0.06] blur-3xl"
      />

      {/* Decorative top border */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A46D]/70 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#9B7A42]"
          >
            <span className="h-px w-8 bg-[#C5A46D]" />
            A Simple Process
            <span className="h-px w-8 bg-[#C5A46D]" />
          </motion.p>

          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#15243B] sm:text-4xl lg:text-5xl">
            Your Next Visit,
            <span className="welcome-gold-text mt-2 block font-serif font-medium italic">
              Made Simple.
            </span>
          </h2>

          <motion.div
            initial={shouldReduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mx-auto mt-6 h-[3px] w-20 origin-center rounded-full bg-gradient-to-r from-[#9B7A42] to-[#E2C985]"
          />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#656660] sm:text-[17px]">
            Booking your dental appointment is straightforward.
            Follow four simple steps to plan your visit with confidence.
          </p>
        </motion.div>

        {/* Steps and connecting line */}
        <div className="relative mt-14 lg:mt-20">
          {/* Desktop connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-px bg-[#D8BC83]/40 lg:block"
          />

          <motion.div
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.25 }}
            className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-px origin-left bg-gradient-to-r from-[#9B7A42] via-[#E2C985] to-[#9B7A42] lg:block"
          />

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {STEPS.map((step, index) => (
              <motion.article
                key={step.number}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 30 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: shouldReduceMotion ? 0 : index * 0.12,
                  ease: "easeOut",
                }}
                whileHover={
                  shouldReduceMotion ? undefined : { y: -7 }
                }
                className="group relative rounded-2xl border border-[#D8BC83]/60 bg-[#FFFCF6]/80 p-6 text-center shadow-[0_10px_30px_rgba(21,36,59,0.045)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-[#B38A45] hover:shadow-[0_20px_40px_rgba(21,36,59,0.10)] sm:p-7 lg:border-transparent lg:bg-transparent lg:shadow-none lg:hover:bg-[#FFFCF6]/60 lg:hover:shadow-[0_20px_40px_rgba(21,36,59,0.07)]"
              >
                {/* Numbered circle */}
                <div className="relative z-10 mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-[#D8BC83] bg-[#15243B] text-[#E4C783] shadow-[0_8px_24px_rgba(21,36,59,0.16)] ring-[6px] ring-[#F0E9DC] transition-all duration-500 group-hover:border-[#F0D58A] group-hover:bg-[#203654] group-hover:shadow-[0_0_0_8px_rgba(197,164,109,0.13),0_12px_30px_rgba(21,36,59,0.2)]">
                  <motion.span
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: [0.8, 1, 0.8] }
                    }
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="font-serif text-xl"
                  >
                    {step.number}
                  </motion.span>

                  {/* Small icon badge */}
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#D8BC83] bg-[#F0E9DC] text-[#9B7A42] shadow-sm">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      {ICONS[step.icon]}
                    </svg>
                  </span>
                </div>

                {/* Step content */}
                <h3 className="mt-7 text-lg font-semibold leading-snug text-[#15243B] transition-colors duration-300 group-hover:text-[#9B7A42]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-[#656660]">
                  {step.text}
                </p>

                {/* Bottom accent */}
                <div
                  aria-hidden="true"
                  className="mx-auto mt-6 h-[2px] w-10 rounded-full bg-[#D8BC83] transition-all duration-500 group-hover:w-16 group-hover:bg-[#9B7A42]"
                />
              </motion.article>
            ))}
          </div>
        </div>

        {/* Booking call to action */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="mt-14 text-center lg:mt-16"
        >
          <p className="text-sm text-[#656660] sm:text-base">
            Ready to take the first step?
          </p>

          <a
            href="/booking"
            className="mirror-button mirror-button-gold mt-5 inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-[#C5A46D] bg-gradient-to-r from-[#B38A45] via-[#E4C783] to-[#B38A45] px-7 py-3.5 text-sm font-semibold text-[#15243B] shadow-[0_8px_24px_rgba(155,122,66,0.18)] hover:shadow-[0_12px_30px_rgba(155,122,66,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9B7A42]"
          >
            <span className="relative z-10">Book Your Appointment</span>

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