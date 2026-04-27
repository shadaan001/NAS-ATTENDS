"use client"

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const router = useRouter()

  async function logout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="w-64 h-screen bg-black/40 border-r border-white/10 flex flex-col justify-between">

      <div>
        <h2 className="p-4 text-lg font-bold">👑 Admin Panel</h2>

        <div className="px-3 space-y-2">

          <button onClick={() => router.push("/admin")} className="w-full text-left p-2 rounded hover:bg-white/10">
            Dashboard
          </button>

          <button onClick={() => router.push("/admin/students")} className="w-full text-left p-2 rounded hover:bg-white/10">
            Students
          </button>

          <button onClick={() => router.push("/admin/teachers")} className="w-full text-left p-2 rounded hover:bg-white/10">
            Teachers
          </button>

          <button onClick={() => router.push("/admin/classes")} className="w-full text-left p-2 rounded hover:bg-white/10">
            Classes
          </button>

          <button onClick={() => router.push("/admin/attendance")} className="w-full text-left p-2 rounded hover:bg-white/10">
            Attendance
          </button>

        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <button onClick={logout} className="w-full text-left text-red-400 hover:bg-red-500/10 p-2 rounded">
          Logout
        </button>
      </div>

    </div>
  )
}