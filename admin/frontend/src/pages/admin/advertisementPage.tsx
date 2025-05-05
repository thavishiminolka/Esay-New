// "use client";
// import { useState } from "react";
// import { AdminSidebar } from "./components/adminsidebar";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "../../components/ui/sidebar";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Plus, Paperclip } from "lucide-react";

// export default function AdvertisementPage() {
//   const [title, setTitle] = useState("");
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <SidebarProvider>
//       <AdminSidebar />
//       <SidebarInset className="bg-main">
//         <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-4">
//             <SidebarTrigger className="text-[#1a3a54]" />

//             <h1 className="text-3xl font-bold text-[#1a3a54]">
//               Advertisements
//             </h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-[#1a3a54]">Username</span>
//             <div className="h-10 w-10 rounded-full bg-gray-300" />
//           </div>
//         </header>
//         <main className="flex-1 p-6 overflow-auto">
//           <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
//             <div className="mb-6">
//               <div className="flex items-center gap-4">
//                 <label
//                   htmlFor="title"
//                   className="text-xl font-medium whitespace-nowrap"
//                 >
//                   Advertisement Title:
//                 </label>
//                 <Input
//                   id="title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="flex-1 border-gray-300"
//                 />
//               </div>
//             </div>

//             <div className="mb-6">
//               <div className="flex items-center gap-4 mb-4">
//                 <label className="text-xl font-medium">Add Post:</label>
//                 <label
//                   htmlFor="image-upload"
//                   className="w-10 h-10 bg-[#4a96c9] flex items-center justify-center rounded text-white cursor-pointer"
//                 >
//                   <Paperclip size={20} />
//                 </label>
//                 <input
//                   id="image-upload"
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleImageUpload}
//                 />
//               </div>

//               <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                 {imagePreview ? (
//                   <img
//                     src={imagePreview || "/placeholder.svg"}
//                     alt="Preview"
//                     className="max-w-full max-h-full object-contain"
//                   />
//                 ) : (
//                   <span className="text-gray-400">Image preview area</span>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-center mt-8">
//             <Button className="bg-[#4a96c9] hover:bg-[#3a86b9] text-white px-6 py-2 flex items-center gap-2">
//               <Plus size={20} />
//               Add Posts
//             </Button>
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

import { useState, useEffect } from "react";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronLeft, Plus, Paperclip, X, Trash2 } from "lucide-react";

type Notification = {
  id: string;
  type: "success" | "error";
  message: string;
};

type Advertisement = {
  id: string;
  title: string;
  imageUrl: string;
};

export default function AdvertisementPage() {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/advertisements");
      if (!response.ok) throw new Error("Failed to fetch advertisements");
      const data = await response.json();
      setAdvertisements(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch advertisements";
      console.error("Error fetching advertisements:", error);
      showNotification("error", errorMessage);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { id, type, message };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title || !imageFile) {
      showNotification("error", "Please provide both title and image");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", imageFile);

      const response = await fetch("http://localhost:5000/api/advertisements", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload advertisement");

      showNotification("success", "Advertisement uploaded successfully");
      setTitle("");
      setImageFile(null);
      setImagePreview(null);
      fetchAdvertisements();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload advertisement";
      console.error("Error uploading advertisement:", error);
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/advertisements/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete advertisement");
      }

      showNotification("success", "Advertisement deleted successfully");
      fetchAdvertisements();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete advertisement";
      console.error("Error deleting advertisement:", error);
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-md shadow-lg flex items-center justify-between ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span>{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <ChevronLeft className="mr-1 h-5 w-5" />
            <h1 className="text-3xl font-bold text-[#1a3a54]">
              Advertisements
            </h1>
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
                  Advertisement Title:
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
                <label className="text-xl font-medium">Add Post:</label>
                <label
                  htmlFor="image-upload"
                  className="w-10 h-10 bg-[#4a96c9] flex items-center justify-center rounded text-white cursor-pointer"
                >
                  <Paperclip size={20} />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">Image preview area</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              className="bg-[#4a96c9] hover:bg-[#3a86b9] text-white px-6 py-2 flex items-center gap-2"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                "Uploading..."
              ) : (
                <>
                  <Plus size={20} />
                  Add Advertisement
                </>
              )}
            </Button>
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Existing Advertisements</h2>
            <div className="grid gap-4">
              {advertisements.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
                >
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-24 h-24 object-cover rounded"
                    onError={(_e) =>
                      console.error(`Failed to load image: ${ad.imageUrl}`)
                    }
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{ad.title}</h3>
                  </div>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => handleDelete(ad.id)}
                    disabled={isLoading}
                    className="bg-[#4a96c9] "
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
