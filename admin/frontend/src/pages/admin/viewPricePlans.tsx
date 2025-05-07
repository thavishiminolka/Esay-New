// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { AdminSidebar } from "./components/adminsidebar";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "../../components/ui/sidebar";
// import { Button } from "../../components/ui/button";
// import { ChevronLeft, Edit, Trash2 } from "lucide-react";

// interface PricePlan {
//   id: string;
//   name: string;
//   price: number;
//   duration: "monthly" | "yearly" | "one-time";
//   exams: { id: string; topic: string }[];
//   description?: string;
// }

// export default function ViewPricePlans() {
//   const navigate = useNavigate();
//   const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch price plans on mount
//   useEffect(() => {
//     const fetchPricePlans = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/price-plans");
//         if (!response.ok) {
//           throw new Error(
//             `Failed to fetch price plans: ${response.statusText}`
//           );
//         }
//         const data = await response.json();
//         console.log("Fetched price plans:", data);
//         const formattedData = data.map((plan: any) => ({
//           id: plan._id.toString(),
//           name: plan.name,
//           price: plan.price,
//           duration: plan.duration,
//           exams: plan.exams.map((exam: any) => ({
//             id: exam._id.toString(),
//             topic: exam.topic,
//           })),
//           description: plan.description || "",
//         }));
//         setPricePlans(formattedData);
//       } catch (err) {
//         setError(
//           err instanceof Error
//             ? err.message
//             : "An error occurred while fetching price plans"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPricePlans();
//   }, []);

//   // Handle edit button click
//   const handleEdit = (plan: PricePlan) => {
//     if (!plan.id) {
//       alert("Invalid price plan ID");
//       return;
//     }
//     navigate("/addPricePlans", { state: { plan } });
//   };

//   // Handle delete button click
//   const handleDelete = async (planId: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this price plan? This action cannot be undone."
//       )
//     ) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/price-plans/${planId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to delete price plan: ${response.statusText}`);
//       }

//       // Remove the deleted plan from state
//       setPricePlans(pricePlans.filter((plan) => plan.id !== planId));
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "An error occurred while deleting the price plan"
//       );
//     }
//   };

//   return (
//     <SidebarProvider>
//       <AdminSidebar />
//       <SidebarInset className="bg-main">
//         <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-4">
//             <SidebarTrigger className="text-[#1a3a54]" />
//             <div className="flex items-center gap-2">
//               <ChevronLeft className="mr-1 h-5 w-5" />
//               <h1 className="text-3xl font-bold text-[#1a3a54]">
//                 View Price Plans
//               </h1>
//             </div>
//           </div>
//           {/* <div className="flex items-center gap-2">
//             <span className="text-[#1a3a54]">Username</span>
//             <div className="h-10 w-10 rounded-full bg-gray-300" />
//           </div> */}
//         </header>

//         <main className="p-8">
//           {loading && (
//             <div className="text-center text-gray-600">
//               Loading price plans...
//             </div>
//           )}
//           {error && (
//             <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
//               <h3 className="font-semibold">Error:</h3>
//               <p>{error}</p>
//             </div>
//           )}
//           {!loading && !error && pricePlans.length === 0 && (
//             <div className="text-center text-gray-600">
//               No price plans available. Create one in the Price Plans section.
//             </div>
//           )}
//           {!loading && !error && pricePlans.length > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {pricePlans.map((plan) => (
//                 <div
//                   key={plan.id}
//                   className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4"
//                 >
//                   <h2 className="text-xl font-semibold">{plan.name}</h2>
//                   <p className="text-gray-600">
//                     <strong>Price:</strong> Rs.{plan.price.toFixed(2)} /{" "}
//                     {plan.duration}
//                   </p>
//                   <p className="text-gray-600">
//                     <strong>Description:</strong> {plan.description || "N/A"}
//                   </p>
//                   <div>
//                     <strong>Exams:</strong>
//                     <ul className="list-disc pl-5 text-gray-600">
//                       {plan.exams.map((exam) => (
//                         <li key={exam.id}>{exam.topic}</li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={() => handleEdit(plan)}
//                       className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-md flex-1"
//                     >
//                       <Edit className="h-4 w-4 mr-2" />
//                       Edit
//                     </Button>
//                     <Button
//                       onClick={() => handleDelete(plan.id)}
//                       className="bg-red-600 hover:bg-red-700 text-white rounded-md flex-1"
//                     >
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { ChevronLeft, Edit, Trash2, X } from "lucide-react";

interface PricePlan {
  id: string;
  name: string;
  price: number;
  duration: "monthly" | "yearly" | "one-time";
  exams: { id: string; topic: string }[];
  description?: string;
}

type Notification = {
  id: string;
  type: "success" | "error";
  message: string;
};

export default function ViewPricePlans() {
  const navigate = useNavigate();
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showConfirm, setShowConfirm] = useState<{
    planId: string;
    planName: string;
  } | null>(null);

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { id, type, message };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => removeNotification(id), 5000);
  };

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fetch price plans on mount
  useEffect(() => {
    const fetchPricePlans = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/price-plans");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch price plans: ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Fetched price plans:", data);
        const formattedData = data.map((plan: any) => ({
          id: plan._id.toString(),
          name: plan.name,
          price: plan.price,
          duration: plan.duration,
          exams: plan.exams.map((exam: any) => ({
            id: exam._id.toString(),
            topic: exam.topic,
          })),
          description: plan.description || "",
        }));
        setPricePlans(formattedData);
      } catch (err) {
        showNotification(
          "error",
          err instanceof Error
            ? err.message
            : "An error occurred while fetching price plans"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPricePlans();
  }, []);

  // Handle edit button click
  const handleEdit = (plan: PricePlan) => {
    if (!plan.id) {
      showNotification("error", "Invalid price plan ID");
      return;
    }
    navigate("/addPricePlans", { state: { plan } });
  };

  // Handle delete button click
  const handleDelete = async (planId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/price-plans/${planId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete price plan: ${response.statusText}`);
      }

      // Remove the deleted plan from state
      setPricePlans(pricePlans.filter((plan) => plan.id !== planId));
      showNotification("success", "Price plan deleted successfully");
    } catch (err) {
      showNotification(
        "error",
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the price plan"
      );
    } finally {
      setShowConfirm(null); // Close confirmation popup
    }
  };

  // Show confirmation popup
  const confirmDelete = (planId: string, planName: string) => {
    setShowConfirm({ planId, planName });
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowConfirm(null);
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-md shadow-lg flex items-center justify-between ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span>{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Confirmation Popup */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-2xl">
              <h2 className="text-xl font-bold text-[#1a3a54] mb-4 ubuntu">
                Confirm Deletion
              </h2>
              <p className="text-sm mb-4">
                Are you sure you want to delete the price plan "
                {showConfirm.planName}"? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleDelete(showConfirm.planId)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Confirm
                </Button>
                <Button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <div className="flex items-center gap-2">
              <ChevronLeft className="mr-1 h-5 w-5" />
              <h1 className="text-3xl font-bold text-[#1a3a54]">
                View Price Plans
              </h1>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div> */}
        </header>

        <main className="p-8">
          {loading && (
            <div className="text-center text-gray-600">
              Loading price plans...
            </div>
          )}
          {!loading && pricePlans.length === 0 && (
            <div className="text-center text-gray-600">
              No price plans available. Create one in the Price Plans section.
            </div>
          )}
          {!loading && pricePlans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4"
                >
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  <p className="text-gray-600">
                    <strong>Price:</strong> Rs.{plan.price.toFixed(2)} /{" "}
                    {plan.duration}
                  </p>
                  <p className="text-gray-600">
                    <strong>Description:</strong> {plan.description || "N/A"}
                  </p>
                  <div>
                    <strong>Exams:</strong>
                    <ul className="list-disc pl-5 text-gray-600">
                      {plan.exams.map((exam) => (
                        <li key={exam.id}>{exam.topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(plan)}
                      className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-md flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => confirmDelete(plan.id, plan.name)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-md flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
