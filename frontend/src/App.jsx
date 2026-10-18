import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import CancelAppointment from "./pages/CancelAppointment";

// Day 34 — Three.js test page
import Test3D from "./pages/Test3D";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />

        {/* Booking page */}
        <Route path="/booking" element={<Booking />} />

        {/* Day 32 — Appointment cancellation */}
        <Route
          path="/cancel/:token"
          element={<CancelAppointment />}
        />

        {/* Day 34 — Temporary 3D test page */}
        <Route path="/3d-test" element={<Test3D />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;