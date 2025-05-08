
//newwwwwwwwwwwwwwwwww
import { useState, useEffect } from "react";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Trash2, X } from "lucide-react";

interface PricePlan {
  id: string;
  name: string;
  price: number;
  duration: "monthly" | "yearly" | "one-time";
  exams: { id: string; topic: string }[];
  description?: string;
}

export default function ViewPricePlans() {
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<
    {
      id: string;
      type: "success" | "error" | "confirm";
      message: string;
      onConfirm?: () => void;
      onCancel?: () => void;
    }[]
  >([]);

  // Show notification
  const showNotification = (
    type: "success" | "error" | "confirm",
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    console.log("Showing notification:", { type, message });
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { id, type, message, onConfirm, onCancel };
    setNotifications((prev) => [...prev, newNotification]);
    if (type !== "confirm") {
      setTimeout(() => removeNotification(id), 5000);
    }
  };

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  // Fetch price plans on mount
  useEffect(() => {
    const fetchPricePlans = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/price-plans`);
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

  // Handle delete button click
  const handleDelete = async (planId: string) => {
    showNotification(
      "confirm",
      "Are you sure you want to delete this price plan? This action cannot be undone.",
      async () => {
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
    if (
      !window.confirm(
        "Are you sure you want to delete this price plan? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/api/price-plans/${planId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

          if (!response.ok) {
            throw new Error(
              `Failed to delete price plan: ${response.statusText}`
            );
          }

          // Remove the deleted plan from state
          setPricePlans(pricePlans.filter((plan) => plan.id !== planId));
          showNotification("success", "Price plan deleted successfully!");
        } catch (err) {
          showNotification(
            "error",
            err instanceof Error
              ? err.message
              : "An error occurred while deleting the price plan"
          );
        }
      },
      () => removeNotification(planId)
    );
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-[#1a3a54] font-ubuntu">
                View Price Plans
              </h1>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-md shadow-lg flex items-center justify-between font-ubuntu ${
                  notification.type === "success"
                    ? "bg-green-100 text-green-800"
                    : notification.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-white text-[#1a3a54] border border-[#4894c4]"
                }`}
              >
                <span>{notification.message}</span>
                {notification.type === "confirm" ? (
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => {
                        notification.onConfirm?.();
                        removeNotification(notification.id);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-md text-sm py-1 px-2"
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => {
                        notification.onCancel?.();
                        removeNotification(notification.id);
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm py-1 px-2"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="ml-4"
                    aria-label="Close notification"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

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
                  <h2 className="text-xl font-semibold font-ubuntu">
                    {plan.name}
                  </h2>
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
                      onClick={() => handleDelete(plan.id)}
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
