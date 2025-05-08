import { useState } from "react"
import { ChevronLeft, Bell, Trash2, CheckSquare, Square } from "lucide-react"
import { Link } from "react-router-dom"
import { AppSidebar } from "./components/sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Successfully finish the exam",
      date: "2025/03/30",
      time: "12.40pm",
      read: true,
      selected: false,
    },
    {
      id: 2,
      message: "New exam available: Korean Language Advanced",
      date: "2025/03/28",
      time: "09.15am",
      read: false,
      selected: false,
    },
    {
      id: 3,
      message: "Your results for Korean Culture exam are ready",
      date: "2025/03/25",
      time: "14.30pm",
      read: false,
      selected: false,
    },
  ])

  const [selectAll, setSelectAll] = useState(false)

  // Toggle selection for a single notification
  const toggleSelect = (id: number) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, selected: !notification.selected } : notification,
    )
    setNotifications(updatedNotifications)

    // Update selectAll state based on if all notifications are selected
    setSelectAll(updatedNotifications.every((notification) => notification.selected))
  }

  // Toggle selection for all notifications
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        selected: newSelectAll,
      })),
    )
  }

  // Delete selected notifications
  const deleteSelected = () => {
    setNotifications(notifications.filter((notification) => !notification.selected))
    setSelectAll(false)
  }

  // Delete all notifications
  const deleteAll = () => {
    setNotifications([])
    setSelectAll(false)
  }

  // Check if any notifications are selected
  const hasSelectedNotifications = notifications.some((notification) => notification.selected)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main flex flex-col">
     <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center ">
            <SidebarTrigger className="text-custom-blue2 " />
           
            <Link to="/exams" className="flex items-center text-custom-blue1">
            <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
            </Link>
              <h1 className="text-4xl ml-4 text-custom-blue1 jaini">Notification</h1>
           
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gray-300"/>
            </Link>
          </div>
        </header>
        <main className="p-6 overflow-y-auto flex-1 relative  mt-10 ml-10 mr-10 rounded-2xl bg-white" >
          <div className="max-w-6xl mx-auto">
            {notifications.length > 0 ? (
              <>
                {/* Select all checkbox */}
                <div className="flex items-center mb-4 font-bold text-black">
                  <button onClick={toggleSelectAll} className="flex items-center text-black hover:text-custom-blue1 cursor-pointer">
                    {selectAll ? <CheckSquare className="h-5 w-5 mr-2" /> : <Square className="h-5 w-5 mr-2" />}
                    <span>Select All</span>
                  </button>
                </div>

                {/* Notifications list */}
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="bg-custom-blue5 rounded-md p-4 flex items-center">
                      <button
                        onClick={() => toggleSelect(notification.id)}
                        className="mr-3 text-black hover:text-[#2d4373] cursor-pointer"
                      >
                        {notification.selected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                      </button>
                      <div className="flex-1 flex items-center ubuntu">
                        <div className="flex-1">{notification.message}</div>
                        <div className="text-right text-gray-500 text-sm">
                          <div>{notification.date}</div>
                          <div>{notification.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex justify-end mt-4 space-x-2">
                  {hasSelectedNotifications && (
                    <Button onClick={deleteSelected} variant="outline" className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  )}
                  <Button onClick={deleteAll} className="bg-[#4a89b9] hover:bg-[#3a6d99]">
                    Clear All
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No notifications</p>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
