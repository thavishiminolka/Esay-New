"use client"

import { ChevronLeft } from 'lucide-react'
import { Link } from "react-router-dom"
import { AppSidebar } from "./components/sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function MyResultsPage() {

    // Sample exam results data - all showing the same Korean listening test
//   const examResults = Array(9).fill({
//     paperNumber: "0001",
//     paperName: "Korean listening test",
//     marks: "87"
//   })
  // Sample exam results data - all showing the same data as in the screenshot
  const examResults = [
    { id: 1, paperNumber: "0001", paperName: "Korean listening test", marks: "87" },
    { id: 2, paperNumber: "0001", paperName: "Korean listening test", marks: "87" },
    { id: 3, paperNumber: "0001", paperName: "Korean listening test", marks: "87" },
    { id: 4, paperNumber: "0001", paperName: "Korean listening test", marks: "87" },
    { id: 5, paperNumber: "0001", paperName: "Korean listening test", marks: "87" },
    { id: 6, paperNumber: "0001", paperName: "Korean listening test", marks: "87" },
    { id: 7, paperNumber: "0001", paperName: "Korean listening test", marks: "87" },
    { id: 8, paperNumber: "0001", paperName: "Korean listening test", marks: "87" },
    { id: 9, paperNumber: "0001", paperName: "Korean listening test", marks: "87" },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main flex flex-col">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center ">
            <SidebarTrigger className="text-custom-blue2 " />

            <Link to="/profile" className="flex items-center text-custom-blue1">
              <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
            </Link>
            <h1 className="text-4xl ml-4 text-custom-blue1 jaini">
              My Result
            </h1>
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </Link>
          </div>
        </header>
        <main className="p-6 overflow-y-auto flex-1 mt-10 ml-10 mr-10 rounded-2xl bg-white">
          <div className="max-w-5xl mx-auto p-6">
            {/* Table header */}
            <div className="grid grid-cols-3 mb-2 px-4 font-semibold text-black ubuntu">
              <div className="text-center">Paper Number</div>
              <div className="text-center">Paper Name</div>
              <div className="text-center">Marks</div>
            </div>
            
            {/* Table rows with gaps */}
            <div className="space-y-2  text-black ubuntu">
              {examResults.map((result) => (
                <div 
                  key={result.id} 
                  className="grid grid-cols-3 bg-custom-blue5 rounded-md overflow-hidden"
                >
                  <div className="py-3 text-center">{result.paperNumber}</div>
                  <div className="py-3 text-center">{result.paperName}</div>
                  <div className="py-3 text-center">{result.marks}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}