import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-brand px-4 py-4 sm:px-8">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="whitespace-nowrap text-xl font-bold text-white">
          <Link to="/" onClick={closeMenu}>
            🦷 House of Dental
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-6 text-white md:flex">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>

          <li>
            <Link to="/about" className="hover:underline">
              About
            </Link>
          </li>

          <li>
            <Link to="/services" className="hover:underline">
              Services
            </Link>
          </li>

          <li>
            <Link to="/gallery" className="hover:underline">
              Gallery
            </Link>
          </li>

          <li>
            <Link to="/testimonials" className="hover:underline">
              Testimonials
            </Link>
          </li>

          <li>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
          </li>

          {/* Desktop Book Now */}
          <li>
            <Link
              to="/booking"
              className="rounded-lg bg-accent px-4 py-2 font-semibold text-brand-dark transition hover:opacity-90"
            >
              Book Now
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg px-3 py-2 text-2xl text-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <ul className="mt-4 flex flex-col gap-3 border-t border-white/20 pt-4 text-white md:hidden">
          <li>
            <Link
              to="/"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/services"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
            >
              Services
            </Link>
          </li>

          <li>
            <Link
              to="/gallery"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
            >
              Gallery
            </Link>
          </li>

          <li>
            <Link
              to="/testimonials"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
            >
              Testimonials
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
            >
              Contact
            </Link>
          </li>

          {/* Mobile Book Now */}
          <li>
            <Link
              to="/booking"
              onClick={closeMenu}
              className="block rounded-lg bg-accent px-4 py-2 text-center font-semibold text-brand-dark transition hover:opacity-90"
            >
              Book Now
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;