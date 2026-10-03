import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-brand-light/30">
      {/* HERO */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-20 md:flex-row">
          <div className="flex-1 text-center md:text-left">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
              Welcome to House of Dental
            </p>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
              Healthy smiles start with gentle, caring dentistry
            </h1>

            <p className="mb-8 text-lg text-white/80">
              Modern treatments, experienced dentists, and a comfortable
              environment for the whole family.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
              {/* Book Appointment Button */}
              <Link
                to="/booking"
                className="rounded-full bg-accent px-8 py-3 font-semibold text-brand-dark transition hover:opacity-90"
              >
                Book an Appointment
              </Link>

              <Link
                to="/services"
                className="rounded-full border border-white/60 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Our Services
              </Link>
            </div>
          </div>

          {/* Placeholder for a hero image */}
          <div className="flex h-72 w-full flex-1 items-center justify-center rounded-3xl bg-brand text-8xl md:h-96">
            🦷
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-brand-dark">
            Why patients choose us
          </h2>

          <p className="text-gray-700">
            At House of Dental, we believe a visit to the dentist should be
            calm, comfortable, and stress-free. Our friendly team combines
            years of experience with modern technology to give you and your
            family the best possible care, from routine check-ups to advanced
            treatments.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <div className="mb-4 text-4xl">👨‍⚕️</div>

            <h3 className="mb-2 text-xl font-semibold text-brand-dark">
              Experienced Dentists
            </h3>

            <p className="text-gray-600">
              Our qualified dentists have years of hands-on experience and
              take the time to explain every step of your treatment.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <div className="mb-4 text-4xl">🩺</div>

            <h3 className="mb-2 text-xl font-semibold text-brand-dark">
              Modern Equipment
            </h3>

            <p className="text-gray-600">
              We use up-to-date dental technology to keep every procedure safe,
              precise, and as comfortable as possible.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <div className="mb-4 text-4xl">😁</div>

            <h3 className="mb-2 text-xl font-semibold text-brand-dark">
              Caring for Every Smile
            </h3>

            <p className="text-gray-600">
              From children to grandparents, we offer gentle, family-friendly
              care that helps every patient feel at ease.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-brand py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold">
            Ready for a brighter smile?
          </h2>

          <p className="mb-8 text-white/90">
            Book your visit today and let our team take care of the rest.
          </p>

          {/* Book Now Button */}
          <Link
            to="/booking"
            className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand-dark transition hover:bg-brand-light"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;