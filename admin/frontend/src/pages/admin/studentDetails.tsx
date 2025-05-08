import { useState, useEffect } from "react";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { useParams } from "react-router-dom";
import axios from "axios";

// Define interfaces
interface Result {
  paperNumber: string;
  paperName: string;
  marks: number;
}

interface User {
  _id: string;
  name: string;
  lName: string;
  phone: string;
  email: string;
  isActive: boolean;
  results?: Result[];
}

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<User | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get<User>(
          `${apiUrl}/api/users/${id}`
        );
        setStudent(response.data);
        setIsActive(response.data.isActive);
      } catch (error: any) {
        setError("Failed to load student details");
        console.error("Error fetching student:", error);
      }
    };
    fetchStudent();
  }, [id]);

  const toggleStatus = async () => {
    try {
      const response = await axios.put<User>(
        `${apiUrl}/api/users/${id}/status`
      );
      setIsActive(response.data.isActive);
    } catch (error: any) {
      setError("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!student) return <div>Loading...</div>;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <h1 className="text-3xl font-bold text-[#1a3a54]">
              Student Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div>
        </header>
        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="h-32 w-32 rounded-full bg-gray-300 mb-4"></div>
              <h2 className="text-xl font-semibold">
                Student Id: {student._id}
              </h2>
              <div className="mt-4">
                <button
                  onClick={toggleStatus}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    isActive
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isActive ? "Deactivate Student" : "Activate Student"}
                </button>
                <p className="text-center mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      isActive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-[#d6e6f0] rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-lg">
                    <span className="font-semibold">First Name:</span>{" "}
                    {student.name}
                  </p>
                  <p className="text-lg mt-2">
                    <span className="font-semibold">Contact Number:</span>{" "}
                    {student.phone}
                  </p>
                  <p className="text-lg mt-2">
                    <span className="font-semibold">Address:</span> N/A
                  </p>
                </div>
                <div>
                  <p className="text-lg">
                    <span className="font-semibold">Last Name:</span>{" "}
                    {student.lName}
                  </p>
                  <p className="text-lg mt-2">
                    <span className="font-semibold">Email:</span>{" "}
                    {student.email}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-center mb-4">
                Results
              </h3>
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-3 gap-4 font-semibold text-lg px-4 py-2">
                  <div>Paper Number</div>
                  <div>Paper Name</div>
                  <div>Marks</div>
                </div>
                {student.results && student.results.length > 0 ? (
                  student.results.map((result, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 bg-[#d6e6f0] rounded-md px-4 py-3 mb-2"
                    >
                      <div>{result.paperNumber}</div>
                      <div>{result.paperName}</div>
                      <div>{result.marks}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">No results available</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
