
import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useReducedMotion,
} from "motion/react";

export default function CountUp({
  to,
  suffix = "",
  duration = 1.8,
}) {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    margin: "-60px",
  });

  const reduce = useReducedMotion();

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduce) {
      setValue(to);
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        setValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
