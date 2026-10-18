
import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) {
  const centered = align === "center";

  return (
    <Reveal
      className={`max-w-2xl ${
        centered ? "mx-auto text-center" : "text-left"
      }`}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-2 text-3xl font-extrabold text-brand-deep sm:text-4xl">
        {title}
      </h2>

      <div
        className={`mt-4 h-1 w-16 rounded-full bg-linear-to-r from-brand-vivid to-accent ${
          centered ? "mx-auto" : ""
        }`}
      />

      {subtitle && (
        <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
      )}
    </Reveal>
  );
}
