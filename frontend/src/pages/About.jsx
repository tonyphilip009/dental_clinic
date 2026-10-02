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
    <div className="bg-brand-light/30">
      {/* PAGE HEADER */}
      <section className="bg-brand-dark py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            About Us
          </p>

          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Meet the team behind your smile
          </h1>

          <p className="text-lg text-white/80">
            A friendly, experienced dental team dedicated to keeping your whole
            family healthy and confident.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="flex h-72 items-center justify-center rounded-3xl bg-brand text-8xl md:h-96">
            🦷
          </div>

          <div>
            <h2 className="mb-4 text-3xl font-bold text-brand-dark">
              Our story
            </h2>

            <p className="mb-4 text-gray-700">
              House of Dental was founded with a simple goal: to make quality
              dental care welcoming and accessible for everyone in our
              community.
            </p>

            <p className="text-gray-700">
              Today, our clinic offers a full range of treatments, from routine
              check-ups and cleanings to orthodontics and cosmetic dentistry,
              all delivered in a calm, modern, and friendly environment.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-10 text-center text-3xl font-bold text-brand-dark">
          What we stand for
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-8 text-center shadow"
            >
              <div className="mb-4 text-4xl">{item.icon}</div>

              <h3 className="mb-2 text-xl font-semibold text-brand-dark">
                {item.title}
              </h3>

              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MEET THE DENTISTS */}
      <DentistsSection />

      {/* CTA BANNER */}
      <section className="bg-brand py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold">
            Come and say hello
          </h2>

          <p className="mb-8 text-white/90">
            Book a visit and meet the team in person.
          </p>

          <Link
            to="/contact"
            className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand-dark transition hover:bg-brand-light"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;