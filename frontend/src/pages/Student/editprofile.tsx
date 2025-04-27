"use client";

import type React from "react";

import { useState } from "react";
import { ChevronLeft, PenSquare, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { AppSidebar } from "./components/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1995-05-15",
    contactNumber: "+1234567890",
    email: "john.doe@example.com",
    address: "123 Main St, Anytown, USA",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    alert("Profile updated successfully!");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-gray-100 flex flex-col">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center ">
            <SidebarTrigger className="text-custom-blue2 " />

            <Link to="/profile" className="flex items-center text-custom-blue1">
              <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
            </Link>
            <h1 className="text-4xl ml-4 text-custom-blue1 jaini">
              Edit Profile
            </h1>
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </Link>
          </div>
        </header>
        <main className="p-6 overflow-y-auto flex-1  mt-10 ml-10 mr-10 rounded-2xl bg-white">
          <div className="max-w-5xl mx-auto bg-custom-blue5 rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center mb-8">
                <div className="h-32 w-32 rounded-full overflow-hidden mb-4 bg-gray-300 relative">
                  <img
                    src={
                      profileImage ||
                      "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg" ||
                      "/placeholder.svg"
                    }
                    alt="User profile"
                    className="h-full w-full object-cover"
                  />
                </div>

                <label
                  htmlFor="profile-image"
                  className="bg-white p-1.5 rounded-full shadow cursor-pointer"
                >
                  <Camera className="h-5 w-5 text-custom-blue1" />
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>

                <div className="text-center mb-6">
                  <p className="text-lg font-medium text-black ubuntu">
                    Student Id: 000023
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-lg font-medium  text-black ubuntu"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pr-10 h-12 border-2"
                    />
                    <PenSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-lg font-medium  text-black ubuntu"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="pr-10 h-12 border-2"
                    />
                    <PenSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-lg font-medium  text-black ubuntu"
                  >
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="pr-10 h-12 border-2"
                    />
                    <PenSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contactNumber"
                    className="block text-lg font-medium  text-black ubuntu"
                  >
                    Contact Number
                  </label>
                  <div className="relative">
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="pr-10 h-12 border-2"
                    />
                    <PenSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium  text-black ubuntu"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pr-10 h-12 border-2"
                    />
                    <PenSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-lg font-medium text-black ubuntu"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="pr-10 h-12 border-2"
                    />
                    <PenSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  type="submit"
                  className="bg-custom-blue2 hover:bg-[#2d4373] text-white ubuntu font-medium py-3 px-8 rounded w-64 text-lg"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
