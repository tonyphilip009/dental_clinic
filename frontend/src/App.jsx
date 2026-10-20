
import { lazy } from "react";
import { BrowserRouter, Route } from "react-router-dom";
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

// Load these pages only when a visitor opens their route.
const Gallery = lazy(() => import("./pages/Gallery"));
const Booking = lazy(() => import("./pages/Booking"));
const CancelAppointment = lazy(
  () => import("./pages/CancelAppointment")
);

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Navbar />

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

          {/* Appointment booking */}
          <Route path="/booking" element={<Booking />} />

          {/* Appointment cancellation */}
          <Route
            path="/cancel/:token"
            element={<CancelAppointment />}
          />

          {/* Temporary design style guide */}
          <Route
            path="/style-guide"
            element={<StyleGuide />}
          />
        </AnimatedRoutes>

        <Footer />
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
