
import { Link } from "react-router-dom";
import {
  clinic,
  emailHref,
  mapsHref,
  phoneHref,
} from "../clinic";

function InfoCard({ icon, title, children }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <p className="text-3xl" aria-hidden="true">
        {icon}
      </p>

      <h2 className="mt-3 text-lg font-semibold text-brand-dark">
        {title}
      </h2>

      <div className="mt-2 text-gray-700">
        {children}
      </div>
    </div>
  );
}

function Contact() {
  return (
    <section className="bg-brand-light/20 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">

        {/* Page heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h1 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Have a question or need help with a booking? Call, email,
            or visit us. We would love to hear from you.
          </p>
        </div>

        {/* Contact information cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Address */}
          <InfoCard icon="📍" title="Visit us">
            <p className="break-words">{clinic.address}</p>

            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-lg border border-brand px-4 py-2 font-semibold text-brand transition hover:bg-brand-light/30"
            >
              Get directions
            </a>
          </InfoCard>

          {/* Phone */}
          <InfoCard icon="📞" title="Call us">
            <p>Speak to our team during opening hours.</p>

            <a
              href={phoneHref}
              className="mt-3 inline-block rounded-lg border border-brand px-4 py-2 font-semibold text-brand transition hover:bg-brand-light/30"
            >
              {clinic.phone}
            </a>
          </InfoCard>

          {/* Email */}
          <InfoCard icon="✉️" title="Email us">
            <p>Contact us by email for your questions.</p>

            <a
              href={emailHref}
              className="mt-3 inline-block break-all rounded-lg border border-brand px-4 py-2 font-semibold text-brand transition hover:bg-brand-light/30"
            >
              {clinic.email}
            </a>
          </InfoCard>

          {/* Opening hours */}
          <InfoCard icon="🕘" title="Opening hours">
            <dl className="space-y-3">
              {clinic.hours.map((row) => (
                <div
                  key={row.days}
                  className="flex flex-wrap justify-between gap-x-4 gap-y-1"
                >
                  <dt>{row.days}</dt>
                  <dd className="font-semibold text-brand-dark">
                    {row.time}
                  </dd>
                </div>
              ))}
            </dl>
          </InfoCard>
        </div>

        {/* Booking banner */}
        <div className="mt-8 rounded-xl bg-brand-dark p-6 text-center text-white shadow-md sm:p-8">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to book?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Choose your treatment, dentist, and preferred time
            through our online appointment system.
          </p>

          <Link
            to="/booking"
            className="mt-5 inline-block w-full rounded-lg bg-accent px-6 py-3 font-semibold text-brand-dark transition hover:opacity-90 sm:w-auto"
          >
            Book an appointment
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Contact;
