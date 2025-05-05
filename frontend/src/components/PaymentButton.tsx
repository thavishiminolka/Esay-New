// import React, { useState, useEffect } from "react";
// import { purchasePlan } from "../pages/Student/services/api";

// declare global {
//   interface Window {
//     payhere: {
//       startPayment: (payment: any) => void;
//       onCompleted: (orderId: string) => void;
//       onDismissed: () => void;
//       onError: (errorMsg: string) => void;
//     };
//   }
// }

// interface UserData {
//   success: boolean;
//   userId: string;
//   name: string;
//   lName: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   seatNumber: string;
//   isActive: boolean;
//   activeUntil: string;
//   passedExams: number;
//   availableExams: number;
//   totalExams: number;
// }

// interface PaymentDetails {
//   order_id: string;
//   amount: string;
//   currency: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   country: string;
// }

// interface PaymentResponse {
//   hash: string;
//   merchant_id: string;
// }

// interface PaymentButtonProps {
//   planId: string;
//   amount: string;
// }

// const PaymentButton: React.FC<PaymentButtonProps> = ({ planId, amount }) => {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch user data when component mounts
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/user/data", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const data = await response.json();
//         setUserData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error occurred");
//         console.error("Error fetching user data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handlePayment = async () => {
//     if (!userData) {
//       setError("User data not available. Please try again later.");
//       return;
//     }

//     const paymentDetails: PaymentDetails = {
//       order_id: `ORDER-${userData.userId}-${Date.now().toString().slice(-6)}`,
//       amount: amount,
//       currency: "LKR",
//       first_name: userData.name,
//       last_name: userData.lName,
//       email: userData.email,
//       phone: userData.phone,
//       address: userData.address,
//       city: userData.city,
//       country: "Sri Lanka",
//     };

//     try {
//       // Request backend to generate the hash value
//       const response = await fetch("http://localhost:5000/payment/start", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(paymentDetails),
//       });

//       if (response.ok) {
//         const { hash, merchant_id }: PaymentResponse = await response.json();

//         // Payment configuration
//         const payment = {
//           sandbox: true,
//           merchant_id: merchant_id,
//           return_url: "http://localhost:5000/payment/success",
//           cancel_url: "http://localhost:5000/payment/cancel",
//           notify_url: "https://localhost:5000/payment/notify",
//           order_id: paymentDetails.order_id,
//           items: "Subscription Activation",
//           amount: paymentDetails.amount,
//           currency: paymentDetails.currency,
//           first_name: paymentDetails.first_name,
//           last_name: paymentDetails.last_name,
//           email: paymentDetails.email,
//           phone: paymentDetails.phone,
//           address: paymentDetails.address,
//           city: paymentDetails.city,
//           country: paymentDetails.country,
//           hash: hash,
//         };

//         // Set up PayHere payment callbacks
//         window.payhere.onCompleted = async (orderId: string) => {
//           try {
//             await purchasePlan(planId);
//             console.log(`Payment completed for order: ${orderId}`);
//           } catch (err) {
//             setError("Failed to activate plan after payment.");
//             console.error("Plan activation error:", err);
//           }
//         };

//         window.payhere.onDismissed = () => {
//           console.log("Payment dismissed");
//         };

//         window.payhere.onError = (errorMsg: string) => {
//           setError(`Payment error: ${errorMsg}`);
//           console.error("Payment error:", errorMsg);
//         };

//         // Initialize PayHere payment
//         window.payhere.startPayment(payment);
//       } else {
//         setError("Failed to generate hash for payment.");
//         console.error("Failed to generate hash for payment.");
//       }
//     } catch (error) {
//       setError("An error occurred during payment processing.");
//       console.error("An error occurred:", error);
//     }
//   };

//   if (loading) {
//     return <div>Loading user data...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div>
//       <button
//         id="payhere-payment"
//         onClick={handlePayment}
//         disabled={!userData}
//         className="mt-4 w-full bg-custom-blue1 text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-blue1 focus:ring-offset-2 text-base sm:text-lg"
//       >
//         Purchase
//       </button>
//     </div>
//   );
// };

// export default PaymentButton;

//--------------------------------

// import React, { useState, useEffect } from "react";
// import { purchasePlan } from "../pages/Student/services/api";

// declare global {
//   interface Window {
//     payhere: {
//       startPayment: (payment: any) => void;
//       onCompleted: (orderId: string) => void;
//       onDismissed: () => void;
//       onError: (errorMsg: string) => void;
//     };
//   }
// }

// interface UserData {
//   success: boolean;
//   userId: string;
//   name: string;
//   lName: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   seatNumber: string;
//   isActive: boolean;
//   activeUntil: string;
//   passedExams: number;
//   availableExams: number;
//   totalExams: number;
// }

// interface PaymentDetails {
//   order_id: string;
//   amount: string;
//   currency: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   country: string;
// }

// interface PaymentResponse {
//   hash: string;
//   merchant_id: string;
// }

// interface VerifyPaymentResponse {
//   success: boolean;
//   message?: string;
// }

// interface PaymentButtonProps {
//   planId: string;
//   amount: string;
// }

// const PaymentButton: React.FC<PaymentButtonProps> = ({ planId, amount }) => {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch user data when component mounts
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/user/data", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const data = await response.json();
//         setUserData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error occurred");
//         console.error("Error fetching user data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const verifyPayment = async (orderId: string): Promise<boolean> => {
//     try {
//       const response = await fetch("http://localhost:5000/payment/verify", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ orderId, planId }),
//       });

//       const result: VerifyPaymentResponse = await response.json();
//       if (!response.ok || !result.success) {
//         throw new Error(result.message || "Payment verification failed");
//       }

//       return true;
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "An error occurred while verifying payment"
//       );
//       console.error("Payment verification error:", err);
//       return false;
//     }
//   };

//   const handlePayment = async () => {
//     if (!userData) {
//       setError("User data not available. Please try again later.");
//       return;
//     }

//     const paymentDetails: PaymentDetails = {
//       order_id: `ORDER-${userData.userId}-${Date.now().toString().slice(-6)}`,
//       amount: amount,
//       currency: "LKR",
//       first_name: userData.name,
//       last_name: userData.lName,
//       email: userData.email,
//       phone: userData.phone,
//       address: userData.address,
//       city: userData.city,
//       country: "Sri Lanka",
//     };

//     try {
//       // Request backend to generate the hash value
//       const response = await fetch("http://localhost:5000/payment/start", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(paymentDetails),
//       });

//       if (response.ok) {
//         const { hash, merchant_id }: PaymentResponse = await response.json();

//         // Payment configuration
//         const payment = {
//           sandbox: true,
//           merchant_id: merchant_id,
//           return_url: "http://localhost:5000/payment/success",
//           cancel_url: "http://localhost:5000/payment/cancel",
//           notify_url: "http://localhost:5000/payment/notify",
//           order_id: paymentDetails.order_id,
//           items: "Subscription Activation",
//           amount: paymentDetails.amount,
//           currency: paymentDetails.currency,
//           first_name: paymentDetails.first_name,
//           last_name: paymentDetails.last_name,
//           email: paymentDetails.email,
//           phone: paymentDetails.phone,
//           address: paymentDetails.address,
//           city: paymentDetails.city,
//           country: paymentDetails.country,
//           hash: hash,
//         };

//         // Set up PayHere payment callbacks
//         window.payhere.onCompleted = async (orderId: string) => {
//           const isPaymentSuccessful = await verifyPayment(orderId);
//           if (isPaymentSuccessful) {
//             try {
//               await purchasePlan(planId);
//               console.log(
//                 `Payment completed and plan activated for order: ${orderId}`
//               );
//             } catch (err) {
//               setError("Failed to activate plan after payment.");
//               console.error("Plan activation error:", err);
//             }
//           } else {
//             setError("Payment was not successful. Plan not activated.");
//           }
//         };

//         window.payhere.onDismissed = () => {
//           setError("Payment was cancelled or dismissed.");
//           console.log("Payment dismissed");
//         };

//         window.payhere.onError = (errorMsg: string) => {
//           setError(`Payment failed: ${errorMsg}`);
//           console.error("Payment error:", errorMsg);
//         };

//         // Initialize PayHere payment
//         window.payhere.startPayment(payment);
//       } else {
//         setError("Failed to generate hash for payment.");
//         console.error("Failed to generate hash for payment.");
//       }
//     } catch (error) {
//       setError("An error occurred during payment processing.");
//       console.error("An error occurred:", error);
//     }
//   };

//   if (loading) {
//     return <div>Loading user data...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div>
//       <button
//         id="payhere-payment"
//         onClick={handlePayment}
//         disabled={!userData}
//         className="mt-4 w-full bg-custom-blue1 text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-blue1 focus:ring-offset-2 text-base sm:text-lg"
//       >
//         Purchase
//       </button>
//     </div>
//   );
// };

// export default PaymentButton;

//upto freeplan is done------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { purchasePlan } from "../pages/Student/services/api";

declare global {
  interface Window {
    payhere: {
      startPayment: (payment: any) => void;
      onCompleted: (orderId: string) => void;
      onDismissed: () => void;
      onError: (errorMsg: string) => void;
    };
  }
}

interface UserData {
  success: boolean;
  userId: string;
  name: string;
  lName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  seatNumber: string;
  isActive: boolean;
  activeUntil: string;
  passedExams: number;
  availableExams: number;
  totalExams: number;
}

interface PaymentDetails {
  order_id: string;
  amount: string;
  currency: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface PaymentResponse {
  hash: string;
  merchant_id: string;
}

interface PaymentButtonProps {
  planId: string;
  amount: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ planId, amount }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePayment = async () => {
    if (!userData) {
      setError("User data not available. Please try again later.");
      return;
    }

    const paymentDetails: PaymentDetails = {
      order_id: `ORDER-${userData.userId}-${Date.now().toString().slice(-6)}`,
      amount: amount,
      currency: "LKR",
      first_name: userData.name,
      last_name: userData.lName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      country: "Sri Lanka",
    };

    try {
      // Request backend to generate the hash value
      const response = await fetch("http://localhost:5000/payment/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(paymentDetails),
      });

      if (response.ok) {
        const { hash, merchant_id }: PaymentResponse = await response.json();

        // Payment configuration
        const payment = {
          sandbox: true,
          merchant_id: merchant_id,
          return_url: "http://localhost:5000/payment/success",
          cancel_url: "http://localhost:5000/payment/cancel",
          notify_url: "https://localhost:5000/payment/notify",
          order_id: paymentDetails.order_id,
          items: "Subscription Activation",
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          first_name: paymentDetails.first_name,
          last_name: paymentDetails.last_name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          address: paymentDetails.address,
          city: paymentDetails.city,
          country: paymentDetails.country,
          hash: hash,
        };

        // Set up PayHere payment callbacks
        window.payhere.onCompleted = async (orderId: string) => {
          try {
            await purchasePlan(planId);
            console.log(`Payment completed for order: ${orderId}`);
          } catch (err) {
            setError("Failed to activate plan after payment.");
            console.error("Plan activation error:", err);
          }
        };

        window.payhere.onDismissed = () => {
          console.log("Payment dismissed");
        };

        window.payhere.onError = (errorMsg: string) => {
          setError(`Payment error: ${errorMsg}`);
          console.error("Payment error:", errorMsg);
        };

        // Initialize PayHere payment
        window.payhere.startPayment(payment);
      } else {
        setError("Failed to generate hash for payment.");
        console.error("Failed to generate hash for payment.");
      }
    } catch (error) {
      setError("An error occurred during payment processing.");
      console.error("An error occurred:", error);
    }
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <button
        id="payhere-payment"
        onClick={handlePayment}
        disabled={!userData}
        className="mt-4 w-full bg-custom-blue1 text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-blue1 focus:ring-offset-2 text-base sm:text-lg"
      >
        Purchase
      </button>
    </div>
  );
};

export default PaymentButton;

// import React, { useState, useEffect } from "react";
// import { purchasePlan } from "../pages/Student/services/api";

// declare global {
//   interface Window {
//     payhere: {
//       startPayment: (payment: any) => void;
//       onCompleted: (orderId: string) => void;
//       onDismissed: () => void;
//       onError: (errorMsg: string) => void;
//     };
//   }
// }

// interface UserData {
//   success: boolean;
//   userId: string;
//   name: string;
//   lName: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   seatNumber: string;
//   isActive: boolean;
//   activeUntil: string;
//   passedExams: number;
//   availableExams: number;
//   totalExams: number;
// }

// interface PaymentDetails {
//   order_id: string;
//   amount: string;
//   currency: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   country: string;
// }

// interface PaymentResponse {
//   hash: string;
//   merchant_id: string;
// }

// interface PaymentButtonProps {
//   planId: string;
//   amount: string;
// }

// const PaymentButton: React.FC<PaymentButtonProps> = ({ planId, amount }) => {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch user data when component mounts
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/user/data", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const data = await response.json();
//         setUserData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error occurred");
//         console.error("Error fetching user data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handlePayment = async () => {
//     if (!userData) {
//       setError("User data not available. Please try again later.");
//       return;
//     }

//     const paymentDetails: PaymentDetails = {
//       order_id: `ORDER-${userData.userId}-${Date.now().toString().slice(-6)}`,
//       amount: amount,
//       currency: "LKR",
//       first_name: userData.name,
//       last_name: userData.lName,
//       email: userData.email,
//       phone: userData.phone,
//       address: userData.address,
//       city: userData.city,
//       country: "Sri Lanka",
//     };

//     try {
//       // Request backend to generate the hash value
//       const response = await fetch("http://localhost:5000/payment/start", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(paymentDetails),
//       });

//       if (response.ok) {
//         const { hash, merchant_id }: PaymentResponse = await response.json();

//         // Payment configuration
//         const payment = {
//           sandbox: true,
//           merchant_id: merchant_id,
//           return_url: "http://localhost:5000/payment/success",
//           cancel_url: "http://localhost:5000/payment/cancel",
//           notify_url: "https://localhost:5000/payment/notify",
//           order_id: paymentDetails.order_id,
//           items: "Subscription Activation",
//           amount: paymentDetails.amount,
//           currency: paymentDetails.currency,
//           first_name: paymentDetails.first_name,
//           last_name: paymentDetails.last_name,
//           email: paymentDetails.email,
//           phone: paymentDetails.phone,
//           address: paymentDetails.address,
//           city: paymentDetails.city,
//           country: paymentDetails.country,
//           hash: hash,
//         };

//         // Set up PayHere payment callbacks
//         window.payhere.onCompleted = async (orderId: string) => {
//           try {
//             await purchasePlan(planId);
//             console.log(`Payment completed for order: ${orderId}`);
//           } catch (err) {
//             setError("Failed to activate plan after payment.");
//             console.error("Plan activation error:", err);
//           }
//         };

//         window.payhere.onDismissed = () => {
//           setError("Payment was dismissed. Plan not activated.");
//           console.log("Payment dismissed");
//         };

//         window.payhere.onError = (errorMsg: string) => {
//           setError(`Payment error: ${errorMsg}. Plan not activated.`);
//           console.error("Payment error:", errorMsg);
//         };

//         // Initialize PayHere payment
//         window.payhere.startPayment(payment);
//       } else {
//         setError("Failed to generate hash for payment.");
//         console.error("Failed to generate hash for payment.");
//       }
//     } catch (error) {
//       setError("An error occurred during payment processing.");
//       console.error("An error occurred:", error);
//     }
//   };

//   if (loading) {
//     return <div>Loading user data...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div>
//       <button
//         id="payhere-payment"
//         onClick={handlePayment}
//         disabled={!userData}
//         className="mt-4 w-full bg-custom-blue1 text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-blue1 focus:ring-offset-2 text-base sm:text-lg"
//       >
//         Purchase
//       </button>
//     </div>
//   );
// };

// export default PaymentButton;
