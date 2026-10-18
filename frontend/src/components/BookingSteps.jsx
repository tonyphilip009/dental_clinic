import { motion, useReducedMotion } from "motion/react";

const STEPS = [
  "Service",
  "Dentist & Time",
  "Your Details",
  "Verify",
];

export default function BookingSteps({ current }) {
  const reduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Appointment booking progress"
      className="mb-10"
    >
      <ol className="mx-auto flex max-w-2xl items-start justify-between">
        {STEPS.map((label, index) => {
          const number = index + 1;
          const done = number < current;
          const active = number === current;

          return (
            <li
              key={label}
              aria-current={active ? "step" : undefined}
              className="relative flex min-w-0 flex-1 flex-col items-center"
            >
              {index > 0 && (
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={{
                    backgroundColor: done
                      ? "#D6A83F"
                      : "rgba(214,168,63,0.18)",
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.3,
                  }}
                  className="absolute right-1/2 top-5 h-px w-full"
                />
              )}

              <motion.span
                initial={false}
                animate={{
                  scale: active && !reduceMotion ? 1.06 : 1,
                  backgroundColor: done
                    ? "#D6A83F"
                    : active
                      ? "#D6A83F"
                      : "#211F1A",
                  color: done || active ? "#171714" : "#B9B1A2",
                  borderColor: done || active
                    ? "#D6A83F"
                    : "rgba(214,168,63,0.3)",
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.25,
                  ease: "easeOut",
                }}
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold shadow-sm sm:h-11 sm:w-11"
              >
                {done ? (
                  <motion.span
                    initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.2,
                    }}
                    aria-label="Completed"
                  >
                    ✓
                  </motion.span>
                ) : (
                  number
                )}
              </motion.span>

              <span
                className={`mt-3 max-w-full text-center text-[10px] leading-4 sm:text-xs ${
                  active
                    ? "font-semibold text-accent"
                    : done
                      ? "font-medium text-brand-light/80"
                      : "text-brand-light/40"
                }`}
              >
                {label}
              </span>

              {active && (
                <motion.span
                  layoutId="booking-step-indicator"
                  className="mt-2 h-0.5 w-6 rounded-full bg-accent"
                  transition={{
                    duration: reduceMotion ? 0 : 0.25,
                  }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
