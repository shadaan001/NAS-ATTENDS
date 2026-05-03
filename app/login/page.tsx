"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Users } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  async function handleLogin() {
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert("Invalid credentials ❌")
      setLoading(false)
      return
    }

    const user = data.user

    // 🔥 GET ROLE FROM PROFILES TABLE (FIXED)
    const { data: profile, error: roleError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (!profile || !profile.role) {
      alert("No role assigned ❌")
      setLoading(false)
      return
    }

    // 🔥 REDIRECT BASED ON ROLE
    if (profile.role === "admin") {
      router.push("/admin")
    } else if (profile.role === "teacher") {
      router.push("/dashboard")
    } else if (profile.role === "student") {
      router.push("/student")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(at_70%_60%,rgba(139,92,246,0.15),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-10">
          
          {/* Branding */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <Users className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              NAS Attendance
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Manage attendance smarter & faster
            </p>
          </div>

          {/* Role Selector (UI SAME) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-1 mb-8">
            <div className="flex">
              {["student", "teacher", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r as "student" | "teacher" | "admin")}
                  className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all capitalize ${
                    role === r
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-2xl pl-12 pr-5 py-4 text-white placeholder:text-gray-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-14 py-4 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white"
            >
              {loading ? "Logging in..." : `Login as ${role}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}