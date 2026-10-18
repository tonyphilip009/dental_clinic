import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import { getErrorMessage, getService } from "../api";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import ServiceIcon from "../components/ServiceIcon";
import useFetch from "../hooks/useFetch";

const EASE = [0.22, 1, 0.36, 1];

const DJANGO_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const SERVICE_IMAGES = {
  "complete dental check-up": "/image/services/complete-dental-checkup.png",
  "complete dental check up": "/image/services/complete-dental-checkup.png",
  "teeth cleaning": "/image/services/teeth-cleaning.png",
  "teeth whitening": "/image/services/teeth-whitening.png",
  "root canal treatment": "/image/services/root-canal-treatment.png",
};

function getServiceImage(service) {
  if (service?.image) {
    if (/^https?:\/\//i.test(service.image)) {
      return service.image;
    }

    return `${DJANGO_BASE_URL}/${service.image.replace(/^\/+/, "")}`;
  }

  return SERVICE_IMAGES[service?.name?.trim().toLowerCase()] || null;
}

const CHECKUP_DETAILS = {
  eyebrow: "Preventive dental care",
  intro:
    "Keep your smile healthy with a comprehensive examination designed to identify dental concerns early and support long-term oral health.",
  benefits: [
    "Assessment of teeth and gum health",
    "Early identification of potential dental problems",
    "Personalised oral hygiene recommendations",
    "Guidance on maintaining a healthy smile",
  ],
  steps: [
    {
      title: "Dental examination",
      description:
        "Your dentist examines your teeth, gums, and overall oral health.",
    },
    {
      title: "Discussion and advice",
      description:
        "Discuss your concerns and receive recommendations tailored to your needs.",
    },
    {
      title: "Next steps",
      description:
        "Your dentist explains whether preventive care or further assessment may be helpful.",
    },
  ],
  aftercare: [
    "Brush twice daily using fluoride toothpaste.",
    "Clean between your teeth every day.",
    "Follow your dentist's recommended check-up schedule.",
  ],
};

const TREATMENT_DETAILS = {
  "complete dental check-up": CHECKUP_DETAILS,
  "complete dental check up": CHECKUP_DETAILS,

  "teeth cleaning": {
    eyebrow: "Professional oral hygiene",
    intro:
      "Professional teeth cleaning helps remove plaque and hardened deposits that regular brushing may not fully remove, supporting healthier teeth and gums.",
    benefits: [
      "Removal of plaque and tartar deposits",
      "Support for healthier gums",
      "A cleaner, fresher-feeling mouth",
      "Personalised advice on daily oral hygiene",
    ],
    steps: [
      {
        title: "Oral health assessment",
        description:
          "Your dentist or hygienist assesses your teeth and gum health.",
      },
      {
        title: "Professional cleaning",
        description:
          "Suitable professional instruments are used to remove deposits from your teeth.",
      },
      {
        title: "Finishing advice",
        description:
          "Receive guidance on brushing, interdental cleaning, and future maintenance.",
      },
    ],
    aftercare: [
      "Continue brushing gently twice daily.",
      "Clean between your teeth every day.",
      "Follow your dentist's advice if your gums feel sensitive after cleaning.",
    ],
  },

  "teeth whitening": {
    eyebrow: "Smile enhancement",
    intro:
      "Professional teeth whitening may help lighten suitable tooth discolouration. Your dentist will assess your teeth and gums and discuss realistic results before treatment.",
    benefits: [
      "A treatment plan tailored to your smile",
      "Assessment of the cause of tooth discolouration",
      "Professional guidance on suitable whitening options",
      "Advice on maintaining your results",
    ],
    steps: [
      {
        title: "Smile assessment",
        description:
          "Your dentist checks your oral health and discusses your whitening goals.",
      },
      {
        title: "Personalised treatment plan",
        description:
          "Suitable whitening options, expected results, and possible sensitivity are discussed.",
      },
      {
        title: "Aftercare guidance",
        description:
          "Receive advice on maintaining your results and managing temporary sensitivity.",
      },
    ],
    aftercare: [
      "Follow your dentist's instructions for your chosen treatment.",
      "Avoid excessive use of whitening products.",
      "Contact your dentist if you experience persistent sensitivity or discomfort.",
    ],
  },

  "root canal treatment": {
    eyebrow: "Restorative dental care",
    intro:
      "Root canal treatment may help save a tooth when the soft tissue inside it becomes inflamed or infected. Your dentist will assess the tooth and explain the most appropriate treatment.",
    benefits: [
      "May help preserve a natural tooth",
      "Addresses problems involving the inner tooth tissue",
      "Aims to relieve symptoms caused by the affected tooth",
      "Supports restoration of the tooth's function",
    ],
    steps: [
      {
        title: "Assessment and diagnosis",
        description:
          "Your dentist examines the tooth and may recommend appropriate imaging.",
      },
      {
        title: "Treatment",
        description:
          "The affected tissue is treated, and the root canal system is cleaned and sealed.",
      },
      {
        title: "Tooth restoration",
        description:
          "Your dentist discusses the appropriate restoration and follow-up care.",
      },
    ],
    aftercare: [
      "Follow the instructions provided by your dentist.",
      "Avoid chewing hard foods on the treated tooth until your dentist advises it is safe.",
      "Attend recommended follow-up appointments and complete any planned restoration.",
    ],
  },
};

const DEFAULT_DETAILS = {
  eyebrow: "Personalised dental care",
  intro:
    "Every smile is different. Our dental team will assess your needs, explain suitable treatment options, and help you understand the next steps.",
  benefits: [
    "A treatment plan tailored to your needs",
    "Clear explanations of available options",
    "Guidance from a dental professional",
    "Advice on maintaining your oral health",
  ],
  steps: [
    {
      title: "Consultation",
      description: "Discuss your concerns and what you would like to achieve.",
    },
    {
      title: "Assessment",
      description:
        "Your dentist evaluates your oral health and suitable treatment options.",
    },
    {
      title: "Personalised plan",
      description:
        "Review the recommended next steps and arrange treatment if appropriate.",
    },
  ],
  aftercare: [
    "Follow the advice provided by your dental professional.",
    "Maintain a consistent daily oral hygiene routine.",
    "Attend follow-up visits when recommended.",
  ],
};

function getTreatmentDetails(name = "", service = null) {
  const normalized = name.trim().toLowerCase();
  let fallback = DEFAULT_DETAILS;

  if (TREATMENT_DETAILS[normalized]) {
    fallback = TREATMENT_DETAILS[normalized];
  } else if (
    normalized.includes("check") ||
    normalized.includes("exam")
  ) {
    fallback = CHECKUP_DETAILS;
  } else if (
    normalized.includes("clean") ||
    normalized.includes("scaling")
  ) {
    fallback = TREATMENT_DETAILS["teeth cleaning"];
  } else if (
    normalized.includes("whiten") ||
    normalized.includes("bleach")
  ) {
    fallback = TREATMENT_DETAILS["teeth whitening"];
  } else if (normalized.includes("root canal")) {
    fallback = TREATMENT_DETAILS["root canal treatment"];
  }

  // Prefer content saved in Django Admin. Keep the existing treatment
  // copy as a fallback if a field has not been filled in yet.
  const benefits =
    Array.isArray(service?.benefits) && service.benefits.length > 0
      ? service.benefits.filter(
          (item) => typeof item === "string" && item.trim()
        )
      : fallback.benefits;

  const steps =
    Array.isArray(service?.treatment_steps) &&
    service.treatment_steps.length > 0
      ? service.treatment_steps.filter(
          (step) =>
            step &&
            typeof step.title === "string" &&
            step.title.trim() &&
            typeof step.description === "string" &&
            step.description.trim()
        )
      : fallback.steps;

  const aftercare =
    Array.isArray(service?.aftercare) && service.aftercare.length > 0
      ? service.aftercare.filter(
          (item) => typeof item === "string" && item.trim()
        )
      : fallback.aftercare;

  return {
    ...fallback,
    benefits,
    steps,
    aftercare,
  };
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A67C2E]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#17243A] sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 leading-7 text-[#626B78]">{description}</p>
      )}
    </div>
  );
}

function AnimatedSection({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: EASE,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function ServiceDetail() {
  const { id } = useParams();
  const reduceMotion = useReducedMotion();

  const {
    data: service,
    loading,
    error,
    reload,
  } = useFetch(() => getService(id), [id]);

  const notFound = error?.response?.status === 404;
  const details = getTreatmentDetails(service?.name, service);
  const serviceImage = getServiceImage(service);

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF8F3] text-[#17243A]">
      {/* Dark top section sits behind the transparent navbar. */}
      <section className="relative -mt-0 bg-[#101820] px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(198,155,69,0.16),transparent_55%)]"
        />

        <div className="relative mx-auto max-w-6xl">
          {loading && (
            <div className="py-20">
              <Loading message="Preparing your treatment details..." />
            </div>
          )}

          {error && notFound && (
            <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-sm">
              <ErrorMessage message="Sorry, we couldn't find that service." />

              <Link
                to="/services"
                className="mt-5 inline-flex rounded-lg bg-[#17243A] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#263956]"
              >
                View all services
              </Link>
            </div>
          )}

          {error && !notFound && (
            <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-sm">
              <ErrorMessage
                message={getErrorMessage(
                  error,
                  "We couldn't load this service right now."
                )}
                onRetry={reload}
              />
            </div>
          )}

          {!loading && !error && service && (
            <motion.section
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 24, scale: 0.99 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: reduceMotion ? 0 : 0.8,
                ease: EASE,
              }}
              className="overflow-hidden rounded-3xl border border-[#C69B45]/25 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.16)]"
            >
              <div className="h-1 bg-gradient-to-r from-[#A67C2E] via-[#E8D3A1] to-[#A67C2E]" />

              <div className="grid md:grid-cols-[1.2fr_0.8fr]">
                <div className="p-6 sm:p-10 lg:p-12">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67C2E]">
                    {details.eyebrow}
                  </p>

                  <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#17243A] sm:text-4xl lg:text-5xl">
                    {service.name}
                  </h1>

                  <p className="mt-5 max-w-2xl leading-8 text-[#626B78]">
                    {service.description}
                  </p>

                  {service.price !== null &&
                    service.price !== undefined &&
                    service.price !== "" && (
                      <div className="mt-7 inline-flex flex-col rounded-2xl border border-[#C69B45]/30 bg-[#FAF8F3] px-5 py-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#85817A]">
                          Starting from
                        </span>

                        <span className="mt-1 text-2xl font-semibold text-[#A67C2E]">
                          ₹{Number(service.price).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to={`/booking?service=${service.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17243A] px-6 py-3.5 font-semibold text-white shadow-[0_8px_20px_rgba(23,36,58,0.16)] transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-[#263956] hover:shadow-[0_14px_28px_rgba(23,36,58,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C69B45]"
                    >
                      Book an Appointment <span aria-hidden="true">→</span>
                    </Link>

                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center rounded-xl border border-[#C69B45]/40 bg-white px-6 py-3.5 font-semibold text-[#17243A] transition-colors duration-300 hover:bg-[#FAF8F3]"
                    >
                      Contact us
                    </Link>
                  </div>
                </div>

                {/* Service image */}
                <div className="group relative flex min-h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-[#F7F1E5] via-[#FAF8F3] to-[#EDE4D3] sm:min-h-80 md:min-h-full">
                  {serviceImage ? (
                    <motion.img
                      src={serviceImage}
                      alt={service.name}
                      loading="lazy"
                      initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                      transition={{ duration: 0.8, ease: EASE }}
                      onError={(event) => {
                        const fallback =
                          SERVICE_IMAGES[service.name?.trim().toLowerCase()];

                        if (
                          fallback &&
                          event.currentTarget.dataset.fallback !== "used"
                        ) {
                          event.currentTarget.dataset.fallback = "used";
                          event.currentTarget.src = fallback;
                        } else {
                          event.currentTarget.style.display = "none";
                        }
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#C69B45]/30 bg-white/90 shadow-[0_15px_45px_rgba(23,36,58,0.10)] sm:h-40 sm:w-40">
                      <ServiceIcon
                        icon={service.icon}
                        name={service.name}
                        size="text-7xl sm:text-8xl"
                      />
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#17243A]/75 via-[#17243A]/10 to-transparent" />

                  <div className="pointer-events-none absolute bottom-6 left-6 right-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E8D3A1]">
                      House of Dental
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                      {service.name}
                    </h2>

                    <p className="mt-2 text-sm text-white/85">
                      Care for every smile
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </section>

      {/* Ivory treatment information */}
      {!loading && !error && service && (
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-48 -z-0 h-72 w-72 rounded-full bg-[#D6A83F]/[0.07] blur-3xl"
          />

          <AnimatedSection>
            <SectionHeading
              eyebrow="Your treatment"
              title="Care designed around your smile"
              description={details.intro}
            />
          </AnimatedSection>

          <AnimatedSection className="mt-12" delay={0.05}>
            <SectionHeading
              eyebrow="Why it matters"
              title="Benefits of this treatment"
              description="Your dentist will explain which benefits are relevant to your individual dental needs."
            />

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {details.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.55,
                    delay: reduceMotion ? 0 : index * 0.08,
                    ease: EASE,
                  }}
                  className="flex gap-4 rounded-2xl border border-[#C69B45]/20 bg-white p-5 shadow-[0_4px_18px_rgba(23,36,58,0.035)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#C69B45]/50 hover:shadow-[0_12px_28px_rgba(23,36,58,0.08)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F1E5] font-semibold text-[#A67C2E]">
                    ✓
                  </span>

                  <p className="self-center leading-7 text-[#465163]">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-16 sm:mt-20">
            <SectionHeading
              eyebrow="Your visit"
              title="What to expect"
              description="Our team will guide you through each stage and explain your options before treatment begins."
            />

            <div className="mt-8 space-y-4">
              {details.steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.6,
                    delay: reduceMotion ? 0 : index * 0.1,
                    ease: EASE,
                  }}
                  className="flex gap-5 rounded-2xl border border-[#C69B45]/20 bg-white p-5 shadow-[0_4px_18px_rgba(23,36,58,0.035)] sm:p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#17243A] text-sm font-semibold text-[#E8D3A1]">
                    0{index + 1}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#17243A]">
                      {step.title}
                    </h3>

                    <p className="mt-2 leading-7 text-[#626B78]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-16 sm:mt-20">
            <div className="rounded-3xl border border-[#C69B45]/25 bg-[#F2EBDD] p-6 sm:p-9">
              <SectionHeading
                eyebrow="After your visit"
                title="Looking after your smile"
                description="General guidance to help you care for your oral health. Follow any treatment-specific instructions your dentist gives you."
              />

              <ul className="mt-6 space-y-4">
                {details.aftercare.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-3 leading-7 text-[#465163]"
                  >
                    <span className="mt-0.5 font-semibold text-[#A67C2E]">
                      ✓
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-16 sm:mt-20">
            <div className="relative overflow-hidden rounded-3xl bg-[#17243A] px-6 py-10 text-center shadow-[0_16px_45px_rgba(23,36,58,0.16)] sm:px-10 sm:py-14">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-[#E8D3A1]/15"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full border border-[#E8D3A1]/15"
              />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8D3A1]">
                  Your smile, our priority
                </p>

                <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  Ready to take the next step?
                </h2>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-white/75">
                  Book a visit with House of Dental to discuss your needs
                  and explore the right treatment for your smile.
                </p>

                <Link
                  to={`/booking?service=${service.id}`}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#D6A83F] px-7 py-3.5 font-semibold text-[#17243A] transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-[#E8C66F] hover:shadow-[0_12px_25px_rgba(0,0,0,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Book Your Appointment <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      )}
    </main>
  );
}