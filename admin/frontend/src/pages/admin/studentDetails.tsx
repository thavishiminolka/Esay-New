import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { useState } from "react";

const student = {
  id: "000023",
  firstName: "John",
  lastName: "Doe",
  contactNumber: "0713452768",
  email: "johndoe2gmail.com",
  address: "No.01, Main Road, Gampaha",
  results: Array(9).fill({
    paperNumber: "0001",
    paperName: "Korean listening test",
    marks: 87,
  }),
};

export default function StudentDetails() {
  const [isActive, setIsActive] = useState(true); // Default to active

  const toggleStatus = () => {
    setIsActive(!isActive);
    // Here you would typically make an API call to update the status in your database
  };

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
                Student Id: {student.id}
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
                    {student.firstName}
                  </p>
                  <p className="text-lg mt-2">
                    <span className="font-semibold">Contact Number:</span>{" "}
                    {student.contactNumber}
                  </p>
                  <p className="text-lg mt-2">
                    <span className="font-semibold">Address:</span>{" "}
                    {student.address}
                  </p>
                </div>
                <div>
                  <p className="text-lg">
                    <span className="font-semibold">Last Name:</span>{" "}
                    {student.lastName}
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

                {student.results.map((result, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 bg-[#d6e6f0] rounded-md px-4 py-3 mb-2"
                  >
                    <div>{result.paperNumber}</div>
                    <div>{result.paperName}</div>
                    <div>{result.marks}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
