
import { motion } from "motion/react";

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
  return (
    <section className="bg-[#FAF8F3] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9B7A42]">
            The House of Dental Difference
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#15243B] sm:text-4xl lg:text-5xl">
            Dental Care,
            <span className="block font-serif font-medium italic text-[#9B7A42]">
              Thoughtfully Delivered.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600">
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
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: (index % 3) * 0.1,
              }}
              className="group relative overflow-hidden rounded-2xl border border-[#E8E0D1] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D8BC83] hover:shadow-xl sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl text-[#D8BC83] transition duration-300 group-hover:text-[#9B7A42]">
                  {feature.number}
                </span>

                <span
                  aria-hidden="true"
                  className="h-px w-12 bg-[#D8BC83] transition-all duration-300 group-hover:w-20"
                />
              </div>

              <h3 className="mt-7 text-xl font-semibold text-[#15243B]">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {feature.text}
              </p>

              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-0 bg-[#D8BC83] transition-all duration-500 group-hover:w-full"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
