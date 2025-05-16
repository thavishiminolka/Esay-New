// import type * as React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   BookOpen,
//   Video,
//   LogOut,
//   Users,
//   Megaphone,
//   BookCheck,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "../../../components/ui/sidebar";
// import { useState, useEffect } from "react";

// export function AdminSidebar({
//   className,
// }: React.ComponentProps<typeof Sidebar>) {
//   const [activeTab, setActiveTab] = useState("Dashboard");
//   const location = useLocation();

//   useEffect(() => {
//     if (location.pathname === "/") {
//       setActiveTab("Dashboard");
//     } else if (location.pathname === "/users") {
//       setActiveTab("UsersList");
//     } else if (location.pathname === "/scheduleExams") {
//       setActiveTab("ScheduleExams");
//     } else if (location.pathname === "/viewExams") {
//       setActiveTab("Exams");
//     } else if (location.pathname === "/videos") {
//       setActiveTab("Videos");
//     } else if (location.pathname === "/advertisements") {
//       setActiveTab("Advertisements");
//     } else if (location.pathname === "/addPricePlans") {
//       setActiveTab("Add Price Plans");
//     } else if (location.pathname === "/viewPricePlans") {
//       setActiveTab("View Price Plans");
//     }
//   }, [location]);
//   return (
//     <Sidebar className={cn("bg-custom-blue1 text-white", className)}>
//       <SidebarHeader className="flex items-center justify-center py-6">
//         <div className="h-24 w-24 rounded-full bg-gray-300" />
//       </SidebarHeader>
//       <hr />
//       <SidebarContent>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <Link
//                 to="/"
//                 className="flex items-center gap- p-2 rounded-md hover:bg-[#375286]"
//               >
//                 <LayoutDashboard
//                   size={25}
//                   className={`${
//                     activeTab === "Dashboard" ? "text-custom-blue3" : ""
//                   }`}
//                 />
//                 <span
//                   className={`${
//                     activeTab === "Dashboard" ? "text-custom-blue3" : ""
//                   }`}
//                   onClick={() => setActiveTab("Dashboard")}
//                 >
//                   Dashboard
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>

//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <Link
//                 to="/users"
//                 className="flex items-center gap- p-2 rounded-md hover:bg-[#375286]"
//               >
//                 <Users
//                   size={25}
//                   className={`${
//                     activeTab === "UsersList" ? "text-custom-blue3" : ""
//                   }`}
//                 />
//                 <span
//                   className={`${
//                     activeTab === "UsersList" ? "text-custom-blue3" : ""
//                   }`}
//                   onClick={() => setActiveTab("UsersList")}
//                 >
//                   Users
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <Link
//                 to="/scheduleExams"
//                 className="flex items-center gap- p-2 rounded-md hover:bg-[#375286]"
//               >
//                 <BookCheck
//                   size={25}
//                   className={`${
//                     activeTab === "ScheduleExams" ? "text-custom-blue3" : ""
//                   }`}
//                 />
//                 <span
//                   className={`${
//                     activeTab === "ScheduleExams" ? "text-custom-blue3" : ""
//                   }`}
//                   onClick={() => setActiveTab("ScheduleExams")}
//                 >
//                   Schedule Exam
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <Link
//                 to="/viewExams"
//                 className="flex items-center gap- p-2 rounded-md hover:bg-[#375286]"
//               >
//                 <BookOpen
//                   size={25}
//                   className={`${
//                     activeTab === "Exams" ? "text-custom-blue3" : ""
//                   }`}
//                 />
//                 <span
//                   className={`${
//                     activeTab === "Exams" ? "text-custom-blue3" : ""
//                   }`}
//                   onClick={() => setActiveTab("Exams")}
//                 >
//                   View Exams
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <Link
//                 to="/videos"
//                 className="flex items-center gap- p-2 rounded-md hover:bg-[#375286]"
//               >
//                 <Video
//                   size={25}
//                   className={`${
//                     activeTab === "Videos" ? "text-custom-blue3" : ""
//                   }`}
//                 />
//                 <span
//                   className={`${
//                     activeTab === "Videos" ? "text-custom-blue3" : ""
//                   }`}
//                   onClick={() => setActiveTab("Videos")}
//                 >
//                   Videos
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <Link
//                 to="/advertisements"
//                 className="flex items-center gap- p-2 rounded-md hover:bg-[#375286]"
//               >
//                 <Megaphone
//                   size={25}
//                   className={`${
//                     activeTab === "Advertisements" ? "text-custom-blue3" : ""
//                   }`}
//                 />
//                 <span
//                   className={`${
//                     activeTab === "Advertisements" ? "text-custom-blue3" : ""
//                   }`}
//                   onClick={() => setActiveTab("Advertisements")}
//                 >
//                   Advertisements
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <Link
//                 to="/addPricePlans"
//                 className="flex items-center gap- p-2 rounded-md hover:bg-[#375286]"
//               >
//                 <Video
//                   size={25}
//                   className={`${
//                     activeTab === "Add Price Plans" ? "text-custom-blue3" : ""
//                   }`}
//                 />
//                 <span
//                   className={`${
//                     activeTab === "Add Price Plans" ? "text-custom-blue3" : ""
//                   }`}
//                   onClick={() => setActiveTab("Add Price Plans")}
//                 >
//                   Add Price Plans
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <Link
//                 to="/viewPricePlans"
//                 className="flex items-center gap- p-2 rounded-md hover:bg-[#375286]"
//               >
//                 <Video
//                   size={25}
//                   className={`${
//                     activeTab === "View Price Plans" ? "text-custom-blue3" : ""
//                   }`}
//                 />
//                 <span
//                   className={`${
//                     activeTab === "View Price Plans" ? "text-custom-blue3" : ""
//                   }`}
//                   onClick={() => setActiveTab("View Price Plans")}
//                 >
//                   View Price Plans
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarContent>
//       <hr />
//       <SidebarFooter className="mt-auto">
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               {/* <a href="#" className="flex items-center gap-3 text-lg">
//                 <LogOut className="h-5 w-5" />
//                 <span>Logout</span>
//               </a> */}

//               <Link
//                 to="/logout"
//                 className="flex items-center gap- p-2 rounded-md hover:bg-[#375286]"
//               >
//                 <LogOut size={25} />
//                 <span>Logout</span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }
import type * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  LogOut,
  Users,
  Megaphone,
  BookCheck,
  CirclePlus,
  ScanEye,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useState, useEffect } from "react";

export function AdminSidebar({
  className,
}: React.ComponentProps<typeof Sidebar>) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setActiveTab("Dashboard");
    } else if (location.pathname === "/userslist") {
      setActiveTab("UsersList");
    } else if (location.pathname === "/scheduleExams") {
      setActiveTab("ScheduleExams");
    } else if (location.pathname === "/viewExams") {
      setActiveTab("Exams");
    } else if (location.pathname === "/addvideos") {
      setActiveTab("Videos");
    } else if (location.pathname === "/advertisements") {
      setActiveTab("Advertisements");
    } else if (location.pathname === "/addPricePlans") {
      setActiveTab("Add Price Plans");
    } else if (location.pathname === "/viewPricePlans") {
      setActiveTab("View Price Plans");
    }
  }, [location]);

  return (
    <Sidebar className={cn("bg-custom-blue1 text-white", className)}>
      <SidebarHeader className="flex items-center justify-center py-6">
        <img src="logo2new.png" className="w-auto h-18" />
      </SidebarHeader>
      <hr className="my-4" />
      <SidebarContent>
        <SidebarMenu className="space-y-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#375286]"
                onClick={() => setActiveTab("Dashboard")}
              >
                <LayoutDashboard
                  size={25}
                  className={
                    activeTab === "Dashboard" ? "text-custom-blue3" : ""
                  }
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
                to="/userslist"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#375286]"
                onClick={() => setActiveTab("UsersList")}
              >
                <Users
                  size={25}
                  className={
                    activeTab === "UsersList" ? "text-custom-blue3" : ""
                  }
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "UsersList" ? "text-custom-blue3" : ""
                  }`}
                >
                  Users
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/scheduleExams"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#375286]"
                onClick={() => setActiveTab("ScheduleExams")}
              >
                <BookCheck
                  size={25}
                  className={
                    activeTab === "ScheduleExams" ? "text-custom-blue3" : ""
                  }
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "ScheduleExams" ? "text-custom-blue3" : ""
                  }`}
                >
                  Schedule Exam
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/viewExams"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#375286]"
                onClick={() => setActiveTab("Exams")}
              >
                <BookOpen
                  size={25}
                  className={activeTab === "Exams" ? "text-custom-blue3" : ""}
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "Exams" ? "text-custom-blue3" : ""
                  }`}
                >
                  View Exams
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/addvideos"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#375286]"
                onClick={() => setActiveTab("Videos")}
              >
                <Video
                  size={25}
                  className={activeTab === "Videos" ? "text-custom-blue3" : ""}
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

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/advertisements"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#375286]"
                onClick={() => setActiveTab("Advertisements")}
              >
                <Megaphone
                  size={25}
                  className={
                    activeTab === "Advertisements" ? "text-custom-blue3" : ""
                  }
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "Advertisements" ? "text-custom-blue3" : ""
                  }`}
                >
                  Advertisements
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/addPricePlans"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#375286]"
                onClick={() => setActiveTab("Add Price Plans")}
              >
                <CirclePlus
                  size={25}
                  className={
                    activeTab === "Add Price Plans" ? "text-custom-blue3" : ""
                  }
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "Add Price Plans" ? "text-custom-blue3" : ""
                  }`}
                >
                  Add Price Plans
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/viewPricePlans"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#375286]"
                onClick={() => setActiveTab("View Price Plans")}
              >
                <ScanEye
                  size={25}
                  className={
                    activeTab === "View Price Plans" ? "text-custom-blue3" : ""
                  }
                />
                <span
                  className={`text-lg ubuntu ${
                    activeTab === "View Price Plans" ? "text-custom-blue3" : ""
                  }`}
                >
                  View Price Plans
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
                to="/"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#375286]"
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
