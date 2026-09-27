import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-brand px-8 py-4">
      <div className="text-xl font-bold text-white">
        <Link to="/">🦷 House of Dental</Link>
      </div>

      <ul className="flex gap-6 text-white">
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
      </ul>
    </nav>
  );
}

export default Navbar;