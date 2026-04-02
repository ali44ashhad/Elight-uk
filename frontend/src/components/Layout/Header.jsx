import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import { useState } from "react";

export function Header({ variant = "dark" }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = variant === "dark";

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about-us", label: "About Us" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md  bg-slate-900 `}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Top Header */}
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-lg font-semibold transition ${
                  isDark
                    ? "text-white/90 hover:text-white"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Button */}
          <div className="hidden md:block">
            <Link
              to="/getting-started"
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                isDark
                  ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              Getting Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden text-3xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {isOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 py-4" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-5 pb-4">

            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium ${
                  isDark
                    ? "text-white/90 hover:text-white"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Getting Started Button */}
            <Link
              to="/getting-started"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-full px-5 py-2 text-center text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
            >
              Getting Started
            </Link>

          </nav>
        </div>

      </div>
    </header>
  );
}