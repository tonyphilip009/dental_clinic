
import { Link } from "react-router-dom";
import DentistsSection from "../components/DentistsSection";

const values = [
  {
    id: 1,
    icon: "💙",
    title: "Compassionate Care",
    text: "We listen first, explain clearly, and make sure you feel comfortable at every visit.",
  },
  {
    id: 2,
    icon: "🔬",
    title: "Modern Technology",
    text: "Up-to-date equipment helps us deliver safe, precise, and efficient treatment.",
  },
  {
    id: 3,
    icon: "🤝",
    title: "Trust and Honesty",
    text: "Clear advice and transparent treatment plans, with no surprises.",
  },
];

function About() {
  return (
    <div className="overflow-x-clip bg-brand-light/30">
      {/* PAGE HEADER */}
      <section className="bg-brand-dark px-4 py-12 text-center text-white sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            About Us
          </p>

          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Meet the team behind your smile
          </h1>

          <p className="mx-auto max-w-2xl leading-relaxed text-white/80 sm:text-lg">
            A friendly, experienced dental team dedicated to keeping your whole
            family healthy and confident.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Tooth visual */}
          <div className="mx-auto flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-3xl bg-brand text-7xl sm:text-8xl lg:max-w-none">
            <span role="img" aria-label="Tooth">
              🦷
            </span>
          </div>

          {/* Story text */}
          <div className="min-w-0">
            <h2 className="mb-4 text-2xl font-bold text-brand-dark sm:text-3xl">
              Our story
            </h2>

            <p className="mb-4 leading-relaxed text-gray-700">
              House of Dental was founded with a simple goal: to make quality
              dental care welcoming and accessible for everyone in our
              community.
            </p>

            <p className="leading-relaxed text-gray-700">
              Today, our clinic offers a full range of treatments, from routine
              check-ups and cleanings to orthodontics and cosmetic dentistry,
              all delivered in a calm, modern, and friendly environment.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-brand-dark sm:mb-10 sm:text-3xl">
          What we stand for
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((item) => (
            <div
              key={item.id}
              className="min-w-0 rounded-2xl bg-white p-6 text-center shadow sm:p-8"
            >
              <div className="mb-4 text-4xl" aria-hidden="true">
                {item.icon}
              </div>

              <h3 className="mb-2 text-xl font-semibold text-brand-dark">
                {item.title}
              </h3>

              <p className="leading-relaxed text-gray-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MEET THE DENTISTS */}
      <DentistsSection />

      {/* CTA BANNER */}
      <section className="bg-brand px-4 py-12 text-center text-white sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Come and say hello
          </h2>

          <p className="mx-auto mb-8 max-w-xl leading-relaxed text-white/90">
            Book a visit and meet the team in person.
          </p>

          <Link
            to="/contact"
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3 font-semibold text-brand-dark transition hover:bg-brand-light sm:w-auto"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
