
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

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 bg-brand-dark text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* Clinic information */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span aria-hidden="true" className="text-2xl">
              🦷
            </span>
            {clinic.name}
          </h2>

          <p className="mt-3 leading-relaxed text-white/80">
            {clinic.tagline}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-semibold">Quick links</h3>

          <ul className="mt-3 space-y-2 text-white/80">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-block py-1 transition hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact information */}
        <div>
          <h3 className="font-semibold">Contact us</h3>

          <ul className="mt-3 space-y-3 text-white/80">
            <li>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block break-words transition hover:text-accent"
              >
                📍 {clinic.address}
              </a>
            </li>

            <li>
              <a
                href={phoneHref}
                className="inline-block transition hover:text-accent"
              >
                📞 {clinic.phone}
              </a>
            </li>

            <li>
              <a
                href={emailHref}
                className="inline-block break-all transition hover:text-accent"
              >
                ✉️ {clinic.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Opening hours */}
        <div>
          <h3 className="font-semibold">Opening hours</h3>

          <dl className="mt-3 space-y-3 text-white/80">
            {clinic.hours.map((row) => (
              <div key={row.days}>
                <dt>{row.days}</dt>
                <dd className="font-medium text-white">
                  {row.time}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-white/70">
        © {year} {clinic.name}. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
