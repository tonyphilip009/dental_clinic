import { motion } from "motion/react";

export default function Loading({ message = "Loading..." }) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-2 border-accent/15 border-t-accent"
        />

        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          className="h-5 w-5 rounded-full bg-accent/15"
        />

        <span className="absolute text-xs font-semibold text-accent">
          H
        </span>
      </div>

      <motion.p
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        className="mt-5 max-w-sm text-sm leading-6 text-brand-light/65"
      >
        {message}
      </motion.p>

      <div className="mt-3 flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              delay: dot * 0.15,
              ease: "easeInOut",
            }}
            className="h-1 w-1 rounded-full bg-accent"
          />
        ))}
      </div>
    </motion.div>
  );
}
