
import { motion } from "motion/react";

export default function WelcomeSection() {
  return (
    <section className="bg-[#FAF8F3] px-5 py-20 sm:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9B7A42]">
            Welcome to House of Dental
          </p>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-[#15243B] sm:text-4xl lg:text-5xl">
            Your Dental Care,
            <span className="mt-2 block font-serif font-medium italic text-[#9B7A42]">
              Our Commitment.
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-gray-600">
            Every smile deserves thoughtful care. At House of Dental,
            we aim to create a welcoming environment where you can
            discuss your dental concerns, understand your treatment
            options, and make confident decisions about your oral health.
          </p>

          <p className="mt-4 text-base leading-8 text-gray-600">
            Whether you are visiting for a routine check-up or exploring
            a treatment, our goal is to make your experience comfortable,
            clear, and convenient.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="h-px w-12 bg-[#C5A46D]"
            />
            <p className="font-serif text-lg italic text-[#15243B]">
              A warm welcome to every smile.
            </p>
          </div>
        </motion.div>

        {/* Decorative editorial panel */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#D8BC83]/40 bg-[#15243B] px-7 py-12 sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#C5A46D]/15 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-white/5 blur-3xl"
            />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D8BC83]">
                The House of Dental Promise
              </p>

              <h3 className="mt-6 font-serif text-3xl leading-relaxed text-[#F7F0E4] sm:text-4xl">
                Care that listens.
                <br />
                Guidance that helps.
                <br />
                Smiles that matter.
              </h3>

              <div className="my-8 h-px w-full bg-gradient-to-r from-[#D8BC83]/70 via-[#D8BC83]/20 to-transparent" />

              <p className="max-w-md text-sm leading-7 text-white/70 sm:text-base">
                Your dental journey starts with a conversation.
                Let us help you explore the next step in caring
                for your smile.
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute -bottom-3 -right-3 -z-10 h-24 w-24 rounded-3xl border border-[#D8BC83]/50"
          />
        </motion.div>
      </div>
    </section>
  );
}
