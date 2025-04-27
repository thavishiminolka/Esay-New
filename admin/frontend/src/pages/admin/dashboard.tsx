"use client";

import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";

import { StatCard } from "./components/Stat-cards";
import { ChevronLeft, DollarSign, FileText, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
         
            <h1 className="text-3xl font-bold text-[#1a3a54]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div>
        </header>
        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <StatCard
                title="Total Users"
                value="60"
                icon={<Users className="h-10 w-10" />}
              />

              <StatCard
                title="Total Subscriptions"
                value="55"
                icon={
                  <div className="bg-white rounded-full p-2">
                    <DollarSign className="h-8 w-8 text-[#4894c4]" />
                  </div>
                }
              />

              <StatCard
                title="Total Exams"
                value="60"
                icon={<FileText className="h-10 w-10" />}
              />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
