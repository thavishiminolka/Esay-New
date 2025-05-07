// "use client";

// import React from "react";
// import { useState, useEffect } from "react";
// import Footer from "../../components/Footer";
// import Navbar from "../../components/Navbar";
// import PaymentButton from "@/components/PaymentButton";
// import { purchasePlan } from "../Student/services/api";

// interface Exam {
//   _id: string;
//   topic: string;
// }

// interface PricePlan {
//   _id: string;
//   name: string;
//   price: number;
//   duration: "monthly" | "yearly" | "one-time" | "5-minutes";
//   exams: Exam[];
//   description?: string;
// }

// const Pricing: React.FC = () => {
//   const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showActivatedPopup, setShowActivatedPopup] = useState(false);
//   const [activationError, setActivationError] = useState<string | null>(null);

//   // Fetch price plans function
//   const fetchPricePlans = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("http://localhost:5000/api/price-plans", {
//         credentials: "include",
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to fetch price plans: ${response.statusText}`);
//       }
//       const data: PricePlan[] = await response.json();
//       setPricePlans(data);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "An error occurred while fetching price plans";
//       console.error("Fetch error:", err);
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch price plans on mount
//   useEffect(() => {
//     fetchPricePlans();
//   }, []);

//   // Handle activation for free plans
//   const handleActivateFreePlan = async (planId: string) => {
//     try {
//       await purchasePlan(planId);
//       setShowActivatedPopup(true);
//       setActivationError(null);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Failed to activate free plan";
//       setActivationError(errorMessage);
//       console.error("Activation error:", err);
//     }
//   };

//   // Close activated popup
//   const closeActivatedPopup = () => {
//     setShowActivatedPopup(false);
//     setActivationError(null);
//   };

//   // Format duration for display
//   const formatDuration = (duration: string) => {
//     switch (duration) {
//       case "monthly":
//         return "30 days";
//       case "yearly":
//         return "365 days";
//       case "one-time":
//         return "Lifetime";
//       case "5-minutes":
//         return "5-minutes";
//       default:
//         return duration;
//     }
//   };

//   // Format price for display
//   const formatPrice = (price: number) => {
//     return `Rs. ${price.toFixed(2)}`;
//   };

//   // Determine grid class based on number of price plans
//   const getGridClass = () => {
//     if (pricePlans.length <= 2) {
//       return "grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 w-[90vw] mx-auto justify-center";
//     }
//     return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-[90vw] mx-auto";
//   };

//   return (
//     <main
//       className="bg-[url('/images/body-bg.png')] bg-cover bg-center bg-fixed bg-gray-100 min-h-screen"
//       aria-label="Pricing page"
//     >
//       <Navbar />
//       <section
//         className="relative bg-[url('/japan2.png')] bg-cover bg-center min-h-fit flex flex-col pt-10 pb-10 bg-fixed"
//         aria-labelledby="pricing-heading"
//       >
//         {/* Background Overlay for Readability */}
//         <div className="absolute inset-0 bg-black opacity-50"></div>

//         {/* Content */}
//         <div className="relative z-10 px-4 sm:px-4 lg:px-22 w-full">
//           {/* Heading and Subheading (Left-Aligned) */}
//           <div className="text-left max-w-xl">
//             <h1
//               id="pricing-heading"
//               className="text-4xl sm:text-5xl font-bold text-white jaini"
//             >
//               Price Plans
//             </h1>
//             <p className="text-lg sm:text-xl text-white ubuntu mt-2">
//               Flexible plans tailored for every learner!
//             </p>
//           </div>

//           {/* Centered Content (Loading, Error, Empty, Cards) */}
//           <div className="text-center">
//             {/* Loading State */}
//             {isLoading && (
//               <div className="mt-8 text-xl text-white ubuntu animate-pulse">
//                 Loading price plans...
//               </div>
//             )}

//             {/* Error Message */}
//             {error && (
//               <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg max-w-2xl mx-auto">
//                 <h3 className="font-semibold">Error</h3>
//                 <p>{error}</p>
//                 <button
//                   onClick={fetchPricePlans}
//                   className="mt-2 bg-custom-blue1 text-white px-4 py-2 rounded-lg hover:bg-blue-950 transition"
//                 >
//                   Retry
//                 </button>
//               </div>
//             )}

//             {/* Empty State */}
//             {!isLoading && !error && pricePlans.length === 0 && (
//               <div className="mt-8 text-xl text-white ubuntu">
//                 No price plans available at the moment.
//               </div>
//             )}

//             {/* Pricing Cards */}
//             {!isLoading && !error && pricePlans.length > 0 && (
//               <div className={getGridClass()}>
//                 {pricePlans.map((plan) => (
//                   <div
//                     key={plan._id}
//                     className={`bg-white bg-opacity-90 p-6 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 min-h-[300px] flex flex-col justify-between ${
//                       pricePlans.length === 1 ? "sm:max-w-md mx-auto" : ""
//                     }`}
//                     role="article"
//                     aria-labelledby={`plan-${plan._id}`}
//                   >
//                     <div>
//                       <h3
//                         id={`plan-${plan._id}`}
//                         className="text-2xl sm:text-3xl font-bold text-custom-blue1 ubuntu"
//                       >
//                         {plan.name}
//                       </h3>
//                       <p className="text-base sm:text-lg text-custom-blue1 ubuntu mt-2">
//                         Valid for
//                       </p>
//                       <p className="text-lg sm:text-xl font-semibold text-custom-blue1">
//                         {formatDuration(plan.duration)}
//                       </p>
//                       <p className="text-base sm:text-lg font-medium text-custom-blue1 mt-3">
//                         Exams Included
//                       </p>
//                       <p className="text-lg sm:text-xl font-bold text-custom-blue1">
//                         {plan.exams.length}{" "}
//                         {plan.exams.length === 1 ? "Exam" : "Exams"}
//                       </p>
//                       <p className="text-base sm:text-lg font-medium text-custom-blue1 mt-3">
//                         Price
//                       </p>
//                       <p className="text-xl sm:text-2xl font-bold text-custom-blue1">
//                         {formatPrice(plan.price)}
//                       </p>
//                       {plan.description && (
//                         <p className="text-sm text-gray-600 mt-2">
//                           {plan.description}
//                         </p>
//                       )}
//                       <details className="mt-3">
//                         <summary className="text-sm text-custom-blue1 cursor-pointer hover:underline">
//                           View Exam Topics
//                         </summary>
//                         <ul className="list-disc pl-5 text-sm text-gray-600 mt-2">
//                           {plan.exams.map((exam) => (
//                             <li key={exam._id}>{exam.topic}</li>
//                           ))}
//                         </ul>
//                       </details>
//                     </div>
//                     {plan.price === 0 ? (
//                       <button
//                         onClick={() => handleActivateFreePlan(plan._id)}
//                         className="mt-4 w-full bg-custom-blue1 text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-blue1 focus:ring-offset-2 text-base sm:text-lg"
//                         aria-label={`Activate ${plan.name} plan`}
//                       >
//                         Activate
//                       </button>
//                     ) : (
//                       <PaymentButton
//                         planId={plan._id}
//                         amount={plan.price.toFixed(2)}
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Activated Popup */}
//       {showActivatedPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full mx-4 shadow-2xl">
//             <h2 className="text-xl sm:text-2xl font-bold text-custom-blue1 mb-4">
//               Plan Activated
//             </h2>
//             <p className="text-sm sm:text-base mb-4">
//               Your free plan has been successfully activated!
//             </p>
//             <button
//               onClick={closeActivatedPopup}
//               className="w-full bg-custom-blue1 text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-blue1 focus:ring-offset-2"
//               aria-label="Close activation message"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Activation Error Popup */}
//       {activationError && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full mx-4 shadow-2xl">
//             <h2 className="text-xl sm:text-2xl font-bold text-red-700 mb-4">
//               Activation Failed
//             </h2>
//             <p className="text-sm sm:text-base mb-4">{activationError}</p>
//             <button
//               onClick={closeActivatedPopup}
//               className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
//               aria-label="Close error message"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </main>
//   );
// };

// export default Pricing;

"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
// import PaymentButton from "@/components/PaymentButton"; // Commented out as per request
import { purchasePlan } from "../Student/services/api";

interface Exam {
  _id: string;
  topic: string;
}

interface PricePlan {
  _id: string;
  name: string;
  price: number;
  duration: "monthly" | "yearly" | "one-time" | "5-minutes";
  exams: Exam[];
  description?: string;
}

const Pricing: React.FC = () => {
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showActivatedPopup, setShowActivatedPopup] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  // Fetch price plans function
  const fetchPricePlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/price-plans", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch price plans: ${response.statusText}`);
      }
      const data: PricePlan[] = await response.json();
      setPricePlans(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching price plans";
      console.error("Fetch error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch price plans on mount
  useEffect(() => {
    fetchPricePlans();
  }, []);

  // Handle activation for free plans
  const handleActivateFreePlan = async (planId: string) => {
    try {
      await purchasePlan(planId);
      setShowActivatedPopup(true);
      setActivationError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to activate free plan";
      setActivationError(errorMessage);
      console.error("Activation error:", err);
    }
  };

  // Handle purchase button click for non-free plans
  const handlePurchase = (planId: string) => {
    setPendingPlanId(planId);
    // Simulate pending state for 2 seconds
    setTimeout(() => {
      setPendingPlanId(null);
    }, 2000);
  };

  // Close activated popup
  const closeActivatedPopup = () => {
    setShowActivatedPopup(false);
    setActivationError(null);
  };

  // Format duration for display
  const formatDuration = (duration: string) => {
    switch (duration) {
      case "monthly":
        return "30 days";
      case "yearly":
        return "365 days";
      case "one-time":
        return "Lifetime";
      case "5-minutes":
        return "5-minutes";
      default:
        return duration;
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `Rs. ${price.toFixed(2)}`;
  };

  // Determine grid class based on number of price plans
  const getGridClass = () => {
    if (pricePlans.length <= 2) {
      return "grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 w-[90vw] mx-auto justify-center";
    }
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-[90vw] mx-auto";
  };

  return (
    <main
      className="bg-[url('/images/body-bg.png')] bg-cover bg-center bg-fixed bg-gray-100 min-h-screen"
      aria-label="Pricing page"
    >
      <Navbar />
      <section
        className="relative bg-[url('/japan2.png')] bg-cover bg-center min-h-fit flex flex-col pt-10 pb-10 bg-fixed"
        aria-labelledby="pricing-heading"
      >
        {/* Background Overlay for Readability */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-4 lg:px-22 w-full">
          {/* Heading and Subheading (Left-Aligned) */}
          <div className="text-left max-w-xl">
            <h1
              id="pricing-heading"
              className="text-4xl sm:text-5xl font-bold text-white jaini"
            >
              Price Plans
            </h1>
            <p className="text-lg sm:text-xl text-white ubuntu mt-2">
              Flexible plans tailored for every learner!
            </p>
          </div>

          {/* Centered Content (Loading, Error, Empty, Cards) */}
          <div className="text-center">
            {/* Loading State */}
            {isLoading && (
              <div className="mt-8 text-xl text-white ubuntu animate-pulse">
                Loading price plans...
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg max-w-2xl mx-auto">
                <h3 className="font-semibold">Error</h3>
                <p>{error}</p>
                <button
                  onClick={fetchPricePlans}
                  className="mt-2 bg-custom-blue1 text-white px-4 py-2 rounded-lg hover:bg-blue-950 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && pricePlans.length === 0 && (
              <div className="mt-8 text-xl text-white ubuntu">
                No price plans available at the moment.
              </div>
            )}

            {/* Pricing Cards */}
            {!isLoading && !error && pricePlans.length > 0 && (
              <div className={getGridClass()}>
                {pricePlans.map((plan) => (
                  <div
                    key={plan._id}
                    className={`bg-white bg-opacity-90 p-6 rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 min-h-[300px] flex flex-col justify-between ${
                      pricePlans.length === 1 ? "sm:max-w-md mx-auto" : ""
                    }`}
                    role="article"
                    aria-labelledby={`plan-${plan._id}`}
                  >
                    <div>
                      <h3
                        id={`plan-${plan._id}`}
                        className="text-2xl sm:text-3xl font-bold text-custom-blue1 ubuntu"
                      >
                        {plan.name}
                      </h3>
                      <p className="text-base sm:text-lg text-custom-blue1 ubuntu mt-2">
                        Valid for
                      </p>
                      <p className="text-lg sm:text-xl font-semibold text-custom-blue1">
                        {formatDuration(plan.duration)}
                      </p>
                      <p className="text-base sm:text-lg font-medium text-custom-blue1 mt-3">
                        Exams Included
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-custom-blue1">
                        {plan.exams.length}{" "}
                        {plan.exams.length === 1 ? "Exam" : "Exams"}
                      </p>
                      <p className="text-base sm:text-lg font-medium text-custom-blue1 mt-3">
                        Price
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-custom-blue1">
                        {formatPrice(plan.price)}
                      </p>
                      {plan.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {plan.description}
                        </p>
                      )}
                      <details className="mt-3">
                        <summary className="text-sm text-custom-blue1 cursor-pointer hover:underline">
                          View Exam Topics
                        </summary>
                        <ul className="list-disc pl-5 text-sm text-gray-600 mt-2">
                          {plan.exams.map((exam) => (
                            <li key={exam._id}>{exam.topic}</li>
                          ))}
                        </ul>
                      </details>
                    </div>
                    {plan.price === 0 ? (
                      <button
                        onClick={() => handleActivateFreePlan(plan._id)}
                        className="mt-4 w-full bg-custom-blue1 text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-blue1 focus:ring-offset-2 text-base sm:text-lg ubuntu"
                        aria-label={`Activate ${plan.name} plan`}
                      >
                        Activate
                      </button>
                    ) : (
                      <>
                        {/* <PaymentButton
                          planId={plan._id}
                          amount={plan.price.toFixed(2)}
                        /> */}
                        <button
                          onClick={() => handlePurchase(plan._id)}
                          disabled={pendingPlanId === plan._id}
                          className="mt-4 w-full bg-custom-blue1 text-white py-2 px-4 rounded-lg hover:bg-blue-950 disabled:bg-custom-blue4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-blue1 focus:ring-offset-2 text-base sm:text-lg ubuntu"
                          aria-label={`Purchase ${plan.name} plan`}
                        >
                          {pendingPlanId === plan._id
                            ? "Pending..."
                            : "Purchase"}
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Activated Popup */}
      {showActivatedPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-custom-blue1 mb-4 ubuntu">
              Plan Activated
            </h2>
            <p className="text-sm sm:text-base mb-4">
              Your free plan has been successfully activated!
            </p>
            <button
              onClick={closeActivatedPopup}
              className="w-full bg-custom-blue1 text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-blue1 focus:ring-offset-2 ubuntu"
              aria-label="Close activation message"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Activation Error Popup */}
      {activationError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-red-700 mb-4 ubuntu">
              Activation Failed
            </h2>
            <p className="text-sm sm:text-base mb-4">{activationError}</p>
            <button
              onClick={closeActivatedPopup}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ubuntu"
              aria-label="Close error message"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default Pricing;
