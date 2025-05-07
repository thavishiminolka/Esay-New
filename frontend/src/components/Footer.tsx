"use client";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="bg-custom-blue1 text-white py-6 px-4 sm:px-6 sm:py-10"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center md:items-start">
        {/* Logo */}
        <div className="mb-6 md:mb-0 flex justify-center">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="h-16 w-auto max-w-xs"
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block h-36 w-px bg-white/30 mx-4"></div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <div className="space-y-2 text-center">
            <div>
              <Link
                to="/"
                className="text-sm sm:text-base hover:text-custom-blue3 ubuntu"
              >
                Home
              </Link>
            </div>
            <div>
              <Link
                to="/about"
                className="text-sm sm:text-base hover:text-custom-blue3 ubuntu"
              >
                About
              </Link>
            </div>
            <div>
              <Link
                to="/pricing"
                className="text-sm sm:text-base hover:text-custom-blue3 ubuntu"
              >
                Pricing
              </Link>
            </div>
            <div>
              <Link
                to="/contact"
                className="text-sm sm:text-base hover:text-custom-blue3 ubuntu"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-36 w-px bg-white/30 mx-4"></div>

        {/* Policy Links */}
        <div className="flex flex-col items-center">
          <div className="space-y-2 text-center">
            <div>
              <Link
                to="/privacyPolicy"
                className="text-sm sm:text-base hover:text-custom-blue3 ubuntu"
              >
                Privacy Policy
              </Link>
            </div>
            <div>
              <Link
                to="/termsAndConditions"
                className="text-sm sm:text-base hover:text-custom-blue3 ubuntu"
              >
                Terms and Conditions
              </Link>
            </div>
            <div>
              <Link
                to="/refundPolicy"
                className="text-sm sm:text-base hover:text-custom-blue3 ubuntu"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 text-center">
        <p className="text-sm text-white">2025 © All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
