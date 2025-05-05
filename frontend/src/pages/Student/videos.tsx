import {Play } from 'lucide-react'
import { Link } from "react-router-dom";

import { AppSidebar } from "./components/sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"

export default function VideosPage() {
  // Sample video data
  const videos = [
    {
      id: 1,
      title: "Topic 1",
      thumbnail: "/placeholder.svg?height=300&width=500",
      url: "#",
    },
    {
      id: 2,
      title: "Topic 2",
      thumbnail: "/placeholder.svg?height=300&width=500",
      url: "#",
    },
    {
      id: 3,
      title: "Topic 3",
      thumbnail: "/placeholder.svg?height=300&width=500",
      url: "#",
    },
    {
      id: 4,
      title: "Topic 4",
      thumbnail: "/placeholder.svg?height=300&width=500",
      url: "#",
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main flex flex-col">
      <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-12">
            <SidebarTrigger className=" text-custom-blue2 cursor-pointer" />
            <h1 className="text-4xl  text-custom-blue1 jaini">Videos</h1>
          </div>
          {/* <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gray-300"/>
            </Link>
          </div> */}
        </header>
        <main className="p-6 overflow-y-auto flex-1 mt-10 ml-10 mr-10 rounded-2xl bg-white">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {videos.map((video) => (
              <div key={video.id} className="flex flex-col">
                <h2 className="mb-2 text-xl font-bold text-[#1a3a54]">{video.title}</h2>
                <div className="relative aspect-video bg-gray-300 rounded-md overflow-hidden group cursor-pointer">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={`Thumbnail for ${video.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Play className="h-8 w-8 text-[#1a3a54] ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}