
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close the menu when Escape is pressed
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const desktopLink = ({ isActive }) =>
    `rounded-md px-3 py-2 font-medium transition hover:text-accent ${
      isActive ? "text-accent" : "text-white"
    }`;

  const mobileLink = ({ isActive }) =>
    `block rounded-lg px-3 py-3 font-medium transition hover:bg-white/10 ${
      isActive ? "text-accent" : "text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-brand text-white shadow-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1 whitespace-nowrap text-base font-bold sm:gap-2 sm:text-xl"
        >
          <span aria-hidden="true" className="text-xl sm:text-2xl">
            🦷
          </span>
          House of Dental
        </Link>

        {/* Desktop and laptop navigation */}
        <div className="hidden items-center gap-1 min-[1024px]:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={desktopLink}
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/booking"
            className="ml-2 whitespace-nowrap rounded-lg bg-accent px-4 py-2 font-semibold text-brand-dark transition hover:opacity-90"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile and tablet controls */}
        <div className="flex shrink-0 items-center gap-2 min-[1024px]:hidden">
          <Link
            to="/booking"
            className="whitespace-nowrap rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-brand-dark transition hover:opacity-90"
          >
            Book Now
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {menuOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-6 w-6"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-6 w-6"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile and tablet menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/20 min-[1024px]:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-8">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={mobileLink}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
