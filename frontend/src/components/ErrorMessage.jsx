import { motion } from "motion/react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-red-400/25 bg-brand-dark shadow-xl"
    >
      <div className="p-6 text-center sm:p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.3,
            ease: "easeOut",
          }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10"
        >
          <span
            aria-hidden="true"
            className="text-2xl font-semibold text-red-300"
          >
            !
          </span>
        </motion.div>

        <h3 className="mt-4 text-lg font-semibold text-brand-light">
          Something went wrong
        </h3>

        <p className="mt-2 break-words text-sm leading-6 text-red-200/90">
          {message}
        </p>

        {onRetry && (
          <motion.button
            type="button"
            onClick={onRetry}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 rounded-xl bg-accent px-6 py-3 font-semibold text-brand-dark transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-brand-dark"
          >
            Try again
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
