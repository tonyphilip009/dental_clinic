
import { motion, useReducedMotion } from "motion/react";

const STAR =
  "M0 -12 C1 -4 4 -1 12 0 C4 1 1 4 0 12 C-1 4 -4 1 -12 0 C-4 -1 -1 -4 0 -12 Z";

function Sparkle({ x, y, scale = 1, delay = 0, reduce }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <motion.path
        d={STAR}
        fill="#D8BC83"
        initial={false}
        animate={
          reduce
            ? { opacity: 0.9, scale: 1 }
            : {
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.2, 0.5],
                rotate: [0, 25, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }
        }
      />
    </g>
  );
}

export default function ToothIllustration({ className = "" }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { rotate: [-2, 2, -2] }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 200 250"
        role="img"
        aria-label="Illustration of a healthy tooth"
        className="h-full w-full drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="tooth-fill"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F7F0E4" />
            <stop offset="100%" stopColor="#D8BC83" />
          </linearGradient>

          <linearGradient
            id="tooth-stroke"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#D8BC83" />
            <stop offset="100%" stopColor="#9B7A42" />
          </linearGradient>
        </defs>

        {/* Tooth crown and roots */}
        <path
          d="M60 30
             C30 30 15 55 20 90
             C24 120 38 135 42 170
             C45 200 50 225 62 225
             C76 225 80 190 86 160
             C90 145 110 145 114 160
             C120 190 124 225 138 225
             C150 225 155 200 158 170
             C162 135 176 120 180 90
             C185 55 170 30 140 30
             C125 30 115 42 100 42
             C85 42 75 30 60 30 Z"
          fill="url(#tooth-fill)"
          stroke="url(#tooth-stroke)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Enamel highlight */}
        <path
          d="M46 58 C38 74 36 92 41 110"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Subtle crown detail */}
        <path
          d="M72 55 C82 66 88 72 100 72 C112 72 118 66 128 55"
          fill="none"
          stroke="#D8BC83"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Animated champagne-gold sparkles */}
        <Sparkle
          x={178}
          y={28}
          scale={1}
          delay={0}
          reduce={reduce}
        />

        <Sparkle
          x={20}
          y={34}
          scale={0.8}
          delay={0.9}
          reduce={reduce}
        />

        <Sparkle
          x={190}
          y={125}
          scale={0.6}
          delay={1.7}
          reduce={reduce}
        />

        <Sparkle
          x={100}
          y={10}
          scale={0.9}
          delay={2.2}
          reduce={reduce}
        />
      </svg>
    </motion.div>
  );
}
