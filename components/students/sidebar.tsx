"use client"

import { supabase } from "@/lib/supabase"

export default function Sidebar() {

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <div className="w-64 h-screen bg-black/40 border-r border-white/10 flex flex-col justify-between">

      {/* TOP */}
      <div>
        <h2 className="p-4 text-lg font-bold">🎓 Student Panel</h2>

        <div className="px-3 space-y-2">

          <button className="w-full text-left p-2 rounded hover:bg-white/10">
            Dashboard
          </button>

          <button className="w-full text-left p-2 rounded hover:bg-white/10">
            My Attendance
          </button>

          <button className="w-full text-left p-2 rounded hover:bg-white/10">
            Profile
          </button>

        </div>
      </div>

      {/* BOTTOM */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-400 hover:bg-red-500/10 p-2 rounded"
        >
          Logout
        </button>
      </div>

    </div>
  )
}