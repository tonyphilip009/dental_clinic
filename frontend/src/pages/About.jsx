import { Link } from "react-router-dom";

const dentists = [
  {
    id: 1,
    name: "Dr. Alex Morgan",
    specialization: "General Dentistry",
    years_experience: 12,
    bio: "Dr. Morgan focuses on preventive care and gentle treatment for patients of all ages.",
    emoji: "👨‍⚕️",
  },
  {
    id: 2,
    name: "Dr. Priya Nair",
    specialization: "Orthodontics",
    years_experience: 9,
    bio: "Dr. Nair specialises in braces and aligners, helping patients achieve a straighter, healthier smile.",
    emoji: "👩‍⚕️",
  },
  {
    id: 3,
    name: "Dr. Samuel Reed",
    specialization: "Cosmetic Dentistry",
    years_experience: 15,
    bio: "Dr. Reed is passionate about smile makeovers, whitening, and natural-looking restorations.",
    emoji: "👨‍⚕️",
  },
];

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
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold text-brand-dark">
            Meet our dentists
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600">
            Our qualified specialists bring years of experience and a gentle
            approach to every appointment.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {dentists.map((dentist) => (
              <div
                key={dentist.id}
                className="overflow-hidden rounded-2xl bg-brand-light/30 shadow"
              >
                <div className="flex h-56 items-center justify-center bg-brand text-7xl">
                  {dentist.emoji}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-brand-dark">
                    {dentist.name}
                  </h3>
                  <p className="mb-1 font-medium text-brand">
                    {dentist.specialization}
                  </p>
                  <p className="mb-3 text-sm text-gray-500">
                    {dentist.years_experience} years of experience
                  </p>
                  <p className="text-gray-600">{dentist.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-brand py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold">Come and say hello</h2>
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