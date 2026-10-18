import { motion } from "motion/react";

export default function EmptyState({
  icon = "🦷",
  title,
  message,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-accent/20 bg-brand-dark text-center shadow-xl"
    >
      <div className="bg-gradient-to-b from-accent/10 to-transparent px-6 pb-8 pt-10 sm:px-10">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-accent/25 bg-accent/5 text-4xl"
        >
          <span aria-hidden="true">{icon}</span>
        </motion.div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          House of Dental
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand-light">
          {title}
        </h2>

        {message && (
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-brand-light/60">
            {message}
          </p>
        )}

        <div className="mx-auto mt-6 h-px w-16 bg-accent/50" />
      </div>
    </motion.div>
  );
}
