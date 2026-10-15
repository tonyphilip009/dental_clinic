
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="overflow-x-clip bg-brand-light/30">
      {/* HERO */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
          {/* Hero content */}
          <div className="min-w-0 text-center lg:text-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
              Welcome to House of Dental
            </p>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Healthy smiles start with gentle, caring dentistry
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base text-white/80 sm:text-lg lg:mx-0">
              Modern treatments, experienced dentists, and a comfortable
              environment for the whole family.
            </p>

            {/* Hero buttons */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
              <Link
                to="/booking"
                className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 font-semibold text-brand-dark transition hover:opacity-90 sm:w-auto sm:px-8"
              >
                Book an Appointment
              </Link>

              <Link
                to="/services"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:px-8"
              >
                Our Services
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mx-auto flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-3xl bg-brand text-7xl sm:text-8xl lg:max-w-none">
            <span aria-label="Tooth" role="img">
              🦷
            </span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <h2 className="mb-4 text-2xl font-bold text-brand-dark sm:text-3xl">
            Why patients choose us
          </h2>

          <p className="leading-relaxed text-gray-700">
            At House of Dental, we believe a visit to the dentist should be
            calm, comfortable, and stress-free. Our friendly team combines
            years of experience with modern technology to give you and your
            family the best possible care, from routine check-ups to advanced
            treatments.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0 rounded-2xl bg-white p-6 text-center shadow sm:p-8">
            <div className="mb-4 text-4xl" aria-hidden="true">
              👨‍⚕️
            </div>

            <h3 className="mb-2 text-xl font-semibold text-brand-dark">
              Experienced Dentists
            </h3>

            <p className="leading-relaxed text-gray-600">
              Our qualified dentists have years of hands-on experience and
              take the time to explain every step of your treatment.
            </p>
          </div>

          <div className="min-w-0 rounded-2xl bg-white p-6 text-center shadow sm:p-8">
            <div className="mb-4 text-4xl" aria-hidden="true">
              🩺
            </div>

            <h3 className="mb-2 text-xl font-semibold text-brand-dark">
              Modern Equipment
            </h3>

            <p className="leading-relaxed text-gray-600">
              We use up-to-date dental technology to keep every procedure safe,
              precise, and as comfortable as possible.
            </p>
          </div>

          <div className="min-w-0 rounded-2xl bg-white p-6 text-center shadow sm:p-8 md:col-span-2 lg:col-span-1">
            <div className="mb-4 text-4xl" aria-hidden="true">
              😁
            </div>

            <h3 className="mb-2 text-xl font-semibold text-brand-dark">
              Caring for Every Smile
            </h3>

            <p className="leading-relaxed text-gray-600">
              From children to grandparents, we offer gentle, family-friendly
              care that helps every patient feel at ease.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-brand px-4 py-12 text-center text-white sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Ready for a brighter smile?
          </h2>

          <p className="mx-auto mb-8 max-w-xl leading-relaxed text-white/90">
            Book your visit today and let our team take care of the rest.
          </p>

          <Link
            to="/booking"
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3 font-semibold text-brand-dark transition hover:bg-brand-light sm:w-auto"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
