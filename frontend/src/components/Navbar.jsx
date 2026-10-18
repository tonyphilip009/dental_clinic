
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
    `rounded-md px-3 py-2 text-sm font-medium transition duration-300 hover:text-[#D6A83F] ${
      isActive ? "text-[#D6A83F]" : "text-white"
    }`;

  const mobileLink = ({ isActive }) =>
    `block rounded-lg px-4 py-3 font-medium transition duration-300 hover:bg-white/10 ${
      isActive ? "text-[#D6A83F]" : "text-[#F5F0E6]"
    }`;

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent text-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8 lg:px-12"
        aria-label="Main navigation"
      >
        {/* Brand logo and name */}
        <Link
          to="/"
          aria-label="House of Dental home"
          className="flex min-w-0 shrink-0 items-center gap-4 sm:gap-5"
        >
          {/* Circular H logo */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D6A83F]/80 font-serif text-2xl font-medium text-[#F0D58A] transition duration-300 hover:bg-white/10 sm:h-12 sm:w-12 sm:text-3xl">
            H
          </span>

          {/* Clinic name and tagline */}
          <span className="flex flex-col">
            <span className="whitespace-nowrap text-base font-semibold tracking-wide text-white sm:text-xl lg:text-2xl">
              HOUSE OF DENTAL
            </span>

            <span className="mt-1 hidden text-[9px] font-medium tracking-[0.22em] text-[#F0D58A] min-[380px]:block sm:text-[10px]">
              CARE FOR EVERY SMILE
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
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
            className="ml-2 whitespace-nowrap rounded-md bg-[#D6A83F] px-5 py-3 text-sm font-semibold text-[#090908] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F0D58A]"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile and tablet controls */}
        <div className="flex shrink-0 items-center gap-2 min-[1024px]:hidden">
          <Link
            to="/booking"
            className="whitespace-nowrap rounded-md bg-[#D6A83F] px-3 py-2.5 text-sm font-semibold text-[#090908] transition hover:bg-[#F0D58A] sm:px-4"
          >
            Book Now
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-lg border border-white/20 bg-black/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6A83F]"
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

      {/* Mobile and tablet dropdown */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-[#0B0B0A]/95 shadow-xl backdrop-blur-xl min-[1024px]:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-8">
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
