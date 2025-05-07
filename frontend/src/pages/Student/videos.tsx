// import { Play } from "lucide-react";
// import { Link } from "react-router-dom";

// import { AppSidebar } from "./components/sidebar";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "../../components/ui/sidebar";

// export default function VideosPage() {
//   // Sample video data
//   const videos = [
//     {
//       id: 1,
//       title: "Topic 1",
//       thumbnail: "/placeholder.svg?height=300&width=500",
//       url: "#",
//     },
//     {
//       id: 2,
//       title: "Topic 2",
//       thumbnail: "/placeholder.svg?height=300&width=500",
//       url: "#",
//     },
//     {
//       id: 3,
//       title: "Topic 3",
//       thumbnail: "/placeholder.svg?height=300&width=500",
//       url: "#",
//     },
//     {
//       id: 4,
//       title: "Topic 4",
//       thumbnail: "/placeholder.svg?height=300&width=500",
//       url: "#",
//     },
//   ];

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset className="bg-main flex flex-col">
//         <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-12">
//             <SidebarTrigger className=" text-custom-blue2 cursor-pointer" />
//             <h1 className="text-4xl  text-custom-blue1 jaini">Videos</h1>
//           </div>
//           <div className="flex items-center gap-6 pr-7">
//             <span className="text-custom-blue2">Username</span>
//             <Link to="/profile" className="cursor-pointer">
//               <div className="h-10 w-10 rounded-full bg-gray-300" />
//             </Link>
//           </div>
//         </header>
//         <main className="p-6 overflow-y-auto flex-1 mt-10 ml-10 mr-10 rounded-2xl bg-white">
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//             {videos.map((video) => (
//               <div key={video.id} className="flex flex-col">
//                 <h2 className="mb-2 text-xl font-bold text-[#1a3a54]">
//                   {video.title}
//                 </h2>
//                 <div className="relative aspect-video bg-gray-300 rounded-md overflow-hidden group cursor-pointer">
//                   <img
//                     src={video.thumbnail || "/placeholder.svg"}
//                     alt={`Thumbnail for ${video.title}`}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
//                     <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
//                       <Play className="h-8 w-8 text-[#1a3a54] ml-1" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }"use client";"use client";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

import { AppSidebar } from "./components/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";

interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/videos");
        // Filter out videos with invalid youtubeUrl
        const validVideos = response.data.filter(
          (video: Video) =>
            video.youtubeUrl &&
            typeof video.youtubeUrl === "string" &&
            video.youtubeUrl.trim() !== ""
        );
        setVideos(validVideos);
        setError(null);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Extract YouTube video ID and generate thumbnail URL
  const getThumbnailUrl = (url: string) => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return "/placeholder.svg";
    }
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    }
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "/placeholder.svg";
  };

  // Generate YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return "";
    }
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : "";
  };

  // Toggle video playback
  const togglePlay = (videoId: string) => {
    setPlayingVideoId(playingVideoId === videoId ? null : videoId);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main flex flex-col">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-12">
            <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
            <h1 className="text-4xl text-custom-blue1 jaini">Videos</h1>
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </Link>
          </div>
        </header>
        <main className="p-6 overflow-y-auto flex-1 mt-10 ml-10 mr-10 rounded-2xl bg-white">
          {loading ? (
            <p className="text-gray-500 text-center">Loading videos...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : videos.length === 0 ? (
            <p className="text-gray-500 text-center">No videos available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {videos.map((video) => {
                const thumbnailUrl = getThumbnailUrl(video.youtubeUrl);
                const embedUrl = getEmbedUrl(video.youtubeUrl);
                const isPlaying = playingVideoId === video.id;

                return (
                  <div key={video.id} className="flex flex-col">
                    <h2 className="mb-2 text-xl font-bold text-[#1a3a54]">
                      {video.title}
                    </h2>
                    <div
                      className="relative aspect-video bg-gray-300 rounded-md overflow-hidden group cursor-pointer"
                      onClick={() => togglePlay(video.id)}
                    >
                      {isPlaying && embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                          // Prevent right-click to deter URL extraction
                          onContextMenu={(e) => e.preventDefault()}
                        ></iframe>
                      ) : (
                        <>
                          <img
                            src={thumbnailUrl}
                            alt={`Thumbnail for ${video.title}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                              <Play className="h-8 w-8 text-[#1a3a54] ml-1" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
