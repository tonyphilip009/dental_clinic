
import Hero from "../components/home/Hero";
import WelcomeSection from "../components/home/WelcomeSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Process from "../components/home/Process";
import BookingBanner from "../components/home/BookingBanner";

export default function Home() {
  return (
    <div className="overflow-x-clip bg-[#FAF8F3]">
      <Hero />
      <WelcomeSection />
      <WhyChooseUs />
      <Process />
      <BookingBanner />
    </div>
  );
}
