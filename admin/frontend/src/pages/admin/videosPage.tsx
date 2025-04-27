"use client";
import { useState } from "react";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronLeft, Plus, Paperclip } from "lucide-react";

export default function VideosPage() {
  const [title, setTitle] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [, setVideoFile] = useState<File | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);

      // Create a preview URL for the video
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <ChevronLeft className="mr-1 h-5 w-5" />
            <h1 className="text-3xl font-bold text-[#1a3a54]">Schedule Exam</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
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
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-xl font-medium">Add Video:</label>
                <label
                  htmlFor="video-upload"
                  className="w-10 h-10 bg-[#4a96c9] flex items-center justify-center rounded text-white cursor-pointer"
                >
                  <Paperclip size={20} />
                </label>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </div>

              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    className="max-w-full max-h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <span className="text-gray-400">Video preview area</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button className="bg-[#4a96c9] hover:bg-[#3a86b9] text-white px-6 py-2 flex items-center gap-2">
              <Plus size={20} />
              Add Video
            </Button>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
