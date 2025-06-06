import { AppSidebar } from "./components/sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [userData, setUserData] = useState({
    name: "",
    lName: "",
    userId: "",
    email: "",
    phone: ""
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user/data`, {
          withCredentials: true,
        });
        setUserData({
          name: response.data.name,
          lName: response.data.lName,
          userId: response.data.userId,
          email: response.data.email,
          phone: response.data.phone
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-12">
            <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
            <h1 className="text-4xl text-custom-blue1 jaini">Dashboard</h1>
          </div>
          {/* <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">{userData.name || "Username"}</span>
            <Link to="/profile" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </Link>
          </div> */}
        </header>
        <main className="p-8 mt-10 ml-10 mr-10 rounded-2xl bg-white border-main mb-7">
          <Card className="border-main mb-6 overflow-hidden bg-gradient-to-b from-[#CCDEE4] to-[#488DB4] text-blue1 py-6">
            <CardContent className="flex flex-col items-center p-0 md:flex-row md:items-start">
              <div className="flex w-full flex-col items-center justify-center p-6 md:w-1/3">
                <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-custom-blue1 bg-white">
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col justify-center gap-2 p-6 md:w-2/3">
                <h2 className="text-2xl font-bold ubuntu">
                  Hello, {`${userData.name?.charAt(0).toUpperCase() + userData.name?.slice(1).toLowerCase() || "User"} ${userData.lName?.charAt(0).toUpperCase() + userData.lName?.slice(1).toLowerCase() || ""}`}
                </h2>

                <p className="text-lg ubuntu">
                  Student ID: {userData.userId?.toUpperCase().slice(0, 7) || "N/A"}
                </p>
                <p className="text-lg ubuntu">
                  Email: {userData.email || "N/A"}
                </p>
                <p className="text-lg ubuntu">
                  Contact No: {userData.phone || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link to="/exams">
              <Button className="px-10 py-6 text-white text-lg bg-custom-blue2 hover:bg-[#2d4373] cursor-pointer ubuntu">
                Start Exam
              </Button>
            </Link>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}