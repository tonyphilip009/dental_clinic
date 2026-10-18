
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="overflow-x-clip bg-[#faf8f4]">
      {/* HERO */}
      <section className="relative isolate min-h-[600px] overflow-hidden bg-[#17283f] text-white sm:min-h-[650px] lg:min-h-[700px]">
        {/* Background image */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage: "url('/dental-hero.png')",
          }}
          role="img"
          aria-label="Dentist in a modern dental clinic"
        />

        {/* Navy overlay for readable text */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#10243d]/95 via-[#17283f]/75 to-[#17283f]/25" />

        {/* Hero content */}
        <div className="mx-auto grid min-h-[600px] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 sm:min-h-[650px] sm:px-8 lg:min-h-[700px] lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-20">
          <div className="max-w-2xl text-center lg:text-left">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#e8d8b5]">
              Welcome to House of Dental
            </p>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Your Smile,
              <span className="mt-2 block text-[#e8d8b5]">
                Our Priority
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg lg:mx-0">
              Experience gentle, modern dental care with experienced
              professionals dedicated to keeping your smile healthy and bright.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center rounded-xl bg-[#c5a46d] px-7 py-3.5 font-semibold text-[#17283f] shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#e8d8b5]"
              >
                Book an Appointment
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-xl border border-white/60 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:bg-white/15"
              >
                Explore Our Services
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/80 lg:justify-start">
              <span>✓ Patient-focused care</span>
              <span>✓ Modern treatments</span>
              <span>✓ Easy appointment booking</span>
            </div>
          </div>

          {/* Keeps the right side available for the background dentist */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#a88750]">
            The House of Dental difference
          </p>

          <h2 className="mb-5 text-3xl font-bold text-[#17283f] sm:text-4xl">
            Care that puts your smile first
          </h2>

          <p className="leading-relaxed text-[#596474]">
            We believe every dental visit should feel comfortable, calm,
            and stress-free. Our friendly team combines professional care
            with modern treatments to support your oral health at every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-7 text-center shadow-[0_12px_32px_-14px_rgba(23,40,63,0.18)] ring-1 ring-[#17283f]/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
            <div className="mb-4 text-4xl" aria-hidden="true">
              👨‍⚕️
            </div>

            <h3 className="mb-3 text-xl font-semibold text-[#17283f]">
              Experienced Dentists
            </h3>

            <p className="leading-relaxed text-[#596474]">
              Our dentists take the time to understand your needs and explain
              your treatment options clearly.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-7 text-center shadow-[0_12px_32px_-14px_rgba(23,40,63,0.18)] ring-1 ring-[#17283f]/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8">
            <div className="mb-4 text-4xl" aria-hidden="true">
              🩺
            </div>

            <h3 className="mb-3 text-xl font-semibold text-[#17283f]">
              Modern Equipment
            </h3>

            <p className="leading-relaxed text-[#596474]">
              Modern dental technology supports precise treatment and a more
              comfortable patient experience.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-7 text-center shadow-[0_12px_32px_-14px_rgba(23,40,63,0.18)] ring-1 ring-[#17283f]/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8 md:col-span-2 lg:col-span-1">
            <div className="mb-4 text-4xl" aria-hidden="true">
              😁
            </div>

            <h3 className="mb-3 text-xl font-semibold text-[#17283f]">
              Care for Every Smile
            </h3>

            <p className="leading-relaxed text-[#596474]">
              From routine check-ups to more advanced treatments, we help
              patients of all ages care for their smiles.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-[#17283f] px-4 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#e8d8b5]">
            Your next visit starts here
          </p>

          <h2 className="mb-5 text-3xl font-bold sm:text-4xl">
            Ready for a healthier smile?
          </h2>

          <p className="mx-auto mb-8 max-w-xl leading-relaxed text-white/80">
            Book your appointment and let our team help you take the next step
            toward better oral health.
          </p>

          <Link
            to="/booking"
            className="inline-flex items-center justify-center rounded-xl bg-[#c5a46d] px-8 py-3.5 font-semibold text-[#17283f] transition duration-300 hover:-translate-y-1 hover:bg-[#e8d8b5]"
          >
            Book Your Visit
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
