import React, { useState, useEffect } from "react";

declare global {
  interface Window {
    payhere: {
      startPayment: (payment: any) => void;
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

const PaymentButton: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Using credentials: 'include' to send cookies with the request
        const response = await fetch("http://localhost:5000/api/user/data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include' // This ensures cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
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
      amount: "1005.00",
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
      const response = await fetch(
        "http://localhost:5000/payment/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include', // This ensures cookies are sent with the request
          body: JSON.stringify(paymentDetails),
        }
      );

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
          items: "Subscription Activation", // You can customize this based on what the user is purchasing
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
      {userData && (
        <div className="user-info">
          <p>Name: {userData.name}</p>
          <p>Last Name: {userData.lName}</p>
          <p>Subscription: {userData.isActive ? 'Active' : 'Inactive'}</p>
          {userData.isActive && (
            <p>Active Until: {new Date(userData.activeUntil).toLocaleDateString()}</p>
          )}
        </div>
      )}
      <button 
        id="payhere-payment" 
        onClick={handlePayment}
        disabled={!userData}
        className="payment-button"
      >
        PayHere Pay
      </button>
    </div>
  );
};

export default PaymentButton;