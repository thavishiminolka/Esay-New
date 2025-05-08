"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="bg-gray-100 min-h-screen" aria-label="Privacy Policy page">
      <Navbar />
      <section
        className="relative bg-[#1a3a54] min-h-[120px] flex flex-col items-center justify-center pt-6 pb-6"
        aria-labelledby="privacy-policy-heading"
      >
        {/* Centered Heading */}
        <div className="text-center">
          <h1
            id="privacy-policy-heading"
            className="text-4xl sm:text-5xl font-bold text-white jaini"
          >
            Privacy Policy
          </h1>
        </div>
      </section>
      <section className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-custom-blue1 ubuntu mb-4">
            Our Commitment to Your Privacy
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            At www.epstopiksir.com, we are firmly committed to safeguarding the
            privacy and security of our clients’ personal information. This
            Privacy Policy outlines the manner in which we collect, use, and
            protect your data when you access our website or engage with our
            educational services. By using our website, you acknowledge and
            consent to the practices and procedures described in this policy.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Information We Collect
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            When you visit our website, we may collect certain information about
            you, including:
          </p>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>
              Personal identification information (such as your name, email
              address, and phone number) provided voluntarily by you during the
              registration or checkout process.
            </li>
            <li>
              Payment and billing information necessary to process your orders,
              including credit card details, which are securely handled by
              trusted third-party payment processors.
            </li>
            <li>
              Browsing information, such as your IP address, browser type, and
              device information, collected automatically using cookies and
              similar technologies.
            </li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Use of Information
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            We may use the collected information for the following purposes:
          </p>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>
              To communicate with you regarding your purchases, provide customer
              support, and respond to inquiries or requests.
            </li>
            <li>
              To improve our website, exams, and services based on your feedback
              and browsing patterns.
            </li>
            <li>
              To detect and prevent fraud, unauthorized activities, and abuse of
              our website.
            </li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Data Security
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            We implement industry-standard security measures to protect your
            personal information from unauthorized access, alteration,
            disclosure, or destruction. However, please be aware that no method
            of transmission over the internet or electronic storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Cookies and Tracking Technologies
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            We use cookies and similar technologies to enhance your browsing
            experience, analyze website traffic, and gather information about
            your preferences and interactions with our website. You have the
            option to disable cookies through your browser settings, but this
            may limit certain features and functionality of our website.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Changes to the Privacy Policy
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            We reserve the right to update or modify this Privacy Policy at any
            time. Any changes will be posted on this page with a revised "last
            updated" date. We encourage you to review this Privacy Policy
            periodically to stay informed about how we collect, use, and protect
            your information.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Contact Us
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            If you have any questions, concerns, or requests regarding our
            Privacy Policy or the handling of your personal information, please
            contact us using the information provided on our website.
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

export default PrivacyPolicy;
