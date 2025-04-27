import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";

interface PricePlan {
  id: string;
  name: string;
  price: number;
  duration: "monthly" | "yearly" | "one-time";
  exams: { id: string; topic: string }[];
  description?: string;
}

export default function ViewPricePlans() {
  const navigate = useNavigate();
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch price plans on mount
  useEffect(() => {
    const fetchPricePlans = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/price-plans");
        if (!response.ok) {
          throw new Error("Failed to fetch price plans");
        }
        const data = await response.json();
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
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchPricePlans();
  }, []);

  // Handle edit button click
  const handleEdit = (plan: PricePlan) => {
    if (!plan.id) {
      alert("Invalid price plan ID");
      return;
    }
    navigate("/addPricePlans", { state: { plan } });
  };

  // Handle delete button click
  const handleDelete = async (planId: string) => {
    if (!window.confirm("Are you sure you want to delete this price plan? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/price-plans/${planId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if required (e.g., JWT token)
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete price plan");
      }

      // Remove the deleted plan from state
      setPricePlans(pricePlans.filter((plan) => plan.id !== planId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting the price plan");
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
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
          <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div>
        </header>

        <main className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              <h3 className="font-semibold">Error:</h3>
              <p>{error}</p>
            </div>
          )}
          {pricePlans.length === 0 && !error && (
            <div className="text-center text-gray-600">
              No price plans available. Create one in the Price Plans section.
            </div>
          )}
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}