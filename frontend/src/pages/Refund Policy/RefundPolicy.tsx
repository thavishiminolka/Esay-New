"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const RefundPolicy: React.FC = () => {
  return (
    <main className="bg-gray-100 min-h-screen" aria-label="Refund Policy page">
      <Navbar />
      <section
        className="relative bg-[#1a3a54] min-h-[120px] flex flex-col items-center justify-center pt-6 pb-6"
        aria-labelledby="refund-policy-heading"
      >
        {/* Centered Heading */}
        <div className="text-center">
          <h1
            id="refund-policy-heading"
            className="text-4xl sm:text-5xl font-bold text-white jaini"
          >
            Refund Policy
          </h1>
        </div>
      </section>
      <section className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Last updated: May 7, 2025
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-custom-blue1 ubuntu mb-4">
            Our Commitment to Your Satisfaction
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            At www.epstopiksir.com, we aim to provide a high-quality learning
            experience. If you are not satisfied with your purchase, please
            review our refund guidelines below.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            One-Time Course Purchases
          </h3>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>
              Refund requests must be submitted within 7 days of purchase.
            </li>
            <li>
              Courses that have been more than 25% completed are not eligible
              for refunds.
            </li>
            <li>
              Refunds will not be granted if a certificate has already been
              issued.
            </li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Subscription Plans
          </h3>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>
              We offer no refunds for partial subscription periods (e.g., unused
              time in a monthly or annual plan).
            </li>
            <li>
              You may cancel your subscription at any time to avoid future
              billing.
            </li>
            <li>
              Free trials must be canceled before the trial period ends to avoid
              charges.
            </li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            How to Request a Refund
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            To request a refund, please contact our support team at{" "}
            <a
              href="mailto:admin@epstopiksir.com"
              className="text-custom-blue1 hover:underline"
            >
              admin@epstopiksir.com
            </a>{" "}
            with the following:
          </p>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>Your full name and registered email address.</li>
            <li>Order number or receipt.</li>
            <li>Reason for the refund request.</li>
          </ul>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            We will review your request and respond within 5 business days.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Non-Refundable Items
          </h3>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 mb-6">
            <li>Downloadable materials (e.g., PDFs, templates).</li>
            <li>Workshops or webinars with live attendance.</li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Refund Method
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Approved refunds will be processed to the original payment method.
            It may take 5–10 business days for the funds to appear, depending on
            your bank or credit card provider.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Exceptions
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            We reserve the right to refuse a refund if we suspect abuse, fraud,
            or violation of our{" "}
            <a
              href="/terms-and-conditions"
              className="text-custom-blue1 hover:underline"
            >
              Terms and Conditions
            </a>
            .
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Changes to This Policy
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            We may update this Refund Policy from time to time. Changes will be
            posted on this page with an updated date.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-custom-blue1 ubuntu mt-4 mb-3">
            Questions?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Contact our support team at:{" "}
            <a
              href="mailto:support@epstopiksir.com"
              className="text-custom-blue1 hover:underline"
            >
              support@epstopiksir.com
            </a>
            .
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default RefundPolicy;
