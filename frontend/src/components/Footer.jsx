import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import {
  clinic,
  emailHref,
  mapsHref,
  phoneHref,
} from "../clinic";

const QUICK_LINKS = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
  { to: "/booking", label: "Book an appointment" },
];

const CONTACT_ITEMS = [
  {
    label: "Visit our clinic",
    icon: "location",
    href: mapsHref,
    value: clinic.address,
    external: true,
  },
  {
    label: "Call our team",
    icon: "phone",
    href: phoneHref,
    value: clinic.phone,
  },
  {
    label: "Email us",
    icon: "mail",
    href: emailHref,
    value: clinic.email,
  },
];

function FooterIcon({ type }) {
  const paths = {
    location: (
      <>
        <path
          d="M16 7.5c0 5-6 10-6 10s-6-5-6-10a6 6 0 1 1 12 0Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="10"
          cy="7.5"
          r="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </>
    ),

    phone: (
      <path
        d="m6.5 3.5 2.5 3-1.5 2c1 2 2 3 4 4l2-1.5 3 2.5-.5 2.5c-.2 1-1.2 1.5-2.2 1.3C8 16 4 12 3 6.2 2.8 5.2 3.5 4.2 4.5 4l2-.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),

    mail: (
      <>
        <rect
          x="3"
          y="4.5"
          width="14"
          height="11"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m4 6 6 4.5L16 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-5 w-5 shrink-0"
    >
      {paths[type]}
    </svg>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="relative mt-8 overflow-hidden bg-[#11110F] text-[#F7F0E4]">
      {/* Background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-[#C5A46D]/[0.07] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#15243B]/40 blur-3xl"
      />

      {/* Top champagne accent */}
      <div
        aria-hidden="true"
        className="h-px bg-gradient-to-r from-transparent via-[#C5A46D]/70 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:py-16">
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.1,
              },
            },
          }}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.3fr_0.9fr] lg:gap-10"
        >
          {/* Brand — matching navbar logo */}
          <motion.div variants={reveal}>
            <Link
              to="/"
              aria-label="House of Dental home"
              className="group inline-flex items-center gap-4"
            >
              {/* Circular gold H monogram */}
              <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border border-[#C5A46D] font-serif text-[38px] leading-none text-[#E4C783] transition-all duration-300 group-hover:border-[#F0D58A] group-hover:bg-[#C5A46D]/10">
                H
              </span>

              {/* Brand name and tagline */}
              <span className="min-w-0">
                <span className="block text-xl font-semibold uppercase tracking-[0.035em] text-white sm:text-2xl">
                  House of Dental
                </span>

                <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D8BC83]">
                  Care for every smile
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#C6C3BC]">
              {clinic.tagline}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C5A46D]" />
              <span className="font-serif text-sm italic text-[#D8BC83]">
                Thoughtful care. Confident smiles.
              </span>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.nav
            variants={reveal}
            aria-label="Footer navigation"
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E4C783]">
              Explore
            </h3>

            <div className="mt-4 h-px w-10 bg-[#C5A46D]/60" />

            <ul className="mt-4 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-2 py-1 text-sm text-[#C6C3BC] transition-colors duration-300 hover:text-[#E4C783] focus-visible:text-[#E4C783] focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-0 bg-[#D8BC83] transition-all duration-300 group-hover:w-3"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Contact information */}
          <motion.div variants={reveal}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E4C783]">
              Get in touch
            </h3>

            <div className="mt-4 h-px w-10 bg-[#C5A46D]/60" />

            <ul className="mt-5 space-y-5">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.icon}>
                  <a
                    href={item.href}
                    {...(item.external
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className="group flex min-w-0 items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C5A46D]/25 bg-white/[0.035] text-[#D8BC83] transition-colors duration-300 group-hover:border-[#C5A46D]/60 group-hover:bg-[#C5A46D]/10">
                      <FooterIcon type={item.icon} />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[10px] font-medium uppercase tracking-[0.15em] text-[#A9A69F]">
                        {item.label}
                      </span>

                      <span className="mt-1 block break-words text-sm leading-6 text-[#E7E3DC] transition-colors duration-300 group-hover:text-[#E4C783]">
                        {item.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Opening hours */}
          <motion.div variants={reveal}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E4C783]">
              Opening hours
            </h3>

            <div className="mt-4 h-px w-10 bg-[#C5A46D]/60" />

            <dl className="mt-5 space-y-4">
              {clinic.hours.map((row) => (
                <div
                  key={row.days}
                  className="border-l border-[#C5A46D]/40 pl-4"
                >
                  <dt className="text-sm text-[#C6C3BC]">
                    {row.days}
                  </dt>

                  <dd className="mt-1 text-sm font-medium leading-6 text-[#FAF5EB]">
                    {row.time}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C5A46D]/20 bg-[#C5A46D]/[0.06] px-3 py-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#D8BC83]"
              />

              <span className="text-[10px] font-medium tracking-wide text-[#D8BC83]">
                Please book your visit in advance
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Copyright bar */}
      <div className="relative border-t border-[#C5A46D]/15 bg-[#0B0B0A]/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center sm:flex-row sm:px-8 sm:text-left">
          <p className="text-xs leading-6 text-[#A9A69F]">
            © {year} {clinic.name}. All rights reserved.
          </p>

          <p className="font-serif text-xs italic tracking-wide text-[#C5A46D]">
            Made with care for every smile.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;