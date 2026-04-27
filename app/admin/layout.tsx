"use client"

import Navbar from "@/components/students/Navbar"
import Sidebar from "@/components/students/sidebar"
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">{children}</div>
      </div>

    </div>
  )
}