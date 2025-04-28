import { useState, useEffect } from "react";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

// Define User interface
interface User {
  _id: string;
  name: string;
  lName: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(
          "http://localhost:5000/api/users"
        );
        setUsers(response.data);
      } catch (error: any) {
        setError("Failed to load users");
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <ChevronLeft className="mr-1 h-5 w-5" />
            <h1 className="text-3xl font-bold text-[#1a3a54]">Users</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div>
        </header>
        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-3 gap-4 font-semibold text-lg px-4 py-2">
              <div>Student Id</div>
              <div>User Name</div>
              <div>Contact</div>
            </div>

            {users.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-3 gap-4 items-center bg-[#d6e6f0] rounded-md px-4 py-3 mb-2"
              >
                <div>{user._id}</div>
                <div>{`${user.name} ${user.lName}`}</div>
                <div className="flex justify-between items-center">
                  {user.phone}
                  <Link to={`/studentDetails/${user._id}`}>
                    <button className="bg-white rounded-full p-2 hover:bg-gray-100">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
