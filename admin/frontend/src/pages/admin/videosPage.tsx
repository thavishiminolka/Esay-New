
"use client";
import { useState, useEffect } from "react";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import ErrorBoundary from "./components/ErrorBoundary";

interface Video {
  id: string;
  title: string;
  youtubeUrl?: string; // Make youtubeUrl optional to handle potential missing data
}

export default function VideosPage() {
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/videos");
        // Filter out videos with missing or invalid youtubeUrl
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

  // Validate YouTube URL
  const isValidYoutubeUrl = (url: string) => {
    return url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/);
  };

  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url?: string) => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return ""; // Return empty string for invalid URLs
    }
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeUrl) {
      setError("Title and YouTube URL are required");
      return;
    }
    if (!isValidYoutubeUrl(youtubeUrl)) {
      setError("Invalid YouTube URL");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/videos", {
        title,
        youtubeUrl,
      });
      setVideos([...videos, response.data]);
      setTitle("");
      setYoutubeUrl("");
      setError(null);
    } catch (err) {
      console.error("Error uploading video:", err);
      setError("Failed to upload video");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/videos/${id}`);
      setVideos(videos.filter((video) => video.id !== id));
    } catch (err) {
      console.error("Error deleting video:", err);
      setError("Failed to delete video");
    }
  };

  return (

    <ErrorBoundary>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="bg-main">
          <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-[#1a3a54]" />
              <h1 className="text-3xl font-bold text-[#1a3a54]">
                Manage Videos
              </h1>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="title"
                      className="text-xl font-medium whitespace-nowrap"
                    >
                      Video Title:
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="flex-1 border-gray-300"
                      placeholder="Enter video title"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <label
                      htmlFor="youtube-url"
                      className="text-xl font-medium whitespace-nowrap"
                    >
                      YouTube URL:
                    </label>
                    <Input
                      id="youtube-url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="flex-1 border-gray-300"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-6 text-red-500 text-center">{error}</div>
                )}

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="bg-[#4a96c9] hover:bg-[#3a86b9] text-white px-6 py-2 flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add Video
                  </Button>
                </div>
              </form>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Uploaded Videos</h2>
                {loading ? (
                  <p className="text-gray-500">Loading videos...</p>
                ) : videos.length === 0 ? (
                  <p className="text-gray-500">No videos uploaded yet.</p>
                ) : (
                  <div className="grid gap-6">
                    {videos.map((video) => {
                      const embedUrl = getEmbedUrl(video.youtubeUrl);
                      if (!embedUrl) {
                        return null; // Skip rendering invalid videos
                      }
                      return (
                        <div
                          key={video.id}
                          className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">
                              {video.title}
                            </h3>
                            <div className="aspect-w-16 aspect-h-9 mt-2">
                              <iframe
                                src={embedUrl}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-64"
                              ></iframe>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDelete(video.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <Trash2 size={20} />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundary>
  );
}
