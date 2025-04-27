import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [examsDropdownOpen, setExamsDropdownOpen] = useState(false);
  const [mobileExamsDropdownOpen, setMobileExamsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setExamsDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setMobileExamsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleExamsDropdown = () => {
    setExamsDropdownOpen(!examsDropdownOpen);
  };

  const toggleMobileExamsDropdown = () => {
    setMobileExamsDropdownOpen(!mobileExamsDropdownOpen);
  };

  const closeAllDropdowns = () => {
    setExamsDropdownOpen(false);
    setMobileExamsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="text-white p-4 flex items-center justify-between bg-custom-blue1 relative z-50">
        <div className="flex items-center gap-8">
          <img src="/logo.png" alt="Company Logo" className="h-10 w-auto" />
          <div className="hidden md:flex items-center space-x-15 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="hover:text-slate-300 ubuntu text-middle"
              onClick={closeAllDropdowns}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-slate-300 ubuntu text-middle"
              onClick={closeAllDropdowns}
            >
              About
            </Link>

            {/* Desktop Exams Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="hover:text-slate-300 ubuntu text-middle flex items-center"
                onClick={toggleExamsDropdown}
              >
                Exams <span className="ml-1">▾</span>
              </button>
              {examsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 ubuntu"
                    onClick={closeAllDropdowns}
                  >
                    Korean
                  </Link>
                  <Link
                    to="/exams/japanese"
                    className="block px-4 py-2 hover:bg-gray-100 ubuntu "
                    onClick={closeAllDropdowns}
                  >
                    Japanese
                  </Link>
                  <Link
                    to="/exams/ielts"
                    className="block px-4 py-2 hover:bg-gray-100 ubuntu"
                    onClick={closeAllDropdowns}
                  >
                    IELTS
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/pricing"
              className="hover:text-slate-300 ubuntu text-middle"
              onClick={closeAllDropdowns}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="hover:text-slate-300 ubuntu text-middle"
              onClick={closeAllDropdowns}
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-custom-blue4 text-black px-6 py-1.5 rounded-full hover:bg-slate-100 transition ubuntu text-middle">
            Login
          </button>
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-slate-700 text-white p-4 relative z-50`}
      >
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="hover:text-slate-300"
            onClick={closeAllDropdowns}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-slate-300"
            onClick={closeAllDropdowns}
          >
            About
          </Link>

          {/* Mobile Exams Dropdown */}
          <div className="relative" ref={mobileDropdownRef}>
            <button
              className="hover:text-slate-300 flex items-center"
              onClick={toggleMobileExamsDropdown}
            >
              Exams <span className="ml-1">▾</span>
            </button>
            {mobileExamsDropdownOpen && (
              <div className="ml-4 mt-2 space-y-2 z-50">
                <Link
                  to="/exams/korean"
                  className="block hover:text-slate-300"
                  onClick={closeAllDropdowns}
                >
                  Korean
                </Link>
                <Link
                  to="/exams/japanese"
                  className="block hover:text-slate-300"
                  onClick={closeAllDropdowns}
                >
                  Japanese
                </Link>
                <Link
                  to="/exams/ielts"
                  className="block hover:text-slate-300"
                  onClick={closeAllDropdowns}
                >
                  IELTS
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/pricing"
            className="hover:text-slate-300"
            onClick={closeAllDropdowns}
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="hover:text-slate-300"
            onClick={closeAllDropdowns}
          >
            Contact
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
