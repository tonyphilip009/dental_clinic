
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Reveal, {
  Stagger,
  StaggerItem,
} from "../components/ui/Reveal";
import SectionHeading from "../components/ui/SectionHeading";

const SWATCHES = [
  { name: "brand-deep", className: "bg-brand-deep text-white" },
  { name: "brand-dark", className: "bg-brand-dark text-white" },
  { name: "brand", className: "bg-brand text-white" },
  { name: "brand-vivid", className: "bg-brand-vivid text-white" },
  { name: "brand-light", className: "bg-brand-light text-brand-deep" },
  { name: "aqua", className: "bg-aqua text-brand-deep" },
  { name: "mint", className: "bg-mint text-brand-deep" },
  { name: "accent", className: "bg-accent text-brand-deep" },
  { name: "gold-light", className: "bg-gold-light text-brand-deep" },
  { name: "ink", className: "bg-ink text-white" },
];

export default function StyleGuide() {
  return (
    <div>
      {/* Colours */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Palette"
          title="Fresh Aqua colours"
          subtitle="A consistent colour system for a modern dental clinic."
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SWATCHES.map((swatch) => (
            <div
              key={swatch.name}
              className={`flex h-24 items-end rounded-xl p-3 text-sm font-semibold shadow-soft ${swatch.className}`}
            >
              {swatch.name}
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="surface-aurora py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h1 className="text-5xl font-extrabold text-brand-deep">
              Your Smile,{" "}
              <span className="text-gradient">Our Priority</span>
            </h1>

            <h2 className="mt-4 text-3xl font-bold text-brand-dark">
              Heading two in the display font
            </h2>

            <h3 className="mt-3 text-xl font-semibold text-brand-dark">
              Heading three
            </h3>

            <p className="mt-3 max-w-2xl text-lg text-gray-600">
              Body text uses Inter, paired with Plus Jakarta Sans
              headings for a friendly, modern dental clinic design.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Buttons */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Buttons"
          title="Button styles and sizes"
          subtitle="Hover, press, and use the keyboard to test them."
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button>Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="light">Light</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Glass effects */}
      <section className="surface-brand py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
          <div className="glass-dark rounded-2xl p-6 text-white">
            <h3 className="text-xl font-semibold">Dark glass</h3>
            <p className="mt-2 text-white/80">
              A frosted panel for dark backgrounds and gradients.
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-brand-deep">
              Light glass
            </h3>
            <p className="mt-2 text-gray-700">
              A frosted panel for light backgrounds and floating cards.
            </p>
          </div>
        </div>
      </section>

      {/* Cards and staggered reveals */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Cards"
          title="Cards that appear on scroll"
          subtitle="Scroll down and hover over the cards to test the effects."
        />

        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Gentle care",
            "Modern equipment",
            "Easy booking",
            "Family friendly",
            "Clear pricing",
            "Caring team",
          ].map((title) => (
            <StaggerItem key={title} className="h-full">
              <Card className="h-full">
                <p className="text-3xl" aria-hidden="true">
                  🦷
                </p>

                <h3 className="mt-3 text-lg font-semibold text-brand-deep">
                  {title}
                </h3>

                <p className="mt-2 text-gray-600">
                  A comfortable, welcoming experience for every patient.
                </p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Looping animations */}
      <section className="surface-aurora py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-3">
          <div className="flex justify-center">
            <div className="animate-float glass rounded-2xl px-6 py-4 font-semibold text-brand-deep shadow-soft">
              ⭐ Floating card
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand/30" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-glow">
                ✓
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-5 w-3/4 animate-shimmer rounded bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
            <div className="h-5 w-full animate-shimmer rounded bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
            <div className="h-5 w-1/2 animate-shimmer rounded bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
            <p className="pt-2 text-sm text-gray-500">Loading skeleton</p>
          </div>
        </div>
      </section>
    </div>
  );
}
