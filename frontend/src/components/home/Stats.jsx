
import { stats } from "../../clinic";
import { motion } from "motion/react";
import CountUp from "./CountUp";

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#15243B] py-16 sm:py-20">
      {/* Decorative gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#D8BC83]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D8BC83]">
            House of Dental
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-[#F7F0E4] sm:text-3xl">
            Excellence in Every Smile
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            Thoughtful dental care focused on your comfort,
            confidence, and long-term oral health.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
              }}
              className="group rounded-2xl border border-[#D8BC83]/25 bg-white p-7 text-center shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#D8BC83] hover:shadow-xl sm:p-8"
            >
              <p className="text-4xl font-bold tracking-tight text-[#15243B] sm:text-5xl">
                <CountUp
                  to={stat.value}
                  suffix={stat.suffix}
                />
              </p>

              <div className="mx-auto mt-4 h-px w-12 bg-[#D8BC83] transition-all duration-300 group-hover:w-20" />

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-600 sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-white/50">
          Figures shown are placeholders pending verification.
        </p>
      </div>
    </section>
  );
}
