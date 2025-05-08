import { ChevronLeft, ChevronRight, Bell, FileText, User } from 'lucide-react'
import { Link } from "react-router-dom"
import { AppSidebar } from "./components/sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-100 flex flex-col">
      <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center ">
            <SidebarTrigger className="text-custom-blue2 " />
           
            <Link to="/dashboard" className="flex items-center text-custom-blue1">
            <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
            </Link>
              <h1 className="text-4xl ml-4 text-custom-blue1 jaini">Profile</h1>
           
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gray-300"/>
            </Link>
          </div>
        </header>
        <main className="p-6 overflow-y-auto flex-1 mt-10 ml-10 mr-10 rounded-2xl bg-white">
          <Card className="p-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center mb-8 bg-custom-blue1">
              <div className="mt-2 h-32 w-32 rounded-full overflow-hidden mb-3 border-4 border-white shadow-md">
                <img
                  src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                  alt="User profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mb-2 text-3xl font-semibold ubuntu text-white">User Name</h2>
            </div>

            <div className="space-y-4">
              <ProfileMenuItem 
                icon={<User className="h-6 w-6" />} 
                label="Edit profile" 
                href="/editprofile" 
              />
              
              <ProfileMenuItem 
                icon={<FileText className="h-6 w-6" />} 
                label="My Results" 
                href="/myresult" 
              />
              
              <ProfileMenuItem 
                icon={<Bell className="h-6 w-6" />} 
                label="Notification" 
                href="/notification" 
              />
            </div>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

interface ProfileMenuItemProps {
  icon: React.ReactNode
  label: string
  href: string
}

function ProfileMenuItem({ icon, label, href }: ProfileMenuItemProps) {
  return (
    <Link 
      to={href} 
      className="flex items-center justify-between p-4 bg-custom-blue5 rounded-md hover:bg-[#8eaebf] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-[#1a3a54]">
          {icon}
        </div>
        <span className="text-lg font-medium text-[#1a3a54]">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-[#1a3a54]" />
    </Link>
  )
}
