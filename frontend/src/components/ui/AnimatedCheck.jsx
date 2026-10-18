
import { motion, useReducedMotion } from "motion/react";

export default function AnimatedCheck({
  className = "h-16 w-16",
}) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 52 52"
      className={className}
      aria-hidden="true"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        initial={
          reduceMotion ? false : { pathLength: 0 }
        }
        animate={{ pathLength: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.6,
          ease: "easeOut",
        }}
      />

      <motion.path
        d="M14 27 l8 8 l16 -17"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={
          reduceMotion ? false : { pathLength: 0 }
        }
        animate={{ pathLength: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.4,
          delay: reduceMotion ? 0 : 0.5,
          ease: "easeOut",
        }}
      />
    </svg>
  );
}
