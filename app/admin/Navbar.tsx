"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Navbar() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setEmail(user.email || "")
  }

  return (
    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/40 backdrop-blur">

      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center">
          {email[0]?.toUpperCase()}
        </div>
        <span className="text-sm">{email}</span>
      </div>

    </div>
  )
}