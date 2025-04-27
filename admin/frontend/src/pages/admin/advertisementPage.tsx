// "use client";
// import { useState } from "react";
// import { AppSidebar } from "./components/Sidebar";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "../../components/ui/sidebar";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { ChevronLeft, Plus, Paperclip } from "lucide-react";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { storage, db } from "../../firebase"; // Adjust path as needed

// export default function AdvertisementPage() {
//   const [title, setTitle] = useState("");
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!title || !imageFile) {
//       alert("Please provide both title and image");
//       return;
//     }

//     setUploading(true);

//     try {
//       // 1. Upload image to Firebase Storage
//       const imageRef = ref(
//         storage,
//         `advertisements/${Date.now()}_${imageFile.name}`
//       );
//       await uploadBytes(imageRef, imageFile);
//       const downloadURL = await getDownloadURL(imageRef);

//       // 2. Save ad metadata to Firestore
//       await addDoc(collection(db, "advertisements"), {
//         title,
//         imageUrl: downloadURL,
//         createdAt: serverTimestamp(),
//       });

//       alert("Advertisement added!");
//       setTitle("");
//       setImagePreview(null);
//       setImageFile(null);
//     } catch (error) {
//       console.error("Error uploading ad:", error);
//       alert("Failed to upload ad");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset className="bg-main">
//         <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-4">
//             <SidebarTrigger className="text-[#1a3a54]" />
//             <ChevronLeft className="mr-1 h-5 w-5" />
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
//             <Button
//               onClick={handleSubmit}
//               disabled={uploading}
//               className="bg-[#4a96c9] hover:bg-[#3a86b9] text-white px-6 py-2 flex items-center gap-2"
//             >
//               <Plus size={20} />
//               {uploading ? "Uploading..." : "Add Posts"}
//             </Button>
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

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

export default function AdvertisementPage() {
  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
           
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
                    src={imagePreview || "/placeholder.svg"}
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
            <Button className="bg-[#4a96c9] hover:bg-[#3a86b9] text-white px-6 py-2 flex items-center gap-2">
              <Plus size={20} />
              Add Posts
            </Button>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
