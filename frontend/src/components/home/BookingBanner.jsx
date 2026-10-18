
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function BookingBanner() {
  return (
    <section className="bg-[#FAF8F3] px-5 py-16 sm:py-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#15243B] px-6 py-14 text-center shadow-xl sm:px-12 sm:py-20"
      >
        {/* Decorative champagne-gold glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#D8BC83]/15 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D8BC83]">
            Your Smile Deserves It
          </p>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-[#F7F0E4] sm:text-4xl lg:text-5xl">
            Ready for a Brighter,
            <span className="block font-serif font-medium italic text-[#D8BC83]">
              Healthier Smile?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Take the next step towards caring for your smile.
            Explore our dental services or book an appointment
            at a time that suits you.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-xl bg-[#D8BC83] px-8 py-4 font-semibold text-[#15243B] transition duration-300 hover:-translate-y-1 hover:bg-[#E8D5A8]"
            >
              Book Your Appointment
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-4 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-[#D8BC83] hover:text-[#D8BC83]"
            >
              Contact Us
            </Link>
          </div>

          <div className="mx-auto mt-10 h-px max-w-xs bg-gradient-to-r from-transparent via-[#D8BC83]/60 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
