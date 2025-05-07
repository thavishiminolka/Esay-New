// import { useState, useEffect } from "react";
// import { AdminSidebar } from "./components/adminsidebar";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "../../components/ui/sidebar";
// import { ArrowRight, ChevronLeft } from "lucide-react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// // Define User interface
// interface User {
//   _id: string;
//   name: string;
//   lName: string;
//   phone: string;
//   email: string;
//   isActive: boolean;
// }

// export default function UsersListPage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         console.log("Fetching users from API...");
//         const response = await axios.get<User[]>("http://localhost:5000/api/user");
//         console.log("Users fetched:", response.data);
//         setUsers(response.data);
//       } catch (error: any) {
//         const errorMessage = error.response
//           ? `Failed to load users: ${error.response.status} ${error.response.statusText}`
//           : "Failed to load users: Network error";
//         setError(errorMessage);
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   if (error) {
//     return (
//       <div className="text-red-500 p-8">
//         {error}
//         <button
//           onClick={() => window.location.reload()}
//           className="ml-4 text-blue-500 underline"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <SidebarProvider>
//       <AdminSidebar />
//       <SidebarInset className="bg-main">
//         <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-4">
//             <SidebarTrigger className="text-[#1a3a54]" />
//             <ChevronLeft className="mr-1 h-5 w-5" />
//             <h1 className="text-3xl font-bold text-[#1a3a54]">Users</h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-[#1a3a54]">Username</span>
//             <div className="h-10 w-10 rounded-full bg-gray-300" />
//           </div>
//         </header>
//         <main className="p-8">
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="grid grid-cols-3 gap-4 font-semibold text-lg px-4 py-2">
//               <div>Student Id</div>
//               <div>User Name</div>
//               <div>Contact</div>
//             </div>

//             {users.length === 0 ? (
//               <div className="text-center py-4">No users found</div>
//             ) : (
//               users.map((user) => (
//                 <div
//                   key={user._id}
//                   className="grid grid-cols-3 gap-4 items-center bg-[#d6e6f0] rounded-md px-4 py-3 mb-2"
//                 >
//                   <div>{user._id}</div>
//                   <div>{`${user.name} ${user.lName}`}</div>
//                   <div className="flex justify-between items-center">
//                     {user.phone}
//                     <Link to={`/studentDetails/${user._id}`}>
//                       <button className="bg-white rounded-full p-2 hover:bg-gray-100">
//                         <ArrowRight className="h-4 w-4" />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface User {
  _id: string;
  name: string;
  lName: string;
  email: string;
  phone: number;
  isActive: boolean;
  activeUntil?: string;
}

const API_BASE_URL = "http://localhost:5000/api/user";

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          withCredentials: true,
        });

        console.log("Fetched users:", response.data);
        const fetchedUsers = Array.isArray(response.data) ? response.data : [];
        setUsers(fetchedUsers);
        setTotalUsers(fetchedUsers.length);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching users:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(
          `Failed to fetch users: ${err.response?.status || "Unknown error"}`
        );
        setUsers([]);
        setTotalUsers(0);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="bg-main">
          <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-[#1a3a54]" />
              <h1 className="text-3xl font-bold text-[#1a3a54]">User List</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#1a3a54]">Username</span>
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </div>
          </header>
          <main className="p-8">
            <div className="text-center text-gray-600">Loading...</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="bg-main">
          <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-[#1a3a54]" />
              <h1 className="text-3xl font-bold text-[#1a3a54]">User List</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#1a3a54]">Username</span>
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </div>
          </header>
          <main className="p-8">
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              <h3 className="font-semibold">Error:</h3>
              <p>{error}</p>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <h1 className="text-3xl font-bold text-[#1a3a54]">User List</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-Colored rounded-full bg-gray-300" />
          </div>
        </header>
        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <p className="text-lg text-gray-700">
                Total Users: <span className="font-semibold">{totalUsers}</span>
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-custom-blue1  text-white">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-medium">
                      Name
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-medium">
                      Last Name
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-medium">
                      Email
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-medium">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition-colors duration-150`}
                    >
                      <td className="py-4 px-6 text-gray-700">{user.name}</td>
                      <td className="py-4 px-6 text-gray-700">{user.lName}</td>
                      <td className="py-4 px-6 text-gray-700">{user.email}</td>
                      <td className="py-4 px-6 text-gray-700">{user.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default UserListPage;
