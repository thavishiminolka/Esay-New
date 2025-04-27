import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Checkbox } from "../../components/ui/checkbox";

interface PricePlan {
  id: string;
  name: string;
  price: number;
  duration: "monthly" | "yearly" | "one-time";
  exams: { id: string; topic: string }[];
  description?: string;
}

interface Exam {
  id: string;
  topic: string;
}

export default function AddPricePlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    duration: "" as "monthly" | "yearly" | "one-time" | "",
    examIds: [] as string[],
    description: "",
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch exams and price plans on mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/exams");
        if (!response.ok) {
          throw new Error("Failed to fetch exams");
        }
        const data = await response.json();
        const formattedData = data.map((exam: any) => ({
          id: exam._id.toString(),
          topic: exam.topic,
        }));
        setExams(formattedData);
      } catch (err) {
        setFormErrors([
          ...formErrors,
          err instanceof Error ? err.message : "An error occurred",
        ]);
      }
    };

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
        setFormErrors([
          ...formErrors,
          err instanceof Error ? err.message : "An error occurred",
        ]);
      }
    };

    fetchExams();
    fetchPricePlans();
  }, []);

  // Pre-fill form for editing
  useEffect(() => {
    const plan = location.state?.plan as PricePlan | undefined;
    if (plan) {
      setFormData({
        id: plan.id,
        name: plan.name,
        price: plan.price.toString(),
        duration: plan.duration,
        examIds: plan.exams.map((exam) => exam.id),
        description: plan.description || "",
      });
      setIsEditing(true);
    }
  }, [location.state]);

  // Handle form input changes
  const handleInputChange = (
    field: keyof typeof formData,
    value: string | string[]
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle exam checkbox changes
  const handleExamChange = (examId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      examIds: checked
        ? [...prev.examIds, examId]
        : prev.examIds.filter((id) => id !== examId),
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      price: "",
      duration: "",
      examIds: [],
      description: "",
    });
    setIsEditing(false);
    setFormErrors([]);
  };

  // Validate form
  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push("Plan name is required");
    if (
      !formData.price ||
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) < 0
    )
      errors.push("Valid price is required");
    if (!formData.duration) errors.push("Duration is required");
    if (formData.examIds.length === 0)
      errors.push("At least one exam is required");
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors([]);
    setIsSubmitting(true);

    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        duration: formData.duration,
        exams: formData.examIds,
        description: formData.description.trim() || undefined,
      };

      const url = isEditing
        ? `http://localhost:5000/api/price-plans/Rs.{formData.id}`
        : "http://localhost:5000/api/price-plans";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save price plan");
      }

      const result = await response.json();
      const newPlan = {
        id: isEditing ? formData.id : result.pricePlan._id.toString(),
        name: result.pricePlan.name,
        price: result.pricePlan.price,
        duration: result.pricePlan.duration,
        exams: result.pricePlan.exams.map((exam: any) => ({
          id: exam._id.toString(),
          topic: exam.topic,
        })),
        description: result.pricePlan.description || "",
      };

      if (isEditing) {
        setPricePlans(
          pricePlans.map((plan) => (plan.id === formData.id ? newPlan : plan))
        );
      } else {
        setPricePlans([newPlan, ...pricePlans]);
      }

      alert(`Price plan add successfully!`);
      resetForm();
      navigate("/viewPricePlans");
    } catch (err) {
      setFormErrors([err instanceof Error ? err.message : "An error occurred"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (plan: PricePlan) => {
    setFormData({
      id: plan.id,
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration,
      examIds: plan.exams.map((exam) => exam.id),
      description: plan.description || "",
    });
    setIsEditing(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this price plan?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/price-plans/Rs.{id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete price plan");
      }

      setPricePlans(pricePlans.filter((plan) => plan.id !== id));
      alert("Price plan deleted successfully!");
    } catch (err) {
      setFormErrors([err instanceof Error ? err.message : "An error occurred"]);
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
                {isEditing ? "Edit Price Plan" : "Add Price Plans"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div>
        </header>

        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {formErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                <h3 className="font-semibold">Errors:</h3>
                <ul className="list-disc pl-5">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label htmlFor="name" className="font-medium">
                  Plan Name:
                </label>
                <Input
                  id="name"
                  className="rounded-full"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Basic Plan"
                />
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label htmlFor="price" className="font-medium">
                  Price (Rs.):
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="rounded-full"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="e.g., 9.99"
                />
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label htmlFor="duration" className="font-medium">
                  Duration:
                </label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) =>
                    handleInputChange(
                      "duration",
                      value as "monthly" | "yearly" | "one-time"
                    )
                  }
                >
                  <SelectTrigger className="w-40 rounded-full border-[#4894c4]">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#4894c4] rounded-lg shadow-lg">
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-Time</SelectItem>
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
                        <Checkbox
                          id={`exam-Rs.{exam.id}`}
                          checked={formData.examIds.includes(exam.id)}
                          onCheckedChange={(checked) =>
                            handleExamChange(exam.id, !!checked)
                          }
                        />
                        <label
                          htmlFor={`exam-${exam.id}`}
                          className="text-gray-700"
                        >
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
                  className="rounded-lg min-h-24"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Optional plan description"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 rounded-md"
                >
                  {isEditing ? "Cancel" : "Reset"}
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1c3c5d] hover:bg-[#16324d] text-white px-8 rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </form>

            {/* Table */}
            {pricePlans.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Exams</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricePlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>{plan.name}</TableCell>
                        <TableCell>Rs.{plan.price.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">
                          {plan.duration}
                        </TableCell>
                        <TableCell>
                          <ul className="list-disc pl-5">
                            {plan.exams.map((exam) => (
                              <li key={exam.id}>{exam.topic}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>{plan.description || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(plan)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(plan.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
