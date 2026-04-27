"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.replace("/login")
      return
    }

    const role = user.user_metadata?.role

    if (role === "admin") {
      router.replace("/admin")
    } else if (role === "teacher") {
      router.replace("/dashboard")
    } else if (role === "student") {
      router.replace("/student")
    } else {
      router.replace("/login")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Loading...
    </div>
  )
}