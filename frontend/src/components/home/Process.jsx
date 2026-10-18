
import { motion } from "motion/react";

const STEPS = [
  {
    number: "01",
    title: "Choose a Treatment",
    text: "Explore our dental services and select the treatment you need.",
  },
  {
    number: "02",
    title: "Select Dentist & Time",
    text: "Choose your preferred dentist and an available appointment slot.",
  },
  {
    number: "03",
    title: "Verify Your Booking",
    text: "Complete the booking process and verify your details using the required code.",
  },
  {
    number: "04",
    title: "You're All Set",
    text: "Review your appointment details and look forward to your visit.",
  },
];

export default function Process() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9B7A42]">
            A Simple Process
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#15243B] sm:text-4xl lg:text-5xl">
            Your Next Visit,
            <span className="block font-serif font-medium italic text-[#9B7A42]">
              Made Simple.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600">
            Booking your dental appointment is straightforward.
            Follow four simple steps to plan your visit.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-14 lg:mt-20">
          {/* Connecting line on desktop */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px origin-left bg-[#D8BC83] lg:block"
          />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, index) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.12,
                }}
                className="relative text-center"
              >
                {/* Numbered circle */}
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D8BC83] bg-[#15243B] font-serif text-xl text-[#F7F0E4] shadow-lg ring-8 ring-white transition duration-300 hover:scale-110 hover:bg-[#243955]">
                  {step.number}
                </div>

                <h3 className="mt-6 text-lg font-semibold text-[#15243B]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-gray-600">
                  {step.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
