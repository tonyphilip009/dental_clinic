
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

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
  const [scrolled, setScrolled] = useState(false);

  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

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
    `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${
      isActive
        ? "text-[#F0D58A]"
        : "text-[#F5F0E6] hover:text-[#F0D58A]"
    }`;

  const mobileLink = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-300 ${
      isActive
        ? "bg-[#D5A637]/10 text-[#F0D58A]"
        : "text-[#F5F0E6] hover:bg-white/[0.06] hover:text-[#F0D58A]"
    }`;

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled
          ? "rgba(24, 23, 21, 0.94)"
          : "rgba(24, 23, 21, 0)",

        borderBottomColor: scrolled
          ? "rgba(213, 166, 55, 0.22)"
          : "rgba(213, 166, 55, 0)",

        boxShadow: scrolled
          ? "0 8px 28px rgba(0, 0, 0, 0.22)"
          : "0 0px 0px rgba(0, 0, 0, 0)",
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.3,
        ease: "easeOut",
      }}
      className={`fixed inset-x-0 top-0 z-[100] border-b ${
        scrolled ? "backdrop-blur-xl" : "backdrop-blur-0"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-[padding] duration-300 sm:px-8 lg:px-12 ${
          scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
        }`}
      >
        {/* Brand */}
        <Link
          to="/"
          aria-label="House of Dental home"
          className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-4"
        >
          <span
            className={`flex shrink-0 items-center justify-center rounded-full border border-[#D5A637]/80 font-serif font-medium text-[#F0D58A] transition-all duration-300 hover:bg-white/[0.08] ${
              scrolled
                ? "h-9 w-9 text-xl sm:h-10 sm:w-10 sm:text-2xl"
                : "h-10 w-10 text-2xl sm:h-12 sm:w-12 sm:text-3xl"
            }`}
          >
            H
          </span>

          <span className="flex flex-col">
            <span
              className={`whitespace-nowrap font-semibold tracking-wide text-[#F5F0E6] transition-all duration-300 ${
                scrolled
                  ? "text-sm sm:text-base lg:text-lg"
                  : "text-sm sm:text-lg lg:text-xl"
              }`}
            >
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
              {({ isActive }) => (
                <>
                  {link.label}

                  <span
                    className={`absolute bottom-0 left-3 right-3 h-px origin-left bg-[#D5A637] transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}

          <Link
            to="/booking"
            className="ml-2 inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#E8C86E]/50 bg-[#D5A637] px-5 py-2.5 text-sm font-semibold text-[#211D14] shadow-[0_3px_12px_rgba(213,166,55,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F0D58A] hover:bg-[#E8BD50] hover:shadow-[0_6px_20px_rgba(213,166,55,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0D58A]"
          >
            Book Now <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Mobile and tablet controls */}
        <div className="flex shrink-0 items-center gap-2 min-[1024px]:hidden">
          <Link
            to="/booking"
            className="whitespace-nowrap rounded-lg border border-[#E8C86E]/50 bg-[#D5A637] px-3 py-2.5 text-sm font-semibold text-[#211D14] transition hover:bg-[#E8BD50] sm:px-4"
          >
            Book Now
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-lg border border-white/20 bg-transparent p-2 text-[#F5F0E6] transition hover:border-[#D5A637]/50 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D5A637]"
          >
            {menuOpen ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
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
                strokeWidth="1.8"
                strokeLinecap="round"
                className="h-6 w-6"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <motion.div
          id="mobile-menu"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.2,
            ease: "easeOut",
          }}
          className="border-t border-[#D5A637]/20 bg-[#181715]/95 shadow-xl backdrop-blur-xl min-[1024px]:hidden"
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
        </motion.div>
      )}
    </motion.header>
  );
}

export default Navbar;
