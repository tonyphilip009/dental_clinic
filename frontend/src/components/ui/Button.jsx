
import { Link } from "react-router-dom";

const BASE =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3",
  lg: "px-8 py-4 text-lg",
};

const VARIANTS = {
  primary:
    "bg-linear-to-r from-brand to-brand-dark text-white shadow-glow hover:brightness-110",
  accent:
    "bg-linear-to-r from-accent to-gold-light text-brand-deep shadow-lg shadow-accent/30 hover:brightness-105",
  light: "bg-white text-brand-dark shadow-soft hover:shadow-glow",
  outline: "border-2 border-brand text-brand hover:bg-brand/10",
  ghost: "text-brand-dark hover:bg-brand-light/30",
};

export default function Button({
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `${BASE} ${SIZES[size]} ${
    VARIANTS[variant]
  } ${className}`;

  const shiny = variant === "primary" || variant === "accent";

  const content = (
    <>
      {shiny && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-[150%] skew-x-[-20deg] bg-white/30 transition-transform duration-700 group-hover:translate-x-[550%]"
        />
      )}

      <span className="relative inline-flex items-center gap-2">
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
