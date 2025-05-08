
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { AdminSidebar } from "./components/adminsidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface Exam {
  id: string;
  topic: string;
}

interface PricePlan {
  id: string;
  name: string;
  price: number;
  duration: "monthly" | "yearly" | "one-time";
  exams: string[];
  description: string;
}

export default function AddPricePlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const planToEdit = (location.state as { plan?: PricePlan })?.plan;

  const [formData, setFormData] = useState({
    name: planToEdit?.name || "",
    price: planToEdit?.price.toString() || "",
    duration: planToEdit?.duration || "monthly",
    description: planToEdit?.description || "",
    exams: planToEdit?.exams || [],
  });
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  // Fetch available exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/exams/admin/exams?`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch exams: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Raw API response:", data); // Debug: Log raw response

        // Handle different response structures
        const examsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.exams)
          ? data.exams
          : [];

        if (!examsArray.length) {
          throw new Error("No exams found in the response");
        }

        const formattedData = examsArray
          .filter((exam: any) => exam._id && exam.topic) // Ensure required fields exist
          .map((exam: any) => ({
            id: exam._id.toString(),
            topic: exam.topic.toString(),
          }));

        console.log("Formatted exams:", formattedData); // Debug: Log formatted data
        setExams(formattedData);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching exams";
        console.error("Fetch exams error:", err); // Debug: Log error
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (value: "monthly" | "yearly" | "one-time") => {
    setFormData((prev) => ({ ...prev, duration: value }));
  };

  const handleExamToggle = (examId: string) => {
    setFormData((prev) => {
      const exams = prev.exams.includes(examId)
        ? prev.exams.filter((id) => id !== examId)
        : [...prev.exams, examId];
      return { ...prev, exams };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = planToEdit
        ? `${apiUrl}/api/price-plans/${planToEdit.id}`
        : `${apiUrl}/api/price-plans`;
      const method = planToEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          duration: formData.duration,
          exams: formData.exams,
          description: formData.description,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${planToEdit ? "update" : "create"} price plan: ${
            response.statusText
          }`
        );
      }

      navigate("/viewPricePlans");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `An error occurred while ${
              planToEdit ? "updating" : "creating"
            } the price plan`
      );
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
              <h1 className="text-3xl font-bold text-[#1a3a54]">
                {planToEdit ? "Edit Price Plan" : "Add Price Plans"}
              </h1>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {loading && (
              <div className="text-center text-gray-600">Loading exams...</div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                <h3 className="font-semibold">Errors:</h3>
                <ul className="list-disc pl-5">
                  <li>{error}</li>
                </ul>
              </div>
            )}
            {!loading && !error && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <label htmlFor="name" className="font-medium">
                    Plan Name:
                  </label>
                  <Input
                    id="name"
                    name="name"
                    className="rounded-full"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Basic Plan"
                    required
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <label htmlFor="price" className="font-medium">
                    Price (Rs.):
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="rounded-full"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 9.99"
                    required
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <label htmlFor="duration" className="font-medium">
                    Duration:
                  </label>
                  <Select
                    value={formData.duration}
                    onValueChange={handleDurationChange}
                  >
                    <SelectTrigger className="w-40 rounded-full border-[#4894c4]">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-[#4894c4] rounded-lg shadow-lg">
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-start gap-4">
                  <label className="font-medium pt-2">Exams:</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto border p-4 rounded-lg">
                    {exams.length === 0 ? (
                      <p className="text-gray-600">No exams available</p>
                    ) : (
                      exams.map((exam) => (
                        <div key={exam.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={exam.id}
                            checked={formData.exams.includes(exam.id)}
                            onChange={() => handleExamToggle(exam.id)}
                            className="h-4 w-4 text-[#4894c4] focus:ring-[#4894c4]"
                          />
                          <label htmlFor={exam.id} className="text-gray-700">
                            {exam.topic}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-start gap-4">
                  <label htmlFor="description" className="font-medium pt-2">
                    Description:
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    className="rounded-lg min-h-24"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Optional plan description"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    onClick={() => navigate("/admin/viewPricePlans")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 rounded-md"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#1c3c5d] hover:bg-[#16324d] text-white px-8 rounded-md"
                  >
                    {planToEdit ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
