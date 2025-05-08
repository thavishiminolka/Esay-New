import { Link } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Trophy,
  Video,
  LogOut,
} from "lucide-react";


import type * as React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { cn } from "../../../lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../../../components/ui/sidebar";

export function AppSidebar({
  className,
}: React.ComponentProps<typeof Sidebar>) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setActiveTab("Dashboard");
    } else if (location.pathname === "/exams") {
      setActiveTab("Exams");
    } else if (location.pathname === "/leaderboard") {
      setActiveTab("Leaderboard");
    } else if (location.pathname === "/videos") {
      setActiveTab("Videos");
    }
  }, [location]);

  return (
    <Sidebar className={cn("bg-custom-blue1 text-white", className)}>
      <SidebarHeader className="flex items-center justify-center py-5">
        <img src="logo2new.png" className="w-auto h-18 " />
      </SidebarHeader>
      <hr className="my-4" />
      <SidebarContent>
        <SidebarMenu className="space-y-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-[#375286]"
              >
                <Home size={25} />
                <span className="text-lg ubuntu">Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-[#375286]"
              >
                <LayoutDashboard
                  size={25}
                  className={`${
                    activeTab === "Dashboard" ? "text-custom-blue3" : ""
                  }`}
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "Dashboard" ? "text-custom-blue3" : ""
                  }`}
                >
                  Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/exams"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-[#375286]"
              >
                <BookOpen
                  size={25}
                  className={`${
                    activeTab === "Exams" ? "text-custom-blue3" : ""
                  }`}
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "Exams" ? "text-custom-blue3" : ""
                  }`}
                >
                  Exams
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/leaderboard"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-[#375286]"
              >
                <Trophy
                  size={25}
                  className={`${
                    activeTab === "Leaderboard" ? "text-custom-blue3" : ""
                  }`}
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "Leaderboard" ? "text-custom-blue3" : ""
                  }`}
                >
                  Leaderboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/videos"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-[#375286]"
              >
                <Video
                  size={25}
                  className={`${
                    activeTab === "Videos" ? "text-custom-blue3" : ""
                  }`}
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "Videos" ? "text-custom-blue3" : ""
                  }`}
                >
                  Videos
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <hr />
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/login"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-[#375286]"
              >
                <LogOut size={25} />
                <span className="text-lg ubuntu">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
