import { lazy } from "react";
import { BrowserRouter, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedRoutes from "./components/AnimatedRoutes";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import StyleGuide from "./pages/StyleGuide";

import "./App.css";

const Gallery = lazy(() => import("./pages/Gallery"));
const Booking = lazy(() => import("./pages/Booking"));
const CancelAppointment = lazy(
  () => import("./pages/CancelAppointment")
);

function AppLayout() {
  const location = useLocation();

  // The confirmation screen needs a separate route or
  // a confirmation-state signal from Booking.jsx.
  const isBookingPage = location.pathname === "/booking";

  return (
    <>
      {!isBookingPage && <Navbar />}

      <AnimatedRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />
        <Route
          path="/services/:id"
          element={<ServiceDetail />}
        />

        <Route path="/gallery" element={<Gallery />} />
        <Route
          path="/testimonials"
          element={<Testimonials />}
        />
        <Route path="/contact" element={<Contact />} />

        <Route path="/booking" element={<Booking />} />

        <Route
          path="/cancel/:token"
          element={<CancelAppointment />}
        />

        <Route path="/style-guide" element={<StyleGuide />} />
      </AnimatedRoutes>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </MotionConfig>
  );
}