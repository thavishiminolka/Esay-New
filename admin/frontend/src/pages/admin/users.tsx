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





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AdminSidebar } from "./components/adminsidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Link } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  lName: string;
  email: string;
  phone: number;
  isActive: boolean;
  activeUntil?: string;
}

const API_BASE_URL = 'http://localhost:5000/api/user'; // Adjust this based on backend route

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

        console.log('Fetched users:', response.data); // Log response for debugging
        const fetchedUsers = Array.isArray(response.data) ? response.data : [];
        setUsers(fetchedUsers);
        setTotalUsers(fetchedUsers.length);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching users:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(`Failed to fetch users: ${err.response?.status || 'Unknown error'}`);
        setUsers([]);
        setTotalUsers(0);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (

    <SidebarProvider>
    <AdminSidebar />
    <SidebarInset className="bg-main flex flex-col">
    <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-12">
          <SidebarTrigger className=" text-custom-blue2 cursor-pointer" />
          <h1 className="text-4xl  text-custom-blue1 jaini">UserList</h1>
        </div>
        <div className="flex items-center gap-6 pr-7">
          <span className="text-custom-blue2">Username</span>
          <Link to="/profile" className="cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-gray-300"/>
          </Link>
        </div>
      </header>
      <main className="overflow-y-auto p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
    <div className="container mx-auto p-6">
      <div className="mb-4">
        <p className="text-lg">Total Users: <span className="font-semibold">{totalUsers}</span></p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Last Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Phone</th>

            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.lName}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.phone}</td>

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

