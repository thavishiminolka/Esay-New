"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const TermsAndConditions: React.FC = () => {
  return (
    <main
      className="bg-gray-100 min-h-screen"
      aria-label="Terms and Conditions page"
    >
      <Navbar />
      <section
        className="relative bg-[#1a3a54] min-h-[120px] flex flex-col items-center justify-center pt-6 pb-6"
        aria-labelledby="terms-conditions-heading"
      >
        {/* Centered Heading */}
        <div className="text-center">
          <h1
            id="terms-conditions-heading"
            className="text-4xl sm:text-5xl font-bold text-white jaini"
          >
            Terms and Conditions
          </h1>
        </div>
      </section>
      <section className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-custom-blue1 ubuntu mb-4">
            Welcome to www.epstopiksir.com
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            These Terms and Conditions ("Terms") govern your use of our website
            www.epstopiksir.com and any related services (collectively, the
            "Service"). By accessing or using our Service, you agree to comply
            with and be bound by these Terms. If you do not agree, you may not
            use our Service.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Eligibility
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            You must be at least 13 years old (or the minimum legal age in your
            jurisdiction) to use our Service. If you are under 18, you must have
            parental or guardian consent.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            User Accounts
          </h3>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>You must provide accurate and complete information.</li>
            <li>
              You are responsible for safeguarding your account credentials.
            </li>
            <li>
              You agree not to share your account or allow others to access it.
            </li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Course Access and Content
          </h3>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>Courses may be free or paid.</li>
            <li>
              You are granted a limited, non-exclusive, non-transferable license
              to access the course content.
            </li>
            <li>
              Redistribution, resale, or unauthorized sharing of content is
              prohibited.
            </li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Payments and Refunds
          </h3>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>Prices are listed in [currency] and may change at any time.</li>
            <li>
              Refunds are subject to our Refund Policy:{" "}
              <a
                href="/refund-policy"
                className="text-custom-blue1 hover:underline"
              >
                Refund Policy
              </a>
              .
            </li>
            <li>
              We use third-party payment processors. By purchasing, you agree to
              their terms.
            </li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Intellectual Property
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            All content, including videos, PDFs, text, and branding, is the
            property of www.epstopiksir.com or its licensors. Unauthorized use
            is strictly prohibited.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Code of Conduct
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Users must:</p>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>Respect instructors and other users.</li>
            <li>Not post harmful, harassing, or illegal content.</li>
            <li>Not attempt to hack, disrupt, or misuse the platform.</li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Termination
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            We reserve the right to suspend or terminate your account at our
            discretion, especially if these Terms are violated.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Disclaimers
          </h3>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>
              We provide the Service "as is" without warranties of any kind.
            </li>
            <li>
              We are not responsible for any errors or omissions in the content.
            </li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Governing Law
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            These Terms are governed by the laws of [Jurisdiction]. Any disputes
            shall be resolved in the courts of [Jurisdiction].
          </p>

          <p className="text-sm text-gray-600 mt-4">
            Last updated: May 7, 2025
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default TermsAndConditions;
