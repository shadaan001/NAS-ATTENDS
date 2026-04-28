"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import SidebarNew from "@/components/dashboard/SidebarNew"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.replace("/login")
      return
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (error || !profile || profile.role !== "admin") {
      router.replace("/login")
      return
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking access...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F1A]">
      <SidebarNew />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}